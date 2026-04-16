"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../lib/supabase';

export default function UploadPage() {
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const maxSizeInBytes = 100 * 1024 * 1024; // 100MB in bytes

      if (selectedFile.size > maxSizeInBytes) {
        alert("This file is too large! Please select a photo or video under 100MB.");
        e.target.value = ''; // Clear the input
        setFile(null);
        return;
      }

      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(''); // Clear any previous errors

    try {
      let imageUrl = null;

      // 1. Secure File Upload
      if (file) {
        // Extract extension safely, fallback to 'bin' if missing
        const fileExt = file.name.split('.').pop()?.toLowerCase() || 'bin';
        
        // Strip weird characters from their name to use in the file path
        const safeName = formData.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'guest';
        
        // Create a virtually collision-proof filename
        const uniqueFileName = `${Date.now()}-${safeName}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('vault_images')
          .upload(uniqueFileName, file, {
            cacheControl: '3600',
            upsert: false // Explicitly prevent overwriting
          });

        if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

        // Retrieve the permanent public URL
        const { data: urlData } = supabase.storage
          .from('vault_images')
          .getPublicUrl(uniqueFileName);
        
        imageUrl = urlData.publicUrl;
      }

      // 2. Sanitized Database Insert
      const { error: dbError } = await supabase
        .from('vault_entries')
        .insert([
          { 
            name: formData.name.trim(), 
            message: formData.message.trim(), 
            image_url: imageUrl 
          }
        ]);

      if (dbError) throw new Error(`Database error: ${dbError.message}`);

      // 3. Clean Success State
      setIsSuccess(true);
      setFormData({ name: '', message: '' });
      setFile(null);
      
    } catch (error: any) {
      console.error('Vault Security Error:', error);
      setErrorMessage(error.message || 'The vault encountered an error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .main-wrapper {
          min-height: 100vh;
          width: 100%;
          background-color: #050505;
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3rem 1rem;
          font-family: sans-serif;
          box-sizing: border-box;
          overflow-y: auto;
        }
        .upload-container {
          padding: 3rem 2rem;
          margin: auto 0;
        }
        .upload-title {
          font-size: 2rem;
        }
        .form-spacing {
          gap: 1.5rem;
        }
        @media (max-width: 768px) {
          .main-wrapper {
            padding: 1.5rem 0.5rem;
          }
          .upload-container {
            padding: 2rem 1.25rem !important;
          }
          .upload-title {
            font-size: 1.5rem !important;
          }
          .form-spacing {
            gap: 1rem !important;
          }
        }
      `}</style>

      <div className="main-wrapper">
        
        <motion.div 
          className="upload-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ width: '100%', maxWidth: '32rem', backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '1.5rem', border: '1px solid rgba(255,105,180,0.3)', boxShadow: '0 0 50px -10px rgba(255,105,180,0.2)', boxSizing: 'border-box' }}
        >
          <h1 className="upload-title" style={{ color: '#FF69B4', fontWeight: '900', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '1rem', textTransform: 'uppercase', textShadow: '0 0 15px rgba(255,105,180,0.5)' }}>
            Add to the Vault
          </h1>
          
          <p style={{ color: '#d1d5db', textAlign: 'center', marginBottom: '2.5rem', fontSize: '0.95rem', letterSpacing: '0.05em', lineHeight: '1.6' }}>
            Help us surprise Mandy for her birthday! Drop a favorite photo and a sweet message below. Everything will be securely locked in this digital vault and kept entirely secret until she opens it on April 25th.
          </p>

          <AnimatePresence mode="wait">
            {isSuccess ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{ textAlign: 'center', padding: '2rem 0' }}
              >
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✨</div>
                <h2 style={{ color: '#FF69B4', fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '0.1em' }}>Secured in the Vault!</h2>
                <p style={{ color: '#d1d5db', marginBottom: '2rem' }}>Your memory has been safely locked away until April 25th.</p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  style={{ padding: '0.75rem 2rem', backgroundColor: 'transparent', border: '1px solid #FF69B4', color: '#FF69B4', borderRadius: '9999px', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.8rem' }}
                >
                  Submit Another
                </button>
              </motion.div>
            ) : 
              <motion.form 
                key="form"
                onSubmit={handleSubmit} 
                className="form-spacing"
                style={{ display: 'flex', flexDirection: 'column' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                
                {/* Name Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#d1d5db', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: '100%', padding: '0.875rem', backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '0.75rem', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                  />
                </div>

                {/* Message Input */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#d1d5db', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your Message</label>
                  <textarea 
                    required
                    rows={2}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{ width: '100%', padding: '0.875rem', backgroundColor: '#0a0a0a', border: '1px solid #333', borderRadius: '0.75rem', color: 'white', outline: 'none', fontSize: '1rem', boxSizing: 'border-box', resize: 'vertical' }}
                    onFocus={(e) => e.target.style.borderColor = '#FF69B4'}
                    onBlur={(e) => e.target.style.borderColor = '#333'}
                  />
                </div>

               {/* Custom File Upload (Optional & Allows Video) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ color: '#d1d5db', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Upload a Photo/Video (Optional)</label>
                  <div style={{ position: 'relative', width: '100%', padding: '1.25rem', backgroundColor: '#0a0a0a', border: '1px dashed #555', borderRadius: '0.75rem', textAlign: 'center', cursor: 'pointer', boxSizing: 'border-box', transition: 'all 0.3s' }}>
                    <input 
                      type="file" 
                      accept="image/*,video/*"
                      onChange={handleFileChange}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <span style={{ color: file ? '#FF69B4' : '#9ca3af', fontSize: '0.85rem' }}>
                      {file ? `📎 ${file.name}` : '+ Click to select a file (Optional)'}
                    </span>
                  </div>
                </div>  

                {/* Graceful Error Display */}
                {errorMessage && (
                  <div style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
                    ⚠️ {errorMessage}
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  style={{ marginTop: '0.5rem', padding: '1rem', backgroundColor: isSubmitting ? '#333' : '#FF69B4', color: isSubmitting ? '#888' : '#000', border: 'none', borderRadius: '9999px', fontSize: '0.9rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.3s', boxShadow: isSubmitting ? 'none' : '0 0 20px rgba(255,105,180,0.4)' }}
                >
                  {isSubmitting ? 'Saving...' : "Save for Mandy's Birthday"}
                </button>

              </motion.form>
            }
          </AnimatePresence>

        </motion.div>
      </div>
    </>
  );
}