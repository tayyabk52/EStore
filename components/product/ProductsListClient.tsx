"use client"

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Grid, List, Filter } from 'lucide-react'
import Link from 'next/link'
import { cartService } from '@/lib/cart'
import { wishlistService } from '@/lib/wishlist'
import { authService } from '@/lib/auth'
import { useCart } from '@/lib/cart-context'

type Image = { url: string; alt?: string; isPrimary?: boolean; sortOrder?: number }
type Variant = { id: string; price: number; compareAtPrice?: number; stock: number; isDefault?: boolean; currency?: string }

export interface ListingProduct {
  id: string
  slug: string
  title: string
  brand?: string
  shortDescription?: string
  images?: Image[]
  variants?: Variant[]
  isNewArrival?: boolean
  isOnSale?: boolean
  isFeatured?: boolean
  category?: { name: string; displayName?: string }
}

export default function ProductsListClient({ products }: { products: ListingProduct[] }) {
  const { incrementCartCount, incrementWishlistCount } = useCart()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-low' | 'price-high'>('featured')
  const [loadingCart, setLoadingCart] = useState<string | null>(null)
  const [loadingWishlist, setLoadingWishlist] = useState<string | null>(null)
  const [messages, setMessages] = useState<{ [key: string]: string }>({})

  const showMessage = (productId: string, message: string) => {
    setMessages(prev => ({ ...prev, [productId]: message }))
    setTimeout(() => {
      setMessages(prev => {
        const { [productId]: _, ...rest } = prev
        return rest
      })
    }, 3000)
  }

  const handleAddToCart = async (product: ListingProduct) => {
    if (!authService.isAuthenticated()) {
      showMessage(product.id, 'Please login to add items to cart')
      return
    }

    const variant = (product.variants || []).find(v => v.isDefault) || (product.variants || [])[0]
    if (!variant) {
      showMessage(product.id, 'Product variant not available')
      return
    }

    setLoadingCart(product.id)
    try {
      await cartService.addToCart(variant.id, 1)
      incrementCartCount()
      showMessage(product.id, 'Added to cart successfully!')
    } catch (error) {
      showMessage(product.id, error instanceof Error ? error.message : 'Failed to add to cart')
    } finally {
      setLoadingCart(null)
    }
  }

  const handleAddToWishlist = async (product: ListingProduct) => {
    if (!authService.isAuthenticated()) {
      showMessage(product.id, 'Please login to add items to wishlist')
      return
    }

    setLoadingWishlist(product.id)
    try {
      await wishlistService.addToWishlist(product.id)
      incrementWishlistCount()
      showMessage(product.id, 'Added to wishlist successfully!')
    } catch (error) {
      showMessage(product.id, error instanceof Error ? error.message : 'Failed to add to wishlist')
    } finally {
      setLoadingWishlist(null)
    }
  }

  const sorted = useMemo(() => {
    const arr = products.slice()
    switch (sortBy) {
      case 'price-low':
        return arr.sort((a, b) => (getPriceInfo(a).price ?? Infinity) - (getPriceInfo(b).price ?? Infinity))
      case 'price-high':
        return arr.sort((a, b) => (getPriceInfo(b).price ?? 0) - (getPriceInfo(a).price ?? 0))
      case 'newest':
        return arr // Placeholder: server already orders by createdAt
      default:
        return arr
    }
  }, [products, sortBy])

  return (
    <section className="py-4 sm:py-6 lg:py-10 bg-gradient-to-b from-neutral-50/20 to-white">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8 max-w-7xl">
        {/* Luxury Controls Bar */}
        <div className="flex flex-col gap-6 sm:gap-8 lg:gap-10 mb-8 sm:mb-10 lg:mb-12">
          
          {/* Brand Identity Bar */}
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-neutral-300"></div>
              <span className="text-xs sm:text-sm tracking-[0.25em] text-neutral-500 uppercase font-light px-4">
                LUXURY COLLECTION
              </span>
              <div className="w-12 h-px bg-gradient-to-r from-neutral-300 via-neutral-300 to-transparent"></div>
            </div>
          </div>

          {/* Controls Section */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-6 lg:gap-8">
            
            {/* Left Section - Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="group relative overflow-hidden border-2 border-neutral-200 hover:border-neutral-300 rounded-none px-8 sm:px-10 lg:px-12 py-4 sm:py-5 text-sm sm:text-base text-neutral-700 hover:text-black bg-white hover:bg-neutral-50 flex items-center justify-center transition-all duration-300 font-light tracking-[0.1em] uppercase"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-50/0 via-neutral-50/80 to-neutral-50/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 mr-3 sm:mr-4 relative z-10" />
                <span className="relative z-10">
                  <span className="sm:hidden">Filter Selection</span>
                  <span className="hidden sm:inline">Refine Selection</span>
                </span>
              </motion.button>
              
              <div className="hidden sm:flex items-center text-xs tracking-[0.2em] text-neutral-400 uppercase font-light">
                <span>{sorted.length} Items Available</span>
              </div>
            </div>

            {/* Right Section - View & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6">
              
              {/* View Toggle - Luxury Style */}
              <div className="flex items-center border border-neutral-200 bg-white">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-center transition-all duration-300 ${
                    viewMode === 'grid' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                >
                  <Grid className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-xs sm:text-sm tracking-[0.1em] uppercase font-light">Grid</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`px-6 sm:px-8 py-4 sm:py-5 flex items-center justify-center transition-all duration-300 ${
                    viewMode === 'list' 
                      ? 'bg-black text-white' 
                      : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                >
                  <List className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  <span className="text-xs sm:text-sm tracking-[0.1em] uppercase font-light">List</span>
                </motion.button>
              </div>

              {/* Sort Dropdown - Luxury Style */}
              <div className="relative group">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none border border-neutral-200 bg-white pl-6 sm:pl-8 pr-12 sm:pr-16 py-4 sm:py-5 text-sm sm:text-base text-neutral-700 hover:text-black hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:border-neutral-400 transition-all duration-300 cursor-pointer tracking-[0.1em] uppercase font-light min-w-[180px] sm:min-w-[220px]"
                >
                  <option value="featured">Featured Selection</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 sm:pr-6 pointer-events-none">
                  <div className="w-3 h-3 border-r-2 border-b-2 border-neutral-400 rotate-45 group-hover:border-black transition-colors duration-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Responsive Products Grid - Optimized Proportions */}
        {viewMode === 'grid' && (
          <div className="grid gap-3 sm:gap-4 lg:gap-5 xl:gap-6 grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p, index) => {
            const primaryImage = getPrimaryImage(p)
            const { price, compareAt, currency } = getPriceInfo(p)
            const inStock = getInStock(p)
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 20, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="group relative bg-white border border-neutral-100/60 hover:border-neutral-200/80 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] sm:hover:shadow-[0_15px_45px_rgba(0,0,0,0.08)] rounded-xl sm:rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col"
              >
                <Link href={`/products/${p.slug}`} className="block relative overflow-hidden rounded-t-xl sm:rounded-t-2xl">
                  <div className="aspect-[4/5] bg-gradient-to-br from-neutral-50 to-neutral-100 relative overflow-hidden">
                    {primaryImage ? (
                      <img 
                        src={primaryImage} 
                        alt={p.title} 
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.03] sm:group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <div className="text-center">
                          <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 mx-auto mb-2 sm:mb-3 rounded-full bg-neutral-200 flex items-center justify-center">
                            <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-6 lg:h-6" />
                          </div>
                          <p className="text-xs sm:text-sm tracking-wide">No Image</p>
                        </div>
                      </div>
                    )}
                    
                    {/* Subtle overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Mobile-optimized Status Badges */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 space-y-1">
                    {p.isFeatured && (
                      <span className="inline-block bg-white/95 backdrop-blur-sm text-black px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase shadow-lg border border-black/10 rounded-full">
                        <span className="hidden sm:inline">★ </span>FEATURED
                      </span>
                    )}
                    {(p as any).isBestseller && (
                      <span className="inline-block bg-amber-50/95 backdrop-blur-sm text-amber-800 px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase shadow-lg border border-amber-200 rounded-full">
                        <span className="hidden sm:inline">♔ </span>BEST
                      </span>
                    )}
                  </div>

                  {/* Mobile-optimized New/Sale Indicators */}
                  <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 flex flex-col space-y-1">
                    {p.isNewArrival && (
                      <span className="bg-black text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase shadow-lg rounded-full">
                        NEW
                      </span>
                    )}
                    {p.isOnSale && (
                      <span className="bg-red-600 text-white px-2 sm:px-3 py-1 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] sm:tracking-[0.15em] uppercase shadow-lg rounded-full">
                        SALE
                      </span>
                    )}
                  </div>

                  {/* Quick Actions - Desktop Only */}
                  <div className="hidden lg:flex absolute bottom-3 lg:bottom-4 right-3 lg:right-4 space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: 3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToWishlist(p)
                      }}
                      disabled={loadingWishlist === p.id}
                      className={`w-10 h-10 lg:w-12 lg:h-12 bg-white/95 hover:bg-white text-black rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all duration-300 ${
                        loadingWishlist === p.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.1, rotate: -3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(p)
                      }}
                      disabled={!inStock || loadingCart === p.id}
                      className={`w-10 h-10 lg:w-12 lg:h-12 bg-black/90 hover:bg-black text-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${
                        (!inStock || loadingCart === p.id) ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5" />
                    </motion.button>
                  </div>

                  {/* Mobile-friendly Out of Stock Overlay */}
                  {!inStock && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/70 via-neutral-800/50 to-neutral-900/70 backdrop-blur-sm text-white flex items-center justify-center">
                      <div className="text-center px-2">
                        <div className="text-xs sm:text-sm font-light tracking-[0.15em] sm:tracking-[0.2em] uppercase mb-0.5 sm:mb-1">
                          <span className="hidden sm:inline">Currently </span>Unavailable
                        </div>
                        <div className="hidden sm:block text-sm lg:text-lg font-medium tracking-[0.1em] uppercase opacity-80">Out of Stock</div>
                      </div>
                    </div>
                  )}
                </Link>

                {/* Dynamic Product Info - Smart Responsive Layout */}
                <div className="p-3 sm:p-4 lg:p-5 bg-gradient-to-b from-white to-neutral-50/20 flex flex-col">
                  
                  {/* Brand */}
                  {p.brand && (
                    <div className="text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-neutral-500 uppercase font-light mb-1 sm:mb-2">
                      {p.brand}
                    </div>
                  )}
                  
                  {/* Title - Dynamic but consistent */}
                  <Link href={`/products/${p.slug}`} className="block group/title mb-2 sm:mb-3">
                    <h3 className="text-sm sm:text-base lg:text-lg font-light text-neutral-900 group-hover/title:text-black transition-colors duration-300 line-clamp-2 leading-tight sm:leading-snug min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem]">
                      {p.title}
                    </h3>
                  </Link>
                  
                  {/* Category */}
                  {p.category && (
                    <p className="text-xs sm:text-sm text-neutral-600 tracking-wide font-light mb-3 sm:mb-4 line-clamp-1">
                      {p.category.displayName || p.category.name}
                    </p>
                  )}
                  
                  {/* Price Section - Compact */}
                  <div className="mb-3 sm:mb-4">
                    <div className="flex items-baseline gap-2 sm:gap-3 flex-wrap">
                      <span className="text-base sm:text-lg lg:text-xl font-light text-neutral-900 tracking-wide">
                        {formatPrice(price, currency)}
                      </span>
                      {compareAt && compareAt > price && (
                        <div className="relative inline-block">
                          <span className="text-xs sm:text-sm lg:text-base text-neutral-400 tracking-wide font-light">
                            {formatPrice(compareAt, currency)}
                          </span>
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform -translate-y-1/2"></div>
                        </div>
                      )}
                    </div>
                    
                    {/* Tags - Only show if present, no fixed height */}
                    {renderCleanTags(p) && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {renderCleanTags(p)}
                      </div>
                    )}
                  </div>
                  
                  {/* Compact Action Buttons */}
                  <div className="space-y-2 mt-auto">
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToCart(p)
                      }}
                      className={`w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm transition-all duration-300 tracking-[0.05em] sm:tracking-[0.1em] uppercase font-medium ${
                        inStock && loadingCart !== p.id
                          ? 'bg-black text-white hover:bg-neutral-800 border border-black hover:border-neutral-800' 
                          : 'bg-neutral-200 text-neutral-500 cursor-not-allowed border border-neutral-200'
                      }`}
                      disabled={!inStock || loadingCart === p.id}
                    >
                      {loadingCart === p.id ? (
                        <>
                          <span className="sm:hidden">Adding...</span>
                          <span className="hidden sm:inline">Adding...</span>
                        </>
                      ) : inStock ? (
                        <>
                          <span className="sm:hidden">Add Cart</span>
                          <span className="hidden sm:inline">Add to Cart</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Out of Stock</span>
                          <span className="hidden sm:inline">Out of Stock</span>
                        </>
                      )}
                    </motion.button>
                    
                    <motion.button 
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={(e) => {
                        e.preventDefault()
                        handleAddToWishlist(p)
                      }}
                      className={`w-full h-9 sm:h-10 lg:h-11 text-xs sm:text-sm border border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all duration-300 tracking-[0.05em] sm:tracking-[0.1em] uppercase font-medium ${
                        loadingWishlist === p.id ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                      disabled={loadingWishlist === p.id}
                    >
                      {loadingWishlist === p.id ? (
                        <>
                          <span className="sm:hidden">Adding...</span>
                          <span className="hidden sm:inline">Adding...</span>
                        </>
                      ) : (
                        <>
                          <span className="sm:hidden">Save</span>
                          <span className="hidden sm:inline">Wishlist</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                  {/* Message Display */}
                  {messages[p.id] && (
                    <div className={`text-center p-2 text-xs font-medium ${
                      messages[p.id]?.includes('success') 
                        ? 'bg-green-50 text-green-700 border-t border-green-200' 
                        : 'bg-red-50 text-red-700 border-t border-red-200'
                    }`}>
                      {messages[p.id]}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
          </div>
        )}

        {/* Mobile-Optimized List View */}
        {viewMode === 'list' && (
          <div className="space-y-4 sm:space-y-5 lg:space-y-6">
            {sorted.map((p, index) => {
              const primaryImage = getPrimaryImage(p)
              const { price, compareAt, currency } = getPriceInfo(p)
              const inStock = getInStock(p)
              return (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 20, filter: "blur(1px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.4, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
                  className="group bg-white border border-neutral-100/60 hover:border-neutral-200/80 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-stretch gap-3 sm:gap-4 lg:gap-6 xl:gap-8 p-3 sm:p-4 lg:p-6 xl:p-8">
                    <Link href={`/products/${p.slug}`} className="block shrink-0 group/image">
                      <div className="relative w-20 sm:w-28 lg:w-36 xl:w-44 aspect-[4/5] bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg sm:rounded-xl overflow-hidden shadow-md group-hover/image:shadow-xl transition-shadow duration-300">
                        {primaryImage ? (
                          <img 
                            src={primaryImage} 
                            alt={p.title} 
                            className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover/image:scale-105"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-400">
                            <div className="text-center">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-12 lg:h-12 mx-auto mb-1 sm:mb-2 rounded-full bg-neutral-200 flex items-center justify-center">
                                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                              </div>
                              <p className="text-[10px] sm:text-xs tracking-wide">No Image</p>
                            </div>
                          </div>
                        )}
                        
                        {/* Subtle overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/3 via-transparent to-transparent opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>
                        
                        {/* Mobile status badges on image */}
                        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 space-y-1">
                          {p.isNewArrival && (
                            <span className="bg-black text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[7px] sm:text-[8px] font-bold tracking-[0.1em] uppercase rounded-full shadow-lg">
                              NEW
                            </span>
                          )}
                          {p.isOnSale && (
                            <span className="bg-red-600 text-white px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[7px] sm:text-[8px] font-bold tracking-[0.1em] uppercase rounded-full shadow-lg">
                              SALE
                            </span>
                          )}
                        </div>
                        
                        {!inStock && (
                          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900/70 via-neutral-800/50 to-neutral-900/70 backdrop-blur-sm text-white flex items-center justify-center rounded-lg sm:rounded-xl">
                            <div className="text-center px-1">
                              <div className="text-[8px] sm:text-xs font-light tracking-[0.1em] sm:tracking-[0.15em] uppercase">
                                <span className="hidden sm:inline">Currently </span>Unavailable
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                    
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2 sm:gap-3 lg:gap-4">
                      <div className="space-y-2 sm:space-y-3">
                        {p.brand && (
                          <div className="text-[9px] sm:text-[10px] lg:text-[11px] tracking-[0.15em] sm:tracking-[0.2em] text-neutral-500 uppercase font-light">
                            {p.brand}
                          </div>
                        )}
                        
                        <div className="flex items-start justify-between gap-2 sm:gap-4">
                          <Link href={`/products/${p.slug}`} className="block group/title flex-1 min-w-0">
                            <h3 className="text-sm sm:text-base lg:text-lg xl:text-xl font-light text-neutral-900 group-hover/title:text-black transition-colors duration-300 line-clamp-2 leading-tight sm:leading-snug lg:leading-relaxed">
                              {p.title}
                            </h3>
                          </Link>
                          
                          {/* Premium badges - hide on mobile if too cramped */}
                          <div className="hidden sm:flex flex-col gap-1 lg:gap-2 shrink-0">
                            {p.isFeatured && (
                              <span className="bg-white/95 backdrop-blur-sm text-black px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[9px] font-bold tracking-[0.1em] lg:tracking-[0.15em] uppercase shadow-xl border border-black/10 rounded-full">
                                <span className="lg:inline hidden">★ </span>FEATURED
                              </span>
                            )}
                            {(p as any).isBestseller && (
                              <span className="bg-amber-50/95 backdrop-blur-sm text-amber-800 px-2 lg:px-3 py-1 lg:py-1.5 text-[8px] lg:text-[9px] font-bold tracking-[0.1em] lg:tracking-[0.15em] uppercase shadow-xl border border-amber-200 rounded-full">
                                <span className="lg:inline hidden">♔ </span>BEST
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {p.category && (
                          <p className="text-xs sm:text-sm text-neutral-600 tracking-wide font-light line-clamp-1">
                            {p.category.displayName || p.category.name}
                          </p>
                        )}
                        
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-light text-neutral-900 tracking-wide">
                              {formatPrice(price, currency)}
                            </span>
                            {compareAt && compareAt > price && (
                              <div className="relative inline-block">
                                <span className="text-sm sm:text-base lg:text-lg text-neutral-400 tracking-wide font-light">
                                  {formatPrice(compareAt, currency)}
                                </span>
                                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-neutral-400 transform -translate-y-1/2"></div>
                              </div>
                            )}
                          </div>
                          
                          {/* Mobile badges */}
                          <div className="flex sm:hidden flex-wrap gap-1 max-w-[30%]">
                            {renderInlineTags(p)}
                          </div>
                        </div>
                      </div>
                      
                      {/* Clean Tags Section - Only non-redundant */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {renderCleanTags(p)}
                      </div>

                      {/* Premium Action Section */}
                      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-neutral-100">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1">
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(p)
                            }}
                            className={`flex-1 sm:flex-none sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base transition-all duration-300 tracking-[0.1em] uppercase font-light border-2 ${
                              inStock && loadingCart !== p.id
                                ? 'bg-black text-white hover:bg-neutral-800 border-black hover:border-neutral-800' 
                                : 'bg-neutral-200 text-neutral-500 cursor-not-allowed border-neutral-200'
                            }`}
                            disabled={!inStock || loadingCart === p.id}
                          >
                            {loadingCart === p.id ? (
                              <>
                                <span className="sm:hidden">Adding...</span>
                                <span className="hidden sm:inline">Adding...</span>
                              </>
                            ) : inStock ? (
                              <>
                                <span className="sm:hidden">Add to Cart</span>
                                <span className="hidden sm:inline">Add to Cart</span>
                              </>
                            ) : (
                              <>
                                <span className="sm:hidden">Out of Stock</span>
                                <span className="hidden sm:inline">Currently Unavailable</span>
                              </>
                            )}
                          </motion.button>
                          
                          <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToWishlist(p)
                            }}
                            className={`flex-1 sm:flex-none sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-4 text-xs sm:text-sm lg:text-base border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all duration-300 tracking-[0.1em] uppercase font-light ${
                              loadingWishlist === p.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            disabled={loadingWishlist === p.id}
                          >
                            {loadingWishlist === p.id ? (
                              <>
                                <span className="sm:hidden">Adding...</span>
                                <span className="hidden sm:inline">Adding...</span>
                              </>
                            ) : (
                              <>
                                <span className="sm:hidden">Save</span>
                                <span className="hidden sm:inline">Add to Wishlist</span>
                              </>
                            )}
                          </motion.button>
                        </div>
                        
                        {/* Quick actions - desktop only */}
                        <div className="hidden lg:flex items-center gap-2">
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToWishlist(p)
                            }}
                            disabled={loadingWishlist === p.id}
                            className={`w-10 h-10 lg:w-12 lg:h-12 bg-neutral-50 hover:bg-white text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-300 flex items-center justify-center transition-all duration-300 ${
                              loadingWishlist === p.id ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                          </motion.button>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                              e.preventDefault()
                              handleAddToCart(p)
                            }}
                            disabled={!inStock || loadingCart === p.id}
                            className={`w-10 h-10 lg:w-12 lg:h-12 bg-black hover:bg-neutral-800 text-white border border-black hover:border-neutral-800 flex items-center justify-center transition-all duration-300 ${
                              (!inStock || loadingCart === p.id) ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                          >
                            <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5" />
                          </motion.button>
                        </div>
                      </div>

                      {/* Message Display for List View */}
                      {messages[p.id] && (
                        <div className={`text-center p-3 text-sm font-medium mt-4 ${
                          messages[p.id]?.includes('success') 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {messages[p.id]}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

function getPrimaryImage(p: ListingProduct): string | undefined {
  const images = p.images || []
  const primary = images.find(i => i.isPrimary)?.url || images[0]?.url
  return primary
}

function getPriceInfo(p: ListingProduct): { price: number; compareAt?: number; currency?: string } {
  const v = (p.variants || []).find(v => v.isDefault) || (p.variants || [])[0]
  if (!v) return { price: 0 }
  return { price: Number(v.price), compareAt: v.compareAtPrice ? Number(v.compareAtPrice) : undefined, currency: v.currency }
}

function getInStock(p: ListingProduct): boolean {
  const v = (p.variants || []).find(v => v.isDefault) || (p.variants || [])[0]
  return ((v?.stock ?? 0) > 0)
}

function formatPrice(value: number, currency?: string) {
  const symbol = getCurrencySymbol(currency)
  return `${symbol}${(value ?? 0).toFixed(2)}`
}

function getCurrencySymbol(code?: string) {
  switch ((code || 'USD').toUpperCase()) {
    case 'EUR': return '€'
    case 'GBP': return '£'
    case 'INR': return '₹'
    case 'USD':
    default: return '$'
  }
}


function renderInlineTags(p: ListingProduct) {
  const tags: string[] = []
  if ((p as any).isFeatured) tags.push('Featured')
  if ((p as any).isBestseller) tags.push('Bestseller') 
  if ((p as any).isNewArrival) tags.push('New')
  if ((p as any).isOnSale) tags.push('Sale')
  if (tags.length === 0) return null
  return tags.map((t) => (
    <span 
      key={t} 
      className={`px-3 py-1 text-[9px] font-bold tracking-[0.1em] uppercase rounded-full shadow-sm border transition-all duration-200 ${
        t === 'Featured' ? 'bg-neutral-900 text-white border-neutral-800' :
        t === 'Bestseller' ? 'bg-amber-50 text-amber-800 border-amber-200' :
        t === 'New' ? 'bg-blue-50 text-blue-800 border-blue-200' :
        t === 'Sale' ? 'bg-red-50 text-red-700 border-red-200' :
        'bg-neutral-50 text-neutral-700 border-neutral-200'
      }`}
    >
      {t === 'Featured' && '★ '}
      {t === 'Bestseller' && '♔ '}
      {t}
    </span>
  ))
}

// Clean tags function that excludes redundant ones already shown in image badges
function renderCleanTags(p: ListingProduct) {
  const tags: string[] = []
  // Only show tags that are NOT already displayed as image badges
  // Featured and Bestseller are shown on image, so exclude them
  // Only show New and Sale as they provide additional value
  if (p.isNewArrival) tags.push('New Arrival')
  if (p.isOnSale) tags.push('On Sale')
  if (tags.length === 0) return null
  return tags.map((t) => (
    <span 
      key={t} 
      className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium tracking-[0.05em] border transition-all duration-300 ${
        t === 'New Arrival' ? 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300' :
        t === 'On Sale' ? 'bg-red-50 text-red-700 border-red-200 hover:border-red-300' :
        'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
      }`}
    >
      {t}
    </span>
  ))
}


