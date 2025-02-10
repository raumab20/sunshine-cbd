"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const CheckoutPage = () => {
    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();
    const router = useRouter();

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        paymentMethod: "credit_card",
    });


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
        } finally {
            setLoading(false);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            fetchCart();
        }
    }, [session, fetchCart]);

    const calculateTotalPrice = () => {
        return cart
            .reduce((total, item) => total + (item.product?.price ?? 0) * item.quantity, 0)
            .toFixed(2);
    };

    const handlePlaceOrder = async () => {
        if (!session) {
            alert("You must be logged in to place an order.");
            return;
        }

        try {
            const res = await fetch("/api/order", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ session }),
            });

            if (!res.ok) {
                throw new Error(`Failed to place order: ${res.status}`);
            }

            router.push("/order-success")
        } catch (error) {
            console.error("Error placing order:", error);
            alert("An error occurred while placing the order.");
        }
    };

    if (loading) {
        return <div className="text-center py-6 text-gray-200">Loading Checkout...</div>;
    }

    if (cart.length === 0) {
        return (
            <div className="text-center py-6 text-gray-200">
                <p>Your cart is empty.</p>
                <Link
                    className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                    href="/products"
                >
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">Checkout</h1>

            <div className="space-y-4">
                {cart.map((item) => {
                    if (!item.product) {
                        console.warn("Item with missing product data:", item);
                        return null;
                    }

                    return (
                        <div key={item.id} className="flex items-center justify-between border-b border-gray-700 pb-4">
                            <Image
                                src={item.product.image}
                                alt={item.product.name}
                                width={64}
                                height={64}
                                className="rounded-md"
                            />
                            <div className="flex-1 ml-4">
                                <h2 className="text-lg font-semibold text-gray-100">{item.product.name}</h2>
                                <p className="text-sm text-gray-400">{item.product.category}</p>
                                <p className="font-bold mt-1 text-gray-200">{item.product.price.toFixed(2)} €</p>
                            </div>
                            <p className="text-gray-100">Qty: {item.quantity}</p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 border-t border-gray-700 pt-4 flex items-center justify-between">
                <Link href="/cart" className="text-blue-400 hover:underline">
                    Back to Cart
                </Link>
                <span className="text-xl font-bold text-gray-100">Total: {calculateTotalPrice()} €</span>
            </div>

            <button
                onClick={handlePlaceOrder}
                className="w-full mt-6 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-500 text-center"
            >
                Place Order
            </button>
        </div>
    );
};

export default CheckoutPage;