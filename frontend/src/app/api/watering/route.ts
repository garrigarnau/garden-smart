import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET - Obtener historial de riegos
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const days = parseInt(searchParams.get('days') || '30');

    const query = `
      SELECT
        id,
        watering_time,
        watering_type,
        created_at
      FROM watering_logs
      WHERE watering_time >= NOW() - INTERVAL '${days} days'
      ORDER BY watering_time DESC
      LIMIT $1;
    `;

    const result = await pool.query(query, [limit]);

    return NextResponse.json({
      status: 'success',
      count: result.rows.length,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching watering logs:', error);
    return NextResponse.json({
      error: 'Failed to fetch watering logs',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Register new watering
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { watering_time, watering_type } = body;

    // Validate watering_type
    const validTypes = ['low', 'average', 'high'];
    const type = watering_type && validTypes.includes(watering_type) ? watering_type : 'average';

    const query = `
      INSERT INTO watering_logs (watering_time, watering_type)
      VALUES ($1, $2)
      RETURNING *;
    `;

    const wateringTime = watering_time ? new Date(watering_time) : new Date();
    const values = [wateringTime, type];

    const result = await pool.query(query, values);

    console.log('✅ Watering registered:', result.rows[0]);

    return NextResponse.json({
      status: 'success',
      message: 'Watering registered successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error registering watering:', error);
    return NextResponse.json({
      error: 'Failed to register watering',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// DELETE - Eliminar un riego
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({
        error: 'ID is required'
      }, { status: 400 });
    }

    const query = 'DELETE FROM watering_logs WHERE id = $1 RETURNING *;';
    const result = await pool.query(query, [parseInt(id)]);

    if (result.rows.length === 0) {
      return NextResponse.json({
        error: 'Watering log not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      status: 'success',
      message: 'Watering deleted successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error eliminando riego:', error);
    return NextResponse.json({
      error: 'Failed to delete watering',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
