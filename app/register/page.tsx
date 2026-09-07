'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Watch,
  Lock,
  User,
  Phone,
  MapPin,
  Mail,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    phone: '',
    secondaryPhone: '',
    email: '',
    address: '',
    city: 'Lahore',
    postalCode: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.username.trim() || !formData.fullName.trim() || !formData.phone.trim() || !formData.password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await register(formData);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.error || 'Registration failed.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 16px',
        background: 'radial-gradient(ellipse at 50% 30%, #151D30 0%, #080A0F 80%)',
      }}
    >
      <div
        className="glass-panel-gold"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '36px 30px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
            }}
          >
            <Watch size={24} color="#D4AF37" />
          </div>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>
            Create Your Customer ID
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.84rem' }}>
            Create your account to place orders, track shipments & manage delivery addresses
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              fontSize: '0.82rem',
              color: '#FCA5A5',
            }}
          >
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* User ID / Username */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">User ID / Username *</label>
              <span style={{ fontSize: '0.72rem', color: '#E5C365' }}>Permanent & Fixed</span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="username"
                placeholder="Choose unique ID (e.g. john_doe)"
                value={formData.username}
                onChange={handleChange}
                required
                className="input-luxury"
                style={{ paddingLeft: '38px' }}
              />
              <User size={17} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Full Name */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              name="fullName"
              placeholder="Your full legal name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="input-luxury"
            />
          </div>

          {/* Phone & Secondary Phone */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Mobile Phone *</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="tel"
                  name="phone"
                  placeholder="0300 1234567"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-luxury"
                  style={{ paddingLeft: '36px' }}
                />
                <Phone size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">City *</label>
              <input
                type="text"
                name="city"
                placeholder="Lahore, Karachi, etc."
                value={formData.city}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>
          </div>

          {/* Shipping Address */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Complete Delivery Address</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                name="address"
                placeholder="House / Plaza #, Street, Phase / Sector, Area"
                value={formData.address}
                onChange={handleChange}
                className="input-luxury"
                style={{ paddingLeft: '36px' }}
              />
              <MapPin size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Email (Optional) */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address (Optional)</label>
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                name="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="input-luxury"
                style={{ paddingLeft: '36px' }}
              />
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            </div>
          </div>

          {/* Passwords */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                placeholder="Min. 6 chars"
                value={formData.password}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Repeat password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="input-luxury"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '10px' }}
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Link to Login */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.85rem', color: '#94A3B8' }}>
          <span>Already have an ID? </span>
          <Link href="/login" style={{ color: '#E5C365', fontWeight: 700, textDecoration: 'none' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
