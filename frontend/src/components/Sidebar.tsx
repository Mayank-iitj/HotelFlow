import Link from 'next/link';
import { LayoutDashboard, BedDouble, CalendarDays, Users, LogIn, ClipboardList, CreditCard, BarChart3, Settings, Shield } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Rooms', href: '/rooms', icon: BedDouble },
  { name: 'Bookings', href: '/bookings', icon: CalendarDays },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Check-In/Out', href: '/check-in', icon: LogIn },
  { name: 'Housekeeping', href: '/housekeeping', icon: ClipboardList },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Staff', href: '/staff', icon: Shield },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-white/5 backdrop-blur-xl border-white/10 transition-colors duration-300">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-600 text-white font-bold">
            H
          </div>
          <span className="text-xl font-bold tracking-tight text-white">HotelFlow</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-all"
              >
                <Icon className="mr-3 h-5 w-5 flex-shrink-0 text-white/50 group-hover:text-white/90 transition-colors" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-black/20 p-3 border border-white/5">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center">
            <Users className="h-5 w-5 text-white/70" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">Admin User</p>
            <p className="text-xs text-white/50">admin@hotelflow.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
