-- Crear tabla para registrar riegos
CREATE TABLE IF NOT EXISTS watering_logs (
  id SERIAL PRIMARY KEY,
  watering_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  watering_type VARCHAR(20) NOT NULL DEFAULT 'average',  -- 'low', 'average', 'high'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_watering_logs_time ON watering_logs(watering_time DESC);

-- Comentarios para documentación
COMMENT ON TABLE watering_logs IS 'Log of when plants are watered';
COMMENT ON COLUMN watering_logs.watering_time IS 'Date and time of watering';
COMMENT ON COLUMN watering_logs.watering_type IS 'Type of watering: low, average, or high';

-- Si la tabla ya existe con las columnas antiguas, ejecuta esto:
-- ALTER TABLE watering_logs DROP COLUMN IF EXISTS notes;
-- ALTER TABLE watering_logs DROP COLUMN IF EXISTS amount_ml;
-- ALTER TABLE watering_logs DROP COLUMN IF EXISTS duration_minutes;
-- ALTER TABLE watering_logs ADD COLUMN IF NOT EXISTS watering_type VARCHAR(20) NOT NULL DEFAULT 'average';
