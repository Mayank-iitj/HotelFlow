"use client";

import { useState, useEffect } from "react";
import { ClipboardList, CheckCircle, RefreshCw, AlertCircle, User, Loader2, Search } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function HousekeepingPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL, CLEAN, CLEANING, DIRTY

  useEffect(() => {
    fetchHousekeepingAndStaff();
  }, []);

  const fetchHousekeepingAndStaff = async () => {
    try {
      setLoading(true);
      const [hkRes, staffRes] = await Promise.all([
        fetch(`${API_URL}/api/housekeeping`),
        fetch(`${API_URL}/api/users`)
      ]);
      
      const hkData = await hkRes.json();
      const staffData = await staffRes.json();
      
      setTasks(Array.isArray(hkData) ? hkData : []);
      setStaffList(Array.isArray(staffData) ? staffData : []);
    } catch (err) {
      console.error("Failed to fetch housekeeping data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (taskId: number, newStatus: string) => {
    try {
      const res = await fetch(`${API_URL}/api/housekeeping/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        // Refresh local tasks list
        const updatedTask = await res.json();
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
      } else {
        alert("Failed to update status");
      }
    } catch (err) {
      console.error("Error updating cleaning status:", err);
    }
  };

  const handleAssignStaff = async (taskId: number, staffIdVal: string) => {
    const assigned_staff = staffIdVal ? parseInt(staffIdVal) : null;
    try {
      const res = await fetch(`${API_URL}/api/housekeeping/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_staff })
      });
      if (res.ok) {
        const updatedTask = await res.json();
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedTask } : t));
      } else {
        alert("Failed to assign staff");
      }
    } catch (err) {
      console.error("Error assigning staff:", err);
    }
  };

  // Filter and search
  const filteredTasks = tasks.filter((t) => {
    const roomNo = t.room?.room_number?.toString() || "";
    const type = t.room?.room_type?.toLowerCase() || "";
    const q = searchTerm.toLowerCase();
    
    const matchesSearch = roomNo.includes(q) || type.includes(q);
    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Housekeeping Duties</h1>
          <p className="text-white/60">Monitor room clean status, dispatch staff, and manage room availability.</p>
        </div>
      </div>

      {/* Filter and Search Actions */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search rooms..." 
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {["ALL", "CLEAN", "CLEANING", "DIRTY"].map((filter) => (
            <button
              key={filter}
              onClick={() => setStatusFilter(filter)}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg border text-xs font-semibold transition-all ${
                statusFilter === filter
                  ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                  : "bg-white/5 border-white/5 text-white/60 hover:border-white/10"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-white/50 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>Loading housekeeping logs...</span>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
          {filteredTasks.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-sm">
              No rooms matching the current filters.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase bg-white/5 text-white/50">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Room</th>
                    <th className="px-6 py-4">Floor / Type</th>
                    <th className="px-6 py-4">Room Status</th>
                    <th className="px-6 py-4">Cleaning Status</th>
                    <th className="px-6 py-4">Assigned Attendant</th>
                    <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((t: any) => (
                    <tr key={t.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-semibold text-white">Room {t.room?.room_number}</td>
                      <td className="px-6 py-4 text-xs text-white/60">
                        Floor {t.room?.floor} &bull; {t.room?.room_type}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          t.room?.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                          t.room?.status === 'OCCUPIED' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          t.room?.status === 'CLEANING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                          'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {t.room?.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          {t.status === 'CLEAN' && <CheckCircle className="w-4 h-4 text-green-400" />}
                          {t.status === 'CLEANING' && <RefreshCw className="w-4 h-4 text-yellow-400 animate-spin" />}
                          {t.status === 'DIRTY' && <AlertCircle className="w-4 h-4 text-red-400" />}
                          <span className="capitalize">{t.status.toLowerCase()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <User className="w-3.5 h-3.5 text-white/40" />
                          <select
                            value={t.assigned_staff || ""}
                            onChange={(e) => handleAssignStaff(t.id, e.target.value)}
                            className="bg-black/40 border border-white/10 rounded px-2 py-1 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                          >
                            <option value="">Unassigned</option>
                            {staffList.map((staff) => (
                              <option key={staff.id} value={staff.id}>
                                {staff.name} ({staff.role})
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-1.5">
                          {t.status !== 'CLEAN' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "CLEAN")}
                              className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Mark Clean
                            </button>
                          )}
                          {t.status !== 'CLEANING' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "CLEANING")}
                              className="px-2.5 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Clean
                            </button>
                          )}
                          {t.status !== 'DIRTY' && (
                            <button
                              onClick={() => handleUpdateStatus(t.id, "DIRTY")}
                              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold transition-colors"
                            >
                              Mark Dirty
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
