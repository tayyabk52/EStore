import { authService } from './auth'

export interface CartItem {
  id: string
  variantId: string
  quantity: number
  unitPrice: number
  currency: string
  productName: string
  sku: string
  imageUrl?: string
  createdAt: string
  ProductVariant?: {
    id: string
    title?: string
    price: number
    stock: number
    Product: {
      id: string
      title: string
      slug: string
      ProductImage: Array<{
        id: string
        url: string
        alt?: string
        isPrimary: boolean
        sortOrder: number
      }>
    }
  }
}

export interface Cart {
  id: string
  userId: string
  itemCount: number
  items: CartItem[]
}

class CartService {
  async getCart(): Promise<Cart> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'GET',
        headers: authService.getAuthHeaders()
      })

      if (!response.ok) {
        if (response.status === 401) {
          authService.logout()
          throw new Error('Session expired. Please login again.')
        }
        const errorData = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const data = await response.json()
      return data.cart || { id: '', userId: '', itemCount: 0, items: [] }
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }
      throw new Error('Failed to connect to server')
    }
  }

  async addToCart(variantId: string, quantity: number = 1): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Please login to add items to cart')
    }

    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ variantId, quantity })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart')
    }
  }

  async updateCartItem(itemId: string, quantity: number): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ quantity })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update cart item')
    }
  }

  async removeFromCart(itemId: string): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`/api/cart/${itemId}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove item from cart')
    }
  }

  async getCartItemCount(): Promise<number> {
    try {
      if (!authService.isAuthenticated()) {
        return 0
      }
      const cart = await this.getCart()
      return cart.itemCount || 0
    } catch (error) {
      console.error('Failed to get cart count:', error)
      return 0
    }
  }
}

export const cartService = new CartService()