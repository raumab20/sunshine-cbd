'use client'

import Image from 'next/image'
import { Product } from '@/app/types/Product'
import { Button } from '@/components/ui/button'
import { Sun } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-transform duration-300 ease-in-out transform hover:scale-105 flex flex-col">
      <div className="relative w-full flex-grow"> {/* Flex-grow sorgt für die flexible Höhe */}
        <Image
          src={product.image}
          alt={product.name}
          layout="responsive" // Wechselt zu 'responsive', um flexible Bilddarstellung zu ermöglichen
          width={100} // Platzhalter, da 'layout="responsive"' diese Werte benötigt
          height={100} // Platzhalter, wird skaliert basierend auf dem Container
          className="w-full h-full object-contain" 
        />
        <div className="absolute top-0 right-0 bg-yellow-600 text-gray-900 px-2 py-1 m-2 rounded-md text-sm font-semibold flex items-center">
          <Sun className="mr-1 h-4 w-4" />
          {product.category}
        </div>
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2 text-yellow-300">{product.name}</h2>
        <p className="price text-2xl font-bold text-yellow-400 mb-2">${product.price.toFixed(2)}</p>
        {product.description && (
          <p className="text-gray-300 mt-2 text-sm line-clamp-2">{product.description}</p>
        )}
        <div className="flex justify-between items-center mt-4">
          <p className="text-gray-400 text-sm">{product.stock > 0 ? "In Stock" : "Out of Stock"}</p>
          <Button 
            disabled={product.stock <= 0} 
            className="bg-yellow-600 text-gray-900 px-4 py-2 rounded-md hover:bg-yellow-500 transition-colors duration-300"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
