"use client";
import { useState, useEffect } from "react";

export default function Page(){
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [track,setTrack]=useState("");
  const [school,setSchool]=useState(""); const [course,setCourse]=useState(""); const [classL,setClassL]=useState("");
  const [pay,setPay]=useState("Paystack"); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false);
  const [dbCount,setDbCount]=useState(0); const [localList,setLocalList]=useState<any[]>([]);
  
  const isF = track.includes("Primary") || track.includes("Foresight");
  const PILOT = ["ECWA Academy Badariya","Joda Primary","Brilliance Primary","High Standard","Royal Kids Academy","Kauran Gwandu Model","Gesse Phase 1 Model","Tudun Wada Model","Mechanic Village Model","Army Childrens School","OTHER"];
  const COURSES_F = ["All 4 Core - Hausa, English, Maths, BST","Hausa KPI","English KPI","Mathematics KPI","BST KPI"];
  const COURSES_G = ["All 9 Courses - N30k Full","Digital Health Operations","AI and Automations","Cyber Security","MIS","Data Analytics","Computer Operations & Programming","Hardware & Software Eng","Electrical & Electronic Eng","Networking"];
  const courses = isF ? COURSES_F : COURSES_G;

  useEffect(()=>{ 
    try{ const l=JSON.parse(localStorage.getItem('DUCEE_PUPILS_LIST')||"[]"); setLocalList(l); }catch{}
    loadDB();
  },[]);

  async function loadDB(){
    try{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if(!url || !key) return;
      const { createClient } = await import("@supabase/supabase-js");
      const supa = createClient(url,key);
      const {data} = await supa.from("foresight_enrollments").select("id").limit(100);
      if(data) setDbCount(data.length);
    }catch{}
  }

  async function enroll(){
    if(!name||!phone||!track||!course){ setMsg("❌ Fill all fields"); return; }
    if(isF && !school){ setMsg("❌ Select Pilot School"); return; }
    setLoading(true);
    const ts=Date.now().toString().slice(-5); const rnd=Math.floor(10+Math.random()*90); const pref=isF?"F":"G";
    const enrol=`DUCEE-${pref}2026-${ts}${rnd}`; const dhr=`DHR-${pref}2026-${ts}${rnd}`; const biz=`DUCEE-BIZ-${pref}2026-${ts}${rnd}`;
    const finalSchool = school==="OTHER" ? classL+" (Partnership)" : (school || "General Public");
    
    try{
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL; const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if(!url || !key){ throw new Error("Supabase env vars not set in Vercel - add them in Settings -> Environment Variables"); }
      const { createClient } = await import("@supabase/supabase-js");
      const supa = createClient(url,key);
      const {error} = await supa.from("foresight_enrollments").insert([{
        enrol_no:enrol, dhr_id:dhr, biz_id:biz, pupil_name:name, full_name:name, parent_phone:phone, phone, track, school_name:finalSchool, class_level:classL, course_package:course, subjects:[course], fee:isF?"Foresight Free":"N30000", payment_status:isF?"Foresight Sponsored - Free":(pay==="Bank Transfer"?"Pending Bank Transfer":"Pending Paystack"), payment_method:isF?"Free":pay, status:`Joined - ${finalSchool}`
      }]);
      if(error) throw error;
      
      const list=JSON.parse(localStorage.getItem('DUCEE_PUPILS_LIST')||"[]"); list.push({name,enrol,dhr,school:finalSchool}); localStorage.setItem('DUCEE_PUPILS_LIST',JSON.stringify(list)); setLocalList(list);
      setMsg(`✅ SUCCESS! ${enrol} | ${dhr} | ${biz} | ${finalSchool} - ${isF?"F=Foresight FREE":"G=General N30k"}`); setName(""); setPhone(""); setCourse(""); setDbCount(dbCount+1);
    }catch(e:any){ setMsg("❌ "+e.message); }
    setLoading(false);
  }

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:12,background:"#f5f5f5",minHeight:"100vh"}}>
      <div style={{background:"white",padding:20,borderRadius:12,boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
        <h3 style={{textAlign:"center",color:"#0a7a3c"}}>🎓 DUCEE OS V20.2 - FIXED BUILD</h3>
        <p style={{textAlign:"center",fontSize:12}}>F=Foresight Free | G=General N30k | DB: ducee-core-os | DB Total: {dbCount} | Phone: {localList.length}/10</p>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name / Pupil Name" style={{width:"100%",padding:14,margin:"8px 0",border:"1px solid #ccc",borderRadius:8}} />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone 080..." style={{width:"100%",padding:14,margin:"8px 0",border:"1px solid #ccc",borderRadius:8}} />
        <select value={track} onChange={e=>{setTrack(e.target.value); setCourse("");}} style={{width:"100%",padding:14,margin:"8px 0",border:"1.5px solid #0a7a3c",borderRadius:8,fontWeight:700}}>
          <option value="">-- Select Track --</option>
          <option value="Primary Pupil Foresight Free">🌟 Foresight Free - 10 Pilot Schools (F2026)</option>
          <option value="General Public N30k">💼 General Public - N30k 9 Courses (G2026)</option>
        </select>
        {isF && <div style={{background:"#fff8e1",padding:12,border:"2px solid #b9770e",borderRadius:8}}><select value={school} onChange={e=>setSchool(e.target.value)} style={{width:"100%",padding:14,margin:"8px 0",borderRadius:8}}><option value="">-- Pilot School --</option>{PILOT.map(s=><option key={s} value={s}>{s}</option>)}</select><input value={classL} onChange={e=>setClassL(e.target.value)} placeholder="Class e.g Primary 4" style={{width:"100%",padding:12,margin:"5px 0",border:"1px solid #ccc",borderRadius:6}} /></div>}
        {!isF && track && <input value={classL} onChange={e=>setClassL(e.target.value)} placeholder="Class/Level" style={{width:"100%",padding:12,margin:"5px 0",border:"1px solid #ccc",borderRadius:6}} />}
        <select value={course} onChange={e=>setCourse(e.target.value)} style={{width:"100%",padding:14,margin:"8px 0",border:"1.5px solid #0a7a3c",borderRadius:8,fontWeight:600}}><option value="">-- Select Course Package --</option>{courses.map(c=><option key={c} value={c}>{c}</option>)}</select>
        {!isF && track && <div style={{padding:12,background:"#f9f9f9",borderRadius:8}}><b>Payment:</b> <label><input type="radio" checked={pay==="Paystack"} onChange={()=>setPay("Paystack")}/> Paystack</label> <label><input type="radio" checked={pay==="Bank Transfer"} onChange={()=>setPay("Bank Transfer")}/> Bank</label>{pay==="Bank Transfer" && <div style={{background:"#fff8e1",padding:10,marginTop:8,border:"2px dashed orange",borderRadius:8}}>GT Bank: 0229676883 - Use Enrol No</div>}</div>}
        <button onClick={enroll} disabled={loading} style={{width:"100%",padding:14,background:"#0a7a3c",color:"white",border:"none",borderRadius:8,fontWeight:"bold"}}>{loading?"Saving...":"Enroll Now - Save to Supabase"}</button>
        <div style={{marginTop:12,padding:12,background:msg.includes("SUCCESS")?"#e8f5e9":"#f0f8ff",borderRadius:8,textAlign:"center"}}>{msg||"Fill form and enroll..."}</div>
        {localList.length>0 && <div style={{marginTop:12,background:"#eef7ff",padding:10,borderRadius:8,fontSize:12}}><b>📱 {localList.length} pupils on this phone:</b>{localList.map((p:any,i:number)=><div key={i}>{i+1}. {p.name} | {p.enrol} | {p.school}</div>)}</div>}
      </div>
    </div>
  );
}
