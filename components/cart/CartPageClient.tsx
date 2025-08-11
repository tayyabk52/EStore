"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cartService, type Cart, type CartItem } from '@/lib/cart'
import { authService } from '@/lib/auth'
import { useCart } from '@/lib/cart-context'

export default function CartPageClient() {
  const { refreshCounts } = useCart()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingItems, setUpdatingItems] = useState<Set<string>>(new Set())
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    loadCart()
  }, [isClient])

  const loadCart = async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      const cartData = await cartService.getCart()
      setCart(cartData)
    } catch (error) {
      console.error('Failed to load cart:', error)
      setError(error instanceof Error ? error.message : 'Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      await removeItem(itemId)
      return
    }

    setUpdatingItems(prev => new Set([...prev, itemId]))
    try {
      await cartService.updateCartItem(itemId, newQuantity)
      await loadCart() // Reload cart to get updated data
      await refreshCounts() // Update counts in navigation
    } catch (error) {
      console.error('Failed to update cart item:', error)
      setError(error instanceof Error ? error.message : 'Failed to update item')
    } finally {
      setUpdatingItems(prev => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    }
  }

  const removeItem = async (itemId: string) => {
    setUpdatingItems(prev => new Set([...prev, itemId]))
    try {
      await cartService.removeFromCart(itemId)
      await loadCart() // Reload cart to get updated data
      await refreshCounts() // Update counts in navigation
    } catch (error) {
      console.error('Failed to remove cart item:', error)
      setError(error instanceof Error ? error.message : 'Failed to remove item')
    } finally {
      setUpdatingItems(prev => {
        const updated = new Set(prev)
        updated.delete(itemId)
        return updated
      })
    }
  }

  const calculateSubtotal = () => {
    if (!cart?.items) return 0
    return cart.items.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  if (!isClient) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-12 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-4">
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto"></div>
        <p className="mt-4 text-neutral-600">Loading your cart...</p>
      </div>
    )
  }

  if (!authService.isAuthenticated()) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-2xl font-light tracking-wide text-black mb-4">
          Sign In Required
        </h1>
        <p className="text-neutral-600 mb-8">
          Please sign in to view your cart and continue shopping.
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
            Unable to Load Cart
          </h1>
          <p className="text-red-600 mb-8">{error}</p>
          <button
            onClick={loadCart}
            className="px-6 py-3 bg-black text-white hover:bg-neutral-800 transition-all tracking-wide uppercase font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-16 w-16 text-neutral-300 mx-auto mb-6" />
        <h1 className="text-2xl font-light tracking-wide text-black mb-4">
          Your Cart is Empty
        </h1>
        <p className="text-neutral-600 mb-8">
          Discover our premium collection and add items to your cart.
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

  const subtotal = calculateSubtotal()

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 sm:mb-12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light tracking-wide text-black">
            Shopping Cart
          </h1>
          <div className="text-sm text-neutral-600">
            {cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'}
          </div>
        </div>
        <div className="w-16 h-px bg-black"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                className="border border-neutral-200 bg-white p-6 hover:shadow-md transition-all duration-300"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-neutral-50 border border-neutral-100 overflow-hidden">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.productName}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-black text-sm sm:text-base truncate">
                          {item.productName}
                        </h3>
                        <p className="text-xs sm:text-sm text-neutral-600 mt-1">
                          SKU: {item.sku}
                        </p>
                        {item.ProductVariant?.title && (
                          <p className="text-xs sm:text-sm text-neutral-600">
                            {item.ProductVariant.title}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={updatingItems.has(item.id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-neutral-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={updatingItems.has(item.id)}
                            className="p-2 hover:bg-neutral-50 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-3 py-2 text-sm min-w-[3rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={updatingItems.has(item.id)}
                            className="p-2 hover:bg-neutral-50 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-medium text-black">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-xs text-neutral-600">
                            {formatPrice(item.unitPrice)} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-neutral-200 bg-white p-6 space-y-6">
            <h2 className="text-lg font-medium tracking-wide text-black uppercase">
              Order Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-sm text-neutral-500">Calculated at checkout</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Tax</span>
                <span className="text-sm text-neutral-500">Calculated at checkout</span>
              </div>
              
              <div className="border-t border-neutral-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium text-black">Total</span>
                  <span className="text-lg font-medium text-black">{formatPrice(subtotal)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button className="w-full h-12 bg-black text-white hover:bg-neutral-800 transition-all tracking-wide uppercase font-medium">
                Proceed to Checkout
              </button>
              <Link
                href="/products"
                className="w-full h-12 border-2 border-neutral-200 hover:border-neutral-300 bg-white hover:bg-neutral-50 text-neutral-700 hover:text-black transition-all tracking-wide uppercase font-medium flex items-center justify-center"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}