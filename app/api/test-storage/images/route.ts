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

    const prefix = new URL(req.url).searchParams.get('prefix') || ''
    const supabase = createAdmin()
    const bucket = 'product-images'
    const { data, error } = await supabase.storage.from(bucket).list(prefix, { limit: 1000, offset: 0, sortBy: { column: 'name', order: 'asc' } as any })
    if (error) throw error
    const items: Array<{ path: string; url: string }> = []
    for (const item of (data || [])) {
      const isFile = (item as any).metadata != null || /\.[a-z0-9]+$/i.test(item.name)
      if (!isFile) continue
      const path = prefix ? `${prefix}/${item.name}` : item.name
      if (path.startsWith('.')) continue
      const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path)
      items.push({ path, url: pub.publicUrl })
    }
    items.sort((a, b) => a.path.localeCompare(b.path))
    return NextResponse.json({ images: items })
  } catch (e: any) {
    console.error('list images error', e)
    return NextResponse.json({ error: 'Failed to list images', details: e.message }, { status: 500 })
  }
}


