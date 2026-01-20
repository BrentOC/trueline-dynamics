-- 5. Add Safety Check Constraint to prevent negative stock
-- This ensures that a race condition cannot sell more items than exist
ALTER TABLE products
ADD CONSTRAINT stock_not_negative CHECK (stock_count >= 0);
