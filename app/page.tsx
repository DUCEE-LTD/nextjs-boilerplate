"use client"
import { useState } from "react"
const REAL_SCHOOLS = [
  { code: "SCH-001", name: "ECWA Academy Badariya" },
  { code: "SCH-002", name: "Joda Primary School" },
  { code: "SCH-003", name: "Brilliance Primary School" },
  { code: "SCH-004", name: "High Standard Primary School" },
  { code: "SCH-005", name: "Royal Leads Academy" },
  { code: "SCH-006", name: "Army Childrens School" },
  { code: "SCH-007", name: "Kauran Gandu Model Primary School" },
  { code: "SCH-008", name: "Gesse Phase 1 Model Primary School" },
  { code: "SCH-009", name: "Tudun Wada Model Primary School" },
  { code: "SCH-010", name: "Bayan Tasha Model Primary School" },
]
export default function DuceeForesightPortal() {
  const [form, setForm] = useState({ name:"", phone:"", track:"pilot_schools", school:"" })
  const [code, setCode] = useState("")
  const enroll = () => {
    const enrollmentCode = `FS-${form.school || 'PUBLIC'}-${Date.now().toString().slice(-5)}-DUCEE`
    setCode(enrollmentCode)
  }
  return (
    <div style={{ padding: 24, fontFamily: 'system-ui', maxWidth: 720, margin: '0 auto' }}>
      <div style={{ background: '#000', color: '#fff', padding: 16, borderRadius: 12 }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, margin: 0 }}>DUCEE LTD - RC 2000452</h1>
        <p style={{ margin: '4px 0 0', opacity: 0.8 }}>Foresight Academy - Birnin Kebbi - 10 Schools</p>
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginTop: 16 }}>10 Pilot Schools Portal - 5,000 Pupils</h2>
      <p style={{ color: '#555' }}>Subjects: Hausa, English, Mathematics, BST</p>
      <div style={{ display: 'grid', gap: 12, marginTop: 20 }}>
        <input placeholder="Pupil Full Name" style={{ border: '1.5px solid #ddd', padding: 14, borderRadius: 10 }} onChange={e=>setForm({...form, name:e.target.value})} />
        <input placeholder="Parent Phone" style={{ border: '1.5px solid #ddd', padding: 14, borderRadius: 10 }} onChange={e=>setForm({...form, phone:e.target.value})} />
        <select style={{ border: '1.5px solid #ddd', padding: 14, borderRadius: 10 }} onChange={e=>setForm({...form, track:e.target.value})}>
          <option value="pilot_schools">Track 1 - 10 Pilot Schools</option>
          <option value="general_public">Track 2 - General Public</option>
        </select>
        <select style={{ border: '1.5px solid #ddd', padding: 14, borderRadius: 10 }} onChange={e=>setForm({...form, school:e.target.value})}>
          <option value="">Select Real School</option>
          {REAL_SCHOOLS.map(s=><option key={s.code} value={s.code}>{s.name} - {s.code}</option>)}
        </select>
        <button onClick={enroll} style={{ background: '#000', color: '#fff', padding: 16, borderRadius: 10, fontWeight: 800 }}>GENERATE ENROLLMENT CODE</button>
        {code && <div style={{ background: '#dcfce7', border: '2px solid #22c55e', padding: 18, borderRadius: 12, textAlign: 'center', fontWeight: 900 }}>{code}</div>}
      </div>
    </div>
  )
}
