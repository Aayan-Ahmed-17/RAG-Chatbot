import React, { useState, useRef } from 'react';
import { uploadPdf, removePdf } from '../api/apiClient';

interface SidebarProps {
  uploadedPdfs: string[];
  onUploadSuccess: (filename: string) => void;
  onRemoveSuccess: (filename: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ uploadedPdfs, onUploadSuccess, onRemoveSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState<string | null>(null);
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
      const res = await uploadPdf(file);
      onUploadSuccess(res.filename);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async (filename: string) => {
    try {
      setRemoving(filename);
      await removePdf(filename);
      onRemoveSuccess(filename);
    } catch (err: any) {
      setError(err.message || 'Removal failed');
    } finally {
      setRemoving(null);
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
        onClick={() => !uploading && fileInputRef.current?.click()}
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
            <svg style={{ width: '32px', height: '32px', fill: 'var(--accent-color)', marginBottom: '0.5rem' }} viewBox="0 0 24 24">
               <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
            </svg>
            <p>Upload PDF context</p>
          </>
        )}
      </div>

      {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.85rem' }}>{error}</p>}

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
          Your Documents
        </h3>
        {uploadedPdfs.length === 0 ? (
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>No documents yet</p>
        ) : (
          uploadedPdfs.map(name => (
            <div key={name} className="pdf-item glass" style={{ opacity: removing === name ? 0.5 : 1 }}>
              <span className="pdf-name" title={name}>{name}</span>
              <button 
                className="remove-btn" 
                onClick={() => handleRemove(name)}
                disabled={removing === name}
              >
                <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
