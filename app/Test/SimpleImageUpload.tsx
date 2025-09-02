"use client"

import React, { useState, useCallback } from 'react'
import { Upload, X, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SimpleImageUploadProps {
  value: string
  onChange: (url: string) => void
  onDelete?: () => void
  alt?: string
  className?: string
}

export function SimpleImageUpload({
  value,
  onChange,
  onDelete,
  alt = '',
  className = ''
}: SimpleImageUploadProps) {
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState(value)

  const handleUrlSubmit = useCallback(() => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setShowUrlInput(false)
    }
  }, [urlInput, onChange])

  const handleUrlCancel = useCallback(() => {
    setUrlInput(value)
    setShowUrlInput(false)
  }, [value])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* URL Input Modal */}
      {showUrlInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Enter Image URL</h3>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                onClick={handleUrlCancel}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUrlSubmit}
              >
                Set URL
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview */}
      {value ? (
        <div className="relative group">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={value}
              alt={alt || 'Product image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('❌ SimpleImageUpload failed to load:', value);
                e.currentTarget.style.display = 'none';
              }}
              onLoad={() => {
                console.log('✅ SimpleImageUpload loaded successfully:', value);
              }}
            />
            
            {/* Success indicator */}
            <div className="absolute top-2 left-2">
              <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                ✅ Working
              </span>
            </div>

            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
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
          </div>
        </div>
      ) : (
        /* Upload Area */
        <div className="relative">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-4">
              Click to add an image URL
            </p>
            <Button
              variant="outline"
              onClick={() => setShowUrlInput(true)}
            >
              Add Image URL
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
