import React, { useState, useRef } from 'react';
import { useAudio } from '../../context/AudioContext';
import { useToast } from '../../context/ToastContext';
import { apiFetch } from '../../services/api';

export default function UploadModal() {
  const { isUploadModalOpen, setIsUploadModalOpen, loadData } = useAudio();
  const { showToast } = useToast();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  if (!isUploadModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Please provide a track title', 'error');
      return;
    }
    if (!file) {
      showToast('Please choose an audio file', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('music', file);

    setIsSubmitting(true);
    try {
      await apiFetch('/api/music/', {
        method: 'POST',
        body: formData,
      });

      showToast(`Track "${title}" published successfully!`, 'success');
      setTitle('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploadModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      id="modal-upload"
      onClick={(e) => {
        if (e.target.id === 'modal-upload') setIsUploadModalOpen(false);
      }}
    >
      <div className="modal-card modal-cobalt-theme">
        <button className="modal-close" id="btn-close-upload" onClick={() => setIsUploadModalOpen(false)}>
          &times;
        </button>

        <form id="form-upload" className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-header-section">
            <div className="modal-icon-badge icon-cobalt">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
            </div>
            <div>
              <span className="modal-badge-tag tag-cobalt-solid">Master Track Uploader</span>
              <h3 className="modal-title">Release New Audio Track</h3>
              <p className="modal-subtitle">Direct 320kbps master stream to global catalog</p>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="upload-title">Track Title</label>
            <input
              type="text"
              id="upload-title"
              required
              placeholder="e.g. Midnight Reverie (Master FLAC)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="upload-file">Master Audio File</label>
            <div className={`file-dropzone ${file ? 'has-file' : ''}`}>
              <input
                type="file"
                id="upload-file"
                ref={fileInputRef}
                accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac,.aac"
                required
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
              <div className="dropzone-content">
                <div className="dropzone-icon-wrap">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <span className="dropzone-main-text">{file ? file.name : 'Click to choose or drop audio file here'}</span>
                <span className="dropzone-sub">Supports MP3, WAV, AAC, FLAC up to 50MB</span>
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="search-spinner"></span>
                <span>Uploading to Studio Master...</span>
              </>
            ) : (
              'Publish Master Track'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
