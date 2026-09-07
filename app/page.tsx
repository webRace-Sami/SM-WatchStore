'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Watch as WatchIcon,
  Sparkles,
  ShieldCheck,
  Truck,
  CreditCard,
  Search,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { Watch } from '@/lib/types';
import WatchCard from '@/components/WatchCard';
import { useSettings } from '@/context/SettingsContext';

function HomeContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'All';

  const { settings } = useSettings();
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);
  const [facets, setFacets] = useState<{ brands: string[]; categories: string[] }>({
    brands: [],
    categories: [],
  });

  // Filter States
  const [search, setSearch] = useState(initialQuery);
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMovement, setSelectedMovement] = useState('All');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortOption, setSortOption] = useState('newest');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (initialQuery) setSearch(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const fetchWatches = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (selectedBrand !== 'All') params.set('brand', selectedBrand);
      if (selectedCategory !== 'All') params.set('category', selectedCategory);
      if (selectedMovement !== 'All') params.set('movement', selectedMovement);
      if (inStockOnly) params.set('inStock', 'true');
      if (sortOption) params.set('sort', sortOption);

      const res = await fetch(`/api/watches?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setWatches(data.watches || []);
        if (data.facets) setFacets(data.facets);
      }
    } catch (error) {
      console.error('Error fetching watches:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatches();
  }, [search, selectedBrand, selectedCategory, selectedMovement, inStockOnly, sortOption]);

  const categoryOptions = ['All', 'Luxury', 'Diver', 'Chronograph', 'Dress', 'Sports', 'Classic', 'Skeleton'];
  const movementOptions = ['All', 'Automatic', 'Mechanical', 'Quartz'];

  return (
    <div>
      {/* 1. Ultra-Luxury Hero Section */}
      <section
        style={{
          position: 'relative',
          padding: '80px 0 60px',
          background: 'radial-gradient(ellipse at 50% 10%, #151D30 0%, #080A0F 70%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          overflow: 'hidden',
        }}
      >
        {/* Subtle Ambient Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '600px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />

        <div className="container-custom" style={{ position: 'relative', zIndex: 1 }}>
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            {/* Showroom Status Tag */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#E5C365',
                marginBottom: '20px',
              }}
            >
              <Sparkles size={14} color="#D4AF37" />
              <span>{settings?.companyName || 'SM WATCHSTORE'} • EXCLUSIVE HOROLOGY</span>
            </div>

            {/* Main Heading */}
            <h1
              className="font-serif text-gold-gradient"
              style={{
                fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
                fontWeight: 800,
                lineHeight: '1.15',
                letterSpacing: '0.02em',
                marginBottom: '18px',
              }}
            >
              Timeless Elegance, Masterful Precision
            </h1>

            <p
              style={{
                fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
                color: '#94A3B8',
                lineHeight: '1.6',
                marginBottom: '32px',
                maxWidth: '680px',
              }}
            >
              Discover authentic luxury timepieces, mechanical chronometers, and iconic diving watches. Insured nationwide courier delivery with direct WhatsApp payment verification.
            </p>

            {/* Hero Trust Badges */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '16px',
                marginBottom: '36px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  color: '#CBD5E1',
                }}
              >
                <ShieldCheck size={16} color="#10B981" />
                <span>100% Certified Authentic</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  color: '#CBD5E1',
                }}
              >
                <Truck size={16} color="#D4AF37" />
                <span>Free Courier on Rs. 50,000+</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  fontSize: '0.82rem',
                  color: '#CBD5E1',
                }}
              >
                <CreditCard size={16} color="#3B82F6" />
                <span>Full or 50% Advance Payment</span>
              </div>
            </div>

            {/* Quick Hero Actions */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', justifyContent: 'center' }}>
              <a href="#catalog" className="btn-gold" style={{ padding: '14px 28px' }}>
                <WatchIcon size={18} />
                <span>Explore Timepieces</span>
              </a>
              <a
                href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '923008942942'}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                style={{ padding: '14px 24px' }}
              >
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Courier Promotion Bar */}
      <section
        style={{
          background: 'linear-gradient(90deg, #101726 0%, #172136 50%, #101726 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '16px 0',
        }}
      >
        <div className="container-custom">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Truck size={20} color="#D4AF37" />
              </div>
              <div>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.92rem', fontWeight: 700 }}>
                  Dynamic Courier Discount System
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.78rem' }}>
                  Orders &gt; <strong>Rs. 25,000</strong> get <strong>50% OFF Courier</strong> • Orders &gt;= <strong>Rs. 50,000</strong> get <strong>100% FREE Courier</strong>!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="badge badge-amber" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                50% OFF &gt; Rs. 25,000
              </span>
              <span className="badge badge-emerald" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                100% FREE &gt;= Rs. 50,000
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Catalog Section */}
      <section id="catalog" style={{ padding: '50px 0 80px' }}>
        <div className="container-custom">
          {/* Section Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Exclusive Horology Catalog
              </span>
              <h2 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px' }}>
                Available Timepieces
              </h2>
            </div>

            {/* Quick Sorting & Mobile Filter Trigger */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="btn-secondary d-md-none"
                style={{ padding: '8px 14px', fontSize: '0.85rem' }}
              >
                <SlidersHorizontal size={15} />
                <span>Filters</span>
              </button>

              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="input-luxury"
                style={{
                  width: 'auto',
                  padding: '9px 16px',
                  fontSize: '0.85rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="title_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Category Pills Bar */}
          <div
            style={{
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              paddingBottom: '12px',
              marginBottom: '24px',
              scrollbarWidth: 'none',
            }}
          >
            {categoryOptions.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '999px',
                  border: selectedCategory === cat
                    ? '1px solid #D4AF37'
                    : '1px solid rgba(255, 255, 255, 0.1)',
                  background: selectedCategory === cat
                    ? 'var(--gold-gradient)'
                    : 'rgba(18, 24, 38, 0.6)',
                  color: selectedCategory === cat ? '#080A0F' : '#CBD5E1',
                  fontWeight: selectedCategory === cat ? 700 : 500,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s',
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Bar */}
          <div
            className={`glass-panel ${mobileFilterOpen ? 'd-block' : 'd-none d-md-block'}`}
            style={{
              padding: '18px 20px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '16px',
                alignItems: 'flex-end',
              }}
            >
              {/* Search input */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Search Watch</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Rolex, Chrono, Sub..."
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
              </div>

              {/* Brand Filter */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Brand</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => setSelectedBrand(e.target.value)}
                  className="input-luxury"
                  style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  <option value="All">All Brands</option>
                  {facets.brands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              {/* Movement Filter */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Movement</label>
                <select
                  value={selectedMovement}
                  onChange={(e) => setSelectedMovement(e.target.value)}
                  className="input-luxury"
                  style={{ fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  {movementOptions.map((m) => (
                    <option key={m} value={m}>
                      {m === 'All' ? 'All Movements' : m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Stock toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '44px' }}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    color: '#CBD5E1',
                    userSelect: 'none',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    style={{ width: '16px', height: '16px', accentColor: '#D4AF37', cursor: 'pointer' }}
                  />
                  <span>In Stock Only</span>
                </label>
              </div>

              {/* Reset button */}
              {(search || selectedBrand !== 'All' || selectedCategory !== 'All' || selectedMovement !== 'All' || inStockOnly) && (
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSelectedBrand('All');
                      setSelectedCategory('All');
                      setSelectedMovement('All');
                      setInStockOnly(false);
                    }}
                    style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F87171',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      width: '100%',
                    }}
                  >
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Watches Grid */}
          {loading ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  style={{
                    height: '420px',
                    background: 'rgba(18, 24, 38, 0.4)',
                    borderRadius: '14px',
                    animation: 'pulse 1.5s infinite',
                  }}
                />
              ))}
            </div>
          ) : watches.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '60px 20px',
                background: 'rgba(18, 24, 38, 0.4)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <WatchIcon size={48} color="#64748B" style={{ marginBottom: '16px' }} />
              <h3 style={{ color: '#F8FAFC', fontSize: '1.2rem', marginBottom: '8px' }}>
                No timepieces found
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.88rem', maxWidth: '400px', margin: '0 auto 20px' }}>
                We could not find any watches matching your search or filters. Try adjusting your search query.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setSelectedBrand('All');
                  setSelectedCategory('All');
                  setSelectedMovement('All');
                  setInStockOnly(false);
                }}
                className="btn-gold"
                style={{ fontSize: '0.85rem', padding: '10px 20px' }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}
            >
              {watches.map((watch) => (
                <WatchCard key={watch.id} watch={watch} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Showroom & Physical Location Highlights */}
      <section
        style={{
          background: '#0B0F19',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          padding: '60px 0',
        }}
      >
        <div className="container-custom">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '32px',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Flagship Experience
              </span>
              <h2 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: 800, marginTop: '4px', marginBottom: '16px' }}>
                Visit Our Lahore Showroom
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '24px' }}>
                Experience the weight, precision, and craftsmanship of the world’s finest timepieces in person at our flagship showroom in Gulberg III, Lahore.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <MapPin size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ color: '#F8FAFC', fontSize: '0.9rem', fontWeight: 700 }}>Showroom Address</h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                      {settings?.physicalAddress || 'Showroom #14, Royal Horology Pavilion, Main Boulevard, Gulberg III, Lahore'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Clock size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ color: '#F8FAFC', fontSize: '0.9rem', fontWeight: 700 }}>Opening Hours</h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                      {settings?.openingHoursText || 'Mon - Sat: 11:00 AM - 10:00 PM | Sun: 03:00 PM - 09:00 PM'}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Phone size={20} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h5 style={{ color: '#F8FAFC', fontSize: '0.9rem', fontWeight: 700 }}>Direct Line / WhatsApp</h5>
                    <p style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
                      {settings?.contactPhone || '+92 300 8942942'}
                    </p>
                  </div>
                </div>
              </div>

              {settings?.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  style={{ padding: '12px 24px', fontSize: '0.88rem' }}
                >
                  <MapPin size={16} />
                  <span>Get Driving Directions</span>
                </a>
              )}
            </div>

            {/* Visual Showroom Card */}
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                boxShadow: 'var(--shadow-gold)',
                minHeight: '340px',
                background: 'linear-gradient(135deg, #131A2B 0%, #080C14 100%)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                padding: '28px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: 0.25,
                }}
              />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    background: '#D4AF37',
                    color: '#080A0F',
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    marginBottom: '10px',
                  }}
                >
                  AUTHENTICITY ASSURED
                </span>
                <h3 className="font-serif" style={{ fontSize: '1.4rem', color: '#F8FAFC', marginBottom: '8px' }}>
                  Nationwide Insured Delivery
                </h3>
                <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  Every timepiece is double-boxed in high-security tamper-proof packaging and dispatched with live tracking via premier courier services.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="container-custom" style={{ padding: '80px 0', textAlign: 'center', color: '#E5C365' }}>Loading SM WatchStore showroom...</div>}>
      <HomeContent />
    </Suspense>
  );
}
