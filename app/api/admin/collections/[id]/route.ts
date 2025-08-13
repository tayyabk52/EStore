import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

// Verify admin access
function verifyAdmin(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key')
  const expectedKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
  
  if (!adminKey || !expectedKey || adminKey !== expectedKey) {
    return false
  }
  return true
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, imageUrl, isFeatured } = body
    const { id } = await params

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Note: Slug uniqueness not enforced in schema, allowing duplicates for now

    const { data, error } = await supabase
      .from('Collection')
      .update({
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isFeatured: !!isFeatured,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating collection:', error)
      return NextResponse.json({ error: 'Failed to update collection' }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    return NextResponse.json({ collection: data })
  } catch (error) {
    console.error('Error in collections PUT:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // First check if collection exists
    const { data: existingCollection } = await supabase
      .from('Collection')
      .select('id, name')
      .eq('id', id)
      .single()

    if (!existingCollection) {
      return NextResponse.json({ error: 'Collection not found' }, { status: 404 })
    }

    // Check if collection has associated products (if you have a ProductCollection junction table)
    const { data: productCollections } = await supabase
      .from('ProductCollection')
      .select('id')
      .eq('collectionId', id)
      .limit(1)

    if (productCollections && productCollections.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete collection that contains products. Please remove products first.' 
      }, { status: 400 })
    }

    const { error } = await supabase
      .from('Collection')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting collection:', error)
      return NextResponse.json({ error: 'Failed to delete collection' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Collection deleted successfully' })
  } catch (error) {
    console.error('Error in collections DELETE:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}