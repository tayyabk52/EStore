import Link from "next/link"
import { Button } from "@/components/ui/button"
import { collectionsService } from "@/lib/products-frontend"
import { Crown } from "lucide-react"

// Force dynamic rendering to avoid stale cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function CollectionsPage() {
  const collections = await collectionsService.getAllCollections()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-neutral-50 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            <Crown className="w-6 h-6 mx-4 text-neutral-400" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
          </div>
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-6 text-black">
            ALL COLLECTIONS
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover our carefully curated collections, each telling a unique story of style and sophistication
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          {collections && collections.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
              {collections.map((collection: any, index) => (
                <div 
                  key={collection.id} 
                  className="group relative overflow-hidden border border-neutral-200 bg-white hover:shadow-xl transition-all duration-500"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <div 
                      className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
                      style={{ 
                        backgroundImage: `url('${collection.imageUrl || 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}')` 
                      }}
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-light tracking-wide text-black group-hover:text-gray-700 transition-colors">
                        {collection.name.toUpperCase()}
                      </h3>
                      {collection.description && (
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                          {collection.description}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button 
                        variant="outline" 
                        className="border-black text-black hover:bg-black hover:text-white transition-all duration-300"
                        asChild
                      >
                        <Link href={`/collections/${collection.slug}`}>
                          Explore Collection
                        </Link>
                      </Button>
                      
                      {collection.isFeatured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <Crown className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-light mb-4 text-gray-900">No Collections Yet</h3>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Our collections are being curated. Check back soon for amazing collections!
                </p>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100" asChild>
                  <Link href="/products">
                    Browse All Products
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}