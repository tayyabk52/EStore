import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    // Get or create wishlist for user
    const { data: wishlist, error: wishlistError } = await serverSupabase
      .from('Wishlist')
      .select('*')
      .eq('userId', userId)
      .single()

    if (wishlistError && wishlistError.code !== 'PGRST116') {
      throw wishlistError
    }

    if (!wishlist) {
      // Create new wishlist
      const { data: newWishlist, error: createError } = await serverSupabase
        .from('Wishlist')
        .insert([{ 
          id: crypto.randomUUID(),
          userId, 
          updatedAt: new Date().toISOString() 
        }])
        .select()
        .single()

      if (createError) throw createError
      wishlist = newWishlist
    }

    // Get wishlist items with product details
    const { data: wishlistItems, error: itemsError } = await serverSupabase
      .from('WishlistItem')
      .select(`
        id,
        productId,
        createdAt,
        Product!inner(
          id,
          title,
          slug,
          shortDescription,
          brand,
          ProductImage(
            id,
            url,
            alt,
            isPrimary,
            sortOrder
          ),
          ProductVariant(
            id,
            price,
            compareAtPrice,
            currency,
            isDefault,
            stock
          )
        )
      `)
      .eq('wishlistId', wishlist.id)
      .order('createdAt', { ascending: false })

    if (itemsError) throw itemsError

    return NextResponse.json({
      wishlist: {
        id: wishlist.id,
        userId: wishlist.userId,
        itemCount: wishlistItems?.length || 0,
        items: wishlistItems || []
      }
    })

  } catch (error) {
    console.error('Wishlist GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Verify product exists
    const { data: product, error: productError } = await serverSupabase
      .from('Product')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    // Get or create wishlist
    const { data: wishlist, error: wishlistError } = await serverSupabase
      .from('Wishlist')
      .select('*')
      .eq('userId', userId)
      .single()

    if (wishlistError && wishlistError.code !== 'PGRST116') {
      throw wishlistError
    }

    if (!wishlist) {
      const { data: newWishlist, error: createError } = await serverSupabase
        .from('Wishlist')
        .insert([{ 
          id: crypto.randomUUID(),
          userId, 
          updatedAt: new Date().toISOString() 
        }])
        .select()
        .single()

      if (createError) throw createError
      wishlist = newWishlist
    }

    // Check if item already exists in wishlist
    const { data: existingItem, error: existingError } = await serverSupabase
      .from('WishlistItem')
      .select('*')
      .eq('wishlistId', wishlist.id)
      .eq('productId', productId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError
    }

    if (existingItem) {
      return NextResponse.json({ error: 'Product already in wishlist' }, { status: 409 })
    }

    // Add item to wishlist
    const { error: insertError } = await serverSupabase
      .from('WishlistItem')
      .insert([{
        id: crypto.randomUUID(),
        wishlistId: wishlist.id,
        productId
      }])

    if (insertError) throw insertError

    // Update wishlist timestamp
    await serverSupabase
      .from('Wishlist')
      .update({ updatedAt: new Date().toISOString() })
      .eq('id', wishlist.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Product added to wishlist successfully' 
    })

  } catch (error) {
    console.error('Wishlist POST error:', error)
    return NextResponse.json({ error: 'Failed to add product to wishlist' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Get user's wishlist
    const { data: wishlist, error: wishlistError } = await serverSupabase
      .from('Wishlist')
      .select('id')
      .eq('userId', userId)
      .single()

    if (wishlistError || !wishlist) {
      return NextResponse.json({ error: 'Wishlist not found' }, { status: 404 })
    }

    // Remove item from wishlist
    const { error: deleteError } = await serverSupabase
      .from('WishlistItem')
      .delete()
      .eq('wishlistId', wishlist.id)
      .eq('productId', productId)

    if (deleteError) throw deleteError

    return NextResponse.json({ 
      success: true, 
      message: 'Product removed from wishlist successfully' 
    })

  } catch (error) {
    console.error('Wishlist DELETE error:', error)
    return NextResponse.json({ error: 'Failed to remove product from wishlist' }, { status: 500 })
  }
}