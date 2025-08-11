import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    const { quantity } = await request.json()
    const { itemId } = await params

    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Valid quantity is required' }, { status: 400 })
    }

    // Verify user owns this cart item
    const { data: cartItem, error: itemError } = await serverSupabase
      .from('CartItem')
      .select(`
        id,
        variantId,
        quantity,
        Cart!inner(userId)
      `)
      .eq('id', itemId)
      .single()

    if (itemError || !cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    if (cartItem.Cart.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Check stock availability
    const { data: variant, error: variantError } = await serverSupabase
      .from('ProductVariant')
      .select('stock')
      .eq('id', cartItem.variantId)
      .single()

    if (variantError || !variant) {
      return NextResponse.json({ error: 'Product variant not found' }, { status: 404 })
    }

    if (quantity > variant.stock) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Update quantity
    const { error: updateError } = await serverSupabase
      .from('CartItem')
      .update({ 
        quantity,
        updatedAt: new Date().toISOString()
      })
      .eq('id', itemId)

    if (updateError) throw updateError

    return NextResponse.json({ 
      success: true, 
      message: 'Cart item updated successfully' 
    })

  } catch (error) {
    console.error('Cart item PUT error:', error)
    return NextResponse.json({ error: 'Failed to update cart item' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ itemId: string }> }
) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    const { itemId } = await params

    // Verify user owns this cart item
    const { data: cartItem, error: itemError } = await serverSupabase
      .from('CartItem')
      .select(`
        id,
        Cart!inner(userId)
      `)
      .eq('id', itemId)
      .single()

    if (itemError || !cartItem) {
      return NextResponse.json({ error: 'Cart item not found' }, { status: 404 })
    }

    if (cartItem.Cart.userId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Delete cart item
    const { error: deleteError } = await serverSupabase
      .from('CartItem')
      .delete()
      .eq('id', itemId)

    if (deleteError) throw deleteError

    return NextResponse.json({ 
      success: true, 
      message: 'Cart item removed successfully' 
    })

  } catch (error) {
    console.error('Cart item DELETE error:', error)
    return NextResponse.json({ error: 'Failed to remove cart item' }, { status: 500 })
  }
}