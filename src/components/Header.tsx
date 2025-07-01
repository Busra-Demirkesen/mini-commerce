'use client';

import Link from 'next/link';
import { ShoppingCart, UserCircle, Menu, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

const Header = () => {
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-lg font-semibold tracking-tight text-neutral-900">
          <Link href="/">MiniCommerce</Link>
        </div>

      
        <nav className="hidden md:flex gap-6 text-sm font-medium text-neutral-700">
          <Link href="/" className="hover:text-black transition">Home</Link>
          <Link href="/products" className="hover:text-black transition">Products</Link>
          <Link href="/cart" className="hover:text-black transition">Cart</Link>
          <Link href="/admin" className="hover:text-black transition">Admin</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative">
            <ShoppingCart className="w-6 h-6 text-neutral-800" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 text-[10px] bg-neutral-300 text-neutral-900 rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {totalItems}
              </span>
            )}
          </Link>

          <UserCircle className="w-6 h-6 text-neutral-800" />

        
          <button
            className="md:hidden ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <X className="w-6 h-6 text-neutral-800" />
            ) : (
              <Menu className="w-6 h-6 text-neutral-800" />
            )}
          </button>
        </div>
      </div>

 
      {menuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200 px-6 py-4 flex flex-col gap-4 text-sm font-medium text-neutral-700">
          <Link href="/" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/products" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Products</Link>
          <Link href="/cart" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Cart</Link>
          <Link href="/admin" className="hover:text-black transition" onClick={() => setMenuOpen(false)}>Admin</Link>
        </nav>
      )}
    </header>
  );
};

export default Header;
