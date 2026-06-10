"use client";

import { useState } from "react";
import { Settings, Hotel, Shield, Bell, Check, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("hotel"); // hotel, profile, notifications
  
  // Hotel form states
  const [hotelName, setHotelName] = useState("HotelFlow Luxury Resort");
  const [address, setAddress] = useState("456 Ocean Drive, Miami, FL");
  const [phone, setPhone] = useState("+1 305-555-0100");
  const [email, setEmail] = useState("info@hotelflowresort.com");
  const [currency, setCurrency] = useState("USD");
  const [checkoutTime, setCheckoutTime] = useState("11:00 AM");

  // Profile form states
  const [adminName, setAdminName] = useState("Admin User");
  const [adminEmail, setAdminEmail] = useState("admin@hotelflow.com");
  const [password, setPassword] = useState("••••••••");

  // Saving state indicator
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    // Simulate saving process
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      
      // Auto-hide success checkmark after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Settings</h1>
          <p className="text-white/60">Configure global hotel profile details, currencies, and administrative settings.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-1.5 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: "hotel", label: "Hotel Profile", icon: Hotel },
            { id: "profile", label: "Security & Profile", icon: Shield },
            { id: "notifications", label: "System Config", icon: Settings }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSuccess(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all shrink-0 md:shrink border ${
                  isActive 
                    ? "bg-purple-600 border-purple-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                    : "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Configurations Form Panel */}
        <div className="flex-1 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {activeTab === "hotel" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Hotel Settings</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hotel Brand Name</label>
                    <input
                      type="text"
                      required
                      value={hotelName}
                      onChange={(e) => setHotelName(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Hotel Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Resort Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Contact Phone</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Currency</label>
                    <select
                      value={currency}
                      onChange={(e) => setCurrency(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    >
                      <option className="bg-slate-900" value="USD">USD ($)</option>
                      <option className="bg-slate-900" value="EUR">EUR (€)</option>
                      <option className="bg-slate-900" value="GBP">GBP (£)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Standard Checkout Hour</label>
                    <input
                      type="text"
                      required
                      value={checkoutTime}
                      onChange={(e) => setCheckoutTime(e.target.value)}
                      className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Profile & Security</h3>
                
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Admin Name</label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/60 uppercase tracking-wider">Change Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">System Configurations</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Daily Operational Reports</h4>
                      <p className="text-xs text-white/50">Send daily operational stats check sheets to director email.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600 bg-black/20 border-white/10 focus:ring-purple-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Automated Housekeeping Dispatch</h4>
                      <p className="text-xs text-white/50">Automatically create room clean tasks immediately after check-outs.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-purple-600 bg-black/20 border-white/10 focus:ring-purple-500" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-black/10 border border-white/5">
                    <div>
                      <h4 className="text-sm font-semibold text-white">Guest SMS Check-in Messages</h4>
                      <p className="text-xs text-white/50">Send greeting check-in confirmation link to guest phones on arrival.</p>
                    </div>
                    <input type="checkbox" className="w-4 h-4 rounded text-purple-600 bg-black/20 border-white/10 focus:ring-purple-500" />
                  </div>
                </div>
              </div>
            )}

            {/* Actions & Feedback */}
            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-purple-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 text-sm shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Settings
                  </>
                )}
              </button>

              {success && (
                <span className="flex items-center gap-1.5 text-xs text-green-400 font-semibold bg-green-500/10 px-3 py-1.5 rounded-lg border border-green-500/20 animate-in fade-in duration-200">
                  <Check className="w-3.5 h-3.5" />
                  Settings saved successfully!
                </span>
              )}
            </div>

          </form>
        </div>

      </div>
    </div>
  );
}
