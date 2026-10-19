'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

type School = { code: string; name: string };

export default function DuceeForesightPortal() {
  const [schools, setSchools] = useState<School[]>([]);
  const [pupilName, setPupilName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [track, setTrack] = useState('JAMB');
  const [schoolCode, setSchoolCode] = useState('SCH-001');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [lastCode, setLastCode] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from('schools').select('*').order('code').then(({data}) => {
      if(data) { setSchools(data); }
    });
    loadEnrollments();
  }, []);

  async function loadEnrollments() {
    const {data} = await supabase.from('foresight_enrollments').select('*').order('created_at',{ascending:false}).limit(20);
    if(data) setEnrollments(data);
  }

  async function handleEnroll() {
    if(!pupilName) { alert('Enter pupil name'); return; }
    setLoading(true);
    const code = `DUCEE-${schoolCode.split('-')[1]}-${track.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const {error} = await supabase.from('foresight_enrollments').insert({
      pupil_name: pupilName,
      parent_phone: parentPhone,
      track,
      school_code: schoolCode,
      enrollment_code: code
    });
    setLoading(false);
    if(error){ alert('Error: '+error.message); return; }
    setLastCode(code);
    setPupilName(''); setParentPhone('');
    loadEnrollments();
    alert('ENROLLED! Code: '+code);
  }

  return (
    <div style={{fontFamily:'system-ui', maxWidth:900, margin:'20px auto', padding:20}}>
      <h1 style={{fontSize:32, fontWeight:900}}>DUCEE LTD — FORESIGHT 400 PORTAL 🧠</h1>
      <p style={{color:'green', fontWeight:700}}>✅ Connected to ducee-core-os Supabase | LIVE DB</p>
      <p>Total Enrolled (DB): <b>{enrollments.length}</b> {lastCode && <>| Last Code: <b style={{color:'blue'}}>{lastCode}</b></>}</p>

      <div style={{display:'grid', gap:12, background:'#f8fafc', padding:20, borderRadius:16, marginTop:20}}>
        <h3>Enroll Pupil (Saves to Supabase)</h3>
        <input placeholder="Pupil Full Name" value={pupilName} onChange={e=>setPupilName(e.target.value)} style={{padding:12, borderRadius:8, border:'1px solid #ccc'}}/>
        <input placeholder="Parent Phone (080...)" value={parentPhone} onChange={e=>setParentPhone(e.target.value)} style={{padding:12, borderRadius:8, border:'1px solid #ccc'}}/>
        <select value={track} onChange={e=>setTrack(e.target.value)} style={{padding:12, borderRadius:8}}>
          <option>JAMB</option><option>WAEC</option><option>NECO</option><option>Primary 5</option><option>JSCE</option>
        </select>
        <select value={schoolCode} onChange={e=>setSchoolCode(e.target.value)} style={{padding:12, borderRadius:8}}>
          {schools.map(s=> <option key={s.code} value={s.code}>{s.code} - {s.name}</option>)}
        </select>
        <button onClick={handleEnroll} disabled={loading} style={{padding:14, background:'black', color:'white', borderRadius:12, fontWeight:800}}>
          {loading? 'Saving to DB...':'ENROLL & GENERATE DUCEE CODE'}
        </button>
      </div>

      <div style={{marginTop:24}}>
        <h3>Live Enrollments from Supabase (ducee-core-os)</h3>
        <div style={{display:'grid', gap:8}}>
          {enrollments.map((e:any)=>
            <div key={e.id} style={{padding:12, border:'1px solid #eee', borderRadius:10, display:'flex', justifyContent:'space-between'}}>
              <span><b>{e.pupil_name}</b> — {e.track} — {e.school_code}</span>
              <span style={{fontFamily:'monospace', color:'blue'}}>{e.enrollment_code}</span>
            </div>
          )}
          {enrollments.length===0 && <p>No enrollments yet. Enroll first pupil!</p>}
        </div>
      </div>

      <p style={{marginTop:30, fontSize:12, color:'#666'}}>Schools: {schools.length} loaded | DB: foresight_enrollments | Project: ducee-core-os | Next.js 16.2.4</p>
    </div>
  );
}
