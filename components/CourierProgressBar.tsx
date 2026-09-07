'use client';

import React from 'react';
import { Truck, Sparkles, CheckCircle2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export default function CourierProgressBar() {
  const { subtotal, courierFee, courierDiscount, isFreeCourier, isFiftyPercentCourier, amountNeededForNextTier } = useCart();
  const { settings } = useSettings();

  const tier1Min = settings?.courierDiscountTier1Min ?? 25000;
  const tier2Min = settings?.courierDiscountTier2Min ?? 50000;

  // Calculate percentage toward free delivery (0 to 100%)
  const percentage = Math.min(100, Math.round((subtotal / tier2Min) * 100));

  return (
    <div
      style={{
        background: 'rgba(14, 20, 32, 0.95)',
        border: isFreeCourier
          ? '1px solid rgba(16, 185, 129, 0.4)'
          : isFiftyPercentCourier
          ? '1px solid rgba(212, 175, 55, 0.4)'
          : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '14px 16px',
        marginBottom: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Truck size={18} color={isFreeCourier ? '#10B981' : '#D4AF37'} />
          <span style={{ fontSize: '0.86rem', fontWeight: 700, color: isFreeCourier ? '#10B981' : '#F8FAFC' }}>
            {isFreeCourier
              ? '🎉 100% FREE Courier Delivery'
              : isFiftyPercentCourier
              ? '⚡ 50% OFF Courier Delivery'
              : '🚚 Courier Delivery by Buyer'}
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94A3B8' }}>
          {isFreeCourier ? 'Free (Rs. 0)' : `Rs. ${courierFee.toLocaleString()}`}
        </span>
      </div>

      {/* Progress Track */}
      <div
        style={{
          width: '100%',
          height: '7px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '999px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '8px',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: isFreeCourier
              ? 'linear-gradient(90deg, #10B981, #34D399)'
              : isFiftyPercentCourier
              ? 'linear-gradient(90deg, #D4AF37, #F5D77F)'
              : 'linear-gradient(90deg, #3B82F6, #60A5FA)',
            borderRadius: '999px',
            transition: 'width 0.4s ease',
          }}
        />
      </div>

      {/* Tier Markers */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginBottom: '6px' }}>
        <span>Standard</span>
        <span style={{ color: subtotal > tier1Min ? '#D4AF37' : '#64748B', fontWeight: subtotal > tier1Min ? 700 : 500 }}>
          Rs. {tier1Min.toLocaleString()} (50% Off)
        </span>
        <span style={{ color: subtotal >= tier2Min ? '#10B981' : '#64748B', fontWeight: subtotal >= tier2Min ? 700 : 500 }}>
          Rs. {tier2Min.toLocaleString()} (Free)
        </span>
      </div>

      {/* Helper text */}
      <div style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
        {isFreeCourier ? (
          <>
            <CheckCircle2 size={14} color="#10B981" />
            <span style={{ color: '#10B981' }}>Your entire order qualifies for 100% Free courier delivery!</span>
          </>
        ) : isFiftyPercentCourier ? (
          <>
            <Sparkles size={14} color="#D4AF37" />
            <span>
              Add <strong style={{ color: '#F8FAFC' }}>Rs. {amountNeededForNextTier.toLocaleString()}</strong> more to get <strong>100% FREE Courier</strong>!
            </span>
          </>
        ) : (
          <>
            <Sparkles size={14} color="#3B82F6" />
            <span>
              Add <strong style={{ color: '#F8FAFC' }}>Rs. {amountNeededForNextTier.toLocaleString()}</strong> more to unlock <strong>50% OFF Courier</strong>!
            </span>
          </>
        )}
      </div>
    </div>
  );
}
