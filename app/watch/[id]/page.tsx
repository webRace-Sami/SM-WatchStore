'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  Watch as WatchIcon,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  Share2,
  Check,
} from 'lucide-react';
import { Watch, WatchImage } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function WatchDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const { addToCart } = useCart();
  const { settings } = useSettings();

  const [watch, setWatch] = useState<Watch | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function fetchWatch() {
      try {
        setLoading(true);
        const res = await fetch(`/api/watches/${id}`);
        if (res.ok) {
          const data = await res.json();
          setWatch(data.watch);
        }
      } catch (error) {
        console.error('Failed to load watch:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchWatch();
  }, [id]);

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: '#E5C365', fontSize: '1.1rem' }}>Loading timepiece details...</p>
      </div>
    );
  }

  if (!watch) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '16px' }}>Timepiece Not Found</h2>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>The requested watch could not be located in our stock.</p>
        <Link href="/" className="btn-gold">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const images: WatchImage[] = watch.images && watch.images.length > 0
    ? watch.images
    : [{ url: FALLBACK_WATCH_IMAGE, source: 'preset', isPrimary: true }];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url || FALLBACK_WATCH_IMAGE;
  const currentPrice = watch.discountPrice ?? watch.price;
  const hasDiscount = watch.discountPrice && watch.discountPrice < watch.price;
  const isOutOfStock = watch.stockCount <= 0 || !watch.isAvailable;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(watch, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(watch, quantity);
    router.push('/checkout');
  };

  return (
    <div style={{ padding: '30px 0 80px' }}>
      <div className="container-custom">
        {/* Breadcrumb navigation */}
        <div style={{ marginBottom: '24px' }}>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#94A3B8',
              textDecoration: 'none',
              fontSize: '0.85rem',
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to All Timepieces</span>
          </Link>
        </div>

        {/* Product Grid Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left Column: Image Showcase & Gallery */}
          <div>
            {/* Primary Viewer */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                paddingTop: '100%',
                borderRadius: '16px',
                overflow: 'hidden',
                background: '#0B0F19',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                boxShadow: 'var(--shadow-gold)',
                marginBottom: '16px',
              }}
            >
              <img
                src={currentImage}
                alt={watch.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  padding: '16px',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                }}
              />

              {/* Tags overlay */}
              <div style={{ position: 'absolute', top: '16px', left: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {watch.isFeatured && (
                  <span className="badge badge-gold">
                    <Sparkles size={12} /> Featured Timepiece
                  </span>
                )}
                {currentPrice >= 50000 ? (
                  <span className="badge badge-emerald">Free Courier Eligible</span>
                ) : currentPrice > 25000 ? (
                  <span className="badge badge-amber">50% Off Courier Eligible</span>
                ) : null}
              </div>
            </div>

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  overflowX: 'auto',
                  paddingBottom: '8px',
                }}
              >
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    style={{
                      width: '70px',
                      height: '70px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      background: '#0B0F19',
                      border: selectedImageIndex === idx
                        ? '2px solid #D4AF37'
                        : '1px solid rgba(255, 255, 255, 0.1)',
                      cursor: 'pointer',
                      padding: '2px',
                      flexShrink: 0,
                    }}
                  >
                    <img
                      src={img.url}
                      alt={`Thumb ${idx + 1}`}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '6px' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Information, Pricing, Specs & Buy CTA */}
          <div>
            {/* Brand & Category */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: '#D4AF37',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {watch.brand}
              </span>
              <span style={{ color: '#64748B' }}>•</span>
              <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>{watch.category}</span>
              <span style={{ color: '#64748B' }}>•</span>
              <span style={{ fontSize: '0.78rem', color: '#64748B' }}>SKU: {watch.sku}</span>
            </div>

            {/* Title */}
            <h1
              className="font-serif"
              style={{
                fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
                fontWeight: 800,
                color: '#F8FAFC',
                lineHeight: '1.25',
                marginBottom: '16px',
              }}
            >
              {watch.title}
            </h1>

            {/* Price & Savings */}
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '12px',
                marginBottom: '20px',
                padding: '16px',
                background: 'rgba(18, 24, 38, 0.7)',
                borderRadius: '12px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', textTransform: 'uppercase' }}>
                  Price (PKR)
                </span>
                <span
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#E5C365',
                  }}
                >
                  Rs. {currentPrice.toLocaleString()}
                </span>
              </div>

              {hasDiscount && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block' }}>Regular Price</span>
                  <span style={{ fontSize: '1.1rem', color: '#64748B', textDecoration: 'line-through' }}>
                    Rs. {watch.price.toLocaleString()}
                  </span>
                </div>
              )}
            </div>

            {/* Courier Discount Highlight for This Item */}
            <div
              style={{
                background: currentPrice >= 50000
                  ? 'rgba(16, 185, 129, 0.1)'
                  : currentPrice > 25000
                  ? 'rgba(212, 175, 55, 0.1)'
                  : 'rgba(59, 130, 246, 0.1)',
                border: currentPrice >= 50000
                  ? '1px solid rgba(16, 185, 129, 0.3)'
                  : currentPrice > 25000
                  ? '1px solid rgba(212, 175, 55, 0.3)'
                  : '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <Truck size={20} color={currentPrice >= 50000 ? '#10B981' : '#D4AF37'} />
              <div style={{ fontSize: '0.84rem' }}>
                {currentPrice >= 50000 ? (
                  <span style={{ color: '#6EE7B7', fontWeight: 600 }}>
                    🎉 This watch qualifies for <strong>100% FREE Courier Delivery</strong> nationwide!
                  </span>
                ) : currentPrice > 25000 ? (
                  <span style={{ color: '#FDE68A', fontWeight: 600 }}>
                    ⚡ This watch qualifies for <strong>50% OFF Courier Delivery</strong>!
                  </span>
                ) : (
                  <span style={{ color: '#93C5FD' }}>
                    Standard Courier delivery. Add items to reach Rs. 25,000 for 50% OFF Courier.
                  </span>
                )}
              </div>
            </div>

            {/* Stock status & Quantity selector */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                  Availability
                </span>
                {isOutOfStock ? (
                  <span className="badge badge-rose">Sold Out / Unavailable</span>
                ) : watch.stockCount <= 3 ? (
                  <span className="badge badge-amber">Low Stock ({watch.stockCount} Available)</span>
                ) : (
                  <span className="badge badge-emerald">In Stock ({watch.stockCount} Available)</span>
                )}
              </div>

              {!isOutOfStock && (
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>
                    Quantity
                  </span>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                    className="input-luxury"
                    style={{ width: '80px', padding: '6px 10px', fontSize: '0.88rem' }}
                  >
                    {Array.from({ length: Math.min(watch.stockCount, 5) }).map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={added ? 'btn-secondary' : 'btn-gold'}
                style={{ padding: '14px', fontSize: '0.95rem' }}
              >
                {added ? (
                  <>
                    <Check size={18} color="#10B981" />
                    <span style={{ color: '#10B981' }}>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="btn-secondary"
                style={{
                  padding: '14px',
                  fontSize: '0.95rem',
                  border: '1px solid #D4AF37',
                  color: '#D4AF37',
                }}
              >
                <Zap size={18} />
                <span>Instant Checkout</span>
              </button>
            </div>

            {/* Direct WhatsApp Question for this Watch */}
            <div style={{ marginBottom: '32px' }}>
              <WhatsAppButton
                customMessage={`Assalam-o-Alaikum SM WatchStore! I am interested in purchasing "${watch.title}" (SKU: ${watch.sku}, Rs. ${currentPrice.toLocaleString()}). Please let me know the availability and payment process.`}
                label="Inquire About This Watch on WhatsApp"
                style={{ width: '100%', padding: '12px' }}
              />
            </div>

            {/* Horological Specifications Table */}
            <div
              style={{
                background: 'rgba(18, 24, 38, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '32px',
              }}
            >
              <h3 className="font-serif text-gold" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px' }}>
                Horological Specifications
              </h3>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Brand</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.brand}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Reference Model</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.model}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Movement Calibre</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.movement}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Case Diameter</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.caseDiameter || 'Standard'}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Dial Finish</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.dialColor || 'Original'}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Bracelet / Strap</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.strapMaterial || 'OEM'}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Water Resistance</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.waterResistance || 'Splashproof'}</span>
                </div>
                <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                  <span style={{ color: '#64748B', display: 'block' }}>Category</span>
                  <span style={{ color: '#F8FAFC', fontWeight: 600 }}>{watch.category}</span>
                </div>
              </div>
            </div>

            {/* Description & Features */}
            {watch.description && (
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '8px' }}>
                  About This Timepiece
                </h4>
                <p style={{ color: '#94A3B8', fontSize: '0.88rem', lineHeight: '1.6' }}>
                  {watch.description}
                </p>
              </div>
            )}

            {watch.features && watch.features.length > 0 && (
              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '10px' }}>
                  Key Features & Accessories
                </h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {watch.features.map((feat, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '0.84rem', color: '#CBD5E1' }}>
                      <CheckCircle2 size={16} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Policies Banner */}
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: '10px',
                padding: '14px 16px',
                fontSize: '0.8rem',
                color: '#CBD5E1',
                lineHeight: '1.5',
              }}
            >
              <strong style={{ color: '#FCA5A5' }}>Important Policy Notice:</strong> No material refundable. Cash on Delivery is not available. Payment via Bank Transfer / EasyPaisa / JazzCash with WhatsApp screenshot verification.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
