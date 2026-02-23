export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main style={{ padding: 40, fontFamily: "system-ui" }}>
      <h1 style={{ fontSize: 36, fontWeight: 900 }}>IBlacker</h1>
      <p style={{ opacity: 0.7 }}>
        If you see this, the app is running. Check /api/health/error.
      </p>
      <ul style={{ lineHeight: 2, marginTop: 16 }}>
        <li><a href="/workspace">Workspace</a></li>
        <li><a href="/projects">Projects</a></li>
        <li><a href="/api/health">API Health</a></li>
        <li><a href="/api/health/error">DB Health</a></li>
      </ul>
    </main>
  );
}