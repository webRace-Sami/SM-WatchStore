'use client';

import React from 'react';
import Link from 'next/link';
import { Watch } from '@/lib/types';
import { ShoppingBag, Eye, Sparkles, Check, Clock, Layers } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function WatchCard({ watch }: { watch: Watch }) {
  const { addToCart } = useCart();
  const [added, setAdded] = React.useState(false);

  const primaryImage =
    watch.images?.find((img) => img.isPrimary)?.url ||
    watch.images?.[0]?.url ||
    FALLBACK_WATCH_IMAGE;

  const currentPrice = watch.discountPrice ?? watch.price;
  const hasDiscount = watch.discountPrice && watch.discountPrice < watch.price;
  const isOutOfStock = watch.stockCount <= 0 || !watch.isAvailable;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(watch, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="card-luxury"
      style={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        height: '100%',
      }}
    >
      {/* Badges Overlay */}
      <div
        style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {watch.isFeatured && (
            <span className="badge badge-gold">
              <Sparkles size={11} /> Featured
            </span>
          )}
          {currentPrice >= 50000 ? (
            <span className="badge badge-emerald">Free Courier</span>
          ) : currentPrice > 25000 ? (
            <span className="badge badge-amber">50% Off Courier</span>
          ) : null}
        </div>

        <div>
          {isOutOfStock ? (
            <span className="badge badge-rose">Out of Stock</span>
          ) : watch.stockCount <= 3 ? (
            <span className="badge badge-amber">Only {watch.stockCount} Left</span>
          ) : (
            <span className="badge badge-emerald">In Stock</span>
          )}
        </div>
      </div>

      {/* Image Showcase */}
      <Link
        href={`/watch/${watch.id}`}
        style={{
          display: 'block',
          position: 'relative',
          width: '100%',
          paddingTop: '90%',
          overflow: 'hidden',
          background: 'linear-gradient(180deg, #0D121F 0%, #06080C 100%)',
          textDecoration: 'none',
        }}
      >
        <img
          src={primaryImage}
          alt={watch.title}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          className="watch-img-zoom"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
          }}
        />
      </Link>

      {/* Content Body */}
      <div
        style={{
          padding: '18px',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          justifyContent: 'space-between',
        }}
      >
        <div>
          {/* Brand & Movement */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: '#D4AF37',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {watch.brand}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
              {watch.category}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/watch/${watch.id}`}
            style={{
              textDecoration: 'none',
              color: '#F8FAFC',
            }}
          >
            <h3
              style={{
                fontSize: '0.95rem',
                fontWeight: 700,
                lineHeight: '1.4',
                marginBottom: '8px',
                color: '#F8FAFC',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {watch.title}
            </h3>
          </Link>

          {/* Micro Specs */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              marginBottom: '14px',
            }}
          >
            {watch.movement && (
              <span
                style={{
                  fontSize: '0.72rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  color: '#94A3B8',
                }}
              >
                {watch.movement.split('(')[0]}
              </span>
            )}
            {watch.caseDiameter && (
              <span
                style={{
                  fontSize: '0.72rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  color: '#94A3B8',
                }}
              >
                {watch.caseDiameter}
              </span>
            )}
          </div>
        </div>

        {/* Pricing & CTA */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
              marginBottom: '14px',
            }}
          >
            <span
              style={{
                fontSize: '1.18rem',
                fontWeight: 800,
                color: '#E5C365',
                letterSpacing: '-0.02em',
              }}
            >
              Rs. {currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span
                style={{
                  fontSize: '0.82rem',
                  color: '#64748B',
                  textDecoration: 'line-through',
                }}
              >
                Rs. {watch.price.toLocaleString()}
              </span>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px' }}>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={added ? 'btn-secondary' : 'btn-gold'}
              style={{
                padding: '9px 12px',
                fontSize: '0.84rem',
                borderRadius: '8px',
                width: '100%',
              }}
            >
              {added ? (
                <>
                  <Check size={15} color="#10B981" />
                  <span style={{ color: '#10B981' }}>Added!</span>
                </>
              ) : isOutOfStock ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag size={15} />
                  <span>Add to Bag</span>
                </>
              )}
            </button>

            <Link
              href={`/watch/${watch.id}`}
              className="btn-secondary"
              style={{
                padding: '9px 12px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="View Specifications"
            >
              <Eye size={16} />
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-luxury:hover .watch-img-zoom {
          transform: scale(1.06);
        }
      `}</style>
    </div>
  );
}
