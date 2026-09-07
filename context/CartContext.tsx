'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Watch } from '@/lib/types';
import { useSettings } from './SettingsContext';
import { calculateCourierFee } from '@/lib/courier';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  courierFee: number;
  courierDiscount: number;
  isFreeCourier: boolean;
  isFiftyPercentCourier: boolean;
  courierMessage: string;
  amountNeededForNextTier: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (watch: Watch, quantity?: number) => void;
  removeFromCart: (watchId: string) => void;
  updateQuantity: (watchId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { settings } = useSettings();

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('sm_cart');
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sm_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = items.reduce((acc, item) => {
    const price = item.watch.discountPrice ?? item.watch.price;
    return acc + price * item.quantity;
  }, 0);

  const courierResult = calculateCourierFee(subtotal, settings);
  const courierFee = courierResult.finalCourierFee;
  const courierDiscount = courierResult.discountAmount;
  const isFreeCourier = courierResult.isDiscountTier2;
  const isFiftyPercentCourier = courierResult.isDiscountTier1;
  const courierMessage = courierResult.message;
  const amountNeededForNextTier = courierResult.amountNeededForNextTier;

  const taxRate = settings?.gstTaxPercentage ?? 0;
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + courierFee + taxAmount;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (watch: Watch, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.watch.id === watch.id);
      if (existing) {
        const newQty = Math.min(watch.stockCount, existing.quantity + quantity);
        return prev.map((item) =>
          item.watch.id === watch.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prev, { watch, quantity: Math.min(watch.stockCount, quantity) }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (watchId: string) => {
    setItems((prev) => prev.filter((item) => item.watch.id !== watchId));
  };

  const updateQuantity = (watchId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(watchId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.watch.id === watchId) {
          const maxAllowed = item.watch.stockCount;
          return { ...item, quantity: Math.min(maxAllowed, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        courierFee,
        courierDiscount,
        isFreeCourier,
        isFiftyPercentCourier,
        courierMessage,
        amountNeededForNextTier,
        total,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
