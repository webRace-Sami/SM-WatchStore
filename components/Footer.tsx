'use client';

import React from 'react';
import Link from 'next/link';
import {
  Watch,
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  AlertTriangle,
  CreditCard,
  Truck,
  ExternalLink,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { settings } = useSettings();

  return (
    <footer
      style={{
        background: '#06080C',
        borderTop: '1px solid rgba(212, 175, 55, 0.2)',
        marginTop: '60px',
        paddingTop: '50px',
        paddingBottom: '30px',
        color: '#94A3B8',
        fontSize: '0.88rem',
      }}
    >
      <div className="container-custom">
        {/* Policy Badges Ribbon */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '40px',
            paddingBottom: '30px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Strict Return Policy */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <ShieldCheck size={24} color="#EF4444" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#FCA5A5', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                Strict Policy: No Refundable Material
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                {settings?.strictReturnPolicy || 'No material refundable. Each timepiece is certified & inspected for 100% authenticity prior to shipment.'}
              </p>
            </div>
          </div>

          {/* No COD Policy */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.08)',
              border: '1px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <CreditCard size={24} color="#F59E0B" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#FCD34D', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                No Cash on Delivery (COD)
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                Full payment or 50% advance bank transfer required. Send transfer screenshot on WhatsApp for courier release.
              </p>
            </div>
          </div>

          {/* Tiered Courier Savings */}
          <div
            style={{
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
            }}
          >
            <Truck size={24} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h4 style={{ color: '#6EE7B7', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>
                Tiered Courier Discounts
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.4' }}>
                Buyer pays courier. <strong>50% OFF</strong> above Rs. 25,000 | <strong>100% FREE</strong> delivery above Rs. 50,000!
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '32px',
            marginBottom: '40px',
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Watch size={20} color="#D4AF37" />
              <span className="font-serif text-gold-gradient" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {settings?.companyName || 'SM WATCHSTORE'}
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#94A3B8', lineHeight: '1.6', marginBottom: '16px' }}>
              {settings?.brandTagline || 'Authorized luxury horology boutique and precision timepieces. Curating the world’s finest timekeeping masterpieces.'}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: settings?.isOpen ? '#10B981' : '#EF4444',
                }}
              />
              <span style={{ fontSize: '0.8rem', color: settings?.isOpen ? '#10B981' : '#F87171', fontWeight: 600 }}>
                {settings?.isOpen ? 'Showroom Currently Open' : 'Showroom Closed (Online Dispatching Active)'}
              </span>
            </div>
          </div>

          {/* Showroom & Hours */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>
              Showroom Location & Hours
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#D4AF37" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>{settings?.physicalAddress || 'Showroom #14, Royal Horology Pavilion, Main Boulevard, Gulberg III, Lahore'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="#D4AF37" style={{ flexShrink: 0 }} />
                <span>{settings?.openingHoursText || 'Mon - Sat: 11:00 AM - 10:00 PM'}</span>
              </div>
              {settings?.googleMapsUrl && (
                <a
                  href={settings.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#E5C365',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    marginTop: '4px',
                  }}
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink size={13} />
                </a>
              )}
            </div>
          </div>

          {/* Direct Support & Forgot Password Contact */}
          <div>
            <h4 style={{ color: '#F8FAFC', fontSize: '0.95rem', fontWeight: 700, marginBottom: '14px' }}>
              Official Helpline & Support
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#D4AF37" />
                <a
                  href={`mailto:${settings?.officialEmail || 'samiullahnawaz942@gmail.com'}`}
                  style={{ color: '#F8FAFC', textDecoration: 'none' }}
                >
                  {settings?.officialEmail || 'samiullahnawaz942@gmail.com'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#D4AF37" />
                <span>{settings?.contactPhone || '+92 300 8942942'}</span>
              </div>

              {/* Notice regarding forgot password */}
              <div
                style={{
                  background: 'rgba(212, 175, 55, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.2)',
                  borderRadius: '8px',
                  padding: '10px 12px',
                  marginTop: '8px',
                }}
              >
                <p style={{ fontSize: '0.76rem', color: '#E5C365', lineHeight: '1.4' }}>
                  <strong>Account Assistance:</strong> If you forgot password email:{' '}
                  <a
                    href={`mailto:${settings?.officialEmail || 'samiullahnawaz942@gmail.com'}?subject=Password%20Reset%20Request%20-%20SM%20WatchStore`}
                    style={{ color: '#FFFFFF', fontWeight: 700, textDecoration: 'underline' }}
                  >
                    {settings?.officialEmail || 'samiullahnawaz942@gmail.com'}
                  </a>{' '}
                  to get access again or to reset password.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.78rem',
            color: '#64748B',
          }}
        >
          <p>© {new Date().getFullYear()} {settings?.companyName || 'SM WatchStore'}. All rights reserved. Registered Horological Trading.</p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <span>No Material Refundable</span>
            <span>•</span>
            <span>No COD Available</span>
            <span>•</span>
            <span>Vercel Optimized</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
