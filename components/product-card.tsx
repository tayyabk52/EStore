"use client"

import { motion } from "framer-motion"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    originalPrice?: number
    rating: number
    image: string
    inStock: boolean
    featured?: boolean
  }
  onAddToCart?: () => void
  onAddToWishlist?: () => void
}

export function ProductCard({ product, onAddToCart, onAddToWishlist }: ProductCardProps) {
  const isOnSale = product.originalPrice && product.originalPrice > product.price
  const discountPercentage = isOnSale && product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5 }}
    >
      <Card className="group cursor-pointer overflow-hidden">
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative h-80 bg-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            
            {/* Sale Badge */}
            {isOnSale && (
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-sm rounded font-semibold">
                -{discountPercentage}%
              </div>
            )}
            
            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2 py-1 text-sm rounded font-semibold">
                FEATURED
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToWishlist?.()
                }}
              >
                <Heart className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 bg-white/90 hover:bg-white"
                onClick={(e) => {
                  e.stopPropagation()
                  onAddToCart?.()
                }}
              >
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute bottom-2 left-2 bg-gray-800 text-white px-2 py-1 text-sm rounded">
                OUT OF STOCK
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
            
            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({product.rating})</span>
            </div>
            
            {/* Price */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
              {isOnSale && (
                <span className="text-sm text-gray-500 line-through">
                  ${product.originalPrice?.toFixed(2)}
                </span>
              )}
            </div>
            
            {/* Add to Cart Button */}
            <Button
              className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
              disabled={!product.inStock}
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart?.()
              }}
            >
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
} 