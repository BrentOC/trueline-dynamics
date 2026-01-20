-- 6. Atomic Fulfill Order RPC
-- This function handles everything in ONE transaction: Check -> Decrement -> Insert
CREATE OR REPLACE FUNCTION fulfill_order(
  p_payment_ref TEXT,
  p_user_id UUID,
  p_user_email TEXT,
  p_amount NUMERIC,
  p_items JSONB
) RETURNS JSONB AS $$
DECLARE
  v_order_id BIGINT;
  v_item JSONB;
  v_product_id BIGINT;
  v_quantity INTEGER;
  v_item_price NUMERIC;
BEGIN
  -- A. Idempotency Check
  IF EXISTS (SELECT 1 FROM orders WHERE payment_ref = p_payment_ref) THEN
    RETURN jsonb_build_object('status', 'ALREADY_EXISTS');
  END IF;

  -- B. Create Order
  INSERT INTO orders (user_id, user_email, amount, payment_ref, status)
  VALUES (p_user_id, p_user_email, p_amount, p_payment_ref, 'paid')
  RETURNING id INTO v_order_id;

  -- C. Process Items (Decrement & Insert)
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'id')::BIGINT;
    v_quantity := (v_item->>'quantity')::INTEGER;
    v_item_price := (v_item->>'price')::NUMERIC;

    -- Decrement Stock (Will fail if violates CHECK constraint stock >= 0)
    -- This helps catch race conditions right here
    UPDATE products 
    SET stock_count = stock_count - v_quantity
    WHERE id = v_product_id;
    
    -- Insert Order Item
    INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
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
$$ LANGUAGE plpgsql;

-- 7. Cart Merging RPC
-- Merges a list of items into the user's cart, adding quantities if item exists
CREATE OR REPLACE FUNCTION merge_carts(
  p_items JSONB
) RETURNS VOID AS $$
DECLARE
  v_item JSONB;
  v_product_id BIGINT;
  v_quantity INTEGER;
BEGIN
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'id')::BIGINT;
    v_quantity := (v_item->>'quantity')::INTEGER;

    INSERT INTO cart_items (user_id, product_id, quantity)
    VALUES (auth.uid(), v_product_id, v_quantity)
    ON CONFLICT (user_id, product_id)
    DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
  END LOOP;
END;
$$ LANGUAGE plpgsql;
