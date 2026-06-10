"use client";

import { useState, useEffect } from "react";
import { User, Plus, Trash2, Search, ShieldAlert, Loader2, Mail, Shield } from "lucide-react";

export default function StaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Add Staff Modal State
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECEPTIONIST");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setStaff(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      alert("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role })
      });

      if (res.ok) {
        setShowModal(false);
        setName("");
        setEmail("");
        setPassword("");
        setRole("RECEPTIONIST");
        fetchStaff();
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to create staff member");
      }
    } catch (err) {
      console.error("Error creating user:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteStaff = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setStaff(prev => prev.filter(s => s.id !== id));
      } else {
        alert("Failed to delete staff member");
      }
    } catch (err) {
      console.error("Error deleting staff:", err);
    }
  };

  const filteredStaff = staff.filter((s) => {
    const nameVal = s.name?.toLowerCase() || "";
    const emailVal = s.email?.toLowerCase() || "";
    const roleVal = s.role?.toLowerCase() || "";
    const q = searchTerm.toLowerCase();
    
    return nameVal.includes(q) || emailVal.includes(q) || roleVal.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Staff Directory</h1>
          <p className="text-white/60">View authorized users, manage receptionist accounts, and assign cleaner roles.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Staff Member
        </button>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search staff by name or role..." 
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center text-white/50 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>Loading staff directory...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStaff.length === 0 ? (
            <div className="col-span-full py-12 text-center text-white/40 text-sm">
              No staff members found.
            </div>
          ) : (
            filteredStaff.map((member) => (
              <div key={member.id} className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/5 p-5 hover:border-white/15 transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white flex items-center justify-center font-bold border border-white/10 group-hover:border-white/30 transition-colors">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{member.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          member.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                          member.role === 'RECEPTIONIST' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                          'bg-green-500/10 text-green-400 border border-green-500/20'
                        }`}>
                          <Shield className="w-2.5 h-2.5" />
                          {member.role}
                        </span>
                      </div>
                    </div>
                    
                    {/* Basic check: do not let delete admin easily or do local confirm */}
                    <button 
                      onClick={() => handleDeleteStaff(member.id)}
                      className="text-white/20 hover:text-red-400 transition-colors"
                      title="Remove Staff Account"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-2 mt-4 text-sm text-white/60">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-white/40" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/5 pt-3 mt-4 flex justify-between items-center text-[10px] text-white/40">
                  <span>Joined</span>
                  <span>{new Date(member.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateStaff} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Register Staff Account</h3>
              <p className="text-sm text-white/50 mt-1">Create operational credentials for receptionists or housekeepers.</p>
            </div>

            <div className="space-y-4">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Miller"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@hotelflow.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                >
                  <option className="bg-slate-900" value="RECEPTIONIST">Receptionist</option>
                  <option className="bg-slate-900" value="HOUSEKEEPER">Housekeeper</option>
                  <option className="bg-slate-900" value="ADMIN">System Administrator</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 text-sm font-medium transition-opacity flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4" />
                    Register Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
