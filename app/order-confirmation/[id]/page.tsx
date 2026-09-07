'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  CheckCircle2,
  Watch,
  MessageSquare,
  Upload,
  Copy,
  Check,
  Building2,
  Truck,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Order, BankAccountItem } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function OrderConfirmationPage() {
  const params = useParams();
  const id = params?.id as string;
  const { settings } = useSettings();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data.order);
        }
      } catch (error) {
        console.error('Failed to load order:', error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchOrder();
  }, [id]);

  const handleCopyOrderId = () => {
    if (order?.orderNumber) {
      navigator.clipboard.writeText(order.orderNumber);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt', `Payment proof for ${order.orderNumber}`);

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (uploadRes.ok && uploadData.image?.url) {
        // Update order record with proof URL
        const patchRes = await fetch(`/api/orders/${order.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentProofUrl: uploadData.image.url }),
        });

        if (patchRes.ok) {
          const patchData = await patchRes.json();
          setOrder(patchData.order);
        }
      }
    } catch (err) {
      console.error('Error uploading payment proof:', err);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p style={{ color: '#E5C365', fontSize: '1.1rem' }}>Loading order confirmation details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '16px' }}>Order Not Found</h2>
        <Link href="/" className="btn-gold">
          Return to Storefront
        </Link>
      </div>
    );
  }

  const bankAccounts: BankAccountItem[] = settings?.bankDetails || [];
  const transferAmount = order.paymentType === 'HALF' ? order.advancePaid : order.totalAmount;

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-custom" style={{ maxWidth: '840px' }}>
        {/* Success Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(14, 19, 31, 0.9) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            padding: '32px 24px',
            textAlign: 'center',
            marginBottom: '32px',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
            }}
          >
            <CheckCircle2 size={36} color="#10B981" />
          </div>

          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '8px' }}>
            Order Received Successfully!
          </h1>

          <p style={{ color: '#CBD5E1', fontSize: '0.92rem', maxWidth: '540px', margin: '0 auto 16px' }}>
            Thank you, <strong>{order.customerName}</strong>. Your luxury timepiece order has been logged into our system.
          </p>

          {/* Order ID Tag with Copy */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              background: '#080C14',
              border: '1px solid var(--border-gold)',
              padding: '8px 18px',
              borderRadius: '999px',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>Order Reference ID:</span>
            <strong style={{ fontSize: '1rem', color: '#E5C365', letterSpacing: '0.05em' }}>
              {order.orderNumber}
            </strong>
            <button
              onClick={handleCopyOrderId}
              style={{
                background: 'transparent',
                border: 'none',
                color: copiedId ? '#10B981' : '#94A3B8',
                cursor: 'pointer',
                display: 'flex',
                padding: '2px',
              }}
              title="Copy Order ID"
            >
              {copiedId ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </div>

        {/* Next Step: WhatsApp Payment Proof Action Box */}
        <div
          className="glass-panel-gold"
          style={{
            padding: '28px',
            marginBottom: '32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <MessageSquare size={22} color="#25D366" />
            <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#F8FAFC', fontWeight: 700 }}>
              Step 2: Send Payment Screenshot on WhatsApp
            </h3>
          </div>

          <p style={{ fontSize: '0.88rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '20px' }}>
            Please transfer <strong>Rs. {transferAmount.toLocaleString()}</strong> ({order.paymentType === 'HALF' ? '50% Advance' : 'Full 100% Payment'}) to any of our official accounts below, then tap the button below to send your transfer screenshot on our official WhatsApp line. Once verified, your package will be packed and <strong>courier will be on the way</strong>!
          </p>

          {/* Big WhatsApp CTA Button */}
          <WhatsAppButton
            orderNumber={order.orderNumber}
            totalAmount={transferAmount}
            paymentType={order.paymentType}
            customerName={order.customerName}
            label="Send Screenshot on WhatsApp Now (+92 300 8942942)"
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '1.05rem',
              marginBottom: '20px',
            }}
          />

          {/* In-app upload fallback */}
          <div
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            <span style={{ fontSize: '0.82rem', color: '#94A3B8', fontWeight: 600 }}>
              Or attach your transfer receipt directly here on website:
            </span>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <label
                className="btn-secondary"
                style={{
                  padding: '9px 16px',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Upload size={15} />
                <span>{uploading ? 'Uploading Receipt...' : 'Upload Screenshot / Receipt'}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadProof}
                  disabled={uploading}
                  style={{ display: 'none' }}
                />
              </label>

              {order.paymentProofUrl && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#10B981' }}>
                  <CheckCircle2 size={16} />
                  <span>Payment Screenshot Received! Admin will verify shortly.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bank & Wallet Accounts */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <h4 className="font-serif text-gold" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={18} />
            <span>Official Transfer Accounts</span>
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
            {bankAccounts.map((acc, idx) => (
              <div
                key={idx}
                style={{
                  background: '#080C14',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ color: '#D4AF37', fontWeight: 700, marginBottom: '4px' }}>
                  {acc.title} {acc.bankName ? `(${acc.bankName})` : ''}
                </div>
                <div style={{ color: '#CBD5E1', fontSize: '0.8rem' }}>
                  Title: <strong>{acc.accountName}</strong>
                </div>
                <div style={{ color: '#F8FAFC', fontSize: '0.9rem', fontWeight: 700, margin: '3px 0' }}>
                  A/C: {acc.accountNumber}
                </div>
                {acc.iban && (
                  <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>
                    IBAN: {acc.iban}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order Details Breakdown */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
          <h4 className="font-serif text-gold" style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px' }}>
            Purchased Items & Courier Breakdown
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            {order.items.map((it) => (
              <div
                key={it.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(0,0,0,0.3)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                }}
              >
                <div>
                  <h5 style={{ fontSize: '0.88rem', color: '#F8FAFC', fontWeight: 600 }}>{it.watchTitle}</h5>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Qty: {it.quantity}</span>
                </div>
                <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#E5C365' }}>
                  Rs. {it.total.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
              <span>Subtotal:</span>
              <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
              <span>Courier Delivery Fee:</span>
              <span style={{ color: order.courierFee === 0 ? '#10B981' : '#F8FAFC', fontWeight: 600 }}>
                {order.courierFee === 0 ? 'FREE (100% Off)' : `Rs. ${order.courierFee.toLocaleString()}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px' }}>
              <span>Total Amount:</span>
              <span className="text-gold">Rs. {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Links to Account / Track */}
        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
          <Link href="/account" className="btn-secondary" style={{ padding: '12px 20px' }}>
            View Order in Account
          </Link>
          <Link href="/" className="btn-gold" style={{ padding: '12px 20px' }}>
            Return to Showroom
          </Link>
        </div>
      </div>
    </div>
  );
}
