import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'

import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMNI_KEY || '')

async function fetchAsBase64(url: string) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Image fetch failed: ${res.status}`)
  const ab = await res.arrayBuffer()
  const base64 = Buffer.from(ab).toString('base64')
  const contentType = res.headers.get('content-type') || 'image/jpeg'
  return { base64, contentType }
}

export async function POST(req: NextRequest) {
  try {
    const adminKey = req.headers.get('x-admin-key')
    const envKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
    if (!adminKey || adminKey !== envKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { imageUrl, context } = await req.json()
    if (!imageUrl) {
      return NextResponse.json({ error: 'imageUrl is required' }, { status: 400 })
    }

    const { base64, contentType } = await fetchAsBase64(imageUrl)

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: { temperature: 0.6, responseMimeType: 'application/json' }
    })

    const prompt = `
You are helping fill an ecommerce admin product form. Analyze the product image and output JSON matching EXACTLY this shape used by our admin form (keys and nesting must match):

type AdminProductFormJson = {
  name: string
  description: string
  shortDescription: string
  price: number | string
  originalPrice: number | string
  costPrice: number | string
  sku: string
  barcode: string
  category: string
  subcategory: string
  brand: string
  tags: string[]
  colors: string[]
  sizes: string[]
  stock: number | string
  minStockLevel: number | string
  weight: number | string
  dimensions: string
  materials: string
  care: string
  isActive: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isBestseller: boolean
  isOnSale: boolean
  showInNavigation: boolean
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  images: string[]
  mainImage: string
  variants: Array<Record<string, unknown>>
}

Rules:
- If a field cannot be verified, infer tasteful defaults suitable for fashion retail.
- Use brand "${context?.brand || 'Evelon'}" if unknown.
- name 3-6 words; shortDescription ~1 sentence; description 3-6 sentences; avoid false claims.
- price, originalPrice, costPrice as numeric strings; stock as numeric string.
- isActive true; others false unless clearly indicated.
- category/subcategory may be empty strings if unknown.
- tags, colors, sizes: arrays of relevant strings based on the image.
- materials: describe what the product appears to be made of.
- care: provide appropriate care instructions.
- dimensions: approximate size description.
- weight: estimated weight as numeric string.
- variants: include at least one default variant with basic properties.
- images: MUST include the exact image URL "${imageUrl}" in the array.
- mainImage: MUST be set to the exact image URL "${imageUrl}" - do not use placeholders.
- metaTitle <= 60 chars; metaDescription <= 155 chars.
- IMPORTANT: Use the actual image URL "${imageUrl}" for images and mainImage fields, not placeholders.
- Return ONLY the JSON object. No markdown or prose.

Hints:
${context?.name ? `- Preferred product name: ${context.name}` : ''}
${context?.brand ? `- Preferred brand: ${context.brand}` : ''}`

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType: contentType } },
      { text: prompt }
    ])

    const text = result.response.text()
    let parsed: unknown
    try { parsed = JSON.parse(text) } catch {
      return NextResponse.json({ error: 'Bad AI JSON', raw: text }, { status: 502 })
    }

    return NextResponse.json(parsed)
  } catch (e: unknown) {
    console.error('test-ai error:', e)
    return NextResponse.json({ error: 'Generation failed', details: e instanceof Error ? e.message : 'Unknown error' }, { status: 500 })
  }
}


