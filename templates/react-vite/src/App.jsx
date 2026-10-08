export default function App() {
  return (
    <main className="app-shell">
      <section className="card">
        <p className="eyebrow">ScaffoldForge</p>
        <h1>{{appName}}</h1>
        <p className="subtitle">{{description}}</p>
        <ul>
          <li>React + Vite starter</li>
          <li>Ready for product development</li>
          <li>Designed for quick iteration</li>
        </ul>
      </section>
    </main>
  );
}
