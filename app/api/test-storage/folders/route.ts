import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'

import { createClient } from '@supabase/supabase-js'

function createAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

export async function GET(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key')
    const envKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
    if (!adminKey || adminKey !== envKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createAdmin()
    const bucket = 'product-images'
    const folders: string[] = []

    const walk = async (prefix: string) => {
      const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } as any })
      if (error) return
      for (const item of (data || [])) {
        const isFolder = (item as any).metadata == null
        if (isFolder) {
          const next = prefix ? `${prefix}/${item.name}` : item.name
          folders.push(next)
          await walk(next)
        }
      }
    }
    await walk('')
    folders.sort()
    return NextResponse.json({ folders })
  } catch (e: any) {
    console.error('list folders error', e)
    return NextResponse.json({ error: 'Failed to list folders', details: e.message }, { status: 500 })
  }
}


