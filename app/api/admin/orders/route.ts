import { NextRequest, NextResponse } from 'next/server'
import { orderService, utils } from '@/lib/supabase-admin'

// GET /api/admin/orders?key=...&q=&page=1&perPage=20&status=
export async function GET(req: NextRequest) {
  console.log('🚀 GET /api/admin/orders - Starting request')
  
  if (!utils.validateAdminKey(req)) {
    console.log('❌ Unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const url = req.nextUrl
  const q = url.searchParams.get('q')?.trim() || ''
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('perPage') || '20')))
  const status = url.searchParams.get('status')?.trim() || ''

  console.log('📋 Query params:', { q, page, perPage, status })

  try {
    console.log('🔍 Calling orderService.getAll...')
    
    const result = await orderService.getAll({
      page,
      perPage,
      search: q,
      status
    })

    console.log('✅ Got orders result:', {
      total: result.total,
      itemsCount: result.items?.length || 0
    })

    return NextResponse.json({
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      items: result.items,
    })
  } catch (error: any) {
    console.error('❌ Error fetching orders:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    return NextResponse.json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/admin/orders
export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const userId: string = (body.userId ?? '').toString().trim()
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    // Clean order data - remove any id fields that might be passed
    const { id, createdAt, updatedAt, ...bodyData } = body
    
    const orderData = {
      userId,
      number: body.number?.trim() || `ORD-${Date.now()}`,
      status: body.status || 'PENDING',
      paymentStatus: body.paymentStatus || 'PAYMENT_PENDING',
      currency: body.currency || 'PKR',
      subtotal: Number(body.subtotal) || 0,
      tax: Number(body.tax) || 0,
      shipping: Number(body.shipping) || 0,
      discount: Number(body.discount) || 0,
      total: Number(body.total) || 0,
      shippingAddressId: body.shippingAddressId?.trim() || null,
      billingAddressId: body.billingAddressId?.trim() || null,
      notes: body.notes?.trim() || null,
      paymentProvider: body.paymentProvider?.trim() || null,
      paymentIntentId: body.paymentIntentId?.trim() || null,
      paymentData: body.paymentData || null,
      metadata: body.metadata || null,
    }

    const created = await orderService.create(orderData)
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (e: any) {
    console.error('Error creating order:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to create order' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const { id, createdAt, updatedAt, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    // Clean update data
    const updateData = {
      ...updates,
      number: updates.number?.trim(),
      notes: updates.notes?.trim() || null,
      paymentProvider: updates.paymentProvider?.trim() || null,
      paymentIntentId: updates.paymentIntentId?.trim() || null,
      subtotal: updates.subtotal ? Number(updates.subtotal) : undefined,
      tax: updates.tax ? Number(updates.tax) : undefined,
      shipping: updates.shipping ? Number(updates.shipping) : undefined,
      discount: updates.discount ? Number(updates.discount) : undefined,
      total: updates.total ? Number(updates.total) : undefined,
    }

    const updated = await orderService.update(id, updateData)
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating order:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to update order' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const url = req.nextUrl
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 })
    }

    await orderService.delete(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting order:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete order' }, { status: 400 })
  }
}