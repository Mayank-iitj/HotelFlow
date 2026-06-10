"use client";

import { useState, useEffect } from 'react';
import { BedDouble, Users, CreditCard, LogOut, PlusCircle, ArrowUpRight, LogIn, ClipboardList } from 'lucide-react';
import { RevenueChart, OccupancyChart } from '@/components/DashboardCharts';
import Link from 'next/link';
import { API_URL } from '@/utils/api';

export default function Dashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/dashboard`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to fetch dashboard statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/50">
        <p className="text-lg">Loading dashboard overview...</p>
      </div>
    );
  }

  // Fallback structures if API load fails or data is missing
  const stats = data?.stats || { totalRooms: 0, occupiedRooms: 0, revenueToday: 0, pendingCheckouts: 0 };
  const recentActivities = data?.recentActivities || [];
  const monthlyRevenue = data?.monthlyRevenue || [];
  const occupancyRate = data?.occupancyRate || [];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-1">Dashboard Overview</h1>
          <p className="text-white/60">Welcome back, here's what's happening at HotelFlow today.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/bookings" className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            <PlusCircle className="mr-2 h-4 w-4" />
            Bookings Panel
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Rooms" value={stats.totalRooms.toString()} icon={BedDouble} />
        <StatCard title="Occupied Rooms" value={stats.occupiedRooms.toString()} icon={Users} />
        <StatCard title="Revenue Today" value={`$${stats.revenueToday.toLocaleString()}`} icon={CreditCard} />
        <StatCard title="Pending Check-outs" value={stats.pendingCheckouts.toString()} icon={LogOut} />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Revenue Chart */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl lg:col-span-4 transition-all hover:border-white/20">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Monthly Revenue</h3>
            <p className="text-sm text-white/50">Revenue growth over the last 6 months</p>
          </div>
          <RevenueChart data={monthlyRevenue} />
        </div>

        {/* Occupancy Chart */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl lg:col-span-3 transition-all hover:border-white/20">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Occupancy Rate</h3>
            <p className="text-sm text-white/50">Weekly occupancy trends</p>
          </div>
          <OccupancyChart data={occupancyRate} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activities */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">Recent Activities</h3>
              <p className="text-sm text-white/50">Latest actions across the hotel</p>
            </div>
          </div>
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="py-8 text-center text-white/30 text-sm">
                No recent activity. Actions you perform will display here.
              </div>
            ) : (
              recentActivities.map((act: any) => {
                let Icon = ClipboardList;
                let color = "text-purple-400";
                let bg = "bg-purple-500/10 border border-purple-500/20";
                
                if (act.type === 'booking') {
                  Icon = PlusCircle;
                  color = "text-blue-400";
                  bg = "bg-blue-500/10 border border-blue-500/20";
                } else if (act.type === 'payment') {
                  Icon = CreditCard;
                  color = "text-green-400";
                  bg = "bg-green-500/10 border border-green-500/20";
                } else if (act.type === 'housekeeping') {
                  Icon = ClipboardList;
                  color = "text-yellow-400";
                  bg = "bg-yellow-500/10 border border-yellow-500/20";
                }
                
                const timeString = new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return (
                  <ActivityItem 
                    key={act.id} 
                    title={act.title} 
                    desc={act.desc} 
                    time={timeString} 
                    icon={Icon} 
                    color={color} 
                    bg={bg} 
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white">Quick Actions</h3>
            <p className="text-sm text-white/50">Common tasks and operations</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <QuickActionCard title="Check In Guest" icon={LogIn} href="/check-in" />
            <QuickActionCard title="Check Out Guest" icon={LogOut} href="/check-in" />
            <QuickActionCard title="Manage Rooms" icon={BedDouble} href="/rooms" />
            <QuickActionCard title="Housekeeping Duties" icon={ClipboardList} href="/housekeeping" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: any) {
  return (
    <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl transition-all hover:border-blue-500/30 group">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-white/50">{title}</h3>
        <Icon className="h-4 w-4 text-white/40 group-hover:text-blue-400 transition-colors" />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}

function ActivityItem({ title, desc, time, icon: Icon, color, bg }: any) {
  return (
    <div className="flex items-start gap-4">
      <div className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${bg}`}>
        <Icon className={`h-4 w-4 ${color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{title}</p>
        <p className="text-sm text-white/50 truncate">{desc}</p>
      </div>
      <div className="text-xs text-white/40">{time}</div>
    </div>
  );
}

function QuickActionCard({ title, icon: Icon, href }: any) {
  return (
    <Link href={href} className="flex flex-col items-center justify-center gap-3 rounded-xl border border-white/5 bg-white/5 p-6 text-center hover:bg-white/10 hover:border-purple-500/20 transition-all group">
      <Icon className="h-7 w-7 text-white/40 group-hover:text-purple-400 transition-colors" />
      <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{title}</span>
    </Link>
  );
}
