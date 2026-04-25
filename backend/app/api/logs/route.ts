import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const query = `
      SELECT
        id,
        soil_moisture_raw,
        temp_air_c,
        humidity_air_pct,
        station_id,
        raw_data,
        timestamp
      FROM sensor_data
      ORDER BY timestamp DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);

    return NextResponse.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching sensor data:', error);
    return NextResponse.json({
      error: 'Failed to fetch sensor data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
