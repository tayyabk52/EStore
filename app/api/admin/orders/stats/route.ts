import { NextRequest, NextResponse } from 'next/server'
import { orderService, utils } from '@/lib/supabase-admin'

// GET /api/admin/orders/stats - Get order statistics
export async function GET(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const stats = await orderService.getOrderStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Error fetching order stats:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch order stats',
      details: error.message 
    }, { status: 500 })
  }
}