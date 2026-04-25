# Database Migrations

## Run Migration

Connect to your Railway PostgreSQL database and run:

```sql
-- Add raw_data column to store the complete incoming data from Ecowitt
ALTER TABLE sensor_data
ADD COLUMN IF NOT EXISTS raw_data JSONB;

-- Add an index for querying raw data
CREATE INDEX IF NOT EXISTS idx_sensor_data_raw_data ON sensor_data USING gin(raw_data);
```

Or using Railway CLI:
```bash
railway run psql $DATABASE_URL -f migrations/add_raw_data_column.sql
```
