import { supabase } from './supabase'

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription?: string
  brand?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  isActive: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isBestseller: boolean
  isOnSale: boolean
  category?: {
    id: string
    name: string
    displayName?: string
    slug: string
  }
  images: {
    id: string
    url: string
    alt?: string
    isPrimary: boolean
    sortOrder: number
  }[]
  variants: {
    id: string
    sku: string
    title?: string
    price: number
    compareAtPrice?: number
    currency: string
    stock: number
    isDefault: boolean
    attributes: any
    barcode?: string
    weightGrams?: number
    lengthCm?: number
    widthCm?: number
    heightCm?: number
  }[]
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  displayName?: string
  description?: string
  imageUrl?: string
  icon?: string
  color?: string
  isActive: boolean
  isFeatured: boolean
  showInNavigation: boolean
  showInFooter: boolean
  sortOrder: number
  parentId?: string
  children?: Category[]
}

export const productsFrontendService = {
  async getProductReviews(productId: string) {
    const { data, error } = await supabase
      .from('Review')
      .select(`id, rating, title, content, createdAt`)
      .eq('productId', productId)
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return []
    }
    return data || []
  },
  async getAllProducts(options: {
    limit?: number
    categoryId?: string
    featured?: boolean
    onSale?: boolean
    newArrival?: boolean
    bestseller?: boolean
  } = {}) {
    let query = supabase
      .from('Product')
      .select(`
        *,
        category:Category(id, name, displayName, slug),
        images:ProductImage(id, url, alt, isPrimary, sortOrder),
        variants:ProductVariant(id, sku, title, price, compareAtPrice, currency, stock, isDefault, attributes, barcode, weightGrams, lengthCm, widthCm, heightCm)
      `)
      .eq('status', 'PUBLISHED')
      .eq('isActive', true)

    if (options.categoryId) {
      query = query.eq('categoryId', options.categoryId)
    }

    if (options.featured) {
      query = query.eq('isFeatured', true)
    }

    if (options.onSale) {
      query = query.eq('isOnSale', true)
    }

    if (options.newArrival) {
      query = query.eq('isNewArrival', true)
    }

    if (options.bestseller) {
      query = query.eq('isBestseller', true)
    }

    if (options.limit) {
      query = query.limit(options.limit)
    }

    const { data, error } = await query
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching products:', error)
      return []
    }

    return data || []
  },

  async getProductsByCategoryIds(categoryIds: string[], limit?: number) {
    if (!categoryIds || categoryIds.length === 0) return []
    let query = supabase
      .from('Product')
      .select(`
        *,
        category:Category(id, name, displayName, slug),
        images:ProductImage(id, url, alt, isPrimary, sortOrder),
        variants:ProductVariant(id, sku, title, price, compareAtPrice, currency, stock, isDefault, attributes, barcode, weightGrams, lengthCm, widthCm, heightCm)
      `)
      .eq('status', 'PUBLISHED')
      .eq('isActive', true)
      .in('categoryId', categoryIds)

    if (limit) query = query.limit(limit)

    const { data, error } = await query.order('createdAt', { ascending: false })
    if (error) {
      console.error('Error fetching products by category ids:', error)
      return []
    }
    return data || []
  },

  getDescendantCategoryIds(allCategories: Category[], rootId: string): string[] {
    const ids: string[] = [rootId]
    const map = new Map<string, Category[]>()
    allCategories.forEach(c => {
      const pid = (c.parentId as string | undefined) || ''
      if (!map.has(pid)) map.set(pid, [])
      map.get(pid)!.push(c)
    })
    const queue: string[] = [rootId]
    while (queue.length) {
      const id = queue.shift()!
      const children = map.get(id) || []
      for (const child of children) {
        ids.push(child.id)
        queue.push(child.id)
      }
    }
    return Array.from(new Set(ids))
  },

  async getProductBySlug(slug: string) {
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        category:Category(id, name, displayName, slug),
        images:ProductImage(id, url, alt, isPrimary, sortOrder),
        variants:ProductVariant(id, sku, title, price, compareAtPrice, currency, stock, isDefault, attributes, barcode, weightGrams, lengthCm, widthCm, heightCm)
      `)
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .eq('isActive', true)
      .single()

    if (error) {
      console.error('Error fetching product by slug:', error)
      return null
    }

    return data
  },

  async getFeaturedProducts(limit: number = 8) {
    return this.getAllProducts({ featured: true, limit })
  },

  async getNewArrivals(limit: number = 8) {
    return this.getAllProducts({ newArrival: true, limit })
  },

  async getBestsellers(limit: number = 8) {
    return this.getAllProducts({ bestseller: true, limit })
  },

  async getOnSaleProducts(limit: number = 8) {
    return this.getAllProducts({ onSale: true, limit })
  },

  async getProductsByCategory(categorySlug: string, limit?: number) {
    // First get the category
    const { data: category, error: categoryError } = await supabase
      .from('Category')
      .select('id')
      .eq('slug', categorySlug)
      .eq('isActive', true)
      .single()

    if (categoryError || !category) {
      console.error('Error fetching category:', categoryError)
      return []
    }

    return this.getAllProducts({ categoryId: category.id, limit })
  }
}

export const categoriesFrontendService = {
  async getAllCategories() {
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .order('sortOrder', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching categories:', error)
      return []
    }

    return data || []
  },

  async getNavigationCategories() {
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .eq('showInNavigation', true)
      .order('sortOrder', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching navigation categories:', error)
      return []
    }

    return data || []
  },

  async getFooterCategories() {
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .eq('showInFooter', true)
      .order('sortOrder', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching footer categories:', error)
      return []
    }

    return data || []
  },

  async getFeaturedCategories() {
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('isActive', true)
      .eq('isFeatured', true)
      .order('sortOrder', { ascending: true })
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching featured categories:', error)
      return []
    }

    return data || []
  },

  async getCategoryBySlug(slug: string) {
    const { data, error } = await supabase
      .from('Category')
      .select('*')
      .eq('slug', slug)
      .eq('isActive', true)
      .single()

    if (error) {
      console.error('Error fetching category by slug:', error)
      return null
    }

    return data
  }
}