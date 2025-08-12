import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getOptimizedImageUrl, FALLBACK_IMAGES } from "@/lib/image-utils"
import { SmartImage } from "@/components/ui/smart-image"

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isFeatured: boolean
}

interface CollectionCardProps {
  collection: Collection
  priority?: boolean
}

// Large Hero Card (500px height)
export function HeroCard({ collection, priority = false }: CollectionCardProps) {
  const imageUrl = collection.imageUrl || FALLBACK_IMAGES.hero
  
  return (
    <div className="group relative h-80 sm:h-96 lg:h-[500px] overflow-hidden border border-neutral-200 bg-white shimmer-effect rounded-none hover:shadow-xl transition-all duration-500">
      <SmartImage
        src={imageUrl}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        fallbackSrc={FALLBACK_IMAGES.hero}
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
      <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white max-w-[80%]">
        <h3 className="text-2xl sm:text-3xl lg:text-4xl font-light mb-3 tracking-wide drop-shadow-lg leading-tight">
          {collection.name.toUpperCase()}
        </h3>
        <p className="text-sm sm:text-base mb-4 sm:mb-6 opacity-90 drop-shadow-md line-clamp-2 leading-relaxed">
          {collection.description || 'Discover our premium collection'}
        </p>
        <Button 
          variant="outline" 
          className="bg-white/15 backdrop-blur-sm border-white border-2 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-xl text-xs sm:text-sm px-6 py-3"
          asChild
        >
          <Link href={`/collections/${collection.slug}`}>
            DISCOVER COLLECTION
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Medium Card (350px height) 
export function MediumCard({ collection }: CollectionCardProps) {
  const imageUrl = collection.imageUrl || FALLBACK_IMAGES.medium
  
  return (
    <div className="group relative h-64 sm:h-80 lg:h-[350px] overflow-hidden border border-neutral-200 bg-white shimmer-effect rounded-none hover:shadow-lg transition-all duration-500">
      <SmartImage
        src={imageUrl}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        fallbackSrc={FALLBACK_IMAGES.medium}
      />
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
      <div className="absolute bottom-6 left-6 text-white max-w-[70%]">
        <h3 className="text-xl sm:text-2xl font-light mb-2 tracking-wide drop-shadow-lg">
          {collection.name.toUpperCase()}
        </h3>
        <p className="text-sm mb-4 opacity-90 drop-shadow-md line-clamp-1">
          {collection.description || 'Premium collection'}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/15 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black font-medium text-xs transition-all duration-300"
          asChild
        >
          <Link href={`/collections/${collection.slug}`}>
            EXPLORE
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Standard Grid Card (280px height)
export function GridCard({ collection }: CollectionCardProps) {
  const imageUrl = collection.imageUrl || FALLBACK_IMAGES.grid
  
  return (
    <div className="group relative h-56 sm:h-64 lg:h-[280px] overflow-hidden border border-neutral-200 bg-white hover:shadow-lg transition-all duration-500 shimmer-effect rounded-none">
      <SmartImage
        src={imageUrl}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        fallbackSrc={FALLBACK_IMAGES.grid}
      />
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
      <div className="absolute bottom-4 sm:bottom-5 left-4 sm:left-5 text-white max-w-[80%]">
        <h3 className="text-base sm:text-lg font-light mb-1 tracking-wide drop-shadow-lg line-clamp-1">
          {collection.name.toUpperCase()}
        </h3>
        <p className="text-xs opacity-90 drop-shadow-md mb-3 line-clamp-1">
          {collection.description || 'Premium collection'}
        </p>
        <Button 
          variant="outline" 
          size="sm"
          className="bg-white/15 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black font-medium text-xs transition-all duration-300 px-3 py-1.5"
          asChild
        >
          <Link href={`/collections/${collection.slug}`}>
            EXPLORE
          </Link>
        </Button>
      </div>
    </div>
  )
}

// Spotlight Card (Special featured card for odd layouts)
export function SpotlightCard({ collection }: CollectionCardProps) {
  const imageUrl = collection.imageUrl || FALLBACK_IMAGES.spotlight
  
  return (
    <div className="group relative h-72 sm:h-80 lg:h-[400px] overflow-hidden border border-neutral-200 bg-white shimmer-effect rounded-none hover:shadow-xl transition-all duration-500">
      <SmartImage
        src={imageUrl}
        alt={collection.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        fallbackSrc={FALLBACK_IMAGES.spotlight}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center text-center text-white p-8">
        <div className="max-w-md">
          <div className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-4 uppercase tracking-wider">
            Featured Collection
          </div>
          <h3 className="text-2xl sm:text-3xl font-light mb-4 tracking-wide drop-shadow-lg">
            {collection.name.toUpperCase()}
          </h3>
          <p className="text-sm mb-6 opacity-90 drop-shadow-md leading-relaxed">
            {collection.description || 'Discover our premium featured collection'}
          </p>
          <Button 
            variant="outline" 
            className="bg-white/15 backdrop-blur-sm border-white border-2 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-xl"
            asChild
          >
            <Link href={`/collections/${collection.slug}`}>
              DISCOVER COLLECTION
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}