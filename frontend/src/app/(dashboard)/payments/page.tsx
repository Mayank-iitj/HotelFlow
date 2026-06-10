"use client";

import { useState, useEffect } from "react";
import { CreditCard, DollarSign, Search, Plus, Loader2, Calendar, User, Check } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Collect Payment Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [paymentsRes, bookingsRes] = await Promise.all([
        fetch(`${API_URL}/api/payments`),
        fetch(`${API_URL}/api/bookings`)
      ]);
      const paymentsData = await paymentsRes.json();
      const bookingsData = await bookingsRes.json();
      
      setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      // Filter bookings that are pending or active
      setBookings(Array.isArray(bookingsData) ? bookingsData.filter(b => b.status !== 'COMPLETED') : []);
    } catch (err) {
      console.error("Failed to fetch payments data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBookingId || !paymentAmount) {
      alert("Please fill all required fields");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: parseInt(selectedBookingId),
          amount: parseFloat(paymentAmount),
          payment_method: paymentMethod
        })
      });

      if (res.ok) {
        setShowModal(false);
        setSelectedBookingId("");
        setPaymentAmount("");
        setPaymentMethod("CREDIT_CARD");
        // Re-fetch ledger
        const paymentsRes = await fetch(`${API_URL}/api/payments`);
        const paymentsData = await paymentsRes.json();
        setPayments(Array.isArray(paymentsData) ? paymentsData : []);
      } else {
        const errJson = await res.json();
        alert(errJson.error || "Failed to record payment");
      }
    } catch (err) {
      console.error("Error creating payment:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPayments = payments.filter((p) => {
    const guestName = p.booking?.guest?.name?.toLowerCase() || "";
    const roomNo = p.booking?.room?.room_number?.toString() || "";
    const method = p.payment_method?.toLowerCase() || "";
    const q = searchTerm.toLowerCase();
    
    return guestName.includes(q) || roomNo.includes(q) || method.includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Transactions & Payments</h1>
          <p className="text-white/60">View payment history ledger and collect custom billing payments.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          <Plus className="w-4 h-4" />
          Collect Payment
        </button>
      </div>

      {/* Actions / Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by guest, room, or method..." 
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center text-white/50 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>Loading ledger...</span>
        </div>
      ) : (
        <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
          {filteredPayments.length === 0 ? (
            <div className="py-12 text-center text-white/40 text-sm">
              No transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-white/80">
                <thead className="text-xs uppercase bg-white/5 text-white/50">
                  <tr>
                    <th className="px-6 py-4 rounded-tl-lg">Receipt ID</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Guest</th>
                    <th className="px-6 py-4">Room</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Method</th>
                    <th className="px-6 py-4 rounded-tr-lg">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((p: any) => (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-white/50">TXN-00{p.id}</td>
                      <td className="px-6 py-4 text-xs text-white/60">
                        {new Date(p.payment_date).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-white">
                        {p.booking?.guest?.name || "Unknown Guest"}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {p.booking?.room ? `Room ${p.booking.room.room_number} (${p.booking.room.room_type})` : "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-purple-400">
                        ${p.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-xs">
                        <span className="capitalize">{p.payment_method?.replace("_", " ").toLowerCase()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs text-green-400 font-semibold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">
                          <Check className="w-3 h-3" /> Paid
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Collect Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <form onSubmit={handleCollectPayment} className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Collect Payment</h3>
              <p className="text-sm text-white/50 mt-1">Record a payment transaction for an active guest stay.</p>
            </div>

            <div className="space-y-4">
              {/* Select Booking */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Select Booking</label>
                <select
                  required
                  value={selectedBookingId}
                  onChange={(e) => setSelectedBookingId(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                >
                  <option className="bg-slate-900" value="">-- Select Booking --</option>
                  {bookings.map((b) => (
                    <option className="bg-slate-900" key={b.id} value={b.id}>
                      {b.guest?.name} (Room {b.room?.room_number} - {b.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Payment Amount ($)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50"
                >
                  <option className="bg-slate-900" value="CREDIT_CARD">Credit Card</option>
                  <option className="bg-slate-900" value="CASH">Cash</option>
                  <option className="bg-slate-900" value="BANK_TRANSFER">Bank Transfer</option>
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
                    Recording...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Post Payment
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
