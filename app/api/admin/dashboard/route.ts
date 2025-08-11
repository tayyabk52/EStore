import { NextRequest, NextResponse } from 'next/server'
import { utils } from '@/lib/supabase-admin'
import { adminDashboardService } from '@/lib/admin-dashboard'

export async function GET(req: NextRequest) {
  if (!utils.validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await adminDashboardService.getStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 })
  }
}

