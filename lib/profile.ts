import { authService } from './auth'

export interface Profile {
  id: string
  userId: string
  displayName?: string
  avatarUrl?: string
  phone?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
}

export interface Address {
  id: string
  userId: string
  label?: string
  fullName: string
  line1: string
  line2?: string
  city: string
  region?: string
  postalCode?: string
  countryCode: string
  phone?: string
  isDefaultShip: boolean
  isDefaultBill: boolean
  createdAt: string
  updatedAt: string
}

export interface Order {
  id: string
  number: string
  status: string
  paymentStatus: string
  currency: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  placedAt?: string
  createdAt: string
  updatedAt: string
  OrderItem: OrderItem[]
}

export interface OrderItem {
  id: string
  productId: string
  quantity: number
  unitPrice: number
  currency: string
  productName: string
  sku: string
  imageUrl?: string
}

class ProfileService {
  async getProfile(): Promise<Profile> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/profile', {
      method: 'GET',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch profile')
    }

    return data.profile
  }

  async updateProfile(profile: Partial<Profile>): Promise<Profile> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(profile)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update profile')
    }

    return data.profile
  }

  async getAddresses(): Promise<Address[]> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/addresses', {
      method: 'GET',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch addresses')
    }

    return data.addresses
  }

  async createAddress(address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch('/api/addresses', {
      method: 'POST',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(address)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to create address')
    }

    return data.address
  }

  async updateAddress(id: string, address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`/api/addresses/${id}`, {
      method: 'PUT',
      headers: authService.getAuthHeaders(),
      body: JSON.stringify(address)
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to update address')
    }

    return data.address
  }

  async deleteAddress(id: string): Promise<void> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`/api/addresses/${id}`, {
      method: 'DELETE',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete address')
    }
  }

  async getOrders(limit: number = 20, offset: number = 0): Promise<{ orders: Order[], pagination: any }> {
    if (!authService.isAuthenticated()) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`/api/orders?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: authService.getAuthHeaders()
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch orders')
    }

    return data
  }
}

export const profileService = new ProfileService()