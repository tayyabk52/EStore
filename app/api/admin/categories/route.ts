import { NextRequest, NextResponse } from 'next/server'
import { categoryService, utils } from '@/lib/supabase-admin'

export async function GET(req: NextRequest) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Simply return all categories - let the frontend handle hierarchy
    const categories = await categoryService.getAll()
    
    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  try {
    const body = await req.json()
    const name: string = (body.name ?? '').toString().trim()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const incomingSlug: string | undefined = body.slug?.toString().trim()
    const slug = incomingSlug && incomingSlug.length > 0 ? utils.slugify(incomingSlug) : utils.slugify(name)

    const categoryData = {
      name,
      slug,
      description: body.description ?? null,
      imageUrl: body.imageUrl ?? body.image ?? null,
      displayName: body.displayName ?? name,
      icon: body.icon ?? null,
      color: body.color ?? null,
      sortOrder: typeof body.sortOrder === 'number' ? body.sortOrder : 0,
      isActive: body.isActive ?? true,
      isFeatured: body.isFeatured ?? false,
      showInNavigation: body.showInNavigation ?? true,
      showInFooter: body.showInFooter ?? false,
      // Handle empty parentId properly - convert empty string to null
      parentId: body.parentId && body.parentId.trim() !== '' ? body.parentId : null,
    }

    const created = await categoryService.create(categoryData)
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    console.error('Error creating category:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to create category' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    // Handle empty parentId properly in updates too
    const updateData = {
      ...updates,
      parentId: updates.parentId && updates.parentId.trim() !== '' ? updates.parentId : null,
    }

    const updated = await categoryService.update(id, updateData)
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating category:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to update category' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const url = req.nextUrl
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
    }

    await categoryService.delete(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting category:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete category' }, { status: 400 })
  }
}