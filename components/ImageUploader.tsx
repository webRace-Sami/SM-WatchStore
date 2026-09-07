'use client';

import React, { useState } from 'react';
import { WatchImage } from '@/lib/types';
import {
  Link as LinkIcon,
  Upload,
  Sparkles,
  Trash2,
  Star,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
} from 'lucide-react';
import { PRESET_WATCH_IMAGES, FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

interface ImageUploaderProps {
  images: WatchImage[];
  onChange: (images: WatchImage[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [activeTab, setActiveTab] = useState<'google' | 'upload' | 'preset'>('google');
  const [googleUrl, setGoogleUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Handle Google / Web Link Addition
  const handleAddGoogleImage = async () => {
    if (!googleUrl.trim()) {
      setErrorMessage('Please paste an image URL.');
      return;
    }

    try {
      setUploading(true);
      setErrorMessage('');

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: googleUrl.trim(),
          source: 'google',
          alt: imageAlt.trim() || 'Watch Photo',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to add image link.');
        return;
      }

      const isFirst = images.length === 0;
      const newImage: WatchImage = {
        url: data.image.url,
        source: 'google',
        alt: data.image.alt,
        isPrimary: isFirst,
      };

      onChange([...images, newImage]);
      setGoogleUrl('');
      setImageAlt('');
    } catch (err: any) {
      setErrorMessage('Failed to add image URL.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Local File / Storage / Gallery Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErrorMessage('');

      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', imageAlt || file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Upload failed.');
        return;
      }

      const isFirst = images.length === 0;
      const newImage: WatchImage = {
        url: data.image.url,
        source: 'upload',
        alt: data.image.alt,
        isPrimary: isFirst,
      };

      onChange([...images, newImage]);
      setImageAlt('');
      e.target.value = '';
    } catch (err) {
      setErrorMessage('Failed to upload file from device storage.');
    } finally {
      setUploading(false);
    }
  };

  // Handle Preset Image Selection
  const handleSelectPreset = (presetUrl: string, name: string) => {
    const isFirst = images.length === 0;
    const newImage: WatchImage = {
      url: presetUrl,
      source: 'preset',
      alt: name,
      isPrimary: isFirst,
    };
    onChange([...images, newImage]);
  };

  // Remove Image
  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.isPrimary)) {
      updated[0].isPrimary = true;
    }
    onChange(updated);
  };

  // Set Primary Image
  const handleSetPrimary = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      isPrimary: i === index,
    }));
    onChange(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Upload Method Selector Tabs */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.4)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('google')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'google' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'google' ? '#080A0F' : '#94A3B8',
            transition: 'all 0.2s',
          }}
        >
          <LinkIcon size={15} />
          <span>Google / Web Link</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'upload' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'upload' ? '#080A0F' : '#94A3B8',
            transition: 'all 0.2s',
          }}
        >
          <Upload size={15} />
          <span>Gallery / Device Storage</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '10px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.84rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: activeTab === 'preset' ? 'var(--gold-gradient)' : 'transparent',
            color: activeTab === 'preset' ? '#080A0F' : '#94A3B8',
            transition: 'all 0.2s',
          }}
        >
          <Sparkles size={15} />
          <span>Preset Library</span>
        </button>
      </div>

      {/* Tab 1: Google / Web Image URL Input */}
      {activeTab === 'google' && (
        <div
          style={{
            background: 'rgba(18, 24, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '220px' }}>
              <input
                type="url"
                placeholder="Paste Google image link or web image URL (e.g. https://...)..."
                value={googleUrl}
                onChange={(e) => {
                  setGoogleUrl(e.target.value);
                  setPreviewError(false);
                }}
                className="input-luxury"
              />
            </div>
            <button
              type="button"
              onClick={handleAddGoogleImage}
              disabled={uploading || !googleUrl.trim()}
              className="btn-gold"
              style={{ padding: '10px 18px', fontSize: '0.88rem' }}
            >
              <Plus size={16} />
              <span>{uploading ? 'Adding...' : 'Add Image'}</span>
            </button>
          </div>

          {/* Live Preview If URL entered */}
          {googleUrl.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#080C14', padding: '10px', borderRadius: '8px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, background: '#000' }}>
                <img
                  src={googleUrl}
                  alt="Live URL Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setPreviewError(true)}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: previewError ? '#EF4444' : '#10B981' }}>
                {previewError ? '⚠️ Image preview failed. URL may be protected, but can still be added.' : '✓ Image preview verified!'}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Gallery / Storage Upload */}
      {activeTab === 'upload' && (
        <div
          style={{
            background: 'rgba(18, 24, 38, 0.6)',
            border: '2px dashed rgba(212, 175, 55, 0.3)',
            borderRadius: '12px',
            padding: '28px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            cursor: 'pointer',
            position: 'relative',
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
              width: '100%',
              height: '100%',
            }}
          />
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(212, 175, 55, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Upload size={24} color="#D4AF37" />
          </div>
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 600 }}>
              {uploading ? 'Processing File...' : 'Choose from Gallery or Storage'}
            </h4>
            <p style={{ color: '#64748B', fontSize: '0.78rem', marginTop: '2px' }}>
              Supports JPG, PNG, WEBP, HEIC from Mobile & Desktop
            </p>
          </div>
        </div>
      )}

      {/* Tab 3: Preset Luxury Photos */}
      {activeTab === 'preset' && (
        <div
          style={{
            background: 'rgba(18, 24, 38, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '12px',
            padding: '16px',
          }}
        >
          <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '12px' }}>
            Click any high-resolution luxury photo below to attach it to this watch:
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
              gap: '10px',
            }}
          >
            {PRESET_WATCH_IMAGES.map((preset) => (
              <div
                key={preset.id}
                onClick={() => handleSelectPreset(preset.url, preset.name)}
                style={{
                  position: 'relative',
                  paddingTop: '100%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  transition: 'all 0.2s',
                }}
                className="preset-thumb"
              >
                <img
                  src={preset.url}
                  alt={preset.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'rgba(0,0,0,0.7)',
                    padding: '4px',
                    fontSize: '0.65rem',
                    color: '#E5C365',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {preset.brand}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error Notice */}
      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.82rem',
            color: '#F87171',
          }}
        >
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Current Watch Images Gallery List */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ marginBottom: 0 }}>
            Attached Images ({images.length})
          </label>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
            Star ★ indicates primary storefront thumbnail
          </span>
        </div>

        {images.length === 0 ? (
          <div
            style={{
              padding: '16px',
              textAlign: 'center',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              color: '#64748B',
              fontSize: '0.84rem',
            }}
          >
            No images added yet. Add a Google URL or upload from storage above.
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
              gap: '12px',
            }}
          >
            {images.map((img, idx) => (
              <div
                key={idx}
                style={{
                  position: 'relative',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  background: '#080C14',
                  border: img.isPrimary
                    ? '2px solid #D4AF37'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: img.isPrimary ? '0 0 12px rgba(212, 175, 55, 0.3)' : 'none',
                }}
              >
                <div style={{ position: 'relative', paddingTop: '100%' }}>
                  <img
                    src={img.url}
                    alt={img.alt || `Watch image ${idx + 1}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                    }}
                  />

                  {/* Primary Badge */}
                  {img.isPrimary && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        background: '#D4AF37',
                        color: '#080A0F',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 6px',
                        borderRadius: '4px',
                      }}
                    >
                      PRIMARY
                    </span>
                  )}

                  {/* Source tag */}
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '4px',
                      left: '4px',
                      background: 'rgba(0,0,0,0.7)',
                      color: '#94A3B8',
                      fontSize: '0.62rem',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {img.source}
                  </span>
                </div>

                {/* Actions bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 8px',
                    background: '#0E131F',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleSetPrimary(idx)}
                    title={img.isPrimary ? 'Primary thumbnail' : 'Set as primary'}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: img.isPrimary ? '#D4AF37' : '#64748B',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <Star size={15} fill={img.isPrimary ? '#D4AF37' : 'none'} />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    title="Remove image"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#EF4444',
                      cursor: 'pointer',
                      padding: '2px',
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .preset-thumb:hover {
          border-color: #d4af37 !important;
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
}
