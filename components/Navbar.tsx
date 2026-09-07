'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Watch as WatchIcon,
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  ShieldAlert,
  Clock,
  MapPin,
  Phone,
  LayoutDashboard,
  Package,
  Sliders,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';

export default function Navbar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { itemCount, openCart } = useCart();
  const { settings } = useSettings();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, width: '100%' }}>
      {/* Top Announcement Bar */}
      <div
        style={{
          background: 'linear-gradient(90deg, #0A0D14 0%, #151D2E 50%, #0A0D14 100%)',
          borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '6px 16px',
          fontSize: '0.78rem',
          color: '#CBD5E1',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          {/* Store Status Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: settings?.isOpen ? '#10B981' : '#EF4444',
                  boxShadow: settings?.isOpen
                    ? '0 0 8px #10B981'
                    : '0 0 8px #EF4444',
                }}
              />
              <span style={{ fontWeight: 600, color: settings?.isOpen ? '#10B981' : '#F87171' }}>
                {settings?.isOpen ? 'Showroom Open' : 'Showroom Closed (Online Orders Active)'}
              </span>
            </div>
            <span style={{ color: '#475569', display: 'none' }} className="d-md-inline">|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={12} color="#D4AF37" />
              <span>{settings?.city || 'Lahore'} Showroom</span>
            </div>
          </div>

          {/* Special Courier Promo Banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            <Sparkles size={13} color="#D4AF37" />
            <span className="shimmer-badge">
              {settings?.announcementBanner || '50% OFF Courier > Rs. 25,000 | 100% FREE Courier >= Rs. 50,000'}
            </span>
          </div>

          {/* Quick WhatsApp Support */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href={`https://wa.me/${settings?.whatsappNumber?.replace(/[^0-9]/g, '') || '923008942942'}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                color: '#25D366',
                textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              <span>WhatsApp: {settings?.whatsappNumber || '+92 300 8942942'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav
        style={{
          background: 'rgba(8, 10, 15, 0.95)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          padding: '14px 0',
        }}
      >
        <div
          className="container-custom"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px',
          }}
        >
          {/* Brand Logo */}
          <Link
            href="/"
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
                border: '1px solid rgba(212, 175, 55, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(212, 175, 55, 0.2)',
              }}
            >
              <WatchIcon size={22} color="#D4AF37" />
            </div>
            <div>
              <span
                className="font-serif text-gold-gradient"
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  letterSpacing: '0.08em',
                  display: 'block',
                  lineHeight: '1.1',
                }}
              >
                SM WATCHSTORE
              </span>
              <span
                style={{
                  fontSize: '0.68rem',
                  color: '#94A3B8',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Haute Horlogerie
              </span>
            </div>
          </Link>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              flex: '1',
              maxWidth: '420px',
              position: 'relative',
              display: 'none',
            }}
            className="d-md-block"
          >
            <input
              type="text"
              placeholder="Search Rolex, Patek, Omega, Automatic, Diver..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-luxury"
              style={{
                paddingLeft: '40px',
                paddingRight: '16px',
                paddingTop: '9px',
                paddingBottom: '9px',
                fontSize: '0.88rem',
                borderRadius: '999px',
              }}
            />
            <Search
              size={17}
              color="#94A3B8"
              style={{
                position: 'absolute',
                left: '14px',
                top: '50%',
                transform: 'translateY(-50%)',
              }}
            />
          </form>

          {/* Desktop Navigation Links & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Admin Badge */}
            {user?.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="btn-gold"
                style={{
                  padding: '7px 14px',
                  fontSize: '0.8rem',
                  borderRadius: '999px',
                  boxShadow: 'none',
                }}
              >
                <LayoutDashboard size={14} />
                <span>Admin Dashboard</span>
              </Link>
            )}

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              style={{
                position: 'relative',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#F8FAFC',
                padding: '9px 14px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <ShoppingBag size={19} color="#D4AF37" />
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Cart</span>
              {itemCount > 0 && (
                <span
                  style={{
                    background: 'var(--gold-gradient)',
                    color: '#080A0F',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    minWidth: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                  }}
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Actions */}
            <div style={{ position: 'relative' }}>
              {user ? (
                <div>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      background: 'rgba(212, 175, 55, 0.1)',
                      border: '1px solid rgba(212, 175, 55, 0.3)',
                      color: '#F8FAFC',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                    }}
                  >
                    <User size={16} color="#D4AF37" />
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{user.fullName.split(' ')[0]}</span>
                  </button>

                  {/* Dropdown Menu */}
                  {userMenuOpen && (
                    <div
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 'calc(100% + 8px)',
                        width: '220px',
                        background: '#0E131F',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '12px',
                        boxShadow: 'var(--shadow-gold)',
                        padding: '8px',
                        zIndex: 100,
                      }}
                    >
                      <div style={{ padding: '8px 12px', borderBottom: '1px solid rgba(255,255,255,0.08)', marginBottom: '6px' }}>
                        <p style={{ fontSize: '0.82rem', fontWeight: 700, color: '#F8FAFC' }}>{user.fullName}</p>
                        <p style={{ fontSize: '0.75rem', color: '#94A3B8' }}>ID: @{user.username}</p>
                      </div>

                      {user.role === 'ADMIN' && (
                        <>
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              color: '#D4AF37',
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              borderRadius: '6px',
                            }}
                          >
                            <LayoutDashboard size={15} />
                            <span>Admin Portal</span>
                          </Link>
                          <Link
                            href="/admin/stock"
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              color: '#F8FAFC',
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              borderRadius: '6px',
                            }}
                          >
                            <Package size={15} />
                            <span>Manage Stock</span>
                          </Link>
                          <Link
                            href="/admin/settings"
                            onClick={() => setUserMenuOpen(false)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              color: '#F8FAFC',
                              fontSize: '0.85rem',
                              textDecoration: 'none',
                              borderRadius: '6px',
                            }}
                          >
                            <Sliders size={15} />
                            <span>Store Settings</span>
                          </Link>
                        </>
                      )}

                      <Link
                        href="/account"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          color: '#F8FAFC',
                          fontSize: '0.85rem',
                          textDecoration: 'none',
                          borderRadius: '6px',
                        }}
                      >
                        <User size={15} />
                        <span>My Account & Orders</span>
                      </Link>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          color: '#EF4444',
                          background: 'transparent',
                          border: 'none',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          borderRadius: '6px',
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Link
                    href="/login"
                    style={{
                      color: '#F8FAFC',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      padding: '8px 14px',
                    }}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="btn-gold"
                    style={{
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      borderRadius: '8px',
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Burger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                padding: '6px',
                cursor: 'pointer',
              }}
              className="d-md-none"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div
            style={{
              background: '#0B0F19',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
            className="d-md-none"
          >
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search luxury watches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-luxury"
                style={{ paddingLeft: '38px', borderRadius: '8px' }}
              />
              <Search
                size={16}
                color="#94A3B8"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </form>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, padding: '8px 0' }}
              >
                All Timepieces
              </Link>
              <Link
                href="/?category=Luxury"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.95rem', padding: '8px 0' }}
              >
                Haute Horlogerie
              </Link>
              <Link
                href="/?category=Diver"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.95rem', padding: '8px 0' }}
              >
                Diver Watches
              </Link>
              <Link
                href="/?category=Chronograph"
                onClick={() => setMobileMenuOpen(false)}
                style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.95rem', padding: '8px 0' }}
              >
                Chronographs
              </Link>
            </div>

            {user?.role === 'ADMIN' && (
              <div style={{ borderTop: '1px solid rgba(212,175,55,0.2)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>
                  Admin Tools
                </span>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <LayoutDashboard size={16} color="#D4AF37" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  href="/admin/stock"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Package size={16} color="#D4AF37" />
                  <span>Manage Stock</span>
                </Link>
                <Link
                  href="/admin/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ color: '#F8FAFC', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Sliders size={16} color="#D4AF37" />
                  <span>Store Settings</span>
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      <style jsx global>{`
        @media (min-width: 768px) {
          .d-md-block { display: block !important; }
          .d-md-flex { display: flex !important; }
          .d-md-inline { display: inline !important; }
          .d-md-none { display: none !important; }
        }
      `}</style>
    </header>
  );
}
