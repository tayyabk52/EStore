import { NextRequest, NextResponse } from 'next/server'
import { validateAuth, serverSupabase } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id

    // Get user profile
    const { data: profile, error: profileError } = await serverSupabase
      .from('Profile')
      .select('*')
      .eq('userId', userId)
      .single()

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }

    if (!profile) {
      // Create a default profile if none exists
      const { data: newProfile, error: createError } = await serverSupabase
        .from('Profile')
        .insert([{ 
          id: crypto.randomUUID(),
          userId, 
          updatedAt: new Date().toISOString() 
        }])
        .select()
        .single()

      if (createError) throw createError
      
      return NextResponse.json({ profile: newProfile })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authResult = await validateAuth(request)
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status })
    }
    
    const userId = authResult.user!.id
    const { displayName, avatarUrl, phone } = await request.json()

    // Update profile
    const { data: profile, error: updateError } = await serverSupabase
      .from('Profile')
      .update({ 
        displayName,
        avatarUrl,
        phone,
        updatedAt: new Date().toISOString()
      })
      .eq('userId', userId)
      .select()
      .single()

    if (updateError) {
      // If profile doesn't exist, create it
      if (updateError.code === 'PGRST116') {
        const { data: newProfile, error: createError } = await serverSupabase
          .from('Profile')
          .insert([{ 
            id: crypto.randomUUID(),
            userId,
            displayName,
            avatarUrl,
            phone,
            updatedAt: new Date().toISOString()
          }])
          .select()
          .single()

        if (createError) throw createError
        
        return NextResponse.json({ 
          profile: newProfile,
          success: true, 
          message: 'Profile created successfully' 
        })
      }
      throw updateError
    }

    return NextResponse.json({ 
      profile,
      success: true, 
      message: 'Profile updated successfully' 
    })

  } catch (error) {
    console.error('Profile PUT error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}