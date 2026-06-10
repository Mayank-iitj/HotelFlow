"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, CreditCard, Loader2, Printer } from "lucide-react";
import { RevenueChart, OccupancyChart } from "@/components/DashboardCharts";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/dashboard");
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center text-white/50">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500 mr-2" />
        <p className="text-lg">Loading analytics & reports...</p>
      </div>
    );
  }

  const stats = data?.stats || { totalRooms: 0, occupiedRooms: 0, revenueToday: 0, pendingCheckouts: 0 };
  const monthlyRevenue = data?.monthlyRevenue || [];
  const occupancyRate = data?.occupancyRate || [];
  const recentActivities = data?.recentActivities || [];

  const occupancyPercent = stats.totalRooms > 0 
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100) 
    : 70; // Fallback occupancy rate

  return (
    <div className="space-y-6 print:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Reports & Analytics</h1>
          <p className="text-white/60">Generate hotel financial reports, occupancy rates, and business forecasts.</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 border border-white/10 hover:bg-white/5 text-white rounded-lg font-medium transition-colors text-sm"
        >
          <Printer className="w-4 h-4" />
          Print / Save PDF
        </button>
      </div>

      {/* Printable Header */}
      <div className="hidden print:block border-b border-slate-200 pb-4 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">HotelFlow Executive Report</h1>
        <p className="text-slate-500 text-sm mt-1">Generated on {new Date().toLocaleDateString()} &bull; Operational Summary</p>
      </div>

      {/* Analytics Highlights */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:border-slate-200 print:bg-slate-50 print:text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50 print:text-slate-500">Revenue (Today)</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 print:text-slate-900">${stats.revenueToday.toLocaleString()}</p>
          <p className="text-xs text-white/40 mt-1 print:text-slate-400">Total settled payments today</p>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:border-slate-200 print:bg-slate-50 print:text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50 print:text-slate-500">Current Occupancy</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 print:text-slate-900">{occupancyPercent}%</p>
          <p className="text-xs text-white/40 mt-1 print:text-slate-400">
            {stats.occupiedRooms} of {stats.totalRooms} rooms occupied
          </p>
        </div>

        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:border-slate-200 print:bg-slate-50 print:text-slate-900">
          <div className="flex items-center justify-between">
            <span className="text-sm text-white/50 print:text-slate-500">Active Checked-In Stays</span>
            <Calendar className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mt-2 print:text-slate-900">{stats.occupiedRooms}</p>
          <p className="text-xs text-white/40 mt-1 print:text-slate-400">Guests in-house right now</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:shadow-none print:border-slate-200">
          <h3 className="text-lg font-medium text-white mb-4 print:text-slate-900">Revenue (6 Month Period)</h3>
          <RevenueChart data={monthlyRevenue} />
        </div>
        
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:shadow-none print:border-slate-200">
          <h3 className="text-lg font-medium text-white mb-4 print:text-slate-900">Occupancy Trend (Weekly)</h3>
          <OccupancyChart data={occupancyRate} />
        </div>
      </div>

      {/* Transaction Summary for Report */}
      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl print:shadow-none print:border-slate-200">
        <h3 className="text-lg font-medium text-white mb-4 print:text-slate-900">Recent Transaction Summary</h3>
        <div className="space-y-4">
          {recentActivities.filter((a: any) => a.type === 'payment').length === 0 ? (
            <p className="text-sm text-white/40 print:text-slate-500">No recent transactions recorded today.</p>
          ) : (
            recentActivities
              .filter((a: any) => a.type === 'payment')
              .map((txn: any) => (
                <div key={txn.id} className="flex justify-between items-center border-b border-white/5 pb-3 last:border-0 print:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 print:bg-green-50 print:border-green-100">
                      <CreditCard className="h-4 w-4 text-green-400 print:text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white print:text-slate-800">{txn.title}</p>
                      <p className="text-xs text-white/50 print:text-slate-400">{txn.desc}</p>
                    </div>
                  </div>
                  <span className="text-xs text-white/40 print:text-slate-500">
                    {new Date(txn.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
}
