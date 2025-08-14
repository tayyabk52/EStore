"use client"

import { createContext, useContext, useState, useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { LuxuryLoading, PageLoading } from '@/components/ui/luxury-loading'

interface LoadingContextType {
  isLoading: boolean
  isNavigating: boolean
  showLoading: (message?: string) => void
  hideLoading: () => void
  showNavigationLoading: () => void
  hideNavigationLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

function LoadingProviderInner({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false)
  const [isNavigating, setIsNavigating] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("La Elegance")
  
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Handle navigation loading - auto-hide both loading states when navigation completes
  useEffect(() => {
    setIsNavigating(true)
    
    const timer = setTimeout(() => {
      setIsNavigating(false)
      setIsLoading(false) // Also hide manual loading when navigation completes
    }, 300) // Brief loading for smooth UX

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  const showLoading = (message = "La Elegance") => {
    setLoadingMessage(message)
    setIsLoading(true)
  }

  const hideLoading = () => {
    setIsLoading(false)
  }

  const showNavigationLoading = () => {
    setIsNavigating(true)
  }

  const hideNavigationLoading = () => {
    setIsNavigating(false)
  }

  return (
    <LoadingContext.Provider value={{
      isLoading,
      isNavigating,
      showLoading,
      hideLoading,
      showNavigationLoading,
      hideNavigationLoading
    }}>
      {children}
      
      {/* Global Loading Overlay */}
      <LuxuryLoading 
        isVisible={isLoading} 
        variant="overlay" 
        message={loadingMessage}
      />
      
      {/* Navigation Loading Bar */}
      {isNavigating && <PageLoading />}
    </LoadingContext.Provider>
  )
}

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <LuxuryLoading isVisible={true} variant="overlay" message="La Elegance" />
      </div>
    }>
      <LoadingProviderInner>{children}</LoadingProviderInner>
    </Suspense>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider')
  }
  return context
}

// Hook for automatic loading on async operations
export function useAsyncLoading() {
  const { showLoading, hideLoading } = useLoading()
  
  const executeWithLoading = async <T,>(
    asyncFn: () => Promise<T>,
    message?: string
  ): Promise<T> => {
    try {
      showLoading(message)
      const result = await asyncFn()
      return result
    } finally {
      // Add small delay for better UX
      setTimeout(hideLoading, 200)
    }
  }
  
  return { executeWithLoading }
}

// Hook for navigation loading
export function useNavigationLoading() {
  const { showNavigationLoading, hideNavigationLoading } = useLoading()
  
  const navigateWithLoading = (callback: () => void, delay = 100) => {
    showNavigationLoading()
    setTimeout(() => {
      callback()
      setTimeout(hideNavigationLoading, 200)
    }, delay)
  }
  
  return { navigateWithLoading }
}