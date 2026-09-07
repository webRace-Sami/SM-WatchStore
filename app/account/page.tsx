'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  Lock,
  MapPin,
  Phone,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/lib/types';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'password'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
    secondaryPhone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);
  const [passwordMsg, setPasswordMsg] = useState({ error: '', success: '' });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      setProfileData({
        fullName: user.fullName || '',
        phone: user.phone || '',
        secondaryPhone: user.secondaryPhone || '',
        address: user.address || '',
        city: user.city || 'Lahore',
        postalCode: user.postalCode || '',
      });

      // Fetch user's orders
      async function fetchOrders() {
        try {
          setLoadingOrders(true);
          const res = await fetch('/api/orders');
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (err) {
          console.error('Failed to load orders:', err);
        } finally {
          setLoadingOrders(false);
        }
      }
      fetchOrders();
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');

    const res = await updateProfile(profileData);
    if (res.success) {
      setProfileMsg('Profile updated successfully!');
      setTimeout(() => setProfileMsg(''), 3000);
    } else {
      setProfileMsg(res.error || 'Failed to update profile.');
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg({ error: '', success: '' });

    if (!currentPassword || !newPassword) {
      setPasswordMsg({ error: 'Please enter current and new password.', success: '' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ error: 'New passwords do not match.', success: '' });
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMsg({ error: 'New password must be at least 6 characters.', success: '' });
      return;
    }

    try {
      setSavingPassword(true);
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setPasswordMsg({ error: '', success: 'Password changed successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMsg({ error: data.error || 'Failed to change password.', success: '' });
      }
    } catch (err) {
      setPasswordMsg({ error: 'Network error.', success: '' });
    } finally {
      setSavingPassword(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: '#E5C365' }}>Loading account dashboard...</p>
      </div>
    );
  }

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-amber">Pending Payment Verification</span>;
      case 'CONFIRMED':
        return <span className="badge badge-cyan">Payment Confirmed</span>;
      case 'PACKED':
        return <span className="badge badge-purple">Order Packed</span>;
      case 'COURIER_ON_THE_WAY':
        return <span className="badge badge-emerald">🚚 Courier on the Way</span>;
      case 'DELIVERED':
        return <span className="badge badge-emerald">✓ Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-rose">Cancelled</span>;
      default:
        return <span className="badge badge-gold">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-custom">
        {/* Header Ribbon */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Customer Portal
            </span>
            <h1 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
              Welcome, {user.fullName}
            </h1>
            <p style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
              User ID: <strong style={{ color: '#F8FAFC' }}>@{user.username}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {user.role === 'ADMIN' && (
              <Link href="/admin" className="btn-gold" style={{ padding: '9px 16px', fontSize: '0.85rem' }}>
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => logout()}
              className="btn-secondary"
              style={{ padding: '9px 16px', fontSize: '0.85rem', color: '#EF4444' }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '28px',
            alignItems: 'flex-start',
          }}
        >
          {/* Left: Navigation Tabs */}
          <div
            className="glass-panel"
            style={{
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'orders' ? 'var(--gold-gradient)' : 'transparent',
                color: activeTab === 'orders' ? '#080A0F' : '#F8FAFC',
                fontWeight: activeTab === 'orders' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Package size={18} />
              <span>My Orders ({orders.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'profile' ? 'var(--gold-gradient)' : 'transparent',
                color: activeTab === 'profile' ? '#080A0F' : '#F8FAFC',
                fontWeight: activeTab === 'profile' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <User size={18} />
              <span>Delivery Addresses & Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('password')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'password' ? 'var(--gold-gradient)' : 'transparent',
                color: activeTab === 'password' ? '#080A0F' : '#F8FAFC',
                fontWeight: activeTab === 'password' ? 700 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <Lock size={18} />
              <span>Change Password</span>
            </button>
          </div>

          {/* Right: Tab Content Panels */}
          <div style={{ gridColumn: 'span 2' }}>
            {/* Tab 1: Orders with Timeline */}
            {activeTab === 'orders' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {loadingOrders ? (
                  <div className="glass-panel" style={{ padding: '30px', textAlign: 'center' }}>
                    <p style={{ color: '#E5C365' }}>Loading your orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <Package size={48} color="#64748B" style={{ marginBottom: '14px' }} />
                    <h3 style={{ color: '#F8FAFC', fontSize: '1.1rem', marginBottom: '6px' }}>No Orders Placed Yet</h3>
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', marginBottom: '20px' }}>
                      Browse our luxury timepieces collection to place your first order.
                    </p>
                    <Link href="/" className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.88rem' }}>
                      Explore Showroom
                    </Link>
                  </div>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="glass-panel"
                      style={{
                        padding: '24px',
                        border: ord.orderStatus === 'COURIER_ON_THE_WAY'
                          ? '1px solid rgba(16, 185, 129, 0.4)'
                          : '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {/* Order Header */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          flexWrap: 'wrap',
                          gap: '12px',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          paddingBottom: '14px',
                          marginBottom: '16px',
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.82rem', color: '#94A3B8' }}>Order:</span>
                            <strong style={{ fontSize: '1rem', color: '#E5C365' }}>{ord.orderNumber}</strong>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {getOrderStatusBadge(ord.orderStatus)}
                          <Link
                            href={`/order-confirmation/${ord.id}`}
                            className="btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                          >
                            View Receipt
                          </Link>
                        </div>
                      </div>

                      {/* Visual Timeline Bar */}
                      <div
                        style={{
                          background: '#080C14',
                          borderRadius: '10px',
                          padding: '16px',
                          marginBottom: '20px',
                        }}
                      >
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '8px',
                            textAlign: 'center',
                            fontSize: '0.75rem',
                          }}
                        >
                          <div style={{ color: '#10B981', fontWeight: 600 }}>
                            <CheckCircle2 size={16} style={{ margin: '0 auto 4px' }} />
                            <span>1. Order Placed</span>
                          </div>
                          <div
                            style={{
                              color: ['CONFIRMED', 'PACKED', 'COURIER_ON_THE_WAY', 'DELIVERED'].includes(ord.orderStatus)
                                ? '#10B981'
                                : '#D4AF37',
                              fontWeight: 600,
                            }}
                          >
                            <Clock size={16} style={{ margin: '0 auto 4px' }} />
                            <span>2. Payment Verify</span>
                          </div>
                          <div
                            style={{
                              color: ['PACKED', 'COURIER_ON_THE_WAY', 'DELIVERED'].includes(ord.orderStatus)
                                ? '#10B981'
                                : '#64748B',
                              fontWeight: 600,
                            }}
                          >
                            <Package size={16} style={{ margin: '0 auto 4px' }} />
                            <span>3. Packed</span>
                          </div>
                          <div
                            style={{
                              color: ['COURIER_ON_THE_WAY', 'DELIVERED'].includes(ord.orderStatus)
                                ? '#10B981'
                                : '#64748B',
                              fontWeight: 700,
                            }}
                          >
                            <Truck size={16} style={{ margin: '0 auto 4px' }} />
                            <span>4. Courier Dispatched</span>
                          </div>
                        </div>

                        {/* Courier Tracking Details if on the way */}
                        {ord.courierTrackingNumber && (
                          <div
                            style={{
                              marginTop: '14px',
                              padding: '10px 14px',
                              background: 'rgba(16, 185, 129, 0.1)',
                              border: '1px solid rgba(16, 185, 129, 0.3)',
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '8px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Truck size={18} color="#10B981" />
                              <span style={{ fontSize: '0.84rem', color: '#F8FAFC' }}>
                                Courier: <strong>{ord.courierServiceName || 'TCS Express'}</strong> • Tracking #: <strong>{ord.courierTrackingNumber}</strong>
                              </span>
                            </div>
                            <span style={{ fontSize: '0.78rem', color: '#10B981', fontWeight: 700 }}>
                              COURIER ON THE WAY
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Items */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                        {ord.items.map((it) => (
                          <div
                            key={it.id}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: '0.85rem',
                              color: '#CBD5E1',
                            }}
                          >
                            <span>{it.quantity}x {it.watchTitle}</span>
                            <span style={{ color: '#E5C365', fontWeight: 600 }}>Rs. {it.total.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>

                      {/* Footer Info */}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                          gap: '12px',
                          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                          paddingTop: '12px',
                        }}
                      >
                        <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
                          Payment: <strong>{ord.paymentType === 'HALF' ? '50% Advance' : 'Full Payment'}</strong> • Total: <strong style={{ color: '#E5C365' }}>Rs. {ord.totalAmount.toLocaleString()}</strong>
                        </div>

                        <WhatsAppButton
                          orderNumber={ord.orderNumber}
                          totalAmount={ord.paymentType === 'HALF' ? ord.advancePaid : ord.totalAmount}
                          paymentType={ord.paymentType}
                          customerName={ord.customerName}
                          label="Send Screenshot / Inquire"
                          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Tab 2: Profile & Delivery Address */}
            {activeTab === 'profile' && (
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 className="font-serif text-gold" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  Delivery Details & Contact Information
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginBottom: '20px' }}>
                  Update your default shipping address and phone numbers for express courier delivery.
                </p>

                {profileMsg && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      color: '#10B981',
                      fontSize: '0.85rem',
                    }}
                  >
                    {profileMsg}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Fixed Username notice */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label className="form-label">User ID / Username</label>
                      <span style={{ fontSize: '0.72rem', color: '#E5C365' }}>Permanent & Immutable</span>
                    </div>
                    <input
                      type="text"
                      value={user.username}
                      disabled
                      className="input-luxury"
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Legal Name</label>
                    <input
                      type="text"
                      value={profileData.fullName}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, fullName: e.target.value }))}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Primary Mobile (WhatsApp)</label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                        required
                        className="input-luxury"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Secondary Phone (Optional)</label>
                      <input
                        type="tel"
                        value={profileData.secondaryPhone}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, secondaryPhone: e.target.value }))}
                        placeholder="Alternative contact"
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Delivery Street Address</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                      placeholder="House / Plaza, Street, Sector / Area"
                      className="input-luxury"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, city: e.target.value }))}
                        className="input-luxury"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        value={profileData.postalCode}
                        onChange={(e) => setProfileData((prev) => ({ ...prev, postalCode: e.target.value }))}
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn-gold"
                    style={{ alignSelf: 'flex-start', padding: '12px 24px', fontSize: '0.9rem', marginTop: '8px' }}
                  >
                    {savingProfile ? 'Saving Changes...' : 'Save Profile Details'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab 3: Change Password */}
            {activeTab === 'password' && (
              <div className="glass-panel" style={{ padding: '28px' }}>
                <h3 className="font-serif text-gold" style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '6px' }}>
                  Update Account Password
                </h3>
                <p style={{ color: '#94A3B8', fontSize: '0.84rem', marginBottom: '20px' }}>
                  You can change your password securely while logged in. Note: outside login, password resets must be requested via admin email.
                </p>

                {passwordMsg.error && (
                  <div
                    style={{
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.35)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      color: '#FCA5A5',
                      fontSize: '0.85rem',
                    }}
                  >
                    {passwordMsg.error}
                  </div>
                )}

                {passwordMsg.success && (
                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '16px',
                      color: '#6EE7B7',
                      fontSize: '0.85rem',
                    }}
                  >
                    {passwordMsg.success}
                  </div>
                )}

                <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '420px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Current Password *</label>
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">New Password (Min. 6 chars) *</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Confirm New Password *</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={savingPassword}
                    className="btn-gold"
                    style={{ alignSelf: 'flex-start', padding: '12px 24px', fontSize: '0.9rem', marginTop: '8px' }}
                  >
                    {savingPassword ? 'Updating Password...' : 'Update Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
