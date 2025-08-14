"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { wishlistService, type Wishlist } from '@/lib/wishlist'
import { authService } from '@/lib/auth'
import { useCart } from '@/lib/cart-context'
import { LoadingLink } from '@/components/ui/loading-link'

export default function WishlistPageClient() {
  const { refreshCounts } = useCart()
  const [wishlist, setWishlist] = useState<Wishlist | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    loadWishlist()
  }, [isClient])

  const loadWishlist = async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      const wishlistData = await wishlistService.getWishlist()
      setWishlist(wishlistData)
    } catch (error) {
      console.error('Failed to load wishlist:', error)
      setError(error instanceof Error ? error.message : 'Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeItem = async (productId: string) => {
    setRemovingItems(prev => new Set([...prev, productId]))
    try {
      await wishlistService.removeFromWishlist(productId)
      await loadWishlist() // Reload wishlist to get updated data
      await refreshCounts() // Update counts in navigation
    } catch (error) {
      console.error('Failed to remove wishlist item:', error)
      setError(error instanceof Error ? error.message : 'Failed to remove item')
    } finally {
      setRemovingItems(prev => {
        const updated = new Set(prev)
        updated.delete(productId)
        return updated
      })
    }
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (!isClient) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <div className="aspect-[4/5] bg-gray-200 rounded"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-neutral-600">Loading your wishlist...</p>
      </div>
    )
  }

  if (!authService.isAuthenticated()) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-2xl font-light tracking-wide text-black mb-4">
          Sign In Required
        </h1>
        <p className="text-neutral-600 mb-8">
          Please sign in to view your wishlist and save your favorite items.
        </p>
        <div className="space-x-4">
          <Link 
            href="/products"
            className="inline-flex items-center px-6 py-3 border-2 border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:text-black transition-all tracking-wide uppercase font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-light tracking-wide text-black mb-4">
            Unable to Load Wishlist
          </h1>
          <p className="text-red-600 mb-8">{error}</p>
          <button
            onClick={loadWishlist}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-all tracking-wide uppercase font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!wishlist?.items || wishlist.items.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-2xl font-light tracking-wide text-black mb-4">
          Your Wishlist is Empty
        </h1>
        <p className="text-neutral-600 mb-8">
          Save your favorite items to easily find them later.
        </p>
        <Link 
          href="/products"
          className="inline-flex items-center px-8 py-4 bg-black text-white hover:bg-neutral-800 transition-all tracking-wide uppercase font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-black">
            Wishlist
          </h1>
          <div className="text-sm text-neutral-600">
            {wishlist.itemCount} {wishlist.itemCount === 1 ? 'item' : 'items'}
          </div>
        </div>
        <div className="w-16 h-px bg-black"></div>
      </div>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        <AnimatePresence mode="popLayout">
          {wishlist.items.map((item) => {
            const product = item.Product
            const defaultVariant = product.ProductVariant.find(v => v.isDefault) || product.ProductVariant[0]
            const primaryImage = product.ProductImage.find(img => img.isPrimary) || product.ProductImage[0]

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-white border border-neutral-100 hover:border-neutral-200 hover:shadow-lg transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50">
                  {primaryImage && (
                    <LoadingLink href={`/products/${product.slug}`} loadingMessage={`Loading ${product.title}...`}>
                      <img
                        src={primaryImage.url}
                        alt={primaryImage.alt || product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </LoadingLink>
                  )}
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(product.id)}
                    disabled={removingItems.has(product.id)}
                    className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <Trash2 className="w-4 h-4 text-neutral-600 hover:text-red-600" />
                  </button>

                  {/* Out of Stock Overlay */}
                  {defaultVariant && defaultVariant.stock <= 0 && (
                    <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                      <span className="text-sm font-medium text-neutral-600 bg-white px-3 py-1 border border-neutral-200">
                        OUT OF STOCK
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4 space-y-2">
                  {product.brand && (
                    <div className="text-xs tracking-wider text-neutral-500 uppercase font-light">
                      {product.brand}
                    </div>
                  )}
                  
                  <LoadingLink href={`/products/${product.slug}`} loadingMessage={`Loading ${product.title}...`}>
                    <h3 className="font-medium text-black hover:text-neutral-700 transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                  </LoadingLink>

                  {product.shortDescription && (
                    <p className="text-sm text-neutral-600 line-clamp-2">
                      {product.shortDescription}
                    </p>
                  )}

                  {/* Price */}
                  {defaultVariant && (
                    <div className="flex items-center gap-2 pt-2">
                      <span className="font-medium text-black">
                        {formatPrice(defaultVariant.price)}
                      </span>
                      {defaultVariant.compareAtPrice && defaultVariant.compareAtPrice > defaultVariant.price && (
                        <span className="text-sm text-neutral-400 line-through">
                          {formatPrice(defaultVariant.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-3 space-y-2">
                    <Link
                      href={`/products/${product.slug}`}
                      className="w-full h-10 bg-black text-white hover:bg-neutral-800 transition-all tracking-wide uppercase font-medium text-sm flex items-center justify-center"
                    >
                      View Product
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Continue Shopping */}
      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center px-8 py-4 border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all tracking-wide uppercase font-medium"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}