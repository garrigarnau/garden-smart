'use client';

import { useEffect, useState } from 'react';

interface SensorData {
  id: number;
  soil_moisture_raw: number | null;
  temp_air_c: number | null;
  humidity_air_pct: number | null;
  station_id: string | null;
  raw_data: string | null;
  timestamp: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<SensorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();

    // Auto-refresh every 10 seconds
    const interval = setInterval(() => fetchLogs(), 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/logs?limit=50');

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

  if (loading) {
    return (
      <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <h1>Sensor Data Logs</h1>
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'monospace', maxWidth: '1400px', margin: '0 auto' }}>
      <h1 style={{ fontFamily: 'system-ui' }}>Raw Ecowitt Data</h1>
      <p style={{ color: '#666', marginBottom: '1rem', fontFamily: 'system-ui' }}>
        Auto-refresh: 10s | Total records: {logs.length}
      </p>

      {error && (
        <div style={{
          padding: '1rem',
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: '4px',
          marginBottom: '1rem',
          fontFamily: 'system-ui'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {logs.length === 0 ? (
        <p style={{ fontFamily: 'system-ui' }}>No data received from Ecowitt yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((log) => {
            let rawData: any = {};
            try {
              rawData = log.raw_data ? JSON.parse(log.raw_data) : {};
            } catch (e) {
              rawData = { error: 'Failed to parse raw data' };
            }

            return (
              <div key={log.id} style={{
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '6px',
                padding: '1rem',
                fontSize: '14px'
              }}>
                <div style={{
                  fontFamily: 'system-ui',
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
                  fontSize: '16px',
                  color: '#333'
                }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <pre style={{
                  margin: 0,
                  padding: '1rem',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word'
                }}>
                  {JSON.stringify(rawData, null, 2)}
                </pre>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
