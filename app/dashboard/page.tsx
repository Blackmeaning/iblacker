export default function Dashboard() {
  return (
    <main className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-6">IBlacker Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a href="/workspace" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold mb-2">Creative Workspace</h2>
          <p className="text-gray-400">Design. Generate. Build.</p>
        </a>

        <a href="/projects" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold mb-2">Projects</h2>
          <p className="text-gray-400">Your generated work.</p>
        </a>

        <a href="/settings" className="bg-gray-900 p-6 rounded-lg hover:bg-gray-800 transition">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-400">Account and integrations.</p>
        </a>
      </div>
    </main>
  );
}
