import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function validateAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Missing or invalid authorization header', status: 401 }
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) {
      return { error: 'Invalid or expired token', status: 401 }
    }

    return { user, error: null, status: 200 }
  } catch (error) {
    console.error('Token validation error:', error)
    return { error: 'Token validation failed', status: 401 }
  }
}

export { supabase as serverSupabase }