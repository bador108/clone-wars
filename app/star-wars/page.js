'use client'
import { useEffect, useRef, useState } from 'react'

/* ── DATA ── */
const FACTIONS = [
  {
    id: 'republic', label: 'republic',
    icon: '⚔️', name: 'Galaktická Republika',
    motto: '"Pro mír a spravedlnost!"',
    desc: 'Řád Jedi chrání Republiku od tisíců let. Se vznikem Klonových válek dostali generálové novou armádu — miliony klonovaných vojáků z Camino.',
    statLabel: 'Klonů nasazeno', statVal: '3 000 000+',
  },
  {
    id: 'separatist', label: 'separatist',
    icon: '🤖', name: 'Konfederace Nezávislých Systémů',
    motto: '"Svoboda pro všechny!"',
    desc: 'Separatisté ovládají armádu droidů čítající biliony robotů. Graf Dooku a Generál Grievous velí nepřeberným flotilám bitevních lodí.',
    statLabel: 'Droidů nasazeno', statVal: '∞ trilionů',
  },
  {
    id: 'nightsisters', label: 'nightsisters',
    icon: '🌑', name: 'Noční sestry z Dathomir',
    motto: '"Matka Talzin vládne tmou."',
    desc: 'Mystická sekta čarodějnic ovládající Dathomir Force magii. Ani Republika, ani Separatisté — přežití za každou cenu.',
    statLabel: 'Planet ovládáno', statVal: 'Dathomir',
  },
]

const COMMANDERS = [
  { id: 'anakin', side: 'jedi', icon: '⚡', rank: 'Rytíř Jedi / Generál', name: 'Anakin Skywalker', desc: 'Vyvolený. Nejsilnější Force uživatel své doby — a největší hrozba.' },
  { id: 'ahsoka', side: 'jedi', icon: '🌟', rank: 'Padawan / Komander', name: 'Ahsoka Tano', desc: 'Togruta z Shili. Anakinova žákyně bojuje s dvěma světelnými meči.' },
  { id: 'rex',    side: 'republic', icon: '🎖️', rank: 'Kapitán / 501. legie', name: 'Rex CT-7567', desc: 'Nejlepší klonový kapitán v Republice. Oddaný, taktický, neporazitelný.' },
  { id: 'maul',   side: 'sith', icon: '😈', rank: 'Lord Sithů / Darth', name: 'Darth Maul', desc: 'Přeříznutý na Naboo, znovu sestaven pomstou. Vládce Shadow Collective.' },
  { id: 'obi',    side: 'jedi', icon: '🧘', rank: 'Mistr Jedi / Generál', name: 'Obi-Wan Kenobi', desc: 'Člen Jedi Rady. Vytrvalost a moudrost v každé bitvě galaxie.' },
  { id: 'grievous', side: 'separatist', icon: '🤖', rank: 'Vrchní Velitel Armády', name: 'Generál Grievous', desc: 'Kyborg s kolekcí světelných mečů zabitých Jedi. Čtyři ruce, žádná slitost.' },
]

const PROFILES = {
  anakin: {
    avatar: '⚡', name: 'Anakin Skywalker', rank: 'Rytíř Jedi / Generál 501. legie',
    bio: 'Syn otroka ze Tatooine, narozený přímo z Force. Anakin Skywalker je považován za Vyvolenéhoone. Impulsivní a nezměrně mocný, hraje klíčovou roli v každé velké bitvě Klonových válek.',
    stats: [{ l: 'Midi-chloriany', v: '27 000+' }, { l: 'Vyhraných bitev', v: '47' }, { l: 'Forma boje', v: 'Shien V' }, { l: 'Barva meče', v: 'Modrá' }],
  },
  ahsoka: {
    avatar: '🌟', name: 'Ahsoka Tano', rank: 'Padawan / Velitel 332. roty',
    bio: 'Togruta z planety Shili. Přidělena jako padawan Anakinu Skywalkerovi, Ahsoka se rychle stala jednou z nejschopnějších bojovnic Klonových válek.',
    stats: [{ l: 'Věk při vstupu', v: '14 let' }, { l: 'Forma boje', v: 'Djem So' }, { l: 'Barva mečů', v: 'Zelená/Žlutá' }, { l: 'Status', v: 'Nezávislá' }],
  },
  rex: {
    avatar: '🎖️', name: 'Rex CT-7567', rank: 'Kapitán / 501. legie "Torrent"',
    bio: 'Klonový voják vyrobený z DNA Jango Fetta na Kaminu. Rex je nejlepší klonový kapitán Republiky — taktik, bojovník a vůdce.',
    stats: [{ l: 'Klonové číslo', v: 'CT-7567' }, { l: 'Legie', v: '501.' }, { l: 'Bitvy', v: '200+' }, { l: 'Zbraň', v: 'DC-17 Blasters' }],
  },
  maul: {
    avatar: '😈', name: 'Darth Maul', rank: 'Lord Sithů / Vůdce Shadow Collective',
    bio: 'Zabit Obi-Wanem Kenobim na Naboo, přiveden zpět k životu svou matkou Talzin. Posedlý pomstou, Maul buduje vlastní kriminální říši.',
    stats: [{ l: 'Planet původu', v: 'Dathomir' }, { l: 'Forma boje', v: 'Juyo VII' }, { l: 'Shadow Collective', v: 'Aktivní' }, { l: 'Status', v: 'Živý' }],
  },
  obi: {
    avatar: '🧘', name: 'Obi-Wan Kenobi', rank: 'Mistr Jedi / Generál / Člen Rady',
    bio: 'Nejnadanější mistr Síly své generace a nositel formy Soresu III — neproniknutelné obrany. Obi-Wan velí Republicánské flotile a pozemním silám.',
    stats: [{ l: 'Forma boje', v: 'Soresu III' }, { l: 'Barva meče', v: 'Modrá' }, { l: 'Padawani', v: 'Anakin, Ahsoka' }, { l: 'Planeta', v: 'Stewjon' }],
  },
  grievous: {
    avatar: '🤖', name: 'Generál Grievous', rank: 'Vrchní Velitel Konfederace',
    bio: 'Původně válečník z Kalee, přestavěn do kyborgního těla. Grievous je lovcem Jedi — sbírá jejich světelné meče jako trofeje.',
    stats: [{ l: 'Meče v kolekci', v: '12+' }, { l: 'Planety dobyl', v: '38' }, { l: 'Forma boje', v: "Jar'Kai IV" }, { l: 'Slabost', v: 'Obfukátor' }],
  },
}

const PLANETS = [
  { x: .5,  y: .45, name: 'Coruscant',   side: 'republic',    desc: 'Hlavní město Republiky' },
  { x: .15, y: .3,  name: 'Kamino',      side: 'republic',    desc: 'Planeta klonů' },
  { x: .72, y: .25, name: 'Geonosis',    side: 'separatist',  desc: 'Počátek Klonových válek' },
  { x: .82, y: .6,  name: 'Christophsis',side: 'separatist',  desc: 'První velká bitva' },
  { x: .35, y: .7,  name: 'Mandalore',   side: 'neutral',     desc: 'Planeta Mandalorianů' },
  { x: .6,  y: .75, name: 'Ryloth',      side: 'republic',    desc: 'Osvobozena Jedi' },
  { x: .25, y: .55, name: 'Dathomir',    side: 'neutral',     desc: 'Domov Nočních sester' },
  { x: .9,  y: .35, name: 'Utapau',      side: 'separatist',  desc: 'Základna Grievouse' },
  { x: .45, y: .2,  name: 'Umbara',      side: 'separatist',  desc: 'Krvavá bitva klonů' },
  { x: .08, y: .65, name: 'Florrum',     side: 'neutral',     desc: 'Základna pirátů' },
  { x: .65, y: .5,  name: 'Naboo',       side: 'republic',    desc: 'Rodná planeta Padmé' },
  { x: .38, y: .42, name: 'Illum',       side: 'neutral',     desc: 'Planeta Kyber krystalů' },
]
const PLANET_COLORS = { republic: '#4488ff', separatist: '#ff4422', neutral: '#888' }

const CRYSTALS = [
  { value: '#4499ff,#88ccff', label: 'Modrý — Strážce' },
  { value: '#44ff44,#88ff88', label: 'Zelený — Konzular' },
  { value: '#ee1111,#ff5555', label: 'Červený — Sith' },
  { value: '#ff44cc,#ff88ee', label: 'Fialový — Windu' },
  { value: '#ff8800,#ffcc44', label: 'Oranžový — Sentinel' },
  { value: '#ffffff,#ccddff', label: 'Bílý — Ahsoka' },
  { value: '#00eeff,#66ffff', label: 'Žlutý strážce' },
]
const HILTS  = ['Standardní', 'Bojový (Skywalker)', 'Zakřivený (Dooku)', 'Zkrácený (Ahsoka)', 'Dvoruční']
const FORMS  = ['I — Shii-Cho', 'II — Makashi', 'III — Soresu', 'IV — Ataru', 'V — Shien/Djem So', 'VII — Juyo']
const BLADES = [{ value: '280', label: 'Plná — 280' }, { value: '200', label: 'Bojová — 200' }, { value: '140', label: 'Zkrácená — 140' }]

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */
export default function Home() {
  const starsRef   = useRef(null)
  const mapRef     = useRef(null)
  const holoRef    = useRef(null)

  const [holo, setHolo]           = useState(null)
  const [crystal, setCrystal]     = useState(CRYSTALS[0].value)
  const [hilt, setHilt]           = useState(HILTS[0])
  const [form, setForm]           = useState(FORMS[0])
  const [bladeLen, setBladeLen]   = useState('280')
  const [ignited, setIgnited]     = useState(false)
  const [tooltip, setTooltip]     = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  /* ── STARS ── */
  useEffect(() => {
    const canvas = starsRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 220 }, () => ({
      x: Math.random() * 2000, y: Math.random() * 2000,
      r: Math.random() * 1.5 + .2, a: Math.random(), speed: Math.random() * .3 + .1,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.speed * .005; if (s.a > 1) s.a = 0
        ctx.globalAlpha = s.a * .8
        ctx.fillStyle = '#fff'
        ctx.beginPath(); ctx.arc(s.x % canvas.width, s.y % canvas.height, s.r, 0, Math.PI * 2); ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  /* ── HYPERSPACE ── */
  useEffect(() => {
    const container = document.getElementById('hyperspace')
    if (!container) return
    const make = () => {
      const el = document.createElement('div')
      el.className = 'star-line'
      const angle = (Math.random() - .5) * 120
      const cx = 50 + (Math.random() - .5) * 100
      el.style.cssText = `left:${cx}%;bottom:50%;height:${80 + Math.random() * 120}px;transform:rotate(${angle}deg);animation-delay:${Math.random() * 1.8}s;animation-duration:${1.2 + Math.random() * .8}s;`
      container.appendChild(el)
      setTimeout(() => el.remove(), 3000)
    }
    const id = setInterval(make, 120)
    return () => clearInterval(id)
  }, [])

  /* ── CURSOR ── */
  useEffect(() => {
    const cur = document.getElementById('cursor')
    const dot = document.getElementById('cursor-dot')
    if (!cur || !dot) return
    let mx = 0, my = 0, cx = 0, cy = 0, raf
    const onMove = e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
    document.addEventListener('mousemove', onMove)
    const anim = () => {
      cx += (mx - cx) * .12; cy += (my - cy) * .12
      cur.style.left = cx + 'px'; cur.style.top = cy + 'px'
      raf = requestAnimationFrame(anim)
    }
    anim()
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  /* ── GALAXY MAP ── */
  useEffect(() => {
    const canvas = mapRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf

    const draw = () => {
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)
      // mini stars
      ctx.fillStyle = 'rgba(255,255,255,.4)'
      for (let i = 0; i < 120; i++) {
        ctx.beginPath(); ctx.arc((i * 137.5) % w, (i * 97.3) % h, .8, 0, Math.PI * 2); ctx.fill()
      }
      // nebulas
      ;[{ x: .3, y: .4, r: .25, c: '40,80,160' }, { x: .7, y: .6, r: .2, c: '80,20,40' }, { x: .5, y: .25, r: .15, c: '20,60,80' }]
        .forEach(n => {
          const g = ctx.createRadialGradient(n.x * w, n.y * h, 0, n.x * w, n.y * h, n.r * w)
          g.addColorStop(0, `rgba(${n.c},.18)`); g.addColorStop(1, 'transparent')
          ctx.fillStyle = g; ctx.fillRect(0, 0, w, h)
        })
      // republic lines
      ctx.strokeStyle = 'rgba(60,120,220,.12)'; ctx.lineWidth = .5; ctx.setLineDash([4, 8])
      const rep = PLANETS.filter(p => p.side === 'republic')
      for (let i = 0; i < rep.length - 1; i++) {
        ctx.beginPath(); ctx.moveTo(rep[i].x * w, rep[i].y * h); ctx.lineTo(rep[i + 1].x * w, rep[i + 1].y * h); ctx.stroke()
      }
      ctx.setLineDash([])
      // planets
      PLANETS.forEach(p => {
        const px = p.x * w, py = p.y * h, c = PLANET_COLORS[p.side]
        const gc = ctx.createRadialGradient(px, py, 0, px, py, 20)
        gc.addColorStop(0, c.length === 7 ? c + '88' : c + c.slice(1) + '88'); gc.addColorStop(1, 'transparent')
        ctx.fillStyle = gc; ctx.beginPath(); ctx.arc(px, py, 20, 0, Math.PI * 2); ctx.fill()
        ctx.fillStyle = c; ctx.beginPath()
        ctx.arc(px, py, 6 + Math.sin(Date.now() * .001 + p.x * 10) * .5, 0, Math.PI * 2); ctx.fill()
        if (p.name === 'Coruscant' || p.name === 'Mandalore') {
          ctx.strokeStyle = c + '88'; ctx.lineWidth = 1
          ctx.beginPath(); ctx.ellipse(px, py, 12, 4, -.3, 0, Math.PI * 2); ctx.stroke()
        }
        ctx.fillStyle = 'rgba(180,210,255,.7)'
        ctx.font = '11px Rajdhani,sans-serif'
        ctx.fillText(p.name, px + 10, py + 4)
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])

  /* ── MAP HOVER ── */
  const onMapMove = e => {
    const canvas = mapRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const sx = canvas.width / rect.width, sy = canvas.height / rect.height
    const mx = (e.clientX - rect.left) * sx, my = (e.clientY - rect.top) * sy
    const found = PLANETS.find(p => Math.hypot(p.x * canvas.width - mx, p.y * canvas.height - my) < 20)
    setTooltip(found || null)
    if (found) setTooltipPos({ x: e.clientX - canvas.parentElement.getBoundingClientRect().left + 10, y: e.clientY - canvas.parentElement.getBoundingClientRect().top - 50 })
  }

  /* ── SCROLL REVEAL ── */
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') })
    }, { threshold: .1 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  /* ── SABER ── */
  const [c1, c2] = crystal.split(',')
  const bladeStyle = ignited ? {
    width: bladeLen + 'px',
    background: `linear-gradient(90deg,${c1},${c2},rgba(255,255,255,.9),${c2})`,
    boxShadow: `0 0 8px ${c1},0 0 20px ${c1}88,0 0 40px ${c1}44`,
  } : { width: '0px' }
  const crystalName = CRYSTALS.find(c => c.value === crystal)?.label.split('—')[0].trim()

  /* ── CLOSE HOLO ON ESC ── */
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') setHolo(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  /* ══════════════════════════ RENDER ══════════════════════════ */
  return (
    <>
      <div id="cursor" />
      <div id="cursor-dot" />
      <canvas id="stars-canvas" ref={starsRef} />

      <div id="app">

        {/* ── HERO ── */}
        <section id="hero">
          <div id="hyperspace" />

          <div id="planet-wrap">
            <div id="ring" />
            <div id="planet" />
          </div>

          <div id="logo-wrap">
            <p className="logo-sub">Galaxie je ve válce</p>
            <h1 id="logo-main">
              STAR WARS
              <span id="logo-wars">CLONE WARS</span>
            </h1>
            <p className="logo-sub2">Interaktivní Archiv</p>
            <div className="hero-divider" />
            <p className="hero-text">
              Tisíce planet. Miliony klonů. Jedi na frontě.<br />
              Temná strana stíhá z každé strany galaxie.
            </p>
            <div className="hero-btns">
              <button className="btn btn-republic" onClick={() => document.getElementById('factions').scrollIntoView({ behavior: 'smooth' })}>Republika</button>
              <button className="btn btn-sep"       onClick={() => document.getElementById('factions').scrollIntoView({ behavior: 'smooth' })}>Separatisté</button>
              <button className="btn btn-neutral"   onClick={() => document.getElementById('commanders').scrollIntoView({ behavior: 'smooth' })}>Velitelé</button>
            </div>
          </div>

          <div id="scroll-ind">
            <div className="scroll-line" />
            <span className="scroll-text">SCROLL</span>
          </div>
        </section>

        {/* ── FACTIONS ── */}
        <section id="factions" className="section">
          <div className="section-line" />
          <h2 className="section-title">Strany konfliktu</h2>
          <p className="section-sub">Vyber svou stranu</p>
          <div id="factions-grid">
            {FACTIONS.map(f => (
              <div key={f.id} className={`faction-card ${f.label} reveal`}>
                <div className="faction-border" />
                <span className="faction-icon">{f.icon}</span>
                <h3 className="faction-name">{f.name}</h3>
                <p className="faction-motto">{f.motto}</p>
                <p className="faction-desc">{f.desc}</p>
                <div className="faction-stat">
                  <span>{f.statLabel}</span>
                  <span className="stat-val">{f.statVal}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMMANDERS ── */}
        <section id="commanders" className="section">
          <div className="section-line" />
          <h2 className="section-title">Velitelé</h2>
          <p className="section-sub">Klikni pro holografický profil</p>
          <div id="commanders-grid">
            {COMMANDERS.map(c => (
              <div
                key={c.id}
                className="cmd-card reveal"
                data-side={c.side}
                onClick={() => setHolo(c.id)}
                onMouseMove={e => {
                  const r = e.currentTarget.getBoundingClientRect()
                  const x = (e.clientX - r.left) / r.width - .5
                  const y = (e.clientY - r.top) / r.height - .5
                  e.currentTarget.style.transform = `perspective(600px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) scale(1.03)`
                }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)' }}
              >
                <div className="cmd-glow" />
                <span className="cmd-side-badge">{c.side.toUpperCase()}</span>
                <div className="cmd-avatar">{c.icon}</div>
                <div className="cmd-info">
                  <p className="cmd-rank">{c.rank}</p>
                  <h3 className="cmd-name">{c.name}</h3>
                  <p className="cmd-desc">{c.desc}</p>
                </div>
                <div className="cmd-saber" />
              </div>
            ))}
          </div>
        </section>

        {/* ── BATTLE MAP ── */}
        <section id="battlemap" className="section">
          <div className="section-line" />
          <h2 className="section-title">Galaktická mapa</h2>
          <p className="section-sub">Přejeď nad planetou</p>
          <div id="galaxy-map">
            <canvas ref={mapRef} id="map-canvas" width={900} height={500} onMouseMove={onMapMove} onMouseLeave={() => setTooltip(null)} />
            <div className="map-legend">
              <div className="legend-item"><div className="legend-dot republic" />Republika</div>
              <div className="legend-item"><div className="legend-dot separatist" />Separatisté</div>
              <div className="legend-item"><div className="legend-dot neutral" />Neutrální</div>
            </div>
            {tooltip && (
              <div className="map-tooltip visible" style={{ left: tooltipPos.x, top: tooltipPos.y }}>
                <strong>{tooltip.name}</strong>
                {tooltip.desc}<br />
                <span style={{ color: PLANET_COLORS[tooltip.side], fontSize: 10, letterSpacing: 2 }}>
                  {tooltip.side === 'republic' ? 'Republika' : tooltip.side === 'separatist' ? 'Separatisté' : 'Neutrální'}
                </span>
              </div>
            )}
          </div>
        </section>

        {/* ── SABER LAB ── */}
        <section id="saber-lab" className="section">
          <div className="section-line" />
          <h2 className="section-title">Laboratoř světelného meče</h2>
          <p className="section-sub">Sestav svůj vlastní</p>
          <div id="saber-builder">
            <div className="saber-controls">
              <div className="ctrl-group">
                <label className="ctrl-label">Barva krystalu</label>
                <select className="saber-select" value={crystal} onChange={e => { setCrystal(e.target.value); setIgnited(false) }}>
                  {CRYSTALS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="ctrl-group">
                <label className="ctrl-label">Styl jílce</label>
                <select className="saber-select" value={hilt} onChange={e => setHilt(e.target.value)}>
                  {HILTS.map(h => <option key={h}>{h}</option>)}
                </select>
              </div>
              <div className="ctrl-group">
                <label className="ctrl-label">Forma boje</label>
                <select className="saber-select" value={form} onChange={e => setForm(e.target.value)}>
                  {FORMS.map(f => <option key={f}>{f}</option>)}
                </select>
              </div>
              <div className="ctrl-group">
                <label className="ctrl-label">Délka čepele</label>
                <select className="saber-select" value={bladeLen} onChange={e => { setBladeLen(e.target.value); setIgnited(false) }}>
                  {BLADES.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
            </div>

            <div id="saber-preview">
              <div id="saber-glow" style={{ background: `radial-gradient(ellipse,${c1}66,transparent)` }} />
              <div id="saber-hilt" />
              <div id="saber-blade" style={bladeStyle} />
            </div>

            <p id="saber-name-out">{crystalName} světelný meč</p>
            <p id="saber-desc-out">{form} · {hilt} jílec</p>
            <button
              id="ignite-btn"
              style={ignited ? { borderColor: c1, color: c1 } : {}}
              onClick={() => setIgnited(v => !v)}
            >
              {ignited ? '🔴 ZHASNOUT' : '⚡ ZAŽEHNOUT'}
            </button>
          </div>
        </section>

        <footer>
          <p className="footer-text">Star Wars: Clone Wars Interaktivní Archiv · 22 BBY – 19 BBY · A long time ago in a galaxy far, far away…</p>
        </footer>
      </div>

      {/* ── HOLO MODAL ── */}
      {holo && (
        <div id="holo-modal" className="open" ref={holoRef} onClick={e => { if (e.target === e.currentTarget) setHolo(null) }}>
          <div id="holo-box">
            <button id="holo-close" onClick={() => setHolo(null)}>✕</button>
            <div id="holo-avatar-big">{PROFILES[holo].avatar}</div>
            <h2 id="holo-name">{PROFILES[holo].name}</h2>
            <p id="holo-rank">{PROFILES[holo].rank}</p>
            <p id="holo-bio">{PROFILES[holo].bio}</p>
            <div id="holo-stats">
              {PROFILES[holo].stats.map(s => (
                <div className="holo-stat" key={s.l}>
                  <div className="holo-stat-label">{s.l}</div>
                  <div className="holo-stat-val">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}