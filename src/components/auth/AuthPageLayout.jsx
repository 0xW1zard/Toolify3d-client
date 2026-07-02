"use client";

import { useRef } from "react";
import { useGsap } from "@/lib/gsap";
import AuthBackButton from "./AuthBackButton";

export default function AuthPageLayout({
  children,
  footerLeft = "SYSTEM_EST_2023 // VER_4.0.1",
  footerRight = "SECURE_HANDSHAKE_ACTIVE",
  maxWidth = "max-w-[525px]",
}) {
  const mainRef = useRef(null);
  const cardRef = useRef(null);
  const footerRef = useRef(null);

  useGsap(
    (gsap) => {
      gsap.fromTo(
        mainRef.current,
        { backgroundColor: "#0D0D0D" },
        { backgroundColor: "#ffffff", duration: 1, ease: "power2.out", delay: 0.1 }
      );

      gsap.from(cardRef.current, {
        opacity: 0,
        y: 16,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.2,
      });

      gsap.to(footerRef.current?.children, {
        color: "rgba(29,185,84,0.6)",
        duration: 0.6,
        ease: "power2.out",
        delay: 0.6,
      });
    },
    [],
    { scopeRef: mainRef, scrollTrigger: false }
  );

  return (
    <main
      ref={mainRef}
      className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-white text-dark"
    >
      <AuthBackButton />

      <section ref={cardRef} className={`relative z-10 w-full ${maxWidth}`}>
        {children}
      </section>

      <div
        ref={footerRef}
        className="fixed bottom-0 left-0 w-full p-4 flex justify-between items-center z-20 pointer-events-none opacity-50"
      >
        <span className="font-mono text-[10px] text-white uppercase">{footerLeft}</span>
        <div className="h-px bg-white/20 grow mx-8" />
        <span className="font-mono text-[10px] text-white uppercase">{footerRight}</span>
      </div>
    </main>
  );
}
