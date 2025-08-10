import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, Star, Crown, Sparkles } from "lucide-react"

export default function EvelonCollectionsPage() {
  const collections = [
    {
      title: "Heritage Ajrak",
      subtitle: "Ancient Patterns, Modern Silhouettes",
      description: "Celebrating 4,000 years of Sindhi craftsmanship through contemporary designs",
      image: "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      gradient: "from-indigo-900/80 to-purple-900/60",
      accent: "border-indigo-400 text-indigo-200",
      featured: true
    },
    {
      title: "Phulkari Dreams",
      subtitle: "Embroidered Stories of Punjab",
      description: "Hand-embroidered silk threads dance across premium fabrics",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      gradient: "from-amber-900/80 to-orange-900/60",
      accent: "border-amber-400 text-amber-200",
      featured: true
    },
    {
      title: "Urban Heritage",
      subtitle: "Contemporary Pakistani Style",
      description: "Modern interpretations of traditional motifs for city living",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=1088&q=80",
      gradient: "from-emerald-900/80 to-teal-900/60",
      accent: "border-emerald-400 text-emerald-200",
      featured: false
    },
    {
      title: "Artisan Premium",
      subtitle: "Master Craftsman Collection",
      description: "Limited edition pieces from renowned Pakistani artisans",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      gradient: "from-rose-900/80 to-pink-900/60",
      accent: "border-rose-400 text-rose-200",
      featured: false
    },
    {
      title: "Sustainable Heritage",
      subtitle: "Eco-Conscious Luxury",
      description: "Premium organic fabrics with traditional Pakistani techniques",
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      gradient: "from-green-900/80 to-lime-900/60",
      accent: "border-green-400 text-green-200",
      featured: false
    },
    {
      title: "Bridal Heritage",
      subtitle: "Wedding Couture Collection",
      description: "Opulent designs for life's most precious moments",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      gradient: "from-purple-900/80 to-violet-900/60",
      accent: "border-purple-400 text-purple-200",
      featured: false
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-purple-900/40 to-black/60" />
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center mb-6">
            <Crown className="w-12 h-12 text-amber-400" />
          </div>
          
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            HERITAGE COLLECTIONS
          </h1>
          <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
            Where Pakistani craftsmanship meets contemporary luxury
          </p>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-light tracking-wider mb-6 text-gray-900">
              Featured Collections
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most celebrated heritage collections, each telling a unique story of Pakistani artisanship
            </p>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {collections.filter(c => c.featured).map((collection, index) => (
              <div key={index} className="group relative h-[500px] overflow-hidden rounded-lg cursor-pointer">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${collection.image}')` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} group-hover:opacity-90 transition-opacity duration-300`} />
                
                <div className="absolute bottom-8 left-8 text-white max-w-md">
                  <div className="mb-4">
                    <Sparkles className="w-6 h-6 text-amber-400" />
                  </div>
                  <h3 className="text-3xl font-light mb-2 tracking-wide">{collection.title}</h3>
                  <p className="text-lg font-light mb-3 opacity-90">{collection.subtitle}</p>
                  <p className="text-sm mb-6 opacity-80 leading-relaxed">{collection.description}</p>
                  <Button 
                    variant="outline" 
                    className={`${collection.accent} hover:bg-white hover:text-gray-900 transition-all duration-300`}
                  >
                    EXPLORE COLLECTION
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* All Collections Grid */}
          <div className="text-center mb-12">
            <h3 className="text-2xl font-light tracking-wider mb-4 text-gray-900">
              All Collections
            </h3>
            <div className="w-16 h-px bg-amber-500 mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <Card key={index} className="group cursor-pointer transition-all duration-300 hover:shadow-xl bg-white border-0 rounded-lg overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <div 
                      className="h-64 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${collection.image}')` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient}`} />
                    <div className="absolute inset-0 flex items-end p-6">
                      <div className="text-white">
                        <h4 className="text-lg font-semibold mb-1">{collection.title}</h4>
                        <p className="text-sm opacity-90">{collection.subtitle}</p>
                      </div>
                    </div>
                    {collection.featured && (
                      <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 text-xs font-semibold rounded-full">
                        FEATURED
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {collection.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <Link 
                        href={`/collections/${collection.title.toLowerCase().replace(/\s+/g, '-')}`}
                        className="text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors flex items-center"
                      >
                        VIEW COLLECTION
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Link>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-3 w-3 text-amber-400 fill-current"
                          />
                        ))}
                        <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wide">
              Be First to Experience New Collections
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Join our heritage circle to receive early access to new collections, 
              artisan stories, and exclusive cultural events.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <Button className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium border-0">
                JOIN CIRCLE
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}