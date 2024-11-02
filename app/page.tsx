import Image from "next/image";
import Link from "next/link";
import { Sun, Leaf, Droplet } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { Product } from "./types/Product";

const products = [
  { "id": "1", "name": "CBD Oil Tincture", "price": 49.99, "image": "/cbd.webp", "category": "Oils", "description": "High-quality CBD oil", "stock": 100 },
  { "id": "2", "name": "CBD Gummies", "price": 29.99, "image": "/cbd.webp", "category": "Edibles", "description": "Delicious CBD gummies", "stock": 50 },
  { "id": "3", "name": "CBD Topical Cream", "price": 39.99, "image": "/cbd.webp", "category": "Topicals", "description": "Relieves muscle pain", "stock": 75 },
  { "id": "4", "name": "CBD Pet Treats", "price": 24.99, "image": "/cbd.webp", "category": "Pet Products", "description": "Safe for pets", "stock": 200 },
  { "id": "5", "name": "CBD Sleep Capsules", "price": 34.99, "image": "/cbd.webp", "category": "Capsules", "description": "Helps with sleep", "stock": 150 },
] as Product[];

const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="48"
    height="48"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-yellow-800"
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2" />
    <path d="M12 20v2" />
    <path d="M4.93 4.93l1.41 1.41" />
    <path d="M17.66 17.66l1.41 1.41" />
    <path d="M2 12h2" />
    <path d="M20 12h2" />
    <path d="M6.34 17.66l-1.41 1.41" />
    <path d="M19.07 4.93l-1.41 1.41" />
  </svg>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <section className="bg-gradient-to-r from-yellow-500 to-yellow-300 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <SunIcon />
                <h1 className="text-4xl md:text-6xl font-bold text-yellow-700 ml-4">
                  Sunshine CBD
                </h1>
              </div>
              <p className="text-xl text-yellow-100 mb-6">
                Discover our premium, sun-grown CBD products for a brighter, healthier you.
              </p>
              <Link
                href="/products"
                className="bg-yellow-700 hover:bg-yellow-800 text-white-900 font-bold py-3 px-8 rounded-full transition duration-300 inline-block"
              >
                Shop Now
              </Link>
            </div>
            <div className="md:w-1/2">
              <Image
                src="/cbd.webp"
                alt="Sunshine CBD Products"
                width={400}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-12">
            Why Choose Sunshine CBD?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Sun className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">Sun-Grown</h3>
              <p className="text-gray-300">
                Our CBD is cultivated under natural sunlight for the highest quality.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Leaf className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">100% Organic</h3>
              <p className="text-gray-300">
                We use organic farming practices to ensure pure, clean products.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-md text-center">
              <Droplet className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-yellow-300">Full Spectrum</h3>
              <p className="text-gray-300">
                Experience the full benefits of CBD with our whole-plant extracts.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="products" className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-yellow-300 mb-12">
            Our Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 ">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      <section className="bg-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">
            Stay Updated with Sunshine CBD
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Subscribe to our newsletter for exclusive offers and CBD insights.
          </p>
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-grow px-4 py-2 rounded-l-full bg-gray-700 text-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-2 px-6 rounded-r-full transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}