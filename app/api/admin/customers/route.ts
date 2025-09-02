import { NextRequest, NextResponse } from 'next/server'
import { customerService, utils } from '@/lib/supabase-admin'

// GET /api/admin/customers?key=...&q=&page=1&perPage=20
export async function GET(req: NextRequest) {
  console.log('🚀 GET /api/admin/customers - Starting request')
  
  if (!utils.validateAdminKey(req)) {
    console.log('❌ Unauthorized access attempt')
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const url = req.nextUrl
  const q = url.searchParams.get('q')?.trim() || ''
  const page = Number(url.searchParams.get('page') || '1')
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('perPage') || '20')))

  console.log('📋 Query params:', { q, page, perPage })

  try {
    console.log('🔍 Calling customerService.getAll...')
    
    // Try auth method first, fallback to profile-only method
    let result
    try {
      result = await customerService.getAll({
        page,
        perPage,
        search: q
      })
    } catch (authError: any) {
      console.warn('⚠️ Auth method failed, using fallback:', authError.message)
      result = await customerService.getAllFallback({
        page,
        perPage,
        search: q
      })
    }

    console.log('✅ Got customers result:', {
      total: result.total,
      itemsCount: result.items?.length || 0
    })

    // Transform the data to match the admin UI needs
    const transformedItems = await Promise.all(result.items.map(async (customer: any) => {
      console.log('🔄 Transforming customer:', customer.id || customer.userId)
      
      // Get additional stats with error handling
      let orderCount = 0
      let totalSpent = 0
      
      try {
        orderCount = await customerService.getOrderCount(customer.userId)
        totalSpent = await customerService.getTotalSpent(customer.userId)
      } catch (statsError) {
        console.warn('⚠️ Error getting customer stats:', statsError)
      }

      return {
        id: customer.id,
        userId: customer.userId,
        email: customer.email,
        displayName: customer.displayName,
        avatarUrl: customer.avatarUrl,
        phone: customer.phone,
        isAdmin: customer.isAdmin,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        lastSignInAt: customer.lastSignInAt,
        // Additional stats
        orderCount,
        totalSpent,
        // Related data counts
        addressCount: customer.addresses?.length || 0,
        cartCount: customer.carts?.length || 0,
        wishlistCount: customer.wishlists?.length || 0,
        // Full arrays needed by admin UI
        addresses: customer.addresses || [],
        orders: customer.orders || [],
        carts: customer.carts || [],
        wishlists: customer.wishlists || [],
      }
    }))

    console.log('✅ Transformed customers:', transformedItems.length)

    return NextResponse.json({
      page: result.page,
      perPage: result.perPage,
      total: result.total,
      items: transformedItems,
    })
  } catch (error: any) {
    console.error('❌ Error fetching customers:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    })
    return NextResponse.json({ 
      error: 'Failed to fetch customers',
      details: error.message 
    }, { status: 500 })
  }
}

// POST /api/admin/customers
export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const userId: string = (body.userId ?? '').toString().trim()
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 })

    // Clean customer data - remove any id fields that might be passed
    const { id, createdAt, updatedAt, ...bodyData } = body
    
    const customerData = {
      userId,
      displayName: body.displayName?.trim() || null,
      avatarUrl: body.avatarUrl?.trim() || null,
      phone: body.phone?.trim() || null,
      isAdmin: body.isAdmin ?? false,
    }

    const created = await customerService.create(customerData)
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (e: any) {
    console.error('Error creating customer:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to create customer' }, { status: 400 })
  }
}

export async function PUT(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  try {
    const body = await req.json()
    const { id, createdAt, updatedAt, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    // Clean update data
    const updateData = {
      ...updates,
      displayName: updates.displayName?.trim() || null,
      avatarUrl: updates.avatarUrl?.trim() || null,
      phone: updates.phone?.trim() || null,
    }

    const updated = await customerService.update(id, updateData)
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating customer:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to update customer' }, { status: 400 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const url = req.nextUrl
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 })
    }

    await customerService.delete(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting customer:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete customer' }, { status: 400 })
  }
}