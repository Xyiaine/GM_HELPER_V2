import React, { useRef, useState } from 'react';
import api from '../../utils/api';
import { UploadCloud } from 'lucide-react';

export default function ImageUpload({ campaignId, currentUrl, onUploadSuccess }) {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      // Need to use native fetch or configure api wrapper to not set Content-Type
      // because FormData requires browser to set multipart/form-data boundary
      const res = await fetch(`/api/v1/gm/campaigns/${campaignId}/uploads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });
      
      const data = await res.json();
      if (res.ok) {
        onUploadSuccess(data.url);
      } else {
        console.error('Upload failed:', data.error);
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
      <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Image</label>
      
      {currentUrl && (
        <div style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--color-border)' }}>
          <img src={currentUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input 
          type="file" 
          accept="image/jpeg, image/png, image/webp, image/gif" 
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <button 
          type="button" 
          className="btn-secondary" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <UploadCloud size={16} />
          {isUploading ? 'Uploading...' : (currentUrl ? 'Change Image' : 'Upload Image')}
        </button>
      </div>
    </div>
  );
}
