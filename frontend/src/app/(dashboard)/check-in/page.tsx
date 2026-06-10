"use client";

import { useState, useEffect } from "react";
import { Search, LogIn, LogOut, Loader2, Calendar, BedDouble, User, DollarSign, CreditCard } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function CheckInOutPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Checkout modal state
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [checkoutNights, setCheckoutNights] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("CREDIT_CARD");
  const [processingCheckout, setProcessingCheckout] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/bookings`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (bookingId: number) => {
    try {
      const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "ACTIVE" })
      });
      if (res.ok) {
        fetchBookings();
      } else {
        alert("Failed to perform check-in");
      }
    } catch (err) {
      console.error("Error during check-in:", err);
    }
  };

  const openCheckoutModal = (booking: any) => {
    // Calculate nights stayed
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const timeDiff = Math.abs(checkOut.getTime() - checkIn.getTime());
    let nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    if (nights <= 0) nights = 1;

    const pricePerNight = booking.room?.price || 100;
    
    setSelectedBooking(booking);
    setCheckoutNights(nights);
    setTotalCost(nights * pricePerNight);
    setPaymentMethod("CREDIT_CARD");
  };

  const closeCheckoutModal = () => {
    setSelectedBooking(null);
  };

  const handleCheckOutSubmit = async () => {
    if (!selectedBooking) return;
    setProcessingCheckout(true);

    try {
      // 1. Record the Payment
      const paymentRes = await fetch(`${API_URL}/api/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_id: selectedBooking.id,
          amount: totalCost,
          payment_method: paymentMethod
        })
      });

      if (!paymentRes.ok) {
        throw new Error("Failed to process payment");
      }

      // 2. Complete the Booking/Checkout
      const bookingRes = await fetch(`${API_URL}/api/bookings/${selectedBooking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" })
      });

      if (!bookingRes.ok) {
        throw new Error("Failed to complete checkout");
      }

      // Refresh data and close modal
      closeCheckoutModal();
      fetchBookings();
    } catch (err: any) {
      console.error("Checkout error:", err);
      alert(err.message || "Something went wrong during checkout.");
    } finally {
      setProcessingCheckout(false);
    }
  };

  // Filter bookings based on search
  const filteredBookings = bookings.filter((b) => {
    const guestName = b.guest?.name?.toLowerCase() || "";
    const guestEmail = b.guest?.email?.toLowerCase() || "";
    const roomNo = b.room?.room_number?.toString() || "";
    const q = searchTerm.toLowerCase();
    return guestName.includes(q) || guestEmail.includes(q) || roomNo.includes(q);
  });

  // Split into arrivals and departures
  const arrivals = filteredBookings.filter(
    (b) => b.status === "CONFIRMED" || b.status === "PENDING"
  );
  
  const activeStays = filteredBookings.filter(
    (b) => b.status === "ACTIVE"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Check-In / Check-Out</h1>
          <p className="text-white/60">Process daily guest arrivals and finalize departures with automated billing.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
        <input 
          type="text" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email or room number..." 
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/30 transition-all text-sm"
        />
      </div>

      {loading ? (
        <div className="py-24 text-center text-white/50 flex flex-col items-center justify-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          <span>Loading bookings...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* arrivals column */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <LogIn className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Pending Arrivals ({arrivals.length})</h2>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {arrivals.length === 0 ? (
                <p className="text-center text-white/40 py-8 text-sm">No pending check-ins found.</p>
              ) : (
                arrivals.map((b) => (
                  <div key={b.id} className="rounded-xl bg-black/20 border border-white/5 p-4 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-white">{b.guest?.name}</h3>
                        <p className="text-xs text-white/40">{b.guest?.email}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">
                        Room {b.room?.room_number} ({b.room?.room_type})
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Check-in: {new Date(b.check_in).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => handleCheckIn(b.id)}
                        className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Check In
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* departures column */}
          <div className="rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <LogOut className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Active Guests ({activeStays.length})</h2>
            </div>
            
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {activeStays.length === 0 ? (
                <p className="text-center text-white/40 py-8 text-sm">No active stays found.</p>
              ) : (
                activeStays.map((b) => (
                  <div key={b.id} className="rounded-xl bg-black/20 border border-white/5 p-4 hover:border-white/10 transition-all">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="font-semibold text-white">{b.guest?.name}</h3>
                        <p className="text-xs text-white/40">{b.guest?.email}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-lg text-xs font-semibold">
                        Room {b.room?.room_number} ({b.room?.room_type})
                      </span>
                    </div>

                    <div className="mt-3 flex items-center gap-4 text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Stay: {new Date(b.check_in).toLocaleDateString()} - {new Date(b.check_out).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => openCheckoutModal(b)}
                        className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Check Out
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      )}

      {/* Checkout Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-white/10 p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">Check-Out & Settlement</h3>
              <p className="text-sm text-white/50 mt-1">Review guest stay duration and process payment.</p>
            </div>

            <div className="space-y-4">
              {/* Stay Summary */}
              <div className="rounded-xl bg-white/5 border border-white/5 p-4 space-y-2.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Guest:</span>
                  <span className="text-white font-medium">{selectedBooking.guest?.name}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Room:</span>
                  <span className="text-white font-medium">Room {selectedBooking.room?.room_number} ({selectedBooking.room?.room_type})</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Stay Duration:</span>
                  <span className="text-white font-medium">{checkoutNights} Night{checkoutNights > 1 ? "s" : ""}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/50">Rate / Night:</span>
                  <span className="text-white font-medium">${selectedBooking.room?.price}</span>
                </div>
                <div className="border-t border-white/10 pt-2.5 flex justify-between items-center text-base font-semibold">
                  <span className="text-white">Total Charge:</span>
                  <span className="text-purple-400">${totalCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "CREDIT_CARD", label: "Card", icon: CreditCard },
                    { id: "CASH", label: "Cash", icon: DollarSign },
                    { id: "BANK_TRANSFER", label: "Transfer", icon: BedDouble } // fallbacks
                  ].map((method) => {
                    const Icon = method.icon;
                    const isSelected = paymentMethod === method.id;
                    return (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                          isSelected 
                            ? "bg-purple-500/10 border-purple-500 text-purple-400" 
                            : "bg-white/5 border-white/5 text-white/60 hover:border-white/10"
                        }`}
                      >
                        <Icon className="w-5 h-5 mb-1.5" />
                        <span className="text-xs font-medium">{method.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeCheckoutModal}
                disabled={processingCheckout}
                className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-white/80 hover:bg-white/5 text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCheckOutSubmit}
                disabled={processingCheckout}
                className="flex-1 px-4 py-2.5 rounded-lg bg-gradient-to-r from-purple-500 to-blue-600 text-white hover:opacity-90 text-sm font-medium transition-opacity flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {processingCheckout ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <LogOut className="w-4 h-4" />
                    Complete Check-Out
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
