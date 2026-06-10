"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, Users, Mail, Phone, Loader2, X, MapPin } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function GuestsPage() {
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [nationality, setNationality] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/guests`);
      const data = await res.json();
      setGuests(data);
    } catch (err) {
      console.error("Failed to fetch guests:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !nationality || !address) {
      alert("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          nationality,
          address
        })
      });
      if (res.ok) {
        setShowModal(false);
        // Reset form
        setName("");
        setEmail("");
        setPhone("");
        setNationality("");
        setAddress("");
        fetchGuests();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create guest.");
      }
    } catch (err) {
      console.error("Failed to create guest:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredGuests = guests.filter((guest: any) => {
    const q = searchTerm.toLowerCase();
    const gName = guest.name?.toLowerCase() || "";
    const gEmail = guest.email?.toLowerCase() || "";
    const gNationality = guest.nationality?.toLowerCase() || "";
    const gPhone = guest.phone?.toLowerCase() || "";
    return gName.includes(q) || gEmail.includes(q) || gNationality.includes(q) || gPhone.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Guests</h1>
          <p className="text-white/60">View and manage your hotel's guest directory.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Guest
        </button>
      </div>

      <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search guests by name, email, country..." 
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/50">Loading guests...</div>
        ) : filteredGuests.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
            <Users className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/60 mb-4">No guests found. Add a guest profile to start.</p>
            <button onClick={() => setShowModal(true)} className="text-blue-400 hover:text-blue-300 font-medium text-sm">
              + Add Guest Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuests.map((guest: any) => (
              <div key={guest.id} className="rounded-xl bg-black/20 border border-white/5 p-5 hover:bg-white/5 transition-colors group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-white flex items-center justify-center font-bold border border-white/10 group-hover:border-white/30 transition-colors">
                      {guest.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-white font-medium">{guest.name}</h3>
                      <span className="text-xs text-white/40">{guest.nationality}</span>
                    </div>
                  </div>
                  <button className="text-white/20 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-2.5 mt-4 text-sm text-white/60">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span className="truncate">{guest.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span>{guest.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-white/40 flex-shrink-0" />
                    <span className="truncate">{guest.address}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Guest Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateGuest} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Add Guest Profile</h3>
                <p className="text-sm text-white/50 mt-1">Register a new guest in the directory.</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. jane@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Phone */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 555-0199"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* Nationality */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Nationality</label>
                  <input
                    type="text"
                    required
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g. US, CA, UK"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Home Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. 123 Pine St, San Francisco, CA"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
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
                    Registering...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Add Guest
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

