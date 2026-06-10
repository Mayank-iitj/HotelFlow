import { Bell, Search } from 'lucide-react';

export default function TopNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-md px-6 transition-colors duration-300">
      <div className="flex flex-1 items-center gap-4">
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-white/40" />
          </div>
          <input
            type="text"
            className="block w-full rounded-full border border-white/10 bg-black/20 py-1.5 pl-10 pr-3 text-white placeholder:text-white/40 focus:border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 sm:text-sm sm:leading-6 transition-all"
            placeholder="Search bookings, guests, or rooms..."
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-white/50 hover:bg-white/10 hover:text-white transition-all">
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
