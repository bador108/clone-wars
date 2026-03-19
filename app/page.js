'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Hub() {
  const canvasRef = useRef(null)
  const router = useRouter()
  const [hovered, setHovered] = useState(null)
  const [curX, setCurX] = useState(0)
  const [curY, setCurY] = useState(0)
  const [cx, setCx] = useState(0)
  const [cy, setCy] = useState(0)

  // Stars
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)
    const stars = Array.from({ length: 300 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.3 + 0.05,
    }))
    let raf
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      stars.forEach(s => {
        s.a += s.speed * 0.004
        if (s.a > 1) s.a = 0
        ctx.globalAlpha = s.a * 0.9
        ctx.fillStyle = '#fff'
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  // Cursor
  useEffect(() => {
    const cur = document.getElementById('hub-cursor')
    const dot = document.getElementById('hub-dot')
    if (!cur || !dot) return
    let mx = 0, my = 0, lcx = 0, lcy = 0, raf
    const onMove = e => { mx = e.clientX; my = e.clientY; dot.style.left = mx + 'px'; dot.style.top = my + 'px' }
    document.addEventListener('mousemove', onMove)
    const anim = () => {
      lcx += (mx - lcx) * 0.1; lcy += (my - lcy) * 0.1
      cur.style.left = lcx + 'px'; cur.style.top = lcy + 'px'
      raf = requestAnimationFrame(anim)
    }
    anim()
    return () => { document.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  const cards = [
    {
      id: 'star-wars',
      title: 'STAR WARS',
      sub: 'Clone Wars',
      desc: 'Interaktivní archiv Klonových válek. Velitelé, planety, světelné meče.',
      href: '/star-wars',
      color: '#4488ff',
      colorDim: 'rgba(40,100,220,0.15)',
      border: 'rgba(68,136,255,0.4)',
      icon: '⚔️',
      tag: 'GALAXIE',
    },
    {
      id: 'f1',
      title: 'FORMULA 1',
      sub: 'Interaktivní archiv',
      desc: '3D modely aut, statistiky jezdců, kalendář závodů a týmové livery.',
      href: '/f1',
      color: '#ff2800',
      colorDim: 'rgba(220,40,0,0.15)',
      border: 'rgba(255,40,0,0.4)',
      icon: '🏎️',
      tag: 'MOTORSPORT',
    },
  ]

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html, body { background:#000; height:100%; overflow:hidden; cursor:none; }
        body::after {
          content:''; position:fixed; inset:0;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,.1) 2px,rgba(0,0,0,.1) 4px);
          pointer-events:none; z-index:9990;
        }
        #hub-cursor {
          position:fixed; width:24px; height:24px;
          border:1.5px solid #fff; border-radius:50%;
          pointer-events:none; z-index:9999;
          transform:translate(-50%,-50%);
          transition:width .2s, height .2s, border-color .3s;
          mix-blend-mode:difference;
        }
        #hub-dot {
          position:fixed; width:4px; height:4px;
          background:#fff; border-radius:50%;
          pointer-events:none; z-index:9999;
          transform:translate(-50%,-50%);
        }
        #hub-cursor.sw { border-color:#4488ff; width:40px; height:40px; }
        #hub-cursor.f1 { border-color:#ff2800; width:40px; height:40px; }
      `}</style>

      <div id="hub-cursor" className={hovered || ''} />
      <div id="hub-dot" />
      <canvas ref={canvasRef} style={{ position:'fixed', inset:0, zIndex:0 }} />

      <div style={{
        position:'relative', zIndex:1,
        minHeight:'100vh', display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'40px 20px', fontFamily:"'DM Sans', sans-serif",
      }}>

        {/* LOGO */}
        <div style={{ textAlign:'center', marginBottom:64 }}>
          <p style={{
            fontFamily:"'Orbitron',sans-serif", fontSize:11, letterSpacing:6,
            color:'rgba(255,255,255,.3)', textTransform:'uppercase', marginBottom:16,
          }}>Interaktivní projekty</p>
          <h1 style={{
            fontFamily:"'Orbitron',sans-serif",
            fontSize:'clamp(32px,6vw,72px)', fontWeight:900,
            letterSpacing:4, color:'#fff', lineHeight:1,
          }}>VÁCLAVŮV<br />
            <span style={{ color:'rgba(255,255,255,.3)', fontWeight:400, fontSize:'clamp(20px,4vw,48px)', letterSpacing:8 }}>HUB</span>
          </h1>
          <div style={{ width:120, height:1, background:'linear-gradient(90deg,transparent,rgba(255,255,255,.3),transparent)', margin:'24px auto 0' }} />
        </div>

        {/* CARDS */}
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',
          gap:2, maxWidth:860, width:'100%',
        }}>
          {cards.map(card => (
            <div
              key={card.id}
              onClick={() => router.push(card.href)}
              onMouseEnter={() => setHovered(card.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position:'relative', padding:'48px 40px',
                background: hovered === card.id ? card.colorDim : '#06080f',
                border:`1px solid ${hovered === card.id ? card.border : 'rgba(255,255,255,.06)'}`,
                cursor:'none', transition:'background .3s, border .3s, transform .3s',
                transform: hovered === card.id ? 'translateY(-4px)' : 'translateY(0)',
                overflow:'hidden',
              }}
            >
              {/* top accent line */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, height:2,
                background:`linear-gradient(90deg,transparent,${card.color},transparent)`,
                opacity: hovered === card.id ? 1 : 0,
                transition:'opacity .3s',
              }} />

              {/* glow */}
              <div style={{
                position:'absolute', top:0, left:0, right:0, bottom:0,
                background:`radial-gradient(ellipse at 50% 0%,${card.colorDim},transparent 70%)`,
                opacity: hovered === card.id ? 1 : 0,
                transition:'opacity .4s',
                pointerEvents:'none',
              }} />

              <span style={{ fontSize:48, display:'block', marginBottom:20 }}>{card.icon}</span>

              <p style={{
                fontFamily:"'Orbitron',sans-serif", fontSize:10,
                letterSpacing:4, color:`${card.color}99`,
                textTransform:'uppercase', marginBottom:8,
              }}>{card.tag}</p>

              <h2 style={{
                fontFamily:"'Orbitron',sans-serif",
                fontSize:'clamp(22px,3vw,36px)', fontWeight:900,
                letterSpacing:2, color:'#fff', marginBottom:4, lineHeight:1,
              }}>{card.title}</h2>

              <p style={{
                fontFamily:"'Orbitron',sans-serif", fontSize:13,
                letterSpacing:3, color:'rgba(255,255,255,.3)',
                marginBottom:24, fontWeight:400,
              }}>{card.sub}</p>

              <p style={{
                fontSize:14, lineHeight:1.8,
                color:'rgba(200,210,255,.5)', marginBottom:32,
              }}>{card.desc}</p>

              <div style={{
                display:'inline-flex', alignItems:'center', gap:12,
                fontFamily:"'Orbitron',sans-serif", fontSize:11,
                letterSpacing:3, color: card.color,
                textTransform:'uppercase',
              }}>
                VSTOUPIT
                <span style={{
                  display:'inline-block',
                  transition:'transform .3s',
                  transform: hovered === card.id ? 'translateX(6px)' : 'translateX(0)',
                }}>→</span>
              </div>

              {/* corner brackets */}
              {['tl','tr','bl','br'].map(pos => (
                <div key={pos} style={{
                  position:'absolute',
                  top: pos.includes('t') ? 12 : 'auto',
                  bottom: pos.includes('b') ? 12 : 'auto',
                  left: pos.includes('l') ? 12 : 'auto',
                  right: pos.includes('r') ? 12 : 'auto',
                  width:14, height:14,
                  borderTop: pos.includes('t') ? `1px solid ${card.color}44` : 'none',
                  borderBottom: pos.includes('b') ? `1px solid ${card.color}44` : 'none',
                  borderLeft: pos.includes('l') ? `1px solid ${card.color}44` : 'none',
                  borderRight: pos.includes('r') ? `1px solid ${card.color}44` : 'none',
                  opacity: hovered === card.id ? 1 : 0,
                  transition:'opacity .3s',
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <p style={{
          marginTop:64, fontFamily:"'Orbitron',sans-serif",
          fontSize:9, letterSpacing:4, color:'rgba(255,255,255,.15)',
          textTransform:'uppercase',
        }}>© 2026 bador108 · Všechna práva vyhrazena</p>
      </div>
    </>
  )
}