import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
import { randomUUID } from 'crypto'

// Types based on the schema
export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isActive: boolean
  parentId?: string
  createdAt: string
  updatedAt: string
  color?: string
  displayName?: string
  icon?: string
  isFeatured: boolean
  showInFooter: boolean
  showInNavigation: boolean
  sortOrder: number
}

export interface Product {
  id: string
  title: string
  slug: string
  description: string
  details?: any
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  brand?: string
  categoryId?: string
  currency: string
  createdAt: string
  updatedAt: string
  isActive: boolean
  isBestseller: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isOnSale: boolean
  metaDescription?: string
  metaKeywords?: string
  metaTitle?: string
  shortDescription?: string
}

export interface ProductVariant {
  id: string
  productId: string
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
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  alt?: string
  isPrimary: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// Category operations
export const categoryService = {
  async getAll() {
    const { data, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .order('sortOrder', { ascending: true })
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getWithChildren() {
    // Get all categories first
    const { data, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .order('sortOrder', { ascending: true })
      .order('createdAt', { ascending: false })

    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('Category')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    // Handle empty parentId - convert empty string to null
    const categoryData = {
      ...category,
      parentId: category.parentId && category.parentId.trim() !== '' ? category.parentId : null
    }
    
    const { data, error } = await supabaseAdmin
      .from('Category')
      .insert([{ id: randomUUID(), updatedAt: new Date().toISOString(), ...categoryData }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Category>) {
    // Handle empty parentId - convert empty string to null
    const updateData = {
      ...updates,
      parentId: updates.parentId && updates.parentId.trim() !== '' ? updates.parentId : null,
      updatedAt: new Date().toISOString()
    }
    
    const { data, error } = await supabaseAdmin
      .from('Category')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('Category')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  },

  async getProductCount(categoryId: string) {
    const { count, error } = await supabaseAdmin
      .from('Product')
      .select('*', { count: 'exact', head: true })
      .eq('categoryId', categoryId)

    if (error) throw error
    return count || 0
  }
}

// Product operations
export const productService = {
  async getAll(options: { 
    page?: number; 
    perPage?: number; 
    search?: string;
    categoryId?: string;
  } = {}) {
    const { page = 1, perPage = 20, search = '', categoryId } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabaseAdmin
      .from('Product')
      .select(`
        *,
        category:Category(id, name, displayName),
        images:ProductImage(id, url, alt, isPrimary, sortOrder),
        variants:ProductVariant(id, sku, title, price, compareAtPrice, currency, stock, isDefault, attributes, barcode, weightGrams, lengthCm, widthCm, heightCm)
      `)

    if (search) {
      query = query.or(`title.ilike.%${search}%,slug.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    if (categoryId) {
      query = query.eq('categoryId', categoryId)
    }

    const { data, error } = await query
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Get total count separately
    let countQuery = supabaseAdmin
      .from('Product')
      .select('*', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.or(`title.ilike.%${search}%,slug.ilike.%${search}%,brand.ilike.%${search}%`)
    }

    if (categoryId) {
      countQuery = countQuery.eq('categoryId', categoryId)
    }

    const { count } = await countQuery

    return {
      items: data || [],
      total: count || 0,
      page,
      perPage
    }
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('Product')
      .select(`
        *,
        category:Category(id, name, displayName),
        images:ProductImage(*),
        variants:ProductVariant(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    // Fetch collections mapping for this product
    const { data: collectionsData, error: collectionsError } = await supabaseAdmin
      .from('ProductCollection')
      .select('collectionId, sortOrder')
      .eq('productId', id)

    if (collectionsError) throw collectionsError

    return { ...data, collections: collectionsData || [] }
  },

  async create(
    product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>,
    images?: any[],
    variants?: any[],
    collections?: { collectionId: string; sortOrder?: number }[]
  ) {
    // Start a transaction
    const nowIso = new Date().toISOString()
    const { data: productData, error: productError } = await supabaseAdmin
      .from('Product')
      .insert([{ id: randomUUID(), updatedAt: nowIso, ...product }])
      .select()
      .single()

    if (productError) throw productError

    const productId = productData.id

    // Insert images if provided
    if (images && images.length > 0) {
      const imagesWithProductId = images.map(img => {
        // Remove id field to let Supabase auto-generate it
        const { id, createdAt, updatedAt, ...imageData } = img
        return {
          id: randomUUID(),
          ...imageData,
          productId,
          url: img.url,
          alt: img.alt || null,
          isPrimary: img.isPrimary || false,
          sortOrder: img.sortOrder || 0,
          updatedAt: new Date().toISOString()
        }
      })

      const { error: imagesError } = await supabaseAdmin
        .from('ProductImage')
        .insert(imagesWithProductId)

      if (imagesError) throw imagesError
    }

    // Insert variants if provided
    if (variants && variants.length > 0) {
      const variantsWithProductId = variants.map(variant => {
        // Remove id field to let Supabase auto-generate it
        const { id, createdAt, updatedAt, ...variantData } = variant
        return {
          id: randomUUID(),
          ...variantData,
          productId,
          sku: variant.sku,
          title: variant.title || null,
          price: Number(variant.price || 0),
          compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
          currency: variant.currency || 'USD',
          stock: Number(variant.stock || 0),
          isDefault: variant.isDefault || false,
          attributes: variant.attributes || {},
          barcode: variant.barcode || null,
          weightGrams: variant.weightGrams ? Number(variant.weightGrams) : null,
          updatedAt: new Date().toISOString()
        }
      })

      const { error: variantsError } = await supabaseAdmin
        .from('ProductVariant')
        .insert(variantsWithProductId)

      if (variantsError) throw variantsError
    }

    // Insert collections if provided
    if (collections && collections.length > 0) {
      const rows = collections
        .filter(c => !!c.collectionId)
        .map(c => ({
          productId,
          collectionId: c.collectionId,
          sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : 0,
        }))
      const { error: pcError } = await supabaseAdmin
        .from('ProductCollection')
        .insert(rows)
      if (pcError) throw pcError
    }

    return productData
  },

  async update(
    id: string,
    updates: Partial<Product>,
    images?: any[],
    variants?: any[],
    collections?: { collectionId: string; sortOrder?: number }[]
  ) {
    // Update product
    const { data: productData, error: productError } = await supabaseAdmin
      .from('Product')
      .update({ ...updates, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (productError) throw productError

    // Update images if provided
    if (images) {
      // Delete existing images
      await supabaseAdmin
        .from('ProductImage')
        .delete()
        .eq('productId', id)

      // Insert new images
      if (images.length > 0) {
        const imagesWithProductId = images.map(img => {
          // Remove id field to let Supabase auto-generate it
          const { id: imgId, createdAt, updatedAt, ...imageData } = img
          return {
            id: randomUUID(),
            ...imageData,
            productId: id,
            url: img.url,
            alt: img.alt || null,
            isPrimary: img.isPrimary || false,
            sortOrder: img.sortOrder || 0,
            updatedAt: new Date().toISOString()
          }
        })

        const { error: imagesError } = await supabaseAdmin
          .from('ProductImage')
          .insert(imagesWithProductId)

        if (imagesError) throw imagesError
      }
    }

    // Update variants if provided
    if (variants) {
      // Delete existing variants
      await supabaseAdmin
        .from('ProductVariant')
        .delete()
        .eq('productId', id)

      // Insert new variants
      if (variants.length > 0) {
        const variantsWithProductId = variants.map(variant => {
          // Remove id field to let Supabase auto-generate it
          const { id: varId, createdAt, updatedAt, ...variantData } = variant
          return {
            id: randomUUID(),
            ...variantData,
            productId: id,
            sku: variant.sku,
            title: variant.title || null,
            price: Number(variant.price || 0),
            compareAtPrice: variant.compareAtPrice ? Number(variant.compareAtPrice) : null,
            currency: variant.currency || 'USD',
            stock: Number(variant.stock || 0),
            isDefault: variant.isDefault || false,
            attributes: variant.attributes || {},
            barcode: variant.barcode || null,
            weightGrams: variant.weightGrams ? Number(variant.weightGrams) : null,
            updatedAt: new Date().toISOString()
          }
        })

        const { error: variantsError } = await supabaseAdmin
          .from('ProductVariant')
          .insert(variantsWithProductId)

        if (variantsError) throw variantsError
      }
    }

    // Update collections if provided
    if (collections) {
      // Clear existing links
      await supabaseAdmin
        .from('ProductCollection')
        .delete()
        .eq('productId', id)

      if (collections.length > 0) {
        const rows = collections
          .filter(c => !!c.collectionId)
          .map(c => ({
            productId: id,
            collectionId: c.collectionId,
            sortOrder: typeof c.sortOrder === 'number' ? c.sortOrder : 0,
          }))
        const { error: pcError } = await supabaseAdmin
          .from('ProductCollection')
          .insert(rows)
        if (pcError) throw pcError
      }
    }

    return productData
  },

  async delete(id: string) {
    // Delete related records first
    await supabaseAdmin
      .from('ProductImage')
      .delete()
      .eq('productId', id)

    await supabaseAdmin
      .from('ProductVariant')
      .delete()
      .eq('productId', id)

    // Delete product
    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  }
}

// Utility functions
export const utils = {
  slugify(input: string): string {
    return input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  },

  validateAdminKey(req: any): boolean {
    const serverKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY
    if (!serverKey) return false
    
    const headerKey = req.headers?.get('x-admin-key')
    const urlKey = req.nextUrl?.searchParams?.get('key')
    
    return headerKey === serverKey || urlKey === serverKey
  }
}
