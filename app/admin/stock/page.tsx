'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  Eye,
  Plus,
  Minus,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { Watch } from '@/lib/types';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function AdminStockPage() {
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchStock = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/watches');
      if (res.ok) {
        const data = await res.json();
        setWatches(data.watches || []);
      }
    } catch (err) {
      console.error('Failed to load stock:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const handleUpdateStockCount = async (watch: Watch, delta: number) => {
    const newCount = Math.max(0, watch.stockCount + delta);
    setUpdatingId(watch.id);

    try {
      const res = await fetch(`/api/watches/${watch.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stockCount: newCount,
          isAvailable: newCount > 0,
        }),
      });

      if (res.ok) {
        setWatches((prev) =>
          prev.map((w) =>
            w.id === watch.id ? { ...w, stockCount: newCount, isAvailable: newCount > 0 } : w
          )
        );
      }
    } catch (err) {
      console.error('Failed to update stock:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteWatch = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}" from inventory?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/watches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setWatches((prev) => prev.filter((w) => w.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete watch:', err);
    }
  };

  const brands = Array.from(new Set(watches.map((w) => w.brand))).filter(Boolean);

  const filteredWatches = watches.filter((w) => {
    const matchesSearch =
      w.title.toLowerCase().includes(search.toLowerCase()) ||
      w.brand.toLowerCase().includes(search.toLowerCase()) ||
      w.sku.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || w.brand === selectedBrand;
    return matchesSearch && matchesBrand;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Inventory Management
          </span>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Watch Stock & Specifications
          </h1>
        </div>

        <Link href="/admin/stock/new" className="btn-gold" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
          <PlusCircle size={16} />
          <span>Add New Timepiece</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search title, brand, SKU..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="input-luxury"
            style={{ fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="All">All Brands ({watches.length})</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stock Table & Mobile Cards */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#E5C365' }}>Loading watch inventory...</p>
        </div>
      ) : filteredWatches.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8' }}>No watches found matching your filter criteria.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredWatches.map((watch) => {
            const img = watch.images?.[0]?.url || FALLBACK_WATCH_IMAGE;
            const price = watch.discountPrice ?? watch.price;
            const isLow = watch.stockCount <= 2;

            return (
              <div
                key={watch.id}
                className="glass-panel"
                style={{
                  padding: '16px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '16px',
                  border: isLow ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255, 255, 255, 0.08)',
                }}
              >
                {/* Watch Photo & Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px', flex: '2' }}>
                  <img
                    src={img}
                    alt={watch.title}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      objectFit: 'cover',
                      background: '#000',
                      border: '1px solid rgba(212, 175, 55, 0.2)',
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                    }}
                  />

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                        {watch.brand}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748B' }}>SKU: {watch.sku}</span>
                      {watch.isFeatured && (
                        <span className="badge badge-gold" style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                          Featured
                        </span>
                      )}
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#F8FAFC', lineHeight: '1.3' }}>
                      {watch.title}
                    </h4>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '0.78rem', color: '#94A3B8' }}>
                      <span>Cat: {watch.category}</span>
                      <span>•</span>
                      <span>{watch.images?.length || 1} Photo(s)</span>
                      <span>•</span>
                      <span style={{ color: '#E5C365', fontWeight: 700 }}>Rs. {price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Stock Counter Controls */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#080C14',
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Stock:</span>

                  <button
                    type="button"
                    onClick={() => handleUpdateStockCount(watch, -1)}
                    disabled={watch.stockCount <= 0 || updatingId === watch.id}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      color: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Minus size={13} />
                  </button>

                  <span
                    style={{
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      minWidth: '24px',
                      textAlign: 'center',
                      color: isLow ? '#EF4444' : '#10B981',
                    }}
                  >
                    {watch.stockCount}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleUpdateStockCount(watch, 1)}
                    disabled={updatingId === watch.id}
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      background: 'rgba(255,255,255,0.08)',
                      border: 'none',
                      color: '#F8FAFC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    <Plus size={13} />
                  </button>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href={`/watch/${watch.id}`}
                    target="_blank"
                    className="btn-secondary"
                    style={{ padding: '8px 12px', borderRadius: '8px' }}
                    title="View Storefront Page"
                  >
                    <Eye size={15} />
                  </Link>

                  <Link
                    href={`/admin/stock/${watch.id}`}
                    className="btn-gold"
                    style={{ padding: '8px 14px', fontSize: '0.82rem', borderRadius: '8px' }}
                  >
                    <Edit2 size={14} />
                    <span>Edit Watch & Images</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleDeleteWatch(watch.id, watch.title)}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#EF4444',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                    }}
                    title="Delete watch from stock"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
