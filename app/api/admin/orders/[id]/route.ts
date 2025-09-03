import { NextRequest, NextResponse } from 'next/server'
import { orderService, utils } from '@/lib/supabase-admin'

// GET /api/admin/orders/[id]
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    const order = await orderService.getById(id)
    return NextResponse.json(order)
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  }
}

// PATCH /api/admin/orders/[id]
export async function PATCH(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    const body = await req.json()
    const { createdAt, updatedAt, ...updates } = body

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

// DELETE /api/admin/orders/[id]
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!utils.validateAdminKey(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = await context.params
    await orderService.delete(id)
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error('Error deleting order:', e)
    return NextResponse.json({ error: e?.message ?? 'Failed to delete order' }, { status: 400 })
  }
}