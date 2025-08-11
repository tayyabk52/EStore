"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authService } from './auth'
import { cartService } from './cart'
import { wishlistService } from './wishlist'

interface CartContextType {
  cartCount: number
  wishlistCount: number
  refreshCounts: () => Promise<void>
  updateCartCount: (count: number) => void
  updateWishlistCount: (count: number) => void
  incrementCartCount: () => void
  decrementCartCount: () => void
  incrementWishlistCount: () => void
  decrementWishlistCount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const refreshCounts = async () => {
    if (!isClient) return
    
    try {
      const user = authService.getUser()
      if (user && authService.isAuthenticated()) {
        const [newCartCount, newWishlistCount] = await Promise.all([
          cartService.getCartItemCount(),
          wishlistService.getWishlistItemCount()
        ])
        setCartCount(newCartCount)
        setWishlistCount(newWishlistCount)
      } else {
        setCartCount(0)
        setWishlistCount(0)
      }
    } catch (error) {
      console.error('Failed to refresh counts:', error)
      setCartCount(0)
      setWishlistCount(0)
    }
  }

  useEffect(() => {
    if (isClient) {
      refreshCounts()
    }
  }, [isClient])

  const updateCartCount = (count: number) => setCartCount(Math.max(0, count))
  const updateWishlistCount = (count: number) => setWishlistCount(Math.max(0, count))
  const incrementCartCount = () => setCartCount(prev => prev + 1)
  const decrementCartCount = () => setCartCount(prev => Math.max(0, prev - 1))
  const incrementWishlistCount = () => setWishlistCount(prev => prev + 1)
  const decrementWishlistCount = () => setWishlistCount(prev => Math.max(0, prev - 1))

  const value: CartContextType = {
    cartCount,
    wishlistCount,
    refreshCounts,
    updateCartCount,
    updateWishlistCount,
    incrementCartCount,
    decrementCartCount,
    incrementWishlistCount,
    decrementWishlistCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    // Provide default values if context is not available (during SSR)
    if (typeof window === 'undefined') {
      return {
        cartCount: 0,
        wishlistCount: 0,
        refreshCounts: async () => {},
        updateCartCount: () => {},
        updateWishlistCount: () => {},
        incrementCartCount: () => {},
        decrementCartCount: () => {},
        incrementWishlistCount: () => {},
        decrementWishlistCount: () => {}
      }
    }
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}