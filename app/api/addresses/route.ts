import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    // Get user addresses
    const { data: addresses, error: addressError } = await serverSupabase
      .from('Address')
      .select('*')
      .eq('userId', userId)
      .order('isDefaultShip', { ascending: false })
      .order('isDefaultBill', { ascending: false })
      .order('createdAt', { ascending: false })

    if (addressError) throw addressError

    return NextResponse.json({ addresses: addresses || [] })

  } catch (error) {
    console.error('Addresses GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch addresses' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id
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

    // If setting as default, remove default flag from other addresses
    if (isDefaultShip) {
      await serverSupabase
        .from('Address')
        .update({ isDefaultShip: false })
        .eq('userId', userId)
        .eq('isDefaultShip', true)
    }

    if (isDefaultBill) {
      await serverSupabase
        .from('Address')
        .update({ isDefaultBill: false })
        .eq('userId', userId)
        .eq('isDefaultBill', true)
    }

    // Create new address
    const { data: address, error: createError } = await serverSupabase
      .from('Address')
      .insert([{
        id: crypto.randomUUID(),
        userId,
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
      }])
      .select()
      .single()

    if (createError) throw createError

    return NextResponse.json({ 
      address,
      success: true, 
      message: 'Address created successfully' 
    })

  } catch (error) {
    console.error('Address POST error:', error)
    return NextResponse.json({ error: 'Failed to create address' }, { status: 500 })
  }
}