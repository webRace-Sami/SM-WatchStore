'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Package,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  Clock,
  Truck,
  PlusCircle,
  Sliders,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Order, Watch } from '@/lib/types';
import { useSettings } from '@/context/SettingsContext';

export default function AdminOverviewPage() {
  const { settings } = useSettings();
  const [orders, setOrders] = useState<Order[]>([]);
  const [watches, setWatches] = useState<Watch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        setLoading(true);
        const [ordersRes, watchesRes] = await Promise.all([
          fetch('/api/orders'),
          fetch('/api/watches'),
        ]);

        if (ordersRes.ok) {
          const oData = await ordersRes.json();
          setOrders(oData.orders || []);
        }
        if (watchesRes.ok) {
          const wData = await watchesRes.json();
          setWatches(wData.watches || []);
        }
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const totalRevenue = orders.reduce((sum, o) => {
    if (o.orderStatus !== 'CANCELLED') {
      return sum + o.totalAmount;
    }
    return sum;
  }, 0);

  const pendingVerificationOrders = orders.filter(
    (o) => o.orderStatus === 'PENDING' || o.paymentStatus === 'PENDING_VERIFICATION'
  );

  const activeCourierOrders = orders.filter(
    (o) => o.orderStatus === 'COURIER_ON_THE_WAY'
  );

  const lowStockWatches = watches.filter((w) => w.stockCount <= 2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Store Operations Dashboard
          </span>
          <h1 className="font-serif text-gold-gradient" style={{ fontSize: '1.8rem', fontWeight: 800 }}>
            Management Overview
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link href="/admin/stock/new" className="btn-gold" style={{ padding: '10px 18px', fontSize: '0.86rem' }}>
            <PlusCircle size={16} />
            <span>Add New Watch</span>
          </Link>
          <Link href="/admin/settings" className="btn-secondary" style={{ padding: '10px 16px', fontSize: '0.86rem' }}>
            <Sliders size={16} />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Revenue */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Total Order Volume</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DollarSign size={18} color="#D4AF37" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E5C365' }}>
            Rs. {totalRevenue.toLocaleString()}
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#64748B' }}>From {orders.length} total customer orders</span>
        </div>

        {/* Pending Verifications */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Pending Verifications</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Clock size={18} color="#F59E0B" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FCD34D' }}>
            {pendingVerificationOrders.length} Orders
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#F59E0B' }}>Awaiting WhatsApp proof verification</span>
        </div>

        {/* Courier On The Way */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Courier Dispatched</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Truck size={18} color="#10B981" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#6EE7B7' }}>
            {activeCourierOrders.length} In Transit
          </h3>
          <span style={{ fontSize: '0.75rem', color: '#10B981' }}>Tracking active nationwide</span>
        </div>

        {/* Total Stock in Catalog */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600 }}>Watch Inventory</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Package size={18} color="#3B82F6" />
            </div>
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#93C5FD' }}>
            {watches.length} Models
          </h3>
          <span style={{ fontSize: '0.75rem', color: lowStockWatches.length > 0 ? '#F87171' : '#64748B' }}>
            {lowStockWatches.length > 0 ? `⚠️ ${lowStockWatches.length} Low Stock alerts` : 'Stock levels healthy'}
          </span>
        </div>
      </div>

      {/* Low Stock Alerts Banner (if any) */}
      {lowStockWatches.length > 0 && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <AlertTriangle size={22} color="#EF4444" />
            <div>
              <h4 style={{ color: '#FCA5A5', fontSize: '0.9rem', fontWeight: 700 }}>
                Inventory Notice: {lowStockWatches.length} watches have low or 0 stock
              </h4>
              <p style={{ color: '#CBD5E1', fontSize: '0.78rem' }}>
                {lowStockWatches.map((w) => `${w.title} (${w.stockCount} left)`).join(' • ')}
              </p>
            </div>
          </div>

          <Link href="/admin/stock" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.78rem', color: '#FCA5A5' }}>
            Manage Stock Counts
          </Link>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 className="font-serif text-gold" style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              Recent Customer Orders
            </h3>
            <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
              Verify payment proofs and assign courier tracking IDs
            </span>
          </div>

          <Link href="/admin/orders" className="btn-secondary" style={{ padding: '8px 14px', fontSize: '0.82rem' }}>
            View All Orders ({orders.length})
          </Link>
        </div>

        {orders.length === 0 ? (
          <p style={{ color: '#64748B', fontSize: '0.85rem', textAlign: 'center', padding: '30px 0' }}>
            No customer orders placed yet.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {orders.slice(0, 5).map((ord) => (
              <div
                key={ord.id}
                style={{
                  background: 'rgba(18, 24, 38, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '10px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                    <strong style={{ color: '#E5C365', fontSize: '0.92rem' }}>{ord.orderNumber}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>• {ord.customerName}</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748B' }}>({ord.city})</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>
                    {ord.items.length} item(s) • Total: <strong>Rs. {ord.totalAmount.toLocaleString()}</strong> ({ord.paymentType === 'HALF' ? '50% Advance' : 'Full Payment'})
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span
                    className={
                      ord.orderStatus === 'COURIER_ON_THE_WAY'
                        ? 'badge badge-emerald'
                        : ord.orderStatus === 'CONFIRMED'
                        ? 'badge badge-cyan'
                        : 'badge badge-amber'
                    }
                  >
                    {ord.orderStatus}
                  </span>

                  <Link
                    href={`/admin/orders/${ord.id}`}
                    className="btn-gold"
                    style={{ padding: '7px 14px', fontSize: '0.8rem' }}
                  >
                    <span>Manage Order</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
