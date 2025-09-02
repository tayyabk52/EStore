import { supabase } from './supabase'
import { createClient } from '@supabase/supabase-js'

// Create admin client for storage operations (server-side only)
function createAdminClient() {
  if (typeof window !== 'undefined') {
    throw new Error('Admin client should only be used on server-side')
  }
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export interface UploadResult {
  url: string
  path: string
  error?: string
}

export interface StorageFile {
  name: string
  size: number
  type: string
  lastModified: number
}

export class StorageService {
  private bucketName = 'product-images'

  /**
   * Upload an image file to Supabase storage with improved folder structure
   * Note: This method should only be called from server-side code
   */
  async uploadImage(file: File, productId: string, fileName?: string, categorySlug?: string): Promise<UploadResult> {
    try {
      // This method should only run on server-side
      if (typeof window !== 'undefined') {
        return { url: '', path: '', error: 'Upload must be done server-side' }
      }

      // Generate unique filename if not provided
      const timestamp = Date.now()
      const fileExtension = file.name.split('.').pop()
      const uniqueFileName = fileName || `${productId}-${timestamp}.${fileExtension}`
      
      // Improved folder structure: category/products/productId/filename
      // If no category, fallback to products/productId/filename
      const folderPath = categorySlug ? `categories/${categorySlug}/products/${productId}` : `products/${productId}`
      const filePath = `${folderPath}/${uniqueFileName}`

      // Upload file to storage using admin client
      const supabaseAdmin = createAdminClient()
      const { data, error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        return { url: '', path: '', error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(filePath)

      return {
        url: urlData.publicUrl,
        path: filePath
      }
    } catch (error) {
      console.error('Upload error:', error)
      return { url: '', path: '', error: 'Upload failed' }
    }
  }

  /**
   * Delete all images for a product from storage
   * Note: This method should only be called from server-side code
   */
  async deleteProductImages(productId: string, categorySlug?: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined') {
        return { success: false, error: 'Delete must be done server-side' }
      }

      const supabaseAdmin = createAdminClient()
      
      console.log(`🗑️ Starting storage deletion for product ${productId}, category: ${categorySlug || 'none'}`)
      
      // Try multiple folder structures for backward compatibility
      const folderPaths = [
        categorySlug ? `categories/${categorySlug}/products/${productId}` : null,
        `products/${productId}`,
        productId // Old structure for backward compatibility
      ].filter(Boolean) as string[]

      let deletedAny = false
      let lastError: string | null = null
      let totalDeleted = 0

      for (const folderPath of folderPaths) {
        try {
          console.log(`🔍 Checking folder: ${folderPath}`)
          
          // List all files in the folder
          const { data: files, error: listError } = await supabaseAdmin.storage
            .from(this.bucketName)
            .list(folderPath)

          if (listError) {
            console.warn(`⚠️ Could not list files in ${folderPath}:`, listError.message)
            continue
          }

          if (files && files.length > 0) {
            console.log(`📁 Found ${files.length} files in ${folderPath}`)
            
            // Delete all files in the folder
            const filePaths = files.map(file => `${folderPath}/${file.name}`)
            
            console.log(`🗑️ Deleting files:`, filePaths)
            
            const { error: deleteError } = await supabaseAdmin.storage
              .from(this.bucketName)
              .remove(filePaths)

            if (deleteError) {
              console.error(`❌ Error deleting files from ${folderPath}:`, deleteError.message)
              lastError = deleteError.message
            } else {
              console.log(`✅ Successfully deleted ${files.length} files from ${folderPath}`)
              deletedAny = true
              totalDeleted += files.length
            }
          } else {
            console.log(`📭 No files found in ${folderPath}`)
          }
        } catch (error) {
          console.warn(`⚠️ Error processing folder ${folderPath}:`, error)
        }
      }

      console.log(`🏁 Storage deletion complete for product ${productId}. Total files deleted: ${totalDeleted}`)

      if (!deletedAny && lastError) {
        return { success: false, error: lastError }
      }

      return { success: true }
    } catch (error) {
      console.error('❌ Delete product images error:', error)
      return { success: false, error: 'Delete failed' }
    }
  }

  /**
   * Delete an image from storage
   * Note: This method should only be called from server-side code
   */
  async deleteImage(filePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      if (typeof window !== 'undefined') {
        return { success: false, error: 'Delete must be done server-side' }
      }

      const supabaseAdmin = createAdminClient()
      const { error } = await supabaseAdmin.storage
        .from(this.bucketName)
        .remove([filePath])

      if (error) {
        console.error('Storage delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete error:', error)
      return { success: false, error: 'Delete failed' }
    }
  }

  /**
   * Get all images for a product (supports both old and new folder structures)
   * Note: This method should only be called from server-side code
   */
  async getProductImages(productId: string, categorySlug?: string): Promise<StorageFile[]> {
    try {
      if (typeof window !== 'undefined') {
        return []
      }

      const supabaseAdmin = createAdminClient()
      
      // Try both folder structures for backward compatibility
      const folderPaths = [
        categorySlug ? `categories/${categorySlug}/products/${productId}` : null,
        `products/${productId}`,
        productId // Old structure for backward compatibility
      ].filter(Boolean) as string[]

      for (const folderPath of folderPaths) {
        try {
          const { data, error } = await supabaseAdmin.storage
            .from(this.bucketName)
            .list(folderPath)

          if (!error && data && data.length > 0) {
            // Transform Supabase FileObject to our StorageFile interface
            return data.map(file => ({
              name: file.name,
              size: file.metadata?.size || 0,
              type: file.metadata?.mimetype || 'application/octet-stream',
              lastModified: file.updated_at ? new Date(file.updated_at).getTime() : Date.now()
            }))
          }
        } catch (error) {
          console.warn(`Warning: Could not list files in ${folderPath}:`, error)
        }
      }

      return []
    } catch (error) {
      console.error('List error:', error)
      return []
    }
  }

  /**
   * Check if a URL is from Supabase storage
   * Safe for client-side use
   */
  isStorageUrl(url: string): boolean {
    if (typeof window !== 'undefined') {
      // Client-side: use the public env var
      return url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '') && url.includes('/storage/')
    } else {
      // Server-side: use the same public env var
      return url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL || '') && url.includes('/storage/')
    }
  }

  /**
   * Convert Google Drive sharing URL to direct image URL
   */
  convertGoogleDriveUrl(url: string): string {
    // Check if it's a Google Drive URL
    if (!url.includes('drive.google.com')) {
      return url
    }

    // Extract file ID from various Google Drive URL formats
    let fileId = null

    // Format 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const viewMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\/view/)
    if (viewMatch) {
      fileId = viewMatch[1]
    }

    // Format 2: https://drive.google.com/open?id=FILE_ID
    const openMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/)
    if (openMatch) {
      fileId = openMatch[1]
    }

    // Format 3: https://drive.google.com/uc?id=FILE_ID
    const ucMatch = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/)
    if (ucMatch) {
      fileId = ucMatch[1]
    }

    if (fileId) {
      // Convert to direct download URL
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }

    // If no file ID found, return original URL
    return url
  }

  /**
   * Check if URL is a Google Drive URL
   */
  isGoogleDriveUrl(url: string): boolean {
    return url.includes('drive.google.com')
  }

  /**
   * Extract file path from storage URL
   */
  getFilePathFromUrl(url: string): string | null {
    if (!this.isStorageUrl(url)) return null
    
    try {
      const urlObj = new URL(url)
      
      // Handle Supabase storage URL format: /storage/v1/object/public/bucket-name/path
      const pathname = urlObj.pathname
      const storageIndex = pathname.indexOf('/storage/v1/object/public/')
      
      if (storageIndex !== -1) {
        const afterStorage = pathname.substring(storageIndex + '/storage/v1/object/public/'.length)
        const pathParts = afterStorage.split('/')
        
        // Remove bucket name (first part) and get the file path
        if (pathParts.length > 1) {
          pathParts.shift() // Remove bucket name
          return pathParts.join('/')
        }
      }
      
      // Fallback: try the old method
      const pathParts = pathname.split('/storage/')
      if (pathParts.length > 1) {
        return pathParts[1]
      }
    } catch (error) {
      console.error('Error parsing storage URL:', error)
    }
    
    return null
  }

  /**
   * Get optimized image URL with transformations
   */
  getOptimizedImageUrl(filePath: string, options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpeg' | 'png'
  } = {}): string {
    const { width, height, quality, format } = options
    
    let url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${this.bucketName}/${filePath}`
    
    // Add transformation parameters if provided
    const params = new URLSearchParams()
    if (width) params.append('width', width.toString())
    if (height) params.append('height', height.toString())
    if (quality) params.append('quality', quality.toString())
    if (format) params.append('format', format)
    
    if (params.toString()) {
      url += `?${params.toString()}`
    }
    
    return url
  }
}

export const storageService = new StorageService()
