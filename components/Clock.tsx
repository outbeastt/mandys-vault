"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LuxuryClock = () => {
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00' });
  const [isMounted, setIsMounted] = useState(false);
  
  // 1. useRouter MUST be up here at the top level!
  const router = useRouter(); 

  useEffect(() => {
    setIsMounted(true);
    
    // For testing right now, this is set to 15 seconds from when the page loads.
    // Change this back to '2026-04-25T00:00:00' when you are done testing!
   const targetDate = new Date('2026-04-25T00:00:00').getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      // 2. We use 'distance' here, and router.push goes INSIDE the brackets!
      if (distance <= 0) {
        clearInterval(timer);
        router.push('/reveal');
        return;
      }

      setTimeLeft({
        days: String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0'),
        hours: String(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))).padStart(2, '0'),
        minutes: String(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, '0'),
        seconds: String(Math.floor((distance % (1000 * 60)) / 1000)).padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  if (!isMounted) return null;

  // ... (Keep all your existing return ( <div> ... ) code below here!)
  if (!isMounted) return null;

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#050505] text-white w-full p-4 overflow-hidden">
      <div className="relative p-10 md:p-20 rounded-3xl border border-[#FF69B4]/40 bg-black/80 shadow-[0_0_60px_-15px_rgba(255,105,180,0.5)] flex flex-col items-center w-full max-w-6xl">
        
        <h2 className="text-[#FF69B4] text-lg md:text-3xl tracking-[0.5em] uppercase mb-16 font-extrabold text-center" style={{ textShadow: '0 0 20px rgba(255,105,180,0.9)' }}>
          Countdown to Mandy's Day
        </h2>

        {/* Aggressive Grid Layout to prevent squishing */}
        <div className="grid grid-cols-4 gap-4 md:gap-12 text-center w-full max-w-4xl">
          
          {/* Days */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl md:text-9xl font-black text-[#FF69B4] drop-shadow-[0_0_25px_rgba(255,105,180,0.8)] tabular-nums">
              {timeLeft.days}
            </span>
            <span className="text-sm md:text-xl text-gray-400 mt-4 tracking-[0.3em] uppercase font-bold">Days</span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl md:text-9xl font-black text-[#FF69B4] drop-shadow-[0_0_25px_rgba(255,105,180,0.8)] tabular-nums">
              {timeLeft.hours}
            </span>
            <span className="text-sm md:text-xl text-gray-400 mt-4 tracking-[0.3em] uppercase font-bold">Hours</span>
          </div>

          {/* Minutes */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl md:text-9xl font-black text-[#FF69B4] drop-shadow-[0_0_25px_rgba(255,105,180,0.8)] tabular-nums">
              {timeLeft.minutes}
            </span>
            <span className="text-sm md:text-xl text-gray-400 mt-4 tracking-[0.3em] uppercase font-bold">Mins</span>
          </div>

          {/* Seconds */}
          <div className="flex flex-col items-center justify-center">
            <span className="text-6xl md:text-9xl font-black text-[#FF69B4] drop-shadow-[0_0_25px_rgba(255,105,180,0.8)] tabular-nums">
              {timeLeft.seconds}
            </span>
            <span className="text-sm md:text-xl text-gray-400 mt-4 tracking-[0.3em] uppercase font-bold">Secs</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LuxuryClock;