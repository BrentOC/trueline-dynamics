-- 8. Financial Precision: Convert Prices to Cent Integers
-- WARNING: This modifies data. Ensure backup.
BEGIN;

-- Convert float price to integer cents
UPDATE products 
SET price = price * 100;

-- Change column type
ALTER TABLE products 
ALTER COLUMN price TYPE INTEGER USING price::INTEGER;

COMMIT;

-- 9. Atomic Cart Increment RPC
-- Prevents race conditions when user clicks "Add" rapidly
CREATE OR REPLACE FUNCTION increment_cart_item(
  p_product_id BIGINT,
  p_quantity INTEGER
) RETURNS VOID AS $$
BEGIN
  INSERT INTO cart_items (user_id, product_id, quantity)
  VALUES (auth.uid(), p_product_id, p_quantity)
  ON CONFLICT (user_id, product_id)
  DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
END;
$$ LANGUAGE plpgsql;
