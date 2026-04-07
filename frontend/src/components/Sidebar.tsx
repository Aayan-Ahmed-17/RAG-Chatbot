import React, { useState, useRef } from 'react';
import { uploadPdf } from '../api/apiClient';

interface SidebarProps {
  onUploadSuccess: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are allowed');
      return;
    }

    try {
      setUploading(true);
      setError(null);
      await uploadPdf(file);
      onUploadSuccess();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="sidebar">
      <div>
        <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>RAG Chatbot</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Minimalist AI Assistant using LangChain & Gemini.
        </p>
      </div>

      <div 
        className={`dropzone ${uploading ? 'active' : ''}`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="application/pdf"
          onChange={handleFileChange}
        />
        {uploading ? (
          <p>Processing PDF...</p>
        ) : (
          <>
            <svg style={{ width: '32px', height: '32px', fill: 'var(--accent-color)', marginBottom: '1rem' }} viewBox="0 0 24 24">
               <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <p>Click or drag to upload PDF context</p>
          </>
        )}
      </div>
      {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</p>}
    </div>
  );
};

export default Sidebar;
