import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id
    const { id } = await params
    const { 
      label, 
      fullName, 
      line1, 
      line2, 
      city, 
      region, 
      postalCode, 
      countryCode, 
      phone,
      isDefaultShip = false,
      isDefaultBill = false
    } = await request.json()

    // Validate required fields
    if (!fullName || !line1 || !city || !countryCode) {
      return NextResponse.json({ 
        error: 'Missing required fields: fullName, line1, city, countryCode' 
      }, { status: 400 })
    }

    // Verify user owns this address
    const { data: existingAddress, error: checkError } = await serverSupabase
      .from('Address')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single()

    if (checkError || !existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // If setting as default, remove default flag from other addresses
    if (isDefaultShip && !existingAddress.isDefaultShip) {
      await serverSupabase
        .from('Address')
        .update({ isDefaultShip: false })
        .eq('userId', userId)
        .eq('isDefaultShip', true)
    }

    if (isDefaultBill && !existingAddress.isDefaultBill) {
      await serverSupabase
        .from('Address')
        .update({ isDefaultBill: false })
        .eq('userId', userId)
        .eq('isDefaultBill', true)
    }

    // Update address
    const { data: address, error: updateError } = await serverSupabase
      .from('Address')
      .update({
        label,
        fullName,
        line1,
        line2,
        city,
        region,
        postalCode,
        countryCode,
        phone,
        isDefaultShip,
        isDefaultBill,
        updatedAt: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError

    return NextResponse.json({ 
      address,
      success: true, 
      message: 'Address updated successfully' 
    })

  } catch (error) {
    console.error('Address PUT error:', error)
    return NextResponse.json({ error: 'Failed to update address' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id
    const { id } = await params

    // Verify user owns this address
    const { data: existingAddress, error: checkError } = await serverSupabase
      .from('Address')
      .select('*')
      .eq('id', id)
      .eq('userId', userId)
      .single()

    if (checkError || !existingAddress) {
      return NextResponse.json({ error: 'Address not found' }, { status: 404 })
    }

    // Delete address
    const { error: deleteError } = await serverSupabase
      .from('Address')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return NextResponse.json({ 
      success: true, 
      message: 'Address deleted successfully' 
    })

  } catch (error) {
    console.error('Address DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 })
  }
}