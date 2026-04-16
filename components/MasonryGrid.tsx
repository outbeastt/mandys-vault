"use client";
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

// Define what a memory looks like based on our Supabase table
type Memory = {
  id: number;
  name: string;
  message: string;
  image_url: string | null;
  created_at: string;
};

export default function MasonryGrid() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemories() {
      try {
        const { data, error } = await supabase
          .from('vault_entries')
          .select('*')
          .order('created_at', { ascending: false }); // Newest first

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

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#FF69B4', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
        Decrypting Memories...
      </div>
    );
  }

  if (memories.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', letterSpacing: '0.1em' }}>
        The vault is currently empty.
      </div>
    );
  }

  return (
    <>
      <style>{`
        .masonry-container {
          columns: 3 300px; /* Creates the staggered columns */
          column-gap: 1.5rem;
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .memory-card {
          break-inside: avoid; /* Prevents cards from splitting across columns */
          margin-bottom: 1.5rem;
          background-color: #0a0a0a;
          border: 1px solid rgba(255,105,180,0.2);
          border-radius: 1rem;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .memory-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px -10px rgba(255,105,180,0.3);
          border-color: rgba(255,105,180,0.5);
        }
        .memory-image {
          width: 100%;
          height: auto;
          display: block;
          border-bottom: 1px solid rgba(255,105,180,0.1);
        }
        .memory-content {
          padding: 1.5rem;
        }
        .memory-message {
          color: #e5e7eb;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 1rem;
          white-space: pre-wrap; /* Honors paragraph breaks */
        }
        .memory-author {
          color: #FF69B4;
          font-size: 0.875rem;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          text-align: right;
        }
        
        @media (max-width: 768px) {
          .masonry-container {
            columns: 1; /* Single column on mobile */
            padding: 1rem;
          }
        }
      `}</style>

      <div className="masonry-container">
        {memories.map((memory, index) => (
          <motion.div
            key={memory.id}
            className="memory-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }} // Staggered fade-in
          >
            {/* Only render the image tag if an image actually exists */}
            {memory.image_url && (
              <img 
                src={memory.image_url} 
                alt={`Memory from ${memory.name}`} 
                className="memory-image"
                loading="lazy"
              />
            )}
            
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