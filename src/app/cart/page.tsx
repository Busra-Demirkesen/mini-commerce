'use client';

import { Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-semibold mb-4 text-gray-100">
        Shopping Cart
      </h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-300">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
                <div>
                  <h2 className="font-medium text-gray-100">
                    {item.title}
                  </h2>
                  <p className="text-gray-300">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 bg-gray-100 text-gray-900 rounded text-sm hover:bg-white transition"
                    >
                      -
                    </button>
                    <span className="text-gray-100">{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-7 h-7 bg-gray-100 text-gray-900 rounded text-sm hover:bg-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-gray-400 hover:text-gray-200 transition"
                aria-label="Remove from cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={clearCart}
              className="text-sm bg-gray-100 text-gray-900 px-4 py-2 rounded hover:bg-white transition"
            >
              Clear Cart
            </button>
            <p className="text-lg font-semibold text-gray-100">
              Total:{' '}
              {cartItems
                .reduce((total, item) => total + item.price * item.quantity, 0)
                .toFixed(2)}{' '}
              $
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
