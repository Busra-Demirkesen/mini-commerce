
'use client';
import { Trash2 } from 'lucide-react';

import { useCart } from '@/context/CartContext';

export default function CartPage() {
  const { cartItems, increaseQty, decreaseQty, removeFromCart, clearCart } = useCart();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.title} className="w-20 h-20 rounded" />
                <div>
                  <h2 className="font-medium">{item.title}</h2>
                  <p className="text-gray-500">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => decreaseQty(item.id)}
                      className="w-7 h-7 bg-gray-200 rounded text-sm"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => increaseQty(item.id)}
                      className="w-7 h-7 bg-gray-200 rounded text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
             <button
  onClick={() => removeFromCart(item.id)}
  className="text-neutral-500 hover:text-neutral-800 transition"
  aria-label="Remove from cart"
>
  <Trash2 className="w-4 h-4" />
</button>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={clearCart}
              className="text-sm bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
            >
              Clear Cart
            </button>
            <p className="text-lg font-semibold">
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
