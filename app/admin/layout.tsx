'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Sliders,
  Store,
  LogOut,
  Watch,
  Menu,
  X,
  ShieldCheck,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'ADMIN') {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: '#E5C365', fontSize: '1.1rem' }}>Verifying Admin credentials...</p>
      </div>
    );
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Stock & Inventory', href: '/admin/stock', icon: Package },
    { label: 'Add New Watch', href: '/admin/stock/new', icon: PlusCircle },
    { label: 'Customer Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Store & Courier Settings', href: '/admin/settings', icon: Sliders },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#07090E' }}>
      {/* Mobile Top Admin Header */}
      <div
        className="d-md-none"
        style={{
          background: '#0B0F19',
          borderBottom: '1px solid var(--border-gold)',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '60px',
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={18} color="#D4AF37" />
          <span className="font-serif text-gold" style={{ fontSize: '0.95rem', fontWeight: 800 }}>
            SM Admin Mobile
          </span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#F8FAFC',
            padding: '4px',
            cursor: 'pointer',
          }}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="d-md-none"
          style={{
            background: '#0B0F19',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  background: isActive ? 'var(--gold-gradient)' : 'rgba(255,255,255,0.03)',
                  color: isActive ? '#080A0F' : '#F8FAFC',
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Admin Wrapper */}
      <div className="container-custom" style={{ padding: '24px 16px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '260px 1fr',
            gap: '28px',
            alignItems: 'flex-start',
          }}
          className="admin-grid-layout"
        >
          {/* Desktop Sidebar Navigation */}
          <aside
            className="glass-panel-gold d-none d-md-block"
            style={{
              padding: '20px 16px',
              position: 'sticky',
              top: '90px',
            }}
          >
            {/* Admin Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                marginBottom: '16px',
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '8px',
                  background: 'var(--gold-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShieldCheck size={20} color="#080A0F" />
              </div>
              <div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#F8FAFC' }}>
                  Management
                </h4>
                <span style={{ fontSize: '0.72rem', color: '#E5C365', fontWeight: 600 }}>
                  Store Director
                </span>
              </div>
            </div>

            {/* Menu Links */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '11px 14px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.88rem',
                      fontWeight: isActive ? 700 : 500,
                      background: isActive ? 'var(--gold-gradient)' : 'transparent',
                      color: isActive ? '#080A0F' : '#CBD5E1',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div
              style={{
                marginTop: '24px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <Link
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  color: '#94A3B8',
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                }}
              >
                <Store size={16} />
                <span>View Public Storefront</span>
              </Link>
            </div>
          </aside>

          {/* Admin Content View */}
          <main style={{ minWidth: 0 }}>{children}</main>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 767px) {
          .admin-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
