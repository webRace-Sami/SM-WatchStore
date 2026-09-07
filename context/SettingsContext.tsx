'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StoreSettings } from '@/lib/types';

interface SettingsContextType {
  settings: StoreSettings | null;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const defaultSettingsFallback: StoreSettings = {
  id: 'default',
  companyName: 'SM WatchStore',
  brandTagline: 'Luxury Timepieces & Haute Horlogerie',
  logoUrl: '',
  contactPhone: '+92 300 8942942',
  whatsappNumber: '+92 300 8942942',
  officialEmail: 'samiullahnawaz942@gmail.com',
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
  bankDetails: [],
  strictReturnPolicy: 'No material refundable. 100% authentic horological inspection.',
  noCodNotice: 'Cash on Delivery is unavailable. Full or 50% advance bank transfer required.',
  announcementBanner: '🚚 Special: 50% OFF Courier > Rs. 25,000 | 100% FREE Courier >= Rs. 50,000',
  updatedAt: new Date().toISOString(),
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings | null>(defaultSettingsFallback);
  const [loading, setLoading] = useState(true);

  const refreshSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
