'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WateringLog {
  id: number;
  watering_time: string;
  notes: string | null;
  amount_ml: number | null;
  duration_minutes: number | null;
  created_at: string;
}

export default function WateringPage() {
  const [logs, setLogs] = useState<WateringLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [notes, setNotes] = useState('');
  const [amountMl, setAmountMl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [customTime, setCustomTime] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watering?days=30');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setLogs(result.data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch logs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/watering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watering_time: customTime || undefined,
          notes: notes || undefined,
          amount_ml: amountMl ? parseInt(amountMl) : undefined,
          duration_minutes: durationMinutes ? parseInt(durationMinutes) : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to register watering');
      }

      // Reset form
      setNotes('');
      setAmountMl('');
      setDurationMinutes('');
      setCustomTime('');
      setShowForm(false);

      // Refresh logs
      await fetchLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error registering watering');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) {
      return;
    }

    try {
      const response = await fetch(`/api/watering?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete watering');
      }

      await fetchLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting watering entry');
    }
  };

  const quickWatering = async () => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/watering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Failed to register watering');
      }

      await fetchLogs();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error registering watering');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
        <h1>Watering Log</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to home
        </Link>
      </div>

      <h1>💧 Watering Log</h1>
      <p style={{ color: '#666' }}>Track when you water your plants</p>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Quick Action Button */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          onClick={quickWatering}
          disabled={submitting}
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: submitting ? 'not-allowed' : 'pointer',
            opacity: submitting ? 0.6 : 1
          }}
        >
          {submitting ? 'Registering...' : '✓ I watered now'}
        </button>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add with details'}
        </button>
      </div>

      {/* Detailed Form */}
      {showForm && (
        <form onSubmit={handleSubmit} style={{
          marginTop: '1.5rem',
          padding: '1.5rem',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Date and time (optional - defaults to now)
            </label>
            <input
              type="datetime-local"
              value={customTime}
              onChange={(e) => setCustomTime(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Amount (ml)
            </label>
            <input
              type="number"
              value={amountMl}
              onChange={(e) => setAmountMl(e.target.value)}
              placeholder="e.g., 500"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Duration (minutes)
            </label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder="e.g., 5"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px'
              }}
            />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Full watering of all plants"
              rows={3}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '14px',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: '10px 20px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1
            }}
          >
            {submitting ? 'Saving...' : 'Save Watering'}
          </button>
        </form>
      )}

      {/* History */}
      <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>History (last 30 days)</h2>

      {logs.length === 0 ? (
        <p style={{ color: '#666' }}>No watering entries yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((log) => (
            <div
              key={log.id}
              style={{
                padding: '1rem',
                backgroundColor: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '16px', marginBottom: '0.5rem' }}>
                  {new Date(log.watering_time).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                {log.notes && (
                  <div style={{ color: '#666', fontSize: '14px', marginBottom: '0.5rem' }}>
                    {log.notes}
                  </div>
                )}
                <div style={{ color: '#94a3b8', fontSize: '13px', display: 'flex', gap: '1rem' }}>
                  {log.amount_ml && <span>💧 {log.amount_ml} ml</span>}
                  {log.duration_minutes && <span>⏱️ {log.duration_minutes} min</span>}
                </div>
              </div>
              <button
                onClick={() => handleDelete(log.id)}
                style={{
                  padding: '6px 12px',
                  backgroundColor: '#fee',
                  color: '#dc2626',
                  border: '1px solid #fcc',
                  borderRadius: '4px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
