import { NextRequest, NextResponse } from 'next/server'
import { orderService, utils } from '@/lib/supabase-admin'

// POST /api/admin/orders/test-data - Create test order data
export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const testOrders = await orderService.createTestData()
    return NextResponse.json({ 
      success: true, 
      message: `Created ${testOrders.length} test orders`,
      orders: testOrders
    })
  } catch (error: any) {
    console.error('Error creating test data:', error)
    return NextResponse.json({ 
      error: 'Failed to create test data',
      details: error.message 
    }, { status: 500 })
  }
}