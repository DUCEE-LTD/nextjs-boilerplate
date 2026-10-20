"use client";
import { useState } from "react";
export default function Page(){
  const [m,setM]=useState("enroll");
  const [code,setCode]=useState("");
  const [name,setName]=useState("");
  const [res,setRes]=useState<any>(null);
  return (
    <div style={{minHeight:"100vh",display:"flex",justifyContent:"center",padding:16,background:"#fff"}}>
      <div style={{width:"100%",maxWidth:400,border:"1px solid #ddd",borderRadius:16,padding:16}}>
        <h1 style={{fontWeight:900,textAlign:"center",fontSize:14}}>DUCEE LTD - FORESIGHT 400 V20</h1>
        <p style={{fontSize:10,color:"green",textAlign:"center"}}>LIVE DB - Track + Payment</p>
        <div style={{display:"flex",gap:8,margin:"12px 0"}}>
          <button onClick={()=>setM("enroll")} style={{flex:1,padding:8,borderRadius:20,background:m==="enroll"?"#000":"#eee",color:m==="enroll"?"#fff":"#000",fontSize:12}}>Enroll</button>
          <button onClick={()=>setM("track")} style={{flex:1,padding:8,borderRadius:20,background:m==="track"?"#000":"#eee",color:m==="track"?"#fff":"#000",fontSize:12}}>Track</button>
          <button onClick={()=>setM("pay")} style={{flex:1,padding:8,borderRadius:20,background:m==="pay"?"#000":"#eee",color:m==="pay"?"#fff":"#000",fontSize:12}}>Pay</button>
        </div>
        {m==="enroll" && <form onSubmit={e=>{e.preventDefault();alert("Enrolled: DUCEE-"+Date.now());}} style={{display:"flex",flexDirection:"column",gap:8}}>
          <input required placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} style={{border:"1px solid #ccc",padding:12,borderRadius:12}}/>
          <input required placeholder="Phone" style={{border:"1px solid #ccc",padding:12,borderRadius:12}}/>
          <button style={{background:"#000",color:"#fff",padding:12,borderRadius:12}}>ENROLL</button>
        </form>}
        {m==="track" && <form onSubmit={e=>{e.preventDefault();setRes({code:code||"DUCEE-123456",name:name||"Test",pay:"pending",pkg:"Foresight 400"});}} style={{display:"flex",flexDirection:"column",gap:8}}>
          <input required placeholder="Ducee Code" value={code} onChange={e=>setCode(e.target.value)} style={{border:"1px solid #ccc",padding:12,borderRadius:12}}/>
          <button style={{background:"#000",color:"#fff",padding:12,borderRadius:12}}>TRACK PACKAGE</button>
          {res && <div style={{border:"1px solid #ccc",padding:12,borderRadius:12,background:"#f9f9f9",fontSize:12}}><p>Code: {res.code}</p><p>Payment: {res.pay}</p><p>Package: {res.pkg}</p><button onClick={()=>window.print()} style={{width:"100%",background:"green",color:"#fff",padding:8,borderRadius:12,marginTop:8}}>Print</button></div>}
        </form>}
        {m==="pay" && <div style={{textAlign:"center"}}><input placeholder="Ducee Code" value={code} onChange={e=>setCode(e.target.value)} style={{border:"1px solid #ccc",padding:12,borderRadius:12,width:"100%"}}/><button onClick={()=>window.open("https://paystack.com/pay/ducee-ltd","_blank")} style={{width:"100%",background:"green",color:"#fff",padding:12,borderRadius:12,marginTop:8}}>PAY WITH PAYSTACK</button></div>}
      </div>
    </div>
  );
}
