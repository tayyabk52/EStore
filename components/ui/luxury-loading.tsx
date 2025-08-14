"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Crown } from "lucide-react"

interface LuxuryLoadingProps {
  isVisible: boolean
  variant?: 'full' | 'overlay' | 'inline'
  size?: 'sm' | 'md' | 'lg'
  message?: string
}

export function LuxuryLoading({ 
  isVisible, 
  variant = 'overlay', 
  size = 'md', 
  message = "La Elegance" 
}: LuxuryLoadingProps) {
  
  const sizeClasses = {
    sm: {
      container: "w-16 h-16",
      crown: "w-6 h-6",
      text: "text-xs",
      dots: "w-1 h-1"
    },
    md: {
      container: "w-20 h-20 sm:w-24 sm:h-24",
      crown: "w-7 h-7 sm:w-8 sm:h-8",
      text: "text-sm sm:text-base",
      dots: "w-1.5 h-1.5"
    },
    lg: {
      container: "w-28 h-28 sm:w-32 sm:h-32",
      crown: "w-10 h-10 sm:w-12 sm:h-12",
      text: "text-base sm:text-lg",
      dots: "w-2 h-2"
    }
  }

  const currentSize = sizeClasses[size]

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Elegant Crown Animation */}
      <div className="relative">
        <motion.div
          className={`${currentSize.container} relative flex items-center justify-center`}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          {/* Rotating Ring */}
          <motion.div
            className="absolute inset-0 border-2 border-transparent border-t-black/20 border-r-black/10 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Inner Glow Ring */}
          <motion.div
            className="absolute inset-2 border border-transparent border-t-black/30 rounded-full"
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Crown Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.4, ease: "backOut" }}
            className="flex items-center justify-center"
          >
            <Crown className={`${currentSize.crown} text-black/70`} />
          </motion.div>
          
          {/* Subtle Pulse Effect */}
          <motion.div
            className="absolute inset-0 border border-black/5 rounded-full"
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
      
      {/* Brand Text */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className="text-center"
      >
        <p className={`${currentSize.text} font-light text-black/80 tracking-[0.2em] uppercase mb-2`}>
          {message}
        </p>
        
        {/* Animated Dots */}
        <div className="flex items-center justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className={`${currentSize.dots} bg-black/40 rounded-full`}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.8, 0.4]
              }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity, 
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  )

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Full Screen Loading */}
          {variant === 'full' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[9999] bg-white/95 backdrop-blur-sm flex items-center justify-center"
            >
              <LoadingContent />
            </motion.div>
          )}
          
          {/* Overlay Loading */}
          {variant === 'overlay' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[9999] bg-black/10 backdrop-blur-[2px] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl border border-white/20"
              >
                <LoadingContent />
              </motion.div>
            </motion.div>
          )}
          
          {/* Inline Loading */}
          {variant === 'inline' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-center py-8"
            >
              <LoadingContent />
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}

// Compact loading for buttons
export function ButtonLoading({ size = 'sm' }: { size?: 'xs' | 'sm' | 'md' }) {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4", 
    md: "w-5 h-5"
  }
  
  return (
    <motion.div
      className={`${sizeClasses[size]} relative flex items-center justify-center`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="absolute inset-0 border border-current border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute w-1 h-1 bg-current rounded-full"
        animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  )
}

// Page transition loading
export function PageLoading() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-gradient-to-r from-transparent via-black/20 to-transparent"
    >
      <motion.div
        className="h-full bg-gradient-to-r from-black/60 to-black/80 rounded-full"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
    </motion.div>
  )
}