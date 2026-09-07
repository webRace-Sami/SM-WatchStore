'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldAlert,
  Sparkles,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import CourierProgressBar from './CourierProgressBar';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function CartDrawer() {
  const router = useRouter();
  const {
    items,
    isCartOpen,
    closeCart,
    subtotal,
    courierFee,
    courierDiscount,
    isFreeCourier,
    total,
    updateQuantity,
    removeFromCart,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(6px)',
        }}
      />

      {/* Drawer Panel */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          background: '#0B0F19',
          borderLeft: '1px solid rgba(212, 175, 55, 0.3)',
          boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1001,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShoppingBag size={20} color="#D4AF37" />
            <h3 className="font-serif text-gold-gradient" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Shopping Bag
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({items.length} items)</span>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: 'none',
              borderRadius: '8px',
              color: '#94A3B8',
              padding: '6px',
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '20px 24px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '40px 0',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(212, 175, 55, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                }}
              >
                <ShoppingBag size={30} color="#D4AF37" />
              </div>
              <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '8px' }}>
                Your bag is empty
              </h4>
              <p style={{ color: '#64748B', fontSize: '0.85rem', maxWidth: '240px', marginBottom: '20px' }}>
                Discover our curated horology collection and acquire your signature timepiece.
              </p>
              <button
                onClick={closeCart}
                className="btn-gold"
                style={{ fontSize: '0.88rem', padding: '10px 20px' }}
              >
                Explore Timepieces
              </button>
            </div>
          ) : (
            <>
              {/* Courier Tier Progress Bar */}
              <CourierProgressBar />

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                {items.map(({ watch, quantity }) => {
                  const unitPrice = watch.discountPrice ?? watch.price;
                  const itemImg = watch.images?.[0]?.url || FALLBACK_WATCH_IMAGE;

                  return (
                    <div
                      key={watch.id}
                      style={{
                        background: 'rgba(18, 24, 38, 0.7)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '12px',
                        padding: '12px',
                        display: 'flex',
                        gap: '12px',
                      }}
                    >
                      {/* Thumbnail */}
                      <div
                        style={{
                          width: '74px',
                          height: '74px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          background: '#06080C',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <img
                          src={itemImg}
                          alt={watch.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                          }}
                        />
                      </div>

                      {/* Details */}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <span style={{ fontSize: '0.72rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                              {watch.brand}
                            </span>
                            <button
                              onClick={() => removeFromCart(watch.id)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#64748B',
                                cursor: 'pointer',
                                padding: '2px',
                              }}
                              title="Remove item"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                          <h4
                            style={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              color: '#F8FAFC',
                              lineHeight: '1.3',
                              marginTop: '2px',
                            }}
                          >
                            {watch.title}
                          </h4>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#E5C365' }}>
                            Rs. {(unitPrice * quantity).toLocaleString()}
                          </span>

                          {/* Quantity Controls */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              background: 'rgba(0,0,0,0.4)',
                              borderRadius: '6px',
                              padding: '2px 6px',
                              border: '1px solid rgba(255,255,255,0.06)',
                            }}
                          >
                            <button
                              onClick={() => updateQuantity(watch.id, quantity - 1)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: '#94A3B8',
                                cursor: 'pointer',
                                display: 'flex',
                              }}
                            >
                              <Minus size={13} />
                            </button>
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(watch.id, quantity + 1)}
                              disabled={quantity >= watch.stockCount}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: quantity >= watch.stockCount ? '#475569' : '#94A3B8',
                                cursor: quantity >= watch.stockCount ? 'not-allowed' : 'pointer',
                                display: 'flex',
                              }}
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer / Checkout Bar */}
        {items.length > 0 && (
          <div
            style={{
              padding: '20px 24px',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#080C14',
            }}
          >
            {/* Price breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Subtotal</span>
                <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Rs. {subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Courier Service (Buyer Pays)</span>
                <span style={{ color: isFreeCourier ? '#10B981' : '#F8FAFC', fontWeight: 600 }}>
                  {isFreeCourier ? (
                    <span style={{ color: '#10B981' }}>FREE (100% Off)</span>
                  ) : courierDiscount > 0 ? (
                    <span>
                      <s style={{ color: '#64748B', marginRight: '6px' }}>
                        Rs. {(courierFee + courierDiscount).toLocaleString()}
                      </s>
                      Rs. {courierFee.toLocaleString()}
                    </span>
                  ) : (
                    `Rs. ${courierFee.toLocaleString()}`
                  )}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  color: '#F8FAFC',
                  fontSize: '1.05rem',
                  fontWeight: 800,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '8px',
                  marginTop: '4px',
                }}
              >
                <span>Estimated Total</span>
                <span className="text-gold">Rs. {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Strict Policy Reminder */}
            <div
              style={{
                fontSize: '0.72rem',
                color: '#94A3B8',
                marginBottom: '14px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
              }}
            >
              <ShieldAlert size={14} color="#EF4444" style={{ flexShrink: 0 }} />
              <span>No COD Available. Full / 50% Advance Bank Transfer. No material refundable.</span>
            </div>

            <button
              onClick={() => {
                closeCart();
                router.push('/checkout');
              }}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '0.98rem' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
