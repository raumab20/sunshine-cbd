// pages/products/[id].tsx
"use client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Star, ShoppingCart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useSession } from "next-auth/react";
import RelatedProducts from "@/components/RelatedProducts"; // Import der RelatedProducts-Komponente

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

async function getProduct(id: string): Promise<Product | null> {
  try {
    const res = await fetch(`http://localhost:45620/api/products/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const product = await getProduct(params.id);

  if (!product) notFound();

  const { name, image, price, category, description, stock } = product;

  const addToCart = async () => {
    if (!session) {
      alert("Bitte melden Sie sich an, um Produkte zum Warenkorb hinzuzufügen.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/cart/item", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session: session, productId: product.id }),
      });

      if (!res.ok) {
        throw new Error("Fehler beim Hinzufügen zum Warenkorb");
      }

      const data = await res.json();
    } catch (error) {
      console.error("Fehler beim Hinzufügen zum Warenkorb:", error);
      alert("Fehler beim Hinzufügen zum Warenkorb. Bitte versuchen Sie es später erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/products"
        className="inline-flex items-center text-sm font-medium text-primary hover:underline mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Zurück zu den Produkten
      </Link>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
          <Image
            src={image}
            alt={name}
            layout="fill"
            objectFit="cover"
            className="transition-all duration-300 hover:scale-105"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
            <div className="mt-2 flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-primary text-primary" />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                (121 Bewertungen)
              </span>
            </div>
            <Badge variant="secondary" className="mt-2">
              {category}
            </Badge>
            <div className="mt-4 text-2xl font-bold">${price.toFixed(2)}</div>
            <p className="mt-4 text-muted-foreground">{description}</p>
          </div>
          <div className="mt-6">
            <div className="mb-4 flex items-center">
              <div
                className={`mr-2 h-3 w-3 rounded-full ${
                  stock > 0 ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className={stock > 0 ? "text-green-600" : "text-red-600"}>
                {stock > 0 ? "Auf Lager" : "Nicht verfügbar"}
              </span>
            </div>
            <Button
              onClick={() => {
                if (!loading) addToCart();
              }}
              disabled={stock <= 0 || loading}
              className="w-full"
            >
              <ShoppingCart className="mr-2 h-4 w-4" /> In den Warenkorb
            </Button>
          </div>
        </div>
      </div>

      {/* Einbindung der RelatedProducts-Komponente */}
      <RelatedProducts category={category} id={params.id}/>
    </div>
  );
}
