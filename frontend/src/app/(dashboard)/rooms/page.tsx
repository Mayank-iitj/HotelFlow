"use client";

import { useState, useEffect } from "react";
import { Plus, Search, MoreHorizontal, BedDouble, Loader2, X } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function RoomsPage() {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal & form state
  const [showModal, setShowModal] = useState(false);
  const [roomNumber, setRoomNumber] = useState("");
  const [roomType, setRoomType] = useState("Deluxe");
  const [floor, setFloor] = useState("1");
  const [capacity, setCapacity] = useState(2);
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState("AVAILABLE");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await fetch(`${API_URL}/api/rooms`);
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumber || !roomType || !floor || !capacity || !price) {
      alert("Please fill in all fields.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          room_number: roomNumber,
          room_type: roomType,
          floor,
          capacity: parseInt(capacity.toString()),
          price: parseFloat(price.toString()),
          status
        })
      });
      if (res.ok) {
        setShowModal(false);
        // Reset form
        setRoomNumber("");
        setRoomType("Deluxe");
        setFloor("1");
        setCapacity(2);
        setPrice("");
        setStatus("AVAILABLE");
        fetchRooms();
      } else {
        const errData = await res.json();
        alert(errData.error || "Failed to create room.");
      }
    } catch (err) {
      console.error("Failed to create room:", err);
      alert("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredRooms = rooms.filter((room: any) => {
    const q = searchTerm.toLowerCase();
    const number = room.room_number?.toLowerCase() || "";
    const type = room.room_type?.toLowerCase() || "";
    const flr = room.floor?.toLowerCase() || "";
    return number.includes(q) || type.includes(q) || flr.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Rooms</h1>
          <p className="text-white/60">Manage your hotel's rooms and view their current status.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Add Room
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
              placeholder="Search rooms by number, type, floor..." 
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="py-12 text-center text-white/50">Loading rooms...</div>
        ) : filteredRooms.length === 0 ? (
          <div className="py-12 text-center flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-xl">
            <BedDouble className="w-12 h-12 text-white/20 mb-4" />
            <p className="text-white/60 mb-4">No rooms found. Add a room to get started.</p>
            <button onClick={() => setShowModal(true)} className="text-blue-400 hover:text-blue-300 font-medium text-sm">
              + Add Room Profile
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-white/80">
              <thead className="text-xs uppercase bg-white/5 text-white/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg">Room No.</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Floor</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg"></th>
                </tr>
              </thead>
              <tbody>
                {filteredRooms.map((room: any) => (
                  <tr key={room.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{room.room_number}</td>
                    <td className="px-6 py-4">{room.room_type}</td>
                    <td className="px-6 py-4">Floor {room.floor}</td>
                    <td className="px-6 py-4">${room.price}/night</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        room.status === 'AVAILABLE' ? 'bg-green-500/20 text-green-400 border border-green-500/10' :
                        room.status === 'OCCUPIED' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/10' :
                        room.status === 'CLEANING' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/10' :
                        'bg-red-500/20 text-red-400 border border-red-500/10'
                      }`}>
                        {room.status}
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

      {/* Add Room Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCreateRoom} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">Add New Room</h3>
                <p className="text-sm text-white/50 mt-1">Configure room attributes and pricing.</p>
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
              {/* Room Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Room Number</label>
                <input
                  type="text"
                  required
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 101, 302"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Room Type */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Room Type</label>
                  <select
                    value={roomType}
                    onChange={(e) => setRoomType(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  >
                    <option className="bg-slate-900" value="Single">Single</option>
                    <option className="bg-slate-900" value="Double">Double</option>
                    <option className="bg-slate-900" value="Deluxe">Deluxe</option>
                    <option className="bg-slate-900" value="Suite">Suite</option>
                    <option className="bg-slate-900" value="Executive">Executive</option>
                  </select>
                </div>

                {/* Floor */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Floor</label>
                  <input
                    type="text"
                    required
                    value={floor}
                    onChange={(e) => setFloor(e.target.value)}
                    placeholder="e.g. 1, 2"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Capacity */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Capacity (Guests)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={capacity}
                    onChange={(e) => setCapacity(parseInt(e.target.value) || 1)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                {/* Price */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Price / Night ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 120.00"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Initial Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-500/50"
                >
                  <option className="bg-slate-900" value="AVAILABLE">Available</option>
                  <option className="bg-slate-900" value="CLEANING">Cleaning</option>
                  <option className="bg-slate-900" value="DIRTY">Dirty</option>
                  <option className="bg-slate-900" value="MAINTENANCE">Maintenance</option>
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
                    <BedDouble className="w-4 h-4" />
                    Create Room
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

