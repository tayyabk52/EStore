import { NextRequest, NextResponse } from 'next/server'
import { categoryService, utils } from '@/lib/supabase-admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    const category = await categoryService.getById(id)
    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
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
    const updated = await categoryService.update(id, body)
    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
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
    // Prevent deleting category that still has children or products
    const childrenCount = await categoryService.getProductCount(id).catch(() => 0)
    // Count sub-categories
    const mod = await import('@/lib/supabase')
    const { count: subCount } = await mod.supabase
      .from('Category')
      .select('*', { count: 'exact', head: true })
      .eq('parentId', id)

    if ((subCount || 0) > 0) {
      return NextResponse.json({ error: 'Category has sub-categories. Remove or reassign first.' }, { status: 400 })
    }
    if ((childrenCount || 0) > 0) {
      return NextResponse.json({ error: 'Category has products. Move products to another category first.' }, { status: 400 })
    }

    await categoryService.delete(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
}



