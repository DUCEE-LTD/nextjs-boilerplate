"use client";
import { useState } from "react";

export default function Home() {
  const [trackId, setTrackId] = useState("");
  const [status, setStatus] = useState<any>(null);

  const handleTrack = () => {
    if (!trackId) return alert("Enter tracking ID");
    setStatus({
      id: trackId,
      from: "Lagos",
      to: "Ibadan",
      status: "In Transit - Oyo Hub",
      date: new Date().toLocaleDateString(),
    });
  };

  const handlePay = () => {
    alert(`Payment initiated for ${trackId || "DUCEE shipment"} - Paystack Flutterwave ready to connect`);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="border-b sticky top-0 bg-white z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-black">DUCEE LTD</h1>
          <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full">● LIVE - Ready</span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {/* Track */}
        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-3">📦 Track Shipment</h2>
          <input
            value={trackId}
            onChange={(e) => setTrackId(e.target.value)}
            placeholder="DUC-123456"
            className="w-full border rounded-lg px-4 py-3 mb-3 outline-none focus:ring-2 focus:ring-black"
          />
          <button onClick={handleTrack} className="w-full bg-black text-white rounded-lg py-3 font-bold">
            Track Now
          </button>
          {status && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
              <p><b>ID:</b> {status.id}</p>
              <p><b>Route:</b> {status.from} → {status.to}</p>
              <p><b>Status:</b> {status.status}</p>
              <p><b>Date:</b> {status.date}</p>
            </div>
          )}
        </div>

        {/* Pay */}
        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-3">💳 Pay Delivery</h2>
          <p className="text-sm text-gray-600 mb-4">Secure payment for your shipment with Paystack / Flutterwave.</p>
          <div className="space-y-3">
            <input placeholder="Amount NGN" className="w-full border rounded-lg px-4 py-3" defaultValue="5000" />
            <button onClick={handlePay} className="w-full bg-green-600 text-white rounded-lg py-3 font-bold">
              Pay Now
            </button>
          </div>
        </div>

        {/* Print */}
        <div className="border rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-lg mb-3">🖨️ Print Label</h2>
          <p className="text-sm text-gray-600 mb-4">Generate and print waybill for rider.</p>
          <div className="p-4 border-dashed border-2 rounded-lg mb-3 text-center">
            <p className="font-mono text-xs">{trackId || "DUC-XXXXXX"}</p>
            <p className="text-[10px]">DUCEE LTD - Ibadan</p>
          </div>
          <button onClick={handlePrint} className="w-full bg-white border-2 border-black rounded-lg py-3 font-bold">
            Print Label
          </button>
        </div>
      </div>

      <footer className="text-center text-xs text-gray-400 py-10">
        DUCEE LTD © 2026 - V20 Live on Vercel
      </footer>
    </main>
  );
}
