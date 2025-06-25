// app/layout.tsx
import './globals.css';
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext'; // 💡 Ekledik

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider> {/* ✅ Sepet sağlayıcısıyla sarmala */}
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
