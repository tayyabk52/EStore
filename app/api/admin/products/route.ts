import { NextRequest, NextResponse } from 'next/server'
import { productService, utils } from '@/lib/supabase-admin'

// GET /api/admin/products?key=...&q=&page=1&perPage=20
export async function GET(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  const url = req.nextUrl
  const q = url.searchParams.get('q')?.trim() || ''
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('perPage') || '20')))

  try {
    const result = await productService.getAll({
      page,
      perPage,
      search: q
    })

    // Transform the data to match the admin UI needs (and keep compatibility)
    const transformedItems = result.items.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      brand: p.brand,
      isActive: p.isActive,
      isFeatured: p.isFeatured,
      // include for filtering UI
      categoryId: p.categoryId ?? p.category?.id ?? null,
      category: p.category ? { id: p.category.id, name: p.category.name, displayName: p.category.displayName } : null,
      // legacy quick fields
      image: p.images?.[0]?.url || null,
      price: p.variants?.[0]?.price ? Number(p.variants[0].price) : null,
      compareAtPrice: p.variants?.[0]?.compareAtPrice ? Number(p.variants[0].compareAtPrice) : null,
      stock: p.variants?.[0]?.stock ?? 0,
      // full arrays needed by admin UI to render badges and counts
      images: p.images || [],
      variants: p.variants || [],
      shortDescription: p.shortDescription || '',
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }))

    return NextResponse.json({
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      items: transformedItems,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const title: string = (body.title ?? '').toString().trim()
    if (!title) return NextResponse.json({ error: 'Title is required' }, { status: 400 })
    
    const incomingSlug: string | undefined = body.slug?.toString().trim()
    const slug = incomingSlug && incomingSlug.length > 0 ? utils.slugify(incomingSlug) : utils.slugify(title)

    // Clean product data - remove any id fields that might be passed
    const { id, createdAt, updatedAt, ...bodyData } = body
    
    const productData = {
      title,
      slug,
      description: body.description || 'No description provided', // Make required field non-null
      brand: body.brand ?? null,
      shortDescription: body.shortDescription ?? null,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      isNewArrival: body.isNewArrival ?? false,
      isBestseller: body.isBestseller ?? false,
      isOnSale: body.isOnSale ?? false,
      metaTitle: body.metaTitle ?? null,
      metaDescription: body.metaDescription ?? null,
      metaKeywords: body.metaKeywords ?? null,
      categoryId: body.categoryId && body.categoryId.trim() !== '' ? body.categoryId : null,
      currency: body.currency ?? 'USD',
      status: body.status ?? 'PUBLISHED', // Use PUBLISHED as default
      details: body.details ?? null,
    }

    const images = body.images?.map((img: any, idx: number) => {
      // Remove any id fields to let Supabase auto-generate
      const { id, createdAt, updatedAt, ...imageData } = img
      return {
        url: img.url,
        alt: img.alt ?? null,
        isPrimary: !!img.isPrimary,
        sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : idx,
      }
    })

    const variants = body.variants?.map((v: any) => {
      // Remove any id fields to let Supabase auto-generate
      const { id, createdAt, updatedAt, ...variantData } = v
      return {
        sku: v.sku,
        title: v.title ?? null,
        price: Number(v.price ?? 0),
        compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : null,
        currency: v.currency ?? 'USD',
        stock: Number(v.stock ?? 0),
        isDefault: !!v.isDefault,
        attributes: v.attributes ?? {},
        barcode: v.barcode ?? null,
        weightGrams: v.weightGrams ? Number(v.weightGrams) : null,
        lengthCm: v.lengthCm ? Number(v.lengthCm) : null,
        widthCm: v.widthCm ? Number(v.widthCm) : null,
        heightCm: v.heightCm ? Number(v.heightCm) : null,
      }
    })

    const created = await productService.create(productData, images, variants)
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (e: any) {
    console.error('Error creating product:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to create product' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const { id, createdAt, updatedAt, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Clean update data
    const updateData = {
      ...updates,
      description: updates.description || 'No description provided',
      categoryId: updates.categoryId && updates.categoryId.trim() !== '' ? updates.categoryId : null,
    }

    const images = body.images?.map((img: any, idx: number) => {
      // Remove any id fields to let Supabase auto-generate
      const { id, createdAt, updatedAt, ...imageData } = img
      return {
        url: img.url,
        alt: img.alt ?? null,
        isPrimary: !!img.isPrimary,
        sortOrder: typeof img.sortOrder === 'number' ? img.sortOrder : idx,
      }
    })

    const variants = body.variants?.map((v: any) => {
      // Remove any id fields to let Supabase auto-generate
      const { id, createdAt, updatedAt, ...variantData } = v
      return {
        sku: v.sku,
        title: v.title ?? null,
        price: Number(v.price ?? 0),
        compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : null,
        currency: v.currency ?? 'USD',
        stock: Number(v.stock ?? 0),
        isDefault: !!v.isDefault,
        attributes: v.attributes ?? {},
        barcode: v.barcode ?? null,
        weightGrams: v.weightGrams ? Number(v.weightGrams) : null,
        lengthCm: v.lengthCm ? Number(v.lengthCm) : null,
        widthCm: v.widthCm ? Number(v.widthCm) : null,
        heightCm: v.heightCm ? Number(v.heightCm) : null,
      }
    })

    const updated = await productService.update(id, updateData, images, variants)
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating product:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to update product' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const url = req.nextUrl
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    await productService.delete(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting product:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete product' }, { status: 400 })
  }
}


