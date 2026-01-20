-- 1. Add Stock Count Column
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS stock_count INTEGER DEFAULT 0;

-- 2. Create RPC function for safe atomic decrement
CREATE OR REPLACE FUNCTION decrement_stock(row_id BIGINT, quantity INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_count = stock_count - quantity
  WHERE id = row_id;
END;
$$ LANGUAGE plpgsql;

-- 3. Create Cart Items Table for Persistence
CREATE TABLE IF NOT EXISTS cart_items (
  user_id UUID REFERENCES auth.users NOT NULL,
  product_id BIGINT REFERENCES products(id) NOT NULL,
  quantity INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, product_id)
);

-- 4. Set RLS Policies (Recommended for security)
alter table cart_items enable row level security;
create policy "Users can only see their own cart" on cart_items for all using (auth.uid() = user_id);
