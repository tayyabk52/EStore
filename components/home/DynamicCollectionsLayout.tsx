import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Crown } from "lucide-react"
import { HeroCard, MediumCard, GridCard, SpotlightCard } from "./CollectionCards"

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isFeatured: boolean
}

interface DynamicCollectionsLayoutProps {
  collections: Collection[]
}

export function DynamicCollectionsLayout({ collections }: DynamicCollectionsLayoutProps) {
  const count = collections.length

  if (count === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <Crown className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-2xl font-light mb-4 text-gray-900">Collections Coming Soon</h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Our curated collections are being carefully crafted to bring you the finest selection of premium products.
          </p>
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" asChild>
            <Link href="/products">Browse All Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  // Layout for 1 collection
  if (count === 1) {
    return (
      <div className="space-y-8">
        <div className="max-w-4xl mx-auto">
          <HeroCard collection={collections[0]} priority />
        </div>
      </div>
    )
  }

  // Layout for 2 collections  
  if (count === 2) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
      </div>
    )
  }

  // Layout for 3 collections (2 heroes + 1 full-width medium)
  if (count === 3) {
    return (
      <div className="space-y-8 md:space-y-12">
        {/* Two Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
        
        {/* Full-width Medium Card */}
        <div className="max-w-5xl mx-auto">
          <MediumCard collection={collections[2]} />
        </div>
      </div>
    )
  }

  // Layout for 4 collections (2 heroes + 2 grid)
  if (count === 4) {
    return (
      <div className="space-y-8 md:space-y-12">
        {/* Two Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
        
        {/* Two Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
          <GridCard collection={collections[2]} />
          <GridCard collection={collections[3]} />
        </div>
      </div>
    )
  }

  // Layout for 5 collections (2 heroes + 3 grid)
  if (count === 5) {
    return (
      <div className="space-y-8 md:space-y-12">
        {/* Two Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
        
        {/* Three Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <GridCard collection={collections[2]} />
          <GridCard collection={collections[3]} />
          <GridCard collection={collections[4]} />
        </div>
      </div>
    )
  }

  // Layout for 6 collections (2 heroes + 4 grid)
  if (count === 6) {
    return (
      <div className="space-y-8 md:space-y-12">
        {/* Two Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
        
        {/* Four Grid Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <GridCard collection={collections[2]} />
          <GridCard collection={collections[3]} />
          <GridCard collection={collections[4]} />
          <GridCard collection={collections[5]} />
        </div>
      </div>
    )
  }

  // Layout for 7 collections (2 heroes + 4 grid + 1 spotlight)
  if (count === 7) {
    return (
      <div className="space-y-8 md:space-y-12">
        {/* Two Hero Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <HeroCard collection={collections[0]} priority />
          <HeroCard collection={collections[1]} />
        </div>
        
        {/* Four Grid Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <GridCard collection={collections[2]} />
          <GridCard collection={collections[3]} />
          <GridCard collection={collections[4]} />
          <GridCard collection={collections[5]} />
        </div>

        {/* Spotlight Card */}
        <div className="max-w-4xl mx-auto">
          <SpotlightCard collection={collections[6]} />
        </div>
      </div>
    )
  }

  // Layout for 8+ collections (2 heroes + 4 grid + 1 spotlight + view all)
  return (
    <div className="space-y-8 md:space-y-12">
      {/* Two Hero Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <HeroCard collection={collections[0]} priority />
        <HeroCard collection={collections[1]} />
      </div>
      
      {/* Four Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <GridCard collection={collections[2]} />
        <GridCard collection={collections[3]} />
        <GridCard collection={collections[4]} />
        <GridCard collection={collections[5]} />
      </div>

      {/* Spotlight Card if we have a 7th collection */}
      {count >= 7 && (
        <div className="max-w-4xl mx-auto">
          <SpotlightCard collection={collections[6]} />
        </div>
      )}

      {/* View All Collections Link for 8+ */}
      <div className="text-center">
        <div className="inline-flex items-center gap-4 mb-4">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
          <span className="text-sm text-neutral-500 uppercase tracking-wider">
            {count > 7 ? `${count - 7} More Collection${count - 7 > 1 ? 's' : ''}` : ''}
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
        </div>
        <Button 
          variant="outline" 
          className="border-black border-2 text-black hover:bg-black hover:text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300" 
          asChild
        >
          <Link href="/collections" className="flex items-center">
            View All Collections <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  )
}