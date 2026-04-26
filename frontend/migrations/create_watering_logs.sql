-- Crear tabla para registrar riegos
CREATE TABLE IF NOT EXISTS watering_logs (
  id SERIAL PRIMARY KEY,
  watering_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  notes TEXT,
  amount_ml INTEGER,  -- Cantidad de agua en mililitros (opcional)
  duration_minutes INTEGER,  -- Duración del riego en minutos (opcional)
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índice para búsquedas por fecha
CREATE INDEX IF NOT EXISTS idx_watering_logs_time ON watering_logs(watering_time DESC);

-- Comentario para documentación
COMMENT ON TABLE watering_logs IS 'Registro de cuándo se riegan las plantas';
COMMENT ON COLUMN watering_logs.watering_time IS 'Fecha y hora del riego';
COMMENT ON COLUMN watering_logs.notes IS 'Notas adicionales sobre el riego';
COMMENT ON COLUMN watering_logs.amount_ml IS 'Cantidad de agua en mililitros';
COMMENT ON COLUMN watering_logs.duration_minutes IS 'Duración del riego en minutos';
