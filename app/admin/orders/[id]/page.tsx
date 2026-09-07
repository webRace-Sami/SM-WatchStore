'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  User,
  Phone,
  MapPin,
  MessageSquare,
  Save,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';
import WhatsAppButton from '@/components/WhatsAppButton';
import { FALLBACK_WATCH_IMAGE } from '@/lib/preset-images';

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const { settings } = useSettings();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  // Manage Order State
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('PENDING');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('PENDING_VERIFICATION');
  const [courierServiceName, setCourierServiceName] = useState('TCS Express');
  const [courierTrackingNumber, setCourierTrackingNumber] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const res = await fetch(`/api/orders/${id}`);
        if (res.ok) {
          const data = await res.json();
          const o: Order = data.order;
          setOrder(o);
          setOrderStatus(o.orderStatus);
          setPaymentStatus(o.paymentStatus);
          setCourierServiceName(o.courierServiceName || 'TCS Express');
          setCourierTrackingNumber(o.courierTrackingNumber || '');
          setAdminNotes(o.adminNotes || '');
        }
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadOrder();
  }, [id]);

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg({ error: '', success: '' });

    try {
      setSaving(true);
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus,
          paymentStatus,
          courierServiceName,
          courierTrackingNumber,
          adminNotes,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setMsg({ error: '', success: 'Order & Courier details updated successfully!' });
        setTimeout(() => setMsg({ error: '', success: '' }), 3000);
      } else {
        setMsg({ error: data.error || 'Failed to update order.', success: '' });
      }
    } catch (err) {
      setMsg({ error: 'Network error updating order.', success: '' });
    } finally {
      setSaving(false);
    }
  };

  const handleDispatchCourier = () => {
    setOrderStatus('COURIER_ON_THE_WAY');
    setPaymentStatus('VERIFIED');
  };

  if (loading) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <p style={{ color: '#E5C365' }}>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-panel" style={{ padding: '60px', textAlign: 'center' }}>
        <h3 style={{ color: '#F8FAFC' }}>Order Not Found</h3>
        <Link href="/admin/orders" className="btn-gold" style={{ marginTop: '16px' }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <Link
          href="/admin/orders"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            color: '#94A3B8',
            fontSize: '0.85rem',
            textDecoration: 'none',
            marginBottom: '12px',
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Orders</span>
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
              Order {order.orderNumber}
            </h1>
            <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
              Placed by {order.customerName} on {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          {/* Quick WhatsApp Link to Customer */}
          <a
            href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Assalam-o-Alaikum ${order.customerName}! This is SM WatchStore regarding your Order #${order.orderNumber}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            style={{ padding: '9px 16px', fontSize: '0.85rem' }}
          >
            <MessageSquare size={16} />
            <span>Chat with Customer on WhatsApp</span>
          </a>
        </div>
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
          }}
        >
          {msg.error}
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
          }}
        >
          {msg.success}
        </div>
      )}

      {/* Main Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'flex-start',
        }}
      >
        {/* Left Column: Order Items & Payment Proof */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Order Items */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="font-serif text-gold" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '14px' }}>
              Purchased Timepieces
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {order.items.map((it) => (
                <div
                  key={it.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#080C14',
                    padding: '10px 14px',
                    borderRadius: '8px',
                  }}
                >
                  <img
                    src={it.watchImage || FALLBACK_WATCH_IMAGE}
                    alt={it.watchTitle}
                    style={{ width: '48px', height: '48px', borderRadius: '6px', objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = FALLBACK_WATCH_IMAGE;
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <h5 style={{ fontSize: '0.88rem', color: '#F8FAFC', fontWeight: 600 }}>{it.watchTitle}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginTop: '2px' }}>
                      <span style={{ color: '#94A3B8' }}>Qty: {it.quantity}</span>
                      <span style={{ color: '#E5C365', fontWeight: 700 }}>Rs. {it.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Financial Summary */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Subtotal:</span>
                <span style={{ color: '#F8FAFC' }}>Rs. {order.subtotal.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94A3B8' }}>
                <span>Courier Service:</span>
                <span style={{ color: order.courierFee === 0 ? '#10B981' : '#F8FAFC' }}>
                  {order.courierFee === 0 ? 'FREE (100% Off)' : `Rs. ${order.courierFee.toLocaleString()}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#F8FAFC', fontSize: '1.05rem', fontWeight: 800, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '8px', marginTop: '4px' }}>
                <span>Total Amount:</span>
                <span className="text-gold">Rs. {order.totalAmount.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E5C365', fontSize: '0.85rem', fontWeight: 700, marginTop: '2px' }}>
                <span>Payment Plan:</span>
                <span>{order.paymentType === 'HALF' ? `50% Advance (Rs. ${order.advancePaid.toLocaleString()})` : 'Full 100% Payment'}</span>
              </div>
            </div>
          </div>

          {/* Payment Proof / Screenshot */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="font-serif text-gold" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '10px' }}>
              Customer Payment Screenshot / Receipt
            </h3>

            {order.paymentProofUrl ? (
              <div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '10px' }}>
                  Uploaded customer proof for payment verification:
                </p>
                <div
                  style={{
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid var(--border-gold)',
                    maxHeight: '340px',
                    background: '#000',
                  }}
                >
                  <img
                    src={order.paymentProofUrl}
                    alt="Payment Transfer Proof"
                    style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                  />
                </div>
                <a
                  href={order.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  style={{ marginTop: '12px', width: '100%', fontSize: '0.82rem', padding: '8px' }}
                >
                  <ExternalLink size={14} />
                  <span>Open Full-Resolution Proof</span>
                </a>
              </div>
            ) : (
              <div
                style={{
                  background: 'rgba(245, 158, 11, 0.08)',
                  border: '1px dashed rgba(245, 158, 11, 0.3)',
                  borderRadius: '10px',
                  padding: '20px',
                  textAlign: 'center',
                }}
              >
                <p style={{ color: '#FCD34D', fontSize: '0.85rem' }}>
                  No proof uploaded on website yet. Customer may have sent it directly to WhatsApp:
                </p>
                <strong style={{ color: '#F8FAFC', display: 'block', margin: '6px 0' }}>
                  {order.customerPhone}
                </strong>
              </div>
            )}
          </div>

          {/* Customer Delivery Details */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h3 className="font-serif text-gold" style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '12px' }}>
              Customer Delivery Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
              <div style={{ color: '#CBD5E1' }}>
                Recipient: <strong style={{ color: '#F8FAFC' }}>{order.customerName}</strong>
              </div>
              <div style={{ color: '#CBD5E1' }}>
                Phone Number: <strong style={{ color: '#F8FAFC' }}>{order.customerPhone}</strong>
              </div>
              <div style={{ color: '#CBD5E1' }}>
                Delivery Address: <strong style={{ color: '#F8FAFC' }}>{order.shippingAddress}, {order.city}</strong>
              </div>
              {order.postalCode && (
                <div style={{ color: '#CBD5E1' }}>
                  Postal Code: <strong style={{ color: '#F8FAFC' }}>{order.postalCode}</strong>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Dispatch & Fulfillment Workflow */}
        <div className="glass-panel-gold" style={{ padding: '24px' }}>
          <h3 className="font-serif text-gold" style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>
            Dispatch & Fulfillment Workflow
          </h3>

          <form onSubmit={handleUpdateOrder} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Payment Verification Status */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Payment Verification</label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="input-luxury"
              >
                <option value="PENDING_VERIFICATION">Pending Verification</option>
                <option value="VERIFIED">Verified / Payment Confirmed</option>
                <option value="FAILED">Payment Rejected / Failed</option>
              </select>
            </div>

            {/* Order Status */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Order Fulfillment Status</label>
              <select
                value={orderStatus}
                onChange={(e) => setOrderStatus(e.target.value as OrderStatus)}
                className="input-luxury"
              >
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Payment Confirmed</option>
                <option value="PACKED">Packed & Ready for Courier</option>
                <option value="COURIER_ON_THE_WAY">🚚 Courier on the Way (Dispatched)</option>
                <option value="DELIVERED">Delivered</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {/* Quick Dispatch Shortcut */}
            <div
              style={{
                background: 'rgba(16, 185, 129, 0.1)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '12px',
              }}
            >
              <button
                type="button"
                onClick={handleDispatchCourier}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  padding: '10px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <Truck size={16} />
                <span>Quick Trigger: Mark Courier On The Way</span>
              </button>
            </div>

            {/* Courier Service Name */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Courier Service Company</label>
              <input
                type="text"
                placeholder="e.g. TCS Express, Leopards Courier, Trax, M&P..."
                value={courierServiceName}
                onChange={(e) => setCourierServiceName(e.target.value)}
                className="input-luxury"
              />
            </div>

            {/* Courier Tracking ID */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Courier Tracking Number / CN #</label>
              <input
                type="text"
                placeholder="e.g. TCS-982410294"
                value={courierTrackingNumber}
                onChange={(e) => setCourierTrackingNumber(e.target.value)}
                className="input-luxury"
              />
            </div>

            {/* Admin Notes */}
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Internal Admin Notes</label>
              <textarea
                rows={3}
                placeholder="Private notes (e.g. verified on Meezan Bank app at 3:15pm)..."
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="input-luxury"
              />
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: '0.95rem', marginTop: '8px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving...' : 'Save & Update Order Status'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
