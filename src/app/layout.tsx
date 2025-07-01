
import './globals.css';
import Header from '@/components/Header';
import { CartProvider } from '@/context/CartContext'; 

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider> 
          <Header />
          <main>{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
