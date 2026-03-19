'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/* ── DATA ── */
const DRIVERS = [
  { id: 'verstappen', name: 'Max Verstappen', team: 'Red Bull Racing', number: 1, flag: '🇳🇱', points: 437, wins: 19, podiums: 21, pole: 12, color: '#3671C6', teamColor: '#3671C6', bio: 'Čtyřnásobný mistr světa z Hasselt. Dominantní, agresivní a bezchybný. Nejlepší jezdec současné F1 generace.', stats: [{ l: 'Tituly', v: '4' }, { l: 'Vítězství', v: '62+' }, { l: 'Tým', v: 'Red Bull' }, { l: 'Motor', v: 'Honda RBPT' }] },
  { id: 'hamilton', name: 'Lewis Hamilton', team: 'Ferrari', number: 44, flag: '🇬🇧', points: 234, wins: 4, podiums: 11, pole: 3, color: '#E8002D', teamColor: '#E8002D', bio: 'Sedminásobný mistr světa. Legenda F1. V roce 2025 přestoupil do Ferrari — splnil si sen. Rekordman ve všech statistikách.', stats: [{ l: 'Tituly', v: '7' }, { l: 'Vítězství', v: '103+' }, { l: 'Tým', v: 'Ferrari' }, { l: 'Motor', v: 'Ferrari' }] },
  { id: 'leclerc', name: 'Charles Leclerc', team: 'Ferrari', number: 16, flag: '🇲🇨', points: 281, wins: 6, podiums: 14, pole: 8, color: '#E8002D', teamColor: '#E8002D', bio: 'Monacký princ Formule 1. Neuvěřitelně rychlý v kvalifikaci, bojuje o titul každou sezónu s Ferrari.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Vítězství', v: '8+' }, { l: 'Tým', v: 'Ferrari' }, { l: 'Motor', v: 'Ferrari' }] },
  { id: 'norris', name: 'Lando Norris', team: 'McLaren', number: 4, flag: '🇬🇧', points: 374, wins: 8, podiums: 18, pole: 6, color: '#FF8000', teamColor: '#FF8000', bio: 'Nejrychleji rostoucí hvězda F1. McLaren s ním bojuje o konstruktérský titul. Oblíbenec fanoušků.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Vítězství', v: '8+' }, { l: 'Tým', v: 'McLaren' }, { l: 'Motor', v: 'Mercedes' }] },
  { id: 'sainz', name: 'Carlos Sainz', team: 'Williams', number: 55, flag: '🇪🇸', points: 192, wins: 3, podiums: 8, pole: 4, color: '#37BEDD', teamColor: '#37BEDD', bio: 'Přestoupil z Ferrari do Williamsu. Konzistentní závodník se schopností vítězit i s méně dominantním autem.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Vítězství', v: '4+' }, { l: 'Tým', v: 'Williams' }, { l: 'Motor', v: 'Mercedes' }] },
  { id: 'russell', name: 'George Russell', team: 'Mercedes', number: 63, flag: '🇬🇧', points: 245, wins: 5, podiums: 12, pole: 5, color: '#27F4D2', teamColor: '#27F4D2', bio: 'Nová tvář Mercedesu. Analytický, rychlý a metodický. Čeká na správné auto pro útok na titul.', stats: [{ l: 'Tituly', v: '0' }, { l: 'Vítězství', v: '2+' }, { l: 'Tým', v: 'Mercedes' }, { l: 'Motor', v: 'Mercedes' }] },
]

const TEAMS = [
  { id: 'redbull', name: 'Red Bull Racing', base: 'Milton Keynes, UK', color: '#3671C6', chassis: 'RB21', engine: 'Honda RBPT', titles: 6, icon: '🐂' },
  { id: 'ferrari', name: 'Scuderia Ferrari', base: 'Maranello, Itálie', color: '#E8002D', chassis: 'SF-25', engine: 'Ferrari', titles: 16, icon: '🐎' },
  { id: 'mclaren', name: 'McLaren F1 Team', base: 'Woking, UK', color: '#FF8000', chassis: 'MCL39', engine: 'Mercedes', titles: 8, icon: '🟠' },
  { id: 'mercedes', name: 'Mercedes-AMG F1', base: 'Brackley, UK', color: '#27F4D2', chassis: 'W16', engine: 'Mercedes', titles: 8, icon: '⭐' },
  { id: 'aston', name: 'Aston Martin F1', base: 'Silverstone, UK', color: '#229971', chassis: 'AMR25', engine: 'Mercedes', titles: 0, icon: '🟢' },
  { id: 'alpine', name: 'Alpine F1 Team', base: 'Enstone, UK', color: '#FF87BC', chassis: 'A525', engine: 'Renault', titles: 2, icon: '🔵' },
]

const RACES = [
  { round: 1,  name: 'Bahrajn GP',      circuit: 'Sakhir',         date: '16 Mar', status: 'done',     winner: 'Verstappen' },
  { round: 2,  name: 'Saúdská Arábie GP', circuit: 'Jeddah',       date: '23 Mar', status: 'done',     winner: 'Norris' },
  { round: 3,  name: 'Austrálie GP',    circuit: 'Melbourne',       date: '30 Mar', status: 'next',     winner: null },
  { round: 4,  name: 'Japonsko GP',     circuit: 'Suzuka',          date: '13 Apr', status: 'upcoming', winner: null },
  { round: 5,  name: 'Čína GP',         circuit: 'Šanghaj',         date: '20 Apr', status: 'upcoming', winner: null },
  { round: 6,  name: 'Miami GP',        circuit: 'Miami Int.',       date: '4 Kvě', status: 'upcoming', winner: null },
  { round: 7,  name: 'Emilia Romagna GP', circuit: 'Imola',         date: '18 Kvě', status: 'upcoming', winner: null },
  { round: 8,  name: 'Monako GP',       circuit: 'Monte Carlo',     date: '25 Kvě', status: 'upcoming', winner: null },
  { round: 9,  name: 'Španělsko GP',    circuit: 'Barcelona',       date: '1 Čer', status: 'upcoming', winner: null },
  { round: 10, name: 'Kanada GP',       circuit: 'Montréal',        date: '15 Čer', status: 'upcoming', winner: null },
  { round: 11, name: 'Rakousko GP',     circuit: 'Spielberg',       date: '29 Čer', status: 'upcoming', winner: null },
  { round: 12, name: 'Velká Británie GP', circuit: 'Silverstone',   date: '6 Čvc', status: 'upcoming', winner: null },
]

const CAR_COLORS = {
  redbull:  { body: '#1a2d6e', accent: '#3671C6', nose: '#cc1000' },
  ferrari:  { body: '#cc0000', accent: '#ffdd00', nose: '#cc0000' },
  mclaren:  { body: '#ff8000', accent: '#000', nose: '#ff8000' },
  mercedes: { body: '#111', accent: '#27F4D2', nose: '#222' },
  aston:    { body: '#1a5c44', accent: '#229971', nose: '#1a5c44' },
  alpine:   { body: '#0033aa', accent: '#FF87BC', nose: '#0033aa' },
}

/* ── COMPONENT ── */
export default function F1() {
  const router = useRouter()
  const starsRef = useRef(null)
  const [activeDriver, setActiveDriver] = useState(null)
  const [activeTab, setActiveTab] = useState('drivers')
  const [selectedCar, setSelectedCar] = useState('redbull')
  const [carAngle, setCarAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState(0)
  const animRef = useRef(null)

  /* Stars */
  useEffect(() => {
    const canvas = starsRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    const stars = Array.from({ length: 150 }, () => ({ x: Math.random() * 2000, y: Math.random() * 2000, r: Math.random() * 1.2 + .2, a: Math.random(), speed: Math.random() * .2 + .05 }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => { s.a += s.speed * .004; if (s.a > 1) s.a = 0; ctx.globalAlpha = s.a * .6; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(s.x % canvas.width, s.y % canvas.height, s.r, 0, Math.PI * 2); ctx.fill() })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* Auto-rotate car */
  useEffect(() => {
    if (isDragging) return
    const id = setInterval(() => setCarAngle(a => (a + .4) % 360), 16)
    return () => clearInterval(id)
  }, [isDragging])

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('f1-visible') }) }, { threshold: .1 })
    document.querySelectorAll('.f1-reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [activeTab])

  const car = CAR_COLORS[selectedCar]
  const rad = (carAngle * Math.PI) / 180
  const cosA = Math.cos(rad)

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior:smooth; }
        body { background:#05060a; color:#c8cdd8; font-family:'DM Sans',sans-serif; overflow-x:hidden; }
        body::after { content:''; position:fixed; inset:0; background:repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,.06) 3px,rgba(0,0,0,.06) 4px); pointer-events:none; z-index:9990; }
        .f1-reveal { opacity:0; transform:translateY(24px); transition:opacity .6s ease, transform .6s ease; }
        .f1-visible { opacity:1!important; transform:translateY(0)!important; }
        ::-webkit-scrollbar { width:4px; } ::-webkit-scrollbar-track { background:#05060a; } ::-webkit-scrollbar-thumb { background:#ff2800; }
      `}</style>

      <canvas ref={starsRef} style={{ position:'fixed', inset:0, zIndex:0, pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1 }}>

        {/* ── NAV ── */}
        <nav style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 32px', height:56,
          borderBottom:'1px solid rgba(255,255,255,.06)',
          background:'rgba(5,6,10,.9)', backdropFilter:'blur(12px)',
          position:'sticky', top:0, zIndex:100,
        }}>
          <button onClick={() => router.push('/')} style={{
            background:'none', border:'none', cursor:'pointer',
            fontFamily:"'Orbitron',sans-serif", fontSize:11, letterSpacing:3,
            color:'rgba(255,255,255,.3)', display:'flex', alignItems:'center', gap:8,
            transition:'color .2s',
          }}
            onMouseEnter={e => e.target.style.color='#fff'}
            onMouseLeave={e => e.target.style.color='rgba(255,255,255,.3)'}
          >← HUB</button>

          <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:18, fontWeight:900, letterSpacing:4, color:'#fff' }}>
            F<span style={{ color:'#ff2800' }}>1</span> ARCHIV
          </div>

          <div style={{ display:'flex', gap:4 }}>
            {['drivers', 'teams', 'cars', 'calendar'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                background: activeTab === tab ? 'rgba(255,40,0,.15)' : 'none',
                border: activeTab === tab ? '1px solid rgba(255,40,0,.4)' : '1px solid transparent',
                color: activeTab === tab ? '#ff6644' : 'rgba(255,255,255,.4)',
                fontFamily:"'Orbitron',sans-serif", fontSize:9, letterSpacing:2,
                padding:'6px 14px', cursor:'pointer', textTransform:'uppercase',
                transition:'all .2s',
              }}>
                {{ drivers:'Jezdci', teams:'Týmy', cars:'3D Auta', calendar:'Kalendář' }[tab]}
              </button>
            ))}
          </div>
        </nav>

        {/* ── HERO ── */}
        <section style={{
          minHeight:'70vh', display:'flex', flexDirection:'column',
          alignItems:'center', justifyContent:'center',
          padding:'80px 20px', textAlign:'center',
          background:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,40,0,.08), transparent)',
          borderBottom:'1px solid rgba(255,255,255,.04)',
          position:'relative', overflow:'hidden',
        }}>
          {/* Speed lines */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{
              position:'absolute', top:`${10 + i * 11}%`, left:0, right:0,
              height:'1px', background:`linear-gradient(90deg,transparent,rgba(255,40,0,${0.03 + i * 0.01}),transparent)`,
              transform:`skewY(${-2 + i * 0.5}deg)`,
            }} />
          ))}

          <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, letterSpacing:6, color:'rgba(255,40,0,.6)', textTransform:'uppercase', marginBottom:20 }}>
            SEZÓNA 2025
          </p>
          <h1 style={{
            fontFamily:"'Orbitron',sans-serif",
            fontSize:'clamp(48px,8vw,100px)', fontWeight:900,
            letterSpacing:2, lineHeight:.9, color:'#fff', marginBottom:16,
          }}>
            FORMULA<br />
            <span style={{ color:'#ff2800', WebkitTextStroke:'1px #ff2800' }}>ONE</span>
          </h1>
          <p style={{ fontSize:16, letterSpacing:2, color:'rgba(200,205,216,.5)', maxWidth:480, lineHeight:1.8, marginBottom:40 }}>
            Jezdci, týmy, 3D modely a kalendář závodů sezóny 2025.
          </p>

          {/* Mini standings */}
          <div style={{ display:'flex', gap:2, flexWrap:'wrap', justifyContent:'center', maxWidth:600 }}>
            {DRIVERS.slice(0,3).map((d, i) => (
              <div key={d.id} style={{
                background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)',
                padding:'12px 20px', display:'flex', alignItems:'center', gap:12, flex:1, minWidth:160,
              }}>
                <span style={{ fontFamily:"'Orbitron',sans-serif", fontSize:20, fontWeight:900, color: i===0?'#ffd700':i===1?'#c0c0c0':'#cd7f32' }}>{i+1}</span>
                <div>
                  <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:'#fff', letterSpacing:1 }}>{d.name.split(' ')[1]}</p>
                  <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:1 }}>{d.points} PTS</p>
                </div>
                <div style={{ width:3, height:32, background:d.color, marginLeft:'auto', borderRadius:2 }} />
              </div>
            ))}
          </div>
        </section>

        {/* ── CONTENT ── */}
        <div style={{ maxWidth:1200, margin:'0 auto', padding:'60px 20px' }}>

          {/* DRIVERS TAB */}
          {activeTab === 'drivers' && (
            <div>
              <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, letterSpacing:4, color:'#fff', marginBottom:8, textAlign:'center' }}>JEZDCI</h2>
              <p style={{ textAlign:'center', fontSize:13, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:48 }}>Klikni pro detail</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:2 }}>
                {DRIVERS.map(d => (
                  <div key={d.id} className="f1-reveal"
                    onClick={() => setActiveDriver(activeDriver?.id === d.id ? null : d)}
                    style={{
                      background: activeDriver?.id === d.id ? `rgba(${d.color.slice(1).match(/../g).map(x=>parseInt(x,16)).join(',')},0.1)` : '#08090f',
                      border:`1px solid ${activeDriver?.id === d.id ? d.color+'66' : 'rgba(255,255,255,.05)'}`,
                      cursor:'pointer', transition:'all .3s', padding:'28px 24px',
                      position:'relative', overflow:'hidden',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = d.color + '44'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                    onMouseLeave={e => { if (activeDriver?.id !== d.id) { e.currentTarget.style.borderColor = 'rgba(255,255,255,.05)'; e.currentTarget.style.transform = 'translateY(0)' } }}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${d.color},transparent)` }} />
                    <div style={{ position:'absolute', top:16, right:16, fontFamily:"'Orbitron',sans-serif", fontSize:32, fontWeight:900, color:`${d.color}22`, letterSpacing:-2 }}>{d.number}</div>

                    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                      <span style={{ fontSize:28 }}>{d.flag}</span>
                      <div>
                        <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, letterSpacing:1, color:'#fff' }}>{d.name}</p>
                        <p style={{ fontSize:11, color:d.color, letterSpacing:2, marginTop:2 }}>{d.team}</p>
                      </div>
                    </div>

                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, marginBottom: activeDriver?.id === d.id ? 20 : 0 }}>
                      {[['PTS', d.points], ['WIN', d.wins], ['POD', d.podiums]].map(([l, v]) => (
                        <div key={l} style={{ background:'rgba(255,255,255,.03)', padding:'8px', textAlign:'center' }}>
                          <p style={{ fontSize:9, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:2 }}>{l}</p>
                          <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:16, color:'#fff' }}>{v}</p>
                        </div>
                      ))}
                    </div>

                    {activeDriver?.id === d.id && (
                      <div style={{ borderTop:'1px solid rgba(255,255,255,.06)', paddingTop:16 }}>
                        <p style={{ fontSize:13, lineHeight:1.8, color:'rgba(200,205,216,.6)', marginBottom:16 }}>{d.bio}</p>
                        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                          {d.stats.map(s => (
                            <div key={s.l} style={{ background:'rgba(255,255,255,.03)', padding:'10px 12px', borderLeft:`2px solid ${d.color}66` }}>
                              <p style={{ fontSize:9, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:4 }}>{s.l}</p>
                              <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, color:d.color }}>{s.v}</p>
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

          {/* TEAMS TAB */}
          {activeTab === 'teams' && (
            <div>
              <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, letterSpacing:4, color:'#fff', marginBottom:8, textAlign:'center' }}>TÝMY</h2>
              <p style={{ textAlign:'center', fontSize:13, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:48 }}>Konstruktéři sezóny 2025</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(340px,1fr))', gap:2 }}>
                {TEAMS.map(t => (
                  <div key={t.id} className="f1-reveal" style={{
                    background:'#08090f', border:'1px solid rgba(255,255,255,.05)',
                    padding:'32px 28px', position:'relative', overflow:'hidden',
                    transition:'border-color .3s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = t.color + '44'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.05)'}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg,transparent,${t.color},transparent)` }} />
                    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
                      <div style={{ width:52, height:52, background:`${t.color}22`, border:`1px solid ${t.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, borderRadius:4 }}>{t.icon}</div>
                      <div>
                        <h3 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:14, letterSpacing:1, color:'#fff', marginBottom:4 }}>{t.name}</h3>
                        <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:1 }}>{t.base}</p>
                      </div>
                    </div>
                    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8 }}>
                      {[['Šasi', t.chassis], ['Motor', t.engine], ['Tituly', t.titles]].map(([l, v]) => (
                        <div key={l} style={{ background:'rgba(255,255,255,.03)', padding:'10px 8px', textAlign:'center' }}>
                          <p style={{ fontSize:9, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:4 }}>{l}</p>
                          <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, color: l==='Tituly'? t.color : '#fff' }}>{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CARS TAB */}
          {activeTab === 'cars' && (
            <div>
              <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, letterSpacing:4, color:'#fff', marginBottom:8, textAlign:'center' }}>3D MODELY AUT</h2>
              <p style={{ textAlign:'center', fontSize:13, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:48 }}>Táhni myší pro rotaci · Vyber tým</p>

              {/* Team selector */}
              <div style={{ display:'flex', gap:8, justifyContent:'center', flexWrap:'wrap', marginBottom:40 }}>
                {TEAMS.map(t => (
                  <button key={t.id} onClick={() => setSelectedCar(t.id)} style={{
                    background: selectedCar === t.id ? `${t.color}22` : 'rgba(255,255,255,.03)',
                    border: `1px solid ${selectedCar === t.id ? t.color : 'rgba(255,255,255,.08)'}`,
                    color: selectedCar === t.id ? t.color : 'rgba(255,255,255,.4)',
                    fontFamily:"'Orbitron',sans-serif", fontSize:9, letterSpacing:2,
                    padding:'8px 16px', cursor:'pointer', textTransform:'uppercase', transition:'all .2s',
                  }}>{t.name.split(' ')[0]}</button>
                ))}
              </div>

              {/* 3D Car canvas */}
              <div style={{
                maxWidth:700, margin:'0 auto 40px',
                background:'#06080e', border:`1px solid ${CAR_COLORS[selectedCar].accent}22`,
                position:'relative', overflow:'hidden', height:320,
                cursor:'grab',
              }}
                onMouseDown={e => { setIsDragging(true); setDragStart(e.clientX) }}
                onMouseMove={e => { if (isDragging) setCarAngle(a => a + (e.clientX - dragStart) * 0.5); setDragStart(e.clientX) }}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
              >
                {/* Grid floor */}
                <div style={{ position:'absolute', bottom:60, left:0, right:0, height:1, background:`linear-gradient(90deg,transparent,${car.accent}33,transparent)` }} />
                {Array.from({length:8}).map((_,i) => (
                  <div key={i} style={{ position:'absolute', bottom:60, left:`${10+i*11}%`, width:1, height:60, background:`${car.accent}11` }} />
                ))}

                {/* Glow */}
                <div style={{ position:'absolute', bottom:40, left:'50%', transform:'translateX(-50%)', width:300, height:40, borderRadius:'50%', background:`${car.accent}22`, filter:'blur(20px)' }} />

                {/* SVG Car */}
                <svg viewBox="0 0 600 240" style={{ width:'100%', height:'100%', userSelect:'none' }}>
                  {/* Shadow */}
                  <ellipse cx="300" cy="200" rx={120 + Math.abs(cosA) * 20} ry="12" fill={car.accent} opacity="0.08" />

                  {/* Car body - perspective transform based on angle */}
                  <g transform={`translate(300,110) scale(${0.8 + Math.abs(cosA) * 0.2},1)`}>
                    {/* Main body */}
                    <path d={`M-140,30 L-100,-10 L-20,-30 L80,-32 L130,-10 L140,20 L140,35 L-140,35 Z`} fill={car.body} />
                    {/* Cockpit */}
                    <path d={`M-30,-30 L10,-55 L50,-55 L80,-30 Z`} fill={car.body} opacity="0.9" />
                    {/* Cockpit glass */}
                    <path d={`M-15,-32 L10,-52 L50,-52 L70,-32 Z`} fill="rgba(100,180,255,0.3)" />
                    {/* Nose */}
                    <path d={`M80,-32 L140,-10 L155,5 L130,-10 Z`} fill={car.nose} />
                    {/* Sidepods */}
                    <path d={`M-60,0 L60,0 L80,35 L-80,35 Z`} fill={car.accent} opacity="0.3" />
                    {/* Rear wing */}
                    <rect x="-145" y="-20" width="20" height="4" rx="1" fill={car.accent} opacity="0.8" />
                    <rect x="-145" y="-12" width="20" height="4" rx="1" fill={car.accent} opacity="0.6" />
                    <rect x="-135" y="-20" width="2" height="55" fill={car.accent} opacity="0.5" />
                    {/* Front wing */}
                    <rect x="130" y="8" width="25" height="3" rx="1" fill={car.accent} opacity="0.7" />
                    <rect x="125" y="14" width="30" height="2" rx="1" fill={car.accent} opacity="0.5" />
                    {/* Wheels */}
                    <ellipse cx="-100" cy="35" rx={cosA > 0 ? 22 : 18} ry="18" fill="#111" stroke={car.accent} strokeWidth="3" />
                    <ellipse cx="110" cy="35" rx={cosA < 0 ? 22 : 18} ry="18" fill="#111" stroke={car.accent} strokeWidth="3" />
                    <ellipse cx="-100" cy="35" rx="8" ry="8" fill={car.accent} opacity="0.4" />
                    <ellipse cx="110" cy="35" rx="8" ry="8" fill={car.accent} opacity="0.4" />
                    {/* Team number */}
                    <text x="0" y="-5" textAnchor="middle" fill="white" fontSize="14" fontFamily="Orbitron,sans-serif" fontWeight="900" opacity="0.8">
                      {TEAMS.find(t=>t.id===selectedCar)?.name.slice(0,3).toUpperCase()}
                    </text>
                    {/* Accent stripe */}
                    <rect x="-60" y="-31" width="100" height="3" rx="1" fill={car.accent} opacity="0.6" />
                  </g>

                  {/* Speed lines when rotating */}
                  {isDragging && Array.from({length:6}).map((_,i) => (
                    <line key={i} x1={50+i*80} y1={80+i*10} x2={50+i*80-30} y2={80+i*10} stroke={car.accent} strokeWidth="0.5" opacity="0.3" />
                  ))}
                </svg>

                {/* Corner decorations */}
                <div style={{ position:'absolute', top:12, left:12, width:16, height:16, borderTop:`1px solid ${car.accent}44`, borderLeft:`1px solid ${car.accent}44` }} />
                <div style={{ position:'absolute', top:12, right:12, width:16, height:16, borderTop:`1px solid ${car.accent}44`, borderRight:`1px solid ${car.accent}44` }} />
                <div style={{ position:'absolute', bottom:12, left:12, width:16, height:16, borderBottom:`1px solid ${car.accent}44`, borderLeft:`1px solid ${car.accent}44` }} />
                <div style={{ position:'absolute', bottom:12, right:12, width:16, height:16, borderBottom:`1px solid ${car.accent}44`, borderRight:`1px solid ${car.accent}44` }} />

                <p style={{ position:'absolute', bottom:16, left:'50%', transform:'translateX(-50%)', fontFamily:"'Orbitron',sans-serif", fontSize:9, letterSpacing:3, color:`${car.accent}88`, textTransform:'uppercase' }}>
                  {TEAMS.find(t=>t.id===selectedCar)?.chassis}
                </p>
              </div>

              {/* Car specs */}
              {(() => { const t = TEAMS.find(t=>t.id===selectedCar); return (
                <div style={{ maxWidth:700, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2 }}>
                  {[['Šasi', t.chassis], ['Motor', t.engine], ['Tituly', t.titles], ['Základna', t.base.split(',')[0]]].map(([l,v]) => (
                    <div key={l} style={{ background:'#08090f', border:`1px solid rgba(255,255,255,.05)`, padding:'16px', textAlign:'center' }}>
                      <p style={{ fontSize:9, letterSpacing:3, color:'rgba(255,255,255,.3)', marginBottom:6 }}>{l}</p>
                      <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, color: CAR_COLORS[selectedCar].accent }}>{v}</p>
                    </div>
                  ))}
                </div>
              )})()}
            </div>
          )}

          {/* CALENDAR TAB */}
          {activeTab === 'calendar' && (
            <div>
              <h2 style={{ fontFamily:"'Orbitron',sans-serif", fontSize:28, letterSpacing:4, color:'#fff', marginBottom:8, textAlign:'center' }}>KALENDÁŘ 2025</h2>
              <p style={{ textAlign:'center', fontSize:13, letterSpacing:2, color:'rgba(255,255,255,.3)', marginBottom:48 }}>Sezóna F1 2025</p>
              <div style={{ maxWidth:800, margin:'0 auto', display:'flex', flexDirection:'column', gap:2 }}>
                {RACES.map(r => (
                  <div key={r.round} className="f1-reveal" style={{
                    display:'flex', alignItems:'center', gap:20,
                    background: r.status==='next' ? 'rgba(255,40,0,.08)' : r.status==='done' ? 'rgba(255,255,255,.02)' : '#08090f',
                    border:`1px solid ${r.status==='next' ? 'rgba(255,40,0,.4)' : r.status==='done' ? 'rgba(255,255,255,.04)' : 'rgba(255,255,255,.05)'}`,
                    padding:'16px 24px', transition:'border-color .2s',
                  }}
                    onMouseEnter={e => { if(r.status!=='next') e.currentTarget.style.borderColor='rgba(255,40,0,.2)' }}
                    onMouseLeave={e => { if(r.status!=='next') e.currentTarget.style.borderColor=r.status==='done'?'rgba(255,255,255,.04)':'rgba(255,255,255,.05)' }}
                  >
                    <div style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:'rgba(255,255,255,.2)', minWidth:28 }}>R{r.round}</div>
                    <div style={{ flex:1 }}>
                      <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:13, color: r.status==='done'?'rgba(255,255,255,.4)':'#fff', letterSpacing:1 }}>{r.name}</p>
                      <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:1, marginTop:2 }}>{r.circuit}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:11, color:'rgba(255,255,255,.4)', letterSpacing:1 }}>{r.date}</p>
                      {r.winner && <p style={{ fontSize:10, color:'#ff6644', letterSpacing:1, marginTop:2 }}>🏆 {r.winner}</p>}
                    </div>
                    <div style={{
                      width:8, height:8, borderRadius:'50%',
                      background: r.status==='next'?'#ff2800':r.status==='done'?'#555':'#222',
                      boxShadow: r.status==='next'?'0 0 8px #ff2800':'none',
                    }} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer style={{ padding:'40px 20px', borderTop:'1px solid rgba(255,255,255,.04)', textAlign:'center', background:'#05060a' }}>
          <p style={{ fontFamily:"'Orbitron',sans-serif", fontSize:9, letterSpacing:4, color:'rgba(255,255,255,.15)', textTransform:'uppercase' }}>
            F1 Interaktivní Archiv · Sezóna 2025 · bador108
          </p>
        </footer>
      </div>
    </>
  )
}