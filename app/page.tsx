"use client";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Page() {
  const [mode, setMode] = useState("enroll");
  const [form, setForm] = useState({ name: "", phone: "", email: "", wmb: "" });
  const [trackCode, setTrackCode] = useState("");
  const [trackResult, setTrackResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleEnroll = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const duceeCode = `DUCEE-${Date.now().toString().slice(-6)}`;
    const { error } = await supabase.from("foresight_400").insert([{ ...form, ducee_code: duceeCode, payment_status: "pending" }]);
    setLoading(false);
    if (!error) { setMsg(`Enrolled! Your Ducee Code: ${duceeCode} - Proceed to Payment`); setForm({ name: "", phone: "", email: "", wmb: "" }); }
    else setMsg(error.message);
  };

  const handleTrack = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await supabase.from("foresight_400").select("*").or(`ducee_code.eq.${trackCode},phone.eq.${trackCode}`).limit(1);
    setLoading(false);
    setTrackResult(data && data[0] ? data[0] : null);
    if (!data || !data[0]) setMsg("No record found for this Code/Phone");
  };

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-md mx-auto border rounded-xl p-4">
        <h1 className="font-bold text-center">DUCEE LTD — FORESIGHT 400 PORTAL V20</h1>
        <p className="text-xs text-green-600 text-center">Connected to ducee-core-os Supabase | LIVE DB</p>
        
        <div className="flex gap-2 my-4">
          <button onClick={()=>setMode("enroll")} className={`flex-1 p-2 rounded ${mode==="enroll" ? "bg-black text-white" : "bg-gray-100"}`}>Enroll</button>
          <button onClick={()=>setMode("track")} className={`flex-1 p-2 rounded ${mode==="track" ? "bg-black text-white" : "bg-gray-100"}`}>Track Package</button>
          <button onClick={()=>setMode("pay")} className={`flex-1 p-2 rounded ${mode==="pay" ? "bg-black text-white" : "bg-gray-100"}`}>Payment</button>
        </div>

        {mode==="enroll" && (
          <form onSubmit={handleEnroll} className="space-y-3">
            <input placeholder="Full Name" className="w-full border p-2 rounded" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
            <input placeholder="Phone" className="w-full border p-2 rounded" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} required />
            <input placeholder="Email" className="w-full border p-2 rounded" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
            <input placeholder="WMB" className="w-full border p-2 rounded" value={form.wmb} onChange={e=>setForm({...form, wmb:e.target.value})} required />
            <button disabled={loading} className="w-full bg-black text-white p-3 rounded font-bold">{loading?"Processing...":"ENROLL & GENERATE DUCEE CODE"}</button>
          </form>
        )}

        {mode==="track" && (
          <form onSubmit={handleTrack} className="space-y-3">
            <input placeholder="Enter Ducee Code or Phone" className="w-full border p-2 rounded" value={trackCode} onChange={e=>setTrackCode(e.target.value)} required />
            <button disabled={loading} className="w-full bg-black text-white p-3 rounded font-bold">{loading?"Searching...":"TRACK PACKAGE"}</button>
            {trackResult && (
              <div className="border p-3 rounded bg-gray-50 text-sm mt-3">
                <p><b>Name:</b> {trackResult.name}</p>
                <p><b>Code:</b> {trackResult.ducee_code}</p>
                <p><b>Payment:</b> {trackResult.payment_status}</p>
                <p><b>Status:</b> {trackResult.package_status || "Processing"}</p>
                <button onClick={()=>window.print()} className="mt-2 w-full bg-green-600 text-white p-2 rounded">Print Receipt</button>
              </div>
            )}
          </form>
        )}

        {mode==="pay" && (
          <div className="space-y-3 text-center">
            <p className="text-sm">Enter Ducee Code to Pay via Paystack</p>
            <input placeholder="DUCEE Code" className="w-full border p-2 rounded" value={trackCode} onChange={e=>setTrackCode(e.target.value)} />
            <button onClick={()=>window.open(`https://paystack.com/pay/ducee-ltd-${trackCode}`, "_blank")} className="w-full bg-green-600 text-white p-3 rounded font-bold">PAY WITH PAYSTACK</button>
            <p className="text-xs">After payment, use Track Package to verify</p>
          </div>
        )}

        {msg && <p className="mt-4 text-center text-sm font-bold">{msg}</p>}
      </div>
    </div>
  );
}
