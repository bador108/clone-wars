'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

/* ─────────────── DATA ─────────────── */
const DRIVERS = [
  { pos:1,  name:'George Russell',  short:'RUS', team:'Mercedes',  num:63, flag:'🇬🇧', pts:51, wins:2, podiums:2,  color:'#00D2BE',
    bio:'Dvojnásobný vítěz sezóny 2026. Russell využil nových pravidel k absolutní dominanci na čele šampionátu. Mercedes pod jeho vedením vede v obou pohárech.',
    nation:'Britský', age:27, debut:2019 },
  { pos:2,  name:'Kimi Antonelli',  short:'ANT', team:'Mercedes',  num:12, flag:'🇮🇹', pts:47, wins:1, podiums:2,  color:'#00D2BE',
    bio:'Senzace sezóny 2026. Nástupce Hamiltona zvítězil ve svém teprve druhém závodě — Číně. Nejmladší vítěz od Vettela.',
    nation:'Italský', age:19, debut:2025 },
  { pos:3,  name:'Charles Leclerc', short:'LEC', team:'Ferrari',   num:16, flag:'🇲🇨', pts:34, wins:0, podiums:1,  color:'#E8002D',
    bio:'Monacký princ drží Ferrari v top 3. Adaptace na nová pravidla 2026 probíhá — první vítězství je jen otázkou času.',
    nation:'Monacký', age:28, debut:2018 },
  { pos:4,  name:'Lewis Hamilton',  short:'HAM', team:'Ferrari',   num:44, flag:'🇬🇧', pts:33, wins:0, podiums:1,  color:'#E8002D',
    bio:'Sedminásobný mistr světa v rudém. Přestup do Ferrari byl splněným snem — těžký začátek sezóny 2026 ho ale nezlomí.',
    nation:'Britský', age:41, debut:2007 },
  { pos:5,  name:'Oliver Bearman',  short:'BEA', team:'Haas',      num:87, flag:'🇬🇧', pts:17, wins:0, podiums:1,  color:'#B6BABD',
    bio:'Největší překvapení startu sezóny. Bearman táhne Haas do top 5 a dokazuje, proč ho týmy sledovaly roky.',
    nation:'Britský', age:20, debut:2025 },
  { pos:6,  name:'Lando Norris',    short:'NOR', team:'McLaren',   num:4,  flag:'🇬🇧', pts:15, wins:0, podiums:0,  color:'#FF8000',
    bio:'Mistr světa 2025 má těžký start. McLaren bojuje s adaptací na nová pravidla — Norris ale nikdy nevzdává.',
    nation:'Britský', age:26, debut:2019 },
  { pos:7,  name:'Pierre Gasly',    short:'GAS', team:'Alpine',    num:10, flag:'🇫🇷', pts:9,  wins:0, podiums:0,  color:'#FF87BC',
    bio:'Zkušený závodník boduje konzistentně pro Alpine. 7. místo v šampionátu překonává předsezónní očekávání.',
    nation:'Francouzský', age:29, debut:2017 },
  { pos:8,  name:'Max Verstappen',  short:'VER', team:'Red Bull',  num:1,  flag:'🇳🇱', pts:8,  wins:0, podiums:0,  color:'#3671C6',
    bio:'Čtyřnásobný mistr světa šokuje na 8. místě. Red Bull ztratil výhodu po radikální změně pravidel 2026. Comeback se rýsuje.',
    nation:'Nizozemský', age:28, debut:2015 },
  { pos:9,  name:'Liam Lawson',     short:'LAW', team:'RB',        num:30, flag:'🇳🇿', pts:8,  wins:0, podiums:0,  color:'#6692FF',
    bio:'Novozélanďan v plné formě. Boduje pravidelně pro RB a atakuje zkušenější jezdce bez ostychu.',
    nation:'Novozélandský', age:23, debut:2024 },
  { pos:10, name:'Arvid Lindblad',  short:'LIN', team:'RB',        num:6,  flag:'🇸🇪', pts:4,  wins:0, podiums:0,  color:'#6692FF',
    bio:'Švédský nováček překvapuje pravidelnou jízdou. Čtvrtý v celkovém pořadí z RB jezdců.',
    nation:'Švédský', age:19, debut:2026 },
]

const TEAMS = [
  { pos:1, name:'Mercedes',  full:'Mercedes-AMG Petronas F1',  pts:98, color:'#00D2BE', chassis:'W16',    engine:'Mercedes', base:'Brackley, UK',     titles:8  },
  { pos:2, name:'Ferrari',   full:'Scuderia Ferrari HP',       pts:67, color:'#E8002D', chassis:'SF-26',  engine:'Ferrari',  base:'Maranello, IT',    titles:16 },
  { pos:3, name:'McLaren',   full:'McLaren Formula 1 Team',    pts:18, color:'#FF8000', chassis:'MCL40',  engine:'Mercedes', base:'Woking, UK',       titles:8  },
  { pos:4, name:'Haas',      full:'MoneyGram Haas F1 Team',    pts:17, color:'#B6BABD', chassis:'VF-26',  engine:'Ferrari',  base:'Kannapolis, USA',  titles:0  },
  { pos:5, name:'Red Bull',  full:'Oracle Red Bull Racing',    pts:12, color:'#3671C6', chassis:'RB21',   engine:'Ford',     base:'Milton Keynes, UK',titles:6  },
  { pos:6, name:'Alpine',    full:'BWT Alpine F1 Team',        pts:10, color:'#FF87BC', chassis:'A526',   engine:'Renault',  base:'Enstone, UK',      titles:2  },
  { pos:7, name:'RB',        full:'Visa Cash App RB F1 Team',  pts:12, color:'#6692FF', chassis:'VCARB02',engine:'Honda',    base:'Faenza, IT',       titles:0  },
  { pos:8, name:'Audi',      full:'Audi F1 Team',              pts:2,  color:'#C0C0C0', chassis:'C45',    engine:'Audi',     base:'Hinwil, CH',       titles:0  },
  { pos:9, name:'Williams',  full:'Williams Racing',           pts:2,  color:'#37BEDD', chassis:'FW47',   engine:'Mercedes', base:'Grove, UK',        titles:7  },
]

const RACES = [
  { r:1,  name:'Austrálie',       flag:'🇦🇺', circuit:'Albert Park',        date:'16. 3. 2026',  done:true,  winner:'Russell',   wTeam:'Mercedes', laps:58 },
  { r:2,  name:'Čína',            flag:'🇨🇳', circuit:'Shanghai Int.',       date:'23. 3. 2026',  done:true,  winner:'Antonelli', wTeam:'Mercedes', laps:56 },
  { r:3,  name:'Japonsko',        flag:'🇯🇵', circuit:'Suzuka',              date:'6. 4. 2026',   done:false, next:true },
  { r:4,  name:'Bahrajn',         flag:'🇧🇭', circuit:'Bahrain Int.',        date:'20. 4. 2026',  done:false },
  { r:5,  name:'Miami',           flag:'🇺🇸', circuit:'Miami Int.',          date:'4. 5. 2026',   done:false },
  { r:6,  name:'Emilia Romagna',  flag:'🇮🇹', circuit:'Autodromo Enzo',      date:'18. 5. 2026',  done:false },
  { r:7,  name:'Monako',          flag:'🇲🇨', circuit:'Circuit de Monaco',   date:'25. 5. 2026',  done:false },
  { r:8,  name:'Španělsko',       flag:'🇪🇸', circuit:'Circuit de Barcelona',date:'1. 6. 2026',   done:false },
  { r:9,  name:'Kanada',          flag:'🇨🇦', circuit:'Gilles Villeneuve',   date:'15. 6. 2026',  done:false },
  { r:10, name:'Velká Británie',  flag:'🇬🇧', circuit:'Silverstone',         date:'6. 7. 2026',   done:false },
]

const TICKER_ITEMS = [
  'RUSSELL VEDE ŠAMPIONÁT — 51 BODŮ PO 2 ZÁVODECH',
  'ANTONELLI VYHRÁL ČÍNU — DRUHÝ ZÁVOD KARIÉRY',
  'MERCEDES VEDE KONSTRUKTÉRY — 98 BODŮ',
  'VERSTAPPEN NA 8. MÍSTĚ — RED BULL V KRIZI',
  'PŘÍŠTÍ ZÁVOD: JAPONSKO GP — SUZUKA, 6. DUBNA 2026',
  'BEARMAN: 5. MÍSTO V ŠAMPIONÁTU — SENZACE SEZÓNY',
  'NORRIS OBHAJUJE TITUL — MCLAREN ADAPTUJE NA 2026',
]

/* ─────────────── THREE.JS CAR ─────────────── */
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
    cam.position.set(5, 2.5, 6)
    cam.lookAt(0, 0.2, 0)

    // Lights
    scene.add(new T.AmbientLight(0xffffff, 0.45))
    const sun = new T.DirectionalLight(0xffffff, 1.6)
    sun.position.set(8, 12, 8); sun.castShadow = true
    sun.shadow.mapSize.width = 2048; sun.shadow.mapSize.height = 2048
    scene.add(sun)
    const fill = new T.DirectionalLight(0xaabbff, 0.35)
    fill.position.set(-6, 3, -5); scene.add(fill)
    const rim = new T.DirectionalLight(new T.Color(color), 0.9)
    rim.position.set(0, -4, -8); scene.add(rim)

    // Ground
    const gnd = new T.Mesh(
      new T.PlaneGeometry(40, 40),
      new T.MeshStandardMaterial({ color: 0x080808, metalness: 0.95, roughness: 0.05 })
    )
    gnd.rotation.x = -Math.PI / 2; gnd.position.y = -0.57; gnd.receiveShadow = true
    scene.add(gnd)

    // Materials
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
      m.position.set(x, y, z); m.rotation.set(rx, ry, rz)
      car.add(m); return m
    }

    // ── BODY
    mk(new T.BoxGeometry(3.5, 0.26, 0.68), bMat, 0, 0, 0)
    // Nose cone
    mk(new T.CylinderGeometry(0.06, 0.30, 1.6, 12), bMat, 2.24, -0.01, 0, 0, 0, Math.PI/2)
    // Engine cover
    mk(new T.BoxGeometry(1.3, 0.28, 0.36), cMat, -0.78, 0.2, 0)
    // Cockpit surround
    mk(new T.BoxGeometry(0.72, 0.18, 0.44), cMat, 0.1, 0.22, 0)
    // Visor glass
    mk(new T.BoxGeometry(0.52, 0.08, 0.30), glassMat, 0.12, 0.32, 0)
    // Airbox
    mk(new T.CylinderGeometry(0.08, 0.11, 0.22, 12), darkMat, 0.14, 0.44, 0)

    // HALO
    const hPts = []
    for (let i = 0; i <= 24; i++) {
      const a = (i / 24) * Math.PI
      hPts.push(new T.Vector3(Math.cos(a) * 0.3 - 0.05, Math.sin(a) * 0.33 + 0.28, 0))
    }
    mk(new T.TubeGeometry(new T.CatmullRomCurve3(hPts), 24, 0.02, 8, false), silvMat, 0, 0, 0)

    // Floor
    mk(new T.BoxGeometry(3.2, 0.04, 0.84), cMat, -0.1, -0.17, 0)

    // Sidepods
    ;[-1, 1].forEach(s => {
      mk(new T.BoxGeometry(1.6, 0.18, 0.2), bMat, -0.05, -0.03, s * 0.43)
      mk(new T.CylinderGeometry(0.07, 0.10, 0.06, 12), darkMat, 0.44, 0.01, s * 0.55, Math.PI/2, 0, 0)
    })

    // REAR WING
    mk(new T.BoxGeometry(0.05, 0.32, 1.06), bMat, -1.72, 0.32, 0)
    mk(new T.BoxGeometry(0.05, 0.06, 1.06), bMat, -1.72, 0.56, 0)
    ;[-1, 1].forEach(s => mk(new T.BoxGeometry(0.30, 0.46, 0.04), bMat, -1.72, 0.35, s * 0.53))

    // FRONT WING
    mk(new T.BoxGeometry(0.05, 0.035, 1.14), bMat, 2.56, -0.21, 0)
    mk(new T.BoxGeometry(0.34, 0.035, 1.04), bMat, 2.36, -0.165, 0)
    ;[-1, 1].forEach(s => {
      mk(new T.BoxGeometry(0.38, 0.19, 0.04), bMat, 2.4, -0.165, s * 0.54)
    })

    // WHEELS
    ;[{x:1.48,y:-0.24,z:0.63,r:1},{x:1.48,y:-0.24,z:-0.63,r:1},
      {x:-1.14,y:-0.24,z:0.70,r:1.1},{x:-1.14,y:-0.24,z:-0.70,r:1.1}].forEach(wp => {
      mk(new T.CylinderGeometry(0.30*wp.r, 0.30*wp.r, 0.26, 28), tireMat, wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      mk(new T.CylinderGeometry(0.20*wp.r, 0.20*wp.r, 0.28, 18), rimMat,  wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      mk(new T.CylinderGeometry(0.12*wp.r, 0.12*wp.r, 0.06, 16), diskMat, wp.x, wp.y, wp.z, Math.PI/2, 0, 0)
      // Rim spokes
      for (let i = 0; i < 5; i++) {
        const spoke = new T.Mesh(new T.BoxGeometry(0.02, 0.16*wp.r, 0.03), rimMat)
        spoke.rotation.z = (i / 5) * Math.PI * 2
        spoke.position.set(wp.x, wp.y, wp.z)
        car.add(spoke)
      }
      // Suspension
      const arm = new T.Mesh(new T.CylinderGeometry(0.012, 0.012, 0.52, 6), silvMat)
      arm.rotation.z = Math.PI/2
      arm.position.set(wp.x + (wp.x > 0 ? -0.26 : 0.26), wp.y + 0.07, wp.z * 0.55)
      car.add(arm)
    })

    // Livery stripe
    mk(new T.BoxGeometry(2.2, 0.006, 0.13), stripeMat, 0.3, 0.15, 0)

    car.position.y = 0.22
    scene.add(car)

    // Mouse
    let mx = 0, my = 0
    const onMM = e => {
      const r = el.getBoundingClientRect()
      mx = ((e.clientX - r.left) / W - 0.5) * 2
      my = ((e.clientY - r.top) / H - 0.5) * 2
    }
    el.addEventListener('mousemove', onMM)

    let t = 0, raf
    const tick = () => {
      raf = requestAnimationFrame(tick)
      t += 0.007
      car.rotation.y = t + mx * 0.45
      car.rotation.x = my * 0.06
      car.position.y = 0.22 + Math.sin(t * 0.65) * 0.045
      renderer.render(scene, cam)
    }
    tick()

    const onResize = () => {
      if (!el) return
      const nW = el.clientWidth, nH = el.clientHeight
      renderer.setSize(nW, nH); cam.aspect = nW/nH; cam.updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      el.removeEventListener('mousemove', onMM)
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
      renderer.dispose()
    }
  }, [color])

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}

/* ─────────────── MAIN PAGE ─────────────── */
export default function F1Page() {
  const router = useRouter()
  const curRef = useRef(null)
  const dotRef = useRef(null)
  const [tab, setTab] = useState('overview')
  const [threeReady, setThreeReady] = useState(false)
  const [carColor, setCarColor] = useState('#e10600')
  const [activeDriver, setActiveDriver] = useState(null)
  const [heroLoaded, setHeroLoaded] = useState(false)

  // Load Three.js
  useEffect(() => {
    if (window.THREE) { setThreeReady(true); return }
    const s = document.createElement('script')
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    s.onload = () => setThreeReady(true)
    document.head.appendChild(s)
    setTimeout(() => setHeroLoaded(true), 200)
  }, [])

  // Cursor
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

  // Hero animation
  useEffect(() => { const t = setTimeout(() => setHeroLoaded(true), 100); return () => clearTimeout(t) }, [])

  // Reveal on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('f1-vis') }),
      { threshold: 0.06 }
    )
    setTimeout(() => document.querySelectorAll('.f1-rev').forEach(el => obs.observe(el)), 100)
    return () => obs.disconnect()
  }, [tab])

  const TEAM_COLORS = [
    { n: 'Mercedes', c: '#00D2BE' }, { n: 'Ferrari', c: '#E8002D' },
    { n: 'McLaren',  c: '#FF8000' }, { n: 'Red Bull', c: '#3671C6' },
    { n: 'Alpine',   c: '#FF87BC' }, { n: 'Haas',     c: '#B6BABD' },
    { n: 'Audi',     c: '#888888' }, { n: 'Williams',  c: '#37BEDD' },
  ]

  const TABS = [
    { id: 'overview',  label: 'Přehled'  },
    { id: 'standings', label: 'Výsledky' },
    { id: 'drivers',   label: 'Jezdci'   },
    { id: 'garage',    label: '3D Garáž' },
    { id: 'calendar',  label: 'Kalendář' },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Formula1:wght@400;700;900&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,300;0,400;0,600;0,700;0,900;1,400&display=swap');

        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
        html, body { background: #fff; color: #15151e; font-family: 'Titillium Web', sans-serif; overflow-x: hidden; cursor: none !important; }
        * { cursor: none !important; }

        /* CURSOR */
        #f1cur { position: fixed; width: 24px; height: 24px; border: 2px solid #e10600; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); transition: width .15s, height .15s; }
        #f1dot { position: fixed; width: 4px; height: 4px; background: #e10600; border-radius: 50%; pointer-events: none; z-index: 99999; transform: translate(-50%,-50%); }

        /* SCROLL REVEAL */
        .f1-rev { opacity: 0; transform: translateY(16px); transition: opacity .6s ease, transform .6s ease; }
        .f1-vis { opacity: 1 !important; transform: translateY(0) !important; }

        /* HERO ANIMATION */
        .hero-in { opacity: 0; transform: translateY(24px); transition: opacity .8s ease, transform .8s ease; }
        .hero-in.loaded { opacity: 1; transform: translateY(0); }

        /* TICKER */
        @keyframes f1-tick { from { transform: translateX(0) } to { transform: translateX(-50%) } }

        /* BLINK */
        @keyframes f1-blink { 0%,100% { opacity: 1 } 50% { opacity: .3 } }

        /* SCROLLBAR */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: #e10600; }

        /* BUTTON RESET */
        button { font-family: 'Titillium Web', sans-serif; }

        /* TABLE HOVER */
        .f1-row:hover { background: #f5f5f5 !important; }
        .f1-row-dark:hover { background: #1a1a22 !important; }
      `}</style>

      <div id="f1cur" ref={curRef} />
      <div id="f1dot" ref={dotRef} />

      {/* ── TICKER ── */}
      <div style={{ background: '#15151e', height: 32, overflow: 'hidden', position: 'relative', zIndex: 200 }}>
        <div style={{ display: 'flex', animation: 'f1-tick 35s linear infinite', whiteSpace: 'nowrap', width: 'max-content', height: '100%', alignItems: 'center' }}>
          {[...Array(2)].map((_, ri) => (
            <span key={ri} style={{ display: 'flex' }}>
              {TICKER_ITEMS.map((item, i) => (
                <span key={i} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#fff', padding: '0 48px', borderRight: '1px solid rgba(255,255,255,.12)', textTransform: 'uppercase', lineHeight: '32px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#e10600', display: 'inline-block', flexShrink: 0 }} />
                  {item}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── NAV ── */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#fff', borderBottom: '1px solid #e8e8e8', boxShadow: '0 2px 8px rgba(0,0,0,.06)' }}>
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', color: '#999', fontFamily: "'Titillium Web',sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', transition: 'color .2s' }}
              onMouseEnter={e => e.currentTarget.style.color = '#15151e'}
              onMouseLeave={e => e.currentTarget.style.color = '#999'}
            >← Hub</button>
            <div style={{ width: 1, height: 22, background: '#e8e8e8' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ background: '#e10600', padding: '4px 10px', display: 'flex', alignItems: 'center' }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 16, fontWeight: 900, color: '#fff', letterSpacing: 1 }}>F1</span>
              </div>
              <div>
                <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, color: '#15151e', textTransform: 'uppercase', lineHeight: 1.1 }}>Formula One</div>
                <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, fontWeight: 400, letterSpacing: 1, color: '#999' }}>Sezóna 2026</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', height: 60 }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ background: 'none', border: 'none', borderBottom: `3px solid ${tab === t.id ? '#e10600' : 'transparent'}`, color: tab === t.id ? '#15151e' : '#666', fontFamily: "'Titillium Web',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 1, padding: '0 20px', height: 60, textTransform: 'uppercase', transition: 'all .2s' }}
                onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = '#15151e' }}
                onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = '#666' }}
              >{t.label}</button>
            ))}
          </div>
        </div>
      </nav>

      {/* ═══════════════ OVERVIEW ═══════════════ */}
      {tab === 'overview' && (
        <div>
          {/* HERO */}
          <div style={{ background: '#15151e', position: 'relative', overflow: 'hidden', padding: '100px 40px 80px' }}>
            {/* BG decoration */}
            <div style={{ position: 'absolute', right: '-5%', top: '50%', transform: 'translateY(-50%)', fontFamily: "'Titillium Web',sans-serif", fontSize: 'clamp(160px,22vw,340px)', fontWeight: 900, color: 'rgba(255,255,255,.03)', lineHeight: 1, letterSpacing: -16, userSelect: 'none', pointerEvents: 'none' }}>2026</div>
            <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 4, background: '#e10600' }} />

            <div style={{ maxWidth: 1320, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
              {/* Left */}
              <div>
                <div className={`hero-in${heroLoaded ? ' loaded' : ''}`} style={{ transitionDelay: '0s' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#e10600', padding: '4px 12px', marginBottom: 20 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#fff', animation: 'f1-blink 1.5s ease infinite' }} />
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, fontWeight: 700, letterSpacing: 3, color: '#fff', textTransform: 'uppercase' }}>Live · Sezóna 2026 · R2/10</span>
                  </div>
                </div>
                <div className={`hero-in${heroLoaded ? ' loaded' : ''}`} style={{ transitionDelay: '.1s' }}>
                  <h1 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 'clamp(44px,5vw,80px)', fontWeight: 900, letterSpacing: -1, lineHeight: .9, color: '#fff', marginBottom: 20 }}>
                    MERCEDES<br />
                    <span style={{ color: '#e10600' }}>DOMINUJE</span><br />
                    <span style={{ fontWeight: 300, color: 'rgba(255,255,255,.35)', fontSize: '55%', letterSpacing: 2 }}>ŠAMPIONÁTU F1 2026</span>
                  </h1>
                </div>
                <div className={`hero-in${heroLoaded ? ' loaded' : ''}`} style={{ transitionDelay: '.2s' }}>
                  <p style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 16, fontWeight: 300, lineHeight: 1.7, color: 'rgba(255,255,255,.5)', maxWidth: 440, marginBottom: 36 }}>
                    Russell a Antonelli zvítězili v obou závodech. Verstappen šokuje na 8. místě. Sezóna 2026 je naprosto nepředvídatelná.
                  </p>
                </div>
                <div className={`hero-in${heroLoaded ? ' loaded' : ''}`} style={{ transitionDelay: '.3s', display: 'flex', gap: 12 }}>
                  <button onClick={() => setTab('standings')} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', background: '#e10600', color: '#fff', border: 'none', transition: 'background .2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#cc0000'}
                    onMouseLeave={e => e.currentTarget.style.background = '#e10600'}
                  >Výsledky →</button>
                  <button onClick={() => setTab('drivers')} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', padding: '13px 28px', background: 'transparent', color: 'rgba(255,255,255,.65)', border: '1px solid rgba(255,255,255,.2)', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.5)' }}
                    onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,.65)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.2)' }}
                  >Jezdci →</button>
                </div>
              </div>

              {/* Right — Leader card */}
              <div className={`hero-in${heroLoaded ? ' loaded' : ''}`} style={{ transitionDelay: '.4s' }}>
                <div style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderTop: '4px solid #e10600', padding: '32px' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 4, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase', marginBottom: 20 }}>Lídr šampionátu</div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, marginBottom: 28 }}>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 72, fontWeight: 900, color: 'rgba(255,255,255,.06)', lineHeight: 1, flexShrink: 0 }}>01</div>
                    <div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: .5, lineHeight: 1, marginBottom: 6 }}>GEORGE<br />RUSSELL</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, color: '#00D2BE', letterSpacing: 2, fontWeight: 600 }}>MERCEDES · #63 · 🇬🇧</div>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,.06)' }}>
                    {[['51', 'Bodů'], ['2', 'Výher'], ['2', 'Závodů']].map(([v, l]) => (
                      <div key={l} style={{ background: '#15151e', padding: '16px 12px', textAlign: 'center' }}>
                        <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{v}</div>
                        <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* STATS BAR */}
          <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)' }}>
              {[
                { l: 'Odjeté závody', v: '2 / 10', c: '#e10600' },
                { l: 'Lídr — jezdci', v: 'Russell · 51 pts', c: '#15151e' },
                { l: 'Lídr — týmy', v: 'Mercedes · 98 pts', c: '#15151e' },
                { l: 'Příští závod', v: 'Japonsko · 6. 4.', c: '#15151e' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '18px 20px', borderRight: i < 3 ? '1px solid #e8e8e8' : 'none' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>{s.l}</div>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 18, fontWeight: 700, color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RESULTS + STANDINGS MINI */}
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '60px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>

            {/* Latest results */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, color: '#15151e', textTransform: 'uppercase' }}>Poslední výsledky</h2>
                <button onClick={() => setTab('calendar')} style={{ background: 'none', border: 'none', fontFamily: "'Titillium Web',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#e10600', textTransform: 'uppercase', textDecoration: 'underline' }}>Vše →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {RACES.filter(r => r.done).map(r => (
                  <div key={r.r} className="f1-rev" style={{ background: '#f9f9f9', borderLeft: '4px solid #e10600', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
                    <span style={{ fontSize: 32 }}>{r.flag}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>R{r.r} · {r.date}</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 700, color: '#15151e', letterSpacing: .5 }}>{r.name} Grand Prix</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: '#999', marginTop: 2 }}>{r.circuit} · {r.laps} kol</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 2, color: '#999', textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>Vítěz</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 18, fontWeight: 700, color: '#15151e' }}>{r.winner}</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: '#00D2BE', fontWeight: 600 }}>{r.wTeam}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Constructors mini */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 3, color: '#15151e', textTransform: 'uppercase' }}>Konstruktéři</h2>
                <button onClick={() => setTab('standings')} style={{ background: 'none', border: 'none', fontFamily: "'Titillium Web',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#e10600', textTransform: 'uppercase', textDecoration: 'underline' }}>Vše →</button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {TEAMS.slice(0, 6).map((t, i) => (
                  <div key={t.name} className="f1-rev f1-row" style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', background: '#f9f9f9', transition: 'background .15s' }}>
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, fontWeight: 700, color: '#ccc', minWidth: 22 }}>{t.pos}</span>
                    <div style={{ width: 4, height: 20, background: t.color, borderRadius: 1, flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 15, fontWeight: 700, color: '#15151e', flex: 1 }}>{t.name}</span>
                    <div style={{ width: 120, height: 4, background: '#e8e8e8', position: 'relative' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${(t.pts / 98) * 100}%`, background: t.color }} />
                    </div>
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 18, fontWeight: 900, color: '#15151e', minWidth: 42, textAlign: 'right' }}>{t.pts}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ STANDINGS ═══════════════ */}
      {tab === 'standings' && (
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '56px 40px' }}>
          <div style={{ borderLeft: '4px solid #e10600', paddingLeft: 20, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 4, color: '#e10600', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Šampionát 2026 · Po R2 Šanghaj</div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 40, fontWeight: 900, color: '#15151e', letterSpacing: -1 }}>VÝSLEDKOVÁ LISTINA</h2>
          </div>

          {/* DRIVERS TABLE */}
          <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Jezdci</h3>
          <div style={{ marginBottom: 56, border: '1px solid #e8e8e8' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 140px 90px 70px 70px', gap: 0, padding: '10px 20px', background: '#15151e' }}>
              {['POS', 'JEZDEC', 'TÝM', 'BODY', 'WIN', 'GAP'].map(h => (
                <span key={h} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</span>
              ))}
            </div>
            {DRIVERS.map((d, i) => (
              <div key={d.name} className="f1-rev f1-row" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 140px 90px 70px 70px', gap: 0, alignItems: 'center', padding: '14px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', borderLeft: `4px solid ${i < 3 ? d.color : 'transparent'}`, transition: 'background .15s' }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: i === 0 ? '#e10600' : i < 3 ? '#15151e' : '#ccc' }}>{d.pos}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 20 }}>{d.flag}</span>
                  <div>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 15, fontWeight: 700, color: '#15151e', letterSpacing: .5 }}>{d.name}</div>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, color: '#999', letterSpacing: 1 }}>#{d.num}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 3, height: 16, background: d.color, borderRadius: 1, flexShrink: 0 }} />
                  <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, color: '#666', fontWeight: 600 }}>{d.team}</span>
                </div>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: '#15151e' }}>{d.pts}</span>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 16, color: '#15151e', fontWeight: 600 }}>{d.wins}</span>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 13, color: d.gap === '—' ? '#e10600' : '#999', fontWeight: 600 }}>{d.gap}</span>
              </div>
            ))}
          </div>

          {/* TEAMS TABLE */}
          <h3 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, letterSpacing: 4, color: '#999', textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Konstruktéři</h3>
          <div style={{ border: '1px solid #e8e8e8' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '52px 1fr 120px 120px 90px', gap: 0, padding: '10px 20px', background: '#15151e' }}>
              {['POS', 'TÝM', 'ŠASI', 'MOTOR', 'BODY'].map(h => (
                <span key={h} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,.4)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</span>
              ))}
            </div>
            {TEAMS.map((t, i) => (
              <div key={t.name} className="f1-rev f1-row" style={{ display: 'grid', gridTemplateColumns: '52px 1fr 120px 120px 90px', gap: 0, alignItems: 'center', padding: '14px 20px', background: '#fff', borderTop: '1px solid #f0f0f0', borderLeft: `4px solid ${i < 2 ? t.color : 'transparent'}`, transition: 'background .15s' }}>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: i === 0 ? '#e10600' : '#ccc' }}>{t.pos}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 4, height: 22, background: t.color, borderRadius: 1 }} />
                  <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 15, fontWeight: 700, color: '#15151e' }}>{t.name}</span>
                </div>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, color: '#666', fontWeight: 600 }}>{t.chassis}</span>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, color: '#666', fontWeight: 600 }}>{t.engine}</span>
                <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: '#15151e' }}>{t.pts}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ DRIVERS ═══════════════ */}
      {tab === 'drivers' && (
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '56px 40px' }}>
          <div style={{ borderLeft: '4px solid #e10600', paddingLeft: 20, marginBottom: 48 }}>
            <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 4, color: '#e10600', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Sezóna 2026</div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 40, fontWeight: 900, color: '#15151e', letterSpacing: -1 }}>JEZDCI</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 2 }}>
            {DRIVERS.map((d, i) => (
              <div key={d.name} className="f1-rev" style={{ background: '#fff', border: '1px solid #e8e8e8', borderTop: `4px solid ${d.color}`, transition: 'box-shadow .2s, transform .2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,.1)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'translateY(0)' }}
              >
                {/* Card header */}
                <div style={{ padding: '20px 20px 16px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 52, fontWeight: 900, color: '#f0f0f0', lineHeight: 1 }}>{d.pos}</div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 28 }}>{d.flag}</span>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, color: '#999', letterSpacing: 2, marginTop: 2 }}>#{d.num}</div>
                  </div>
                </div>
                <div style={{ padding: '0 20px 16px' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: '#15151e', letterSpacing: .5, lineHeight: 1.1, marginBottom: 4 }}>{d.name}</div>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: d.color, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>{d.team}</div>
                  <p style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 13, lineHeight: 1.6, color: '#666', fontWeight: 300, marginBottom: 16 }}>{d.bio}</p>
                </div>

                {/* Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: '#f0f0f0', margin: '0 0 0' }}>
                  {[['PTS', d.pts], ['WIN', d.wins], ['POD', d.podiums]].map(([l, v]) => (
                    <div key={l} style={{ background: '#fff', padding: '12px 8px', textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 8, letterSpacing: 2, color: '#999', textTransform: 'uppercase', fontWeight: 700, marginBottom: 3 }}>{l}</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: l === 'PTS' ? d.color : '#15151e' }}>{v}</div>
                    </div>
                  ))}
                </div>

                {/* Meta */}
                <div style={{ padding: '12px 20px', background: '#f9f9f9', display: 'flex', justifyContent: 'space-between' }}>
                  {[['Věk', d.age], ['Debut', d.debut], ['Národnost', d.nation]].map(([l, v]) => (
                    <div key={l} style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 8, letterSpacing: 1, color: '#bbb', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                      <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, fontWeight: 700, color: '#15151e' }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════ GARAGE ═══════════════ */}
      {tab === 'garage' && (
        <div>
          <div style={{ maxWidth: 1320, margin: '0 auto', padding: '56px 40px 24px' }}>
            <div style={{ borderLeft: '4px solid #e10600', paddingLeft: 20, marginBottom: 32 }}>
              <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 4, color: '#e10600', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Interaktivní · WebGL</div>
              <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 40, fontWeight: 900, color: '#15151e', letterSpacing: -1 }}>3D GARÁŽ</h2>
            </div>
            <p style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, color: '#666', marginBottom: 24, fontWeight: 300 }}>Pohybuj myší pro rotaci vozu · Vyber barvu týmu</p>

            {/* Color selector */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
              {TEAM_COLORS.map(t => (
                <button key={t.n} onClick={() => setCarColor(t.c)} style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', padding: '8px 18px', background: carColor === t.c ? t.c : '#f5f5f5', color: carColor === t.c ? '#fff' : '#666', border: `2px solid ${carColor === t.c ? t.c : '#e8e8e8'}`, transition: 'all .2s' }}>{t.n}</button>
              ))}
            </div>
          </div>

          {/* 3D Viewer */}
          <div style={{ background: '#15151e', position: 'relative', height: 580 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${carColor}, transparent)`, zIndex: 2 }} />
            {threeReady
              ? <Car3D key={carColor} color={carColor} />
              : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, letterSpacing: 4, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase' }}>Načítám 3D engine…</span>
                </div>
            }
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 100, background: 'linear-gradient(to top,rgba(21,21,30,.95),transparent)', pointerEvents: 'none', zIndex: 1 }} />
            <div style={{ position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 2, display: 'flex', gap: 32 }}>
              {[['Otočit', 'Pohyb myší'], ['Přiblížit', 'Kolečko'], ['Barva', 'Tlačítka výše']].map(([l, v]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 8, letterSpacing: 2, color: 'rgba(255,255,255,.3)', textTransform: 'uppercase', marginBottom: 2 }}>{l}</div>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: 'rgba(255,255,255,.5)', fontWeight: 600 }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Specs strip */}
          <div style={{ background: '#f5f5f5', borderBottom: '1px solid #e8e8e8' }}>
            <div style={{ maxWidth: 1320, margin: '0 auto', padding: '0 40px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)' }}>
              {[['Motor', '1.6L V6 Turbo Hybrid'], ['Výkon', '1000+ koní'], ['Hmotnost', '798 kg min.'], ['Max RPM', '15 000'], ['0–100 km/h', '~2.4 s']].map(([l, v], i) => (
                <div key={l} style={{ padding: '18px 16px', borderRight: i < 4 ? '1px solid #e8e8e8' : 'none' }}>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, letterSpacing: 2, color: '#999', textTransform: 'uppercase', fontWeight: 600, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 16, fontWeight: 700, color: '#15151e' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════ CALENDAR ═══════════════ */}
      {tab === 'calendar' && (
        <div style={{ maxWidth: 1320, margin: '0 auto', padding: '56px 40px' }}>
          <div style={{ borderLeft: '4px solid #e10600', paddingLeft: 20, marginBottom: 32 }}>
            <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 4, color: '#e10600', textTransform: 'uppercase', fontWeight: 700, marginBottom: 4 }}>Sezóna 2026</div>
            <h2 style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 40, fontWeight: 900, color: '#15151e', letterSpacing: -1 }}>KALENDÁŘ</h2>
          </div>

          {/* Progress */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 40 }}>
            <div style={{ flex: 1, maxWidth: 500, height: 4, background: '#e8e8e8' }}>
              <div style={{ height: '100%', width: '20%', background: '#e10600', transition: 'width 1s' }} />
            </div>
            <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#999', textTransform: 'uppercase' }}>2 / 10 závodů</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(340px,1fr))', gap: 2 }}>
            {RACES.map(r => (
              <div key={r.r} className="f1-rev" style={{ background: r.next ? '#fff9f9' : '#fff', border: `1px solid ${r.next ? '#ffd0d0' : '#e8e8e8'}`, borderLeft: `5px solid ${r.done ? '#15151e' : r.next ? '#e10600' : '#e8e8e8'}`, padding: '22px 24px', transition: 'box-shadow .2s' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.08)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ fontSize: 32 }}>{r.flag}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, letterSpacing: 3, color: '#999', textTransform: 'uppercase', fontWeight: 700 }}>Round {r.r}</div>
                    <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, fontWeight: 700, color: '#15151e' }}>{r.date}</div>
                  </div>
                </div>
                <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 20, fontWeight: 900, color: r.done ? '#999' : '#15151e', letterSpacing: .5, marginBottom: 4 }}>{r.name} Grand Prix</div>
                {r.circuit && <div style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: '#bbb', marginBottom: r.done || r.next ? 12 : 0 }}>{r.circuit}</div>}
                {r.done && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, color: '#999' }}>🏆</span>
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 14, fontWeight: 700, color: '#15151e' }}>{r.winner}</span>
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, color: '#00D2BE', fontWeight: 600 }}>{r.wTeam}</span>
                  </div>
                )}
                {r.next && (
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#e10600', padding: '4px 10px' }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#fff', animation: 'f1-blink 1.5s ease infinite' }} />
                    <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: 2, color: '#fff', textTransform: 'uppercase' }}>Příští závod</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ marginTop: 80, background: '#15151e', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#e10600', padding: '3px 8px' }}>
            <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 12, fontWeight: 900, color: '#fff' }}>F1</span>
          </div>
          <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'rgba(255,255,255,.35)', textTransform: 'uppercase' }}>Formula One Archiv 2026</span>
        </div>
        <span style={{ fontFamily: "'Titillium Web',sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,.2)', textTransform: 'uppercase' }}>bador108 · Data po R2 Šanghaj</span>
      </footer>
    </>
  )
}
