# Database Migrations

## Migrations to Run

### 1. Add raw_data column (if not already done)
```sql
ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS raw_data JSONB;
CREATE INDEX IF NOT EXISTS idx_sensor_data_raw_data ON sensor_data USING gin(raw_data);
```

### 2. Create watering_logs table
```sql
CREATE TABLE IF NOT EXISTS watering_logs (
  id SERIAL PRIMARY KEY,
  watering_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  amount_ml INTEGER,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_watering_logs_time ON watering_logs(watering_time DESC);
```

## How to Run

### Using Railway Dashboard (PostgreSQL plugin)

1. Go to your Railway project
2. Click on your PostgreSQL database
3. Go to the **Query** tab
4. Copy and paste the SQL above
5. Click **Execute**

### Using Railway CLI

```bash
# Install Railway CLI if needed
npm i -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migration
railway run psql $DATABASE_URL -f migrations/create_watering_logs.sql
```

### Using local psql

```bash
psql "postgresql://user:password@host:port/database" -f migrations/create_watering_logs.sql
```
