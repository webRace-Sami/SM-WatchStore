'use client';

import React, { useState, useEffect } from 'react';
import {
  Sliders,
  Store,
  MapPin,
  Clock,
  Phone,
  Mail,
  Truck,
  DollarSign,
  Building2,
  ShieldAlert,
  ShieldCheck,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { BankAccountItem, StoreSettings } from '@/lib/types';

export default function AdminSettingsPage() {
  const { settings, refreshSettings } = useSettings();

  const [formData, setFormData] = useState<Partial<StoreSettings>>({
    companyName: 'SM WatchStore',
    brandTagline: 'Luxury Timepieces & Haute Horlogerie',
    officialEmail: 'samiullahnawaz942@gmail.com',
    contactPhone: '+92 300 8942942',
    whatsappNumber: '+92 300 8942942',
    physicalAddress: 'Showroom #14, Royal Horology Pavilion, Main Boulevard, Gulberg III, Lahore, Pakistan',
    city: 'Lahore',
    googleMapsUrl: 'https://maps.google.com/?q=Lahore+Pakistan',
    isOpen: true,
    openingHoursText: 'Mon - Sat: 11:00 AM - 10:00 PM | Sun: 03:00 PM - 09:00 PM',
    gstTaxPercentage: 0,
    baseCourierPrice: 600,
    courierDiscountTier1Min: 25000,
    courierDiscountTier1Rate: 50,
    courierDiscountTier2Min: 50000,
    courierDiscountTier2Rate: 100,
    strictReturnPolicy: 'No material refundable. All timepieces undergo multi-point horological authentication prior to dispatch.',
    noCodNotice: 'Cash on Delivery (COD) is strictly unavailable. Full payment or 50% advance bank transfer required with WhatsApp screenshot verification.',
    announcementBanner: '🚚 50% OFF Courier on orders > Rs. 25,000 | 100% FREE Courier on orders >= Rs. 50,000!',
  });

  const [bankDetails, setBankDetails] = useState<BankAccountItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  useEffect(() => {
    if (settings) {
      setFormData({
        companyName: settings.companyName,
        brandTagline: settings.brandTagline,
        officialEmail: settings.officialEmail,
        contactPhone: settings.contactPhone,
        whatsappNumber: settings.whatsappNumber,
        physicalAddress: settings.physicalAddress,
        city: settings.city,
        googleMapsUrl: settings.googleMapsUrl,
        isOpen: settings.isOpen,
        openingHoursText: settings.openingHoursText,
        gstTaxPercentage: settings.gstTaxPercentage,
        baseCourierPrice: settings.baseCourierPrice,
        courierDiscountTier1Min: settings.courierDiscountTier1Min,
        courierDiscountTier1Rate: settings.courierDiscountTier1Rate,
        courierDiscountTier2Min: settings.courierDiscountTier2Min,
        courierDiscountTier2Rate: settings.courierDiscountTier2Rate,
        strictReturnPolicy: settings.strictReturnPolicy,
        noCodNotice: settings.noCodNotice,
        announcementBanner: settings.announcementBanner,
      });
      setBankDetails(settings.bankDetails || []);
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBankChange = (index: number, field: keyof BankAccountItem, value: string) => {
    setBankDetails((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleAddBank = () => {
    setBankDetails((prev) => [
      ...prev,
      {
        type: 'Bank Transfer',
        title: 'New Account',
        accountName: 'SM WatchStore',
        accountNumber: '0000000000',
        bankName: 'Bank Name',
      },
    ]);
  };

  const handleRemoveBank = (index: number) => {
    setBankDetails((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ error: '', success: '' });

    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          bankDetails,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ error: '', success: 'Store & Courier settings updated successfully!' });
        await refreshSettings();
        setTimeout(() => setMsg({ error: '', success: '' }), 3000);
      } else {
        setMsg({ error: data.error || 'Failed to update settings.', success: '' });
      }
    } catch (err) {
      setMsg({ error: 'Network error updating settings.', success: '' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div>
        <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Store Configuration
        </span>
        <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
          Store, Taxes & Courier Rates
        </h1>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
          Manage dynamic courier rates, 50% off / Free delivery thresholds, taxes, company location, showroom status, and WhatsApp number.
        </p>
      </div>

      {msg.error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#FCA5A5',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} />
          <span>{msg.error}</span>
        </div>
      )}

      {msg.success && (
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '10px',
            padding: '12px 16px',
            color: '#6EE7B7',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={18} />
          <span>{msg.success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {/* 1. Taxes & Dynamic Courier Rates Engine */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} />
            <span>1. Taxes, Delivery & Courier Pricing Engine</span>
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '20px' }}>
            Courier prices change with time. Adjust base courier fees, taxes, and dynamic discount thresholds below:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {/* Base Courier Price */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Base Courier Delivery Price (PKR) *</label>
              <input
                type="number"
                name="baseCourierPrice"
                value={formData.baseCourierPrice}
                onChange={handleChange}
                required
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Standard delivery fee paid by buyer</span>
            </div>

            {/* GST Tax % */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">GST / Sales Tax Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                name="gstTaxPercentage"
                value={formData.gstTaxPercentage}
                onChange={handleChange}
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Set to 0 if tax inclusive</span>
            </div>

            {/* Tier 1 Threshold (50% Off) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">50% OFF Courier Threshold (PKR)</label>
              <input
                type="number"
                name="courierDiscountTier1Min"
                value={formData.courierDiscountTier1Min}
                onChange={handleChange}
                required
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#E5C365' }}>Default: Rs. 25,000 (50% discount)</span>
            </div>

            {/* Tier 2 Threshold (100% Free) */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">100% FREE Courier Threshold (PKR)</label>
              <input
                type="number"
                name="courierDiscountTier2Min"
                value={formData.courierDiscountTier2Min}
                onChange={handleChange}
                required
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#10B981' }}>Default: Rs. 50,000 (100% free)</span>
            </div>
          </div>
        </div>

        {/* 2. Company Info & Showroom Operations */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Store size={18} />
            <span>2. Company Information & Showroom Status</span>
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Company / Brand Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Official Email</label>
              <input
                type="email"
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#E5C365' }}>Notice on login screen uses this email</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Official WhatsApp Number *</label>
              <input
                type="text"
                name="whatsappNumber"
                value={formData.whatsappNumber}
                onChange={handleChange}
                required
                className="input-luxury"
              />
              <span style={{ fontSize: '0.72rem', color: '#25D366' }}>Customers send payment screenshots here</span>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Direct Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>
          </div>

          {/* Showroom Status Toggle & Hours */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginTop: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Showroom Operational Status</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', height: '44px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isOpen"
                  checked={formData.isOpen}
                  onChange={handleChange}
                  style={{ width: '20px', height: '20px', accentColor: '#10B981' }}
                />
                <span style={{ fontWeight: 700, color: formData.isOpen ? '#10B981' : '#EF4444' }}>
                  {formData.isOpen ? '🟢 Showroom Is Open' : '🔴 Showroom Is Closed'}
                </span>
              </label>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Showroom Opening Hours Text</label>
              <input
                type="text"
                name="openingHoursText"
                value={formData.openingHoursText}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Physical Showroom Address</label>
              <input
                type="text"
                name="physicalAddress"
                value={formData.physicalAddress}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Google Maps Link</label>
              <input
                type="url"
                name="googleMapsUrl"
                value={formData.googleMapsUrl}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>
          </div>
        </div>

        {/* 3. Official Bank & Digital Wallet Accounts */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
                3. Bank & Digital Transfer Accounts (Meezan, Alfalah, EasyPaisa, JazzCash, Raast)
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.82rem' }}>
                Customers transfer funds to these accounts and send screenshot on WhatsApp.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBank}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.82rem' }}
            >
              <Plus size={15} />
              <span>Add Account</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {bankDetails.map((acc, idx) => (
              <div
                key={idx}
                style={{
                  background: '#080C14',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr)) auto',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div>
                  <label className="form-label">Account Label</label>
                  <input
                    type="text"
                    value={acc.title}
                    onChange={(e) => handleBankChange(idx, 'title', e.target.value)}
                    className="input-luxury"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label className="form-label">Account Title / Name</label>
                  <input
                    type="text"
                    value={acc.accountName}
                    onChange={(e) => handleBankChange(idx, 'accountName', e.target.value)}
                    className="input-luxury"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label className="form-label">Account / Mobile Number</label>
                  <input
                    type="text"
                    value={acc.accountNumber}
                    onChange={(e) => handleBankChange(idx, 'accountNumber', e.target.value)}
                    className="input-luxury"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <div>
                  <label className="form-label">Bank Name / Wallet Type</label>
                  <input
                    type="text"
                    value={acc.bankName || ''}
                    onChange={(e) => handleBankChange(idx, 'bankName', e.target.value)}
                    placeholder="e.g. Meezan Bank, EasyPaisa"
                    className="input-luxury"
                    style={{ fontSize: '0.84rem' }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveBank(idx)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#EF4444',
                    padding: '8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    alignSelf: 'center',
                  }}
                  title="Remove account"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Store Policies & Announcement Banner */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} />
            <span>4. Store Policies & Top Banner</span>
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Strict Return / Refund Policy Notice</label>
              <textarea
                name="strictReturnPolicy"
                rows={2}
                value={formData.strictReturnPolicy}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">No Cash on Delivery (COD) Notice</label>
              <textarea
                name="noCodNotice"
                rows={2}
                value={formData.noCodNotice}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Top Header Announcement Banner Text</label>
              <input
                type="text"
                name="announcementBanner"
                value={formData.announcementBanner || ''}
                onChange={handleChange}
                className="input-luxury"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="submit"
            disabled={saving}
            className="btn-gold"
            style={{ padding: '14px 32px', fontSize: '0.98rem' }}
          >
            <Save size={18} />
            <span>{saving ? 'Saving Settings...' : 'Save All Settings & Rates'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
