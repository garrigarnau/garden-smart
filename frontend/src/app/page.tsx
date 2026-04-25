import Link from 'next/link';

export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Garden Smart Frontend</h1>
      <p>Monitor your garden sensor data in real-time.</p>

      <div style={{ marginTop: '2rem' }}>
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
          View Sensor Data Logs
        </Link>
      </div>

      <h2 style={{ marginTop: '3rem' }}>API Information:</h2>
      <p>The backend API is receiving data from Ecowitt sensors.</p>
    </main>
  )
}
