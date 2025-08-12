import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { randomUUID } from "crypto"

// Verify admin access
function verifyAdmin(request: NextRequest) {
  const adminKey = request.headers.get('x-admin-key')
  const expectedKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
  
  if (!adminKey || !expectedKey || adminKey !== expectedKey) {
    return false
  }
  return true
}

export async function GET(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: collections, error } = await supabase
      .from('Collection')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Error fetching collections:', error)
      return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 })
    }

    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Error in collections GET:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!verifyAdmin(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, imageUrl, isFeatured } = body

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 })
    }

    // Note: Slug uniqueness not enforced in schema, allowing duplicates for now

    const now = new Date().toISOString()
    
    const { data, error } = await supabase
      .from('Collection')
      .insert({
        id: randomUUID(),
        name: name.trim(),
        slug: slug.trim(),
        description: description?.trim() || null,
        imageUrl: imageUrl?.trim() || null,
        isFeatured: !!isFeatured,
        createdAt: now,
        updatedAt: now
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating collection:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      return NextResponse.json({ 
        error: 'Failed to create collection', 
        details: error.message,
        code: error.code 
      }, { status: 500 })
    }

    return NextResponse.json({ collection: data }, { status: 201 })
  } catch (error) {
    console.error('Error in collections POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}