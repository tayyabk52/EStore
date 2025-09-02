import { NextRequest, NextResponse } from 'next/server'
import { customerService, utils } from '@/lib/supabase-admin'

// POST /api/admin/customers/test-data - Create test customer data
export async function POST(req: NextRequest) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const testCustomers = await customerService.createTestData()
    return NextResponse.json({ 
      success: true, 
      message: `Created ${testCustomers.length} test customers`,
      customers: testCustomers
    })
  } catch (error: any) {
    console.error('Error creating test data:', error)
    return NextResponse.json({ 
      error: 'Failed to create test data',
      details: error.message 
    }, { status: 500 })
  }
}