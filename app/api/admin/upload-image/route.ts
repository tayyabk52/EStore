import { NextRequest, NextResponse } from 'next/server'
import { storageService } from '@/lib/storage'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

// Helper function to validate admin key
function validateAdminKey(req: NextRequest): boolean {
  const adminKey = req.headers.get('x-admin-key')
  const envKey = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || process.env.ADMIN_SECRET_KEY
  return adminKey === envKey
}

export async function POST(req: NextRequest) {
  // Validate admin access
  if (!validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    const productId = formData.get('productId') as string
    const fileName = formData.get('fileName') as string
    const categorySlug = formData.get('categorySlug') as string
    const storageType = formData.get('storageType') as string || 'supabase' // 'supabase' or 'local'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, WebP, and GIF are allowed.' 
      }, { status: 400 })
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 10MB.' 
      }, { status: 400 })
    }

    let result

    if (storageType === 'local') {
      // Upload to local public directory
      result = await uploadToLocalStorage(file, productId, fileName)
    } else {
      // Upload to Supabase storage (default) with category organization
      result = await storageService.uploadImage(file, productId, fileName, categorySlug)
    }

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      path: result.path,
      fileName: file.name,
      size: file.size,
      type: file.type,
      storageType: storageType
    })

  } catch (error) {
    console.error('Image upload error:', error)
    return NextResponse.json({ 
      error: 'Upload failed. Please try again.' 
    }, { status: 500 })
  }
}

// Helper function to upload to local storage
async function uploadToLocalStorage(file: File, productId: string, fileName?: string) {
  try {
    // Create unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = fileName || `${productId}-${timestamp}.${fileExtension}`
    
    // Create directory structure: public/uploads/products/{productId}/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'products', productId)
    const filePath = join(uploadDir, uniqueFileName)
    const publicPath = `/uploads/products/${productId}/${uniqueFileName}`

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (mkdirError) {
      console.error('Directory creation error:', mkdirError)
    }

    // Convert file to buffer and write
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return the public URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    return {
      url: `${baseUrl}${publicPath}`,
      path: publicPath
    }
  } catch (error) {
    console.error('Local storage upload error:', error)
    return { url: '', path: '', error: 'Local upload failed' }
  }
}

export async function DELETE(req: NextRequest) {
  // Validate admin access
  if (!validateAdminKey(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { filePath } = await req.json()

    if (!filePath) {
      return NextResponse.json({ error: 'File path is required' }, { status: 400 })
    }

    const result = await storageService.deleteImage(filePath)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Image delete error:', error)
    return NextResponse.json({ 
      error: 'Delete failed. Please try again.' 
    }, { status: 500 })
  }
}


