import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    // Get or create active cart for user
    let { data: cart, error: cartError } = await serverSupabase
      .from('Cart')
      .select('*')
      .eq('userId', userId)
      .eq('isActive', true)
      .single()

    if (cartError && cartError.code !== 'PGRST116') {
      throw cartError
    }

    if (!cart) {
      // Create new cart
      const { data: newCart, error: createError } = await serverSupabase
        .from('Cart')
        .insert([{ 
          id: crypto.randomUUID(),
          userId, 
          isActive: true, 
          updatedAt: new Date().toISOString() 
        }])
        .select()
        .single()

      if (createError) throw createError
      cart = newCart
    }

    // Get cart items with product details
    const { data: cartItems, error: itemsError } = await serverSupabase
      .from('CartItem')
      .select(`
        id,
        variantId,
        quantity,
        unitPrice,
        currency,
        productName,
        sku,
        imageUrl,
        createdAt,
        ProductVariant!inner(
          id,
          title,
          price,
          stock,
          Product!inner(
            id,
            title,
            slug,
            ProductImage(
              id,
              url,
              alt,
              isPrimary,
              sortOrder
            )
          )
        )
      `)
      .eq('cartId', cart.id)
      .order('createdAt', { ascending: false })

    if (itemsError) throw itemsError

    return NextResponse.json({
      cart: {
        id: cart.id,
        userId: cart.userId,
        itemCount: cartItems?.length || 0,
        items: cartItems || []
      }
    })

  } catch (error) {
    console.error('Cart GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    const { variantId, quantity = 1 } = await request.json()

    if (!variantId) {
      return NextResponse.json({ error: 'Variant ID is required' }, { status: 400 })
    }

    // Get product variant details
    const { data: variant, error: variantError } = await serverSupabase
      .from('ProductVariant')
      .select(`
        id,
        sku,
        title,
        price,
        currency,
        stock,
        Product!inner(
          id,
          title,
          slug,
          ProductImage!inner(
            url,
            alt,
            isPrimary,
            sortOrder
          )
        )
      `)
      .eq('id', variantId)
      .single()

    if (variantError || !variant) {
      return NextResponse.json({ error: 'Product variant not found' }, { status: 404 })
    }

    if (variant.stock < quantity) {
      return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
    }

    // Get or create cart  
    let { data: cart, error: cartError } = await serverSupabase
      .from('Cart')
      .select('*')
      .eq('userId', userId)
      .eq('isActive', true)
      .single()

    if (cartError && cartError.code !== 'PGRST116') {
      throw cartError
    }

    if (!cart) {
      const { data: newCart, error: createError } = await serverSupabase
        .from('Cart')
        .insert([{ 
          id: crypto.randomUUID(),
          userId, 
          isActive: true, 
          updatedAt: new Date().toISOString() 
        }])
        .select()
        .single()

      if (createError) throw createError
      cart = newCart
    }

    // Check if item already exists in cart
    const { data: existingItem, error: existingError } = await serverSupabase
      .from('CartItem')
      .select('*')
      .eq('cartId', cart.id)
      .eq('variantId', variantId)
      .single()

    if (existingError && existingError.code !== 'PGRST116') {
      throw existingError
    }

    const primaryImage = (variant.Product as any).ProductImage?.find((img: any) => img.isPrimary) || (variant.Product as any).ProductImage?.[0]

    if (existingItem) {
      // Update existing item quantity
      const newQuantity = existingItem.quantity + quantity
      if (newQuantity > variant.stock) {
        return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 })
      }

      const { error: updateError } = await serverSupabase
        .from('CartItem')
        .update({ 
          quantity: newQuantity,
          updatedAt: new Date().toISOString()
        })
        .eq('id', existingItem.id)

      if (updateError) throw updateError
    } else {
      // Add new item to cart
      const { error: insertError } = await serverSupabase
        .from('CartItem')
        .insert([{
          id: crypto.randomUUID(),
          cartId: cart.id,
          variantId,
          quantity,
          unitPrice: variant.price,
          currency: variant.currency,
          productName: (variant.Product as any).title,
          sku: variant.sku,
          imageUrl: primaryImage?.url,
          updatedAt: new Date().toISOString()
        }])

      if (insertError) throw insertError
    }

    // Update cart timestamp
    await serverSupabase
      .from('Cart')
      .update({ updatedAt: new Date().toISOString() })
      .eq('id', cart.id)

    return NextResponse.json({ 
      success: true, 
      message: 'Item added to cart successfully' 
    })

  } catch (error) {
    console.error('Cart POST error:', error)
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 })
  }
}