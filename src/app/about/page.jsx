"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import PageShell from "@/components/layout/PageShell";
import WhatsAppLink from "@/components/ui/WhatsAppLink";
import { useGsap, fadeUpOnScroll, staggerRevealOnScroll } from "@/lib/gsap";

// ── BRAND STORY DATA ──
const storyNodes = [
  {
    id: "chapter-01",
    label: "// CHAPTER_01",
    year: "[YEAR]",
    title: "THE FRUSTRATION",
    body: "Great ideas stuck in people's heads. No way to make them real. That needed to change.",
    visual: "quote",
    quoteText: '"Why can\'t I hold my idea in my hands?"',
  },
  {
    id: "chapter-02",
    label: "// CHAPTER_02",
    year: "[YEAR]",
    title: "FIRST LAYER DOWN",
    body: "The first print came off the bed. PLA+, PETG, TPU — three materials. Every use case covered.",
    visual: "materials",
  },
  {
    id: "chapter-03",
    label: "// CHAPTER_03",
    year: "[YEAR]",
    title: "64 DISTRICTS",
    body: "Started in Dhaka. Now shipping anywhere in Bangladesh. 200+ prints and counting.",
    visual: "stats",
  },
];

// ── FOUNDER JOURNEY DATA ──
const founderJourney = [
  {
    photo: 1,
    label: "// ORIGIN",
    title: "[Shahabor Hossain Rifat]",
    meta: "[Dhaka] · [MAKER] · [2026]",
    body: "A Bangladeshi robotics and cybersecurity enthusiast who loves to 'build and break stuff'. Shahabor founded CirkitBot to empower the next generation of robotics , and Toolify 3D to turn digital concepts into physical reality.",
  },
  {
    photo: 2,
    label: "// THE_SPARK",
    title: "HOW IT STARTED",
    body: "Tired of waiting weeks for custom parts, robotics builder Shahabor teamed up with co-founder Nafizul Islam. Armed with their first printer, they launched Toolify 3D to give local makers the fast, high-quality prototyping they needed.",
    quote: "We started Toolify 3D to bring great designs from screens and compile them into reality.",
  },
  {
    photo: 3,
    label: "// THE_MISSION",
    title: "WHY WE PRINT",
    body: "Bangladesh is full of brilliant creators, but too many ideas stay trapped on screens due to a lack of local prototyping tools. We don’t just print parts—we exist to empower local makers, hackers, and engineers to physically compile their ideas into reality.",
    stats: true,
  },
  {
    photo: 4,
    label: "// TODAY",
    title: "NOW",
    body: "Growing Toolify 3D, expanding our reach, and pushing the boundaries of what’s possible with 3D printing in Bangladesh.",
    cta: true,
  },
];

// ── STATS DATA ──
const statsData = [
  { number: "200+", label: "PRINTS MADE" },
  { number: "64", label: "DISTRICTS" },
  { number: "1–4", label: "DAYS TURNAROUND" },
  { number: "3", label: "MATERIALS" },
];

// ── EQUIPMENT DATA ──
const printers = [
  {
    icon: 'precision_manufacturing',
    label: 'BAMBU LAB // CORE-XY',
    model: 'Bambu P1P Series',
    subtitle: 'SUPER DETAILED PRINTS',
    specs: [
      'High-speed Core-XY kinematics',
      '256x256x256mm build volume',
      'Precision vibration compensation',
    ],
    bestFor: 'DETAILED & COMPLEX PARTS',
  },
  {
    icon: 'settings_suggest',
    label: 'CREALITY // CUSTOM MODDED',
    model: 'Ender 3 S1 Pro',
    subtitle: 'INDUSTRIAL STRENGTH PARTS',
    specs: [
      'All-metal direct drive extruder',
      '300°C high-temp capability',
      'CR-Touch auto leveling',
    ],
    bestFor: 'FUNCTIONAL & THERMAL RESISTANCE',
  },
];

const founderImages = [
  { id: 1, image: "https://images.unsplash.com/photo-1618088129969-bcb0c051985e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Founder 1" },
  { id: 2, image: "https://images.unsplash.com/photo-1756699272353-8e57fb998f3b?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Founder 2" },
  { id: 3, image: "https://images.unsplash.com/photo-1756699276817-584aa723cbc4?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Founder 3" },
  { id: 4, image: "https://images.unsplash.com/photo-1659128103048-e41477d734a5?q=80&w=697&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", alt: "Founder 4" },
];

export default function AboutPage() {
  const [activePhoto, setActivePhoto] = useState(1);
  const storyNodeRefs = useRef([]);
  const storyDotRefs = useRef([]);
  const storyImageRef = useRef(null);

  useGsap((gsap, ScrollTrigger) => {
    gsap.from(".hero-line", {
      clipPath: "inset(0 0 100% 0)",
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
      delay: 0.2,
    });

    storyNodeRefs.current.forEach((nodeRef, i) => {
      if (!nodeRef) return;

      gsap.from(nodeRef, {
        scrollTrigger: { trigger: nodeRef, start: "top 80%", once: true },
        y: 20,
        opacity: 0,
        duration: 0.5,
        ease: "power2.out",
      });

      const dotRef = storyDotRefs.current[i];
      if (dotRef) {
        gsap.fromTo(
          dotRef,
          { scale: 1 },
          {
            scrollTrigger: { trigger: nodeRef, start: "top 80%", once: true },
            scale: 1.4,
            duration: 0.2,
            yoyo: true,
            repeat: 1,
            ease: "power1.inOut",
          },
        );
      }
    });

    if (storyImageRef.current) {
      const frame = storyImageRef.current;
      const img = frame.querySelector("img");
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isMobile: "(max-width: 1023px)",
          reduceMotion: "(prefers-reduced-motion: reduce)",
        },
        (context) => {
          const { isDesktop, reduceMotion } = context.conditions;
          if (reduceMotion) return;

          gsap.fromTo(
            frame,
            {
              clipPath: "inset(10% 10% 10% 10% round 12px)",
              opacity: 0,
              x: isDesktop ? 48 : 0,
              y: isDesktop ? 0 : 36,
            },
            {
              clipPath: "inset(0% 0% 0% 0% round 12px)",
              opacity: 1,
              x: 0,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: frame,
                start: "top 85%",
                once: true,
              },
            },
          );

          if (img) {
            gsap.fromTo(
              img,
              { scale: 1.18 },
              {
                scale: 1,
                duration: 1.4,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: frame,
                  start: "top 85%",
                  once: true,
                },
              },
            );
          }
        },
      );
    }

    // Sticky founder photo swap — desktop/tablet side-by-side layout only
    const founderMm = gsap.matchMedia();
    founderMm.add("(min-width: 768px)", () => {
      const nodes = gsap.utils.toArray(".founder-node");
      nodes.forEach((node) => {
        const photo = parseInt(node.dataset.photo, 10);
        if (!photo) return;

        ScrollTrigger.create({
          trigger: node,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActivePhoto(photo),
          onEnterBack: () => setActivePhoto(photo),
        });
      });
    });

    fadeUpOnScroll(gsap, '.reveal-text', { y: 20 });
    staggerRevealOnScroll(gsap, '.reveal-card', { step: 0.1, y: 24, duration: 0.7 });
  }, []);

  return (
    <PageShell>
      {/* ═══════════════════════════════════════════
          HERO + MISSION (single bg image)
          ═══════════════════════════════════════════ */}
      <section
        id="hero"
        className="relative min-h-[80vh] md:min-h-[95vh] flex flex-col overflow-hidden bg-[#0D0D0D] px-margin-page pt-20"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat sm:bg-center"
          style={{ backgroundImage: "url(/media/gal/aboutHero.JPG)", backgroundSize: "cover" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[#0D0D0D]/65"
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-container-max mx-auto w-full flex flex-1 flex-col min-h-0">
          <div className="flex flex-1 flex-col justify-end pb-10 md:pb-16 min-h-0">
            <div className="flex justify-between items-end pb-16 md:pb-25 flex-col md:flex-row gap-8">
              <div>
                <span
                  className="font-mono text-xs text-[#1DB954] uppercase"
                  style={{ letterSpacing: "0.15em" }}
                >
                  {"// ABOUT_US"}
                </span>

                <h1 className="font-display font-extrabold text-[48px] md:text-[64px] text-white leading-none tracking-tight mt-4">
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

              <div className="hidden md:flex flex-col items-end gap-1">
                <span className="font-mono text-xs text-white/50 text-right">
                  EST. [2026]
                </span>
                <span className="font-mono text-xs text-white/50 text-right">
                  DHAKA, BANGLADESH
                </span>
                <span className="font-mono text-xs text-white/50 text-right">
                  3D PRINTING
                </span>
                <span className="font-mono text-xs text-white/50 text-right">
                  PLA+ · PETG · TPU
                </span>
                <div className="w-16 h-px bg-white/20 mt-3 ml-auto" />
              </div>
            </div>
          </div>

          <div
            id="mission"
            className="border-t border-white/10 py-8 md:py-14 text-center shrink-0"
          >
            <p className="font-display font-extrabold text-3xl md:text-4xl text-white leading-tight max-w-3xl mx-auto">
              Anyone with an idea deserves the tools
              <br />
              that make it <span className="text-[#1DB954]">real.</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 3 — BRAND STORY TIMELINE
          ═══════════════════════════════════════════ */}
      <section id="brand-story" className="bg-white py-12 md:py-20 px-margin-page overflow-hidden">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <span
            className="font-mono text-xs text-[#1DB954] uppercase"
            style={{ letterSpacing: "0.15em" }}
          >
            {"// OUR.STORY"}
          </span>
          <h2 className="font-display font-bold text-[28px] md:text-[32px] text-[#0D0D0D] mt-2">
            How It Started
          </h2>
        </div>
        <div className="max-w-container-max mx-auto flex flex-col lg:flex-row gap-8 lg:gap-10 justify-between items-stretch lg:items-center">
          <div className="w-full lg:w-3/5 lg:pr-4">
            {/* Timeline */}
            <div className="relative">
              {/* Left rail */}
              <div className="absolute left-[20px] top-0 bottom-0 w-px bg-[#E5E5E5]"></div>

              {/* Nodes */}
              {storyNodes.map((node, i) => (
                <div
                  key={node.id}
                  ref={(el) => (storyNodeRefs.current[i] = el)}
                  className="flex gap-6 md:gap-10 mb-14 md:mb-20 last:mb-0 relative items-start"
                >
                  {/* Node Marker */}
                  <div className="flex-shrink-0 w-10 flex flex-col items-center">
                    <div
                      ref={(el) => (storyDotRefs.current[i] = el)}
                      className="w-3 h-3 rounded-full bg-[#1DB954] ring-4 ring-[#1DB954]/20 mt-1"
                    ></div>
                    <span className="font-mono text-[10px] text-[#9E9E9E] mt-2 uppercase">
                      {node.year}
                    </span>
                  </div>

                  {/* Node Content */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="font-mono text-[9px] text-[#1DB954] uppercase"
                      style={{ letterSpacing: "0.15em" }}
                    >
                      {node.label}
                    </span>
                    <h3 className="font-display font-bold text-xl md:text-2xl text-[#0D0D0D] mt-1">
                      {node.title}
                    </h3>
                    <p className="font-body text-sm md:text-base text-[#3D3D3D] mt-2 leading-relaxed">
                      {node.body}
                    </p>

                    {/* Visual Anchors */}
                    {node.visual === "quote" && (
                      <div className="bg-[#F5F5F5] border-l-2 border-[#1DB954] pl-4 py-3 rounded-sm mt-4">
                        <p className="font-display font-semibold text-base md:text-lg text-[#0D0D0D] italic">
                          {node.quoteText}
                        </p>
                      </div>
                    )}

                    {node.visual === "materials" && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                        {[
                          {
                            name: "PLA+",
                            border: "border-[#4CAF50]",
                            sub: "RIGID·DETAILED",
                          },
                          {
                            name: "PETG",
                            border: "border-[#2196F3]",
                            sub: "STRONG·DURABLE",
                          },
                          {
                            name: "TPU",
                            border: "border-[#FF9800]",
                            sub: "FLEX·IMPACT",
                          },
                        ].map((mat) => (
                          <div
                            key={mat.name}
                            className={`border-2 rounded px-4 py-2 text-center ${mat.border}`}
                          >
                            <div className="font-display font-bold text-lg">
                              {mat.name}
                            </div>
                            <div className="font-mono text-[9px] text-[#9E9E9E] mt-1">
                              {mat.sub}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {node.visual === "stats" && (
                      <div className="bg-[#0D0D0D] rounded p-4 md:p-5 grid grid-cols-3 gap-2 md:gap-6 items-center mt-4">
                        <div className="text-center">
                          <div className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                            200+
                          </div>
                          <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">
                            PRINTS
                          </div>
                        </div>
                        <div className="text-center border-x border-[#2A2A2A]">
                          <div className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                            64
                          </div>
                          <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">
                            DISTRICTS
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl text-white">
                            1–4
                          </div>
                          <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-1">
                            DAYS
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            ref={storyImageRef}
            className="w-full lg:w-2/5 h-[320px] sm:h-[420px] md:h-[520px] lg:h-[700px] overflow-hidden bg-white rounded-xl will-change-transform"
            style={{ border: "1.5px dashed #0D0D0D" }}
          >
            <Image
              src="/media/gal/about2nd.JPG"
              alt="Story Timeline"
              width={500}
              height={700}
              loading="eager"
              className="w-full h-full rounded-xl object-cover"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEPS 4, 5, 6 — FOUNDER SECTION
          ═══════════════════════════════════════════ */}
      <section id="founder" className="bg-[#F5F5F5] py-12 md:py-20 px-margin-page">
        <div className="max-w-container-max mx-auto">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14">
            <span
              className="font-mono text-xs text-[#1DB954] uppercase"
              style={{ letterSpacing: "0.15em" }}
            >
              {"// FOUNDER"}
            </span>
            <h2 className="font-display font-bold text-[24px] sm:text-[28px] md:text-[32px] text-[#0D0D0D] mt-2 px-2">
              THE PERSON BEHIND THE PRINTS
            </h2>
          </div>

          {/* 2-col layout */}
          <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
            {/* LEFT COL — Sticky Photo Frame */}
            <div className="w-full max-w-[380px] mx-auto md:mx-0 md:w-[380px] flex-shrink-0 md:sticky md:top-24">
              {/* Photo Frame */}
              <div className="border-2 border-[#0D0D0D] rounded p-2 bg-white">
                <div className="relative aspect-[3/4] bg-[#E5E5E5] overflow-hidden rounded-sm">
                  {/* 4 Photo Slots */}
                  {founderImages.map((image) => (
                    <div
                      key={image.id}
                      className={`absolute inset-0 transition-opacity duration-700 ease-in-out bg-[#E5E5E5] flex items-center justify-center ${activePhoto === image.id ? "opacity-100" : "opacity-0"
                        }`}
                      data-index={image.id}
                    >
                      <span className="font-mono text-[10px] text-[#9E9E9E]">{`// FOUNDER_PHOTO_${image.id}`}</span>
                      <Image
                        src={image.image}
                        alt={image.alt}
                        fill
                        priority
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
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
                <div className="font-display font-bold text-xl text-[#0D0D0D]">
                  [Shahabor Hossain Rifat]
                </div>
                <div className="font-mono text-xs text-[#9E9E9E] uppercase tracking-widest mt-1">
                  FOUNDER & MAKER · TOOLIFY 3D
                </div>
              </div>
            </div>

            {/* RIGHT COL — Founder Journey Nodes */}
            <div className="flex-1">
              {founderJourney.map((node) => (
                <div
                  key={node.label}
                  className="founder-node mb-14 md:mb-20 last:mb-0"
                  data-photo={node.photo}
                >
                  <span
                    className="font-mono text-[9px] text-[#1DB954] uppercase"
                    style={{ letterSpacing: "0.15em" }}
                  >
                    {node.label}
                  </span>
                  <h3 className="font-display font-bold text-xl md:text-2xl text-[#0D0D0D] mt-1">
                    {node.title}
                  </h3>

                  {node.meta && (
                    <div className="font-mono text-[10px] text-[#9E9E9E] uppercase tracking-wider mt-1">
                      {node.meta}
                    </div>
                  )}

                  <p className="font-body text-sm md:text-base text-[#3D3D3D] mt-3 leading-relaxed">
                    {node.body}
                  </p>

                  {/* Optional: Quote */}
                  {node.quote && (
                    <div className="bg-white border border-[#E5E5E5] rounded p-4 mt-4">
                      <p className="font-display font-semibold text-base text-[#0D0D0D] italic">
                        {node.quote}
                      </p>
                    </div>
                  )}

                  {/* Optional: Stats */}
                  {node.stats && (
                    <div className="flex gap-4 mt-4 items-center">
                      <div>
                        <div className="font-display font-bold text-2xl text-[#0D0D0D]">
                          200+
                        </div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-0.5">
                          PRINTS MADE
                        </div>
                      </div>
                      <span className="text-[#E5E5E5] text-xl">|</span>
                      <div>
                        <div className="font-display font-bold text-2xl text-[#0D0D0D]">
                          64
                        </div>
                        <div className="font-mono text-[9px] text-[#9E9E9E] uppercase mt-0.5">
                          DISTRICTS
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Optional: CTA Buttons */}
                  {node.cta && (
                    <div className="flex flex-col sm:flex-row gap-3 mt-5">
                      <a
                        href="/products"
                        className="bg-[#1DB954] text-[#0D0D0D] font-body font-semibold text-xs px-4 py-2 rounded-sm hover:bg-[#15883C] transition-colors text-center"
                      >
                        See Our Products
                      </a>
                      <WhatsAppLink
                        className="border border-[#0D0D0D] text-[#0D0D0D] font-body font-semibold text-xs px-4 py-2 rounded-sm hover:bg-[#0D0D0D] hover:text-white transition-colors text-center"
                      >
                        Message Founder ↗
                      </WhatsAppLink>
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
      <section id="stats" className="bg-[#0D0D0D] py-12 md:py-16 px-margin-page">
        <div className="max-w-container-max mx-auto">
          <div className="text-center">
            <span
              className="font-mono text-xs text-[#1DB954] uppercase"
              style={{ letterSpacing: "0.15em" }}
            >
              {"// BY_THE_NUMBERS"}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-8 md:mt-10">
            {statsData.map((stat) => (
              <div
                key={stat.label}
                className="border border-[#1A1A1A] rounded p-4 sm:p-6 md:p-8 text-center hover:border-[#1DB954] transition-all duration-200 cursor-default"
              >
                <div className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white">
                  {stat.number}
                </div>
                <div className="font-mono text-[9px] sm:text-[10px] text-[#9E9E9E] uppercase tracking-widest mt-2">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STEP 7 — EQUIPMENT
          ═══════════════════════════════════════════ */}
      <section id="equipment" className="bg-white py-section-padding-v px-margin-page">
        <div className="max-w-container-max mx-auto">
          <div className="mb-stack-lg">
            <span className="font-mono text-sm text-primary uppercase tracking-widest mb-stack-md block">
              {'// OUR.EQUIPMENT'}
            </span>
            <h2 className="reveal-text font-display font-bold text-[28px] md:text-[32px] text-on-background">
              What We Print With
            </h2>
            <p className="reveal-text font-body text-base text-[#9E9E9E]">
              Professional 3D printers for precise, reliable output every time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            {printers.map((printer) => (
              <div
                key={printer.model}
                className="reveal-card border border-[#E5E5E5] p-stack-lg transition-all duration-300 hover:border-primary-container group"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className="material-symbols-outlined text-primary scale-125">{printer.icon}</span>
                  <span className="font-mono text-xs text-[#9E9E9E] uppercase">{printer.label}</span>
                </div>

                <h3 className="font-display font-semibold text-2xl mb-1">{printer.model}</h3>
                <p className="font-mono text-xs text-primary-container uppercase tracking-widest mb-6">
                  {printer.subtitle}
                </p>

                <ul className="space-y-2 mb-8 font-body text-sm text-[#3D3D3D]">
                  {printer.specs.map((spec) => (
                    <li key={spec} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-primary" />
                      {spec}
                    </li>
                  ))}
                </ul>

                <div className="pt-4 border-t border-[#E5E5E5] group-hover:border-primary-container/30">
                  <span className="font-mono text-xs text-[#9E9E9E] uppercase">
                    {'BEST FOR // '}{printer.bestFor}
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
      <section id="cta" className="bg-[#0D0D0D] py-12 md:py-16 px-margin-page">
        <div className="max-w-container-max mx-auto">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-[#2A2A2A]">
            {/* LEFT */}
            <div className="text-center py-8 md:py-10 md:flex-1">
              <span
                className="font-mono text-xs text-[#1DB954] uppercase"
                style={{ letterSpacing: "0.15em" }}
              >
                {"// GET_STARTED"}
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mt-3">
                Have a Project?
              </h3>
              <a
                href="/contact"
                className="inline-block mt-5 bg-[#1DB954] text-[#0D0D0D] font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-[#15883C] transition-colors duration-150"
              >
                Get a Quote
              </a>
            </div>

            {/* RIGHT */}
            <div className="text-center py-8 md:py-10 md:flex-1">
              <span
                className="font-mono text-xs text-[#1DB954] uppercase"
                style={{ letterSpacing: "0.15em" }}
              >
                {"// CONNECT"}
              </span>
              <h3 className="font-display font-bold text-xl md:text-2xl text-white mt-3">
                Questions?
              </h3>
              <WhatsAppLink
                className="inline-block mt-5 border-2 border-white text-white font-body font-semibold text-sm px-6 py-3 rounded-sm hover:bg-white hover:text-[#0D0D0D] transition-colors duration-150"
              >
                Message on WhatsApp ↗
              </WhatsAppLink>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
