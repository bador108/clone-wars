'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

/* ─── TEAM COLOR MAP ─── */
const TEAM_COLOR = {
  mercedes:      '#00D2BE',
  ferrari:       '#E8002D',
  mclaren:       '#FF8000',
  red_bull:      '#3671C6',
  alpine:        '#FF87BC',
  haas:          '#B6BABD',
  aston_martin:  '#358C75',
  williams:      '#37BEDD',
  rb:            '#6692FF',
  visa_cash_app_rb: '#6692FF',
  sauber:        '#52E252',
  kick_sauber:   '#52E252',
  audi:          '#C0C0C0',
  racing_bulls:  '#6692FF',
}
const getTeamColor = id => TEAM_COLOR[id] || '#888'

/* ─── FLAG MAP ─── */
const FLAG = {
  British:'🇬🇧', Dutch:'🇳🇱', Italian:'🇮🇹', German:'🇩🇪',
  Spanish:'🇪🇸', French:'🇫🇷', Finnish:'🇫🇮', Australian:'🇦🇺',
  Mexican:'🇲🇽', Canadian:'🇨🇦', Japanese:'🇯🇵', Thai:'🇹🇭',
  Chinese:'🇨🇳', Danish:'🇩🇰', American:'🇺🇸', 'New Zealander':'🇳🇿',
  Monegasque:'🇲🇨', Brazilian:'🇧🇷', Argentine:'🇦🇷', Austrian:'🇦🇹',
  Belgian:'🇧🇪', Swiss:'🇨🇭', Swedish:'🇸🇪', Polish:'🇵🇱',
}
const getFlag = nat => FLAG[nat] || '🏳'

/* ─── COUNTRY FLAG FOR CIRCUITS ─── */
const CIRCUIT_FLAG = {
  'Albert Park Grand Prix Circuit': '🇦🇺',
  'Shanghai International Circuit': '🇨🇳',
  'Suzuka Circuit': '🇯🇵',
  'Bahrain International Circuit': '🇧🇭',
  'Miami International Autodrome': '🇺🇸',
  'Autodromo Enzo e Dino Ferrari': '🇮🇹',
  'Circuit de Monaco': '🇲🇨',
  'Circuit de Barcelona-Catalunya': '🇪🇸',
  'Circuit Gilles Villeneuve': '🇨🇦',
  'Silverstone Circuit': '🇬🇧',
  'Hungaroring': '🇭🇺',
  'Circuit de Spa-Francorchamps': '🇧🇪',
  'Circuit Park Zandvoort': '🇳🇱',
  'Autodromo Nazionale di Monza': '🇮🇹',
  'Baku City Circuit': '🇦🇿',
  'Marina Bay Street Circuit': '🇸🇬',
  'Circuit of the Americas': '🇺🇸',
  'Autódromo Hermanos Rodríguez': '🇲🇽',
  'Autódromo José Carlos Pace': '🇧🇷',
  'Las Vegas Strip Street Circuit': '🇺🇸',
  'Losail International Circuit': '🇶🇦',
  'Yas Marina Circuit': '🇦🇪',
}
const getCircuitFlag = name => CIRCUIT_FLAG[name] || '🏁'

/* ─── THREE.JS CAR ─── */
function Car3D({ color = '#e10600' }) {
  const mountRef = useRef(null)
  useEffect(() => {
    const el = mountRef.current
    if (!el || !window.THREE) return
    const T = window.THREE
    const W = el.clientWidth, H = el.clientHeight
    const renderer = new T.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = T.PCFSoftShadowMap
    el.appendChild(renderer.domElement)
    const scene = new T.Scene()
    const cam = new T.PerspectiveCamera(40, W / H, 0.1, 100)
    cam.position.set(5, 2.5, 6); cam.lookAt(0, 0.2, 0)
    scene.add(new T.AmbientLight(0xffffff, 0.45))
    const sun = new T.DirectionalLight(0xffffff, 1.6)
    sun.position.set(8, 12, 8); sun.castShadow = true
    sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048
    scene.add(sun)
    const fill = new T.DirectionalLight(0xaabbff, 0.35)
    fill.position.set(-6, 3, -5); scene.add(fill)
    const rim = new T.DirectionalLight(new T.Color(color), 0.9)
    rim.position.set(0, -4, -8); scene.add(rim)
    const gnd = new T.Mesh(new T.PlaneGeometry(40, 40), new T.MeshStandardMaterial({ color: 0x080808, metalness: 0.95, roughness: 0.05 }))
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -0.57; gnd.receiveShadow = true; scene.add(gnd)
    const C = new T.Color(color)
    const bMat = new T.MeshStandardMaterial({ color: C, metalness: 0.8, roughness: 0.15 })
    const darkMat = new T.MeshStandardMaterial({ color: 0x0d0d0d, metalness: 0.5, roughness: 0.5 })
    const cMat = new T.MeshStandardMaterial({ color: 0x141414, metalness: 0.35, roughness: 0.65 })
    const tireMat = new T.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.92 })
    const rimMat = new T.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.98, roughness: 0.02 })
    const glassMat = new T.MeshStandardMaterial({ color: 0x223355, transparent: true, opacity: 0.4, roughness: 0.0, metalness: 0.1 })
    const silvMat = new T.MeshStandardMaterial({ color: 0x999999, metalness: 0.92, roughness: 0.12 })
    const diskMat = new T.MeshStandardMaterial({ color: 0xff3300, emissive: 0xff1100, emissiveIntensity: 0.5, roughness: 0.45 })
    const stripeMat = new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 })
    const car = new T.Group()
    const mk = (geo, mat, x, y, z, rx = 0, ry = 0, rz = 0) => {
      const m = new T.Mesh(geo, mat); m.castShadow = true
      m.position.set(x, y, z); m.rotation.set(rx, ry, rz); car.add(m); return m
    }
    mk(new T.BoxGeometry(3.5, 0.26, 0.68), bMat, 0, 0, 0)
    mk(new T.CylinderGeometry(0.06, 0.30, 1.6, 12), bMat, 2.24, -0.01, 0, 0, 0, Math.PI/2)
    mk(new T.BoxGeometry(1.3, 0.28, 0.36), cMat, -0.78, 0.2, 0)
    mk(new T.BoxGeometry(0.72, 0.18, 0.44), cMat, 0.1, 0.22, 0)
    mk(new T.BoxGeometry(0.52, 0.08, 0.30), glassMat, 0.12, 0.32, 0)
    mk(new T.CylinderGeometry(0.08, 0.11, 0.22, 12), darkMat, 0.14, 0.44, 0)
    const hPts = []
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI
      hPts.push(new T.Vector3(Math.cos(a) * 0.3 - 0.05, Math.sin(a) * 0.33 + 0.28, 0))
    }
    mk(new T.TubeGeometry(new T.CatmullRomCurve3(hPts), 24, 0.02, 8, false), silvMat, 0, 0, 0)
    mk(new T.BoxGeometry(3.2, 0.04, 0.84), cMat, -0.1, -0.17, 0)
    ;[-1, 1].forEach(s => {
      mk(new T.BoxGeometry(1.6, 0.18, 0.2), bMat, -0.05, -0.03, s * 0.43)
      mk(new T.CylinderGeometry(0.07, 0.10, 0.06, 12), darkMat, 0.44, 0.01, s * 0.55, Math.PI/2, 0, 0)
    })
    mk(new T.BoxGeometry(0.05, 0.32, 1.06), bMat, -1.72, 0.32, 0)
    mk(new T.BoxGeometry(0.05, 0.06, 1.06), bMat, -1.72, 0.56, 0)
    ;[-1, 1].forEach(s => mk(new T.BoxGeometry(0.30, 0.46, 0.04), bMat, -1.72, 0.35, s * 0.53))
    mk(new T.BoxGeometry(0.05, 0.035, 1.14), bMat, 2.56, -0.21, 0)
    mk(new T.BoxGeometry(0.34, 0.035, 1.04), bMat, 2.36, -0.165, 0)
    ;[-1, 1].forEach(s => mk(new T.BoxGeometry(0.38, 0.19, 0.04), bMat, 2.4, -0.165, s * 0.54))
    ;[{x:1.48,y:-0.24,z:0.63,r:1},{x:1.48,y:-0.24,z:-0.63,r:1},{x:-1.14,y:-0.24,z:0.70,r:1.1},{x:-1.14,y:-0.24,z:-0.70,r:1.1}].forEach(wp => {
      mk(new T.CylinderGeometry(0.30*wp.r, 0.30*wp.r, 0.26, 28), tireMat, wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      mk(new T.CylinderGeometry(0.20*wp.r, 0.20*wp.r, 0.28, 18), rimMat, wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      mk(new T.CylinderGeometry(0.12*wp.r, 0.12*wp.r, 0.06, 16), diskMat, wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      for (let i = 0; i < 5; i++) {
        const spoke = new T.Mesh(new T.BoxGeometry(0.02, 0.16*wp.r, 0.03), rimMat)
        spoke.rotation.z = (i / 5) * Math.PI * 2; spoke.position.set(wp.x, wp.y, wp.z); car.add(spoke)
      }
      const arm = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.52, 6), silvMat)
      arm.rotation.z = Math.PI/2; arm.position.set(wp.x + (wp.x > 0 ? -0.26 : 0.26), wp.y + 0.07, wp.z * 0.55); car.add(arm)
    })
    mk(new T.BoxGeometry(2.2, 0.006, 0.13), stripeMat, 0.3, 0.15, 0)
    car.position.y = 0.22; scene.add(car)
    let mx = 0, my = 0
    const onMM = e => { const r = el.getBoundingClientRect(); mx = ((e.clientX - r.left) / W - 0.5) * 2; my = ((e.clientY - r.top) / H - 0.5) * 2 }
    el.addEventListener('mousemove', onMM)
    let t = 0, raf
    const tick = () => { raf = requestAnimationFrame(tick); t += 0.007; car.rotation.y = t + mx * 0.45; car.rotation.x = my * 0.06; car.position.y = 0.22 + Math.sin(t * 0.65) * 0.045; renderer.render(scene, cam) }
    tick()
    const onResize = () => { if (!el) return; const nW = el.clientWidth, nH = el.clientHeight; renderer.setSize(nW, nH); cam.aspect = nW/nH; cam.updateProjectionMatrix() }
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); el.removeEventListener('mousemove', onMM); if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement); renderer.dispose() }
  }, [color])
  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

/* ─── LOADING SKELETON ─── */
function Skeleton({ w = '100%', h = 20, r = 4 }) {
  return <div style={{ width: w, height: h, borderRadius: r, background: 'linear-gradient(90deg,#f0f0f0 25%,#e0e0e0 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'f1-shimmer 1.4s ease infinite' }} />
}

/* ─── MAIN ─── */
export default function F1Page() {
  const router = useRouter()
  const curRef = useRef(null)
  const dotRef = useRef(null)
  const [tab, setTab] = useState('overview')
  const [threeReady, setThreeReady] = useState(false)
  const [carColor, setCarColor] = useState('#e10600')
  const [heroLoaded, setHeroLoaded] = useState(false)

  /* API state */
  const [drivers, setDrivers] = useState([])
  const [teams, setTeams] = useState([])
  const [races, setRaces] = useState([])
  const [lastRaceResults, setLastRaceResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [apiError, setApiError] = useState(false)

  /* Fetch from Jolpica (Ergast) API */
  const fetchF1Data = useCallback(async () => {
    try {
      const BASE = 'https://api.jolpica.com/ergast/v1/f1/current'
      const [d, c, s, l] = await Promise.all([
        fetch(`${BASE}/driverStandings.json`).then(r => r.json()),
        fetch(`${BASE}/constructorStandings.json`).then(r => r.json()),
        fetch(`${BASE}.json`).then(r => r.json()),
        fetch(`${BASE}/last/results.json`).then(r => r.json()),
      ])

      const dList = d?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings ?? []
      const cList = c?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ?? []
      const rList = s?.MRData?.RaceTable?.Races ?? []
      const lastResults = l?.MRData?.RaceTable?.Races?.[0]?.Results ?? []

      if (dList.length) {
        setDrivers(dList.map(d => ({
          pos: parseInt(d.position),
          name: `${d.Driver.givenName} ${d.Driver.familyName}`,
          short: d.Driver.code || d.Driver.familyName.substring(0,3).toUpperCase(),
          team: d.Constructors?.[0]?.name ?? '—',
          teamId: d.Constructors?.[0]?.constructorId ?? '',
          num: d.Driver.permanentNumber || '—',
          flag: getFlag(d.Driver.nationality),
          pts: parseInt(d.points),
          wins: parseInt(d.wins),
          gap: d.position === '1' ? '—' : `+${dList[0].points - d.points}`,
          color: getTeamColor(d.Constructors?.[0]?.constructorId ?? ''),
        })))
      }

      if (cList.length) {
        setTeams(cList.map(c => ({
          pos: parseInt(c.position),
          name: c.Constructor.name,
          constructorId: c.Constructor.constructorId,
          pts: parseInt(c.points),
          wins: parseInt(c.wins),
          color: getTeamColor(c.Constructor.constructorId),
        })))
      }

      if (rList.length) {
        const today = new Date()
        setRaces(rList.map(r => {
          const rDate = new Date(r.date)
          const done = rDate < today
          const winner = r.Results?.[0]
          return {
            r: parseInt(r.round),
            name: r.raceName.replace(' Grand Prix', '').replace('Grand Prix', ''),
            circuit: r.Circuit.circuitName,
            flag: getCircuitFlag(r.Circuit.circuitName),
            date: rDate.toLocaleDateString('cs-CZ', { day:'numeric', month:'numeric', year:'numeric' }),
            rawDate: r.date,
            done,
            next: !done && rList.filter(x => new Date(x.date) < today).length === rList.indexOf(r),
            winner: winner ? `${winner.Driver.givenName} ${winner.Driver.familyName}` : null,
            wTeam: winner?.Constructor?.name ?? null,
            laps: winner ? parseInt(winner.laps) : null,
          }
        }))
      }

      if (lastResults.length) setLastRaceResults(lastResults.slice(0, 10))

      setLastUpdated(new Date())
      setApiError(false)
    } catch {
      setApiError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  /* Load Three.js */
  useEffect(() => {
    if (window.THREE) { setThreeReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => setThreeReady(true)
    document.head.appendChild(s)
  }, [])

  /* Cursor */
  useEffect(() => {
    const cur = curRef.current, dot = dotRef.current
    if (!cur || !dot) return
    let mx = window.innerWidth/2, my = window.innerHeight/2, lx = mx, ly = my, raf
    const mv = e => { mx = e.clientX; my = e.clientY; dot.style.left = mx+'px'; dot.style.top = my+'px' }
    document.addEventListener('mousemove', mv)
    const go = () => { lx+=(mx-lx)*.1; ly+=(my-ly)*.1; cur.style.left=lx+'px'; cur.style.top=ly+'px'; raf=requestAnimationFrame(go) }
    go()
    return () => { document.removeEventListener('mousemove', mv); cancelAnimationFrame(raf) }
  }, [])

  /* Hero + data load */
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 100); return () => clearTimeout(t) }, [])
  useEffect(() => { fetchF1Data() }, [fetchF1Data])

  /* Auto-refresh every 60s */
  useEffect(() => {
    const id = setInterval(fetchF1Data, 60000)
    return () => clearInterval(id)
  }, [fetchF1Data])

  /* Scroll reveal */
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('f1-vis') }),
      { threshold: 0.06 }
    )
    setTimeout(() => document.querySelectorAll('.f1-rev').forEach(el => obs.observe(el)), 100)
    return () => obs.disconnect()
  }, [tab, loading])

  /* Derived */
  const leader = drivers[0]
  const leaderTeam = teams[0]
  const completedRaces = races.filter(r => r.done)
  const nextRace = races.find(r => !r.done)
  const totalRaces = races.length || 24

  const TEAM_COLORS_LIST = Object.entries(TEAM_COLOR).map(([id, c]) => ({
    n: id.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase()),
    c, id
  })).filter(t => ['mercedes','ferrari','mclaren','red_bull','alpine','haas','aston_martin','williams','rb','kick_sauber'].includes(t.id))

  const TABS = [
    { id: 'overview',  label: 'Přehled'  },
    { id: 'standings', label: 'Výsledky' },
    { id: 'drivers',   label: 'Jezdci'   },
    { id: 'garage',    label: '3D Garáž' },
    { id: 'calendar',  label: 'Kalendář' },
  ]

  const tickerItems = loading
    ? ['NAČÍTÁM DATA F1 2026 …']
    : drivers.length > 0
      ? [
          `LÍDR ŠAMPIONÁTU: ${leader?.name?.toUpperCase()} — ${leader?.pts} BODŮ`,
          `KONSTRUKTÉŘI: ${leaderTeam?.name?.toUpperCase()} VEDE — ${leaderTeam?.pts} BODŮ`,
          `ODJETÝCH ZÁVODŮ: ${completedRaces.length} / ${totalRaces}`,
          ...(nextRace ? [`PŘÍŠTÍ ZÁVOD: ${nextRace.name.toUpperCase()} GP — ${nextRace.date}`] : []),
          ...(drivers.slice(1,4).map(d => `P${d.pos} ${d.short} — ${d.pts} BODŮ · ${d.team.toUpperCase()}`)),
        ]
      : ['DATA NEJSOU K DISPOZICI']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&display=swap');
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff; color: #15151e; font-family: 'Titillium Web', sans-serif; overflow-x: hidden; cursor: none !important; }
        * { cursor: none !important; }
        #f1cur { position: fixed; width: 24px; height: 24px; border: 2px solid #e10600; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); transition: width .15s, height .15s; }
        #f1dot { position: fixed; width: 4px; height: 4px; background: #e10600; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); }
        .f1-rev { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
        .f1-vis { opacity: 1 !important; transform: translateY(0) !important; }
        .hero-in { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }
        .hero-in.loaded { opacity: 1; transform: translateY(0); }
        @keyframes f1-tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes f1-blink { 0%,100% { opacity: 1 } 50% { opacity: .3 } }
        @keyframes f1-spin { to { transform: rotate(360deg) } }
        @keyframes f1-shimmer { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e10600; }
        button { font-family: 'Titillium Web', sans-serif; }
        .f1-row:hover { background: #f7f7f7 !important; }
        .f1-tab-btn { transition: all .2s; }
        .f1-tab-btn:hover { color: #15151e !important; }
      `}</style>

      <div id="f1cur" ref={curRef} />
      <div id="f1dot" ref={dotRef} />

      {/* ── TICKER ── */}
      <div style={{ background: '#15151e', height: 34, overflow: 'hidden', position: 'relative', zIndex: 200 }}>
        <div style={{ display: 'flex', animation: 'f1-tick 40s linear infinite', whiteSpace: 'nowrap', width: 'max-content', height: '100%', alignItems: 'center' }}>
          {[0,1].map(ri => (
            <span key={ri} style={{ display: 'flex' }}>
              {tickerItems.map((item, i) => (
                <span key={i} style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#fff', padding: '0 48px', borderRight: '1px solid rgba(255,255,255,.1)', textTransform: 'uppercase', lineHeight: '34px', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e10600', display: 'inline-block', flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '3px solid #e10600', boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#15151e'}
              onMouseLeave={e => e.currentTarget.style.color = '#aaa'}
            >← Hub</button>
            <div style={{ width: 1, height: 20, background: '#e8e8e8' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#e10600', padding: '4px 10px' }}>
                <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>F1</span>
              </div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#15151e', textTransform: 'uppercase', lineHeight: 1.1 }}>Formula One</div>
                <div style={{ fontSize: 9, fontWeight: 400, letterSpacing: 1, color: '#aaa' }}>
                  Sezóna {new Date().getFullYear()} · {lastUpdated ? `Aktualizováno ${lastUpdated.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})}` : 'Načítám…'}
                </div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ display: 'flex', height: 56 }}>
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)} className="f1-tab-btn" style={{ background: 'none', border: 'none', borderBottom: `3px solid ${tab === t.id ? '#e10600' : 'transparent'}`, marginBottom: -3, color: tab === t.id ? '#15151e' : '#888', fontSize: 12, fontWeight: 700, letterSpacing: 1, padding: '0 18px', height: 56, textTransform: 'uppercase' }}>{t.label}</button>
              ))}
            </div>
            <button onClick={fetchF1Data} title="Obnovit data" style={{ background: 'none', border: '1px solid #e8e8e8', padding: '6px 10px', marginLeft: 8, color: '#aaa', fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', transition: 'all .2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#e10600'; e.currentTarget.style.color = '#e10600' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#e8e8e8'; e.currentTarget.style.color = '#aaa' }}
            >↻</button>
          </div>
        </div>
      </nav>

      {/* ═══════ OVERVIEW ═══════ */}
      {tab === 'overview' && (
        <div>
          {/* HERO */}
          <div style={{ background: '#15151e', position: 'relative', overflow: 'hidden', padding: '90px 40px 72px' }}>
            <div style={{ position: 'absolute', right: '-3%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(140px,20vw,300px)', fontWeight: 900, color: 'rgba(255,255,255,.025)', lineHeight: 1, letterSpacing: -12, userSelect: 'none', pointerEvents: 'none' }}>{new Date().getFullYear()}</div>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: 'linear-gradient(to bottom, #e10600, #ff4444)' }} />
            <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              <div>
                <div className={`hero-in${heroLoaded?' loaded':''}`} style={{ transitionDelay:'0s' }}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'#e10600', padding:'5px 14px', marginBottom:22 }}>
                    <span style={{ width:6, height:6, borderRadius:'50%', background:'#fff', animation:'f1-blink 1.5s ease infinite' }} />
                    <span style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'#fff', textTransform:'uppercase' }}>
                      Live · Sezóna {new Date().getFullYear()} · R{completedRaces.length}/{totalRaces}
                    </span>
                  </div>
                </div>
                <div className={`hero-in${heroLoaded?' loaded':''}`} style={{ transitionDelay:'.1s' }}>
                  {loading ? (
                    <div style={{ display:'flex',flexDirection:'column',gap:12,marginBottom:20 }}>
                      <Skeleton h={60} w="80%" /><Skeleton h={40} w="60%" /><Skeleton h={30} w="45%" />
                    </div>
                  ) : (
                    <h1 style={{ fontSize:'clamp(40px,5vw,76px)', fontWeight:900, letterSpacing:-1, lineHeight:.92, color:'#fff', marginBottom:20 }}>
                      {leader?.team?.toUpperCase() || 'F1'}<br />
                      <span style={{ color:'#e10600' }}>{leader ? 'VEDE' : 'ŠAMPIONÁT'}</span><br />
                      <span style={{ fontWeight:300, color:'rgba(255,255,255,.3)', fontSize:'52%', letterSpacing:2 }}>ŠAMPIONÁTU F1 {new Date().getFullYear()}</span>
                    </h1>
                  )}
                </div>
                <div className={`hero-in${heroLoaded?' loaded':''}`} style={{ transitionDelay:'.2s' }}>
                  {loading ? <Skeleton h={18} w="90%" /> : (
                    <p style={{ fontSize:15, fontWeight:300, lineHeight:1.75, color:'rgba(255,255,255,.45)', maxWidth:440, marginBottom:36 }}>
                      {leader ? `${leader.name} (P1, ${leader.pts} bodů) vede šampionát pro ${leader.team}. Po ${completedRaces.length} závodech ze ${totalRaces}.` : 'Data se načítají…'}
                    </p>
                  )}
                </div>
                <div className={`hero-in${heroLoaded?' loaded':''}`} style={{ transitionDelay:'.3s', display:'flex', gap:12 }}>
                  <button onClick={() => setTab('standings')} style={{ fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'13px 28px', background:'#e10600', color:'#fff', border:'none', transition:'background .2s' }}
                    onMouseEnter={e=>e.currentTarget.style.background='#c00000'}
                    onMouseLeave={e=>e.currentTarget.style.background='#e10600'}
                  >Výsledky →</button>
                  <button onClick={() => setTab('calendar')} style={{ fontSize:12, fontWeight:700, letterSpacing:2, textTransform:'uppercase', padding:'13px 28px', background:'transparent', color:'rgba(255,255,255,.6)', border:'1px solid rgba(255,255,255,.18)', transition:'all .2s' }}
                    onMouseEnter={e=>{e.currentTarget.style.color='#fff';e.currentTarget.style.borderColor='rgba(255,255,255,.45)'}}
                    onMouseLeave={e=>{e.currentTarget.style.color='rgba(255,255,255,.6)';e.currentTarget.style.borderColor='rgba(255,255,255,.18)'}}
                  >Kalendář →</button>
                </div>
              </div>

              {/* Leader card */}
              <div className={`hero-in${heroLoaded?' loaded':''}`} style={{ transitionDelay:'.4s' }}>
                <div style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.07)', borderTop:`4px solid ${leader?.color||'#e10600'}`, padding:'28px 32px' }}>
                  <div style={{ fontSize:9, letterSpacing:4, color:'rgba(255,255,255,.3)', textTransform:'uppercase', marginBottom:20, fontWeight:700 }}>Lídr šampionátu</div>
                  {loading ? (
                    <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                      <Skeleton h={80} /><Skeleton h={60} />
                    </div>
                  ) : leader ? (
                    <>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:18, marginBottom:24 }}>
                        <div style={{ fontSize:68, fontWeight:900, color:'rgba(255,255,255,.05)', lineHeight:1, flexShrink:0 }}>{String(leader.pos).padStart(2,'0')}</div>
                        <div>
                          <div style={{ fontSize:26, fontWeight:900, color:'#fff', letterSpacing:.5, lineHeight:1.05, marginBottom:8 }}>{leader.name.split(' ').join('\n')}</div>
                          <div style={{ fontSize:11, color:leader.color, letterSpacing:2, fontWeight:700 }}>{leader.team} · #{leader.num} · {leader.flag}</div>
                        </div>
                      </div>
                      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'rgba(255,255,255,.05)' }}>
                        {[['Bodů',leader.pts],['Výher',leader.wins],['Závodů',completedRaces.length]].map(([l,v])=>(
                          <div key={l} style={{ background:'#15151e', padding:'14px 10px', textAlign:'center' }}>
                            <div style={{ fontSize:26, fontWeight:900, color:'#fff', lineHeight:1 }}>{v}</div>
                            <div style={{ fontSize:8, letterSpacing:2, color:'rgba(255,255,255,.25)', textTransform:'uppercase', marginTop:4 }}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : <div style={{ color:'rgba(255,255,255,.3)',fontSize:13,letterSpacing:2,textTransform:'uppercase' }}>Data nejsou k dispozici</div>}
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{ background:'#f5f5f7', borderBottom:'1px solid #e8e8e8' }}>
            <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 40px', display:'grid', gridTemplateColumns:'repeat(4,1fr)' }}>
              {loading ? Array(4).fill(0).map((_,i)=>(
                <div key={i} style={{ padding:'18px 20px', borderRight: i<3?'1px solid #e8e8e8':'none' }}>
                  <Skeleton h={10} w="60%" /><div style={{height:8}}/>
                  <Skeleton h={20} w="80%" />
                </div>
              )) : [
                { l:'Odjeté závody', v:`${completedRaces.length} / ${totalRaces}`, c:'#e10600' },
                { l:'Lídr — jezdci', v:leader?`${leader.name.split(' ')[1]} · ${leader.pts} pts`:'—', c:'#15151e' },
                { l:'Lídr — týmy', v:leaderTeam?`${leaderTeam.name} · ${leaderTeam.pts} pts`:'—', c:'#15151e' },
                { l:'Příští závod', v:nextRace?`${nextRace.name} · ${nextRace.date}`:'Sezóna skončila', c:'#15151e' },
              ].map((s,i)=>(
                <div key={i} style={{ padding:'18px 20px', borderRight:i<3?'1px solid #e8e8e8':'none' }}>
                  <div style={{ fontSize:9, letterSpacing:2, color:'#aaa', textTransform:'uppercase', marginBottom:5, fontWeight:700 }}>{s.l}</div>
                  <div style={{ fontSize:17, fontWeight:700, color:s.c, letterSpacing:-.3 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RESULTS + TEAMS */}
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:48 }}>
            {/* Last race */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'#15151e', textTransform:'uppercase' }}>Poslední výsledky</h2>
                <button onClick={()=>setTab('calendar')} style={{ background:'none',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,color:'#e10600',textTransform:'uppercase',textDecoration:'underline' }}>Vše →</button>
              </div>
              {loading ? (
                <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
                  {[1,2].map(i=><div key={i} style={{ background:'#f9f9f9',borderLeft:'4px solid #e10600',padding:'20px 24px' }}><Skeleton h={16} w="40%" /><div style={{height:6}}/><Skeleton h={24} w="70%" /></div>)}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:2 }}>
                  {completedRaces.slice(-3).reverse().map(r=>(
                    <div key={r.r} className="f1-rev" style={{ background:'#f9f9f9', borderLeft:'4px solid #e10600', padding:'18px 24px', display:'flex', alignItems:'center', gap:16 }}>
                      <span style={{ fontSize:30 }}>{r.flag}</span>
                      <div style={{ flex:1 }}>
                        <div style={{ fontSize:9, letterSpacing:2, color:'#aaa', textTransform:'uppercase', marginBottom:3, fontWeight:600 }}>R{r.r} · {r.date}</div>
                        <div style={{ fontSize:18, fontWeight:700, color:'#15151e', letterSpacing:.3 }}>{r.name} GP</div>
                        <div style={{ fontSize:10, color:'#bbb', marginTop:2 }}>{r.circuit}{r.laps?` · ${r.laps} kol`:''}</div>
                      </div>
                      {r.winner && (
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontSize:9, letterSpacing:2, color:'#aaa', textTransform:'uppercase', marginBottom:3, fontWeight:600 }}>Vítěz</div>
                          <div style={{ fontSize:16, fontWeight:700, color:'#15151e' }}>{r.winner.split(' ')[1]||r.winner}</div>
                          <div style={{ fontSize:10, color:getTeamColor(r.wTeam?.toLowerCase().replace(/ /g,'_')||''), fontWeight:600 }}>{r.wTeam}</div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Constructors mini */}
            <div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:20 }}>
                <h2 style={{ fontSize:11, fontWeight:700, letterSpacing:3, color:'#15151e', textTransform:'uppercase' }}>Konstruktéři</h2>
                <button onClick={()=>setTab('standings')} style={{ background:'none',border:'none',fontSize:10,fontWeight:700,letterSpacing:1,color:'#e10600',textTransform:'uppercase',textDecoration:'underline' }}>Vše →</button>
              </div>
              {loading ? (
                <div style={{ display:'flex',flexDirection:'column',gap:1 }}>
                  {Array(6).fill(0).map((_,i)=><div key={i} style={{ background:'#f9f9f9',padding:'14px 16px' }}><Skeleton h={16} /></div>)}
                </div>
              ) : (
                <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
                  {teams.slice(0,7).map(t=>(
                    <div key={t.name} className="f1-rev f1-row" style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 16px', background:'#f9f9f9', transition:'background .15s' }}>
                      <span style={{ fontSize:13, fontWeight:700, color:'#ddd', minWidth:20 }}>{t.pos}</span>
                      <div style={{ width:4, height:18, background:t.color, borderRadius:1, flexShrink:0 }} />
                      <span style={{ fontSize:14, fontWeight:700, color:'#15151e', flex:1 }}>{t.name}</span>
                      <div style={{ width:100, height:3, background:'#eee', position:'relative', borderRadius:2 }}>
                        <div style={{ position:'absolute', top:0, left:0, height:'100%', borderRadius:2, width:`${Math.round((t.pts/(teams[0]?.pts||1))*100)}%`, background:t.color }} />
                      </div>
                      <span style={{ fontSize:17, fontWeight:900, color:'#15151e', minWidth:38, textAlign:'right' }}>{t.pts}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* TOP 3 PODIUM */}
          {!loading && drivers.length >= 3 && (
            <div style={{ background:'#15151e', padding:'56px 40px' }}>
              <div style={{ maxWidth:1320, margin:'0 auto' }}>
                <div style={{ fontSize:10, letterSpacing:4, color:'rgba(255,255,255,.3)', textTransform:'uppercase', fontWeight:700, marginBottom:32 }}>Top 3 — Šampionát jezdců</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1.15fr 1fr', gap:2, alignItems:'flex-end' }}>
                  {[drivers[1], drivers[0], drivers[2]].map((d,idx)=>{
                    const heights = [180, 220, 160]
                    const medals = ['🥈','🥇','🥉']
                    return (
                      <div key={d?.name||idx} className="f1-rev" style={{ background:'rgba(255,255,255,.03)', border:'1px solid rgba(255,255,255,.06)', borderTop:`3px solid ${d?.color||'#888'}`, padding:'24px 20px', height:heights[idx], display:'flex', flexDirection:'column', justifyContent:'flex-end' }}>
                        <div style={{ fontSize:22 }}>{medals[idx]}</div>
                        <div style={{ fontSize:24, fontWeight:900, color:'#fff', lineHeight:1.1, marginTop:8 }}>{d?.name?.split(' ')[1]||d?.name}</div>
                        <div style={{ fontSize:10, color:d?.color||'#888', letterSpacing:2, fontWeight:700, marginTop:4 }}>{d?.team}</div>
                        <div style={{ fontSize:32, fontWeight:900, color:'#fff', marginTop:8 }}>{d?.pts}</div>
                        <div style={{ fontSize:8, letterSpacing:2, color:'rgba(255,255,255,.3)', textTransform:'uppercase' }}>bodů</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ═══════ STANDINGS ═══════ */}
      {tab === 'standings' && (
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 40px' }}>
          <div style={{ borderLeft:'4px solid #e10600', paddingLeft:20, marginBottom:48 }}>
            <div style={{ fontSize:9, letterSpacing:4, color:'#e10600', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>
              Šampionát {new Date().getFullYear()} · Po R{completedRaces.length}
            </div>
            <h2 style={{ fontSize:38, fontWeight:900, color:'#15151e', letterSpacing:-1 }}>VÝSLEDKOVÁ LISTINA</h2>
          </div>

          {loading ? (
            <div style={{ display:'flex',flexDirection:'column',gap:2 }}>
              {Array(10).fill(0).map((_,i)=><div key={i} style={{ background:'#f9f9f9',padding:'16px 20px' }}><Skeleton h={18} /></div>)}
            </div>
          ) : (
            <>
              {/* DRIVERS TABLE */}
              <h3 style={{ fontSize:10, letterSpacing:4, color:'#aaa', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Jezdci</h3>
              <div style={{ marginBottom:56, border:'1px solid #e8e8e8', overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'50px 1fr 160px 80px 60px 80px', padding:'10px 20px', background:'#15151e' }}>
                  {['POS','JEZDEC','TÝM','BODY','WIN','GAP'].map(h=>(
                    <span key={h} style={{ fontSize:8, letterSpacing:3, color:'rgba(255,255,255,.35)', textTransform:'uppercase', fontWeight:700 }}>{h}</span>
                  ))}
                </div>
                {drivers.map((d,i)=>(
                  <div key={d.name} className="f1-rev f1-row" style={{ display:'grid', gridTemplateColumns:'50px 1fr 160px 80px 60px 80px', alignItems:'center', padding:'13px 20px', background:'#fff', borderTop:'1px solid #f0f0f0', borderLeft:`4px solid ${i<3?d.color:'transparent'}`, transition:'background .15s' }}>
                    <span style={{ fontSize:18, fontWeight:900, color:i===0?'#e10600':i<3?'#15151e':'#ccc' }}>{d.pos}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <span style={{ fontSize:18 }}>{d.flag}</span>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:'#15151e', letterSpacing:.3 }}>{d.name}</div>
                        <div style={{ fontSize:9, color:'#bbb', letterSpacing:1 }}>#{d.num}</div>
                      </div>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:3, height:14, background:d.color, borderRadius:1, flexShrink:0 }} />
                      <span style={{ fontSize:11, color:'#777', fontWeight:600 }}>{d.team}</span>
                    </div>
                    <span style={{ fontSize:18, fontWeight:900, color:'#15151e' }}>{d.pts}</span>
                    <span style={{ fontSize:14, color:'#15151e', fontWeight:600 }}>{d.wins}</span>
                    <span style={{ fontSize:12, color:d.gap==='—'?'#e10600':'#aaa', fontWeight:600 }}>{d.gap}</span>
                  </div>
                ))}
              </div>

              {/* TEAMS TABLE */}
              <h3 style={{ fontSize:10, letterSpacing:4, color:'#aaa', textTransform:'uppercase', fontWeight:700, marginBottom:10 }}>Konstruktéři</h3>
              <div style={{ border:'1px solid #e8e8e8', overflow:'hidden' }}>
                <div style={{ display:'grid', gridTemplateColumns:'50px 1fr 80px 60px', padding:'10px 20px', background:'#15151e' }}>
                  {['POS','TÝM','BODY','WIN'].map(h=>(
                    <span key={h} style={{ fontSize:8, letterSpacing:3, color:'rgba(255,255,255,.35)', textTransform:'uppercase', fontWeight:700 }}>{h}</span>
                  ))}
                </div>
                {teams.map((t,i)=>(
                  <div key={t.name} className="f1-rev f1-row" style={{ display:'grid', gridTemplateColumns:'50px 1fr 80px 60px', alignItems:'center', padding:'13px 20px', background:'#fff', borderTop:'1px solid #f0f0f0', borderLeft:`4px solid ${i<2?t.color:'transparent'}`, transition:'background .15s' }}>
                    <span style={{ fontSize:18, fontWeight:900, color:i===0?'#e10600':'#ccc' }}>{t.pos}</span>
                    <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <div style={{ width:4, height:20, background:t.color, borderRadius:1 }} />
                      <span style={{ fontSize:14, fontWeight:700, color:'#15151e' }}>{t.name}</span>
                    </div>
                    <span style={{ fontSize:18, fontWeight:900, color:'#15151e' }}>{t.pts}</span>
                    <span style={{ fontSize:14, fontWeight:600, color:'#777' }}>{t.wins}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════ DRIVERS ═══════ */}
      {tab === 'drivers' && (
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 40px' }}>
          <div style={{ borderLeft:'4px solid #e10600', paddingLeft:20, marginBottom:48 }}>
            <div style={{ fontSize:9, letterSpacing:4, color:'#e10600', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Sezóna {new Date().getFullYear()}</div>
            <h2 style={{ fontSize:38, fontWeight:900, color:'#15151e', letterSpacing:-1 }}>JEZDCI</h2>
          </div>
          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:2 }}>
              {Array(10).fill(0).map((_,i)=><div key={i} style={{ background:'#f9f9f9',padding:'24px',height:240 }}><Skeleton h={20} w="60%"/><div style={{height:8}}/><Skeleton h={16} w="40%"/></div>)}
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:2 }}>
              {drivers.map((d,i)=>(
                <div key={d.name} className="f1-rev" style={{ background:'#fff', border:'1px solid #ebebeb', borderTop:`4px solid ${d.color}`, transition:'box-shadow .2s, transform .2s' }}
                  onMouseEnter={e=>{ e.currentTarget.style.boxShadow='0 8px 32px rgba(0,0,0,.09)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e=>{ e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)' }}
                >
                  <div style={{ padding:'18px 20px 14px', display:'flex', alignItems:'flex-start', justifyContent:'space-between' }}>
                    <div style={{ fontSize:48, fontWeight:900, color:'#f0f0f0', lineHeight:1 }}>{String(d.pos).padStart(2,'0')}</div>
                    <div style={{ textAlign:'right' }}>
                      <span style={{ fontSize:26 }}>{d.flag}</span>
                      <div style={{ fontSize:9, color:'#bbb', letterSpacing:2, marginTop:2 }}>#{d.num}</div>
                    </div>
                  </div>
                  <div style={{ padding:'0 20px 14px' }}>
                    <div style={{ fontSize:18, fontWeight:900, color:'#15151e', letterSpacing:.3, lineHeight:1.1, marginBottom:4 }}>{d.name}</div>
                    <div style={{ fontSize:10, color:d.color, fontWeight:700, letterSpacing:2, textTransform:'uppercase', marginBottom:0 }}>{d.team}</div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:1, background:'#f0f0f0' }}>
                    {[['PTS',d.pts],['WIN',d.wins],['GAP',d.gap]].map(([l,v])=>(
                      <div key={l} style={{ background:'#fff', padding:'12px 8px', textAlign:'center' }}>
                        <div style={{ fontSize:7, letterSpacing:2, color:'#bbb', textTransform:'uppercase', fontWeight:700, marginBottom:3 }}>{l}</div>
                        <div style={{ fontSize:18, fontWeight:900, color:l==='PTS'?d.color:l==='GAP'&&v==='—'?'#e10600':'#15151e' }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════ GARAGE ═══════ */}
      {tab === 'garage' && (
        <div>
          <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 40px 24px' }}>
            <div style={{ borderLeft:'4px solid #e10600', paddingLeft:20, marginBottom:28 }}>
              <div style={{ fontSize:9, letterSpacing:4, color:'#e10600', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Interaktivní · WebGL</div>
              <h2 style={{ fontSize:38, fontWeight:900, color:'#15151e', letterSpacing:-1 }}>3D GARÁŽ</h2>
            </div>
            <p style={{ fontSize:13, color:'#999', marginBottom:20, fontWeight:300 }}>Pohybuj myší pro rotaci vozu · Vyber barvu týmu</p>
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:16 }}>
              {(teams.length > 0 ? teams.map(t=>({n:t.name,c:t.color,id:t.constructorId})) : TEAM_COLORS_LIST).map(t=>(
                <button key={t.id||t.n} onClick={()=>setCarColor(t.c)} style={{ fontSize:10, fontWeight:700, letterSpacing:1, textTransform:'uppercase', padding:'7px 16px', background:carColor===t.c?t.c:'#f5f5f5', color:carColor===t.c?'#fff':'#777', border:`2px solid ${carColor===t.c?t.c:'#e8e8e8'}`, transition:'all .2s' }}>{t.n}</button>
              ))}
            </div>
          </div>
          <div style={{ background:'#15151e', position:'relative', height:560 }}>
            <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:`linear-gradient(90deg, transparent, ${carColor}, transparent)`, zIndex:2 }} />
            {threeReady
              ? <Car3D key={carColor} color={carColor} />
              : <div style={{ height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                    <div style={{ width:32, height:32, border:'3px solid rgba(255,255,255,.1)', borderTop:'3px solid #e10600', borderRadius:'50%', animation:'f1-spin .8s linear infinite' }} />
                    <span style={{ fontSize:11, letterSpacing:4, color:'rgba(255,255,255,.2)', textTransform:'uppercase' }}>Načítám 3D engine…</span>
                  </div>
                </div>
            }
            <div style={{ position:'absolute', bottom:0, left:0, right:0, height:80, background:'linear-gradient(to top,rgba(21,21,30,.95),transparent)', pointerEvents:'none', zIndex:1 }} />
          </div>
          <div style={{ background:'#f5f5f7', borderBottom:'1px solid #e8e8e8' }}>
            <div style={{ maxWidth:1320, margin:'0 auto', padding:'0 40px', display:'grid', gridTemplateColumns:'repeat(5,1fr)' }}>
              {[['Motor','1.6L V6 Turbo Hybrid'],['Výkon','1000+ koní'],['Hmotnost','798 kg min.'],['Max RPM','15 000'],['0–100 km/h','~2.4 s']].map(([l,v],i)=>(
                <div key={l} style={{ padding:'18px 16px', borderRight:i<4?'1px solid #e8e8e8':'none' }}>
                  <div style={{ fontSize:8, letterSpacing:2, color:'#aaa', textTransform:'uppercase', fontWeight:600, marginBottom:4 }}>{l}</div>
                  <div style={{ fontSize:15, fontWeight:700, color:'#15151e' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CALENDAR ═══════ */}
      {tab === 'calendar' && (
        <div style={{ maxWidth:1320, margin:'0 auto', padding:'56px 40px' }}>
          <div style={{ borderLeft:'4px solid #e10600', paddingLeft:20, marginBottom:32 }}>
            <div style={{ fontSize:9, letterSpacing:4, color:'#e10600', textTransform:'uppercase', fontWeight:700, marginBottom:4 }}>Sezóna {new Date().getFullYear()}</div>
            <h2 style={{ fontSize:38, fontWeight:900, color:'#15151e', letterSpacing:-1 }}>KALENDÁŘ</h2>
          </div>

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:2 }}>
              {Array(8).fill(0).map((_,i)=><div key={i} style={{ background:'#f9f9f9',padding:'22px 24px',height:140 }}><Skeleton h={32} w={32}/><div style={{height:8}}/><Skeleton h={22} w="70%"/></div>)}
            </div>
          ) : (
            <>
              <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:36 }}>
                <div style={{ flex:1, maxWidth:480, height:4, background:'#e8e8e8', borderRadius:2 }}>
                  <div style={{ height:'100%', borderRadius:2, width:`${Math.round((completedRaces.length/Math.max(totalRaces,1))*100)}%`, background:'#e10600', transition:'width 1s' }} />
                </div>
                <span style={{ fontSize:11, fontWeight:700, letterSpacing:2, color:'#aaa', textTransform:'uppercase' }}>{completedRaces.length} / {totalRaces} závodů</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:2 }}>
                {races.map(r=>(
                  <div key={r.r} className="f1-rev" style={{ background:r.next?'#fff9f9':'#fff', border:`1px solid ${r.next?'#ffd0d0':'#e8e8e8'}`, borderLeft:`5px solid ${r.done?'#15151e':r.next?'#e10600':'#e0e0e0'}`, padding:'20px 22px', transition:'box-shadow .2s' }}
                    onMouseEnter={e=>e.currentTarget.style.boxShadow='0 4px 16px rgba(0,0,0,.07)'}
                    onMouseLeave={e=>e.currentTarget.style.boxShadow='none'}
                  >
                    <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                      <span style={{ fontSize:28 }}>{r.flag}</span>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:8, letterSpacing:3, color:'#aaa', textTransform:'uppercase', fontWeight:700 }}>Round {r.r}</div>
                        <div style={{ fontSize:13, fontWeight:700, color:'#15151e' }}>{r.date}</div>
                      </div>
                    </div>
                    <div style={{ fontSize:18, fontWeight:900, color:r.done?'#bbb':'#15151e', letterSpacing:.3, marginBottom:3 }}>{r.name} GP</div>
                    {r.circuit && <div style={{ fontSize:10, color:'#ccc', marginBottom: (r.done||r.next)?10:0 }}>{r.circuit}</div>}
                    {r.done && r.winner && (
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <span style={{ fontSize:12 }}>🏆</span>
                        <span style={{ fontSize:13, fontWeight:700, color:'#15151e' }}>{r.winner}</span>
                        <span style={{ fontSize:10, color:getTeamColor(r.wTeam?.toLowerCase().replace(/ /g,'_')||''), fontWeight:700 }}>{r.wTeam}</span>
                      </div>
                    )}
                    {r.next && (
                      <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'#e10600', padding:'4px 10px' }}>
                        <span style={{ width:5, height:5, borderRadius:'50%', background:'#fff', animation:'f1-blink 1.5s ease infinite' }} />
                        <span style={{ fontSize:8, fontWeight:700, letterSpacing:2, color:'#fff', textTransform:'uppercase' }}>Příští závod</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop:80, background:'#15151e', padding:'28px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', gap:16, flexWrap:'wrap' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ background:'#e10600', padding:'3px 8px' }}>
            <span style={{ fontSize:12, fontWeight:900, color:'#fff' }}>F1</span>
          </div>
          <span style={{ fontSize:10, fontWeight:700, letterSpacing:2, color:'rgba(255,255,255,.3)', textTransform:'uppercase' }}>Formula One Tracker {new Date().getFullYear()}</span>
        </div>
        <span style={{ fontSize:9, letterSpacing:2, color:'rgba(255,255,255,.15)', textTransform:'uppercase' }}>
          Data: Jolpica API (Ergast) · {lastUpdated ? `Aktualizováno ${lastUpdated.toLocaleTimeString('cs-CZ',{hour:'2-digit',minute:'2-digit'})}` : 'Načítám…'} · Auto-refresh 60s
        </span>
      </footer>
    </>
  )
}
