'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Eye,
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { Watch, WatchImage } from '@/lib/types';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function AdminEditWatchPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    sku: '',
    price: '',
    discountPrice: '',
    stockCount: '1',
    isAvailable: true,
    category: 'Luxury',
    movement: 'Automatic',
    caseDiameter: '',
    dialColor: '',
    strapMaterial: '',
    waterResistance: '',
    description: '',
    features: '',
    isFeatured: false,
  });

  const [images, setImages] = useState<WatchImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    async function loadWatch() {
      try {
        setLoading(true);
        const res = await fetch(`/api/watches/${id}`);
        if (res.ok) {
          const data = await res.json();
          const w: Watch = data.watch;
          setFormData({
            title: w.title || '',
            brand: w.brand || '',
            model: w.model || '',
            sku: w.sku || '',
            price: String(w.price || ''),
            discountPrice: w.discountPrice ? String(w.discountPrice) : '',
            stockCount: String(w.stockCount ?? 1),
            isAvailable: w.isAvailable ?? true,
            category: w.category || 'Luxury',
            movement: w.movement || 'Automatic',
            caseDiameter: w.caseDiameter || '',
            dialColor: w.dialColor || '',
            strapMaterial: w.strapMaterial || '',
            waterResistance: w.waterResistance || '',
            description: w.description || '',
            features: Array.isArray(w.features) ? w.features.join('\n') : '',
            isFeatured: w.isFeatured || false,
          });
          setImages(w.images || []);
        }
      } catch (err) {
        console.error('Failed to load watch:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadWatch();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!formData.title.trim() || !formData.brand.trim() || !formData.price) {
      setErrorMessage('Title, Brand, and Price are required.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch(`/api/watches/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to update watch.');
        return;
      }

      setSuccessMessage('Watch details and stock updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err: any) {
      setErrorMessage('Network error updating watch.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to permanently delete this watch?')) return;
    try {
      const res = await fetch(`/api/watches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/stock');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#E5C365' }}>Loading timepiece information...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <Link
            href="/admin/stock"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              fontSize: '0.85rem',
              textDecoration: 'none',
              marginBottom: '12px',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to Stock Inventory</span>
          </Link>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Edit Timepiece & Images
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Modify stock, prices, specifications, and images from Google URLs or device storage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            href={`/watch/${id}`}
            target="_blank"
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.85rem' }}
          >
            <Eye size={16} />
            <span>Store Preview</span>
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#EF4444',
              padding: '10px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.85rem',
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#6EE7B7',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 1. Multi-Source Stock Image Manager */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            1. Stock Image Management
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '16px' }}>
            Add, replace, or reorder images using Google URLs, Device Gallery / Storage uploads, or Preset Photos.
          </p>

          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* 2. Basic Watch Details */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            2. Basic Information
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Timepiece Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  className="input-luxury"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Reference Model</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">SKU Code</label>
                <input
                  type="text"
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-luxury"
                >
                  <option value="Luxury">Luxury</option>
                  <option value="Diver">Diver</option>
                  <option value="Chronograph">Chronograph</option>
                  <option value="Dress">Dress</option>
                  <option value="Sports">Sports</option>
                  <option value="Classic">Classic</option>
                  <option value="Skeleton">Skeleton</option>
                  <option value="Aviation">Aviation</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Movement</label>
                <input
                  type="text"
                  name="movement"
                  value={formData.movement}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Featured Timepiece</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', height: '44px' }}>
                  <input
                    type="checkbox"
                    name="isFeatured"
                    checked={formData.isFeatured}
                    onChange={handleChange}
                    style={{ width: '18px', height: '18px', accentColor: '#D4AF37' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: '#F8FAFC' }}>Highlight in Hero/Featured</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Pricing & Stock Counts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            3. Pricing & Stock Units
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Regular Price (PKR / Rupees) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Discount Price (Optional)</label>
              <input
                type="number"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Units Available *</label>
              <input
                type="number"
                name="stockCount"
                min="0"
                value={formData.stockCount}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>
          </div>
        </div>

        {/* 4. Specifications */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            4. Horological Specifications
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Case Diameter</label>
              <input
                type="text"
                name="caseDiameter"
                value={formData.caseDiameter}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Dial Color & Finish</label>
              <input
                type="text"
                name="dialColor"
                value={formData.dialColor}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Strap / Bracelet Material</label>
              <input
                type="text"
                name="strapMaterial"
                value={formData.strapMaterial}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Water Resistance</label>
              <input
                type="text"
                name="waterResistance"
                value={formData.waterResistance}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label className="form-label">Product Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              className="input-luxury"
            />
          </div>

          <div className="form-group" style={{ marginTop: '16px', marginBottom: 0 }}>
            <label className="form-label">Features & Highlights (One per line)</label>
            <textarea
              name="features"
              rows={4}
              value={formData.features}
              onChange={handleChange}
              className="input-luxury"
            />
          </div>
        </div>

        {/* Submit Bar */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
          <Link href="/admin/stock" className="btn-secondary" style={{ padding: '14px 24px' }}>
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '14px 28px', fontSize: '0.95rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Updating...' : 'Save & Update Timepiece'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
