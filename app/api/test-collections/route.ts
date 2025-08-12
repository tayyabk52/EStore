import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    console.log('Testing Collection table access...')
    
    // Test if table exists and is accessible
    const { data, error, count } = await supabase
      .from('Collection')
      .select('*', { count: 'exact' })
      .limit(1)

    console.log('Collection query result:', { data, error, count })

    if (error) {
      return NextResponse.json({ 
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Collection table is accessible',
      recordCount: count,
      sampleData: data
    })
  } catch (error) {
    console.error('Test error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Test failed',
      details: error instanceof Error ? error.message : String(error)
    })
  }
}