import { motion } from "framer-motion"

export function CollectionsLoadingSkeleton() {
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Hero Collections Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {[1, 2].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="relative h-72 sm:h-96 lg:h-[500px] overflow-hidden border border-neutral-200 bg-white"
          >
            {/* Image skeleton */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 space-y-4">
              <div className="space-y-2">
                <div className="h-8 w-48 bg-white/20 backdrop-blur-sm rounded animate-pulse" />
                <div className="h-4 w-64 bg-white/15 backdrop-blur-sm rounded animate-pulse" />
              </div>
              <div className="h-10 w-36 bg-white/25 backdrop-blur-sm rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Grid Collections Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + (index * 0.1), duration: 0.5 }}
            className="relative h-64 sm:h-80 overflow-hidden border border-neutral-200 bg-white"
          >
            {/* Image skeleton */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
            
            {/* Content skeleton */}
            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 space-y-2">
              <div className="h-6 w-24 bg-white/20 backdrop-blur-sm rounded animate-pulse" />
              <div className="h-3 w-32 bg-white/15 backdrop-blur-sm rounded animate-pulse" />
              <div className="h-8 w-20 bg-white/25 backdrop-blur-sm rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}