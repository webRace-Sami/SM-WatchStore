import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { SettingsProvider } from '@/context/SettingsContext';
import { CartProvider } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'SM WatchStore — Luxury Horology & Exclusive Timepieces',
  description:
    'Authorized boutique for premier luxury watches, automatic chronometers, diver watches, and haute horlogerie in Pakistan. Direct showroom & nationwide secure courier delivery.',
  keywords:
    'SM WatchStore, luxury watches, Rolex, Patek Philippe, Audemars Piguet, Omega, Cartier, automatic watches, Pakistan watch store, luxury horology',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SettingsProvider>
            <CartProvider>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
                <Navbar />
                <main style={{ flex: 1 }}>{children}</main>
                <Footer />
                <CartDrawer />
              </div>
            </CartProvider>
          </SettingsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
