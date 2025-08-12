"use client"

import { useState, useEffect } from "react"
import { getGoogleDriveUrlVariants, getImageSourceType } from "@/lib/image-utils"

interface SmartImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  fallbackSrc?: string
  onError?: () => void
  onLoad?: () => void
}

export function SmartImage({ 
  src, 
  alt, 
  className, 
  style, 
  fallbackSrc,
  onError,
  onLoad
}: SmartImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src)
  const [urlIndex, setUrlIndex] = useState(0)
  const [hasError, setHasError] = useState(false)

  const urlVariants = getGoogleDriveUrlVariants(src)
  const isGoogleDrive = getImageSourceType(src) === 'google-drive'

  useEffect(() => {
    setCurrentSrc(src)
    setUrlIndex(0)
    setHasError(false)
  }, [src])

  const handleError = () => {
    if (isGoogleDrive && urlIndex < urlVariants.length - 1) {
      // Try next Google Drive URL variant
      const nextIndex = urlIndex + 1
      setUrlIndex(nextIndex)
      setCurrentSrc(urlVariants[nextIndex])
    } else if (fallbackSrc && !hasError) {
      // Try fallback image
      setHasError(true)
      setCurrentSrc(fallbackSrc)
    } else {
      // All attempts failed
      onError?.()
    }
  }

  const handleLoad = () => {
    onLoad?.()
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      style={style}
      onError={handleError}
      onLoad={handleLoad}
    />
  )
}