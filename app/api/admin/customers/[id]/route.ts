import { NextRequest, NextResponse } from 'next/server'
import { customerService, utils } from '@/lib/supabase-admin'

// GET /api/admin/customers/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const customer = await customerService.getById(params.id)
    
    // Get additional stats
    const orderCount = await customerService.getOrderCount(customer.userId)
    const totalSpent = await customerService.getTotalSpent(customer.userId)

    const customerWithStats = {
      ...customer,
      orderCount,
      totalSpent,
    }

    return NextResponse.json(customerWithStats)
  } catch (error) {
    console.error('Error fetching customer:', error)
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }
}

// PATCH /api/admin/customers/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const body = await req.json()
    const { createdAt, updatedAt, ...updates } = body

    // Clean update data
    const updateData = {
      ...updates,
      displayName: updates.displayName?.trim() || null,
      avatarUrl: updates.avatarUrl?.trim() || null,
      phone: updates.phone?.trim() || null,
    }

    const updated = await customerService.update(params.id, updateData)
    return NextResponse.json(updated)
  } catch (e: any) {
    console.error('Error updating customer:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to update customer' }, { status: 400 })
  }
}

// DELETE /api/admin/customers/[id]
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    await customerService.delete(params.id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting customer:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete customer' }, { status: 400 })
  }
}