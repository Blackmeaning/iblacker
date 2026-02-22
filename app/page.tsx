export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6">IBlacker</h1>

      <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-10">
        The AI Creative & Product OS. Build apps, designs, videos, and campaigns in one place.
      </p>

      <a
        href="/dashboard"
        className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
      >
        Enter IBlacker
      </a>
    </main>
  );
}