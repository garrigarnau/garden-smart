export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Garden Smart Backend</h1>
      <p>API Status: Running</p>
      <h2>Available Endpoints:</h2>
      <ul>
        <li>
          <code>POST /api/ingest</code> - Ingest sensor data from Ecowitt
        </li>
      </ul>
    </main>
  )
}
