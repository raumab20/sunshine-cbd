"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";

const OrderSuccessPage = () => {
    const searchParams = useSearchParams();

    return (
        <div className="max-w-3xl mx-auto p-6 bg-gray-900 shadow-md rounded-lg text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-100 mt-4">Order Placed Successfully!</h1>

            <p className="text-gray-300 mt-2">Thank you for your purchase. You will receive an email confirmation shortly.</p>

            <div className="mt-6 flex justify-center space-x-4">
                <Link href="/products" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                    Continue Shopping
                </Link>
                <Link href="/orders" className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600">
                    View Orders
                </Link>
            </div>
        </div>
    );
};

export default OrderSuccessPage;