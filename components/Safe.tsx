"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MasonryGrid from './MasonryGrid';

export default function Safe() {
  const [code, setCode] = useState([0, 0, 0]);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  // The secret combination: 4 - 2 - 5 
  const SECRET_CODE = [4, 2, 5];

  const handleSpin = (index: number, direction: 'up' | 'down') => {
    if (isUnlocked) return;
    const newCode = [...code];
    if (direction === 'up') {
      newCode[index] = newCode[index] === 9 ? 0 : newCode[index] + 1;
    } else {
      newCode[index] = newCode[index] === 0 ? 9 : newCode[index] - 1;
    }
    setCode(newCode);
  };

  useEffect(() => {
    if (code.every((val, i) => val === SECRET_CODE[i])) {
      setTimeout(() => setIsUnlocked(true), 600);
    }
  }, [code]);

  // When the button is clicked, we completely swap out the UI for the Gallery
  if (showGallery) {
    return (
      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#050505', fontFamily: 'sans-serif' }}>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
          <MasonryGrid />
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .vault-title { font-size: 3.75rem; }
        .dial-container { gap: 2rem; }
        .dial-box { height: 8rem; width: 6rem; }
        .dial-number { font-size: 4.5rem; }
        @media (max-width: 768px) {
          .vault-title { font-size: 2.25rem !important; }
          .dial-container { gap: 1rem !important; }
          .dial-box { height: 6rem !important; width: 4.5rem !important; }
          .dial-number { font-size: 3.5rem !important; }
        }
      `}</style>

      <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#050505', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', fontFamily: 'sans-serif' }}>
        
        {/* The Combination Lock */}
        <motion.div
          animate={isUnlocked ? { scale: 1.2, opacity: 0, pointerEvents: "none" } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem', backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,105,180,0.3)', borderRadius: '1.5rem', boxShadow: '0 0 50px -10px rgba(255,105,180,0.4)', zIndex: 10 }}
        >
          <h2 style={{ color: '#FF69B4', fontSize: '1.25rem', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '2.5rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(255,105,180,0.8)' }}>
            Enter Passcode
          </h2>

          <div className="dial-container" style={{ display: 'flex' }}>
            {code.map((digit, index) => (
              <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#0a0a0a', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(255,105,180,0.2)', boxShadow: 'inset 0 0 20px rgba(0,0,0,1)' }}>
                <button onClick={() => handleSpin(index, 'up')} style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '2.5rem', cursor: 'pointer', paddingBottom: '1rem', outline: 'none' }}>▲</button>
                <div className="dial-box" style={{ overflow: 'hidden', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', borderRadius: '0.5rem', borderTop: '4px solid #111', borderBottom: '4px solid #111', boxShadow: '0 0 15px rgba(255,105,180,0.1)' }}>
                  <AnimatePresence mode="popLayout">
                    <motion.span
                      key={digit}
                      className="dial-number"
                      initial={{ y: 50, opacity: 0, filter: 'blur(4px)' }}
                      animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
                      exit={{ y: -50, opacity: 0, filter: 'blur(4px)' }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      style={{ position: 'absolute', fontWeight: '900', color: 'white', textShadow: '0 0 8px rgba(255,255,255,0.5)' }}
                    >
                      {digit}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <button onClick={() => handleSpin(index, 'down')} style={{ background: 'transparent', border: 'none', color: '#6b7280', fontSize: '2.5rem', cursor: 'pointer', paddingTop: '1rem', outline: 'none' }}>▼</button>
              </div>
            ))}
          </div>
          
          <p style={{ marginTop: '2.5rem', color: '#6b7280', fontSize: '0.875rem', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
            Hint: The Special Day
          </p>
        </motion.div>

        {/* The Unlocked Vault Content */}
        {isUnlocked && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1.5, type: "spring" }}
            style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 0, textAlign: 'center', padding: '0 1rem' }}
          >
            <h1 className="vault-title" style={{ color: '#FF69B4', fontWeight: '900', letterSpacing: '0.1em', marginBottom: '1.5rem', textShadow: '0 0 25px rgba(255,105,180,0.8)' }}>
              VAULT UNLOCKED
            </h1>
            <p style={{ color: '#d1d5db', letterSpacing: '0.2em', marginBottom: '2.5rem' }}>
              Welcome to the inner sanctum.
            </p>
            
            <button 
              onClick={() => setShowGallery(true)}
              style={{ padding: '1rem 2rem', backgroundColor: 'transparent', border: '2px solid #FF69B4', color: '#FF69B4', borderRadius: '9999px', fontWeight: 'bold', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FF69B4'; e.currentTarget.style.color = '#000'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FF69B4'; }}
            >
              Enter Gallery
            </button>
          </motion.div>
        )}
      </div>
    </>
  );
}