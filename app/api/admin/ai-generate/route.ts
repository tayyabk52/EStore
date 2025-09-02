import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY
const GEMINI_API_KEY = process.env.GEMNI_KEY

// Function to extract and validate JSON from AI response
function extractAndValidateJSON(responseText: string) {
  console.log('Raw AI response:', responseText)
  
  // Remove markdown code blocks if present
  let cleanedResponse = responseText.trim()
  
  // Remove ```json and ``` markers
  cleanedResponse = cleanedResponse.replace(/^```json\s*/i, '')
  cleanedResponse = cleanedResponse.replace(/\s*```$/, '')
  
  // Remove any leading/trailing whitespace again
  cleanedResponse = cleanedResponse.trim()
  
  // Try to find JSON object boundaries if there's extra text
  const jsonStart = cleanedResponse.indexOf('{')
  const jsonEnd = cleanedResponse.lastIndexOf('}')
  
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanedResponse = cleanedResponse.substring(jsonStart, jsonEnd + 1)
  }
  
  console.log('Cleaned response:', cleanedResponse)
  
  try {
    const parsed = JSON.parse(cleanedResponse)
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'price']
    const missingFields = requiredFields.filter(field => !parsed[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }
    
    // Ensure arrays are arrays
    if (parsed.tags && !Array.isArray(parsed.tags)) {
      parsed.tags = []
    }
    if (parsed.colors && !Array.isArray(parsed.colors)) {
      parsed.colors = []
    }
    if (parsed.sizes && !Array.isArray(parsed.sizes)) {
      parsed.sizes = []
    }
    if (parsed.images && !Array.isArray(parsed.images)) {
      parsed.images = []
    }
    if (parsed.variants && !Array.isArray(parsed.variants)) {
      parsed.variants = []
    }
    
    // Ensure price is a number
    if (parsed.price && typeof parsed.price === 'string') {
      parsed.price = parseFloat(parsed.price)
    }
    if (parsed.originalPrice && typeof parsed.originalPrice === 'string') {
      parsed.originalPrice = parseFloat(parsed.originalPrice)
    }
    if (parsed.costPrice && typeof parsed.costPrice === 'string') {
      parsed.costPrice = parseFloat(parsed.costPrice)
    }
    
    return parsed
  } catch (parseError) {
    console.error('JSON parse error:', parseError)
    throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('AI API called - Admin Key:', !!ADMIN_SECRET_KEY, 'Gemini Key:', !!GEMINI_API_KEY)
    
    // Check admin authentication
    const adminKey = request.headers.get('x-admin-key')
    if (!adminKey || adminKey !== ADMIN_SECRET_KEY) {
      console.log('Auth failed:', { adminKey: !!adminKey, match: adminKey === ADMIN_SECRET_KEY })
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!GEMINI_API_KEY) {
      console.log('Gemini API key missing')
      return NextResponse.json({ error: 'AI service not configured' }, { status: 500 })
    }

    const { imageUrl, context } = await request.json()

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Convert image URL to base64
    let imageData: string
    try {
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.status}`)
      }
      const arrayBuffer = await imageResponse.arrayBuffer()
      const base64 = Buffer.from(arrayBuffer).toString('base64')
      const mimeType = imageResponse.headers.get('content-type') || 'image/jpeg'
      imageData = `data:${mimeType};base64,${base64}`
    } catch (error) {
      console.error('Error fetching image:', error)
      return NextResponse.json({ error: 'Failed to process image' }, { status: 400 })
    }

    const prompt = `Analyze this product image and generate a complete product data JSON object for an e-commerce platform. 

Consider the existing context: ${JSON.stringify(context || {})}

CRITICAL: Return ONLY a valid JSON object with these exact fields (no markdown, no code blocks, no explanations):

{
  "name": "product name (50 chars max)",
  "description": "detailed description (500 chars max)",
  "shortDescription": "brief description (150 chars max)",
  "brand": "brand name",
  "category": "main category",
  "subcategory": "specific subcategory",
  "price": 25.00,
  "originalPrice": null,
  "costPrice": 15.00,
  "sku": "product SKU code",
  "barcode": null,
  "tags": ["tag1", "tag2"],
  "colors": ["color1"],
  "sizes": [],
  "stock": 10,
  "minStockLevel": 5,
  "weight": 15,
  "dimensions": "product dimensions",
  "materials": "materials description",
  "care": "care instructions",
  "isActive": true,
  "isFeatured": false,
  "isNewArrival": true,
  "isBestseller": false,
  "isOnSale": false,
  "showInNavigation": false,
  "metaTitle": "SEO title (60 chars max)",
  "metaDescription": "SEO description (155 chars max)",
  "metaKeywords": "comma-separated keywords",
  "variants": [{"id": 1, "name": "Default", "price": 25.00, "sku": "SKU-001", "stock": 10}],
  "images": ["${imageUrl}"],
  "mainImage": "${imageUrl}"
}

IMPORTANT: 
- Use the actual image URL "${imageUrl}" for images and mainImage fields
- Return ONLY the JSON object - no markdown code blocks, no explanations
- Ensure all string fields are properly quoted
- Ensure numeric fields are numbers, not strings
- Arrays must be valid JSON arrays`

    const result = await model.generateContent([
      {
        inlineData: {
          data: imageData.split(',')[1],
          mimeType: imageData.split(';')[0].split(':')[1]
        }
      },
      prompt
    ])

    const responseText = result.response.text()
    
    try {
      const productData = extractAndValidateJSON(responseText)
      return NextResponse.json(productData)
    } catch (parseError) {
      console.error('Failed to parse AI response:', responseText)
      console.error('Parse error:', parseError)
      return NextResponse.json({ 
        error: 'Invalid AI response format',
        details: parseError instanceof Error ? parseError.message : 'Unknown parsing error',
        rawResponse: responseText.substring(0, 500) // First 500 chars for debugging
      }, { status: 500 })
    }

  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ 
      error: 'AI generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

// Test endpoint for debugging JSON parsing
export async function GET() {
  const testResponse = `\`\`\`json
{
  "name": "Test Product",
  "description": "This is a test",
  "price": "25.00"
}
\`\`\``
  
  try {
    const result = extractAndValidateJSON(testResponse)
    return NextResponse.json({ success: true, result })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      testInput: testResponse 
    })
  }
}
