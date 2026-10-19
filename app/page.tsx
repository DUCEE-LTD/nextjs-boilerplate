"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null as any;

const PILOT_SCHOOLS = [
  "ECWA Academy Badariya, Birnin Kebbi","Joda Nursery & Primary School, Birnin Kebbi","Brilliance Nursery & Primary School, Birnin Kebbi","High Standard Nursery & Primary School, Birnin Kebbi","Royal Kids Academy, Birnin Kebbi","Kauran Gwandu Model Primary School, Birnin Kebbi","Gesse Phase 1 Model Primary School, Birnin Kebbi","Tudun Wada Model Primary School, Birnin Kebbi","Mechanic Village Model Primary School, Birnin Kebbi","Army Childrens School, Birnin Kebbi","OTHER"
];
const COURSES_FORESIGHT = [
  "All 4 Core Subjects - Foresight Pilot (Hausa, English, Maths, BST)",
  "Hausa (Yaren Hausa) - KPI",
  "English - Family, My Home, Health Words - KPI",
  "Mathematics (Lissafi) - Counting, Addition - KPI",
  "BST - Body Parts, Cleanliness - KPI"
];
const COURSES_GENERAL = [
  "All 9 Courses - N30k (Full Package)",
  "Digital Health Operations","Artificial Intelligence and Automations","Cyber Security","Management Information Systems (MIS)","Data Analytics","Computer Operations and Programming","Soft and Hardware Engineering","Electrical and Electronic Engineering","Networking"
];

export default function Page(){
  const [name,setName]=useState(""); const [phone,setPhone]=useState(""); const [track,setTrack]=useState("");
  const [school,setSchool]=useState(""); const [otherSchool,setOtherSchool]=useState("");
  const [classLevel,setClassLevel]=useState(""); const [course,setCourse]=useState("");
  const [payMethod,setPayMethod]=useState("Paystack"); const [enrollments,setEnrollments]=useState<any[]>([]);
  const [localPupils,setLocalPupils]=useState<any[]>([]); const [msg,setMsg]=useState(""); const [loading,setLoading]=useState(false);
  const isForesight = track.includes("Primary") || track.includes("Foresight");
  const courses = isForesight ? COURSES_FORESIGHT : COURSES_GENERAL;

  useEffect(()=>{ 
    fetchEnrollments(); 
    try{ const s = JSON.parse(localStorage.getItem('DUCEE_PUPILS_LIST')||"[]"); setLocalPupils(s); }catch{}
  },[]);

  async function fetchEnrollments(){
    if(!supabase) return;
    const {data} = await supabase.from("foresight_enrollments").select("*").order("created_at",{ascending:false}).limit(50);
    if(data) setEnrollments(data);
  }

  async function enroll(){
    if(!name||!phone||!track||!course){ setMsg("Fill all fields"); return; }
    if(isForesight && !school){ setMsg("Select Pilot School"); return; }
    if(!supabase){ setMsg("Supabase not connected - check env vars"); return; }
    
    setLoading(true);
    const ts = Date.now().toString().slice(-5);
    const rnd = Math.floor(10+Math.random()*90);
    const prefix = isForesight ? "F" : "G";
    const enrol_no = `DUCEE-${prefix}2026-${ts}${rnd}`;
    const dhr_id = `DHR-${prefix}2026-${ts}${rnd}`;
    const biz_id = `DUCEE-BIZ-${prefix}2026-${ts}${rnd}`;
    const finalSchool = school==="OTHER" ? otherSchool + " (Partnership)" : (school || "General Public");

    const {error} = await supabase.from("foresight_enrollments").insert([{
      enrol_no, dhr_id, biz_id, pupil_name:name, full_name:name, parent_phone:phone, phone, track, school_name:finalSchool, class_level:classLevel, course_package:course, subjects:[course], fee:isForesight?"Foresight Free":"N30000", payment_status:isForesight?"Foresight Sponsored - Free":(payMethod==="Bank Transfer"?"Pending Bank Transfer":"Pending Paystack"), payment_method:isForesight?"Free":payMethod, status:`Joined - ${finalSchool}`
    }]);
    
    setLoading(false);
    if(error){ setMsg("DB Error: "+error.message); return; }

    const list = JSON.parse(localStorage.getItem('DUCEE_PUPILS_LIST')||"[]");
    list.push({name, enrol:enrol_no, dhr:dhr_id, biz:biz_id, school:finalSchool, track});
    localStorage.setItem('DUCEE_PUPILS_LIST', JSON.stringify(list));
    setLocalPupils(list);
    setMsg(`SUCCESS! ${enrol_no} | ${dhr_id} | ${biz_id} | ${finalSchool} - ${isForesight?"F=Foresight Free":"G=General N30k"}`);
    setName(""); setPhone(""); setCourse("");
    fetchEnrollments();
  }

  return (
    <div style={{maxWidth:900,margin:"0 auto",padding:12,background:"#f5f5f5",minHeight:"100vh"}}>
      <div style={{background:"white",padding:20,borderRadius:12,boxShadow:"0 4px 15px rgba(0,0,0,0.1)"}}>
        <h3 style={{textAlign:"center",color:"#0a7a3c"}}>🎓 DUCEE OS V20.1 - BUILD FIXED</h3>
        <p style={{textAlign:"center",fontSize:12}}>F=Foresight Free | G=General N30k | DB: ducee-core-os | Total: {enrollments.length} | Phone: {localPupils.length}/10</p>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full Name / Pupil Name" style={{width:"100%",padding:14,margin:"8px 0",border:"1px solid #ccc",borderRadius:8}} />
        <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="Phone 080... / Parent Phone" style={{width:"100%",padding:14,margin:"8px 0",border:"1px solid #ccc",borderRadius:8}} />
        <select value={track} onChange={e=>{setTrack(e.target.value); setCourse("");}} style={{width:"100%",padding:14,margin:"8px 0",border:"1.5px solid #0a7a3c",borderRadius:8,fontWeight:600}}>
          <option value="">-- Select Track --</option>
          <option value="Primary Pupil Foresight Free">🌟 Foresight Free - 10 Pilot Schools (F2026)</option>
          <option value="General Public N30k">💼 General Public - N30k for 9 Courses (G2026)</option>
        </select>
        {isForesight && (
          <div style={{background:"#fff8e1",padding:12,border:"2px solid #b9770e",borderRadius:8,margin:"10px 0"}}>
            <b>🌟 Pilot School:</b>
            <select value={school} onChange={e=>setSchool(e.target.value)} style={{width:"100%",padding:14,margin:"8px 0",borderRadius:8,border:"1.5px solid #b9770e"}}>
              <option value="">-- Select Pilot School --</option>
              {PILOT_SCHOOLS.map(s=><option key={s} value={s}>{s}</option>)}
            </select>
            {school==="OTHER" && <input value={otherSchool} onChange={e=>setOtherSchool(e.target.value)} placeholder="Enter Partnership School" style={{width:"100%",padding:12,margin:"5px 0",border:"1px solid #ccc",borderRadius:6}} />}
            <input value={classLevel} onChange={e=>setClassLevel(e.target.value)} placeholder="Class e.g Primary 4" style={{width:"100%",padding:12,margin:"5px 0",borderRadius:6,border:"1px solid #ccc"}} />
          </div>
        )}
        <select value={course} onChange={e=>setCourse(e.target.value)} style={{width:"100%",padding:14,margin:"8px 0",border:"1.5px solid #0a7a3c",borderRadius:8,fontWeight:600}}>
          <option value="">-- Select Course Package --</option>
          {courses.map(c=><option key={c} value={c}>{c}</option>)}
        </select>
        {!isForesight && track && (
          <div style={{margin:"15px 0",padding:12,background:"#f9f9f9",borderRadius:8}}>
            <b>Payment:</b> <label><input type="radio" checked={payMethod==="Paystack"} onChange={()=>setPayMethod("Paystack")} /> Paystack</label> <label><input type="radio" checked={payMethod==="Bank Transfer"} onChange={()=>setPayMethod("Bank Transfer")} /> Bank Transfer</label>
            {payMethod==="Bank Transfer" && <div style={{background:"#fff8e1",padding:12,border:"2px dashed #ff9800",marginTop:10,borderRadius:8}}>GT Bank: Divine Ultimate Computers - 0229676883 - Use Enrol No as narration!</div>}
          </div>
        )}
        <button onClick={enroll} disabled={loading} style={{width:"100%",padding:14,background:"#0a7a3c",color:"white",border:"none",borderRadius:8,fontWeight:"bold"}}>{loading?"Saving...":"Enroll Now - Save to Supabase"}</button>
        <div style={{marginTop:15,padding:12,background:msg.includes("SUCCESS")?"#e8f5e9":"#f0f8ff",borderRadius:8,textAlign:"center",fontWeight:600}}>{msg || "Fill form and enroll..."}</div>
        {localPupils.length>0 && <div style={{marginTop:15,background:"#eef7ff",padding:12,borderRadius:8}}><b>📱 Pupils on this phone ({localPupils.length}):</b>{localPupils.map((p:any,i:number)=><div key={i} style={{fontSize:12,padding:4,borderBottom:"1px solid #ddd"}}>{i+1}. {p.name} | {p.enrol} | {p.school}</div>)}</div>}
      </div>
      <div style={{background:"white",padding:15,borderRadius:12,marginTop:20}}><b>Live DB - {enrollments.length}</b>{enrollments.map((en:any)=><div key={en.id} style={{fontSize:11,padding:6,borderBottom:"1px solid #eee"}}>{en.enrol_no} ({en.dhr_id}) - {en.pupil_name} | {en.track} | {en.school_name} | {en.course_package}</div>)}</div>
    </div>
  );
}
