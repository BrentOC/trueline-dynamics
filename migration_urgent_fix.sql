-- EMERGENCY FIX
-- Run this ONLY if you accidentally ran migration_final_polish.sql twice.
-- This divides all prices by 100 to reverse the extra multiplication.

BEGIN;

UPDATE products 
SET price = price / 100;

COMMIT;
