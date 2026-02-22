export default function Workspace() {
  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">Creative Workspace</h1>
        <p className="text-gray-400 mb-8">
          Tell IBlacker what you want. It will generate a plan + outputs.
        </p>

        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
          <label className="block text-sm text-gray-300 mb-2">
            AI Command
          </label>

          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="w-full bg-black border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-gray-600"
              placeholder='Example: "Create a SaaS landing page for a fitness app"'
            />

            <select className="bg-black border border-gray-800 rounded-lg px-4 py-3 text-white">
              <option>App</option>
              <option>Design</option>
              <option>Video</option>
              <option>Music</option>
              <option>Marketing</option>
            </select>

            <button className="bg-white text-black font-semibold rounded-lg px-6 py-3 hover:bg-gray-200 transition">
              Generate
            </button>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            Output will appear here next (Step 11: API + job system).
          </div>
        </div>
      </div>
    </main>
  );
}