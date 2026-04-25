import { NextResponse } from 'next/server';
import { Pool } from '@/node_modules/@types/pg';

// Configuració de la connexió a Railway (usa la variable d'entorn DATABASE_URL)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: Request) {
  try {
    // 1. Parsejar les dades d'Ecowitt (venen com a text d'un formulari)
    const formData = await req.formData();
    const data = Object.fromEntries(formData.entries());

    // 2. Extreure els camps clau (ajusta els IDs segons els teus sensors)
    // Nota: 'soilmoisture1' és l'ID estàndard del WH51
    // 'tempinf' i 'humidityin' solen ser el WH31 o la base
    const soil_moisture = data.soilmoisture1 ? parseInt(data.soilmoisture1 as string) : null;
    const temp_air = data.tempinf ? parseFloat(data.tempinf as string) : null;
    const humidity_air = data.humidityin ? parseInt(data.humidityin as string) : null;
    const station_id = data.PASSKEY as string;

    if (soil_moisture === null) {
      return NextResponse.json({ error: 'No soil data received' }, { status: 400 });
    }

    // 3. Insertar a PostgreSQL
    const query = `
      INSERT INTO sensor_data (soil_moisture_raw, temp_air_c, humidity_air_pct, station_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const values = [soil_moisture, temp_air, humidity_air, station_id];
    
    const result = await pool.query(query, values);

    console.log('Dada guardada correctament:', result.rows[0]);

    return NextResponse.json({ status: 'success', data: result.rows[0] });

  } catch (error) {
    console.error('Error processant la dada:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}