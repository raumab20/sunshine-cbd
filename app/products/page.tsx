'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Product } from '../types/Product'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Loader2, ShoppingCart, ChevronDown, ChevronUp } from "lucide-react"

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    category: 'all',
    minPrice: '0',
    maxPrice: '1000',
    search: '',
    sortBy: 'name',
    sortOrder: 'asc'
  })

  const [isOpen, setIsOpen] = useState(true)
  const [categories, setCategories] = useState<string[]>([])

  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    const url = new URL(`${baseUrl}/api/products`)

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== 'all' && value !== '') {
        url.searchParams.append(key, value.toString())
      }
    })

    try {
      const res = await fetch(url.toString())
      if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status}`)
      }
      const data = await res.json()
      setProducts(data)
      const uniqueCategories: any = Array.from(new Set(data.map((product: Product) => product.category)))
      setCategories(['all', ...uniqueCategories])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError('Failed to fetch products. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [filters])

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      minPrice: '0',
      maxPrice: '1000',
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    })
  }

  const handleAddToCart = (productId: string) => {
    console.log(`Added product ${productId} to cart`)
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-amber-50">
        <h1 className="text-2xl font-bold text-amber-400 mb-4">Error</h1>
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 text-amber-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center text-amber-400">Sunshine CBD Products</h1>

        <div className="flex flex-col lg:flex-row lg:space-x-8 gap-10">

          <div className='flex gap-5 flex-col'>
            <div>
              <label htmlFor="search" className="block text-sm font-medium mb-1">Search</label>
              <Input
                id="search"
                type="text"
                placeholder="Search products..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg placeholder-amber-300"
              />
            </div>
            <div className="lg:w-64 space-y-6">
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="flex justify-between w-full bg-slate-800 text-amber-400 hover:bg-slate-700">
                    Filters
                    {isOpen ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="collapsible-content mt-4 space-y-4">
                  <div className="p-4 bg-slate-800 rounded-lg shadow-lg">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="category" className="block text-sm font-medium mb-1">Category</label>
                        <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
                          <SelectTrigger id="category" className="w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category === 'all' ? 'All Categories' : category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="min-price" className="block text-sm font-medium mb-1">Min Price</label>
                        <Input
                          id="min-price"
                          type="number"
                          min="0"
                          max="1000"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                          className="w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg"
                        />
                      </div>

                      <div>
                        <label htmlFor="max-price" className="block text-sm font-medium mb-1">Max Price</label>
                        <Input
                          id="max-price"
                          type="number"
                          min="0"
                          max="1000"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                          className="w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg"
                        />
                      </div>

                      <div>
                        <label htmlFor="sort" className="sort block text-sm font-medium mb-1">Sort By</label>
                        <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                          <SelectTrigger id="sort" className=".sort w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg">
                            <SelectValue placeholder="Sort by" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="price">Price</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label htmlFor="order" className="block text-sm font-medium mb-1">Order</label>
                        <Select value={filters.sortOrder} onValueChange={(value) => handleFilterChange('sortOrder', value)}>
                          <SelectTrigger id="order" className="w-full bg-slate-700 text-amber-50 border-amber-600 rounded-lg">
                            <SelectValue placeholder="Order" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button onClick={handleResetFilters} variant="outline" className="w-full bg-amber-700 text-amber-100 hover:bg-amber-600 border-amber-500 rounded-lg">
                    Reset Filters
                  </Button>
                </CollapsibleContent>
              </Collapsible>
            </div>
          </div>


          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {products.map((product) => (
                  <div key={product.id} className="product-card bg-slate-800 rounded-lg shadow-md overflow-hidden">
                    <div className="relative aspect-square">
                      <Image
                        src={product.image}
                        alt={product.name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 ease-in-out transform hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold mb-2 text-amber-400">{product.name}</h2>
                      <p className="text-amber-200 mb-2">Category: {product.category}</p>
                      <p className="price text-2xl font-bold text-amber-400">${product.price.toFixed(2)}</p>
                      {product.description && (
                        <p className="text-amber-100 mt-2 text-sm">{product.description}</p>
                      )}
                      <p className="text-amber-200 mt-2 text-sm">In Stock: {product.stock}</p>
                      <Button
                        onClick={() => handleAddToCart(product.id)}
                        className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-slate-900"
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}