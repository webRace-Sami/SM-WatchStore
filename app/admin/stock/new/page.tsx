'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Package,
  ArrowLeft,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import ImageUploader from '@/components/ImageUploader';
import { WatchImage } from '@/lib/types';
import { PRESET_WATCH_IMAGES } from '@/lib/preset-images';

export default function AdminNewWatchPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    brand: 'Rolex',
    model: '',
    sku: '',
    price: '',
    discountPrice: '',
    stockCount: '1',
    isAvailable: true,
    category: 'Luxury',
    movement: 'Automatic',
    caseDiameter: '40 mm',
    dialColor: 'Black Dial',
    strapMaterial: 'Stainless Steel Bracelet',
    waterResistance: '100m Water Resistant',
    description: '',
    features: '',
    isFeatured: false,
  });

  const [images, setImages] = useState<WatchImage[]>([
    {
      url: PRESET_WATCH_IMAGES[0].url,
      source: 'preset',
      alt: 'Rolex Submariner Front',
      isPrimary: true,
    },
  ]);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

    if (!formData.title.trim() || !formData.brand.trim() || !formData.price) {
      setErrorMessage('Title, Brand, and Price are required.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/watches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          images,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to create watch.');
        return;
      }

      router.push('/admin/stock');
    } catch (err: any) {
      setErrorMessage('Network error creating watch.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
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
          Add New Luxury Timepiece
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          Configure watch specs, pricing, stock count, and manage images via Google URLs or Gallery upload.
        </p>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 1. Multi-Source Stock Image Manager */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px' }}>
            1. Stock Image Management
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '16px' }}>
            Add images from Google image search links, direct device gallery/storage upload, or curated preset luxury photos.
          </p>

          <ImageUploader images={images} onChange={setImages} />
        </div>

        {/* 2. Basic Watch Details */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
            2. Basic Information & Horology Brand
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Timepiece Title *</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Rolex Submariner Date 41mm Oystersteel"
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
                  placeholder="e.g. Rolex, Patek Philippe, Omega..."
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
                  placeholder="e.g. 126610LN"
                  value={formData.model}
                  onChange={handleChange}
                  className="input-luxury"
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">SKU Code (Auto-generated if blank)</label>
                <input
                  type="text"
                  name="sku"
                  placeholder="e.g. RLX-SUB-126610LN"
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
                  placeholder="e.g. Automatic Calibre 3235"
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
                placeholder="e.g. 385000"
                value={formData.price}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Discounted / Offer Price (Optional)</label>
              <input
                type="number"
                name="discountPrice"
                placeholder="e.g. 365000"
                value={formData.discountPrice}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Stock Quantity Available *</label>
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

        {/* 4. Detailed Horological Specifications */}
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
                placeholder="e.g. 41 mm"
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
                placeholder="e.g. Obsidian Black with Chromalight Lume"
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
                placeholder="e.g. Oystersteel Solid-Link Bracelet"
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
                placeholder="e.g. 300m / 1,000 ft Waterproof"
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
              placeholder="Detailed horological description..."
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
              placeholder="Cerachrom ceramic bezel&#10;Scratch-resistant sapphire crystal&#10;5-year movement guarantee"
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
            <span>{saving ? 'Saving Timepiece...' : 'Publish Watch to Stock'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
