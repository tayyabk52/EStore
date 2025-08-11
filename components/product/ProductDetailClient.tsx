"use client"

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import type { Product } from '@/lib/products-frontend'
import { cartService } from '@/lib/cart'
import { wishlistService } from '@/lib/wishlist'
import { authService } from '@/lib/auth'
import { useCart } from '@/lib/cart-context'

export default function ProductDetailClient({ product }: { product: Product }) {
  const { incrementCartCount, incrementWishlistCount } = useCart()
  const sortedImages = useMemo(
    () => (product.images || [])
      .slice()
      .sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0) || (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [product.images]
  )

  const defaultVariant = useMemo(
    () => product.variants?.find(v => v.isDefault) || product.variants?.[0],
    [product.variants]
  )

  const [selectedVariantId, setSelectedVariantId] = useState<string | undefined>(defaultVariant?.id)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isViewerOpen, setIsViewerOpen] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false)
  const [cartMessage, setCartMessage] = useState('')
  const [wishlistMessage, setWishlistMessage] = useState('')

  const selectedVariant = useMemo(
    () => product.variants?.find(v => v.id === selectedVariantId) || defaultVariant,
    [product.variants, selectedVariantId, defaultVariant]
  )

  const price = selectedVariant ? Number(selectedVariant.price) : 0
  const compareAt = selectedVariant?.compareAtPrice ? Number(selectedVariant.compareAtPrice) : undefined
  const inStock = (selectedVariant?.stock ?? 0) > 0

  const handleAddToCart = async () => {
    if (!selectedVariant) return
    
    if (!authService.isAuthenticated()) {
      setCartMessage('Please login to add items to cart')
      setTimeout(() => setCartMessage(''), 3000)
      return
    }

    setIsAddingToCart(true)
    try {
      await cartService.addToCart(selectedVariant.id, 1)
      incrementCartCount()
      setCartMessage('Added to cart successfully!')
      setTimeout(() => setCartMessage(''), 3000)
    } catch (error) {
      setCartMessage(error instanceof Error ? error.message : 'Failed to add to cart')
      setTimeout(() => setCartMessage(''), 3000)
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleAddToWishlist = async () => {
    if (!authService.isAuthenticated()) {
      setWishlistMessage('Please login to add items to wishlist')
      setTimeout(() => setWishlistMessage(''), 3000)
      return
    }

    setIsAddingToWishlist(true)
    try {
      await wishlistService.addToWishlist(product.id)
      incrementWishlistCount()
      setWishlistMessage('Added to wishlist successfully!')
      setTimeout(() => setWishlistMessage(''), 3000)
    } catch (error) {
      setWishlistMessage(error instanceof Error ? error.message : 'Failed to add to wishlist')
      setTimeout(() => setWishlistMessage(''), 3000)
    } finally {
      setIsAddingToWishlist(false)
    }
  }

  return (
    <div className="w-full">
      {/* Mobile-First Layout */}
      <div className="block lg:hidden">
        {/* Mobile Gallery Section */}
        <div className="relative mb-6">
          <div className="aspect-[4/5] relative overflow-hidden bg-neutral-50 border border-neutral-100 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sortedImages[selectedImageIndex]?.url || ''}
              alt={sortedImages[selectedImageIndex]?.alt || product.title}
              className="w-full h-full object-cover"
              onClick={() => setIsViewerOpen(true)}
            />
          </div>
          
          {/* Mobile Thumbnails - Horizontal Scroll */}
          {sortedImages.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-2 scrollbar-hide">
              {sortedImages.slice(0, 10).map((img, idx) => (
                <button
                  type="button"
                  key={img.id}
                  className={`flex-shrink-0 w-16 h-16 border overflow-hidden transition-all ${
                    idx === selectedImageIndex 
                      ? 'border-black shadow-sm' 
                      : 'border-neutral-200'
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.url} 
                    alt={img.alt || product.title} 
                    className="w-full h-full object-cover" 
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Mobile Product Info */}
        <div className="space-y-6">
          {/* Brand & Title */}
          <div>
            {product.brand && (
              <div className="text-xs tracking-wider text-neutral-500 uppercase font-light mb-1">
                {product.brand}
              </div>
            )}
            <h1 className="text-xl font-light tracking-wide text-black leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Mobile Pricing */}
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-light text-black">
              ${price.toFixed(2)}
            </span>
            {compareAt && compareAt > price && (
              <div className="relative">
                <span className="text-lg text-neutral-400 font-light">
                  ${compareAt.toFixed(2)}
                </span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform -translate-y-1/2"></div>
              </div>
            )}
          </div>

          {!inStock && (
            <div className="inline-flex items-center px-3 py-1.5 bg-neutral-100 border border-neutral-200">
              <span className="text-xs tracking-wide text-neutral-700 uppercase font-medium">
                Currently Unavailable
              </span>
            </div>
          )}

          {/* Mobile Description */}
          {product.shortDescription && (
            <p className="text-sm text-neutral-700 leading-relaxed font-light">
              {product.shortDescription}
            </p>
          )}

          {/* Mobile Variants */}
          {product.variants && product.variants.length > 1 && (
            <div className="border-t border-neutral-200 pt-6">
              <h3 className="text-sm tracking-wider text-neutral-900 uppercase font-medium mb-4">
                Select Option
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map(v => {
                  const isSelected = v.id === selectedVariantId
                  const isAvailable = (v.stock ?? 0) > 0
                  return (
                    <button
                      type="button"
                      key={v.id}
                      className={`p-4 border-2 text-sm text-center transition-all ${
                        isSelected 
                          ? 'border-black bg-black text-white' 
                          : isAvailable 
                          ? 'border-neutral-200 text-neutral-700 bg-white' 
                          : 'border-neutral-100 text-neutral-400 bg-neutral-50'
                      }`}
                      onClick={() => isAvailable && setSelectedVariantId(v.id)}
                      disabled={!isAvailable}
                    >
                      <div className="font-medium tracking-wide">
                        {v.title || v.sku}
                      </div>
                      {!isAvailable && (
                        <div className="text-[10px] uppercase tracking-wider mt-1">
                          Out of Stock
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mobile Action Buttons */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <button
              onClick={handleAddToCart}
              disabled={!inStock || isAddingToCart}
              className={`w-full h-12 text-sm transition-all tracking-wide uppercase font-medium border-2 ${
                inStock 
                  ? 'bg-black hover:bg-neutral-800 text-white border-black hover:border-neutral-800' 
                  : 'bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed'
              } ${isAddingToCart ? 'opacity-75' : ''}`}
            >
              {isAddingToCart ? 'Adding...' : inStock ? 'Add to Cart' : 'Currently Unavailable'}
            </button>
            
            <button 
              onClick={handleAddToWishlist}
              disabled={isAddingToWishlist}
              className={`w-full h-12 text-sm border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all tracking-wide uppercase font-medium ${
                isAddingToWishlist ? 'opacity-75' : ''
              }`}
            >
              {isAddingToWishlist ? 'Adding...' : 'Add to Wishlist'}
            </button>
            
            {/* Mobile Messages */}
            {(cartMessage || wishlistMessage) && (
              <div className={`text-center p-3 text-sm font-medium ${
                cartMessage?.includes('success') || wishlistMessage?.includes('success') 
                  ? 'bg-green-50 text-green-700 border border-green-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {cartMessage || wishlistMessage}
              </div>
            )}
            
            <div className="text-center pt-4">
              <div className="text-[10px] tracking-wider text-neutral-600 uppercase font-light mb-2">
                Secure Checkout Available
              </div>
              <div className="flex items-center justify-center gap-2 opacity-60">
                <div className="text-[10px] tracking-wider text-neutral-500">VISA</div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                <div className="text-[10px] tracking-wider text-neutral-500">MASTERCARD</div>
                <div className="w-0.5 h-0.5 rounded-full bg-neutral-400"></div>
                <div className="text-[10px] tracking-wider text-neutral-500">PAYPAL</div>
              </div>
            </div>
          </div>

          {/* Mobile Product Details */}
          {product.description && (
            <div className="border-t border-neutral-200 pt-6">
              <div className="mb-4">
                <h2 className="text-base font-medium tracking-wide text-black uppercase mb-2">
                  Product Details
                </h2>
                <div className="w-8 h-px bg-black"></div>
              </div>
              <div className="text-sm text-neutral-700 leading-relaxed font-light whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {product.details && typeof product.details === 'object' && (
            <div className="border-t border-neutral-200 pt-6">
              <div className="mb-4">
                <h3 className="text-base font-medium tracking-wide text-black uppercase mb-2">
                  Specifications
                </h3>
                <div className="w-8 h-px bg-black"></div>
              </div>
              <dl className="space-y-4">
                {Object.entries(product.details as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center">
                    <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                      {formatKey(key)}
                    </dt>
                    <dd className="text-sm text-neutral-800 font-light">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Mobile Item Information */}
          <div className="border-t border-neutral-200 pt-6">
            <div className="mb-4">
              <h3 className="text-base font-medium tracking-wide text-black uppercase mb-2">
                Item Information
              </h3>
              <div className="w-8 h-px bg-black"></div>
            </div>
            <dl className="space-y-4">
              {selectedVariant && (
                <>
                  <div className="flex justify-between items-center">
                    <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                      Product Code
                    </dt>
                    <dd className="text-sm text-neutral-800 font-light font-mono">
                      {selectedVariant.sku}
                    </dd>
                  </div>
                  {selectedVariant.barcode && (
                    <div className="flex justify-between items-center">
                      <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                        Barcode
                      </dt>
                      <dd className="text-sm text-neutral-800 font-light font-mono">
                        {selectedVariant.barcode}
                      </dd>
                    </div>
                  )}
                  {(selectedVariant.weightGrams ?? 0) > 0 && (
                    <div className="flex justify-between items-center">
                      <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                        Weight
                      </dt>
                      <dd className="text-sm text-neutral-800 font-light">
                        {selectedVariant.weightGrams} grams
                      </dd>
                    </div>
                  )}
                  {hasAnyDimension(selectedVariant) && (
                    <div className="flex justify-between items-center">
                      <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                        Dimensions
                      </dt>
                      <dd className="text-sm text-neutral-800 font-light">
                        {formatDimensions(selectedVariant)}
                      </dd>
                    </div>
                  )}
                </>
              )}
              {product.category && (
                <div className="flex justify-between items-center">
                  <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                    Category
                  </dt>
                  <dd className="text-sm text-neutral-800 font-light">
                    {product.category.displayName || product.category.name}
                  </dd>
                </div>
              )}
              <div className="flex justify-between items-center">
                <dt className="text-xs tracking-wider text-neutral-500 uppercase font-medium">
                  Availability
                </dt>
                <dd className={`text-sm font-light ${
                  inStock ? 'text-green-700' : 'text-red-700'
                }`}>
                  {inStock ? 'In Stock' : 'Out of Stock'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Desktop Layout (lg and above) */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-12 xl:gap-16">
        {/* Desktop Gallery */}
        <div>
          <div className="group relative aspect-[4/5] bg-gradient-to-br from-neutral-50 to-neutral-100 border border-neutral-100 overflow-hidden mb-8 shadow-lg hover:shadow-2xl transition-all duration-500">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={sortedImages[selectedImageIndex]?.url || ''}
              alt={sortedImages[selectedImageIndex]?.alt || product.title}
              className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105 cursor-zoom-in"
              onClick={() => setIsViewerOpen(true)}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Zoom Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <div className="w-4 h-4 flex items-center justify-center">
                  <div className="w-2 h-2 border border-black rounded-full relative">
                    <div className="absolute -right-1 -bottom-1 w-1 h-1 border-r border-b border-black transform rotate-45"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {sortedImages.length > 1 && (
            <div className="grid grid-cols-6 gap-4">
              {sortedImages.slice(0, 12).map((img, idx) => (
                <button
                  type="button"
                  key={img.id}
                  className={`group/thumb relative aspect-square bg-neutral-50 border overflow-hidden focus:outline-none transition-all duration-300 ${
                    idx === selectedImageIndex 
                      ? 'border-black shadow-lg' 
                      : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedImageIndex(idx)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={img.url} 
                    alt={img.alt || product.title} 
                    className="w-full h-full object-cover transition-all duration-300 group-hover/thumb:scale-105" 
                  />
                  {idx === selectedImageIndex && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Desktop Product Details */}
        <div className="space-y-10">
          {/* Product Header */}
          <div className="space-y-4">
            {product.brand && (
              <div className="text-xs tracking-[0.2em] text-neutral-500 uppercase font-light">
                {product.brand}
              </div>
            )}
            <h1 className="text-4xl font-light tracking-wide text-black leading-tight">
              {product.title}
            </h1>
          </div>

          {/* Premium Pricing */}
          <div className="space-y-4">
            <div className="flex items-baseline gap-4 flex-wrap">
              <span className="text-4xl font-light text-black tracking-wide">
                ${price.toFixed(2)}
              </span>
              {compareAt && compareAt > price && (
                <div className="relative">
                  <span className="text-xl text-neutral-400 font-light tracking-wide">
                    ${compareAt.toFixed(2)}
                  </span>
                  <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform -translate-y-1/2"></div>
                </div>
              )}
            </div>
            
            {!inStock && (
              <div className="inline-flex items-center px-4 py-2 bg-neutral-100 border border-neutral-200">
                <span className="text-sm tracking-wide text-neutral-700 uppercase font-medium">
                  Currently Unavailable
                </span>
              </div>
            )}
          </div>

          {product.shortDescription && (
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-700 leading-relaxed font-light text-lg">
                {product.shortDescription}
              </p>
            </div>
          )}

          {/* Luxury Variant Selection */}
          {product.variants && product.variants.length > 1 && (
            <div className="space-y-4 pt-6 border-t border-neutral-200">
              <h3 className="text-sm tracking-[0.1em] text-neutral-900 uppercase font-medium">
                Select Option
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {product.variants.map(v => {
                  const isSelected = v.id === selectedVariantId
                  const isAvailable = (v.stock ?? 0) > 0
                  return (
                    <motion.button
                      type="button"
                      key={v.id}
                      whileHover={{ scale: isAvailable ? 1.02 : 1 }}
                      whileTap={{ scale: isAvailable ? 0.98 : 1 }}
                      className={`p-4 border-2 text-sm transition-all duration-300 ${
                        isSelected 
                          ? 'border-black bg-black text-white' 
                          : isAvailable 
                          ? 'border-neutral-200 text-neutral-700 hover:border-neutral-300 bg-white hover:bg-neutral-50' 
                          : 'border-neutral-100 text-neutral-400 bg-neutral-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && setSelectedVariantId(v.id)}
                      disabled={!isAvailable}
                      aria-pressed={isSelected}
                    >
                      <div className="text-center">
                        <div className="font-medium tracking-wide mb-1">
                          {v.title || v.sku}
                        </div>
                        {!isAvailable && (
                          <div className="text-xs uppercase tracking-wider">
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Premium Action Buttons */}
          <div className="space-y-4">
            <motion.button
              onClick={handleAddToCart}
              whileHover={{ scale: inStock && !isAddingToCart ? 1.02 : 1 }}
              whileTap={{ scale: inStock && !isAddingToCart ? 0.98 : 1 }}
              disabled={!inStock || isAddingToCart}
              className={`w-full h-16 text-lg transition-all duration-300 tracking-[0.1em] uppercase font-medium border-2 ${
                inStock 
                  ? 'bg-black hover:bg-neutral-800 text-white border-black hover:border-neutral-800 shadow-lg hover:shadow-xl' 
                  : 'bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed'
              } ${isAddingToCart ? 'opacity-75' : ''}`}
            >
              {isAddingToCart ? 'Adding to Cart...' : inStock ? 'Add to Cart' : 'Currently Unavailable'}
            </motion.button>
            
            <motion.button
              onClick={handleAddToWishlist}
              whileHover={{ scale: !isAddingToWishlist ? 1.02 : 1 }}
              whileTap={{ scale: !isAddingToWishlist ? 0.98 : 1 }}
              disabled={isAddingToWishlist}
              className={`w-full h-16 text-lg border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all duration-300 tracking-[0.1em] uppercase font-medium ${
                isAddingToWishlist ? 'opacity-75' : ''
              }`}
            >
              {isAddingToWishlist ? 'Adding to Wishlist...' : 'Add to Wishlist'}
            </motion.button>
            
            {/* Desktop Messages */}
            {(cartMessage || wishlistMessage) && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`text-center p-4 text-sm font-medium tracking-wide ${
                  cartMessage?.includes('success') || wishlistMessage?.includes('success') 
                    ? 'bg-green-50 text-green-700 border border-green-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}
              >
                {cartMessage || wishlistMessage}
              </motion.div>
            )}
            
            <div className="pt-4 text-center space-y-2">
              <div className="text-xs tracking-[0.1em] text-neutral-600 uppercase font-light">
                Secure Checkout Available
              </div>
              <div className="flex items-center justify-center gap-4 opacity-60">
                <div className="text-xs tracking-wider text-neutral-500">VISA</div>
                <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                <div className="text-xs tracking-wider text-neutral-500">MASTERCARD</div>
                <div className="w-1 h-1 rounded-full bg-neutral-400"></div>
                <div className="text-xs tracking-wider text-neutral-500">PAYPAL</div>
              </div>
            </div>
          </div>

          {/* Premium Description Section */}
          {product.description && (
            <div className="pt-8 border-t border-neutral-200">
              <div className="mb-6">
                <h2 className="text-xl font-light tracking-[0.1em] text-black uppercase mb-4">
                  Product Details
                </h2>
                <div className="w-12 h-px bg-black"></div>
              </div>
              <div className="prose prose-neutral max-w-none">
                <p className="text-neutral-700 leading-relaxed font-light text-lg whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            </div>
          )}

          {/* Premium Product Specifications */}
          {product.details && typeof product.details === 'object' && (
            <div className="pt-8 border-t border-neutral-200">
              <div className="mb-6">
                <h3 className="text-xl font-light tracking-[0.1em] text-black uppercase mb-4">
                  Specifications
                </h3>
                <div className="w-12 h-px bg-black"></div>
              </div>
              <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(product.details as Record<string, any>).map(([key, value]) => (
                  <div key={key} className="flex flex-col space-y-2">
                    <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                      {formatKey(key)}
                    </dt>
                    <dd className="text-base text-neutral-800 font-light">
                      {String(value)}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* Premium Item Information */}
          <div className="pt-8 border-t border-neutral-200">
            <div className="mb-6">
              <h3 className="text-xl font-light tracking-[0.1em] text-black uppercase mb-4">
                Item Information
              </h3>
              <div className="w-12 h-px bg-black"></div>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-6">
              {selectedVariant && (
                <>
                  <div className="flex flex-col space-y-2">
                    <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                      Product Code
                    </dt>
                    <dd className="text-base text-neutral-800 font-light font-mono">
                      {selectedVariant.sku}
                    </dd>
                  </div>
                  {selectedVariant.barcode && (
                    <div className="flex flex-col space-y-2">
                      <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                        Barcode
                      </dt>
                      <dd className="text-base text-neutral-800 font-light font-mono">
                        {selectedVariant.barcode}
                      </dd>
                    </div>
                  )}
                  {(selectedVariant.weightGrams ?? 0) > 0 && (
                    <div className="flex flex-col space-y-2">
                      <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                        Weight
                      </dt>
                      <dd className="text-base text-neutral-800 font-light">
                        {selectedVariant.weightGrams} grams
                      </dd>
                    </div>
                  )}
                  {hasAnyDimension(selectedVariant) && (
                    <div className="flex flex-col space-y-2">
                      <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                        Dimensions
                      </dt>
                      <dd className="text-base text-neutral-800 font-light">
                        {formatDimensions(selectedVariant)}
                      </dd>
                    </div>
                  )}
                </>
              )}
              {product.category && (
                <div className="flex flex-col space-y-2">
                  <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                    Category
                  </dt>
                  <dd className="text-base text-neutral-800 font-light">
                    {product.category.displayName || product.category.name}
                  </dd>
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <dt className="text-xs tracking-[0.15em] text-neutral-500 uppercase font-medium">
                  Availability
                </dt>
                <dd className={`text-base font-light ${
                  inStock ? 'text-green-700' : 'text-red-700'
                }`}>
                  {inStock ? 'In Stock - Ready to Ship' : 'Currently Out of Stock'}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Fullscreen Viewer */}
      <Dialog open={isViewerOpen} onOpenChange={setIsViewerOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">Product Image Viewer</DialogTitle>
          <div className="relative bg-black">
            <AnimatePresence mode="popLayout">
              <motion.img
                key={sortedImages[selectedImageIndex]?.id || selectedImageIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                src={sortedImages[selectedImageIndex]?.url || ''}
                alt={sortedImages[selectedImageIndex]?.alt || product.title}
                className="w-full h-full object-contain max-h-[80vh] bg-black"
              />
            </AnimatePresence>
            {sortedImages.length > 1 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 flex gap-2 overflow-x-auto">
                {sortedImages.slice(0, 20).map((img, idx) => (
                  <button
                    type="button"
                    key={img.id}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`shrink-0 border ${idx === selectedImageIndex ? 'border-white' : 'border-transparent'}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt={img.alt || product.title} className="h-14 w-14 object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatKey(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]+/g, ' ')
    .replace(/^\w/, s => s.toUpperCase())
}

function hasAnyDimension(v: any) {
  return (v.lengthCm ?? 0) > 0 || (v.widthCm ?? 0) > 0 || (v.heightCm ?? 0) > 0
}

function formatDimensions(v: any) {
  const parts: string[] = []
  if ((v.lengthCm ?? 0) > 0) parts.push(`${v.lengthCm} cm L`)
  if ((v.widthCm ?? 0) > 0) parts.push(`${v.widthCm} cm W`)
  if ((v.heightCm ?? 0) > 0) parts.push(`${v.heightCm} cm H`)
  return parts.join(' × ')
}
