'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Filter,
  MessageSquare,
  ArrowRight,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';
import WhatsAppButton from '@/components/WhatsAppButton';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);

      const res = await fetch(`/api/orders?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const filteredOrders = orders.filter((o) => {
    return (
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerPhone.includes(search) ||
      o.city.toLowerCase().includes(search.toLowerCase())
    );
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="badge badge-amber">Pending Payment Proof</span>;
      case 'CONFIRMED':
        return <span className="badge badge-cyan">Payment Verified</span>;
      case 'PACKED':
        return <span className="badge badge-purple">Packed</span>;
      case 'COURIER_ON_THE_WAY':
        return <span className="badge badge-emerald">🚚 Courier Dispatched</span>;
      case 'DELIVERED':
        return <span className="badge badge-emerald">✓ Delivered</span>;
      case 'CANCELLED':
        return <span className="badge badge-rose">Cancelled</span>;
      default:
        return <span className="badge badge-gold">{status}</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Fulfillment & Dispatch
          </span>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Customer Orders & Proof Verifications
          </h1>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="glass-panel" style={{ padding: '16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search Order ID, Name, Phone, City..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-luxury"
              style={{ paddingLeft: '36px', fontSize: '0.85rem' }}
            />
            <Search
              size={16}
              color="#94A3B8"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-luxury"
            style={{ fontSize: '0.85rem', cursor: 'pointer' }}
          >
            <option value="ALL">All Order Statuses ({orders.length})</option>
            <option value="PENDING">Pending Verification</option>
            <option value="CONFIRMED">Payment Confirmed</option>
            <option value="PACKED">Packed</option>
            <option value="COURIER_ON_THE_WAY">🚚 Courier On The Way</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#E5C365' }}>Loading customer orders...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-panel" style={{ padding: '40px', textAlign: 'center' }}>
          <p style={{ color: '#94A3B8' }}>No customer orders found matching your filters.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="glass-panel"
              style={{
                padding: '18px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                border: ord.orderStatus === 'COURIER_ON_THE_WAY'
                  ? '1px solid rgba(16, 185, 129, 0.4)'
                  : ord.orderStatus === 'PENDING'
                  ? '1px solid rgba(245, 158, 11, 0.3)'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Order Row Header */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ fontSize: '1.05rem', color: '#E5C365' }}>{ord.orderNumber}</strong>
                    <span style={{ fontSize: '0.85rem', color: '#F8FAFC', fontWeight: 600 }}>• {ord.customerName}</span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>({ord.city})</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                    Phone: <strong style={{ color: '#CBD5E1' }}>{ord.customerPhone}</strong> • Address: {ord.shippingAddress}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {getStatusBadge(ord.orderStatus)}
                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="btn-gold"
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    <span>Inspect & Dispatch</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              {/* Items & Payment Summary */}
              <div
                style={{
                  background: '#080C14',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '10px',
                  fontSize: '0.84rem',
                }}
              >
                <div style={{ color: '#CBD5E1' }}>
                  {ord.items.map((it) => `${it.quantity}x ${it.watchTitle}`).join(' • ')}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ color: '#94A3B8' }}>
                    Payment: <strong style={{ color: '#F8FAFC' }}>{ord.paymentType === 'HALF' ? '50% Advance' : '100% Full'}</strong>
                  </span>
                  <span style={{ color: '#E5C365', fontWeight: 800, fontSize: '0.95rem' }}>
                    Rs. {ord.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Courier info (if assigned) */}
              {ord.courierTrackingNumber && (
                <div style={{ fontSize: '0.8rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Truck size={15} />
                  <span>
                    Courier on the way: <strong>{ord.courierServiceName || 'TCS'}</strong> (Tracking #{' '}
                    <strong>{ord.courierTrackingNumber}</strong>)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
