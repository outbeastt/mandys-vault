"use client";
import React from 'react';

export default function UploadPage() {
  return (
    <div className="min-h-screen bg-black text-white p-6 font-sans">
      {/* Header - iPhone Style */}
      <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
        <h1 className="text-2xl font-bold tracking-tight">New Memory</h1>
        <button className="text-[#FF69B4] font-semibold text-lg">Send</button>
      </div>

      <div className="space-y-6">
        {/* Recipient Indicator */}
        <div className="flex items-center gap-2 text-gray-400 text-sm border-b border-white/10 pb-4">
          <span>To:</span>
          <span className="bg-white/10 px-3 py-1 rounded-full text-white">Mandy</span>
        </div>

        {/* Message Input */}
        <textarea 
          placeholder="Write a birthday message..."
          className="w-full bg-transparent text-xl outline-none resize-none h-40 placeholder:text-gray-600"
        />

        {/* Media Upload Mockup */}
        <div className="fixed bottom-10 left-0 w-full px-6">
          <div className="flex items-center gap-6 bg-[#1c1c1e] p-4 rounded-3xl border border-white/5 shadow-2xl">
            <button className="flex flex-col items-center gap-1 text-pink-400">
              <div className="w-12 h-12 bg-pink-500/20 rounded-full flex items-center justify-center">
                📷
              </div>
              <span className="text-[10px] uppercase font-bold">Photo</span>
            </button>
            <div className="h-10 w-[1px] bg-white/10" />
            <p className="text-gray-400 text-xs italic">
              Attachments will be revealed to Mandy on her birthday.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}