'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface WateringLog {
  id: number;
  watering_time: string;
  watering_type: 'low' | 'average' | 'high';
  created_at: string;
}

export default function WateringPage() {
  const [logs, setLogs] = useState<WateringLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  const handleWatering = async (type: 'low' | 'average' | 'high') => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/watering', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watering_type: type
        }),
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'low': return '#93c5fd';
      case 'average': return '#60a5fa';
      case 'high': return '#2563eb';
      default: return '#94a3b8';
    }
  };

  const getTypeEmoji = (type: string) => {
    switch (type) {
      case 'low': return '💧';
      case 'average': return '💦';
      case 'high': return '🌊';
      default: return '💧';
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

      {/* Quick Action Buttons */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Record Watering</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => handleWatering('low')}
            disabled={submitting}
            style={{
              padding: '16px 24px',
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              border: '2px solid #93c5fd',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              flex: '1',
              minWidth: '140px'
            }}
          >
            💧 Low
          </button>

          <button
            onClick={() => handleWatering('average')}
            disabled={submitting}
            style={{
              padding: '16px 24px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: '2px solid #2563eb',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              flex: '1',
              minWidth: '140px'
            }}
          >
            💦 Average
          </button>

          <button
            onClick={() => handleWatering('high')}
            disabled={submitting}
            style={{
              padding: '16px 24px',
              backgroundColor: '#1e40af',
              color: 'white',
              border: '2px solid #1e3a8a',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: submitting ? 'not-allowed' : 'pointer',
              opacity: submitting ? 0.6 : 1,
              flex: '1',
              minWidth: '140px'
            }}
          >
            🌊 High
          </button>
        </div>
      </div>

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
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', fontSize: '16px', marginBottom: '0.25rem' }}>
                  {new Date(log.watering_time).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              <div style={{
                padding: '6px 16px',
                backgroundColor: getTypeColor(log.watering_type),
                color: log.watering_type === 'low' ? '#1e40af' : 'white',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap'
              }}>
                {getTypeEmoji(log.watering_type)} {log.watering_type.toUpperCase()}
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
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
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
