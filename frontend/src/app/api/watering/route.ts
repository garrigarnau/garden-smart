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
        notes,
        amount_ml,
        duration_minutes,
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

// POST - Registrar nuevo riego
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { watering_time, notes, amount_ml, duration_minutes } = body;

    const query = `
      INSERT INTO watering_logs (watering_time, notes, amount_ml, duration_minutes)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const wateringTime = watering_time ? new Date(watering_time) : new Date();
    const values = [
      wateringTime,
      notes || null,
      amount_ml || null,
      duration_minutes || null
    ];

    const result = await pool.query(query, values);

    console.log('✅ Riego registrado:', result.rows[0]);

    return NextResponse.json({
      status: 'success',
      message: 'Riego registrado correctamente',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('❌ Error registrando riego:', error);
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
      message: 'Riego eliminado correctamente',
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
