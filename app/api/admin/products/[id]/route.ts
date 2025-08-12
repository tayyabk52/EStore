import { NextRequest, NextResponse } from 'next/server'
import { productService, utils } from '@/lib/supabase-admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const product = await productService.getById(id)
    // Normalize collections to arrays for admin UI
    const collectionIds = (product.collections || []).map((c: any) => c.collectionId)
    const collectionSortOrders = (product.collections || []).map((c: any) => c.sortOrder)
    return NextResponse.json({ ...product, collectionIds, collectionSortOrders })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const body = await req.json()
    const { images, variants, collections, collectionIds, collectionSortOrders, ...updates } = body

    // Prefer explicit collections array; else build from ids + sort orders
    const collectionsPayload = Array.isArray(collections)
      ? collections
      : Array.isArray(collectionIds)
        ? collectionIds.map((cid: string, idx: number) => ({ collectionId: cid, sortOrder: collectionSortOrders?.[idx] ?? 0 }))
        : undefined

    const updated = await productService.update(id, updates, images, variants, collectionsPayload)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await productService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
  }
}


