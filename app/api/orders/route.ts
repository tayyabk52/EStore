import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id
    const url = new URL(request.url)
    const limit = parseInt(url.searchParams.get('limit') || '20')
    const offset = parseInt(url.searchParams.get('offset') || '0')

    // Get user orders with items
    const { data: orders, error: orderError } = await serverSupabase
      .from('Order')
      .select(`
        id,
        number,
        status,
        paymentStatus,
        currency,
        subtotal,
        tax,
        shipping,
        discount,
        total,
        placedAt,
        createdAt,
        updatedAt,
        OrderItem(
          id,
          productId,
          quantity,
          unitPrice,
          currency,
          productName,
          sku,
          imageUrl
        )
      `)
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    if (orderError) throw orderError

    return NextResponse.json({ 
      orders: orders || [],
      pagination: {
        limit,
        offset,
        hasMore: (orders?.length || 0) === limit
      }
    })

  } catch (error) {
    console.error('Orders GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}