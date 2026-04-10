import{useState,useEffect,useCallback,useMemo,useRef}from"react";
import{useRemoteEvents}from"./useRemoteEvents";
import{T as TR,LANGUAGES}from"./translations";

// PhillyHub PWA — Free Tier (Landmarks + Events + GPS)
// Full app available on App Store & Google Play
// Lil Pill Studios © 2026

const DK={sky:"#89CFF0",coral:"#F09898",yellow:"#F5E87A",green:"#7BD4A0",purple:"#C4A8E0",orange:"#E0A870",red:"#E63946",gold:"#D4AF37",bg:"#0F1117",bgCard:"#161820",bgSheet:"#12141C",bgElev:"#1C1E28",text:"rgba(255,255,255,0.92)",textSec:"rgba(255,255,255,0.55)",textMut:"rgba(255,255,255,0.3)",textHint:"rgba(255,255,255,0.18)",bdr:"rgba(255,255,255,0.06)",grad:"linear-gradient(135deg,#89CFF0,#F09898,#F5E87A)",r:12,rs:8};
const LT={sky:"#2563EB",coral:"#E11D48",yellow:"#CA8A04",green:"#16A34A",purple:"#7C3AED",orange:"#EA580C",red:"#DC2626",gold:"#B8860B",bg:"#F8F9FA",bgCard:"#FFFFFF",bgSheet:"#FFFFFF",bgElev:"#F0F1F3",text:"rgba(0,0,0,0.87)",textSec:"rgba(0,0,0,0.55)",textMut:"rgba(0,0,0,0.33)",textHint:"rgba(0,0,0,0.12)",bdr:"rgba(0,0,0,0.08)",grad:"linear-gradient(135deg,#2563EB,#E11D48,#CA8A04)",r:12,rs:8};

const APPSTORE_URL="https://apps.apple.com/us/app/phillyhub/id6761440105";

const LM=[
{id:"lb01",name:"Liberty Bell",lat:39.9496,lng:-75.1503,type:"monument",addr:"526 Market St",desc:"Iconic symbol of American independence."},
{id:"lb02",name:"Independence Hall",lat:39.9489,lng:-75.1500,type:"monument",addr:"520 Chestnut St",desc:"Where the Declaration and Constitution were adopted."},
{id:"lb03",name:"Philadelphia Museum of Art",lat:39.9656,lng:-75.1810,type:"museum",addr:"2600 Benjamin Franklin Pkwy",desc:"240K+ works. 2026: 'A Nation of Artists.'"},
{id:"lb04",name:"Eastern State Penitentiary",lat:39.9683,lng:-75.1727,type:"museum",addr:"2027 Fairmount Ave",desc:"Al Capone did time here. Now a museum."},
{id:"lb05",name:"Betsy Ross House",lat:39.9529,lng:-75.1446,type:"monument",addr:"239 Arch St",desc:"Where the first American flag was reportedly sewn."},
{id:"lb06",name:"Elfreth's Alley",lat:39.9527,lng:-75.1425,type:"monument",addr:"124-126 Elfreth's Alley",desc:"Oldest continuously inhabited street in America."},
{id:"lb07",name:"Christ Church",lat:39.9523,lng:-75.1441,type:"church",addr:"20 N American St",desc:"Washington and Franklin worshipped here."},
{id:"lb08",name:"Reading Terminal Market",lat:39.9533,lng:-75.1592,type:"monument",addr:"1136 Arch St",desc:"80+ merchants. Amish vendors — get there early Saturday."},
{id:"lb09",name:"City Hall",lat:39.9524,lng:-75.1636,type:"monument",addr:"1401 JFK Blvd",desc:"Largest municipal building in the U.S."},
{id:"lb10",name:"LOVE Park",lat:39.9543,lng:-75.1656,type:"park",addr:"1599 JFK Blvd",desc:"Robert Indiana's LOVE sculpture."},
{id:"lb11",name:"Museum of the American Revolution",lat:39.9483,lng:-75.1464,type:"museum",addr:"101 S 3rd St",desc:"2026: 'The Declaration's Journey' exhibit."},
{id:"lb12",name:"Penn's Landing",lat:39.9459,lng:-75.1416,type:"park",addr:"101 S Columbus Blvd",desc:"Waterfront on the Delaware."},
{id:"lb13",name:"Edgar Allan Poe House",lat:39.9618,lng:-75.1498,type:"museum",addr:"532 N 7th St",desc:"Only surviving Poe residence in Philly. Free."},
{id:"lb14",name:"Mütter Museum",lat:39.9531,lng:-75.1764,type:"museum",addr:"19 S 22nd St",desc:"Medical oddities. Einstein's brain."},
{id:"lb15",name:"Rittenhouse Square",lat:39.9496,lng:-75.1718,type:"park",addr:"210 W Rittenhouse Sq",desc:"Tree-lined paths, fountain, restaurants."},
{id:"lb16",name:"African American Museum",lat:39.9536,lng:-75.1515,type:"museum",addr:"701 Arch St",desc:"First institution by a major city for African American heritage."},
{id:"lb17",name:"Franklin's Grave",lat:39.9498,lng:-75.1519,type:"monument",addr:"340 N 5th St",desc:"Christ Church Burial Ground. Toss a penny."},
{id:"lb18",name:"Lemon Hill (Fan Festival)",lat:39.9715,lng:-75.1830,type:"park",addr:"Sedgley Dr",desc:"Soccer fan festival — up to 25K daily."},
{id:"lb19",name:"Sports Complex",lat:39.9060,lng:-75.1680,type:"monument",addr:"3501 S Broad St",desc:"Lincoln Financial Field, Citizens Bank Park."},
{id:"lb20",name:"FDR Park",lat:39.9005,lng:-75.1760,type:"park",addr:"1500 Pattison Ave",desc:"200 acres near stadiums. Pre-match hangout."},
// ─── BLACK AMERICAN HISTORY ────────────────────────────────────────
{id:"lb33",name:"Mother Bethel AME Church",lat:39.9438,lng:-75.1498,type:"church",addr:"419 S 6th St",desc:"Oldest AME congregation in America. Founded by Richard Allen, born enslaved. National Historic Landmark."},
{id:"lb34",name:"Johnson House Historic Site",lat:40.0340,lng:-75.1710,type:"museum",addr:"6306 Germantown Ave",desc:"Confirmed Underground Railroad station. Germantown Quakers sheltered freedom seekers here."},
{id:"lb35",name:"Belmont Mansion",lat:39.9780,lng:-75.2020,type:"museum",addr:"2000 Belmont Mansion Dr",desc:"Underground Railroad site in Fairmount Park. Now the American Women's Heritage Museum. Free."},
{id:"lb36",name:"Octavius V. Catto Memorial",lat:39.9524,lng:-75.1636,type:"monument",addr:"City Hall, S Plaza",desc:"First public statue of a named African American in Philadelphia. Civil rights pioneer."},
{id:"lb37",name:"President's House",lat:39.9497,lng:-75.1498,type:"monument",addr:"525 Market St",desc:"Where Washington and Adams lived — and where 9 enslaved people served them. Open-air memorial."},
{id:"lb38",name:"Paul Robeson House",lat:39.9570,lng:-75.1870,type:"museum",addr:"4951 Walnut St",desc:"Home of the athlete, actor, singer, and civil rights activist. National Historic Landmark."},
{id:"lb39",name:"Colored Girls Museum",lat:39.9600,lng:-75.2050,type:"museum",addr:"4613 Newhall St",desc:"Intimate museum celebrating the stories of ordinary Black women. By appointment."},
{id:"lb40",name:"Church of the Advocate",lat:39.9780,lng:-75.1620,type:"church",addr:"1801 W Diamond St",desc:"Site of the 1970 Black Panther convention. Murals by Walter Edmonds. Gothic Revival."},
{id:"lb41",name:"Fair Hill Burial Ground",lat:39.9920,lng:-75.1420,type:"monument",addr:"2901 Germantown Ave",desc:"Resting place of Lucretia Mott and Robert Purvis — abolitionists who shaped the movement."},
{id:"lb42",name:"Engine Company 11",lat:39.9540,lng:-75.1700,type:"monument",addr:"1226 Ridge Ave",desc:"First Black firehouse in Philadelphia."},
{id:"lb43",name:"Henry 'Hank' Gathers Recreation Center",lat:39.9750,lng:-75.1560,type:"monument",addr:"2501 W Lehigh Ave",desc:"Named for the North Philly basketball legend. Community center in Strawberry Mansion."},
// ─── STEPHEN GIRARD LANDMARKS ──────────────────────────────────────
{id:"lb44",name:"Girard College / Founder's Hall",lat:39.9720,lng:-75.1740,type:"museum",addr:"2101 S College Ave",desc:"Founded by Stephen Girard for orphaned children. Greek Revival masterpiece. Desegregated via Supreme Court in 1968."},
{id:"lb45",name:"First Bank of the United States",lat:39.9481,lng:-75.1451,type:"monument",addr:"116 S 3rd St",desc:"America's first central bank. Hamilton's vision, Girard saved it."},
{id:"lb46",name:"Girard Row",lat:39.9435,lng:-75.1570,type:"monument",addr:"326-334 Spruce St",desc:"Row houses built by Girard's estate. Greek Revival. Still standing in Society Hill."},
{id:"lb47",name:"Bush Hill (Girard's Yellow Fever Hospital)",lat:39.9650,lng:-75.1700,type:"monument",addr:"Near 17th & Spring Garden (site)",desc:"During the 1793 yellow fever epidemic, Girard personally nursed the sick here when everyone else fled."},
];

const EV=[
{id:"ev01",title:"Ivory Coast vs Ecuador",date:"2026-06-14",time:"7:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group E opener.",tix:"https://www.fifa.com/tickets"},
{id:"ev02",title:"Brazil vs Haiti",date:"2026-06-19",time:"9:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group C.",tix:"https://www.fifa.com/tickets"},
{id:"ev03",title:"France vs Playoff Winner",date:"2026-06-22",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group I.",tix:"https://www.fifa.com/tickets"},
{id:"ev04",title:"Curaçao vs Ivory Coast",date:"2026-06-25",time:"4:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group E final matchday.",tix:"https://www.fifa.com/tickets"},
{id:"ev05",title:"Croatia vs Ghana",date:"2026-06-27",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Group L.",tix:"https://www.fifa.com/tickets"},
{id:"ev06",title:"Round of 16",date:"2026-07-04",time:"5:00 PM",venue:"Philadelphia Stadium",addr:"1 Lincoln Financial Field Way",lat:39.9060,lng:-75.1680,cat:"fifa",free:false,desc:"Knockout on America's 250th birthday.",tix:"https://www.fifa.com/tickets"},
{id:"ev07",title:"Soccer Fan Festival at Lemon Hill",date:"2026-06-11",time:"All Day",venue:"Lemon Hill",addr:"Sedgley Dr",lat:39.9715,lng:-75.1830,cat:"fifa",free:true,desc:"5-week watch party festival."},
{id:"ev08",title:"52 Weeks of Firsts",date:"2026-01-01",time:"Weekly",venue:"Citywide",addr:"Various",lat:39.9524,lng:-75.1636,cat:"america250",free:true,desc:"Free weekly events honoring Philly firsts."},
{id:"ev09",title:"Wawa Welcome America",date:"2026-06-19",time:"All Day",venue:"Benjamin Franklin Pkwy",addr:"Benjamin Franklin Parkway",lat:39.9630,lng:-75.1750,cat:"america250",free:true,desc:"16 days, 6 nights fireworks, July 3 parade."},
{id:"ev10",title:"July 4th Fireworks & Concert",date:"2026-07-04",time:"8:00 PM",venue:"Art Museum / Parkway",addr:"2600 Benjamin Franklin Pkwy",lat:39.9656,lng:-75.1810,cat:"fireworks",free:true,desc:"Nation's biggest July 4th event."},
{id:"ev11",title:"MLB All-Star Game",date:"2026-07-16",time:"7:00 PM",venue:"Citizens Bank Park",addr:"1 Citizens Bank Way",lat:39.9061,lng:-75.1665,cat:"concert",free:false,desc:"Baseball's midsummer classic."},
{id:"ev12",title:"Juneteenth Parade",date:"2026-06-21",time:"10 AM",venue:"Malcolm X Park",addr:"Pine St & 52nd St",lat:39.9570,lng:-75.1590,cat:"parade",free:true,desc:"Music, dance, food, celebration of freedom."},
{id:"ev13",title:"Philadelphia Flower Show",date:"2026-02-28",time:"10 AM",venue:"Convention Center",addr:"1101 Arch St",lat:39.9545,lng:-75.1597,cat:"festival",free:false,desc:"'Rooted: Origins of American Gardening.'"},
{id:"ev14",title:"ArtPhilly: What Now",date:"2026-05-01",time:"Various",venue:"Citywide",addr:"Various",lat:39.9524,lng:-75.1636,cat:"festival",free:true,desc:"30+ original art projects citywide."},
];

function pC(t){return{monument:"#F09898",museum:"#F5E87A",park:"#7BD4A0",church:"#C4A8E0"}[t]||"#89CFF0"}
function eC(c){return{fifa:"#E63946",america250:"#3B82F6",fireworks:"#F59E0B",concert:"#8B5CF6",festival:"#10B981",parade:"#EC4899"}[c]||"#89CFF0"}
function eL(c){return{fifa:"Soccer 2026",america250:"250th",fireworks:"July 4th",concert:"Sports",festival:"Arts",parade:"Parade"}[c]||c}
function fD(d){const dt=new Date(d+"T12:00:00");return dt.toLocaleDateString("en-US",{month:"short",day:"numeric"})}
const TODAY=new Date().toISOString().slice(0,10);

const mkS=P=>({
  app:{position:"relative",width:"100%",maxWidth:480,margin:"0 auto",height:"100dvh",overflow:"hidden",background:P.bg,fontFamily:"system-ui,-apple-system,sans-serif",color:P.text},
  sI:{width:"100%",height:42,padding:"0 14px",background:P===DK?"rgba(15,17,23,0.88)":"rgba(255,255,255,0.92)",backdropFilter:"blur(20px)",border:`1px solid ${P.bdr}`,borderRadius:21,color:P.text,fontSize:14,outline:"none"},
  sh:ty=>({position:"absolute",bottom:0,left:0,right:0,zIndex:20,background:P.bgSheet,borderRadius:"24px 24px 0 0",transition:"transform 0.35s cubic-bezier(0.32,0.72,0,1)",transform:`translateY(${ty}px)`,boxShadow:"0 -8px 40px rgba(0,0,0,0.3)",touchAction:"none"}),
  ch:(a,c)=>({display:"inline-flex",alignItems:"center",gap:5,padding:"7px 12px",borderRadius:20,cursor:"pointer",background:a?`${c}18`:"transparent",border:`1px solid ${a?`${c}40`:P.bdr}`,color:a?c:P.textSec,fontSize:12,fontWeight:500,whiteSpace:"nowrap",flexShrink:0}),
  cd:d=>({background:P.bgCard,borderRadius:P.r,padding:"12px 14px",marginBottom:8,cursor:"pointer",border:`1px solid ${P.bdr}`,animation:`fsu 0.3s ease ${d}s both`}),
  bg:c=>({display:"inline-flex",padding:"2px 7px",borderRadius:5,fontSize:10,fontWeight:600,background:`${c}18`,color:c}),
  ov:{position:"absolute",inset:0,zIndex:30,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)",display:"flex",alignItems:"flex-end",justifyContent:"center",animation:"fi 0.2s ease"},
  dc:{width:"100%",maxWidth:480,background:P.bgSheet,borderRadius:"24px 24px 0 0",padding:"20px 20px 40px",animation:"su 0.3s ease",maxHeight:"85dvh",overflowY:"auto"},
  cb:{width:34,height:34,borderRadius:17,border:`1px solid ${P.bdr}`,background:P.bgElev,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0},
  ir:{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:P.bgElev,borderRadius:P.rs,marginBottom:6},
  nv:{position:"absolute",bottom:0,left:0,right:0,zIndex:25,background:P===DK?"rgba(15,17,23,0.92)":"rgba(255,255,255,0.95)",backdropFilter:"blur(20px)",borderTop:`1px solid ${P.bdr}`,display:"flex",justifyContent:"space-around",alignItems:"center",padding:"8px 0 env(safe-area-inset-bottom,8px)",height:56},
  ni:a=>({display:"flex",flexDirection:"column",alignItems:"center",gap:2,cursor:"pointer",padding:"4px 16px",color:a?P.sky:P.textMut}),
  cps:{display:"flex",gap:6,padding:"12px 14px 6px",overflowX:"auto",scrollbarWidth:"none"},
  lst:{padding:"0 14px 100px",overflowY:"auto",maxHeight:"calc(70dvh - 110px)",scrollbarWidth:"none"},
  cnt:{padding:"3px 14px 6px",fontSize:11,color:P.textMut,fontFamily:"monospace"},
  gl:{height:2,borderRadius:1,background:P.grad,opacity:0.5},
  tt:{fontSize:20,fontWeight:700,lineHeight:1.2,marginBottom:6},
  nm:{fontSize:14,fontWeight:600,marginBottom:3},
});

// Upsell banner component
function Upsell({P,msg}){
  return<div style={{background:`${P.sky}08`,border:`1px solid ${P.sky}25`,borderRadius:P.r,padding:"14px 16px",marginBottom:12,cursor:"pointer",textAlign:"center"}}>
    <div style={{fontSize:14,fontWeight:600,color:P.sky,marginBottom:4}}>📱 {msg||"Get the full app"}</div>
    <div style={{fontSize:11,color:P.textSec}}>Transit, 80+ restaurants, services, walking tours & more</div>
    <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:10,flexWrap:"wrap"}}>
      <div onClick={()=>window.open(APPSTORE_URL,"_blank")} style={{padding:"8px 16px",borderRadius:20,background:P.sky,color:"#fff",fontSize:12,fontWeight:600}}>Download on App Store</div>
      <div style={{padding:"8px 16px",borderRadius:20,background:P.bgElev,color:P.textSec,fontSize:12,fontWeight:500,border:`1px solid ${P.bdr}`}}>Android Coming Soon</div>
    </div>
  </div>
}

// Map
function MapV({pins,selId,onPin,P}){
  const[pan,setPan]=useState({x:0,y:0});const startRef=useRef(null);const[dragging,setDrag]=useState(false);
  const cL=39.9526,cN=-75.1652,z=13;
  const pr=useCallback((lat,lng)=>{const sc=Math.pow(2,z)*1.2;return{x:((lng-cN)*sc*2.5)+240+pan.x,y:((cL-lat)*sc*3.2)+300+pan.y}},[pan]);
  const onTS=e=>{startRef.current={x:e.touches[0].clientX-pan.x,y:e.touches[0].clientY-pan.y};setDrag(true)};
  const onTM=e=>{if(!dragging||!startRef.current)return;e.preventDefault();const t=e.touches[0];setPan({x:t.clientX-startRef.current.x,y:t.clientY-startRef.current.y})};
  const mbg=P===DK?"linear-gradient(145deg,#0D1520,#111827,#0F172A)":"linear-gradient(145deg,#E8ECF0,#F0F4F8,#E4E8EC)";
  const gc=P===DK?"rgba(255,255,255,0.05)":"rgba(0,0,0,0.04)";
  return<div style={{position:"absolute",inset:0,background:mbg,overflow:"hidden",touchAction:"none"}} onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={()=>setDrag(false)}>
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}}>{Array.from({length:25},(_,i)=><line key={i} x1={0} y1={i*35} x2={520} y2={i*35} stroke={gc} strokeWidth={0.5}/>)}</svg>
    {pins.map(lm=>{const p=pr(lm.lat,lm.lng);const sel=selId===lm.id;const c=lm.pc||pC(lm.type||"");return<div key={lm.id} onClick={()=>onPin(lm.id)} style={{position:"absolute",left:p.x-10,top:p.y-24,cursor:"pointer",zIndex:sel?10:5,transform:sel?"scale(1.3)":"scale(1)",transition:"transform 0.2s"}}>
      <svg width={20} height={28} viewBox="0 0 28 36"><path d="M14 0C6.27 0 0 6.27 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.27 21.73 0 14 0z" fill={c} fillOpacity={sel?0.9:0.65}/><circle cx={14} cy={13} r={3} fill="white" fillOpacity={0.9}/></svg>
      {sel&&<div style={{position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",background:P.bgCard,padding:"2px 6px",borderRadius:5,whiteSpace:"nowrap",fontSize:9,fontWeight:600,color:P.text,border:`1px solid ${c}40`}}>{lm.name}</div>}
    </div>})}
  </div>;
}

// Onboarding
function Onboarding({onDone,lang,onLang,P}){
  const[step,setStep]=useState(0);const t=TR[lang]||TR.en;
  if(step===0)return<div style={{position:"absolute",inset:0,zIndex:50,background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 24px",animation:"fi 0.4s ease"}}>
    <div style={{fontSize:24,fontWeight:700,marginBottom:20,textAlign:"center"}}>{t.chooseLang}</div>
    <div style={{width:"100%",maxWidth:320,display:"flex",flexDirection:"column",gap:8,maxHeight:"55dvh",overflowY:"auto",scrollbarWidth:"none"}}>
      {LANGUAGES.map(l=><div key={l.code} onClick={()=>{onLang(l.code);setStep(1)}} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",borderRadius:12,background:lang===l.code?`${P.sky}15`:P.bgCard,border:`1px solid ${lang===l.code?`${P.sky}40`:P.bdr}`,cursor:"pointer"}}>
        <span style={{fontSize:18}}>{l.flag}</span><div><div style={{fontSize:14,fontWeight:600}}>{l.native}</div><div style={{fontSize:11,color:P.textMut}}>{l.name}</div></div>
      </div>)}
    </div>
    <div style={{position:"absolute",bottom:16,fontSize:9,color:P.textHint,letterSpacing:3,fontFamily:"monospace"}}>LIL PILL STUDIOS</div>
  </div>;
  const steps=[{icon:"🧭",title:t.ob1Title,sub:t.ob1Sub,c:P.sky},{icon:"📅",title:t.ob3Title,sub:t.ob3Sub,c:P.coral}];
  const s=steps[step-1];
  return<div style={{position:"absolute",inset:0,zIndex:50,background:P.bg,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"40px 30px",animation:"fi 0.4s ease"}}>
    <div style={{fontSize:48,marginBottom:20}}>{s.icon}</div>
    <div style={{fontSize:26,fontWeight:700,marginBottom:10,textAlign:"center"}}>{s.title}</div>
    <p style={{fontSize:14,color:P.textSec,textAlign:"center",lineHeight:1.6,maxWidth:300,marginBottom:36}}>{s.sub}</p>
    <div style={{display:"flex",gap:8,marginBottom:24}}>{steps.map((_,i)=><div key={i} style={{width:i===(step-1)?20:7,height:7,borderRadius:4,background:i===(step-1)?s.c:P.textHint,transition:"all 0.3s"}}/>)}</div>
    <button onClick={()=>{step<2?setStep(step+1):onDone()}} style={{padding:"12px 44px",borderRadius:22,border:"none",background:s.c,color:"#fff",fontSize:15,fontWeight:600,cursor:"pointer"}}>{step<2?t.next_btn:t.letsGo}</button>
    {step<2&&<div onClick={onDone} style={{marginTop:14,fontSize:13,color:P.textMut,cursor:"pointer"}}>{t.skip}</div>}
  </div>;
}

// ═════════════════════════════════════════════════════════════════════
export default function PhillyHubPWA(){
  const[onboarded,setOB]=useState(()=>{try{return localStorage.getItem("ph_ob")==="1"}catch{return false}});
  const[lang,setLang]=useState(()=>{try{return localStorage.getItem("ph_lang")||"en"}catch{return"en"}});
  const[dark,setDark]=useState(()=>{try{const v=localStorage.getItem("ph_dark");if(v!==null)return v==="1";return window.matchMedia?.("(prefers-color-scheme:dark)").matches!==false}catch{return true}});
  const[showLP,setShowLP]=useState(false);
  const[tab,setTab]=useState("explore");
  const[eF,setEF]=useState("all");
  const[srch,setSrch]=useState("");
  const[selPin,setSP]=useState(null);
  const[dtl,setDtl]=useState(null);
  const[sheet,setSh]=useState("half");
  const dragRef=useRef(null);

  const P=dark?DK:LT;const S=useMemo(()=>mkS(P),[dark]);
  const t=TR[lang]||TR.en;
  const{events:remoteEV}=useRemoteEvents(EV);

  useEffect(()=>{try{localStorage.setItem("ph_lang",lang)}catch{}},[lang]);
  useEffect(()=>{try{localStorage.setItem("ph_dark",dark?"1":"0")}catch{}},[dark]);
  const finishOB=useCallback(()=>{setOB(true);try{localStorage.setItem("ph_ob","1")}catch{}},[]);
  const chLang=useCallback(c=>{setLang(c);setShowLP(false);try{localStorage.setItem("ph_lang",c)}catch{}},[]);

  const onShTS=e=>{dragRef.current={startY:e.touches[0].clientY,cur:sheet}};
  const onShTM=e=>{if(!dragRef.current)return;const dy=e.touches[0].clientY-dragRef.current.startY;const cs=dragRef.current.cur;if(dy<-50&&cs!=="full"){setSh("full");dragRef.current.cur="full"}if(dy>50&&cs==="full"){setSh("half");dragRef.current.cur="half"}if(dy>100&&cs==="half"){setSh("peek");dragRef.current.cur="peek"}};
  const onShTE=()=>{dragRef.current=null};

  const fLm=useMemo(()=>{let l=[...LM];if(srch.trim()){const q=srch.toLowerCase();l=l.filter(x=>x.name.toLowerCase().includes(q)||x.desc.toLowerCase().includes(q))}return l},[srch]);
  const fEv=useMemo(()=>{let e=remoteEV.filter(x=>x.date>=TODAY);if(eF!=="all")e=e.filter(x=>x.cat===eF);if(srch.trim()){const q=srch.toLowerCase();e=e.filter(x=>x.title.toLowerCase().includes(q))}return e.sort((a,b)=>a.date.localeCompare(b.date))},[eF,srch,remoteEV]);
  const shY=sheet==="peek"?420:sheet==="half"?240:0;
  const mapPins=useMemo(()=>{if(tab==="events")return fEv.map(e=>({id:e.id,name:e.title,lat:e.lat,lng:e.lng,pc:eC(e.cat)}));return fLm.map(l=>({...l,pc:pC(l.type)}))},[tab,fLm,fEv]);

  const NAV=[{id:"explore",icon:"🧭",l:t.explore},{id:"events",icon:"📅",l:t.events},{id:"transit",icon:"🚊",l:t.transit},{id:"food",icon:"🍴",l:t.food}];
  const ECS=[{id:"all",l:t.allEvents},{id:"fifa",l:t.fifa},{id:"america250",l:t.america250},{id:"fireworks",l:t.july4th},{id:"festival",l:t.arts},{id:"concert",l:t.sports},{id:"parade",l:t.parade}];

  if(!onboarded)return<><style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes fsu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}*::-webkit-scrollbar{display:none}`}</style><Onboarding onDone={finishOB} lang={lang} onLang={chLang} P={P}/></>;

  return<div style={S.app}>
    <style>{`@keyframes fi{from{opacity:0}to{opacity:1}}@keyframes su{from{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes fsu{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}*{box-sizing:border-box;margin:0;padding:0}*::-webkit-scrollbar{display:none}input::placeholder{color:${P.textMut}}`}</style>

    <MapV pins={mapPins} selId={selPin} onPin={id=>{setSP(id);setSh("half")}} P={P}/>

    {/* Top bar */}
    <div style={{position:"absolute",top:0,left:0,right:0,zIndex:10,padding:"10px 14px",display:"flex",gap:6,alignItems:"center"}}>
      <div style={{flex:1}}><input type="text" placeholder={tab==="events"?t.searchEvents:t.search} value={srch} onChange={e=>setSrch(e.target.value)} style={S.sI} onFocus={()=>setSh("full")}/></div>
      <div style={{width:38,height:38,borderRadius:19,border:`1px solid ${P.bdr}`,background:P.bgCard,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0}} onClick={()=>setShowLP(true)}><span style={{fontSize:14}}>{LANGUAGES.find(l=>l.code===lang)?.flag||"🌐"}</span></div>
    </div>

    {/* Settings overlay */}
    {showLP&&<div style={S.ov} onClick={()=>setShowLP(false)}><div style={{...S.dc,maxHeight:"75dvh"}} onClick={e=>e.stopPropagation()}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={S.tt}>{t.settings}</div><div style={S.cb} onClick={()=>setShowLP(false)}>✕</div></div>
      <div style={S.gl}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 0",borderBottom:`1px solid ${P.bdr}`}}>
        <span style={{fontSize:14}}>{dark?"🌙 Dark":"☀️ Light"}</span>
        <div onClick={()=>setDark(!dark)} style={{width:48,height:26,borderRadius:13,background:dark?P.sky:P.textMut,padding:2,cursor:"pointer",transition:"background 0.3s"}}>
          <div style={{width:22,height:22,borderRadius:11,background:"white",transform:dark?"translateX(22px)":"translateX(0)",transition:"transform 0.3s"}}/>
        </div>
      </div>
      <div style={{fontSize:13,fontWeight:600,padding:"14px 0 8px"}}>{t.language}</div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {LANGUAGES.map(l=><div key={l.code} onClick={()=>chLang(l.code)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,background:lang===l.code?`${P.sky}15`:P.bgCard,border:`1px solid ${lang===l.code?`${P.sky}40`:P.bdr}`,cursor:"pointer"}}>
          <span style={{fontSize:16}}>{l.flag}</span><div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{l.native}</div></div>
          {lang===l.code&&<div style={{width:6,height:6,borderRadius:3,background:P.sky}}/>}
        </div>)}
      </div>
    </div></div>}

    {/* Sheet */}
    <div style={S.sh(shY)} onTouchStart={onShTS} onTouchMove={onShTM} onTouchEnd={onShTE}>
      <div style={{width:36,height:4,borderRadius:2,margin:"8px auto 0",background:P.textHint}} onClick={()=>setSh(sheet==="full"?"half":"full")}/>

      {/* EXPLORE */}
      {tab==="explore"&&<>
        <div style={S.cnt}>{fLm.length} {t.results}</div>
        <div style={S.lst}>
          <Upsell P={P} msg="Want transit, food & more?"/>
          {fLm.map((lm,i)=><div key={lm.id} style={S.cd(i*0.03)} onClick={()=>{setDtl({tp:"lm",d:lm});setSP(lm.id)}}>
            <div style={S.nm}>{lm.name}</div>
            <div style={{display:"flex",gap:6,fontSize:11}}><span style={S.bg(pC(lm.type))}>{lm.type}</span></div>
            <div style={{fontSize:11,color:P.textMut,marginTop:3}}>{lm.desc}</div>
          </div>)}
        </div>
      </>}

      {/* EVENTS */}
      {tab==="events"&&<>
        <div style={S.cps}>{ECS.map(ec=><div key={ec.id} style={S.ch(eF===ec.id,eC(ec.id)||P.sky)} onClick={()=>setEF(ec.id)}>{ec.l}</div>)}</div>
        <div style={S.cnt}>{fEv.length} {t.events_count}</div>
        <div style={S.lst}>{fEv.map((ev,i)=>{const c=eC(ev.cat);return<div key={ev.id} style={S.cd(i*0.04)} onClick={()=>setDtl({tp:"ev",d:ev})}>
          <div style={{display:"flex",gap:10}}><div style={{width:42,minHeight:42,borderRadius:8,background:`${c}12`,border:`1px solid ${c}25`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:9,fontWeight:700,color:c,fontFamily:"monospace"}}>{fD(ev.date).split(" ")[0]}</span><span style={{fontSize:15,fontWeight:700,color:c,lineHeight:1}}>{fD(ev.date).split(" ")[1]}</span></div>
            <div style={{flex:1}}><div style={S.nm}>{ev.title}</div><div style={{display:"flex",gap:6,fontSize:11}}><span style={S.bg(c)}>{eL(ev.cat)}</span><span style={{color:P.textMut}}>{ev.time}</span>{ev.free&&<span style={S.bg(P.green)}>{t.free}</span>}</div></div></div>
        </div>})}</div>
      </>}

      {/* TRANSIT — locked */}
      {tab==="transit"&&<div style={S.lst}>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>🚊</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>{t.transit}</div>
          <div style={{fontSize:13,color:P.textSec,marginBottom:20}}>Live SEPTA routes, real-time arrivals, and nearest stop to any landmark</div>
          <Upsell P={P} msg="Unlock transit in the full app"/>
        </div>
      </div>}

      {/* FOOD — locked */}
      {tab==="food"&&<div style={S.lst}>
        <div style={{textAlign:"center",padding:"40px 20px"}}>
          <div style={{fontSize:40,marginBottom:12}}>🍴</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>{t.food}</div>
          <div style={{fontSize:13,color:P.textSec,marginBottom:20}}>80+ curated restaurants, cuisine search, hours, and insider picks</div>
          <Upsell P={P} msg="Unlock food guides in the full app"/>
        </div>
      </div>}
    </div>

    {/* Detail */}
    {dtl&&<div style={S.ov} onClick={()=>setDtl(null)}><div style={S.dc} onClick={e=>e.stopPropagation()}>
      {dtl.tp==="lm"&&(()=>{const lm=dtl.d;return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{lm.name}</div><span style={S.bg(pC(lm.type))}>{lm.type}</span></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><p style={{fontSize:13,lineHeight:1.6,color:P.textSec,margin:"12px 0"}}>{lm.desc}</p>
        <div style={S.ir}>📍 {lm.addr}</div>
      </>})()}
      {dtl.tp==="ev"&&(()=>{const ev=dtl.d;const c=eC(ev.cat);return<>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:12}}><div style={{flex:1}}><div style={S.tt}>{ev.title}</div><div style={{display:"flex",gap:6}}><span style={S.bg(c)}>{eL(ev.cat)}</span>{ev.free&&<span style={S.bg(P.green)}>{t.free}</span>}</div></div><div style={S.cb} onClick={()=>setDtl(null)}>✕</div></div>
        <div style={S.gl}/><div style={{margin:"12px 0"}}><div style={{fontSize:16,fontWeight:700,color:c}}>{fD(ev.date)} · {ev.time}</div><div style={{fontSize:13,color:P.textSec,marginTop:4}}>{ev.desc}</div></div>
        <div style={S.ir}>📍 {ev.addr}</div>
        <div style={S.ir}>🏟️ {ev.venue}</div>
        {ev.tix&&<div style={{...S.ir,cursor:"pointer",color:c,fontWeight:600}} onClick={()=>window.open(ev.tix,"_blank")}>🎟️ {t.getTickets}</div>}
        <Upsell P={P} msg="Want transit directions to this event?"/>
      </>})()}
    </div></div>}

    {/* Nav */}
    <div style={S.nv}>{NAV.map(n=><div key={n.id} style={S.ni(tab===n.id)} onClick={()=>{if(tab===n.id){setSh(prev=>prev==="peek"?"half":prev==="half"?"full":"half")}else{setTab(n.id);setSrch("");setSh("half")}}}><span style={{fontSize:18}}>{n.icon}</span><span style={{fontSize:10,fontWeight:500}}>{n.l}</span>{tab===n.id&&<div style={{position:"absolute",top:0,width:18,height:2,borderRadius:1,background:P.sky}}/>}</div>)}</div>

    {/* Persistent bottom banner — App Store */}
    <div onClick={()=>window.open(APPSTORE_URL,"_blank")} style={{position:"absolute",bottom:56,left:0,right:0,zIndex:22,padding:"6px 14px",background:`${P.sky}12`,borderTop:`1px solid ${P.sky}20`,display:"flex",justifyContent:"center",alignItems:"center",gap:8,cursor:"pointer"}}>
      <span style={{fontSize:11,color:P.sky,fontWeight:600}}>📱 Get the full PhillyHub app — App Store now · Android coming soon</span>
    </div>
  </div>;
}
