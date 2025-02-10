"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";

const OrdersPage = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const { data: session } = useSession();

    useEffect(() => {
        const fetchOrders = async () => {
            if (!session) return;

            try {
                const res = await fetch("/api/order", {
                    method: "GET",
                    headers: {
                        "Authorization": session.user?.email || "",
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch orders");
                }

                const data = await res.json();
                setOrders(data || []);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrders();
    }, [session]);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center text-gray-100 mb-8">Your Orders</h1>
            {orders.length === 0 ? (
                <p className="text-gray-400 text-center">No orders found.</p>
            ) : (
                <ul className="space-y-6">
                    {orders.map((order) => (
                        <li key={order.id} className="border-b border-gray-700 pb-6">
                            <h2 className="text-lg font-semibold text-gray-100">Order #{order.id}</h2>
                            <p className="text-gray-400">Status: {order.status}</p>

                            {/* Produktliste */}
                            <ul className="mt-2 space-y-2">
                                {order.items.map((item) => (
                                    <li key={item.id} className="flex items-center space-x-4">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            width={50}
                                            height={50}
                                            className="rounded-md"
                                        />
                                        <div>
                                            <p className="text-gray-100">{item.product.name}</p>
                                            <p className="text-gray-400">{item.quantity} × {item.product.price.toFixed(2)} €</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Gesamtpreis */}
                            <div className="mt-4 text-right">
                                <span className="text-lg font-bold text-gray-100">
                                    Total: {order.total.toFixed(2)} €
                                </span>
                            </div>

                            {/* Versandinformationen (Dummy-Daten für Anzeige) */}
                            <div className="mt-4 text-gray-400 text-sm">
                                <p><strong>Shipping Address:</strong> {order.shippingAddress || "123 Main Street, Berlin"}</p>
                                <p><strong>Delivery Estimate:</strong> {order.estimatedDelivery || "3-5 Business Days"}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <div className="mt-6 text-center">
                <Link href="/products" className="text-blue-400 hover:underline">Back to Shop</Link>
            </div>
        </div>
    );
};

export default OrdersPage;