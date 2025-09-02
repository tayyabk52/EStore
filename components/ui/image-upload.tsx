"use client"

import React, { useState, useCallback, useRef } from 'react'
import { Upload, X, ImageIcon, Link, FileImage, AlertCircle } from 'lucide-react'
import { Button } from './button'
import { storageService } from '@/lib/storage'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onDelete?: () => void
  productId?: string
  categorySlug?: string
  alt?: string
  onAltChange?: (alt: string) => void
  isPrimary?: boolean
  onPrimaryChange?: (isPrimary: boolean) => void
  sortOrder?: number
  onSortOrderChange?: (sortOrder: number) => void
  className?: string
  disabled?: boolean
  allowStorageSelection?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onDelete,
  productId,
  categorySlug,
  alt = '',
  onAltChange,
  isPrimary = false,
  onPrimaryChange,
  sortOrder = 0,
  onSortOrderChange,
  className = '',
  disabled = false,
  allowStorageSelection = true
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState(value)
  const [storageType, setStorageType] = useState<'supabase' | 'local'>('supabase')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = useCallback(async (file: File) => {
    if (!productId) {
      setUploadError('Product ID is required for uploads')
      return
    }

    setIsUploading(true)
    setUploadError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('productId', productId)
      formData.append('fileName', file.name)
      formData.append('storageType', storageType)
      if (categorySlug) {
        formData.append('categorySlug', categorySlug)
      }

      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY

      const response = await fetch('/api/admin/upload-image', {
        method: 'POST',
        headers: adminKey ? { 'x-admin-key': adminKey } : {},
        body: formData
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Upload failed')
      }

      onChange(result.url)
      setShowUrlInput(false)
      setUrlInput(result.url)
    } catch (error: any) {
      setUploadError(error.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }, [productId, onChange])

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)

    const file = event.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      let processedUrl = urlInput.trim()
      
      // Convert Google Drive URLs to direct image URLs
      if (storageService.isGoogleDriveUrl(processedUrl)) {
        processedUrl = storageService.convertGoogleDriveUrl(processedUrl)
      }
      
      onChange(processedUrl)
      setShowUrlInput(false)
    }
  }, [urlInput, onChange])

  const handleUrlCancel = useCallback(() => {
    setUrlInput(value)
    setShowUrlInput(false)
  }, [value])

  const isStorageImage = storageService.isStorageUrl(value)

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Image Preview */}
      {value && (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={value}
              alt={alt || 'Product image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02MCAxMDBDNjAgODkuNTQ0NyA2OC41NDQ3IDgxIDc5IDgxQzg5LjQ1NTMgODEgOTggODkuNTQ0NyA5OCAxMDBDOTggMTEwLjQ1NSA4OS40NTUzIDExOSA3OSAxMTlDNjguNTQ0NyAxMTkgNjAgMTEwLjQ1NSA2MCAxMDBaIiBmaWxsPSIjOUI5QkEwIi8+CjxwYXRoIGQ9Ik0xMDAgMTIwQzEwMCAxMDkuNTQ1IDk4IDk5IDEwMCA4OEMxMDIgNzcgMTA4IDY3IDEyMCA2N0MxMzIgNjcgMTM4IDc3IDE0MCA4OEMxNDIgOTkgMTQwIDEwOS41NDUgMTQwIDEyMEwxMDAgMTIwWiIgZmlsbD0iIzlCOUJBQSIvPgo8L3N2Zz4K'
              }}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowUrlInput(true)}
                  className="bg-white text-gray-700 hover:bg-gray-50"
                >
                  <Link className="w-4 h-4 mr-1" />
                  Edit URL
                </Button>
                {onDelete && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={onDelete}
                    className="bg-white text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
            </div>

            {/* Storage indicator */}
            {isStorageImage && (
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                  <FileImage className="w-3 h-3 mr-1" />
                  Storage
                </span>
              </div>
            )}
          </div>

          {/* Image metadata */}
          <div className="mt-3 space-y-2">
            {onAltChange && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => onAltChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Describe this image for accessibility"
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {onPrimaryChange && (
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={isPrimary}
                    onChange={() => onPrimaryChange(true)}
                    className="text-blue-600"
                  />
                  <span className="text-sm text-gray-700">Primary Image</span>
                </div>
              )}

              {onSortOrderChange && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={sortOrder}
                    onChange={(e) => onSortOrderChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Area */}
      {!value && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragOver
              ? 'border-blue-400 bg-blue-50'
              : 'border-gray-300 hover:border-gray-400'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !disabled && fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={disabled}
          />

          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
            
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? 'Drop image here' : 'Upload an image'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Drag and drop or click to browse
              </p>
              <p className="text-xs text-gray-400 mt-2">
                Supports JPEG, PNG, WebP, GIF up to 10MB
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex justify-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUrlInput(true)
                  }}
                  disabled={disabled}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Use URL Instead
                </Button>
              </div>

              {allowStorageSelection && (
                <div className="flex justify-center space-x-4 text-sm">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="supabase"
                      checked={storageType === 'supabase'}
                      onChange={() => setStorageType('supabase')}
                      className="text-blue-600"
                    />
                    <span>Supabase Storage</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="local"
                      checked={storageType === 'local'}
                      onChange={() => setStorageType('local')}
                      className="text-blue-600"
                    />
                    <span>Local Drive</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Enter Image URL
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg or Google Drive sharing URL"
                />
                
                {/* Google Drive URL Detection */}
                {urlInput && storageService.isGoogleDriveUrl(urlInput) && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full mt-0.5 flex-shrink-0"></div>
                      <div className="text-sm">
                        <p className="text-blue-800 font-medium">Google Drive URL Detected</p>
                        <p className="text-blue-600 mt-1">
                          This will be automatically converted to a direct image URL
                        </p>
                        <p className="text-blue-600 text-xs mt-1">
                          Converted: {storageService.convertGoogleDriveUrl(urlInput)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* URL Help Text */}
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm text-gray-600 font-medium mb-2">Supported URL Types:</p>
                <ul className="text-xs text-gray-500 space-y-1">
                  <li>• Direct image URLs (jpg, png, webp, gif)</li>
                  <li>• Google Drive sharing URLs (auto-converted)</li>
                  <li>• Dropbox sharing URLs</li>
                  <li>• Any publicly accessible image URL</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUrlCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleUrlSubmit}
                  disabled={!urlInput.trim()}
                >
                  Use URL
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Progress/Error */}
      {isUploading && (
        <div className="flex items-center space-x-2 text-blue-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Uploading...</span>
        </div>
      )}

      {uploadError && (
        <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{uploadError}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setUploadError(null)}
            className="ml-auto text-red-600 hover:bg-red-100"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}


