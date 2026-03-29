'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/* ─── HELPERS ─── */
const TEAM_COLOR = {
  mercedes:'#00D2BE', ferrari:'#E8002D', mclaren:'#FF8000',
  red_bull:'#3671C6', alpine:'#FF87BC', haas:'#FFFFFF',
  aston_martin:'#358C75', williams:'#37BEDD', rb:'#6692FF',
  racing_bulls:'#6692FF', visa_cash_app_rb:'#6692FF',
  kick_sauber:'#52E252', sauber:'#52E252', audi:'#C0C0C0',
}
const tc = id => TEAM_COLOR[id] ?? '#888'

const FLAGS = {
  British:'🇬🇧',Dutch:'🇳🇱',Italian:'🇮🇹',German:'🇩🇪',Spanish:'🇪🇸',
  French:'🇫🇷',Finnish:'🇫🇮',Australian:'🇦🇺',Mexican:'🇲🇽',Canadian:'🇨🇦',
  Japanese:'🇯🇵',Thai:'🇹🇭',Chinese:'🇨🇳',Danish:'🇩🇰',American:'🇺🇸',
  'New Zealander':'🇳🇿',Monegasque:'🇲🇨',Brazilian:'🇧🇷',Austrian:'🇦🇹',
  Belgian:'🇧🇪',Swiss:'🇨🇭',Swedish:'🇸🇪',Polish:'🇵🇱',Argentine:'🇦🇷',
}
const flag = nat => FLAGS[nat] ?? '🏳'

const CIRCUIT_FLAGS = {
  'Albert Park Grand Prix Circuit':'🇦🇺',
  'Shanghai International Circuit':'🇨🇳',
  'Suzuka Circuit':'🇯🇵',
  'Bahrain International Circuit':'🇧🇭',
  'Miami International Autodrome':'🇺🇸',
  'Autodromo Enzo e Dino Ferrari':'🇮🇹',
  'Circuit de Monaco':'🇲🇨',
  'Circuit de Barcelona-Catalunya':'🇪🇸',
  'Circuit Gilles Villeneuve':'🇨🇦',
  'Silverstone Circuit':'🇬🇧',
  'Hungaroring':'🇭🇺',
  'Circuit de Spa-Francorchamps':'🇧🇪',
  'Circuit Park Zandvoort':'🇳🇱',
  'Autodromo Nazionale di Monza':'🇮🇹',
  'Baku City Circuit':'🇦🇿',
  'Marina Bay Street Circuit':'🇸🇬',
  'Circuit of the Americas':'🇺🇸',
  'Autódromo Hermanos Rodríguez':'🇲🇽',
  'Autódromo José Carlos Pace':'🇧🇷',
  'Las Vegas Strip Street Circuit':'🇺🇸',
  'Losail International Circuit':'🇶🇦',
  'Yas Marina Circuit':'🇦🇪',
}
const cflag = name => CIRCUIT_FLAGS[name] ?? '🏁'

const fmt = d => new Date(d).toLocaleDateString('cs-CZ',{day:'numeric',month:'short'})

/* ─── THREE.JS CAR ─── */
function Car3D({ color = '#e10600' }) {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !window.THREE) return
    const T = window.THREE, W = el.clientWidth, H = el.clientHeight
    const renderer = new T.WebGLRenderer({ antialias:true, alpha:true })
    renderer.setSize(W,H); renderer.setPixelRatio(Math.min(devicePixelRatio,2))
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = T.PCFSoftShadowMap
    el.appendChild(renderer.domElement)
    const scene = new T.Scene()
    const cam = new T.PerspectiveCamera(40,W/H,0.1,100)
    cam.position.set(5,2.5,6); cam.lookAt(0,0.2,0)
    scene.add(new T.AmbientLight(0xffffff,0.45))
    const sun = new T.DirectionalLight(0xffffff,1.6)
    sun.position.set(8,12,8); sun.castShadow=true
    sun.shadow.mapSize.width=2048; sun.shadow.mapSize.height=2048; scene.add(sun)
    scene.add(Object.assign(new T.DirectionalLight(0xaabbff,0.35),{position:{set:()=>{}}}).clone())
    const fill=new T.DirectionalLight(0xaabbff,0.35); fill.position.set(-6,3,-5); scene.add(fill)
    const rim=new T.DirectionalLight(new T.Color(color),0.9); rim.position.set(0,-4,-8); scene.add(rim)
    const gnd=new T.Mesh(new T.PlaneGeometry(40,40),new T.MeshStandardMaterial({color:0x050505,metalness:.95,roughness:.05}))
    gnd.rotation.x=-Math.PI/2; gnd.position.y=-0.57; gnd.receiveShadow=true; scene.add(gnd)
    const C=new T.Color(color)
    const bM=new T.MeshStandardMaterial({color:C,metalness:.8,roughness:.15})
    const dM=new T.MeshStandardMaterial({color:0x0d0d0d,metalness:.5,roughness:.5})
    const cM=new T.MeshStandardMaterial({color:0x141414,metalness:.35,roughness:.65})
    const tM=new T.MeshStandardMaterial({color:0x0a0a0a,roughness:.92})
    const rM=new T.MeshStandardMaterial({color:0xdddddd,metalness:.98,roughness:.02})
    const gM=new T.MeshStandardMaterial({color:0x223355,transparent:true,opacity:.4,roughness:0,metalness:.1})
    const sM=new T.MeshStandardMaterial({color:0x999999,metalness:.92,roughness:.12})
    const xM=new T.MeshStandardMaterial({color:0xff3300,emissive:0xff1100,emissiveIntensity:.5,roughness:.45})
    const car=new T.Group()
    const mk=(geo,mat,x,y,z,rx=0,ry=0,rz=0)=>{const m=new T.Mesh(geo,mat);m.castShadow=true;m.position.set(x,y,z);m.rotation.set(rx,ry,rz);car.add(m);return m}
    mk(new T.BoxGeometry(3.5,.26,.68),bM,0,0,0)
    mk(new T.CylinderGeometry(.06,.30,1.6,12),bM,2.24,-.01,0,0,0,Math.PI/2)
    mk(new T.BoxGeometry(1.3,.28,.36),cM,-.78,.2,0)
    mk(new T.BoxGeometry(.72,.18,.44),cM,.1,.22,0)
    mk(new T.BoxGeometry(.52,.08,.30),gM,.12,.32,0)
    mk(new T.CylinderGeometry(.08,.11,.22,12),dM,.14,.44,0)
    const hPts=[];for(let i=0;i<=24;i++){const a=(i/24)*Math.PI;hPts.push(new T.Vector3(Math.cos(a)*.3-.05,Math.sin(a)*.33+.28,0))}
    mk(new T.TubeGeometry(new T.CatmullRomCurve3(hPts),24,.02,8,false),sM,0,0,0)
    mk(new T.BoxGeometry(3.2,.04,.84),cM,-.1,-.17,0)
    ;[-1,1].forEach(s=>{mk(new T.BoxGeometry(1.6,.18,.2),bM,-.05,-.03,s*.43);mk(new T.CylinderGeometry(.07,.10,.06,12),dM,.44,.01,s*.55,Math.PI/2,0,0)})
    mk(new T.BoxGeometry(.05,.32,1.06),bM,-1.72,.32,0);mk(new T.BoxGeometry(.05,.06,1.06),bM,-1.72,.56,0)
    ;[-1,1].forEach(s=>mk(new T.BoxGeometry(.30,.46,.04),bM,-1.72,.35,s*.53))
    mk(new T.BoxGeometry(.05,.035,1.14),bM,2.56,-.21,0);mk(new T.BoxGeometry(.34,.035,1.04),bM,2.36,-.165,0)
    ;[-1,1].forEach(s=>mk(new T.BoxGeometry(.38,.19,.04),bM,2.4,-.165,s*.54))
    ;[{x:1.48,y:-.24,z:.63,r:1},{x:1.48,y:-.24,z:-.63,r:1},{x:-1.14,y:-.24,z:.70,r:1.1},{x:-1.14,y:-.24,z:-.70,r:1.1}].forEach(wp=>{
      mk(new T.CylinderGeometry(.30*wp.r,.30*wp.r,.26,28),tM,wp.x,wp.y,wp.z,Math.PI/2,0,0)
      mk(new T.CylinderGeometry(.20*wp.r,.20*wp.r,.28,18),rM,wp.x,wp.y,wp.z,Math.PI/2,0,0)
      mk(new T.CylinderGeometry(.12*wp.r,.12*wp.r,.06,16),xM,wp.x,wp.y,wp.z,Math.PI/2,0,0)
      for(let i=0;i<5;i++){const sp=new T.Mesh(new T.BoxGeometry(.02,.16*wp.r,.03),rM);sp.rotation.z=(i/5)*Math.PI*2;sp.position.set(wp.x,wp.y,wp.z);car.add(sp)}
      const arm=new T.Mesh(new T.CylinderGeometry(.012,.012,.52,6),sM);arm.rotation.z=Math.PI/2;arm.position.set(wp.x+(wp.x>0?-.26:.26),wp.y+.07,wp.z*.55);car.add(arm)
    })
    car.position.y=.22; scene.add(car)
    let mx=0,my=0
    const onMM=e=>{const r=el.getBoundingClientRect();mx=((e.clientX-r.left)/W-.5)*2;my=((e.clientY-r.top)/H-.5)*2}
    el.addEventListener('mousemove',onMM)
    let t=0,raf
    const tick=()=>{raf=requestAnimationFrame(tick);t+=.007;car.rotation.y=t+mx*.45;car.rotation.x=my*.06;car.position.y=.22+Math.sin(t*.65)*.045;renderer.render(scene,cam)}
    tick()
    const onResize=()=>{if(!el)return;const nW=el.clientWidth,nH=el.clientHeight;renderer.setSize(nW,nH);cam.aspect=nW/nH;cam.updateProjectionMatrix()}
    window.addEventListener('resize',onResize)
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);el.removeEventListener('mousemove',onMM);if(el.contains(renderer.domElement))el.removeChild(renderer.domElement);renderer.dispose()}
  },[color])
  return <div ref={ref} style={{width:'100%',height:'100%'}} />
}

/* ─── MAIN PAGE ─── */
export default function F1Page() {
  const router = useRouter()
  const [tab, setTab] = useState('overview')
  const [threeReady, setThreeReady] = useState(false)
  const [carColor, setCarColor] = useState('#e10600')
  const [heroIn, setHeroIn] = useState(false)

  const [drivers, setDrivers]   = useState([])
  const [teams, setTeams]       = useState([])
  const [races, setRaces]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const [updated, setUpdated]   = useState(null)

  /* ── fetch via server proxy ── */
  const load = useCallback(async () => {
    setLoading(true); setError(false)
    try {
      const res = await fetch('/api/f1')
      const json = await res.json()
      if (json.error) throw new Error()

      const dList = json.drivers?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
      const cList = json.constructors?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []
      const rList = json.schedule?.MRData?.RaceTable?.Races ?? []

      if (dList.length) {
        const leader = parseInt(dList[0].points)
        setDrivers(dList.map(d => ({
          pos:     parseInt(d.position),
          name:    `${d.Driver.givenName} ${d.Driver.familyName}`,
          short:   d.Driver.code ?? d.Driver.familyName.slice(0,3).toUpperCase(),
          team:    d.Constructors?.[0]?.name ?? '—',
          teamId:  d.Constructors?.[0]?.constructorId ?? '',
          num:     d.Driver.permanentNumber ?? '—',
          flag:    flag(d.Driver.nationality),
          pts:     parseInt(d.points),
          wins:    parseInt(d.wins),
          gap:     d.position === '1' ? 'LEADER' : `-${leader - parseInt(d.points)}`,
          color:   tc(d.Constructors?.[0]?.constructorId ?? ''),
        })))
      }

      if (cList.length) {
        setTeams(cList.map(c => ({
          pos:   parseInt(c.position),
          name:  c.Constructor.name,
          id:    c.Constructor.constructorId,
          pts:   parseInt(c.points),
          wins:  parseInt(c.wins),
          color: tc(c.Constructor.constructorId),
        })))
      }

      if (rList.length) {
        const today = new Date()
        let foundNext = false
        setRaces(rList.map(r => {
          const done = new Date(r.date) < today
          const next = !done && !foundNext
          if (next) foundNext = true
          const w = r.Results?.[0]
          return {
            r:       parseInt(r.round),
            name:    r.raceName.replace(/ Grand Prix$/,'').replace(/^Grand Prix$/,'GP'),
            circuit: r.Circuit.circuitName,
            flag:    cflag(r.Circuit.circuitName),
            date:    fmt(r.date),
            rawDate: r.date,
            done, next,
            winner:  w ? `${w.Driver.givenName} ${w.Driver.familyName}` : null,
            wTeam:   w?.Constructor?.name ?? null,
            wId:     w?.Constructor?.constructorId ?? null,
            laps:    w ? parseInt(w.laps) : null,
          }
        }))
      }

      setUpdated(new Date())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => { const id = setInterval(load, 60000); return () => clearInterval(id) }, [load])
  useEffect(() => { const t = setTimeout(() => setHeroIn(true), 80); return () => clearTimeout(t) }, [])

  useEffect(() => {
    if (window.THREE) { setThreeReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => setThreeReady(true)
    document.head.appendChild(s)
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(es => es.forEach(e => { if(e.isIntersecting) e.target.classList.add('vis') }), { threshold:.05 })
    setTimeout(() => document.querySelectorAll('.rev').forEach(el => obs.observe(el)), 120)
    return () => obs.disconnect()
  }, [tab, loading])

  /* derived */
  const P1       = drivers[0]
  const T1       = teams[0]
  const done     = races.filter(r => r.done)
  const next     = races.find(r => r.next)
  const total    = races.length || 24
  const timeStr  = updated?.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'}) ?? '…'

  const TABS = ['overview','standings','drivers','garage','calendar']
  const LABELS = { overview:'Přehled', standings:'Výsledky', drivers:'Jezdci', garage:'3D Garáž', calendar:'Kalendář' }

  const ticker = loading
    ? ['NAČÍTÁM DATA…']
    : error
    ? ['API NEDOSTUPNÉ — ZKUS OBNOVIT STRÁNKU']
    : [
        P1 ? `LÍDR: ${P1.name.toUpperCase()} — ${P1.pts} PTS` : '',
        T1 ? `KONSTRUKTÉŘI: ${T1.name.toUpperCase()} — ${T1.pts} PTS` : '',
        `ZÁVODŮ: ${done.length} / ${total}`,
        next ? `PŘÍŠTÍ: ${next.name.toUpperCase()} GP · ${next.date}` : '',
        ...drivers.slice(1,5).map(d => `P${d.pos} ${d.short} · ${d.pts} PTS · ${d.team.toUpperCase()}`),
      ].filter(Boolean)

  /* ── RENDER ── */
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');

        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        :root {
          --red:    #e10600;
          --bg:     #080808;
          --s1:     #111111;
          --s2:     #181818;
          --s3:     #222222;
          --border: rgba(255,255,255,.07);
          --text:   #ffffff;
          --text2:  rgba(255,255,255,.55);
          --text3:  rgba(255,255,255,.25);
          --font-h: 'Bebas Neue', sans-serif;
          --font-b: 'Inter', sans-serif;
        }
        html, body { background:var(--bg); color:var(--text); font-family:var(--font-b); overflow-x:hidden; }
        a { text-decoration:none; color:inherit; }
        button { font-family:var(--font-b); cursor:pointer; }
        ::-webkit-scrollbar { width:4px; }
        ::-webkit-scrollbar-track { background:var(--bg); }
        ::-webkit-scrollbar-thumb { background:var(--red); border-radius:2px; }

        /* reveal */
        .rev { opacity:0; transform:translateY(20px); transition:opacity .55s ease, transform .55s ease; }
        .vis { opacity:1; transform:translateY(0); }
        .hi { opacity:0; transform:translateY(22px); transition:opacity .7s ease, transform .7s ease; }
        .hi.in { opacity:1; transform:translateY(0); }

        /* ticker */
        @keyframes tick { from{transform:translateX(0)} to{transform:translateX(-50%)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:.2} }
        @keyframes spin  { to{transform:rotate(360deg)} }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes pulse-dot { 0%,100%{box-shadow:0 0 0 0 rgba(225,6,0,.5)} 50%{box-shadow:0 0 0 6px rgba(225,6,0,0)} }

        /* skeleton */
        .ske { background:linear-gradient(90deg,var(--s2) 25%,var(--s3) 50%,var(--s2) 75%); background-size:200% 100%; animation:shimmer 1.4s ease infinite; border-radius:3px; }

        /* nav tabs */
        .tab-btn { background:none; border:none; border-bottom:2px solid transparent; color:var(--text3); font-family:var(--font-b); font-size:13px; font-weight:600; letter-spacing:.5px; padding:0 20px; height:52px; text-transform:uppercase; transition:all .18s; }
        .tab-btn:hover { color:var(--text2); }
        .tab-btn.active { color:var(--text); border-color:var(--red); }

        /* table rows */
        .trow { transition:background .15s; }
        .trow:hover { background:var(--s2) !important; }

        /* driver card */
        .dcard { background:var(--s1); border:1px solid var(--border); transition:transform .2s, box-shadow .2s; }
        .dcard:hover { transform:translateY(-3px); box-shadow:0 12px 40px rgba(0,0,0,.5); }

        /* team chip */
        .chip { display:inline-block; font-size:10px; font-weight:600; letter-spacing:1px; text-transform:uppercase; padding:3px 10px; border-radius:2px; }

        /* btn */
        .btn-red { background:var(--red); color:#fff; border:none; font-size:12px; font-weight:700; letter-spacing:1.5px; text-transform:uppercase; padding:12px 26px; transition:opacity .2s; }
        .btn-red:hover { opacity:.85; }
        .btn-ghost { background:transparent; color:var(--text2); border:1px solid var(--border); font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; padding:12px 26px; transition:all .2s; }
        .btn-ghost:hover { border-color:var(--text2); color:var(--text); }

        /* refresh */
        .btn-ref { background:var(--s2); border:1px solid var(--border); color:var(--text3); font-size:16px; width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:4px; transition:all .2s; }
        .btn-ref:hover { border-color:var(--red); color:var(--red); }

        /* race card */
        .rcard { background:var(--s1); border:1px solid var(--border); padding:20px; transition:border-color .2s; }
        .rcard:hover { border-color:rgba(255,255,255,.18); }
        .rcard.is-next { border-color:var(--red); background:rgba(225,6,0,.04); }
        .rcard.is-done { opacity:.65; }

        /* podium */
        .podium-bar { border:1px solid var(--border); display:flex; flex-direction:column; justify-content:flex-end; align-items:center; padding:0 16px 20px; transition:border-color .2s; }
        .podium-bar:hover { border-color:rgba(255,255,255,.2); }
      `}</style>

      {/* ── TICKER ── */}
      <div style={{ background:'#0d0d0d', borderBottom:'1px solid var(--border)', height:32, overflow:'hidden', position:'relative', zIndex:200 }}>
        <div style={{ display:'flex', animation:'tick 45s linear infinite', whiteSpace:'nowrap', width:'max-content', height:'100%', alignItems:'center' }}>
          {[0,1].map(ri => (
            <span key={ri} style={{ display:'flex' }}>
              {ticker.map((item,i) => (
                <span key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'0 40px', borderRight:'1px solid var(--border)', height:32, fontSize:10, fontWeight:600, letterSpacing:2, color:'var(--text2)', textTransform:'uppercase' }}>
                  <span style={{ width:5, height:5, borderRadius:'50%', background:'var(--red)', animation:'blink 1.6s ease infinite', flexShrink:0 }} />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position:'sticky', top:0, zIndex:100, background:'rgba(8,8,8,.95)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 32px', height:52, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <button onClick={() => router.push('/')} style={{ background:'none', border:'none', color:'var(--text3)', fontSize:11, fontWeight:600, letterSpacing:2, textTransform:'uppercase', transition:'color .2s' }}
              onMouseEnter={e=>e.currentTarget.style.color='var(--text2)'}
              onMouseLeave={e=>e.currentTarget.style.color='var(--text3)'}
            >← HUB</button>
            <span style={{ width:1, height:16, background:'var(--border)' }} />
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ background:'var(--red)', padding:'4px 10px', lineHeight:1 }}>
                <span style={{ fontFamily:'var(--font-h)', fontSize:18, color:'#fff', letterSpacing:1 }}>F1</span>
              </div>
              <div>
                <div style={{ fontFamily:'var(--font-h)', fontSize:16, letterSpacing:2, color:'var(--text)', lineHeight:1 }}>FORMULA ONE</div>
                <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:1.5, marginTop:2 }}>
                  {updated ? `Aktualizováno ${timeStr}` : loading ? 'Načítám…' : error ? 'Chyba API' : ''}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:0 }}>
            {TABS.map(t => (
              <button key={t} className={`tab-btn${tab===t?' active':''}`} onClick={() => setTab(t)}>{LABELS[t]}</button>
            ))}
            <div style={{ width:1, height:16, background:'var(--border)', margin:'0 12px' }} />
            <button className="btn-ref" onClick={load} title="Obnovit">↻</button>
          </div>
        </div>
      </nav>

      {/* ════════ OVERVIEW ════════ */}
      {tab === 'overview' && (
        <div>
          {/* HERO */}
          <div style={{ background:'var(--s1)', borderBottom:'1px solid var(--border)', padding:'80px 32px', position:'relative', overflow:'hidden' }}>
            {/* BG number */}
            <div style={{ position:'absolute', right:0, top:'50%', transform:'translateY(-50%)', fontFamily:'var(--font-h)', fontSize:'clamp(180px,24vw,360px)', letterSpacing:-8, color:'rgba(255,255,255,.02)', userSelect:'none', pointerEvents:'none', lineHeight:1 }}>
              {new Date().getFullYear()}
            </div>
            <div style={{ position:'absolute', left:0, top:0, bottom:0, width:3, background:'var(--red)' }} />

            <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 420px', gap:60, alignItems:'center' }}>
              <div>
                {/* Badge */}
                <div className={`hi${heroIn?' in':''}`} style={{ transitionDelay:'0s', marginBottom:20 }}>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:8, background:'var(--red)', padding:'5px 14px', fontSize:9, fontWeight:700, letterSpacing:3, color:'#fff', textTransform:'uppercase' }}>
                    <span style={{ width:5,height:5,borderRadius:'50%',background:'#fff',animation:'blink 1.5s ease infinite' }} />
                    LIVE · SEZÓNA {new Date().getFullYear()} · R{done.length}/{total}
                  </span>
                </div>

                {/* Title */}
                <div className={`hi${heroIn?' in':''}`} style={{ transitionDelay:'.1s' }}>
                  {loading
                    ? <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:24 }}><div className="ske" style={{height:72,width:'75%'}} /><div className="ske" style={{height:48,width:'55%'}} /></div>
                    : <h1 style={{ fontFamily:'var(--font-h)', fontSize:'clamp(52px,7vw,100px)', letterSpacing:2, lineHeight:.95, color:'var(--text)', marginBottom:20 }}>
                        {P1 ? <>{P1.team.toUpperCase()}<br/><span style={{color:'var(--red)'}}>DOMINUJE</span></> : <span style={{color:'var(--red)'}}>F1 {new Date().getFullYear()}</span>}
                        <br/>
                        <span style={{fontSize:'40%',letterSpacing:4,color:'var(--text3)',fontWeight:400}}>ŠAMPIONÁTU F1 {new Date().getFullYear()}</span>
                      </h1>
                  }
                </div>

                {/* Desc */}
                <div className={`hi${heroIn?' in':''}`} style={{ transitionDelay:'.18s' }}>
                  {loading
                    ? <div className="ske" style={{height:16,width:'80%',marginBottom:32}} />
                    : <p style={{ fontSize:14, fontWeight:400, lineHeight:1.75, color:'var(--text2)', maxWidth:460, marginBottom:32 }}>
                        {P1 ? `${P1.name} vede šampionát s ${P1.pts} body po ${done.length} závodech. ${T1 ? T1.name+' vede konstruktéry.' : ''}`
                             : 'Data se načítají z Jolpica F1 API…'}
                      </p>
                  }
                </div>

                <div className={`hi${heroIn?' in':''}`} style={{ transitionDelay:'.26s', display:'flex', gap:10 }}>
                  <button className="btn-red" onClick={() => setTab('standings')}>Výsledky →</button>
                  <button className="btn-ghost" onClick={() => setTab('calendar')}>Kalendář →</button>
                </div>
              </div>

              {/* Leader card */}
              <div className={`hi${heroIn?' in':''}`} style={{ transitionDelay:'.35s' }}>
                <div style={{ background:'var(--bg)', border:'1px solid var(--border)', borderTop:`3px solid ${P1?.color??'var(--red)'}`, padding:'28px' }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:3, color:'var(--text3)', textTransform:'uppercase', marginBottom:20 }}>Lídr šampionátu</div>
                  {loading
                    ? <div style={{display:'flex',flexDirection:'column',gap:10}}><div className="ske" style={{height:60}} /><div className="ske" style={{height:40}} /></div>
                    : P1 ? <>
                        <div style={{ display:'flex', alignItems:'flex-end', gap:16, marginBottom:20 }}>
                          <div style={{ fontFamily:'var(--font-h)', fontSize:80, color:'rgba(255,255,255,.04)', lineHeight:1 }}>{String(P1.pos).padStart(2,'0')}</div>
                          <div style={{ marginBottom:6 }}>
                            <div style={{ fontFamily:'var(--font-h)', fontSize:34, letterSpacing:1, color:'var(--text)', lineHeight:1 }}>{P1.name.toUpperCase()}</div>
                            <div style={{ fontSize:11, fontWeight:600, color:P1.color, letterSpacing:2, marginTop:4 }}>{P1.team} · #{P1.num} · {P1.flag}</div>
                          </div>
                        </div>
                        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)' }}>
                          {[['Bodů',P1.pts],['Výher',P1.wins],['Závodů',done.length]].map(([l,v]) => (
                            <div key={l} style={{ background:'var(--s1)', padding:'14px 10px', textAlign:'center' }}>
                              <div style={{ fontFamily:'var(--font-h)', fontSize:32, letterSpacing:1, color:'var(--text)', lineHeight:1 }}>{v}</div>
                              <div style={{ fontSize:8, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginTop:4 }}>{l}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    : <div style={{color:'var(--text3)',fontSize:12,letterSpacing:2,textTransform:'uppercase'}}>Data nejsou k dispozici</div>
                  }
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{ borderBottom:'1px solid var(--border)' }}>
            <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
              {(loading ? [{l:'Závodů',v:'…'},{l:'Lídr',v:'…'},{l:'Konstruktéři',v:'…'},{l:'Příští závod',v:'…'}]
                        : [
                            {l:'Odjetých závodů', v:`${done.length} / ${total}`, hot:true},
                            {l:'Lídr — jezdci',   v: P1 ? `${P1.short} · ${P1.pts} pts` : '—'},
                            {l:'Lídr — týmy',     v: T1 ? `${T1.name} · ${T1.pts} pts` : '—'},
                            {l:'Příští závod',    v: next ? `${next.name} GP · ${next.date}` : 'Sezóna skončila'},
                          ]
              ).map((s,i) => (
                <div key={i} style={{ padding:'16px 24px', borderRight:i<3?'1px solid var(--border)':'none' }}>
                  <div style={{ fontSize:9, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginBottom:5 }}>{s.l}</div>
                  {loading
                    ? <div className="ske" style={{height:18,width:'70%'}} />
                    : <div style={{ fontFamily:'var(--font-h)', fontSize:20, letterSpacing:1, color: s.hot ? 'var(--red)' : 'var(--text)' }}>{s.v}</div>
                  }
                </div>
              ))}
            </div>
          </div>

          {/* GRID */}
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
            {/* Last races */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:2, color:'var(--text)' }}>POSLEDNÍ ZÁVODY</span>
                <button onClick={()=>setTab('calendar')} style={{ background:'none', border:'none', fontSize:11, fontWeight:600, letterSpacing:1, color:'var(--red)', textTransform:'uppercase' }}>Vše →</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {loading
                  ? Array(3).fill(0).map((_,i) => <div key={i} className="ske" style={{height:72}} />)
                  : done.slice(-3).reverse().map(r => (
                    <div key={r.r} className="rev" style={{ background:'var(--s1)', borderLeft:`3px solid var(--red)`, padding:'16px 20px', display:'flex', alignItems:'center', gap:16 }}>
                      <span style={{ fontSize:28 }}>{r.flag}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:9, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginBottom:3 }}>R{r.r} · {r.date}</div>
                        <div style={{ fontFamily:'var(--font-h)', fontSize:20, letterSpacing:1, color:'var(--text)' }}>{r.name} GRAND PRIX</div>
                        <div style={{ fontSize:10, color:'var(--text3)', marginTop:2 }}>{r.circuit}{r.laps ? ` · ${r.laps} kol` : ''}</div>
                      </div>
                      {r.winner && (
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:9, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginBottom:3 }}>Vítěz</div>
                          <div style={{ fontFamily:'var(--font-h)', fontSize:18, letterSpacing:1, color:'var(--text)' }}>{r.winner.split(' ').pop()}</div>
                          <div style={{ fontSize:10, fontWeight:600, color: tc(r.wId??''), marginTop:2 }}>{r.wTeam}</div>
                        </div>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>

            {/* Constructors */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
                <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:2, color:'var(--text)' }}>KONSTRUKTÉŘI</span>
                <button onClick={()=>setTab('standings')} style={{ background:'none', border:'none', fontSize:11, fontWeight:600, letterSpacing:1, color:'var(--red)', textTransform:'uppercase' }}>Vše →</button>
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                {loading
                  ? Array(6).fill(0).map((_,i) => <div key={i} className="ske" style={{height:44}} />)
                  : teams.slice(0,8).map(t => (
                    <div key={t.name} className="rev trow" style={{ background:'var(--s1)', display:'flex', alignItems:'center', gap:12, padding:'11px 16px' }}>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:16, letterSpacing:1, color:'var(--text3)', minWidth:22 }}>{t.pos}</span>
                      <div style={{ width:3, height:20, background:t.color, borderRadius:1, flexShrink:0 }} />
                      <span style={{ fontSize:13, fontWeight:600, color:'var(--text)', flex:1, letterSpacing:.3 }}>{t.name}</span>
                      <div style={{ width:90, height:2, background:'var(--s3)' }}>
                        <div style={{ height:'100%', width:`${Math.round((t.pts/(teams[0]?.pts||1))*100)}%`, background:t.color }} />
                      </div>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:20, letterSpacing:1, color:'var(--text)', minWidth:36, textAlign:'right' }}>{t.pts}</span>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>

          {/* PODIUM */}
          {!loading && drivers.length >= 3 && (
            <div style={{ background:'var(--s1)', borderTop:'1px solid var(--border)', padding:'56px 32px' }}>
              <div style={{ maxWidth:1280, margin:'0 auto' }}>
                <div style={{ fontFamily:'var(--font-h)', fontSize:11, letterSpacing:4, color:'var(--text3)', marginBottom:28 }}>TOP 3 — ŠAMPIONÁT JEZDCŮ</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1.1fr 1fr', gap:2, alignItems:'flex-end', maxWidth:700 }}>
                  {[drivers[1],drivers[0],drivers[2]].map((d,idx) => {
                    const heights = [160,200,140]
                    const medals  = ['🥈','🥇','🥉']
                    return (
                      <div key={d?.name??idx} className="rev podium-bar" style={{ height:heights[idx], borderTop:`3px solid ${d?.color??'#555'}` }}>
                        <div style={{ fontSize:20, marginBottom:8 }}>{medals[idx]}</div>
                        <div style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:'var(--text)', textAlign:'center', lineHeight:1.1 }}>{d?.name?.split(' ').pop()}</div>
                        <div style={{ fontSize:9, fontWeight:600, letterSpacing:2, color: d?.color??'#555', marginTop:6, textTransform:'uppercase' }}>{d?.team}</div>
                        <div style={{ fontFamily:'var(--font-h)', fontSize:36, letterSpacing:1, color:'var(--text)', marginTop:8 }}>{d?.pts}</div>
                        <div style={{ fontSize:8, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase' }}>PTS</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ════════ STANDINGS ════════ */}
      {tab === 'standings' && (
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:40 }}>
            <h2 style={{ fontFamily:'var(--font-h)', fontSize:52, letterSpacing:2, color:'var(--text)' }}>VÝSLEDKOVÁ LISTINA</h2>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:2, color:'var(--red)', textTransform:'uppercase' }}>
              {new Date().getFullYear()} · Po R{done.length}
            </span>
          </div>

          {loading
            ? <div style={{display:'flex',flexDirection:'column',gap:2}}>{Array(12).fill(0).map((_,i) => <div key={i} className="ske" style={{height:50}} />)}</div>
            : <>
                {/* Drivers */}
                <div style={{ fontFamily:'var(--font-h)', fontSize:13, letterSpacing:3, color:'var(--text3)', marginBottom:10 }}>JEZDCI</div>
                <div style={{ marginBottom:48, border:'1px solid var(--border)', overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 180px 80px 60px 80px', padding:'10px 20px', background:'var(--s2)' }}>
                    {['POS','JEZDEC','TÝM','PTS','WIN','GAP'].map(h => (
                      <span key={h} style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'var(--text3)', textTransform:'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {drivers.map((d,i) => (
                    <div key={d.name} className="rev trow" style={{ display:'grid', gridTemplateColumns:'48px 1fr 180px 80px 60px 80px', alignItems:'center', padding:'13px 20px', background:'var(--s1)', borderTop:'1px solid var(--border)', borderLeft:`3px solid ${i<3?d.color:'transparent'}` }}>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:i===0?'var(--red)':i<3?'var(--text)':'var(--text3)' }}>{d.pos}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <span style={{ fontSize:18 }}>{d.flag}</span>
                        <div>
                          <div style={{ fontSize:14, fontWeight:600, color:'var(--text)', letterSpacing:.3 }}>{d.name}</div>
                          <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:1, marginTop:1 }}>#{d.num}</div>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:2, height:14, background:d.color, borderRadius:1 }} />
                        <span style={{ fontSize:11, fontWeight:500, color:'var(--text2)' }}>{d.team}</span>
                      </div>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:'var(--text)' }}>{d.pts}</span>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:18, letterSpacing:1, color:'var(--text2)' }}>{d.wins}</span>
                      <span style={{ fontSize:11, fontWeight:600, color: d.gap==='LEADER'?'var(--red)':'var(--text3)', letterSpacing:.5 }}>{d.gap}</span>
                    </div>
                  ))}
                </div>

                {/* Constructors */}
                <div style={{ fontFamily:'var(--font-h)', fontSize:13, letterSpacing:3, color:'var(--text3)', marginBottom:10 }}>KONSTRUKTÉŘI</div>
                <div style={{ border:'1px solid var(--border)', overflow:'hidden' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'48px 1fr 80px 60px 1fr', padding:'10px 20px', background:'var(--s2)' }}>
                    {['POS','TÝM','PTS','WIN',''].map(h => (
                      <span key={h} style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'var(--text3)', textTransform:'uppercase' }}>{h}</span>
                    ))}
                  </div>
                  {teams.map((t,i) => (
                    <div key={t.name} className="rev trow" style={{ display:'grid', gridTemplateColumns:'48px 1fr 80px 60px 1fr', alignItems:'center', padding:'13px 20px', background:'var(--s1)', borderTop:'1px solid var(--border)', borderLeft:`3px solid ${i<2?t.color:'transparent'}` }}>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:i===0?'var(--red)':'var(--text3)' }}>{t.pos}</span>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:3, height:20, background:t.color, borderRadius:1 }} />
                        <span style={{ fontSize:14, fontWeight:600, color:'var(--text)', letterSpacing:.3 }}>{t.name}</span>
                      </div>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:'var(--text)' }}>{t.pts}</span>
                      <span style={{ fontFamily:'var(--font-h)', fontSize:18, letterSpacing:1, color:'var(--text2)' }}>{t.wins}</span>
                      <div style={{ paddingRight:8 }}>
                        <div style={{ height:2, background:'var(--s3)' }}>
                          <div style={{ height:'100%', width:`${Math.round((t.pts/(teams[0]?.pts||1))*100)}%`, background:t.color }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
          }
        </div>
      )}

      {/* ════════ DRIVERS ════════ */}
      {tab === 'drivers' && (
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:40 }}>
            <h2 style={{ fontFamily:'var(--font-h)', fontSize:52, letterSpacing:2, color:'var(--text)' }}>JEZDCI</h2>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:2, color:'var(--red)', textTransform:'uppercase' }}>Sezóna {new Date().getFullYear()}</span>
          </div>

          {loading
            ? <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:2}}>{Array(10).fill(0).map((_,i)=><div key={i} className="ske" style={{height:200}} />)}</div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:2 }}>
                {drivers.map((d,i) => (
                  <div key={d.name} className="rev dcard" style={{ borderTop:`3px solid ${d.color}` }}>
                    {/* top */}
                    <div style={{ padding:'18px 18px 12px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                      <div style={{ fontFamily:'var(--font-h)', fontSize:56, letterSpacing:1, color:'rgba(255,255,255,.05)', lineHeight:1 }}>
                        {String(d.pos).padStart(2,'0')}
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:26 }}>{d.flag}</div>
                        <div style={{ fontSize:9, color:'var(--text3)', letterSpacing:2, marginTop:2 }}>#{d.num}</div>
                      </div>
                    </div>
                    {/* info */}
                    <div style={{ padding:'0 18px 14px' }}>
                      <div style={{ fontFamily:'var(--font-h)', fontSize:22, letterSpacing:1, color:'var(--text)', lineHeight:1.05 }}>{d.name.toUpperCase()}</div>
                      <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:6 }}>
                        <div style={{ width:2, height:12, background:d.color, borderRadius:1 }} />
                        <span style={{ fontSize:10, fontWeight:600, color:d.color, letterSpacing:2, textTransform:'uppercase' }}>{d.team}</span>
                      </div>
                    </div>
                    {/* stats */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'var(--border)' }}>
                      {[['PTS',d.pts,'var(--text)'],['WIN',d.wins,'var(--text2)'],['GAP',d.gap, d.gap==='LEADER'?'var(--red)':'var(--text3)']].map(([l,v,c]) => (
                        <div key={l} style={{ background:'var(--bg)', padding:'12px 8px', textAlign:'center' }}>
                          <div style={{ fontSize:7, fontWeight:700, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginBottom:4 }}>{l}</div>
                          <div style={{ fontFamily:'var(--font-h)', fontSize:20, letterSpacing:1, color:c }}>{v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ════════ GARAGE ════════ */}
      {tab === 'garage' && (
        <div>
          <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px 24px' }}>
            <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:20 }}>
              <h2 style={{ fontFamily:'var(--font-h)', fontSize:52, letterSpacing:2, color:'var(--text)' }}>3D GARÁŽ</h2>
              <span style={{ fontSize:11, fontWeight:600, letterSpacing:2, color:'var(--red)', textTransform:'uppercase' }}>Interaktivní · WebGL</span>
            </div>
            <p style={{ fontSize:13, color:'var(--text3)', marginBottom:20 }}>Pohybuj myší pro rotaci · Vyber barvu týmu</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:4 }}>
              {(teams.length > 0 ? teams : [{name:'Ferrari',color:'#E8002D',id:'ferrari'},{name:'Mercedes',color:'#00D2BE',id:'mercedes'},{name:'McLaren',color:'#FF8000',id:'mclaren'},{name:'Red Bull',color:'#3671C6',id:'red_bull'}]).map(t => (
                <button key={t.id??t.name} onClick={() => setCarColor(t.color)}
                  style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase', padding:'7px 16px', background: carColor===t.color ? t.color : 'var(--s2)', color: carColor===t.color ? '#fff' : 'var(--text3)', border:`1px solid ${carColor===t.color ? t.color : 'var(--border)'}`, transition:'all .2s' }}
                >{t.name}</button>
              ))}
            </div>
          </div>

          <div style={{ background:'var(--s1)', position:'relative', height:560, borderTop:'1px solid var(--border)', borderBottom:'1px solid var(--border)' }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:`linear-gradient(90deg, transparent, ${carColor}, transparent)`, zIndex:2 }} />
            {threeReady
              ? <Car3D key={carColor} color={carColor} />
              : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:16 }}>
                  <div style={{ width:32, height:32, border:'3px solid var(--border)', borderTop:'3px solid var(--red)', borderRadius:'50%', animation:'spin .8s linear infinite' }} />
                  <span style={{ fontSize:10, fontWeight:600, letterSpacing:4, color:'var(--text3)', textTransform:'uppercase' }}>Načítám 3D…</span>
                </div>
            }
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(8,8,8,.9),transparent)', pointerEvents:'none', zIndex:1 }} />
          </div>

          <div style={{ borderBottom:'1px solid var(--border)' }}>
            <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
              {[['Motor','1.6L V6 Turbo Hybrid'],['Výkon','1000+ koní'],['Hmotnost','798 kg min.'],['Max RPM','15 000'],['0–100','~2.4 s']].map(([l,v],i) => (
                <div key={l} style={{ padding:'16px', borderRight:i<4?'1px solid var(--border)':'none' }}>
                  <div style={{ fontSize:8, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', marginBottom:4 }}>{l}</div>
                  <div style={{ fontFamily:'var(--font-h)', fontSize:18, letterSpacing:1, color:'var(--text)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════════ CALENDAR ════════ */}
      {tab === 'calendar' && (
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'48px 32px' }}>
          <div style={{ display:'flex', alignItems:'baseline', gap:16, marginBottom:16 }}>
            <h2 style={{ fontFamily:'var(--font-h)', fontSize:52, letterSpacing:2, color:'var(--text)' }}>KALENDÁŘ</h2>
            <span style={{ fontSize:11, fontWeight:600, letterSpacing:2, color:'var(--red)', textTransform:'uppercase' }}>Sezóna {new Date().getFullYear()}</span>
          </div>

          {/* progress */}
          <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:36 }}>
            <div style={{ flex:1, maxWidth:400, height:2, background:'var(--s3)' }}>
              <div style={{ height:'100%', width:`${Math.round((done.length/Math.max(total,1))*100)}%`, background:'var(--red)', transition:'width 1s' }} />
            </div>
            <span style={{ fontSize:10, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase', whiteSpace:'nowrap' }}>{done.length} / {total} ZÁVODŮ</span>
          </div>

          {loading
            ? <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))',gap:2}}>{Array(8).fill(0).map((_,i)=><div key={i} className="ske" style={{height:130}} />)}</div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:2 }}>
                {races.map(r => (
                  <div key={r.r} className={`rev rcard${r.next?' is-next':r.done?' is-done':''}`}>
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                      <span style={{ fontSize:28 }}>{r.flag}</span>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:8, fontWeight:700, letterSpacing:3, color:'var(--text3)', textTransform:'uppercase' }}>ROUND {r.r}</div>
                        <div style={{ fontFamily:'var(--font-h)', fontSize:16, letterSpacing:1, color:'var(--text)', marginTop:2 }}>{r.date}</div>
                      </div>
                    </div>
                    <div style={{ fontFamily:'var(--font-h)', fontSize:20, letterSpacing:1, color: r.done ? 'var(--text2)' : 'var(--text)', marginBottom:3 }}>{r.name} GP</div>
                    <div style={{ fontSize:10, color:'var(--text3)', marginBottom: (r.done||r.next) ? 10 : 0 }}>{r.circuit}</div>
                    {r.done && r.winner && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:11 }}>🏆</span>
                        <span style={{ fontSize:12, fontWeight:600, color:'var(--text2)' }}>{r.winner}</span>
                        <span style={{ fontSize:10, fontWeight:700, color: tc(r.wId??''), letterSpacing:.5 }}>{r.wTeam}</span>
                      </div>
                    )}
                    {r.next && (
                      <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'var(--red)', padding:'4px 10px', marginTop:4 }}>
                        <span style={{ width:5,height:5,borderRadius:'50%',background:'#fff',animation:'blink 1.5s ease infinite' }} />
                        <span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:'#fff', textTransform:'uppercase' }}>PŘÍŠTÍ ZÁVOD</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
          }
        </div>
      )}

      {/* ── FOOTER ── */}
      <footer style={{ marginTop:80, padding:'24px 32px', borderTop:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:'var(--red)', padding:'3px 8px' }}>
            <span style={{ fontFamily:'var(--font-h)', fontSize:14, letterSpacing:1, color:'#fff' }}>F1</span>
          </div>
          <span style={{ fontSize:10, fontWeight:600, letterSpacing:2, color:'var(--text3)', textTransform:'uppercase' }}>Formula One Tracker {new Date().getFullYear()}</span>
        </div>
        <span style={{ fontSize:9, fontWeight:500, letterSpacing:1.5, color:'var(--text3)', textTransform:'uppercase' }}>
          Data: Jolpica API · Auto-refresh 60s{updated ? ` · Aktualizováno ${timeStr}` : ''}
        </span>
      </footer>
    </>
  )
}
