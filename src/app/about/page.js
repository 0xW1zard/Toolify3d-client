'use client'

import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'

// ── BRAND STORY DATA ──
const storyNodes = [
  {
    id: 'chapter-01',
    label: '// CHAPTER_01',
    year: '[YEAR]',
    title: 'THE FRUSTRATION',
    body: 'Great ideas stuck in people\'s heads. No way to make them real. That needed to change.',
    visual: 'quote',
    quoteText: '"Why can\'t I hold my idea in my hands?"'
  },
  {
    id: 'chapter-02',
    label: '// CHAPTER_02',
    year: '[YEAR]',
    title: 'FIRST LAYER DOWN',
    body: 'The first print came off the bed. PLA+, PETG, TPU — three materials. Every use case covered.',
    visual: 'materials'
  },
  {
    id: 'chapter-03',
    label: '// CHAPTER_03',
    year: '[YEAR]',
    title: '64 DISTRICTS',
    body: 'Started in Dhaka. Now shipping anywhere in Bangladesh. 500+ prints and counting.',
    visual: 'stats'
  }
]

// ── FOUNDER JOURNEY DATA ──
const founderJourney = [
  {
    photo: 1,
    label: '// ORIGIN',
    title: '[FOUNDER NAME]',
    meta: '[CITY] · [FIELD] · [YEAR STARTED]',
    body: '[Short founder origin — where they are from, what they studied, what sparked interest in 3D printing. 2–3 lines max.]'
  },
  {
    photo: 2,
    label: '// THE_SPARK',
    title: 'HOW IT STARTED',
    body: '[What moment made the founder start Toolify 3D. The frustration, first printer, first customer. Human and direct.]',
    quote: '[Short founder quote about starting the business]'
  },
  {
    photo: 3,
    label: '// THE_MISSION',
    title: 'WHY WE PRINT',
    body: '[Founder personal mission — what they believe about making and Bangladesh\'s maker community.]',
    stats: true
  },
  {
    photo: 4,
    label: '// TODAY',
    title: 'NOW',
    body: '[What the founder is working on now — growing Toolify 3D, new materials, vision for the future.]',
    cta: true
  }
]

// ── STATS DATA ──
const statsData = [
  { number: '500+', label: 'PRINTS MADE' },
  { number: '64', label: 'DISTRICTS' },
  { number: '1–4', label: 'DAYS TURNAROUND' },
  { number: '3', label: 'MATERIALS' }
]

// ── EQUIPMENT DATA ──
const printers = [
  {
    manufacturer: '[BRAND 1]',
    model: '[MODEL NAME]',
    subtitle: 'SUPER DETAILED PRINTS',
    specs: ['Ultra-fine detail (0.08mm layers)', 'Smooth and stable printing', 'Fully enclosed for best results'],
    bestFor: 'DETAILED & COMPLEX PARTS'
  },
  {
    manufacturer: '[BRAND 2]',
    model: '[MODEL NAME]',
    subtitle: 'FAST & BIG PRINTS',
    specs: ['Super fast printing speed', 'Extra large print size', 'Built for heavy-duty printing'],
    bestFor: 'QUICK TEST MODELS & LARGE PROJECTS'
  }
]

export default function AboutPage() {
  const [activePhoto, setActivePhoto] = useState(1)
  const storyNodeRefs = useRef([])
  const storyDotRefs = useRef([])

  // ── STEP 2: GSAP Hero Animation ──
  useEffect(() => {
    let ctx
    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        // Hero line reveal
        gsap.from('.hero-line', {
          clipPath: 'inset(0 0 100% 0)',
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          delay: 0.2
        })

        // ── STEP 3: Brand Story Timeline Scroll Animations ──
        storyNodeRefs.current.forEach((nodeRef, i) => {
          if (!nodeRef) return

          gsap.from(nodeRef, {
            scrollTrigger: {
              trigger: nodeRef,
              start: 'top 80%',
              once: true
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
          })

          // Dot pulse on enter
          const dotRef = storyDotRefs.current[i]
          if (dotRef) {
            gsap.fromTo(
              dotRef,
              { scale: 1 },
              {
                scrollTrigger: { trigger: nodeRef, start: 'top 80%', once: true },
                scale: 1.4,
                duration: 0.2,
                yoyo: true,
                repeat: 1,
                ease: 'power1.inOut'
              }
            )
          }
        })
      })
    }
    init()

    return () => {
      if (ctx) ctx.revert()
    }
  }, [])

  // ── STEP 6: Photo Swap IntersectionObserver ──
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const nodes = document.querySelectorAll('.founder-node')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const photoIndex = parseInt(entry.target.dataset.photo)
            setActivePhoto(photoIndex)
          }
        })
      },
      {
        threshold: 0.5,
        rootMargin: '-20% 0px -20% 0px'
      }
    )

    nodes.forEach((node) => observer.observe(node))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Navbar />

      {/* ═══════════════════════════════════════════
          STEP 2 — HERO
          ═══════════════════════════════════════════ */}
      <section id="hero" className="bg-[#0D0D0D] min-h-[70vh] flex items-end pb-16 pt-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 w-full">
          <div className="flex justify-between items-end flex-col md:flex-row gap-8">
            {/* LEFT */}
            <div>
              <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
                {'// ABOUT_US'}
              </span>

              <h1 className="font-display font-extrabold text-6xl md:text-8xl text-white leading-none tracking-tight mt-4">
                <div className="overflow-hidden">
                  <div className="hero-line">COMPILING</div>
                </div>
                <div className="overflow-hidden">
                  <div className="hero-line">IDEAS</div>
                </div>
                <div className="overflow-hidden">
                  <div className="hero-line">
                    INTO <span className="text-[#1DB954]">REALITY.</span>
                  </div>
                </div>
              </h1>
            </div>

            {/* RIGHT — hidden on mobile */}
            <div className="hidden md:flex flex-col items-end gap-1">
              <span className="font-mono text-xs text-[#9E9E9E] text-right">EST. [YEAR]</span>
              <span className="font-mono text-xs text-[#9E9E9E] text-right">DHAKA, BANGLADESH</span>
              <span className="font-mono text-xs text-[#9E9E9E] text-right">FDM PRINTING</span>
              <span className="font-mono text-xs text-[#9E9E9E] text-right">PLA+ · PETG · TPU</span>
              <div className="w-16 h-px bg-[#2A2A2A] mt-3 ml-auto"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 2 — MISSION
          ═══════════════════════════════════════════ */}
      <section id="mission" className="bg-[#0D0D0D] border-t border-[#1A1A1A] py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <p className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight">
            Anyone with an idea deserves the tools
            <br />
            that make it <span className="text-[#1DB954]">real.</span>
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 3 — BRAND STORY TIMELINE
          ═══════════════════════════════════════════ */}
      <section id="brand-story" className="bg-white py-20">
        <div className="max-w-[800px] mx-auto px-4 md:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
              {'// OUR.STORY'}
            </span>
            <h2 className="font-display font-bold text-3xl text-[#0D0D0D] mt-2">How It Started</h2>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Left rail */}
            <div className="absolute left-[20px] top-0 bottom-0 w-px bg-[#E5E5E5]"></div>

            {/* Nodes */}
            {storyNodes.map((node, i) => (
              <div
                key={node.id}
                ref={(el) => (storyNodeRefs.current[i] = el)}
                className="flex gap-10 mb-20 last:mb-0 relative items-start"
              >
                {/* Node Marker */}
                <div className="flex-shrink-0 w-10 flex flex-col items-center">
                  <div
                    ref={(el) => (storyDotRefs.current[i] = el)}
                    className="w-3 h-3 rounded-full bg-[#1DB954] ring-4 ring-[#1DB954]/20 mt-1"
                  ></div>
                  <span className="font-mono text-[10px] text-[#9E9E9E] mt-2 uppercase">{node.year}</span>
                </div>

                {/* Node Content */}
                <div className="flex-1">
                  <span className="font-mono text-[9px] text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
                    {node.label}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-[#0D0D0D] mt-1">{node.title}</h3>
                  <p className="font-body text-base text-[#3D3D3D] mt-2 leading-relaxed max-w-md">{node.body}</p>

                  {/* Visual Anchors */}
                  {node.visual === 'quote' && (
                    <div className="bg-[#F5F5F5] border-l-2 border-[#1DB954] pl-4 py-3 rounded-sm mt-4">
                      <p className="font-display font-semibold text-lg text-[#0D0D0D] italic">{node.quoteText}</p>
                    </div>
                  )}

                  {node.visual === 'materials' && (
                    <div className="flex gap-3 mt-4">
                      {[
                        { name: 'PLA+', border: 'border-[#4CAF50]', sub: 'RIGID·DETAILED' },
                        { name: 'PETG', border: 'border-[#2196F3]', sub: 'STRONG·DURABLE' },
                        { name: 'TPU', border: 'border-[#FF9800]', sub: 'FLEX·IMPACT' }
                      ].map((mat) => (
                        <div key={mat.name} className={`border-2 rounded px-4 py-2 text-center flex-1 ${mat.border}`}>
                          <div className="font-display font-bold text-lg">{mat.name}</div>
                          <div className="font-mono text-[9px] text-[#9E9E9E] mt-1">{mat.sub}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {node.visual === 'stats' && (
                    <div className="bg-[#0D0D0D] rounded p-5 flex gap-6 items-center mt-4">
                      <div className="text-center">
                        <div className="font-display font-extrabold text-4xl text-white">500+</div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">PRINTS</div>
                      </div>
                      <div className="w-px h-8 bg-[#2A2A2A]"></div>
                      <div className="text-center">
                        <div className="font-display font-extrabold text-4xl text-white">64</div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">DISTRICTS</div>
                      </div>
                      <div className="w-px h-8 bg-[#2A2A2A]"></div>
                      <div className="text-center">
                        <div className="font-display font-extrabold text-4xl text-white">1–4</div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">DAYS</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEPS 4, 5, 6 — FOUNDER SECTION
          ═══════════════════════════════════════════ */}
      <section id="founder" className="bg-[#F5F5F5] py-20">
        <div className="max-w-[1100px] mx-auto px-4 md:px-8">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
              {'// FOUNDER'}
            </span>
            <h2 className="font-display font-bold text-3xl text-[#0D0D0D] mt-2">THE PERSON BEHIND THE PRINTS</h2>
          </div>

          {/* 2-col layout */}
          <div className="flex flex-col md:flex-row gap-16 items-start">
            {/* LEFT COL — Sticky Photo Frame */}
            <div className="md:w-[380px] flex-shrink-0 md:sticky top-24">
              {/* Photo Frame */}
              <div className="border-2 border-[#0D0D0D] rounded p-2 bg-white">
                <div className="relative aspect-[3/4] bg-[#E5E5E5] overflow-hidden rounded-sm">
                  {/* 4 Photo Slots */}
                  {[1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out bg-[#E5E5E5] flex items-center justify-center ${
                        activePhoto === n ? 'opacity-100' : 'opacity-0'
                      }`}
                      data-index={n}
                    >
                      <span className="font-mono text-[10px] text-[#9E9E9E]">{`// FOUNDER_PHOTO_${n}`}</span>
                    </div>
                  ))}

                  {/* Corner Brackets */}
                  <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#0D0D0D]"></div>
                  <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#0D0D0D]"></div>
                  <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#0D0D0D]"></div>
                  <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#0D0D0D]"></div>
                </div>
              </div>

              {/* Name Plate */}
              <div className="mt-4 text-center">
                <div className="font-display font-bold text-xl text-[#0D0D0D]">[FOUNDER NAME]</div>
                <div className="font-mono text-xs text-[#9E9E9E] uppercase tracking-widest mt-1">
                  FOUNDER & MAKER · TOOLIFY 3D
                </div>
              </div>
            </div>

            {/* RIGHT COL — Founder Journey Nodes */}
            <div className="flex-1">
              {founderJourney.map((node, i) => (
                <div
                  key={node.label}
                  className="founder-node mb-20 last:mb-0"
                  data-photo={node.photo}
                >
                  <span className="font-mono text-[9px] text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
                    {node.label}
                  </span>
                  <h3 className="font-display font-bold text-2xl text-[#0D0D0D] mt-1">{node.title}</h3>

                  {node.meta && (
                    <div className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-wider mt-1">
                      {node.meta}
                    </div>
                  )}

                  <p className="font-body text-base text-[#3D3D3D] mt-3 leading-relaxed max-w-md">{node.body}</p>

                  {/* Optional: Quote */}
                  {node.quote && (
                    <div className="bg-white border border-[#E5E5E5] rounded p-4 mt-4">
                      <p className="font-display font-semibold text-base text-[#0D0D0D] italic">{node.quote}</p>
                    </div>
                  )}

                  {/* Optional: Stats */}
                  {node.stats && (
                    <div className="flex gap-4 mt-4 items-center">
                      <div>
                        <div className="font-display font-bold text-2xl text-[#0D0D0D]">500+</div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-0.5">PRINTS MADE</div>
                      </div>
                      <span className="text-[#E5E5E5] text-xl">|</span>
                      <div>
                        <div className="font-display font-bold text-2xl text-[#0D0D0D]">64</div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-0.5">DISTRICTS</div>
                      </div>
                    </div>
                  )}

                  {/* Optional: CTA Buttons */}
                  {node.cta && (
                    <div className="flex gap-3 mt-5">
                      <a
                        href="/products"
                        className="bg-[#1DB954] text-[#0D0D0D] font-body font-semibold text-xs px-4 py-2 rounded-sm hover:bg-[#15883C] transition-colors"
                      >
                        See Our Products
                      </a>
                      <a
                        href="https://wa.me/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-[#0D0D0D] text-[#0D0D0D] font-body font-semibold text-xs px-4 py-2 rounded-sm hover:bg-[#0D0D0D] hover:text-white transition-colors"
                      >
                        Message Founder ↗
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 7 — STATS
          ═══════════════════════════════════════════ */}
      <section id="stats" className="bg-[#0D0D0D] py-16">
        <div className="max-w-[900px] mx-auto px-4 md:px-8">
          <div className="text-center">
            <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
              {'// BY_THE_NUMBERS'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="border border-[#1A1A1A] rounded p-8 text-center hover:border-[#1DB954] transition-all duration-200 cursor-default"
              >
                <div className="font-display font-extrabold text-5xl text-white">{stat.number}</div>
                <div className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-widest mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 7 — EQUIPMENT
          ═══════════════════════════════════════════ */}
      <section id="equipment" className="bg-white py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
            {'// OUR.EQUIPMENT'}
          </span>
          <h2 className="font-display font-bold text-2xl text-[#0D0D0D] mt-2">PROFESSIONAL EQUIPMENT</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {printers.map((printer) => (
              <div
                key={printer.model + printer.manufacturer}
                className="bg-[#F5F5F5] border border-[#E5E5E5] rounded p-6 hover:border-[#1DB954] transition-all duration-200"
              >
                <div className="font-mono text-[9px] text-[#9E9E9E] uppercase tracking-wider">
                  MANUFACTURER // {printer.manufacturer}
                </div>
                <div className="font-display font-bold text-2xl text-[#0D0D0D] mt-2">{printer.model}</div>
                <div className="font-mono text-[10px] text-[#1DB954] uppercase tracking-wider mt-1">
                  {printer.subtitle}
                </div>

                <div className="mt-4 flex flex-col gap-1">
                  {printer.specs.map((spec, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <span className="text-[#1DB954] text-xs">▸</span>
                      <span className="font-body text-sm text-[#3D3D3D]">{spec}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#E5E5E5] mt-4 pt-4">
                  <span className="font-mono text-[9px] text-[#9E9E9E] uppercase tracking-wider">
                    BEST FOR // {printer.bestFor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 7 — CTA
          ═══════════════════════════════════════════ */}
      <section id="cta" className="bg-[#0D0D0D] py-16">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
            {/* LEFT */}
            <div className="text-center py-10 md:flex-1">
              <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
                {'// GET_STARTED'}
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-3">Have a Project?</h3>
              <a
                href="/contact"
                className="inline-block mt-5 bg-[#1DB954] text-[#0D0D0D] font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-[#15883C] transition-colors duration-150"
              >
                Get a Quote
              </a>
            </div>

            {/* RIGHT */}
            <div className="text-center py-10 md:flex-1">
              <span className="font-mono text-xs text-[#1DB954] uppercase" style={{ letterSpacing: '0.15em' }}>
                {'// CONNECT'}
              </span>
              <h3 className="font-display font-bold text-2xl text-white mt-3">Questions?</h3>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-5 border-2 border-white text-white font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-white hover:text-[#0D0D0D] transition-colors duration-150"
              >
                Message on WhatsApp ↗
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
