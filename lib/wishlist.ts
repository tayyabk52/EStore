import { authService } from './auth'

export interface WishlistItem {
  id: string
  productId: string
  createdAt: string
  Product: {
    id: string
    title: string
    slug: string
    shortDescription?: string
    brand?: string
    ProductImage: Array<{
      id: string
      url: string
      alt?: string
      isPrimary: boolean
      sortOrder: number
    }>
    ProductVariant: Array<{
      id: string
      price: number
      compareAtPrice?: number
      currency: string
      isDefault: boolean
      stock: number
    }>
  }
}

export interface Wishlist {
  id: string
  userId: string
  itemCount: number
  items: WishlistItem[]
}

class WishlistService {
  async getWishlist(): Promise<Wishlist> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/wishlist', {
      method: 'GET',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch wishlist')
    }

    return data.wishlist
  }

  async addToWishlist(productId: string): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Please login to add items to wishlist')
    }

    const response = await fetch('/api/wishlist', {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ productId })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to wishlist')
    }
  }

  async removeFromWishlist(productId: string): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/wishlist', {
      method: 'DELETE',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify({ productId })
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to remove item from wishlist')
    }
  }

  async getWishlistItemCount(): Promise<number> {
    try {
      const wishlist = await this.getWishlist()
      return wishlist.itemCount || 0
    } catch (error) {
      return 0
    }
  }

  async isInWishlist(productId: string): Promise<boolean> {
    try {
      const wishlist = await this.getWishlist()
      return wishlist.items.some(item => item.productId === productId)
    } catch (error) {
      return false
    }
  }
}

export const wishlistService = new WishlistService()