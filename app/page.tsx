"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PILOT_SCHOOLS = [
  "ECWA Academy Badariya","Joda Primary School","Brilliance Primary School","High Standard Primary School","Royal Leads Academy","Army Childrens School","Kauran Gandu Model Primary School","Gesse Phase 1 Model Primary School","Tudun Wada Model Primary School","Bayan Tasha Model Primary School"
];
const TRACK1_SUBJECTS = ["Hausa","English Language","Mathematics","Basic Science and Technology"];
const TRACK2_SUBJECTS = ["Digital Health Operations","AI and Automations","Cybersecurity","MIS","Data Analytics","Computer Operations & Programming","Hardware & Software Engineering","Electrical & Electronic Engineering","Networking"];

export default function DuceeForesightPortal(){
  const [tab,setTab]=useState<"track1"|"track2">("track1");
  const [schools,setSchools]=useState<any[]>([]);
  const [enrollments,setEnrollments]=useState<any[]>([]);
  const [form,setForm]=useState({name:"",phone:"",school:"SCH-001",classLevel:"Primary 5",subjects:TRACK1_SUBJECTS,track:"TRACK1_PILOT"});
  const [form2,setForm2]=useState({name:"",phone:"",subjects:[] as string[],package:"FORESIGHT_PUBLIC"});
  const [loading,setLoading]=useState(false);

  useEffect(()=>{ fetchSchools(); fetchEnrollments(); },[]);
  async function fetchSchools(){ const {data}=await supabase.from("schools").select("*"); if(data) setSchools(data); }
  async function fetchEnrollments(){ const {data}=await supabase.from("foresight_enrollments").select("*").order("created_at",{ascending:false}).limit(50); if(data) setEnrollments(data); }

  function genCode(track:string){ return `DUCEE-${track==='TRACK1_PILOT'?'400': 'PUB'}-${Math.floor(1000+Math.random()*9000)}-${Date.now().toString().slice(-4)}`; }

  async function enrollTrack1(e:any){
    e.preventDefault(); setLoading(true);
    const code=genCode("TRACK1_PILOT");
    const {error}=await supabase.from("foresight_enrollments").insert([{pupil_name:form.name,parent_phone:form.phone,school_code:form.school,track:form.track,class_level:form.classLevel,subjects:form.subjects,ducee_code:code,status:"ENROLLED"}]);
    setLoading(false);
    if(!error){ alert(`✅ TRACK 1 ENROLLED!\nCode: ${code}\n${form.name} → ${form.school}\nSubjects: ${form.subjects.join(", ")}`); setForm({...form,name:"",phone:""}); fetchEnrollments(); } else alert(error.message);
  }
  async function enrollTrack2(e:any){
    e.preventDefault(); if(form2.subjects.length===0) return alert("Select at least 1 of 9 subjects"); setLoading(true);
    const code=genCode("TRACK2_PUBLIC");
    const {error}=await supabase.from("foresight_enrollments").insert([{pupil_name:form2.name,parent_phone:form2.phone,school_code:"GENERAL-PUBLIC",track:"TRACK2_PUBLIC",class_level:form2.package,subjects:form2.subjects,ducee_code:code,status:"ENROLLED"}]);
    setLoading(false);
    if(!error){ alert(`✅ TRACK 2 ENROLLED!\nCode: ${code}\n${form2.name}\n9-Subjects: ${form2.subjects.join(", ")}`); setForm2({name:"",phone:"",subjects:[],package:"FORESIGHT_PUBLIC"}); fetchEnrollments(); } else alert(error.message);
  }

  return (
    <div style={{maxWidth:900,margin:"20px auto",padding:20,fontFamily:"system-ui"}}>
      <h1 style={{fontWeight:900,fontSize:28,textAlign:"center"}}>DUCEE LTD — FORESIGHT 400 PORTAL 🧠</h1>
      <p style={{textAlign:"center",color:"green",fontWeight:700}}>✅ Connected to ducee-core-os Supabase | LIVE DB — Total: {enrollments.length}</p>

      <div style={{display:"flex",gap:10,justifyContent:"center",margin:"20px 0"}}>
        <button onClick={()=>setTab("track1")} style={{padding:"12px 20px",background:tab==="track1"?"black":"#eee",color:tab==="track1"?"white":"black",borderRadius:8,fontWeight:700}}>TRACK 1: 10 PILOT SCHOOLS (400 Pupils)</button>
        <button onClick={()=>setTab("track2")} style={{padding:"12px 20px",background:tab==="track2"?"black":"#eee",color:tab==="track2"?"white":"black",borderRadius:8,fontWeight:700}}>TRACK 2: GENERAL PUBLIC (9 Subjects)</button>
      </div>

      {tab==="track1" && (
        <div style={{background:"#f8fafc",padding:20,borderRadius:12}}>
          <h3>TRACK 1 — 10 Pilot Schools | Core: Hausa, English, Maths, Basic Sci & Tech</h3>
          <form onSubmit={enrollTrack1} style={{display:"grid",gap:12}}>
            <input required placeholder="Pupil Full Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} style={{padding:12,borderRadius:8,border:"1px solid #ccc"}}/>
            <input required placeholder="Parent Phone (080...)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} style={{padding:12,borderRadius:8,border:"1px solid #ccc"}}/>
            <select value={form.school} onChange={e=>setForm({...form,school:e.target.value})} style={{padding:12,borderRadius:8}}>{schools.map((s:any)=><option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}{schools.length===0 && PILOT_SCHOOLS.map((n,i)=><option key={i} value={`SCH-00${i+1}`}>{`SCH-00${i+1} - ${n}`}</option>)}</select>
            <select value={form.classLevel} onChange={e=>setForm({...form,classLevel:e.target.value})} style={{padding:12,borderRadius:8}}><option>Primary 4</option><option>Primary 5</option><option>Primary 6</option><option>JSS 1</option><option>JSS 2</option></select>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>{TRACK1_SUBJECTS.map(sub=><label key={sub} style={{background:"white",padding:"6px 10px",borderRadius:6,border:"1px solid #ddd"}}><input type="checkbox" checked={form.subjects.includes(sub)} onChange={e=>{ if(e.target.checked) setForm({...form,subjects:[...form.subjects,sub]}); else setForm({...form,subjects:form.subjects.filter(s=>s!==sub)})}}/> {sub}</label>)}</div>
            <button disabled={loading} style={{padding:14,background:"black",color:"white",borderRadius:8,fontWeight:800}}>{loading?"ENROLLING...":"ENROLL TRACK 1 & GENERATE DUCEE CODE"}</button>
          </form>
        </div>
      )}

      {tab==="track2" && (
        <div style={{background:"#fff7ed",padding:20,borderRadius:12,border:"2px solid orange"}}>
          <h3>TRACK 2 — GENERAL PUBLIC | 9 Professional Subjects</h3>
          <p style={{fontSize:13}}>Digital Health Operations, AI and Automations, Cybersecurity, MIS, Data Analytics, Computer Ops & Programming, Hardware & Software Eng, Electrical & Electronic Eng, Networking</p>
          <form onSubmit={enrollTrack2} style={{display:"grid",gap:12}}>
            <input required placeholder="Full Name (Public Learner)" value={form2.name} onChange={e=>setForm2({...form2,name:e.target.value})} style={{padding:12,borderRadius:8,border:"1px solid #ccc"}}/>
            <input required placeholder="Phone / WhatsApp" value={form2.phone} onChange={e=>setForm2({...form2,phone:e.target.value})} style={{padding:12,borderRadius:8,border:"1px solid #ccc"}}/>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>{TRACK2_SUBJECTS.map(sub=><label key={sub} style={{background:"white",padding:"8px",borderRadius:6,border:"1px solid #ddd",fontSize:13}}><input type="checkbox" checked={form2.subjects.includes(sub)} onChange={e=>{ if(e.target.checked) setForm2({...form2,subjects:[...form2.subjects,sub]}); else setForm2({...form2,subjects:form2.subjects.filter(s=>s!==sub)})}}/> {sub}</label>)}</div>
            <button disabled={loading} style={{padding:14,background:"#ea580c",color:"white",borderRadius:8,fontWeight:800}}>{loading?"ENROLLING...":"ENROLL TRACK 2 (9 SUBJECTS) & GENERATE CODE"}</button>
          </form>
        </div>
      )}

      <div style={{marginTop:30}}>
        <h4>Live Enrollments from Supabase (ducee-core-os) — {enrollments.length}</h4>
        {enrollments.length===0?"No enrollments yet. Enroll first pupil!":enrollments.map((en:any)=><div key={en.id} style={{padding:10,background:"white",border:"1px solid #eee",borderRadius:8,marginBottom:6,fontSize:13}}><b>{en.ducee_code}</b> — {en.pupil_name} | {en.track} | {en.school_code} | {en.subjects?.join(", ")} | {en.parent_phone}</div>)}
      </div>
      <p style={{fontSize:11,color:"#888",marginTop:20}}>Schools: {schools.length||10} loaded | DB: foresight_enrollments | Project: ducee-core-os | Tracks: Pilot 400 + Public 9 | RC 2000452</p>
    </div>
  );
}
