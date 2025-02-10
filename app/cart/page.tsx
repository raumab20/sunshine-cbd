"use client";
import { NextPage } from "next";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback } from "react";
import Image from "next/image";

const CartPage: NextPage = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: session, status } = useSession();

  const fetchCart = useCallback(async () => {
    if (!session) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    const url = new URL(`${baseUrl}/api/cart`);

    try {
      const res = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status}`);
      }

      const data = await res.json();
      setCart(data);
    } catch (error) {
      console.error("Error fetching cart:", error);
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session && status === "authenticated") {
      fetchCart();
    }
  }, [session, status, fetchCart]);

  const deleteCartItem = async (cartItemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== cartItemId));

    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    const url = new URL(`${baseUrl}/api/cart/item`);

    try {
      const res = await fetch(url.toString(), {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session, cartItemId }),
      });

      if (!res.ok) {
        throw new Error(`Failed to delete cart item: ${res.status}`);
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      window.location.reload();
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );

    const baseUrl = process.env.NEXT_PUBLIC_API_URL as string;
    const url = new URL(`${baseUrl}/api/cart/item`);

    try {
      const res = await fetch(url.toString(), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session, itemId, quantity }),
      });

      if (!res.ok) {
        throw new Error(`Failed to update cart item quantity: ${res.status}`);
      }
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-6 text-gray-200">Loading Cart...</div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="text-center py-6 text-gray-200">
        <p>The cart is empty.</p>
        <Link
          className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          href="/products"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  const calculateTotalPrice = () => {
    return cart
      .reduce((total, item) => {
        if (!item.product) {
          console.warn("Missing product data for item:", item);
          return total;
        }
        return total + item.product.price * item.quantity;
      }, 0)
      .toFixed(2);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">
        Cart
      </h1>
      <ul className="space-y-4">

        {cart.map((item) => {
          if (!item.product) {
            console.warn("Item with missing product data:", item);
            return null;
          }

          return (
            <li
              key={item.id}
              className="flex items-center justify-between border-b border-gray-700 pb-4"
            >
              <Image
                src={item.product.image}
                alt={item.product.name}
                width={64} // Adjust as needed
                height={64} // Adjust as needed
                className="rounded-md"
              />
              <div className="flex-1 ml-4">
                <h2 className="text-lg font-semibold text-gray-100">
                  {item.product.name}
                </h2>
                <p className="text-sm text-gray-400">{item.product.category}</p>
                <p className="font-bold mt-1 text-gray-200">
                  {item.product.price.toFixed(2)} €
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="px-2 py-1 bg-gray-700 text-gray-100 rounded hover:bg-gray-600"
                >
                  -
                </button>
                <span className="px-3 text-lg text-gray-100">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="px-2 py-1 bg-gray-700 text-gray-100 rounded hover:bg-gray-600"
                >
                  +
                </button>
              </div>
              <p className="ml-6 font-semibold text-gray-100">
                {(item.product.price * item.quantity).toFixed(2)} €
              </p>
              <button
                onClick={() => deleteCartItem(item.id)}
                className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
              >
                Delete
              </button>
            </li>
          );
        })}

      </ul>
      <div className="flex items-center justify-between mt-8 border-t border-gray-700 pt-4">
        <Link
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          href="/products"
        >
          Continue Shopping
        </Link>
        <span className="text-xl font-bold text-gray-100">
          Total Price: {calculateTotalPrice()} €
        </span>
        <Link
          href="/checkout"
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-center"
        >
          Proceed to Checkout
        </Link>
      </div>

    </div>
  );
};

export default CartPage;