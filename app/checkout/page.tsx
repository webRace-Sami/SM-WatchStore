'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Watch,
  ShieldCheck,
  ShieldAlert,
  Truck,
  CreditCard,
  Building2,
  Phone,
  MapPin,
  User,
  Upload,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useSettings } from '@/context/SettingsContext';
import CourierProgressBar from '@/components/CourierProgressBar';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';
import { BankAccountItem, PaymentType } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, subtotal, courierFee, courierDiscount, isFreeCourier, total, clearCart } = useCart();
  const { settings } = useSettings();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    shippingAddress: '',
    city: 'Lahore',
    postalCode: '',
    paymentType: 'FULL' as PaymentType,
    paymentProofUrl: '',
    paymentNotes: '',
  });

  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Auto-fill customer details from profile if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customerName: user.fullName || prev.customerName,
        customerPhone: user.phone || prev.customerPhone,
        customerEmail: user.email || prev.customerEmail,
        shippingAddress: user.address || prev.shippingAddress,
        city: user.city || prev.city,
        postalCode: user.postalCode || prev.postalCode,
      }));
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Upload Payment Screenshot
  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingProof(true);
      const data = new FormData();
      data.append('file', file);
      data.append('alt', 'Payment Transfer Screenshot');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const resData = await res.json();
      if (res.ok && resData.image?.url) {
        setProofPreview(resData.image.url);
        setFormData((prev) => ({ ...prev, paymentProofUrl: resData.image.url }));
      }
    } catch (err) {
      console.error('Failed to upload proof:', err);
    } finally {
      setUploadingProof(false);
    }
  };

  const advanceAmount = formData.paymentType === 'HALF' ? Math.round(total * 0.5) : total;
  const remainingAmount = formData.paymentType === 'HALF' ? total - advanceAmount : 0;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.customerName.trim() || !formData.customerPhone.trim() || !formData.shippingAddress.trim() || !formData.city.trim()) {
      setErrorMessage('Please provide your name, phone number, city, and delivery address.');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        city: formData.city,
        postalCode: formData.postalCode,
        paymentType: formData.paymentType,
        paymentProofUrl: formData.paymentProofUrl || null,
        paymentNotes: formData.paymentNotes || null,
        items: items.map((it) => ({
          watchId: it.watch.id,
          quantity: it.quantity,
        })),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to place order.');
        return;
      }

      clearCart();
      router.push(`/order-confirmation/${data.order.id}`);
    } catch (err: any) {
      setErrorMessage('Network error while creating your order.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container-custom" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#F8FAFC', marginBottom: '12px' }}>Your Shopping Bag is Empty</h2>
        <p style={{ color: '#94A3B8', marginBottom: '24px' }}>Please select a timepiece before proceeding to checkout.</p>
        <Link href="/" className="btn-gold">
          Explore Timepieces
        </Link>
      </div>
    );
  }

  const bankAccounts: BankAccountItem[] = settings?.bankDetails || [];

  return (
    <div style={{ padding: '40px 0 80px' }}>
      <div className="container-custom">
        {/* Page Title */}
        <div style={{ marginBottom: '28px' }}>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Secure Ordering
          </span>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '2rem', fontWeight: 800 }}>
            Order Checkout & Payment
          </h1>
        </div>

        {/* Top Policies Warning Banner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* No COD Notice */}
          <div
            style={{
              background: 'rgba(245, 158, 11, 0.1)',
              border: '1px solid rgba(245, 158, 11, 0.35)',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <ShieldAlert size={22} color="#F59E0B" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#FEF3C7', lineHeight: '1.4' }}>
              <strong>No Cash on Delivery (COD):</strong> Advance payment required (Full or 50% Advance). Send transfer screenshot on WhatsApp for courier handover.
            </div>
          </div>

          {/* No Material Refundable */}
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.35)',
              borderRadius: '12px',
              padding: '14px 18px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
            }}
          >
            <ShieldCheck size={22} color="#EF4444" style={{ flexShrink: 0 }} />
            <div style={{ fontSize: '0.82rem', color: '#FEE2E2', lineHeight: '1.4' }}>
              <strong>Strict Policy:</strong> No material refundable. All timepieces are verified and certified authentic before sealed shipment.
            </div>
          </div>
        </div>

        {/* Error Notice */}
        {errorMessage && (
          <div
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '10px',
              padding: '14px 16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.85rem',
              color: '#FCA5A5',
            }}
          >
            <AlertCircle size={20} color="#EF4444" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Checkout Columns */}
        <form onSubmit={handleSubmitOrder}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '36px',
              alignItems: 'flex-start',
            }}
          >
            {/* Left Column: Shipping & Payment Method */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
              {/* 1. Shipping Details Form */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} />
                  <span>1. Delivery & Contact Details</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Customer Name *</label>
                    <input
                      type="text"
                      name="customerName"
                      placeholder="Receiver's legal full name"
                      value={formData.customerName}
                      onChange={handleChange}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Mobile Phone (WhatsApp) *</label>
                      <input
                        type="tel"
                        name="customerPhone"
                        placeholder="0300 1234567"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        className="input-luxury"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Email (Optional)</label>
                      <input
                        type="email"
                        name="customerEmail"
                        placeholder="For order receipts"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        className="input-luxury"
                      />
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Full Delivery Address *</label>
                    <input
                      type="text"
                      name="shippingAddress"
                      placeholder="House / Apartment #, Street, Phase / Block, Landmark"
                      value={formData.shippingAddress}
                      onChange={handleChange}
                      required
                      className="input-luxury"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="Lahore, Karachi, Islamabad..."
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="input-luxury"
                      />
                    </div>

                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Postal Code</label>
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="54000"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="input-luxury"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Payment Method Selector */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={18} />
                  <span>2. Payment Option</span>
                </h3>

                <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '16px' }}>
                  Select whether you want to transfer full 100% payment now or 50% advance payment:
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
                  {/* Full Payment Card */}
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, paymentType: 'FULL' }))}
                    style={{
                      border: formData.paymentType === 'FULL' ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      background: formData.paymentType === 'FULL' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>Full 100% Payment</span>
                      <input
                        type="radio"
                        checked={formData.paymentType === 'FULL'}
                        onChange={() => setFormData((prev) => ({ ...prev, paymentType: 'FULL' }))}
                        style={{ accentColor: '#D4AF37' }}
                      />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E5C365', display: 'block', marginBottom: '4px' }}>
                      Rs. {total.toLocaleString()}
                    </span>
                    <p style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                      Pay full amount upfront for priority dispatch.
                    </p>
                  </div>

                  {/* Half Payment Card */}
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, paymentType: 'HALF' }))}
                    style={{
                      border: formData.paymentType === 'HALF' ? '2px solid #D4AF37' : '1px solid rgba(255,255,255,0.1)',
                      background: formData.paymentType === 'HALF' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(0,0,0,0.3)',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#F8FAFC' }}>50% Advance Payment</span>
                      <input
                        type="radio"
                        checked={formData.paymentType === 'HALF'}
                        onChange={() => setFormData((prev) => ({ ...prev, paymentType: 'HALF' }))}
                        style={{ accentColor: '#D4AF37' }}
                      />
                    </div>
                    <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#E5C365', display: 'block', marginBottom: '4px' }}>
                      Rs. {Math.round(total * 0.5).toLocaleString()}
                    </span>
                    <p style={{ fontSize: '0.74rem', color: '#94A3B8' }}>
                      Pay 50% to reserve; balance (Rs. {Math.round(total * 0.5).toLocaleString()}) prior to courier delivery.
                    </p>
                  </div>
                </div>

                {/* Bank Account Details Card */}
                <div
                  style={{
                    background: '#080C14',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    borderRadius: '12px',
                    padding: '18px',
                    marginBottom: '20px',
                  }}
                >
                  <h4 style={{ color: '#E5C365', fontSize: '0.92rem', fontWeight: 700, marginBottom: '12px' }}>
                    Official SM WatchStore Transfer Accounts:
                  </h4>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {bankAccounts.map((acc, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(18, 24, 38, 0.7)',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.06)',
                          fontSize: '0.82rem',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#D4AF37', fontWeight: 700, marginBottom: '2px' }}>
                          <span>{acc.title} {acc.bankName ? `(${acc.bankName})` : ''}</span>
                          <span style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{acc.type}</span>
                        </div>
                        <div style={{ color: '#F8FAFC' }}>
                          Account Title: <strong>{acc.accountName}</strong>
                        </div>
                        <div style={{ color: '#F8FAFC', letterSpacing: '0.04em' }}>
                          Account / Number: <strong>{acc.accountNumber}</strong>
                        </div>
                        {acc.iban && (
                          <div style={{ color: '#94A3B8', fontSize: '0.75rem', marginTop: '2px' }}>
                            IBAN: {acc.iban}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Screenshot Upload Option */}
                <div
                  style={{
                    border: '1px dashed rgba(212, 175, 55, 0.4)',
                    borderRadius: '10px',
                    padding: '16px',
                    textAlign: 'center',
                    background: 'rgba(0,0,0,0.2)',
                  }}
                >
                  <Upload size={22} color="#D4AF37" style={{ marginBottom: '6px' }} />
                  <h5 style={{ fontSize: '0.88rem', color: '#F8FAFC', marginBottom: '4px' }}>
                    Attach Transfer Screenshot (Optional on Website)
                  </h5>
                  <p style={{ fontSize: '0.75rem', color: '#94A3B8', marginBottom: '10px' }}>
                    You can upload your receipt here now, or simply send it via WhatsApp on the next page.
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProofUpload}
                    style={{ fontSize: '0.82rem', color: '#94A3B8' }}
                  />

                  {uploadingProof && <p style={{ fontSize: '0.75rem', color: '#E5C365', marginTop: '6px' }}>Uploading screenshot...</p>}

                  {proofPreview && (
                    <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <CheckCircle2 size={16} color="#10B981" />
                      <span style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: 600 }}>Screenshot attached successfully!</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary & Confirmation */}
            <div style={{ position: 'sticky', top: '90px' }}>
              <div className="glass-panel" style={{ padding: '24px' }}>
                <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px' }}>
                  Order Summary
                </h3>

                {/* Courier Progress Bar */}
                <CourierProgressBar />

                {/* Order Items List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', maxHeight: '280px', overflowY: 'auto' }}>
                  {items.map(({ watch, quantity }) => {
                    const price = watch.discountPrice ?? watch.price;
                    const img = watch.images?.[0]?.url || FALLBACK_WATCH_IMAGE;

                    return (
                      <div
                        key={watch.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: 'rgba(0,0,0,0.3)',
                          padding: '8px 12px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255,255,255,0.04)',
                        }}
                      >
                        <img
                          src={img}
                          alt={watch.title}
                          style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h5 style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 600, lineHeight: '1.3' }}>
                            {watch.title}
                          </h5>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px', fontSize: '0.78rem' }}>
                            <span style={{ color: '#94A3B8' }}>Qty: {quantity}</span>
                            <span style={{ color: '#E5C365', fontWeight: 700 }}>Rs. {(price * quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Financial Summary */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginBottom: '20px', fontSize: '0.88rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>Subtotal ({items.length} timepieces)</span>
                    <span style={{ color: '#F8FAFC', fontWeight: 600 }}>Rs. {subtotal.toLocaleString()}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                    <span>Courier Delivery (Buyer Pays)</span>
                    <span style={{ color: isFreeCourier ? '#10B981' : '#F8FAFC', fontWeight: 600 }}>
                      {isFreeCourier ? (
                        <span style={{ color: '#10B981' }}>100% FREE</span>
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
                      fontSize: '1.2rem',
                      fontWeight: 800,
                      borderTop: '1px solid rgba(255,255,255,0.08)',
                      paddingTop: '10px',
                      marginTop: '4px',
                    }}
                  >
                    <span>Total Order Value</span>
                    <span className="text-gold">Rs. {total.toLocaleString()}</span>
                  </div>

                  {formData.paymentType === 'HALF' && (
                    <div
                      style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRadius: '8px',
                        padding: '10px 12px',
                        marginTop: '6px',
                        fontSize: '0.84rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E5C365', fontWeight: 700 }}>
                        <span>50% Due Now:</span>
                        <span>Rs. {advanceAmount.toLocaleString()}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8', fontSize: '0.78rem', marginTop: '2px' }}>
                        <span>Remaining Balance:</span>
                        <span>Rs. {remainingAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit / Place Order Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
                >
                  <span>{loading ? 'Processing Order...' : 'Confirm & Place Order'}</span>
                  <ArrowRight size={20} />
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748B', marginTop: '12px' }}>
                  By placing this order, you agree that no material is refundable and payment proof is required for courier release.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
