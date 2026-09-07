'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Watch,
  Lock,
  User,
  AlertCircle,
  Mail,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { settings } = useSettings();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const officialEmail = settings?.officialEmail || 'samiullahnawaz942@gmail.com';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Please enter both your Username / ID and Password.');
      return;
    }

    try {
      setLoading(true);
      const res = await login(username.trim(), password);
      if (res.success) {
        router.push('/');
      } else {
        setErrorMessage(res.error || 'Invalid credentials.');
      }
    } catch (err: any) {
      setErrorMessage('An unexpected login error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '80vh',
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
          maxWidth: '440px',
          padding: '36px 30px',
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '14px',
            }}
          >
            <Watch size={26} color="#D4AF37" />
          </div>
          <h1
            className="font-serif text-gold-gradient"
            style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '6px' }}
          >
            SM WATCHSTORE
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
            Sign in with your User ID and Password to manage orders
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
              lineHeight: '1.4',
            }}
          >
            <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* User ID / Username Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">User ID / Username</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Enter your registered username or ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-luxury"
                style={{ paddingLeft: '40px' }}
              />
              <User
                size={18}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-luxury"
                style={{ paddingLeft: '40px' }}
              />
              <Lock
                size={18}
                color="#94A3B8"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '13px', fontSize: '0.95rem', marginTop: '6px' }}
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        {/* Mandatory Forgot Password Notice Box */}
        <div
          style={{
            marginTop: '24px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '10px',
            padding: '14px 16px',
          }}
        >
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <Mail size={18} color="#D4AF37" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ fontSize: '0.82rem', color: '#F8FAFC', lineHeight: '1.45' }}>
              if you forgot password email:{' '}
              <a
                href={`mailto:${officialEmail}?subject=Password%20Reset%20Request%20-%20SM%20WatchStore`}
                style={{
                  color: '#E5C365',
                  fontWeight: 700,
                  textDecoration: 'underline',
                }}
              >
                {officialEmail}
              </a>{' '}
              to get access again or to reset password.
            </p>
          </div>
        </div>

        {/* Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: '#94A3B8' }}>
          <span>Don&apos;t have an account? </span>
          <Link
            href="/register"
            style={{
              color: '#E5C365',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Create an ID
          </Link>
        </div>
      </div>
    </div>
  );
}
