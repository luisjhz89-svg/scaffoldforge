export default function App() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '48px', background: '#0f172a', color: '#e2e8f0', minHeight: '100vh' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <h1>{{appName}}</h1>
        <p>{{description}}</p>
        <ul>
          <li>Fullstack Node + React starter</li>
          <li>API route at /api/health</li>
          <li>React client ready for UI development</li>
        </ul>
      </div>
    </main>
  );
}
