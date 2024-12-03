"use client";

import { useState, useEffect, useRef } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  stock: number;
  createdAt: string;
}

interface RelatedProductsProps {
  category: string;
  id: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ category, id }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [canScroll, setCanScroll] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrollAmount = 300;

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        let res = await fetch(
          `http://localhost:45620/api/products?category=${encodeURIComponent(
            category
          )}`
        );

        if (!res.ok) throw new Error("Fehler beim Abrufen der verwandten Produkte.");

        let data: Product[] = await res.json();

        if (data.length <= 1) {
          res = await fetch(`http://localhost:45620/api/products`);
          if (!res.ok) throw new Error("Fehler beim Abrufen der Produkte.");
          data = await res.json();
        }

        data = data.filter((product) => product.id !== id);

        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [category, id]);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollWidth, clientWidth } = scrollContainerRef.current;
        setCanScroll(scrollWidth > clientWidth);
      }
    };

    checkScroll();

    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
    };
  }, [products]);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return <div className="text-center text-yellow-200">Lade verwandte Produkte...</div>;
  }

  if (products.length === 0) {
    return <div className="text-center text-yellow-200">Keine verwandten Produkte gefunden.</div>;
  }

  return (
    <div className="mt-12">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-yellow-300">Ähnliche Produkte</h2>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto scrollbar-hide"
        >
          {products.map((product) => (
            <Link key={product.id} href={`/products/${product.id}`}>
              <div className="w-[300px] m-4">
                <ProductCard product={product} />
              </div>
            </Link>
          ))}
        </div>

        {canScroll && (
          <>
            <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
              <button
                onClick={handleScrollLeft}
                className="text-black hover:transform hover:scale-105 transition-all duration-200"
              >
                <ChevronLeft className="w-12 h-12" />
              </button>
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
              <button
                onClick={handleScrollRight}
                className="text-black hover:transform hover:scale-105 transition-all duration-200"
              >
                <ChevronRight className="w-12 h-12" />
              </button>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <Link href="/products">
          <Button variant="secondary">Alle anzeigen</Button>
        </Link>
      </div>
    </div>
  );
};

export default RelatedProducts;
