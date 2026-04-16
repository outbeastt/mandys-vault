"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

type Memory = { id: number; name: string; message: string; image_url: string | null; created_at: string; };

export default function MasonryGrid() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const isVideo = (url: string | null): boolean => {
    if (!url) return false;
    const cleanUrl = url.split('?')[0];
    return cleanUrl.match(/\.(mp4|webm|ogg|mov|m4v|avi|3gp)$/i) !== null;
  };

  useEffect(() => {
    async function fetchMemories() {
      try {
        const { data, error } = await supabase.from('vault_entries').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        setMemories(data || []);
      } catch (error) {
        console.error("Error fetching memories:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMemories();
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem 4rem', color: '#FF69B4', letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '1rem', fontWeight: 'bold', textShadow: '0 0 10px rgba(255,105,180,0.5)' }}>Decrypting Memories...</div>;
  if (memories.length === 0) return <div style={{ textAlign: 'center', padding: '10rem 4rem', color: '#6b7280', letterSpacing: '0.1em' }}>The vault is currently empty.</div>;

  return (
    <>
      <style>{`
        .masonry-container { columns: 3 300px; column-gap: 1.5rem; padding: 3rem 2rem; max-width: 1400px; margin: 0 auto; }
        .memory-card { break-inside: avoid; margin-bottom: 1.5rem; background-color: #0d0d0d; border: 1px solid rgba(255,105,180,0.15); border-radius: 1.25rem; overflow: hidden; transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); }
        .memory-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 40px -15px rgba(255,105,180,0.3); border-color: rgba(255,105,180,0.6); }
        .memory-media { width: 100%; height: auto; display: block; border-bottom: 1px solid rgba(255,105,180,0.1); }
        .video-placeholder { width: 100%; height: 200px; display: flex; flex-direction: column; justify-content: center; align-items: center; background-color: #070707; border-bottom: 1px solid rgba(255,105,180,0.1); color: rgba(255,105,180,0.8); }
        .video-icon { font-size: 3rem; margin-bottom: 0.5rem; text-shadow: 0 0 10px rgba(255,105,180,0.5); }
        .video-label { font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase; font-weight: bold; opacity: 0.8; }
        .memory-content { padding: 1.75rem; }
        .memory-message { color: #f3f4f6; font-size: 1rem; line-height: 1.6; margin-bottom: 1.25rem; white-space: pre-wrap; font-weight: 300; }
        .memory-author { color: #FF69B4; font-size: 0.875rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.15em; text-align: right; text-shadow: 0 0 8px rgba(255,105,180,0.4); }
        @media (max-width: 768px) { .masonry-container { columns: 1; padding: 2rem 1rem; } }
      `}</style>

      <div className="masonry-container">
        {memories.map((memory, index) => (
          <motion.div key={memory.id} className="memory-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}>
            {memory.image_url ? (
              isVideo(memory.image_url) ? (
                <div className="video-placeholder">
                  <span className="video-icon">🎬</span>
                  <span className="video-label">Video Message</span>
                </div>
              ) : (
                <img src={memory.image_url} alt={`Memory from ${memory.name}`} className="memory-media" loading="lazy" />
              )
            ) : null}
            <div className="memory-content">
              <p className="memory-message">"{memory.message}"</p>
              <p className="memory-author">— {memory.name}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}