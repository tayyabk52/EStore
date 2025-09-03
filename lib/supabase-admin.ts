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

export interface Customer {
  id: string
  userId: string
  email?: string
  emailConfirmedAt?: string
  phone?: string
  phoneConfirmedAt?: string
  displayName?: string
  avatarUrl?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  lastSignInAt?: string
  authProvider?: string
  userMetadata?: any
}

export interface CustomerAddress {
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
  userId: string
  number: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PAYMENT_PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED'
  currency: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  shippingAddressId?: string
  billingAddressId?: string
  placedAt?: string
  notes?: string
  metadata?: any
  paymentProvider?: string
  paymentIntentId?: string
  paymentData?: any
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId?: string
  variantId?: string
  quantity: number
  unitPrice: number
  currency: string
  productName: string
  sku: string
  imageUrl?: string
  createdAt: string
}

export interface OrderAddress {
  id: string
  userId?: string
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

export interface Payment {
  id: string
  orderId: string
  provider: string
  status: 'PAYMENT_PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED'
  amount: number
  currency: string
  transactionId?: string
  data?: any
  createdAt: string
  updatedAt: string
}

export interface Shipment {
  id: string
  orderId: string
  status: 'LABEL_CREATED' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'RETURNED'
  carrier?: string
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
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
    // First, get the product with its images and category info
    const { data: product } = await supabaseAdmin
      .from('Product')
      .select(`
        id,
        title,
        categoryId,
        category:Category(slug),
        images:ProductImage(id, url)
      `)
      .eq('id', id)
      .single()

    console.log(`Starting deletion of product ${id}:`, product?.title || 'Unknown Product')

    // Delete images from storage
    if (product) {
      try {
        const { storageService } = await import('./storage')
        
        // Extract category slug properly
        let categorySlug: string | undefined
        if (product.category && Array.isArray(product.category) && product.category.length > 0) {
          categorySlug = product.category[0].slug
        } else if (product.category && typeof product.category === 'object' && 'slug' in product.category) {
          categorySlug = (product.category as any).slug
        }

        console.log(`Attempting to delete storage images for product ${id}, category: ${categorySlug || 'none'}`)
        
        // Try to delete images using the storage service
        const result = await storageService.deleteProductImages(id, categorySlug)
        
        if (result.success) {
          console.log(`✅ Successfully deleted storage images for product ${id}`)
        } else {
          console.warn(`⚠️ Could not delete some storage images for product ${id}:`, result.error)
        }

        // Additional fallback: try to delete images based on their URLs from database
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          console.log(`Found ${product.images.length} image records in database, attempting individual deletion`)
          
          for (const image of product.images) {
            if (image.url && storageService.isStorageUrl(image.url)) {
              try {
                const filePath = storageService.getFilePathFromUrl(image.url)
                if (filePath) {
                  const deleteResult = await storageService.deleteImage(filePath)
                  if (deleteResult.success) {
                    console.log(`✅ Deleted individual image: ${filePath}`)
                  } else {
                    console.warn(`⚠️ Failed to delete individual image: ${filePath}`, deleteResult.error)
                  }
                }
              } catch (error) {
                console.warn(`Warning: Could not delete individual image ${image.url}:`, error)
              }
            }
          }
        }
        
      } catch (error) {
        console.error(`❌ Error during storage deletion for product ${id}:`, error)
        // Continue with database deletion even if storage deletion fails
      }
    } else {
      console.warn(`⚠️ Product ${id} not found for storage cleanup`)
    }

    console.log(`Proceeding with database cleanup for product ${id}`)

    // Delete related records from database
    await supabaseAdmin
      .from('ProductImage')
      .delete()
      .eq('productId', id)

    await supabaseAdmin
      .from('ProductVariant')
      .delete()
      .eq('productId', id)

    // Delete product collections relationship
    await supabaseAdmin
      .from('ProductCollection')
      .delete()
      .eq('productId', id)

    // Delete product
    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', id)

    if (error) {
      console.error(`❌ Failed to delete product ${id} from database:`, error)
      throw error
    }
    
    console.log(`✅ Successfully deleted product ${id} and all related data`)
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

  async generateUniqueSlug(baseTitle: string, excludeId?: string): Promise<string> {
    const slug = this.slugify(baseTitle)
    let counter = 0
    let finalSlug = slug
    
    while (true) {
      // Check if slug exists
      let query = supabaseAdmin
        .from('Product')
        .select('id')
        .eq('slug', finalSlug)
      
      // If we're updating a product, exclude its current ID
      if (excludeId) {
        query = query.neq('id', excludeId)
      }
      
      const { error } = await query.single()
      
      if (error && error.code === 'PGRST116') {
        // No rows returned - slug is unique
        return finalSlug
      }
      
      if (error) {
        console.error('Error checking slug uniqueness:', error)
        // If there's an error, fall back to adding timestamp
        return `${slug}-${Date.now()}`
      }
      
      // Slug exists, try with counter
      counter++
      finalSlug = `${slug}-${counter}`
      
      // Safety check to prevent infinite loop
      if (counter > 100) {
        return `${slug}-${Date.now()}`
      }
    }
  },

  validateAdminKey(req: any): boolean {
    const serverKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY
    if (!serverKey) return false
    
    const headerKey = req.headers?.get('x-admin-key')
    const urlKey = req.nextUrl?.searchParams?.get('key')
    
    return headerKey === serverKey || urlKey === serverKey
  }
}

// Customer operations
export const customerService = {
  // Fallback method - just get from Profile table for now
  async getAllFallback(options: { 
    page?: number; 
    perPage?: number; 
    search?: string;
  } = {}) {
    console.log('🔄 Using fallback customer service (Profile table only)')
    const { page = 1, perPage = 20, search = '' } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    let query = supabaseAdmin
      .from('Profile')
      .select('*')

    if (search) {
      query = query.or(`displayName.ilike.%${search}%,phone.ilike.%${search}%,userId.ilike.%${search}%`)
    }

    const { data, error } = await query
      .order('createdAt', { ascending: false })
      .range(from, to)

    if (error) throw error

    // Get related data for each customer separately
    const customersWithRelatedData = await Promise.all((data || []).map(async (customer) => {
      // Get addresses
      const { data: addresses } = await supabaseAdmin
        .from('Address')
        .select('id, label, fullName, line1, line2, city, region, postalCode, countryCode, phone, isDefaultShip, isDefaultBill')
        .eq('userId', customer.userId)

      // Get orders
      const { data: orders } = await supabaseAdmin
        .from('Order')
        .select('id, number, status, paymentStatus, total, currency, createdAt')
        .eq('userId', customer.userId)

      // Get carts
      const { data: carts } = await supabaseAdmin
        .from('Cart')
        .select('id, isActive, createdAt')
        .eq('userId', customer.userId)

      // Get wishlists
      const { data: wishlists } = await supabaseAdmin
        .from('Wishlist')
        .select('id, createdAt')
        .eq('userId', customer.userId)

      return {
        ...customer,
        email: `${customer.displayName || 'user'}@example.com`, // Mock email for display
        addresses: addresses || [],
        orders: orders || [],
        carts: carts || [],
        wishlists: wishlists || []
      }
    }))

    // Get total count separately
    let countQuery = supabaseAdmin
      .from('Profile')
      .select('*', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.or(`displayName.ilike.%${search}%,phone.ilike.%${search}%,userId.ilike.%${search}%`)
    }

    const { count } = await countQuery

    return {
      items: customersWithRelatedData,
      total: count || 0,
      page,
      perPage
    }
  },
  async getAll(options: { 
    page?: number; 
    perPage?: number; 
    search?: string;
  } = {}) {
    console.log('🔍 CustomerService.getAll called with:', options)
    const { page = 1, perPage = 20, search = '' } = options
    const from = (page - 1) * perPage
    const to = from + perPage - 1

    try {
      console.log('📞 Calling supabaseAdmin.auth.admin.listUsers...')
      // First, get all auth users from Supabase Auth
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage
      })

      if (authError) {
        console.error('❌ Auth error:', authError)
        throw authError
      }

      console.log('✅ Got auth users:', {
        count: authUsers?.users?.length || 0,
        totalUsers: authUsers?.users?.length || 0
      })

      // Filter users based on search if provided
      let filteredUsers = authUsers.users || []
      console.log('🔍 Before search filter, users count:', filteredUsers.length)
      
      if (search) {
        const searchLower = search.toLowerCase()
        filteredUsers = filteredUsers.filter(user => 
          user.email?.toLowerCase().includes(searchLower) ||
          user.user_metadata?.full_name?.toLowerCase().includes(searchLower) ||
          user.user_metadata?.display_name?.toLowerCase().includes(searchLower) ||
          user.phone?.toLowerCase().includes(searchLower) ||
          user.id.toLowerCase().includes(searchLower)
        )
        console.log('🔍 After search filter, users count:', filteredUsers.length)
      }

      console.log('👥 Processing', filteredUsers.length, 'users...')

      // Get profiles and related data for each auth user
      const customersWithRelatedData = await Promise.all(filteredUsers.map(async (authUser, index) => {
        console.log(`👤 Processing user ${index + 1}/${filteredUsers.length}:`, authUser.email)
        
        try {
          // Get profile if exists
          const { data: profile } = await supabaseAdmin
            .from('Profile')
            .select('*')
            .eq('userId', authUser.id)
            .single()

          // Get addresses
          const { data: addresses } = await supabaseAdmin
            .from('Address')
            .select('id, label, fullName, line1, line2, city, region, postalCode, countryCode, phone, isDefaultShip, isDefaultBill')
            .eq('userId', authUser.id)

          // Get orders
          const { data: orders } = await supabaseAdmin
            .from('Order')
            .select('id, number, status, paymentStatus, total, currency, createdAt')
            .eq('userId', authUser.id)

          // Get carts
          const { data: carts } = await supabaseAdmin
            .from('Cart')
            .select('id, isActive, createdAt')
            .eq('userId', authUser.id)

          // Get wishlists
          const { data: wishlists } = await supabaseAdmin
            .from('Wishlist')
            .select('id, createdAt')
            .eq('userId', authUser.id)

          // Combine auth user data with profile data
          const customerData = {
            // Use profile id if exists, otherwise use auth user id
            id: profile?.id || authUser.id,
            userId: authUser.id,
            email: authUser.email,
            emailConfirmedAt: authUser.email_confirmed_at,
            phone: authUser.phone || profile?.phone,
            phoneConfirmedAt: authUser.phone_confirmed_at,
            displayName: profile?.displayName || authUser.user_metadata?.full_name || authUser.user_metadata?.display_name || authUser.email?.split('@')[0],
            avatarUrl: profile?.avatarUrl || authUser.user_metadata?.avatar_url,
            isAdmin: profile?.isAdmin || false,
            createdAt: authUser.created_at,
            updatedAt: authUser.updated_at || profile?.updatedAt,
            lastSignInAt: authUser.last_sign_in_at,
            // Related data
            addresses: addresses || [],
            orders: orders || [],
            carts: carts || [],
            wishlists: wishlists || [],
            // Auth metadata
            authProvider: authUser.app_metadata?.provider,
            userMetadata: authUser.user_metadata
          }
          
          console.log(`✅ Processed user ${index + 1}:`, customerData.email)
          return customerData
        } catch (userError) {
          console.error(`❌ Error processing user ${authUser.email}:`, userError)
          // Return basic data even if related data fails
          return {
            id: authUser.id,
            userId: authUser.id,
            email: authUser.email,
            displayName: authUser.email?.split('@')[0] || 'Unknown',
            isAdmin: false,
            createdAt: authUser.created_at,
            addresses: [],
            orders: [],
            carts: [],
            wishlists: []
          }
        }
      }))

      console.log('✅ Successfully processed all users, returning:', customersWithRelatedData.length, 'customers')

      return {
        items: customersWithRelatedData,
        total: filteredUsers.length,
        page,
        perPage
      }
    } catch (error) {
      console.error('❌ Error in CustomerService.getAll:', error)
      throw error
    }
  },

  async getById(id: string) {
    // Try to get auth user by id (assuming id is the auth user id)
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.getUserById(id)

    if (authError || !authUser.user) {
      // If not found as auth user, try to find by profile id
      const { data: profile, error: profileError } = await supabaseAdmin
        .from('Profile')
        .select('*')
        .eq('id', id)
        .single()

      if (profileError) throw new Error('Customer not found')

      // Get auth user by userId from profile
      const { data: authFromProfile, error: authFromProfileError } = await supabaseAdmin.auth.admin.getUserById(profile.userId)
      
      if (authFromProfileError) throw authFromProfileError

      return await this.buildCustomerData(authFromProfile.user, profile)
    }

    // Get profile if exists
    const { data: profile } = await supabaseAdmin
      .from('Profile')
      .select('*')
      .eq('userId', authUser.user.id)
      .single()

    return await this.buildCustomerData(authUser.user, profile)
  },

  async buildCustomerData(authUser: any, profile: any = null) {
    // Get related data separately
    const { data: addresses } = await supabaseAdmin
      .from('Address')
      .select('*')
      .eq('userId', authUser.id)

    const { data: orders } = await supabaseAdmin
      .from('Order')
      .select('id, number, status, paymentStatus, total, currency, createdAt, placedAt')
      .eq('userId', authUser.id)

    const { data: carts } = await supabaseAdmin
      .from('Cart')
      .select('id, isActive, createdAt')
      .eq('userId', authUser.id)

    const { data: wishlists } = await supabaseAdmin
      .from('Wishlist')
      .select('id, createdAt')
      .eq('userId', authUser.id)

    return {
      // Use profile id if exists, otherwise use auth user id
      id: profile?.id || authUser.id,
      userId: authUser.id,
      email: authUser.email,
      emailConfirmedAt: authUser.email_confirmed_at,
      phone: authUser.phone || profile?.phone,
      phoneConfirmedAt: authUser.phone_confirmed_at,
      displayName: profile?.displayName || authUser.user_metadata?.full_name || authUser.user_metadata?.display_name || authUser.email?.split('@')[0],
      avatarUrl: profile?.avatarUrl || authUser.user_metadata?.avatar_url,
      isAdmin: profile?.isAdmin || false,
      createdAt: authUser.created_at,
      updatedAt: authUser.updated_at || profile?.updatedAt,
      lastSignInAt: authUser.last_sign_in_at,
      // Related data
      addresses: addresses || [],
      orders: orders || [],
      carts: carts || [],
      wishlists: wishlists || [],
      // Auth metadata
      authProvider: authUser.app_metadata?.provider,
      userMetadata: authUser.user_metadata
    }
  },

  async create(customerData: any) {
    // Create a new auth user first
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: customerData.email,
      phone: customerData.phone,
      password: customerData.password || 'TempPassword123!', // Temporary password
      user_metadata: {
        full_name: customerData.displayName,
        display_name: customerData.displayName
      },
      email_confirm: true // Auto-confirm email
    })

    if (authError) throw authError

    // Create or update profile
    const profileData = {
      id: randomUUID(),
      userId: authUser.user.id,
      displayName: customerData.displayName,
      avatarUrl: customerData.avatarUrl,
      phone: customerData.phone,
      isAdmin: customerData.isAdmin || false,
      updatedAt: new Date().toISOString()
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('Profile')
      .upsert([profileData])
      .select()
      .single()

    if (profileError) throw profileError

    return await this.buildCustomerData(authUser.user, profile)
  },

  async update(id: string, updates: any) {
    // Get the customer first to determine if we're updating by profile id or user id
    const customer = await this.getById(id)
    
    // Update auth user if email/phone changed
    const authUpdates: any = {}
    if (updates.email && updates.email !== customer.email) {
      authUpdates.email = updates.email
    }
    if (updates.phone && updates.phone !== customer.phone) {
      authUpdates.phone = updates.phone
    }

    if (Object.keys(authUpdates).length > 0) {
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        customer.userId,
        authUpdates
      )
      if (authError) throw authError
    }

    // Update or create profile
    const profileUpdates = {
      userId: customer.userId,
      displayName: updates.displayName,
      avatarUrl: updates.avatarUrl,
      phone: updates.phone,
      isAdmin: updates.isAdmin,
      updatedAt: new Date().toISOString()
    }

    // Remove undefined values
    Object.keys(profileUpdates).forEach(key => 
      (profileUpdates as any)[key] === undefined && delete (profileUpdates as any)[key]
    )

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('Profile')
      .upsert([{ id: customer.id, ...profileUpdates }])
      .select()
      .single()

    if (profileError) throw profileError

    // Return updated customer data
    return await this.getById(customer.userId)
  },

  async delete(id: string) {
    // Get the customer first to get the userId
    const customer = await this.getById(id)

    // Delete related records first using the userId
    await supabaseAdmin
      .from('Address')
      .delete()
      .eq('userId', customer.userId)

    await supabaseAdmin
      .from('Cart')
      .delete()
      .eq('userId', customer.userId)

    await supabaseAdmin
      .from('Wishlist')
      .delete()
      .eq('userId', customer.userId)

    // Delete profile
    if (customer.id !== customer.userId) {
      // If we have a separate profile record, delete it
      await supabaseAdmin
        .from('Profile')
        .delete()
        .eq('id', customer.id)
    }

    // Delete auth user (this is the main user record)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(customer.userId)
    if (authError) throw authError

    return true
  },

  async getOrderCount(customerId: string) {
    const { count, error } = await supabaseAdmin
      .from('Order')
      .select('*', { count: 'exact', head: true })
      .eq('userId', customerId)

    if (error) throw error
    return count || 0
  },

  async getTotalSpent(customerId: string) {
    const { data, error } = await supabaseAdmin
      .from('Order')
      .select('total')
      .eq('userId', customerId)
      .in('status', ['COMPLETED', 'DELIVERED', 'SHIPPED']) // Include various "completed" statuses

    if (error) throw error
    
    const totalSpent = (data || []).reduce((sum, order) => sum + Number(order.total || 0), 0)
    return totalSpent
  },

  // Helper method to create test customers
  async createTestData() {
    console.log('🧪 Creating test customer data...')
    
    const testCustomers = [
      {
        id: randomUUID(),
        userId: randomUUID(),
        displayName: 'John Doe',
        phone: '+1234567890',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        isAdmin: false,
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        displayName: 'Jane Smith',
        phone: '+0987654321',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b04a35ef?w=150&h=150&fit=crop&crop=face',
        isAdmin: false,
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        displayName: 'Admin User',
        phone: '+1122334455',
        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        isAdmin: true,
        updatedAt: new Date().toISOString()
      }
    ]

    try {
      const { data, error } = await supabaseAdmin
        .from('Profile')
        .insert(testCustomers)
        .select()

      if (error) throw error
      
      console.log('✅ Created test customers:', data.length)
      return data
    } catch (error) {
      console.error('❌ Error creating test data:', error)
      throw error
    }
  }
}

export const orderService = {
  async getAll(options: { page?: number; perPage?: number; search?: string; status?: string } = {}) {
    const { page = 1, perPage = 20, search = '', status = '' } = options
    const offset = (page - 1) * perPage

    let query = supabaseAdmin
      .from('Order')
      .select(`
        *,
        orderItems:OrderItem(*),
        shippingAddress:Address!shippingAddressId(*),
        billingAddress:Address!billingAddressId(*),
        payments:Payment(*),
        shipments:Shipment(*)
      `)
      .order('createdAt', { ascending: false })
      .range(offset, offset + perPage - 1)

    // Apply search filter
    if (search) {
      query = query.or(`number.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    // Apply status filter
    if (status) {
      query = query.eq('status', status)
    }

    const { data, error, count } = await query

    if (error) throw error

    // Get total count for pagination
    let totalQuery = supabaseAdmin
      .from('Order')
      .select('*', { count: 'exact', head: true })

    if (search) {
      totalQuery = totalQuery.or(`number.ilike.%${search}%,notes.ilike.%${search}%`)
    }

    if (status) {
      totalQuery = totalQuery.eq('status', status)
    }

    const { count: total } = await totalQuery

    return {
      items: data || [],
      total: total || 0,
      page,
      perPage
    }
  },

  async getById(id: string) {
    const { data, error } = await supabaseAdmin
      .from('Order')
      .select(`
        *,
        orderItems:OrderItem(*),
        shippingAddress:Address!shippingAddressId(*),
        billingAddress:Address!billingAddressId(*),
        payments:Payment(*),
        shipments:Shipment(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  },

  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('Order')
      .insert([{
        id: randomUUID(),
        ...orderData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async update(id: string, updates: Partial<Order>) {
    const { data, error } = await supabaseAdmin
      .from('Order')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async delete(id: string) {
    const { error } = await supabaseAdmin
      .from('Order')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async updateStatus(id: string, status: Order['status']) {
    return this.update(id, { 
      status,
      ...(status === 'CONFIRMED' && { placedAt: new Date().toISOString() })
    })
  },

  async updatePaymentStatus(id: string, paymentStatus: Order['paymentStatus']) {
    return this.update(id, { paymentStatus })
  },

  async getOrderItems(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from('OrderItem')
      .select('*')
      .eq('orderId', orderId)

    if (error) throw error
    return data || []
  },

  async addOrderItem(orderItem: Omit<OrderItem, 'id' | 'createdAt'>) {
    const { data, error } = await supabaseAdmin
      .from('OrderItem')
      .insert([{
        ...orderItem,
        createdAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateOrderItem(id: string, updates: Partial<OrderItem>) {
    const { data, error } = await supabaseAdmin
      .from('OrderItem')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async deleteOrderItem(id: string) {
    const { error } = await supabaseAdmin
      .from('OrderItem')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async getPayments(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from('Payment')
      .select('*')
      .eq('orderId', orderId)

    if (error) throw error
    return data || []
  },

  async addPayment(payment: Omit<Payment, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('Payment')
      .insert([{
        ...payment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updatePayment(id: string, updates: Partial<Payment>) {
    const { data, error } = await supabaseAdmin
      .from('Payment')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getShipments(orderId: string) {
    const { data, error } = await supabaseAdmin
      .from('Shipment')
      .select('*')
      .eq('orderId', orderId)

    if (error) throw error
    return data || []
  },

  async addShipment(shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) {
    const { data, error } = await supabaseAdmin
      .from('Shipment')
      .insert([{
        ...shipment,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateShipment(id: string, updates: Partial<Shipment>) {
    const { data, error } = await supabaseAdmin
      .from('Shipment')
      .update({
        ...updates,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  },

  async getOrderStats() {
    // Get total orders count
    const { count: totalOrders } = await supabaseAdmin
      .from('Order')
      .select('*', { count: 'exact', head: true })

    // Get orders by status
    const { data: statusCounts } = await supabaseAdmin
      .from('Order')
      .select('status')
      .then(({ data }) => {
        const counts: Record<string, number> = {}
        data?.forEach(order => {
          counts[order.status] = (counts[order.status] || 0) + 1
        })
        return { data: counts }
      })

    // Get total revenue
    const { data: revenueData } = await supabaseAdmin
      .from('Order')
      .select('total')
      .eq('paymentStatus', 'PAID')

    const totalRevenue = revenueData?.reduce((sum, order) => sum + Number(order.total), 0) || 0

    return {
      totalOrders: totalOrders || 0,
      statusCounts: statusCounts || {},
      totalRevenue
    }
  },

  async createTestData() {
    const testOrders = [
      {
        id: randomUUID(),
        userId: randomUUID(),
        number: 'ORD-001',
        status: 'DELIVERED' as const,
        paymentStatus: 'PAID' as const,
        currency: 'PKR',
        subtotal: 15000,
        tax: 1500,
        shipping: 500,
        discount: 0,
        total: 17000,
        notes: 'Test order 1',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        number: 'ORD-002',
        status: 'PROCESSING' as const,
        paymentStatus: 'PAID' as const,
        currency: 'PKR',
        subtotal: 25000,
        tax: 2500,
        shipping: 800,
        discount: 1000,
        total: 27300,
        notes: 'Test order 2',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: randomUUID(),
        userId: randomUUID(),
        number: 'ORD-003',
        status: 'PENDING' as const,
        paymentStatus: 'PAYMENT_PENDING' as const,
        currency: 'PKR',
        subtotal: 8000,
        tax: 800,
        shipping: 300,
        discount: 0,
        total: 9100,
        notes: 'Test order 3',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    try {
      const { data, error } = await supabaseAdmin
        .from('Order')
        .insert(testOrders)
        .select()

      if (error) throw error
      
      console.log('✅ Created test orders:', data.length)
      return data
    } catch (error) {
      console.error('❌ Error creating test data:', error)
      throw error
    }
  }
}
