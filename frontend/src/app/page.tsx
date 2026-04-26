'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface LatestData {
  id: number;
  raw_data: any;
  timestamp: string;
}

export default function Home() {
  const [status, setStatus] = useState<'checking' | 'receiving' | 'no-data' | 'error'>('checking');
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [timeSinceLastData, setTimeSinceLastData] = useState<string>('');

  useEffect(() => {
    checkStatus();
    const interval = setInterval(() => {
      checkStatus();
      updateTimeSince();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateTimeSince();
    const interval = setInterval(updateTimeSince, 1000);
    return () => clearInterval(interval);
  }, [latestData]);

  const checkStatus = async () => {
    try {
      const response = await fetch('/api/logs?limit=1');
      if (!response.ok) throw new Error('API error');

      const result = await response.json();
      if (result.data && result.data.length > 0) {
        const latest = result.data[0];
        setLatestData(latest);

        const lastDataTime = new Date(latest.timestamp).getTime();
        const now = Date.now();
        const diff = now - lastDataTime;

        // If data is less than 5 minutes old, consider it active
        if (diff < 5 * 60 * 1000) {
          setStatus('receiving');
        } else {
          setStatus('no-data');
        }
      } else {
        setStatus('no-data');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const updateTimeSince = () => {
    if (!latestData) return;

    const lastDataTime = new Date(latestData.timestamp).getTime();
    const now = Date.now();
    const diff = Math.floor((now - lastDataTime) / 1000);

    if (diff < 60) {
      setTimeSinceLastData(`${diff} seconds ago`);
    } else if (diff < 3600) {
      setTimeSinceLastData(`${Math.floor(diff / 60)} minutes ago`);
    } else {
      setTimeSinceLastData(`${Math.floor(diff / 3600)} hours ago`);
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'receiving': return '#22c55e';
      case 'no-data': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'receiving': return '● Connected - Receiving Data';
      case 'no-data': return '○ No Recent Data';
      case 'error': return '○ Connection Error';
      default: return '○ Checking...';
    }
  };

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Garden Smart</h1>
      <p style={{ color: '#666' }}>Monitor your garden sensor data in real-time</p>

      {/* Status Indicator */}
      <div style={{
        marginTop: '2rem',
        padding: '1.5rem',
        backgroundColor: '#f8fafc',
        border: '2px solid #e2e8f0',
        borderRadius: '8px'
      }}>
        <div style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          color: getStatusColor(),
          marginBottom: '0.5rem'
        }}>
          {getStatusText()}
        </div>

        {latestData && (
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            <div>Last data received: {timeSinceLastData}</div>
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#94a3b8' }}>
              {new Date(latestData.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {status === 'no-data' && !latestData && (
          <div style={{ color: '#666', fontSize: '0.9rem' }}>
            No data received yet. Make sure Ecowitt is configured to send data to:
            <code style={{
              display: 'block',
              marginTop: '0.5rem',
              padding: '0.5rem',
              backgroundColor: '#fff',
              borderRadius: '4px',
              fontSize: '0.85rem'
            }}>
              {typeof window !== 'undefined' ? window.location.origin : ''}/api/ingest
            </code>
          </div>
        )}
      </div>

      {/* Latest Data Preview */}
      {latestData && (
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px'
        }}>
          <h3 style={{ margin: '0 0 0.75rem 0', fontSize: '1rem' }}>Latest Data Preview:</h3>
          <pre style={{
            margin: 0,
            padding: '1rem',
            backgroundColor: '#f8fafc',
            borderRadius: '4px',
            fontSize: '0.85rem',
            overflow: 'auto',
            maxHeight: '200px'
          }}>
            {JSON.stringify(latestData.raw_data, null, 2)}
          </pre>
        </div>
      )}

      {/* Navigation Buttons */}
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          href="/logs"
          style={{
            padding: '12px 24px',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
            fontWeight: '500'
          }}
        >
          📊 Sensor Data Logs
        </Link>
        <Link
          href="/watering"
          style={{
            padding: '12px 24px',
            backgroundColor: '#10b981',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            display: 'inline-block',
            fontWeight: '500'
          }}
        >
          💧 Watering Log
        </Link>
      </div>

      {/* API Information */}
      <div style={{
        marginTop: '3rem',
        padding: '1rem',
        backgroundColor: '#fefce8',
        border: '1px solid #fef08a',
        borderRadius: '6px',
        fontSize: '0.9rem'
      }}>
        <strong>📡 Configure Ecowitt:</strong>
        <div style={{ marginTop: '0.5rem' }}>
          Set your Ecowitt device to POST data to:
          <code style={{
            display: 'block',
            marginTop: '0.5rem',
            padding: '0.5rem',
            backgroundColor: '#fff',
            borderRadius: '4px'
          }}>
            POST {typeof window !== 'undefined' ? window.location.origin : ''}/api/ingest
          </code>
        </div>
      </div>
    </main>
  );
}
