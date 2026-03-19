'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/* ── 2026 DATA (po R2 Čína) ── */
const DRIVERS = [
  { id: 'russell',    name: 'George Russell',   short: 'RUS', team: 'Mercedes',     number: 63,  flag: '🇬🇧', points: 51, wins: 2, podiums: 2, color: '#00D2BE', bio: 'Vůdce šampionátu 2026. Mercedes dominuje s novými pravidly a Russell je v absolutní formě — dvě vítězství ze dvou závodů.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'W16' }] },
  { id: 'antonelli',  name: 'Kimi Antonelli',   short: 'ANT', team: 'Mercedes',     number: 12,  flag: '🇮🇹', points: 47, wins: 1, podiums: 2, color: '#00D2BE', bio: 'Nová hvězda! Zvítězil na svém 2. GP v Číně. Nástupce Hamiltona v Mercedesu dokazuje, proč byl zvolen.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'W16' }] },
  { id: 'leclerc',    name: 'Charles Leclerc',  short: 'LEC', team: 'Ferrari',      number: 16,  flag: '🇲🇨', points: 34, wins: 0, podiums: 1, color: '#E8002D', bio: 'Monacký princ stále hledá první vítězství v 2026. Ferrari adaptuje na nová pravidla, ale Leclerc boduje.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'SF-26' }] },
  { id: 'hamilton',   name: 'Lewis Hamilton',   short: 'HAM', team: 'Ferrari',      number: 44,  flag: '🇬🇧', points: 33, wins: 0, podiums: 1, color: '#E8002D', bio: 'Legenda F1 v červeném dresu. Start 2026 je složitý — Ferrari bojuje s Mercedes dominancí. Osmý titul čeká.', stats: [{ l: 'Tituly', v: '7' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'SF-26' }] },
  { id: 'bearman',    name: 'Oliver Bearman',   short: 'BEA', team: 'Haas',         number: 87,  flag: '🇬🇧', points: 17, wins: 0, podiums: 1, color: '#B6BABD', bio: 'Senzace sezóny! Bearman táhne Haas do top 5. Největší překvapení prvních dvou závodů roku 2026.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'VF-26' }] },
  { id: 'norris',     name: 'Lando Norris',     short: 'NOR', team: 'McLaren',      number: 4,   flag: '🇬🇧', points: 15, wins: 0, podiums: 0, color: '#FF8000', bio: 'Mistr světa 2025 má těžký start. McLaren bojuje s novými pravidly 2026, ale Norris nikdy nevzdává.', stats: [{ l: 'Tituly', v: '1' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'MCL40' }] },
  { id: 'gasly',      name: 'Pierre Gasly',     short: 'GAS', team: 'Alpine',       number: 10,  flag: '🇫🇷', points: 9,  wins: 0, podiums: 0, color: '#FF87BC', bio: 'Zkušený Francouz boduje pro Alpine. 7. místo v šampionátu je nad očekávání pro Enstone.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Renault' }, { l: 'Šasi', v: 'A526' }] },
  { id: 'verstappen', name: 'Max Verstappen',   short: 'VER', team: 'Red Bull',     number: 1,   flag: '🇳🇱', points: 8,  wins: 0, podiums: 0, color: '#3671C6', bio: 'Čtyřnásobný mistr na 8. místě! Red Bull ztratil výhodu po změně pravidel. Comeback se blíží.', stats: [{ l: 'Tituly', v: '4' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ford' }, { l: 'Šasi', v: 'RB21' }] },
]

const TEAMS = [
  { id: 'mercedes', name: 'Mercedes-AMG F1', base: 'Brackley, UK',      color: '#00D2BE', chassis: 'W16',   engine: 'Mercedes', points: 98, icon: '⭐', titles: 8 },
  { id: 'ferrari',  name: 'Scuderia Ferrari', base: 'Maranello, IT',    color: '#E8002D', chassis: 'SF-26', engine: 'Ferrari',  points: 67, icon: '🐎', titles: 16 },
  { id: 'mclaren',  name: 'McLaren F1 Team',  base: 'Woking, UK',       color: '#FF8000', chassis: 'MCL40', engine: 'Mercedes', points: 18, icon: '🟠', titles: 8 },
  { id: 'haas',     name: 'Haas F1 Team',     base: 'Kannapolis, USA',  color: '#B6BABD', chassis: 'VF-26', engine: 'Ferrari',  points: 17, icon: '🦅', titles: 0 },
  { id: 'redbull',  name: 'Red Bull Racing',  base: 'Milton Keynes, UK', color: '#3671C6', chassis: 'RB21',  engine: 'Ford',     points: 12, icon: '🐂', titles: 6 },
  { id: 'alpine',   name: 'Alpine F1 Team',   base: 'Enstone, UK',      color: '#FF87BC', chassis: 'A526',  engine: 'Renault',  points: 10, icon: '🔵', titles: 2 },
  { id: 'audi',     name: 'Audi F1 Team',     base: 'Hinwil, CH',       color: '#C0C0C0', chassis: 'C45',   engine: 'Audi',     points: 2,  icon: '💠', titles: 0 },
  { id: 'williams', name: 'Williams Racing',  base: 'Grove, UK',        color: '#37BEDD', chassis: 'FW47',  engine: 'Mercedes', points: 2,  icon: '🔷', titles: 7 },
]

const RACES = [
  { round: 1,  name: 'Austrálie GP',      circuit: 'Melbourne',    date: '16 Bře', status: 'done',     winner: 'Russell' },
  { round: 2,  name: 'Čína GP',           circuit: 'Šanghaj',      date: '23 Bře', status: 'done',     winner: 'Antonelli' },
  { round: 3,  name: 'Japonsko GP',       circuit: 'Suzuka',       date: '6 Dub',  status: 'next',     winner: null },
  { round: 4,  name: 'Bahrajn GP',        circuit: 'Sakhir',       date: '20 Dub', status: 'upcoming', winner: null },
  { round: 5,  name: 'Miami GP',          circuit: 'Miami Int.',    date: '4 Kvě',  status: 'upcoming', winner: null },
  { round: 6,  name: 'Emilia Romagna GP', circuit: 'Imola',        date: '18 Kvě', status: 'upcoming', winner: null },
  { round: 7,  name: 'Monako GP',         circuit: 'Monte Carlo',   date: '25 Kvě', status: 'upcoming', winner: null },
  { round: 8,  name: 'Španělsko GP',      circuit: 'Barcelona',    date: '1 Čer',  status: 'upcoming', winner: null },
  { round: 9,  name: 'Kanada GP',         circuit: 'Montréal',     date: '15 Čer', status: 'upcoming', winner: null },
  { round: 10, name: 'Rakousko GP',       circuit: 'Spielberg',    date: '29 Čer', status: 'upcoming', winner: null },
  { round: 11, name: 'Velká Británie GP', circuit: 'Silverstone',  date: '6 Čvc',  status: 'upcoming', winner: null },
  { round: 12, name: 'Maďarsko GP',       circuit: 'Budapest',     date: '27 Čvc', status: 'upcoming', winner: null },
]

/* ── F1 CAR SVG ── */
const CAR_CONFIGS = {
  mercedes: { body: '#111',    accent: '#00D2BE', stripe: '#fff',    nose: '#111' },
  ferrari:  { body: '#CC0000', accent: '#FFD700', stripe: '#fff',    nose: '#AA0000' },
  mclaren:  { body: '#FF8000', accent: '#000',    stripe: '#fff',    nose: '#cc6600' },
  redbull:  { body: '#1a2060', accent: '#3671C6', stripe: '#CC1000', nose: '#CC1000' },
  haas:     { body: '#ddd',    accent: '#CC0000', stripe: '#111',    nose: '#ccc' },
  alpine:   { body: '#002D87', accent: '#FF87BC', stripe: '#fff',    nose: '#001a55' },
  audi:     { body: '#222',    accent: '#C0C0C0', stripe: '#fff',    nose: '#111' },
  williams: { body: '#005f99', accent: '#37BEDD', stripe: '#fff',    nose: '#003366' },
}

function F1Car({ teamId, angle }) {
  const c = CAR_CONFIGS[teamId] || CAR_CONFIGS.mercedes
  const rad = (angle * Math.PI) / 180
  const cosA = Math.cos(rad)
  const scaleX = 0.72 + Math.abs(cosA) * 0.28
  const flip = cosA < 0 ? -1 : 1
  const rearW = cosA < 0 ? 30 : 22
  const frontW = cosA > 0 ? 26 : 20

  return (
    <svg viewBox="0 0 700 300" style={{ width: '100%', height: '100%', userSelect: 'none', display: 'block' }}>
      <defs>
        <linearGradient id={`lg-${teamId}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.body} stopOpacity="1" />
          <stop offset="100%" stopColor={c.body} stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="350" cy="262" rx={155 * scaleX} ry="13" fill="#000" opacity="0.6" />
      <ellipse cx="350" cy="262" rx={90 * scaleX} ry="7" fill={c.accent} opacity="0.1" />
      {/* Ground line */}
      <line x1="120" y1="258" x2="580" y2="258" stroke={c.accent} strokeWidth="0.5" opacity="0.2" />

      <g transform={`translate(350,140) scale(${scaleX * flip},1)`}>

        {/* FLOOR */}
        <rect x="-168" y="30" width="336" height="9" rx="2" fill={c.body} opacity="0.7" />
        <rect x="-158" y="35" width="316" height="3" rx="1" fill={c.accent} opacity="0.35" />

        {/* DIFFUSER fins */}
        {[-140,-120,-100,-80].map(x => <rect key={x} x={x} y="30" width="1.5" height="9" fill={c.accent} opacity="0.4" />)}

        {/* SIDEPODS */}
        <path d="M-82,-4 L82,-4 L98,30 L-98,30 Z" fill={`url(#lg-${teamId})`} opacity="0.85" />
        {/* Sidepod intake */}
        <ellipse cx="-55" cy="8" rx="14" ry="9" fill="#000" opacity="0.6" />
        <ellipse cx="-55" cy="8" rx="11" ry="7" fill={c.accent} opacity="0.15" />

        {/* MAIN BODY */}
        <path d="M-158,24 L-112,-6 L-32,-26 L62,-28 L122,-10 L158,16 L158,30 L-158,30 Z" fill={`url(#lg-${teamId})`} />

        {/* LIVERY STRIPE */}
        <path d="M-82,-25 L58,-27 L88,-14 L-62,-13 Z" fill={c.accent} opacity="0.28" />
        <line x1="-85" y1="-25.5" x2="78" y2="-21" stroke={c.accent} strokeWidth="2" opacity="0.65" />

        {/* COCKPIT */}
        <path d="M-36,-26 L-12,-52 L36,-52 L56,-28 Z" fill={c.body} />
        <path d="M-22,-28 L-8,-49" stroke={c.accent} strokeWidth="1" opacity="0.4" />
        <path d="M-36,-26 L-12,-52 L36,-52 L56,-28" fill="none" stroke={c.accent} strokeWidth="1.5" opacity="0.5" />
        {/* Visor */}
        <path d="M-18,-29 L-6,-48 L30,-48 L44,-29 Z" fill="rgba(80,160,255,0.2)" />

        {/* HALO */}
        <path d="M-4,-52 Q2,-64 8,-52" fill="none" stroke={c.stripe} strokeWidth="3.5" opacity="0.85" />
        <rect x="-1.5" y="-64" width="3.5" height="14" rx="1.5" fill={c.stripe} opacity="0.7" />

        {/* ENGINE COVER */}
        <path d="M-112,-6 L-32,-26 L-32,-4 L-102,-1 Z" fill={c.body} opacity="0.55" />

        {/* AIRBOX */}
        <ellipse cx="12" cy="-40" rx="13" ry="8" fill={c.body} />
        <ellipse cx="12" cy="-40" rx="10" ry="6" fill="#000" opacity="0.85" />
        <ellipse cx="12" cy="-40" rx="6" ry="3.5" fill={c.accent} opacity="0.25" />

        {/* NOSE CONE */}
        <path d="M122,-10 L168,4 L172,14 L158,16 Z" fill={c.nose} />
        <line x1="138" y1="-6" x2="166" y2="4" stroke={c.accent} strokeWidth="1" opacity="0.4" />

        {/* FRONT WING */}
        <path d="M150,16 L190,20 L192,25 L148,25 Z" fill={c.accent} opacity="0.75" />
        <rect x="150" y="25" width="42" height="2.5" rx="1" fill={c.accent} opacity="0.55" />
        <rect x="154" y="28" width="36" height="2" rx="1" fill={c.accent} opacity="0.35" />
        <rect x="188" y="15" width="2.5" height="16" rx="1" fill={c.accent} opacity="0.6" />
        <rect x="150" y="15" width="2" height="16" rx="1" fill={c.accent} opacity="0.4" />

        {/* REAR WING */}
        <rect x="-175" y="-24" width="30" height="5.5" rx="1.2" fill={c.accent} opacity="0.9" />
        <rect x="-175" y="-15" width="30" height="4.5" rx="1" fill={c.accent} opacity="0.7" />
        <rect x="-173" y="-24" width="3" height="54" rx="1.5" fill={c.accent} opacity="0.5" />
        <rect x="-148" y="-24" width="3" height="54" rx="1.5" fill={c.accent} opacity="0.45" />
        <rect x="-168" y="-26" width="20" height="2" rx="1" fill={c.stripe} opacity="0.35" />

        {/* TURNING VANES */}
        <line x1="-62" y1="1" x2="-62" y2="30" stroke={c.accent} strokeWidth="1.2" opacity="0.35" />
        <line x1="-42" y1="-1" x2="-42" y2="30" stroke={c.accent} strokeWidth="1" opacity="0.25" />
        <line x1="52" y1="-1" x2="52" y2="30" stroke={c.accent} strokeWidth="1" opacity="0.25" />

        {/* REAR WHEELS */}
        <ellipse cx="-120" cy="34" rx={rearW} ry="22" fill="#1a1a1a" />
        <ellipse cx="-120" cy="34" rx={rearW - 2} ry="20" fill="#111" stroke={c.accent} strokeWidth="2.5" />
        <ellipse cx="-120" cy="34" rx={Math.round(rearW * 0.5)} ry={Math.round(rearW * 0.45)} fill="#1e1e1e" />
        <ellipse cx="-120" cy="34" rx={Math.round(rearW * 0.28)} ry={Math.round(rearW * 0.26)} fill={c.accent} opacity="0.45" />
        {[0,60,120,180,240,300].map(a => { const r2=(a*Math.PI)/180; const rr=Math.round(rearW*0.44); return <line key={a} x1={-120} y1={34} x2={-120+Math.cos(r2)*rr} y2={34+Math.sin(r2)*rr} stroke={c.accent} strokeWidth="1" opacity="0.35" /> })}

        {/* FRONT WHEELS */}
        <ellipse cx="128" cy="34" rx={frontW} ry="20" fill="#1a1a1a" />
        <ellipse cx="128" cy="34" rx={frontW - 2} ry="18" fill="#111" stroke={c.accent} strokeWidth="2" />
        <ellipse cx="128" cy="34" rx={Math.round(frontW * 0.5)} ry={Math.round(frontW * 0.46)} fill="#1e1e1e" />
        <ellipse cx="128" cy="34" rx={Math.round(frontW * 0.28)} ry={Math.round(frontW * 0.27)} fill={c.accent} opacity="0.45" />
        {[0,60,120,180,240,300].map(a => { const r2=(a*Math.PI)/180; const rr=Math.round(frontW*0.42); return <line key={a} x1={128} y1={34} x2={128+Math.cos(r2)*rr} y2={34+Math.sin(r2)*rr} stroke={c.accent} strokeWidth="1" opacity="0.35" /> })}

        {/* SUSPENSION */}
        <line x1="-102" y1="22" x2="-120" y2="28" stroke={c.stripe} strokeWidth="1.5" opacity="0.35" />
        <line x1="-102" y1="28" x2="-120" y2="31" stroke={c.stripe} strokeWidth="1" opacity="0.25" />
        <line x1="108" y1="22" x2="128" y2="28" stroke={c.stripe} strokeWidth="1.5" opacity="0.35" />
        <line x1="110" y1="28" x2="128" y2="31" stroke={c.stripe} strokeWidth="1" opacity="0.25" />

        {/* CHASSIS TEXT */}
        <text x="-18" y="-8" textAnchor="middle" fill={c.stripe} fontSize="13" fontFamily="Orbitron,sans-serif" fontWeight="900" opacity="0.8">
          {TEAMS.find(t => t.id === teamId)?.chassis || ''}
        </text>
      </g>
    </svg>
  )
}

/* ══════════════════════════ PAGE ══════════════════════════ */
export default function F1Page() {
  const router = useRouter()
  const starsRef = useRef(null)
  const curRef   = useRef(null)
  const dotRef   = useRef(null)
  const [activeDriver, setActiveDriver] = useState(null)
  const [activeTab, setActiveTab] = useState('drivers')
  const [selectedCar, setSelectedCar] = useState('mercedes')
  const [carAngle, setCarAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)

  /* Stars */
  useEffect(() => {
    const cv = starsRef.current; if (!cv) return
    const ctx = cv.getContext('2d')
    const resize = () => { cv.width = window.innerWidth; cv.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const stars = Array.from({length:160}, () => ({ x:Math.random()*2000, y:Math.random()*2000, r:Math.random()*1.2+.2, a:Math.random(), spd:Math.random()*.2+.05 }))
    let raf
    const draw = () => {
      ctx.clearRect(0,0,cv.width,cv.height)
      stars.forEach(s => { s.a+=s.spd*.004; if(s.a>1)s.a=0; ctx.globalAlpha=s.a*.7; ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(s.x%cv.width,s.y%cv.height,s.r,0,Math.PI*2); ctx.fill() })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* Cursor */
  useEffect(() => {
    const cur = curRef.current; const dot = dotRef.current; if(!cur||!dot) return
    let mx=window.innerWidth/2, my=window.innerHeight/2, lcx=mx, lcy=my, raf
    const mv = e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px' }
    document.addEventListener('mousemove', mv)
    const anim = () => { lcx+=(mx-lcx)*.12; lcy+=(my-lcy)*.12; cur.style.left=lcx+'px'; cur.style.top=lcy+'px'; raf=requestAnimationFrame(anim) }
    anim()
    return () => { document.removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])

  /* Auto-rotate */
  useEffect(() => {
    if (isDragging) return
    const id = setInterval(() => setCarAngle(a => (a + 0.45) % 360), 16)
    return () => clearInterval(id)
  }, [isDragging])

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('fv') }), {threshold:.08})
    setTimeout(() => document.querySelectorAll('.fr').forEach(el => obs.observe(el)), 80)
    return () => obs.disconnect()
  }, [activeTab])

  const accent = TEAMS.find(t => t.id === selectedCar)?.color || '#ff2800'

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#05060a;color:#c8cdd8;font-family:'DM Sans',sans-serif;overflow-x:hidden;cursor:none!important;}
        *{cursor:none!important;}
        body::after{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.05) 3px,rgba(0,0,0,.05) 4px);pointer-events:none;z-index:9980;}
        .fr{opacity:0;transform:translateY(20px);transition:opacity .5s ease,transform .5s ease;}
        .fv{opacity:1!important;transform:translateY(0)!important;}
        #fc{position:fixed;width:28px;height:28px;border:2px solid #ff2800;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 10px rgba(255,40,0,.4);}
        #fd{position:fixed;width:5px;height:5px;background:#ff2800;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 8px #ff2800;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#05060a;}::-webkit-scrollbar-thumb{background:#ff2800;}
      `}</style>

      <div id="fc" ref={curRef} />
      <div id="fd" ref={dotRef} />
      <canvas ref={starsRef} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}} />

      <div style={{position:'relative',zIndex:1}}>

        {/* NAV */}
        <nav style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 24px',height:56,borderBottom:'1px solid rgba(255,255,255,.06)',background:'rgba(5,6,10,.96)',backdropFilter:'blur(12px)',position:'sticky',top:0,zIndex:100}}>
          <button onClick={() => router.push('/')} style={{background:'none',border:'1px solid rgba(255,255,255,.1)',padding:'6px 14px',fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:2,color:'rgba(255,255,255,.5)',transition:'all .2s'}}
            onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,.3)'}}
            onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,.5)';e.currentTarget.style.borderColor='rgba(255,255,255,.1)'}}>← HUB</button>
          <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:900,letterSpacing:6,color:'#fff'}}>F<span style={{color:'#ff2800'}}>1</span></div>
          <div style={{display:'flex',gap:2}}>
            {[['drivers','Jezdci'],['teams','Týmy'],['cars','3D Auta'],['calendar','Kalendář']].map(([tab,label]) => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{background:activeTab===tab?'rgba(255,40,0,.12)':'transparent',border:`1px solid ${activeTab===tab?'rgba(255,40,0,.5)':'transparent'}`,color:activeTab===tab?'#ff6644':'rgba(255,255,255,.4)',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,padding:'7px 14px',transition:'all .2s',textTransform:'uppercase'}}
                onMouseEnter={e=>{if(activeTab!==tab)e.currentTarget.style.color='#fff'}}
                onMouseLeave={e=>{if(activeTab!==tab)e.currentTarget.style.color='rgba(255,255,255,.4)'}}
              >{label}</button>
            ))}
          </div>
        </nav>

        {/* HERO */}
        <section style={{minHeight:'60vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',textAlign:'center',background:'radial-gradient(ellipse 80% 50% at 50% 0%,rgba(255,40,0,.07),transparent)',borderBottom:'1px solid rgba(255,255,255,.04)'}}>
          <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:6,color:'rgba(255,40,0,.7)',marginBottom:16}}>SEZÓNA 2026 · PO R2 ČÍNA</p>
          <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(44px,8vw,96px)',fontWeight:900,letterSpacing:2,lineHeight:.9,color:'#fff',marginBottom:12}}>FORMULA<br /><span style={{color:'#ff2800'}}>ONE</span></h1>
          <p style={{fontSize:13,letterSpacing:2,color:'rgba(200,205,216,.4)',maxWidth:420,lineHeight:1.8,marginBottom:48}}>Mercedes dominuje · 2/12 závodů · Živá data 2026</p>
          <div style={{display:'flex',gap:2,flexWrap:'wrap',justifyContent:'center',maxWidth:620,width:'100%'}}>
            {DRIVERS.slice(0,3).map((d,i) => (
              <div key={d.id} className="fr" style={{background:'rgba(255,255,255,.03)',border:`1px solid ${d.color}33`,borderTop:`2px solid ${d.color}`,padding:'16px 20px',flex:1,minWidth:160,display:'flex',alignItems:'center',gap:12}}>
                <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,fontWeight:900,color:i===0?'#ffd700':i===1?'#c0c0c0':'#cd7f32',minWidth:24}}>{i+1}</span>
                <div style={{flex:1}}>
                  <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:'#fff',letterSpacing:1,marginBottom:2}}>{d.short}</p>
                  <p style={{fontSize:9,color:'rgba(255,255,255,.3)',letterSpacing:1}}>{d.team}</p>
                </div>
                <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,color:d.color,fontWeight:700}}>{d.points}</span>
              </div>
            ))}
          </div>
        </section>

        <div style={{maxWidth:1100,margin:'0 auto',padding:'60px 20px'}}>

          {/* DRIVERS */}
          {activeTab==='drivers' && (
            <div>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,letterSpacing:4,color:'#fff',marginBottom:4,textAlign:'center'}}>JEZDCI 2026</h2>
              <p style={{textAlign:'center',fontSize:11,letterSpacing:2,color:'rgba(255,255,255,.25)',marginBottom:36}}>Průběžné pořadí · Klikni pro detail</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))',gap:2}}>
                {DRIVERS.map((d,i) => (
                  <div key={d.id} className="fr"
                    onClick={() => setActiveDriver(activeDriver?.id===d.id?null:d)}
                    style={{background:activeDriver?.id===d.id?'rgba(255,255,255,.04)':'#07080e',border:`1px solid ${activeDriver?.id===d.id?d.color+'55':'rgba(255,255,255,.05)'}`,borderTop:`2px solid ${d.color}`,padding:'22px 18px',position:'relative',overflow:'hidden',transition:'all .25s'}}
                    onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.04)';e.currentTarget.style.transform='translateY(-2px)'}}
                    onMouseLeave={e=>{e.currentTarget.style.background=activeDriver?.id===d.id?'rgba(255,255,255,.04)':'#07080e';e.currentTarget.style.transform='translateY(0)'}}
                  >
                    <div style={{position:'absolute',top:10,right:12,fontFamily:"'Orbitron',sans-serif",fontSize:26,fontWeight:900,color:'rgba(255,255,255,.05)'}}>{i+1}</div>
                    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                      <span style={{fontSize:22}}>{d.flag}</span>
                      <div>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:1,color:'#fff',marginBottom:2}}>{d.name}</p>
                        <p style={{fontSize:9,color:d.color,letterSpacing:2}}>{d.team} · #{d.number}</p>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:5}}>
                      {[['PTS',d.points],['WIN',d.wins],['POD',d.podiums]].map(([l,v]) => (
                        <div key={l} style={{background:'rgba(255,255,255,.03)',padding:'7px 5px',textAlign:'center',borderBottom:`1px solid ${d.color}33`}}>
                          <p style={{fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.22)',marginBottom:3}}>{l}</p>
                          <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,color:l==='PTS'?d.color:'#fff'}}>{v}</p>
                        </div>
                      ))}
                    </div>
                    {activeDriver?.id===d.id && (
                      <div style={{marginTop:14,borderTop:'1px solid rgba(255,255,255,.06)',paddingTop:14}}>
                        <p style={{fontSize:12,lineHeight:1.85,color:'rgba(200,205,216,.5)',marginBottom:12}}>{d.bio}</p>
                        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5}}>
                          {d.stats.map(s => (
                            <div key={s.l} style={{background:'rgba(255,255,255,.03)',padding:'8px 10px',borderLeft:`2px solid ${d.color}55`}}>
                              <p style={{fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.22)',marginBottom:3}}>{s.l}</p>
                              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:d.color}}>{s.v}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAMS */}
          {activeTab==='teams' && (
            <div>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,letterSpacing:4,color:'#fff',marginBottom:4,textAlign:'center'}}>TÝMY 2026</h2>
              <p style={{textAlign:'center',fontSize:11,letterSpacing:2,color:'rgba(255,255,255,.25)',marginBottom:36}}>Konstruktérské pořadí</p>
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:2}}>
                {[...TEAMS].sort((a,b)=>b.points-a.points).map((t,i) => (
                  <div key={t.id} className="fr" style={{background:'#07080e',border:'1px solid rgba(255,255,255,.05)',borderTop:`2px solid ${t.color}`,padding:'26px 22px',position:'relative',transition:'transform .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                    onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                  >
                    <div style={{position:'absolute',top:12,right:14,fontFamily:"'Orbitron',sans-serif",fontSize:20,fontWeight:900,color:'rgba(255,255,255,.05)'}}>{i+1}</div>
                    <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:18}}>
                      <div style={{width:46,height:46,background:`${t.color}18`,border:`1px solid ${t.color}44`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{t.icon}</div>
                      <div>
                        <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,letterSpacing:1,color:'#fff',marginBottom:3}}>{t.name}</h3>
                        <p style={{fontSize:9,color:'rgba(255,255,255,.28)',letterSpacing:1}}>{t.base}</p>
                      </div>
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:4}}>
                      {[['Body',t.points],['Šasi',t.chassis],['Motor',t.engine],['Tituly',t.titles]].map(([l,v]) => (
                        <div key={l} style={{background:'rgba(255,255,255,.03)',padding:'8px 4px',textAlign:'center'}}>
                          <p style={{fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.22)',marginBottom:3}}>{l}</p>
                          <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:l==='Body'?t.color:'#fff'}}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3D CARS */}
          {activeTab==='cars' && (
            <div>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,letterSpacing:4,color:'#fff',marginBottom:4,textAlign:'center'}}>3D VOZY 2026</h2>
              <p style={{textAlign:'center',fontSize:11,letterSpacing:2,color:'rgba(255,255,255,.25)',marginBottom:28}}>Táhni myší pro rotaci</p>
              <div style={{display:'flex',gap:6,justifyContent:'center',flexWrap:'wrap',marginBottom:28}}>
                {TEAMS.map(t => (
                  <button key={t.id} onClick={() => {setSelectedCar(t.id);setCarAngle(0)}} style={{background:selectedCar===t.id?`${t.color}20`:'rgba(255,255,255,.02)',border:`1px solid ${selectedCar===t.id?t.color:'rgba(255,255,255,.08)'}`,color:selectedCar===t.id?t.color:'rgba(255,255,255,.35)',fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:2,padding:'7px 14px',transition:'all .2s',textTransform:'uppercase'}}>
                    {t.name.split(' ')[0]}
                  </button>
                ))}
              </div>
              <div style={{maxWidth:700,margin:'0 auto 16px',background:`radial-gradient(ellipse at 50% 50%,${accent}08,#06080e)`,border:`1px solid ${accent}28`,height:320,position:'relative',overflow:'hidden'}}
                onMouseDown={e=>{setIsDragging(true);setDragStart(e.clientX)}}
                onMouseMove={e=>{if(!isDragging)return;setCarAngle(a=>(a+(e.clientX-dragStart)*0.6)%360);setDragStart(e.clientX)}}
                onMouseUp={()=>setIsDragging(false)}
                onMouseLeave={()=>setIsDragging(false)}
              >
                <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,${accent},transparent)`}} />
                <div style={{position:'absolute',bottom:50,left:0,right:0,height:1,background:`linear-gradient(90deg,transparent,${accent}50,transparent)`}} />
                {Array.from({length:10}).map((_,i) => <div key={i} style={{position:'absolute',bottom:0,left:`${4+i*10}%`,width:1,height:50,background:`${accent}0c`}} />)}
                <F1Car teamId={selectedCar} angle={carAngle} />
                {[{t:10,l:10,bt:'none',bb:'none',bl:'1px',br:'none'},{t:10,r:10,bt:'none',bb:'none',bl:'none',br:'1px'},{b:10,l:10,bt:'none',bb:'none',bl:'1px',br:'none'},{b:10,r:10,bt:'none',bb:'none',bl:'none',br:'1px'}].map((pos,i) => (
                  <div key={i} style={{position:'absolute',...(pos.t?{top:pos.t}:{}), ...(pos.b?{bottom:pos.b}:{}), ...(pos.l?{left:pos.l}:{}), ...(pos.r?{right:pos.r}:{}),width:14,height:14,
                    borderTop:i<2?`1px solid ${accent}55`:'none',borderBottom:i>=2?`1px solid ${accent}55`:'none',
                    borderLeft:(i===0||i===2)?`1px solid ${accent}55`:'none',borderRight:(i===1||i===3)?`1px solid ${accent}55`:'none'}} />
                ))}
                <p style={{position:'absolute',bottom:10,right:14,fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:3,color:`${accent}77`}}>{isDragging?'ROTACE':'AUTO-ROTATE'}</p>
              </div>
              {(() => { const t=TEAMS.find(t=>t.id===selectedCar); return (
                <div style={{maxWidth:700,margin:'0 auto',display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:2}}>
                  {[['Tým',t.name.split(' ')[0]],['Šasi',t.chassis],['Motor',t.engine],['Body',t.points+' pts']].map(([l,v]) => (
                    <div key={l} style={{background:'#07080e',border:'1px solid rgba(255,255,255,.04)',borderTop:`2px solid ${accent}`,padding:'12px',textAlign:'center'}}>
                      <p style={{fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.22)',marginBottom:4}}>{l}</p>
                      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:accent}}>{v}</p>
                    </div>
                  ))}
                </div>
              )})()}
            </div>
          )}

          {/* CALENDAR */}
          {activeTab==='calendar' && (
            <div>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:22,letterSpacing:4,color:'#fff',marginBottom:4,textAlign:'center'}}>KALENDÁŘ 2026</h2>
              <p style={{textAlign:'center',fontSize:11,letterSpacing:2,color:'rgba(255,255,255,.25)',marginBottom:32}}>2 ze 12 závodů odjeté</p>
              <div style={{maxWidth:680,margin:'0 auto 32px',background:'rgba(255,255,255,.03)',height:3,borderRadius:2}}>
                <div style={{width:'16.6%',height:'100%',background:'linear-gradient(90deg,#ff2800,#ff6644)',borderRadius:2}} />
              </div>
              <div style={{maxWidth:680,margin:'0 auto',display:'flex',flexDirection:'column',gap:2}}>
                {RACES.map(r => (
                  <div key={r.round} className="fr" style={{display:'flex',alignItems:'center',gap:14,background:r.status==='next'?'rgba(255,40,0,.07)':'#07080e',border:`1px solid ${r.status==='next'?'rgba(255,40,0,.35)':'rgba(255,255,255,.04)'}`,borderLeft:`3px solid ${r.status==='done'?'#2a2a2a':r.status==='next'?'#ff2800':'rgba(255,255,255,.06)'}`,padding:'14px 18px',transition:'border-color .2s'}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(255,40,0,.18)'}
                    onMouseLeave={e=>e.currentTarget.style.borderColor=r.status==='next'?'rgba(255,40,0,.35)':'rgba(255,255,255,.04)'}
                  >
                    <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(255,255,255,.14)',minWidth:20}}>R{r.round}</span>
                    <div style={{flex:1}}>
                      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:r.status==='done'?'rgba(255,255,255,.32)':'#fff',letterSpacing:1}}>{r.name}</p>
                      <p style={{fontSize:9,color:'rgba(255,255,255,.18)',letterSpacing:1,marginTop:2}}>{r.circuit}</p>
                    </div>
                    <div style={{textAlign:'right'}}>
                      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(255,255,255,.28)',letterSpacing:1}}>{r.date}</p>
                      {r.winner && <p style={{fontSize:8,color:'#ff6644',letterSpacing:1,marginTop:3}}>🏆 {r.winner}</p>}
                      {r.status==='next' && <p style={{fontSize:7,color:'#ff2800',letterSpacing:2,marginTop:3,fontFamily:"'Orbitron',sans-serif"}}>PŘÍŠTÍ</p>}
                    </div>
                    <div style={{width:7,height:7,borderRadius:'50%',flexShrink:0,background:r.status==='next'?'#ff2800':r.status==='done'?'#333':'#181818',boxShadow:r.status==='next'?'0 0 8px #ff2800':'none'}} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <footer style={{padding:'28px 20px',borderTop:'1px solid rgba(255,255,255,.04)',textAlign:'center'}}>
          <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:4,color:'rgba(255,255,255,.1)',textTransform:'uppercase'}}>
            F1 Archiv 2026 · Data po R2 Čína GP · bador108
          </p>
        </footer>
      </div>
    </>
  )
}