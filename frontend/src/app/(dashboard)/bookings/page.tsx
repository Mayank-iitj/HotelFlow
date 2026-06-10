"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, CalendarDays, Loader2, X, Users, BedDouble, Calendar } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);
  const [guests, setGuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [guestId, setGuestId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [status, setStatus] = useState("CONFIRMED");
  const [submitting, setSubmitting] = useState(false);

  // Inline Guest Creation state
  const [isCreatingGuest, setIsCreatingGuest] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestNation, setGuestNation] = useState("US");
  const [guestAddress, setGuestAddress] = useState("");
  const [guestSaving, setGuestSaving] = useState(false);

  useEffect(() => {
    fetchBookingsAndLists();
    // Default dates
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    
    setCheckIn(today.toISOString().split('T')[0]);
    setCheckOut(tomorrow.toISOString().split('T')[0]);
  }, []);

  const fetchBookingsAndLists = async () => {
    try {
      setLoading(true);
      const [bookingsRes, roomsRes, guestsRes] = await Promise.all([
        fetch(`${API_URL}/api/bookings`),
        fetch(`${API_URL}/api/rooms`),
        fetch(`${API_URL}/api/guests`)
      ]);
      
      const bookingsData = await bookingsRes.json();
      const roomsData = await roomsRes.json();
      const guestsData = await guestsRes.json();

      setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      setRooms(Array.isArray(roomsData) ? roomsData : []);
      setGuests(Array.isArray(guestsData) ? guestsData : []);
    } catch (err) {
      console.error("Failed to fetch bookings details:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuestInline = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail || !guestPhone) {
      alert("Please fill name, email, and phone for the new guest.");
      return;
    }
    setGuestSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/guests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
          nationality: guestNation,
          address: guestAddress || "Hotel Guest Address"
        })
      });
      if (res.ok) {
        const newGuest = await res.json();
        // Refresh local guest list
        setGuests((prev): any => [...prev, newGuest]);
        setGuestId(newGuest.id.toString());
        // Reset inline guest form
        setIsCreatingGuest(false);
        setGuestName("");
        setGuestEmail("");
        setGuestPhone("");
        setGuestNation("US");
        setGuestAddress("");
      } else {
        const err = await res.json();
        alert(err.error || "Failed to create inline guest.");
      }
    } catch (err) {
      console.error("Error creating guest inline:", err);
    } finally {
      setGuestSaving(false);
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestId || !roomId || !checkIn || !checkOut) {
      alert("Please fill in all fields.");
      return;
    }
    
    // Validate checkout is after checkin
    if (new Date(checkOut) <= new Date(checkIn)) {
      alert("Check-Out date must be after the Check-In date.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          guest_id: parseInt(guestId),
          room_id: parseInt(roomId),
          check_in: new Date(checkIn).toISOString(),
          check_out: new Date(checkOut).toISOString(),
          status
        })
      });

      if (res.ok) {
        setShowModal(false);
        setGuestId("");
        setRoomId("");
        // Reset default dates
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        setCheckIn(today.toISOString().split('T')[0]);
        setCheckOut(tomorrow.toISOString().split('T')[0]);
        setStatus("CONFIRMED");
        
        // Refresh listings
        fetchBookingsAndLists();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create booking.");
      }
    } catch (err) {
      console.error("Failed to create booking:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter((booking: any) => {
    const q = searchTerm.toLowerCase();
    const guestName = booking.guest?.name?.toLowerCase() || "";
    const guestEmail = booking.guest?.email?.toLowerCase() || "";
    const roomNo = booking.room?.room_number?.toLowerCase() || "";
    const bStatus = booking.status?.toLowerCase() || "";
    return guestName.includes(q) || guestEmail.includes(q) || roomNo.includes(q) || bStatus.includes(q);
  });

  // Only display rooms that are AVAILABLE (or current room selection if editing)
  const availableRooms = rooms.filter((r: any) => r.status === "AVAILABLE");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Bookings</h1>
          <p className="text-white/60">Manage reservations, check-ins, and check-outs.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-4 h-4" />
          New Booking
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
              placeholder="Search bookings by guest, room, status..." 
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/50">Loading bookings...</div>
        ) : filteredBookings.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
            <CalendarDays className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/60 mb-4">No active bookings found.</p>
            <button onClick={() => setShowModal(true)} className="text-blue-400 hover:text-blue-300 font-medium text-sm">
              + Add Booking Reservation
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs uppercase bg-white/5 text-white/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Guest</th>
                  <th className="px-6 py-4">Room</th>
                  <th className="px-6 py-4">Check-In</th>
                  <th className="px-6 py-4">Check-Out</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking: any) => (
                  <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">
                      <div>
                        <p>{booking.guest?.name || 'Unknown Guest'}</p>
                        <p className="text-xs text-white/40">{booking.guest?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">Room {booking.room?.room_number} ({booking.room?.room_type})</td>
                    <td className="px-6 py-4">{new Date(booking.check_in).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{new Date(booking.check_out).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'CONFIRMED' ? 'bg-green-500/20 text-green-400 border border-green-500/10' :
                        booking.status === 'ACTIVE' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/10' :
                        booking.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/10' :
                        booking.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/10' :
                        'bg-red-500/20 text-red-400 border border-red-500/10'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-white/40 hover:text-white transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Booking Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Create Reservation</h3>
                <p className="text-sm text-white/50 mt-1">Book an available room for a guest stay.</p>
              </div>
              <button 
                type="button" 
                onClick={() => { setShowModal(false); setIsCreatingGuest(false); }}
                className="text-white/40 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isCreatingGuest ? (
              /* Inline Guest Form */
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex justify-between items-center bg-white/5 rounded-lg p-3 border border-white/5 mb-2">
                  <span className="text-xs text-white/70 font-semibold uppercase tracking-wider">New Guest Registration</span>
                  <button 
                    type="button" 
                    onClick={() => setIsCreatingGuest(false)}
                    className="text-purple-400 hover:text-purple-300 text-xs font-semibold"
                  >
                    Select Existing
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs text-white/50">Full Name</label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-white/50">Email</label>
                      <input
                        type="email"
                        value={guestEmail}
                        onChange={(e) => setGuestEmail(e.target.value)}
                        placeholder="jane@example.com"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/50">Phone</label>
                      <input
                        type="text"
                        value={guestPhone}
                        onChange={(e) => setGuestPhone(e.target.value)}
                        placeholder="+1 555-0199"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs text-white/50">Nationality</label>
                      <input
                        type="text"
                        value={guestNation}
                        onChange={(e) => setGuestNation(e.target.value)}
                        placeholder="US"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs text-white/50">Address</label>
                      <input
                        type="text"
                        value={guestAddress}
                        onChange={(e) => setGuestAddress(e.target.value)}
                        placeholder="San Francisco, CA"
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2.5 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => setIsCreatingGuest(false)}
                    className="flex-1 px-3 py-2 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateGuestInline}
                    disabled={guestSaving}
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {guestSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Users className="w-3.5 h-3.5" />}
                    Save & Select Guest
                  </button>
                </div>
              </div>
            ) : (
              /* Main Booking Form */
              <form onSubmit={handleCreateBooking} className="space-y-4">
                {/* Guest Selection */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Select Guest</label>
                    <button 
                      type="button" 
                      onClick={() => setIsCreatingGuest(true)}
                      className="text-xs font-semibold text-purple-400 hover:text-purple-300"
                    >
                      + Create New Guest
                    </button>
                  </div>
                  <select
                    required
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option className="bg-slate-900" value="">-- Select Guest --</option>
                    {guests.map((g: any) => (
                      <option className="bg-slate-900" key={g.id} value={g.id}>
                        {g.name} ({g.email})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Select Room</label>
                  <select
                    required
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option className="bg-slate-900" value="">-- Select Room --</option>
                    {availableRooms.map((r: any) => (
                      <option className="bg-slate-900" key={r.id} value={r.id}>
                        Room {r.room_number} - {r.room_type} (${r.price}/night)
                      </option>
                    ))}
                  </select>
                  {availableRooms.length === 0 && (
                    <p className="text-xs text-red-400/80 mt-1 font-medium">No rooms are currently marked AVAILABLE.</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Check-In */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Check-In Date</label>
                    <input
                      type="date"
                      required
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>

                  {/* Check-Out */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Check-Out Date</label>
                    <input
                      type="date"
                      required
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Reservation Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option className="bg-slate-900" value="PENDING">Pending Approval</option>
                    <option className="bg-slate-900" value="CONFIRMED">Confirmed / Reserved</option>
                    <option className="bg-slate-900" value="ACTIVE">Checked In / Active</option>
                  </select>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3 border-t border-white/5">
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
                    disabled={submitting || availableRooms.length === 0}
                    className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 text-sm font-medium transition-opacity flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        Book Reservation
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

