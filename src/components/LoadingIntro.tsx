import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function LoadingIntro() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Check session storage or reduced motion
    const alreadyShown = sessionStorage.getItem('dark_designer_intro_done');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (alreadyShown || prefersReducedMotion) {
      setVisible(false);
      return;
    }

    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, 1400);

    const removeTimer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('dark_designer_intro_done', 'true');
    }, 1900);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center p-4 transition-opacity duration-500 pointer-events-none select-none ${
        fading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Glow background */}
      <div className="absolute w-[350px] h-[350px] bg-purple-600/20 rounded-full blur-[100px] animate-pulse"></div>

      <div className="relative z-10 text-center space-y-3">
        {/* Animated Brand Text */}
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-5xl sm:text-7xl font-black font-['Outfit',sans-serif] tracking-wider text-white uppercase drop-shadow-[0_0_25px_rgba(168,85,247,0.8)]">
            DARK
          </h1>
          <Sparkles className="w-8 h-8 text-purple-400 animate-spin-slow" />
        </div>

        <p className="text-xs sm:text-sm font-bold tracking-[0.3em] uppercase text-purple-300/80 font-mono">
          DESIGNER STUDIO
        </p>

        {/* Minimal Progress Line */}
        <div className="w-36 h-0.5 bg-slate-900 mx-auto rounded-full overflow-hidden mt-6">
          <div className="h-full bg-gradient-to-r from-purple-600 via-indigo-500 to-purple-400 animate-intro-bar"></div>
        </div>
      </div>
    </div>
  );
}
