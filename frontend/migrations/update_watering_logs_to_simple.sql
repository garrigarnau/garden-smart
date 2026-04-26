-- Migration to simplify watering_logs table
-- Run this if you already have the old table structure

-- Remove old columns
ALTER TABLE watering_logs DROP COLUMN IF EXISTS notes;
ALTER TABLE watering_logs DROP COLUMN IF EXISTS amount_ml;
ALTER TABLE watering_logs DROP COLUMN IF EXISTS duration_minutes;

-- Add new watering_type column
ALTER TABLE watering_logs ADD COLUMN IF NOT EXISTS watering_type VARCHAR(20) NOT NULL DEFAULT 'average';

-- Verify changes
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'watering_logs'
ORDER BY ordinal_position;
