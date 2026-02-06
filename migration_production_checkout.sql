-- Production Checkout System - Database Schema Updates
-- Run this in your Supabase SQL Editor

-- ============================================
-- 1. CREATE ADDRESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS api.addresses (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    label TEXT DEFAULT 'Home', -- e.g., "Home", "Work", "Office"
    full_address TEXT NOT NULL, -- Full formatted address from Google
    street TEXT,
    city TEXT,
    province TEXT NOT NULL DEFAULT 'Gauteng',
    postal_code TEXT,
    lat DECIMAL(10, 8),
    lng DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON api.addresses(user_id);

-- ============================================
-- 2. ADD SHIPPING ADDRESS TO ORDERS
-- ============================================
ALTER TABLE api.orders 
ADD COLUMN IF NOT EXISTS shipping_address JSONB;

ALTER TABLE api.orders 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- ============================================
-- 3. RLS POLICIES FOR ADDRESSES
-- ============================================
ALTER TABLE api.addresses ENABLE ROW LEVEL SECURITY;

-- Users can view their own addresses
DROP POLICY IF EXISTS "Users can view own addresses" ON api.addresses;
CREATE POLICY "Users can view own addresses" 
ON api.addresses FOR SELECT 
USING (auth.uid() = user_id);

-- Users can insert their own addresses
DROP POLICY IF EXISTS "Users can insert own addresses" ON api.addresses;
CREATE POLICY "Users can insert own addresses" 
ON api.addresses FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Users can update their own addresses
DROP POLICY IF EXISTS "Users can update own addresses" ON api.addresses;
CREATE POLICY "Users can update own addresses" 
ON api.addresses FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can delete their own addresses
DROP POLICY IF EXISTS "Users can delete own addresses" ON api.addresses;
CREATE POLICY "Users can delete own addresses" 
ON api.addresses FOR DELETE 
USING (auth.uid() = user_id);

-- ============================================
-- 4. UPDATE FULFILL_ORDER RPC
-- ============================================
CREATE OR REPLACE FUNCTION fulfill_order(
  p_payment_ref TEXT,
  p_user_id UUID,
  p_user_email TEXT,
  p_amount NUMERIC,
  p_items JSONB,
  p_shipping_address JSONB DEFAULT NULL
) RETURNS JSONB AS $$
DECLARE
  v_order_id BIGINT;
  v_item JSONB;
  v_product_id BIGINT;
  v_quantity INTEGER;
  v_item_price NUMERIC;
BEGIN
  -- A. Idempotency Check
  IF EXISTS (SELECT 1 FROM api.orders WHERE payment_ref = p_payment_ref) THEN
    RETURN jsonb_build_object('status', 'ALREADY_EXISTS');
  END IF;

  -- B. Create Order (now with shipping_address)
  INSERT INTO api.orders (user_id, user_email, amount, payment_ref, status, shipping_address)
  VALUES (p_user_id, p_user_email, p_amount, p_payment_ref, 'paid', p_shipping_address)
  RETURNING id INTO v_order_id;

  -- C. Process Items (Decrement & Insert)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'id')::BIGINT;
    v_quantity := (v_item->>'quantity')::INTEGER;
    v_item_price := (v_item->>'price')::NUMERIC;

    -- Decrement Stock (Will fail if violates CHECK constraint stock >= 0)
    UPDATE api.products 
    SET stock_count = stock_count - v_quantity
    WHERE id = v_product_id;
    
    -- Insert Order Item
    INSERT INTO api.order_items (order_id, product_id, product_name, quantity, price)
    VALUES (v_order_id, v_product_id, v_item->>'name', v_quantity, v_item_price);
  END LOOP;

  RETURN jsonb_build_object('status', 'SUCCESS', 'order_id', v_order_id);

EXCEPTION WHEN OTHERS THEN
  -- Check for negative stock violation
  IF SQLERRM LIKE '%stock_not_negative%' THEN
     RETURN jsonb_build_object('status', 'OVERSOLD', 'error', SQLERRM);
  END IF;
  RAISE; -- Re-raise other errors
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute to authenticated users (via service role in webhook)
GRANT EXECUTE ON FUNCTION fulfill_order TO service_role;

-- ============================================
-- 5. TRIGGER TO UPDATE updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS orders_updated_at ON api.orders;
CREATE TRIGGER orders_updated_at
    BEFORE UPDATE ON api.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS addresses_updated_at ON api.addresses;
CREATE TRIGGER addresses_updated_at
    BEFORE UPDATE ON api.addresses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. HELPER: Set Default Address (only one)
-- ============================================
CREATE OR REPLACE FUNCTION set_default_address(p_address_id BIGINT)
RETURNS VOID AS $$
BEGIN
    -- First, unset all defaults for this user
    UPDATE api.addresses 
    SET is_default = FALSE 
    WHERE user_id = auth.uid();
    
    -- Then set the new default
    UPDATE api.addresses 
    SET is_default = TRUE 
    WHERE id = p_address_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION set_default_address TO authenticated;
