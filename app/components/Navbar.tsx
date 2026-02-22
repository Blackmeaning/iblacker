export default function Navbar() {
  return (
    <header className="w-full border-b border-gray-900 bg-black">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="/dashboard" className="font-bold text-white">
          IBlacker
        </a>

        <nav className="flex gap-4 text-gray-300">
          <a className="hover:text-white" href="/workspace">Workspace</a>
          <a className="hover:text-white" href="/projects">Projects</a>
          <a className="hover:text-white" href="/settings">Settings</a>
        </nav>
      </div>
    </header>
  );
}