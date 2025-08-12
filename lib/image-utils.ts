/**
 * Utility functions for handling image URLs from various sources
 */

export function convertGoogleDriveUrl(url: string): string {
  if (!url) return ''

  // Handle Google Drive sharing URLs
  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    const fileId = match[1]
    // Try multiple Google Drive URL formats for better compatibility
    // This format often works better for embedding
    return `https://lh3.googleusercontent.com/d/${fileId}`
  }

  // Handle Google Drive direct URLs that are already in uc format
  if (url.includes('drive.google.com/uc?')) {
    return url
  }

  // Handle already converted googleusercontent URLs
  if (url.includes('googleusercontent.com')) {
    return url
  }

  // Handle other image URLs (Unsplash, direct URLs, etc.)
  return url
}

// Get all possible Google Drive URL formats for fallback
export function getGoogleDriveUrlVariants(url: string): string[] {
  if (!url) return []

  const driveRegex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/
  const match = url.match(driveRegex)
  
  if (match) {
    const fileId = match[1]
    return [
      `https://lh3.googleusercontent.com/d/${fileId}`,
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/uc?id=${fileId}`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000-h1000`,
    ]
  }

  return [url]
}

export function getOptimizedImageUrl(url: string, width?: number, height?: number, quality: number = 80): string {
  if (!url) return ''

  // First convert Google Drive URLs
  const convertedUrl = convertGoogleDriveUrl(url)

  // If it's an Unsplash URL, add optimization parameters
  if (convertedUrl.includes('unsplash.com')) {
    const baseUrl = convertedUrl.split('?')[0]
    const params = new URLSearchParams()
    
    if (width) params.append('w', width.toString())
    if (height) params.append('h', height.toString())
    params.append('q', quality.toString())
    params.append('auto', 'format')
    params.append('fit', 'crop')

    return `${baseUrl}?${params.toString()}`
  }

  // For Google Drive or other URLs, return as-is
  return convertedUrl
}

export function isValidImageUrl(url: string): boolean {
  if (!url) return false

  // Check for Google Drive URLs
  if (url.includes('drive.google.com')) return true

  // Check for common image hosting services
  const imageHosting = [
    'unsplash.com',
    'imgur.com',
    'cloudinary.com',
    'amazonaws.com',
    'googleusercontent.com'
  ]

  if (imageHosting.some(host => url.includes(host))) return true

  // Check for direct image file extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']
  return imageExtensions.some(ext => url.toLowerCase().includes(ext))
}

export function getImageSourceType(url: string): 'google-drive' | 'unsplash' | 'direct' | 'unknown' {
  if (!url) return 'unknown'

  if (url.includes('drive.google.com')) return 'google-drive'
  if (url.includes('unsplash.com')) return 'unsplash'
  if (isValidImageUrl(url)) return 'direct'
  
  return 'unknown'
}

// Fallback images for different card types
export const FALLBACK_IMAGES = {
  hero: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  medium: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  grid: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  spotlight: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
}