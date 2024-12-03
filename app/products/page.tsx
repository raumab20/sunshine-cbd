"use client";

import { useState, useEffect, useMemo } from "react";
import { Product } from "../types/Product";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Search, Sun } from "lucide-react";
import { debounce } from "lodash";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

export default function ProductPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("name_asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const url = new URL(`${baseUrl}/api/products`);

    try {
      const res = await fetch(`${baseUrl}/api/products`);
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }
      const data = await res.json();
      setFetchedProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }

    if (category && category !== "all")
      url.searchParams.append("category", category);
    if (minPrice) url.searchParams.append("minPrice", minPrice);
    if (maxPrice) url.searchParams.append("maxPrice", maxPrice);
    if (sort) {
      const [sortBy, sortOrder] = sort.split("_");
      url.searchParams.append("sortBy", sortBy);
      url.searchParams.append("sortOrder", sortOrder);
    }

    try {
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`);
      }

      const data = await res.json();
      console.log("Fetched products:", data);
      setAllProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to fetch products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetchProducts = useMemo(
    () => debounce(fetchProducts, 300),
    [category, minPrice, maxPrice, sort]
  );

  useEffect(() => {
    debouncedFetchProducts();
    return () => debouncedFetchProducts.cancel();
  }, [debouncedFetchProducts]);

  const filterProducts = useMemo(() => {
    return debounce((query: string) => {
      const lowercaseQuery = query.toLowerCase();
      const filtered = allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(lowercaseQuery) ||
          product.description?.toLowerCase().includes(lowercaseQuery) ||
          product.category.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredProducts(filtered);
    }, 300);
  }, [allProducts]);

  useEffect(() => {
    filterProducts(searchQuery);
    return () => filterProducts.cancel();
  }, [searchQuery, filterProducts]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-yellow-100">
        <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-yellow-300 flex items-center justify-center">
          <Sun className="mr-2 h-8 w-8" />
          Our Products
        </h1>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full bg-gray-800 border-gray-700 text-yellow-100 placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label
                htmlFor="category"
                className="category text-sm font-medium text-yellow-200"
              >
                Category
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id="category"
                  data-testid="category-select"
                  className="bg-gray-800 border-gray-700 text-yellow-100"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-yellow-100">
                  <SelectItem value="all">All Categories</SelectItem>
                  {fetchedProducts.map((product) => (
                    <SelectItem key={product.id} value={product.category}>
                      {product.category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label
                htmlFor="price-range"
                className="text-sm font-medium text-yellow-200"
              >
                Price Range
              </Label>
              <div className="flex gap-2" id="price-range">
                <Input
                  type="number"
                  placeholder="Min Price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-yellow-100 placeholder-gray-400"
                />
                <Input
                  type="number"
                  placeholder="Max Price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-yellow-100 placeholder-gray-400"
                />
              </div>
            </div>

            <div>
              <Label
                htmlFor="sort"
                className="text-sm font-medium text-yellow-200"
              >
                Sort
              </Label>
              <Select value={sort} onValueChange={setSort}>
                <SelectTrigger
                  id="sort"
                  data-testid="sort-select"
                  className="bg-gray-800 border-gray-700 text-yellow-100"
                >
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700 text-yellow-100">
                  <SelectItem value="name_asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name_desc">Name (Z-A)</SelectItem>
                  <SelectItem value="price_asc">Price (Low to High)</SelectItem>
                  <SelectItem value="price_desc">
                    Price (High to Low)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-300" />
          </div>
        ) : (
          <>
            {filteredProducts.length === 0 ? (
              <div className="text-center text-yellow-200 text-xl mt-8">
                No products found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <ProductCard key={product.id} product={product} />
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
