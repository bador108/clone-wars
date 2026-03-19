'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const DRIVERS = [
  { id: 'russell',    name: 'George Russell',   short: 'RUS', team: 'Mercedes', number: 63, flag: '🇬🇧', points: 51, wins: 2, podiums: 2, color: '#00D2BE', bio: 'Vůdce šampionátu 2026. Mercedes dominuje s novými pravidly — dvě vítězství ze dvou závodů.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'W16' }] },
  { id: 'antonelli',  name: 'Kimi Antonelli',   short: 'ANT', team: 'Mercedes', number: 12, flag: '🇮🇹', points: 47, wins: 1, podiums: 2, color: '#00D2BE', bio: 'Vítěz Číny 2026. Nástupce Hamiltona dokazuje svou třídu již ve druhém závodě kariéry.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'W16' }] },
  { id: 'leclerc',    name: 'Charles Leclerc',  short: 'LEC', team: 'Ferrari',  number: 16, flag: '🇲🇨', points: 34, wins: 0, podiums: 1, color: '#E8002D', bio: 'Monacký princ drží Ferrari v top 3. Adaptace na nová pravidla probíhá, první vítězství se blíží.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'SF-26' }] },
  { id: 'hamilton',   name: 'Lewis Hamilton',   short: 'HAM', team: 'Ferrari',  number: 44, flag: '🇬🇧', points: 33, wins: 0, podiums: 1, color: '#E8002D', bio: 'Sedminásobný mistr v rudém. Start 2026 je složitý, ale Hamilton nikdy nevzdává hon za osmým titulem.', stats: [{ l: 'Tituly', v: '7' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'SF-26' }] },
  { id: 'bearman',    name: 'Oliver Bearman',   short: 'BEA', team: 'Haas',    number: 87, flag: '🇬🇧', points: 17, wins: 0, podiums: 1, color: '#B6BABD', bio: 'Největší překvapení sezóny. Bearman táhne Haas do top 5 a je senzací prvních závodů 2026.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ferrari' }, { l: 'Šasi', v: 'VF-26' }] },
  { id: 'norris',     name: 'Lando Norris',     short: 'NOR', team: 'McLaren', number: 4,  flag: '🇬🇧', points: 15, wins: 0, podiums: 0, color: '#FF8000', bio: 'Mistr světa 2025 s těžkým startem. McLaren adaptuje na nová pravidla — Norris útočí zpátky.', stats: [{ l: 'Tituly', v: '1' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Mercedes' }, { l: 'Šasi', v: 'MCL40' }] },
  { id: 'gasly',      name: 'Pierre Gasly',     short: 'GAS', team: 'Alpine',  number: 10, flag: '🇫🇷', points: 9,  wins: 0, podiums: 0, color: '#FF87BC', bio: 'Solidní start pro Alpine. 7. místo v šampionátu překonalo předsezónní očekávání.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Renault' }, { l: 'Šasi', v: 'A526' }] },
  { id: 'verstappen', name: 'Max Verstappen',   short: 'VER', team: 'Red Bull', number: 1, flag: '🇳🇱', points: 8,  wins: 0, podiums: 0, color: '#3671C6', bio: 'Čtyřnásobný mistr na 8. místě. Red Bull ztratil dominanci po nových pravidlech — Verstappen bojuje.', stats: [{ l: 'Tituly', v: '4' }, { l: 'Závodů', v: '2' }, { l: 'Motor', v: 'Ford' }, { l: 'Šasi', v: 'RB21' }] },
]

const TEAMS = [
  { id: 'mercedes', name: 'Mercedes-AMG',  color: '#00D2BE', points: 98, chassis: 'W16',   engine: 'Mercedes', titles: 8,  icon: '⭐', base: 'Brackley, UK' },
  { id: 'ferrari',  name: 'Ferrari',       color: '#E8002D', points: 67, chassis: 'SF-26', engine: 'Ferrari',  titles: 16, icon: '🐎', base: 'Maranello, IT' },
  { id: 'mclaren',  name: 'McLaren',       color: '#FF8000', points: 18, chassis: 'MCL40', engine: 'Mercedes', titles: 8,  icon: '🟠', base: 'Woking, UK' },
  { id: 'haas',     name: 'Haas',          color: '#B6BABD', points: 17, chassis: 'VF-26', engine: 'Ferrari',  titles: 0,  icon: '🦅', base: 'Kannapolis, USA' },
  { id: 'redbull',  name: 'Red Bull',      color: '#3671C6', points: 12, chassis: 'RB21',  engine: 'Ford',     titles: 6,  icon: '🐂', base: 'Milton Keynes' },
  { id: 'alpine',   name: 'Alpine',        color: '#FF87BC', points: 10, chassis: 'A526',  engine: 'Renault',  titles: 2,  icon: '🔵', base: 'Enstone, UK' },
  { id: 'audi',     name: 'Audi',          color: '#C0C0C0', points: 2,  chassis: 'C45',   engine: 'Audi',     titles: 0,  icon: '💠', base: 'Hinwil, CH' },
  { id: 'williams', name: 'Williams',      color: '#37BEDD', points: 2,  chassis: 'FW47',  engine: 'Mercedes', titles: 7,  icon: '🔷', base: 'Grove, UK' },
]

const RACES = [
  { round: 1,  name: 'Austrálie GP',      circuit: 'Melbourne',   date: '16 Bře', status: 'done',     winner: 'Russell' },
  { round: 2,  name: 'Čína GP',           circuit: 'Šanghaj',     date: '23 Bře', status: 'done',     winner: 'Antonelli' },
  { round: 3,  name: 'Japonsko GP',       circuit: 'Suzuka',      date: '6 Dub',  status: 'next',     winner: null },
  { round: 4,  name: 'Bahrajn GP',        circuit: 'Sakhir',      date: '20 Dub', status: 'upcoming', winner: null },
  { round: 5,  name: 'Miami GP',          circuit: 'Miami',       date: '4 Kvě',  status: 'upcoming', winner: null },
  { round: 6,  name: 'Emilia Romagna GP', circuit: 'Imola',       date: '18 Kvě', status: 'upcoming', winner: null },
  { round: 7,  name: 'Monako GP',         circuit: 'Monte Carlo', date: '25 Kvě', status: 'upcoming', winner: null },
  { round: 8,  name: 'Španělsko GP',      circuit: 'Barcelona',   date: '1 Čer',  status: 'upcoming', winner: null },
  { round: 9,  name: 'Kanada GP',         circuit: 'Montréal',    date: '15 Čer', status: 'upcoming', winner: null },
  { round: 10, name: 'Velká Británie GP', circuit: 'Silverstone', date: '6 Čvc',  status: 'upcoming', winner: null },
]

// Sketchfab free F1 models (veřejné, free licence)
const CARS_3D = [
  { id: 'generic',  name: 'F1 Race Car',    sub: 'Generický model 2024',  color: '#e10600', sfId: '084b2295407248cb8f6a856b7aeab004' },
  { id: 'concept26',name: 'F1 2026 Concept',sub: 'Koncept nových pravidel',color: '#3671C6', sfId: 'b5c4f3ef041345c68b8e918190d32a9c' },
  { id: 'mclaren',  name: 'McLaren MCL39',  sub: 'Koncept 2025/26',        color: '#FF8000', sfId: 'c6194270002b401bb25be7e35ab56e34' },
]

export default function F1Page() {
  const router = useRouter()
  const curRef = useRef(null)
  const dotRef = useRef(null)
  const [tab, setTab]               = useState('cars')
  const [activeDriver, setDriver]   = useState(null)
  const [activeCar, setCar]         = useState(0)
  const [loaded, setLoaded]         = useState(false)

  useEffect(() => {
    const cur = curRef.current; const dot = dotRef.current
    if (!cur || !dot) return
    let mx = window.innerWidth/2, my = window.innerHeight/2, lx = mx, ly = my, raf
    const mv = e => { mx=e.clientX; my=e.clientY; dot.style.left=mx+'px'; dot.style.top=my+'px' }
    document.addEventListener('mousemove', mv)
    const anim = () => { lx+=(mx-lx)*.12; ly+=(my-ly)*.12; cur.style.left=lx+'px'; cur.style.top=ly+'px'; raf=requestAnimationFrame(anim) }
    anim()
    return () => { document.removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis') }), {threshold:.08})
    setTimeout(() => document.querySelectorAll('.rev').forEach(el => obs.observe(el)), 100)
    return () => obs.disconnect()
  }, [tab])

  useEffect(() => { setLoaded(false) }, [activeCar])

  const car = CARS_3D[activeCar]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;900&family=Inter:wght@300;400;500&display=swap');
        *,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
        html{scroll-behavior:smooth;}
        body{background:#0a0a0a;color:#e0e0e0;font-family:'Inter',sans-serif;overflow-x:hidden;cursor:none!important;}
        *{cursor:none!important;}
        #cur{position:fixed;width:30px;height:30px;border:1.5px solid #e10600;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);box-shadow:0 0 12px rgba(225,6,0,.35);transition:width .15s,height .15s;}
        #dot{position:fixed;width:4px;height:4px;background:#e10600;border-radius:50%;pointer-events:none;z-index:99999;transform:translate(-50%,-50%);}
        body::before{content:'';position:fixed;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 4px,rgba(0,0,0,.025) 4px,rgba(0,0,0,.025) 5px);pointer-events:none;z-index:9990;}
        .rev{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s ease;}
        .vis{opacity:1!important;transform:translateY(0)!important;}
        ::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:#0a0a0a;}::-webkit-scrollbar-thumb{background:#e10600;}
        @keyframes loadbar{0%{left:-40%}100%{left:110%}}
      `}</style>

      <div id="cur" ref={curRef}/>
      <div id="dot" ref={dotRef}/>

      {/* NAV */}
      <nav style={{position:'sticky',top:0,zIndex:100,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 32px',height:58,background:'rgba(10,10,10,.97)',borderBottom:'1px solid rgba(255,255,255,.07)',backdropFilter:'blur(16px)'}}>
        <button onClick={() => router.push('/')} style={{background:'none',border:'1px solid rgba(255,255,255,.1)',padding:'6px 16px',color:'rgba(255,255,255,.4)',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:3,transition:'all .2s'}}
          onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,.3)'}}
          onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,.4)';e.currentTarget.style.borderColor='rgba(255,255,255,.1)'}}>← HUB</button>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <div style={{width:26,height:26,background:'#e10600',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,fontWeight:900,color:'#fff'}}>F1</span>
          </div>
          <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,fontWeight:600,letterSpacing:4,color:'#fff'}}>FORMULA ONE</span>
        </div>
        <div style={{display:'flex',gap:1}}>
          {[['cars','3D Vozy'],['drivers','Jezdci'],['teams','Týmy'],['calendar','Kalendář']].map(([t,l]) => (
            <button key={t} onClick={() => setTab(t)} style={{background:tab===t?'#e10600':'transparent',border:'none',color:tab===t?'#fff':'rgba(255,255,255,.35)',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,padding:'8px 16px',transition:'all .2s',textTransform:'uppercase'}}
              onMouseEnter={e=>{if(tab!==t)e.currentTarget.style.color='#fff'}}
              onMouseLeave={e=>{if(tab!==t)e.currentTarget.style.color='rgba(255,255,255,.35)'}}
            >{l}</button>
          ))}
        </div>
      </nav>

      {/* HERO */}
      <header style={{minHeight:'52vh',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'72px 24px 56px',textAlign:'center',background:'linear-gradient(180deg,#0e0e0e,#0a0a0a)',borderBottom:'1px solid rgba(255,255,255,.05)',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:'2px',background:'linear-gradient(90deg,transparent,#e10600,transparent)'}}/>
        <div style={{position:'absolute',fontSize:'clamp(100px,20vw,220px)',fontFamily:"'Orbitron',sans-serif",fontWeight:900,color:'rgba(255,255,255,.018)',letterSpacing:-10,userSelect:'none',pointerEvents:'none',lineHeight:1}}>F1</div>
        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,letterSpacing:8,color:'#c9a84c',marginBottom:18,position:'relative'}}>SEZÓNA 2026 · PO R2 ŠANGHAJ</p>
        <h1 style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(40px,7vw,90px)',fontWeight:900,letterSpacing:3,lineHeight:.9,color:'#fff',marginBottom:8,position:'relative'}}>
          FORMULA<br/><span style={{color:'#e10600'}}>ONE</span>
        </h1>
        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:'clamp(14px,2vw,20px)',fontWeight:400,letterSpacing:8,color:'rgba(255,255,255,.12)',marginBottom:44,position:'relative'}}>2026</p>
        <div style={{display:'flex',gap:2,maxWidth:560,width:'100%',position:'relative'}}>
          {DRIVERS.slice(0,3).map((d,i) => (
            <div key={d.id} className="rev" style={{flex:1,padding:'14px 12px',background:i===0?'rgba(201,168,76,.05)':'rgba(255,255,255,.02)',border:`1px solid ${i===0?'rgba(201,168,76,.2)':'rgba(255,255,255,.05)'}`,borderTop:`2px solid ${i===0?'#c9a84c':i===1?'#777':'#5a3a1a'}`,display:'flex',alignItems:'center',gap:10}}>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:18,fontWeight:900,color:i===0?'#c9a84c':i===1?'#999':'#7a5030',minWidth:18}}>{i+1}</span>
              <div style={{flex:1,textAlign:'left'}}>
                <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:'#fff',letterSpacing:1,marginBottom:1}}>{d.short}</p>
                <p style={{fontSize:9,color:'rgba(255,255,255,.28)',letterSpacing:1}}>{d.team}</p>
              </div>
              <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:15,color:d.color,fontWeight:600}}>{d.points}</span>
            </div>
          ))}
        </div>
      </header>

      <main style={{maxWidth:1100,margin:'0 auto',padding:'60px 24px'}}>

        {/* 3D CARS */}
        {tab==='cars' && (
          <div>
            <div style={{textAlign:'center',marginBottom:44}}>
              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:6,color:'#c9a84c',marginBottom:10}}>INTERAKTIVNÍ MODELY</p>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,letterSpacing:3,color:'#fff',marginBottom:6}}>3D VOZY</h2>
              <p style={{fontSize:12,color:'rgba(255,255,255,.28)',letterSpacing:1}}>Otočitelné modely · Táhni myší · Přibliž kolečkem</p>
            </div>
            <div style={{display:'flex',gap:2,justifyContent:'center',marginBottom:20}}>
              {CARS_3D.map((c,i) => (
                <button key={c.id} onClick={() => setCar(i)} style={{padding:'10px 24px',background:activeCar===i?'#e10600':'rgba(255,255,255,.03)',border:`1px solid ${activeCar===i?'#e10600':'rgba(255,255,255,.08)'}`,color:activeCar===i?'#fff':'rgba(255,255,255,.4)',fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:2,textTransform:'uppercase',transition:'all .2s'}}>
                  {c.name}
                </button>
              ))}
            </div>
            <div style={{background:'#0d0d0d',border:'1px solid rgba(255,255,255,.07)',overflow:'hidden',marginBottom:14}}>
              {/* Topbar */}
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 18px',borderBottom:'1px solid rgba(255,255,255,.05)',background:'#0a0a0a'}}>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:car.color,boxShadow:`0 0 8px ${car.color}`}}/>
                  <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:'#fff',letterSpacing:2}}>{car.name}</span>
                  <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,color:'rgba(255,255,255,.25)',letterSpacing:1}}>{car.sub}</span>
                </div>
                <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:3,color:'rgba(255,255,255,.18)'}}>SKETCHFAB 3D</span>
              </div>
              {/* Iframe */}
              <div style={{position:'relative',height:500}}>
                {!loaded && (
                  <div style={{position:'absolute',inset:0,background:'#0d0d0d',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:14,zIndex:5}}>
                    <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:4,color:'#e10600'}}>NAČÍTÁNÍ MODELU</span>
                    <div style={{width:180,height:2,background:'rgba(255,255,255,.05)',position:'relative',overflow:'hidden',borderRadius:1}}>
                      <div style={{position:'absolute',top:0,left:0,height:'100%',width:'35%',background:'#e10600',animation:'loadbar 1.1s ease-in-out infinite'}}/>
                    </div>
                  </div>
                )}
                <iframe
                  title={car.name}
                  src={`https://sketchfab.com/models/${car.sfId}/embed?autospin=0.25&autostart=1&ui_theme=dark&ui_infos=0&ui_watermark=0&ui_controls=1&ui_stop=0&camera=0`}
                  style={{width:'100%',height:'100%',border:'none'}}
                  allow="autoplay; fullscreen; xr-spatial-tracking"
                  onLoad={() => setLoaded(true)}
                />
              </div>
              {/* Controls hint */}
              <div style={{display:'flex',borderTop:'1px solid rgba(255,255,255,.04)'}}>
                {[['Otočit','Levé tlačítko'],['Přiblížit','Kolečko myši'],['Posunout','Pravé tlačítko']].map(([l,v]) => (
                  <div key={l} style={{flex:1,padding:'10px',textAlign:'center',borderRight:'1px solid rgba(255,255,255,.04)'}}>
                    <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.18)',marginBottom:3}}>{l}</p>
                    <p style={{fontSize:10,color:'rgba(255,255,255,.35)'}}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
            <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:4,color:'rgba(255,255,255,.15)',textAlign:'center',margin:'36px 0 16px'}}>PŘEHLED TÝMŮ</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:2}}>
              {TEAMS.map(t => (
                <div key={t.id} className="rev" style={{background:'#0d0d0d',border:'1px solid rgba(255,255,255,.05)',borderTop:`2px solid ${t.color}`,padding:'14px 12px',display:'flex',alignItems:'center',gap:10,transition:'transform .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                >
                  <span style={{fontSize:18}}>{t.icon}</span>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'#fff',letterSpacing:1,marginBottom:2}}>{t.name}</p>
                    <p style={{fontSize:8,color:'rgba(255,255,255,.25)'}}>{t.chassis}</p>
                  </div>
                  <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:13,color:t.color,fontWeight:600}}>{t.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DRIVERS */}
        {tab==='drivers' && (
          <div>
            <div style={{textAlign:'center',marginBottom:44}}>
              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:6,color:'#c9a84c',marginBottom:10}}>ŠAMPIONÁT 2026</p>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,letterSpacing:3,color:'#fff'}}>JEZDCI</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(255px,1fr))',gap:2}}>
              {DRIVERS.map((d,i) => (
                <div key={d.id} className="rev"
                  onClick={() => setDriver(activeDriver?.id===d.id?null:d)}
                  style={{background:activeDriver?.id===d.id?'rgba(255,255,255,.03)':'#0d0d0d',border:`1px solid ${activeDriver?.id===d.id?d.color+'44':'rgba(255,255,255,.05)'}`,borderTop:`2px solid ${d.color}`,padding:'20px 16px',position:'relative',overflow:'hidden',transition:'all .25s'}}
                  onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,.03)';e.currentTarget.style.transform='translateY(-2px)'}}
                  onMouseLeave={e=>{e.currentTarget.style.background=activeDriver?.id===d.id?'rgba(255,255,255,.03)':'#0d0d0d';e.currentTarget.style.transform='translateY(0)'}}
                >
                  <div style={{position:'absolute',top:8,right:10,fontFamily:"'Orbitron',sans-serif",fontSize:44,fontWeight:900,color:'rgba(255,255,255,.03)',lineHeight:1}}>{i+1}</div>
                  <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
                    <span style={{fontSize:22}}>{d.flag}</span>
                    <div>
                      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:'#fff',letterSpacing:1,marginBottom:2}}>{d.name}</p>
                      <p style={{fontSize:9,color:d.color,letterSpacing:2}}>{d.team} · #{d.number}</p>
                    </div>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:3}}>
                    {[['PTS',d.points],['WIN',d.wins],['POD',d.podiums]].map(([l,v]) => (
                      <div key={l} style={{background:'rgba(255,255,255,.025)',padding:'7px 4px',textAlign:'center'}}>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.2)',marginBottom:2}}>{l}</p>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:14,color:l==='PTS'?d.color:'#fff'}}>{v}</p>
                      </div>
                    ))}
                  </div>
                  {activeDriver?.id===d.id && (
                    <div style={{marginTop:14,borderTop:'1px solid rgba(255,255,255,.05)',paddingTop:13}}>
                      <p style={{fontSize:12,lineHeight:1.85,color:'rgba(220,220,220,.45)',marginBottom:12}}>{d.bio}</p>
                      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:3}}>
                        {d.stats.map(s => (
                          <div key={s.l} style={{background:'rgba(255,255,255,.02)',padding:'7px 9px',borderLeft:`2px solid ${d.color}44`}}>
                            <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.2)',marginBottom:2}}>{s.l}</p>
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
        {tab==='teams' && (
          <div>
            <div style={{textAlign:'center',marginBottom:44}}>
              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:6,color:'#c9a84c',marginBottom:10}}>KONSTRUKTÉŘI 2026</p>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,letterSpacing:3,color:'#fff'}}>TÝMY</h2>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))',gap:2}}>
              {[...TEAMS].sort((a,b)=>b.points-a.points).map((t,i) => (
                <div key={t.id} className="rev" style={{background:'#0d0d0d',border:'1px solid rgba(255,255,255,.05)',borderTop:`2px solid ${t.color}`,padding:'22px 18px',position:'relative',transition:'transform .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
                  onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}
                >
                  <div style={{position:'absolute',top:10,right:12,fontFamily:"'Orbitron',sans-serif",fontSize:30,fontWeight:900,color:'rgba(255,255,255,.035)'}}>{i+1}</div>
                  <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:18}}>
                    <div style={{width:44,height:44,background:`${t.color}14`,border:`1px solid ${t.color}2a`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{t.icon}</div>
                    <div>
                      <h3 style={{fontFamily:"'Orbitron',sans-serif",fontSize:12,color:'#fff',letterSpacing:1,marginBottom:3}}>{t.name}</h3>
                      <p style={{fontSize:9,color:'rgba(255,255,255,.25)',letterSpacing:1}}>{t.base}</p>
                    </div>
                    <span style={{marginLeft:'auto',fontFamily:"'Orbitron',sans-serif",fontSize:20,color:t.color,fontWeight:900}}>{t.points}</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:3}}>
                    {[['Šasi',t.chassis],['Motor',t.engine],['Tituly',t.titles]].map(([l,v]) => (
                      <div key={l} style={{background:'rgba(255,255,255,.02)',padding:'8px 5px',textAlign:'center'}}>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:2,color:'rgba(255,255,255,.18)',marginBottom:2}}>{l}</p>
                        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:11,color:l==='Tituly'?'#c9a84c':'#fff'}}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CALENDAR */}
        {tab==='calendar' && (
          <div>
            <div style={{textAlign:'center',marginBottom:44}}>
              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,letterSpacing:6,color:'#c9a84c',marginBottom:10}}>SEZÓNA 2026</p>
              <h2 style={{fontFamily:"'Orbitron',sans-serif",fontSize:26,letterSpacing:3,color:'#fff',marginBottom:14}}>KALENDÁŘ</h2>
              <div style={{width:280,height:2,background:'rgba(255,255,255,.05)',margin:'0 auto',position:'relative'}}>
                <div style={{position:'absolute',top:0,left:0,height:'100%',width:'20%',background:'linear-gradient(90deg,#e10600,#ff4422)'}}/>
              </div>
              <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,letterSpacing:3,color:'rgba(255,255,255,.2)',marginTop:8}}>2 / 10 ZÁVODŮ</p>
            </div>
            <div style={{maxWidth:700,margin:'0 auto',display:'flex',flexDirection:'column',gap:2}}>
              {RACES.map(r => (
                <div key={r.round} className="rev" style={{display:'flex',alignItems:'center',gap:14,background:r.status==='next'?'rgba(225,6,0,.05)':'#0d0d0d',border:`1px solid ${r.status==='next'?'rgba(225,6,0,.28)':'rgba(255,255,255,.04)'}`,borderLeft:`3px solid ${r.status==='done'?'#1e1e1e':r.status==='next'?'#e10600':'rgba(255,255,255,.05)'}`,padding:'14px 18px',transition:'background .2s'}}
                  onMouseEnter={e=>e.currentTarget.style.background=r.status==='next'?'rgba(225,6,0,.08)':'rgba(255,255,255,.02)'}
                  onMouseLeave={e=>e.currentTarget.style.background=r.status==='next'?'rgba(225,6,0,.05)':'#0d0d0d'}
                >
                  <span style={{fontFamily:"'Orbitron',sans-serif",fontSize:8,color:'rgba(255,255,255,.1)',minWidth:20}}>R{r.round}</span>
                  <div style={{flex:1}}>
                    <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:10,color:r.status==='done'?'rgba(255,255,255,.26)':'#fff',letterSpacing:1}}>{r.name}</p>
                    <p style={{fontSize:9,color:'rgba(255,255,255,.18)',letterSpacing:1,marginTop:2}}>{r.circuit}</p>
                  </div>
                  <div style={{textAlign:'right'}}>
                    <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:9,color:'rgba(255,255,255,.22)',letterSpacing:1}}>{r.date}</p>
                    {r.winner && <p style={{fontSize:8,color:'#c9a84c',letterSpacing:1,marginTop:3}}>🏆 {r.winner}</p>}
                    {r.status==='next' && <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,color:'#e10600',letterSpacing:3,marginTop:3}}>PŘÍŠTÍ</p>}
                  </div>
                  <div style={{width:6,height:6,borderRadius:'50%',flexShrink:0,background:r.status==='next'?'#e10600':r.status==='done'?'#222':'#141414',boxShadow:r.status==='next'?'0 0 8px #e10600':'none'}}/>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer style={{padding:'24px',borderTop:'1px solid rgba(255,255,255,.04)',textAlign:'center',background:'#0a0a0a'}}>
        <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:7,letterSpacing:4,color:'rgba(255,255,255,.1)'}}>F1 ARCHIV 2026 · DATA PO R2 ŠANGHAJ · BADOR108</p>
      </footer>
    </>
  )
}