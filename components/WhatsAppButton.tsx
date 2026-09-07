'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface WhatsAppButtonProps {
  orderNumber?: string;
  totalAmount?: number;
  paymentType?: 'FULL' | 'HALF';
  customerName?: string;
  customMessage?: string;
  label?: string;
  style?: React.CSSProperties;
}

export default function WhatsAppButton({
  orderNumber,
  totalAmount,
  paymentType,
  customerName,
  customMessage,
  label = 'Send Payment Screenshot on WhatsApp',
  style,
}: WhatsAppButtonProps) {
  const { settings } = useSettings();

  const rawPhone = settings?.whatsappNumber || '+92 300 8942942';
  const cleanPhone = rawPhone.replace(/[^0-9]/g, '');

  let message = customMessage;
  if (!message) {
    if (orderNumber) {
      const paymentText = paymentType === 'HALF' ? '50% Advance Payment' : 'Full 100% Payment';
      message = `Assalam-o-Alaikum SM WatchStore!\n\nI have placed an order and made the payment transfer. Here are my order details:\n\n🏷️ Order ID: ${orderNumber}\n👤 Name: ${customerName || 'Customer'}\n💰 Amount Transferred: Rs. ${(totalAmount || 0).toLocaleString()} (${paymentText})\n\nAttached is my payment transfer screenshot. Please confirm my order and initiate courier dispatch! Thank you.`;
    } else {
      message = `Assalam-o-Alaikum SM WatchStore! I would like to inquire about your luxury timepieces and showroom availability.`;
    }
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-whatsapp"
      style={{
        textDecoration: 'none',
        ...style,
      }}
    >
      <MessageSquare size={18} />
      <span>{label}</span>
    </a>
  );
}
