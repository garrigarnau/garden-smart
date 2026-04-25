import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Configuració de la connexió a Railway (usa la variable d'entorn DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    // 1. Parsejar les dades d'Ecowitt (venen com a text d'un formulari)
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('🌱 Dades rebudes d\'Ecowitt:', JSON.stringify(data, null, 2));

    // 2. Extreure els camps clau (ajusta els IDs segons els teus sensors)
    // Nota: 'soilmoisture1' és l'ID estàndard del WH51
    // 'tempinf' i 'humidityin' solen ser el ::WH31 o la base
    const soil_moisture = data.soilmoisture1 ? parseInt(data.soilmoisture1 as string) : null;
    const temp_air = data.tempinf ? parseFloat(data.tempinf as string) : null;
    const humidity_air = data.humidityin ? parseInt(data.humidityin as string) : null;
    const station_id = data.PASSKEY as string;

    // Acceptar dades si almenys un sensor té informació
    if (soil_moisture === null && temp_air === null && humidity_air === null) {
      console.warn('❌ Cap dada de sensor rebuda');
      return NextResponse.json({
        error: 'No sensor data received',
        received: data
      }, { status: 400 });
    }

    // 3. Insertar a PostgreSQL amb les dades raw completes
    const query = `
      INSERT INTO sensor_data (soil_moisture_raw, temp_air_c, humidity_air_pct, station_id, raw_data)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
    const values = [soil_moisture, temp_air, humidity_air, station_id, JSON.stringify(data)];

    const result = await pool.query(query, values);

    console.log('✅ Dada guardada correctament:', result.rows[0].id);

    return NextResponse.json({
      status: 'success',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error processant la dada:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}