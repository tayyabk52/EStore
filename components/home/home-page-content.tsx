"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SmartImage } from "@/components/ui/smart-image"
import { FALLBACK_IMAGES } from "@/lib/image-utils"
import { ArrowRight, Truck, Shield, Crown, Calendar, Sparkles } from "lucide-react"
import { DynamicCollectionsLayout } from "./DynamicCollectionsLayout"
import { formatPrice } from "@/lib/currency"
import { LoadingLink } from "@/components/ui/loading-link"
import { LoadingButton } from "@/components/ui/loading-button"

// Custom CSS for luxury animations
const luxuryStyles = `
  @keyframes fade-in-up {
    0% { opacity: 0; transform: translateY(40px); filter: blur(8px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }
  
  @keyframes float-gentle {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-6px) scale(1.02); }
  }
  
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes backdrop-glow {
    0%, 100% { box-shadow: inset 0 0 20px rgba(255,255,255,0.05); }
    50% { box-shadow: inset 0 0 40px rgba(255,255,255,0.08); }
  }
  
  .animate-fade-in-up { 
    animation: fade-in-up 1.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
  }
  
  .animation-delay-200 { animation-delay: 0.3s; opacity: 0; }
  .animation-delay-400 { animation-delay: 0.6s; opacity: 0; }
  .animation-delay-600 { animation-delay: 0.9s; opacity: 0; }
  .animation-delay-800 { animation-delay: 1.2s; opacity: 0; }
  
  /* Product card staggered animations */
  .animation-delay-0 { animation-delay: 0.2s; opacity: 0; }
  
  
  .animate-float-gentle { animation: float-gentle 8s ease-in-out infinite; }
  .animate-backdrop-glow { animation: backdrop-glow 6s ease-in-out infinite; }
  
  .shimmer-effect::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
    transform: translateX(-100%);
    animation: shimmer 3s ease-in-out infinite;
    animation-delay: 2s;
  }
`

interface HomePageContentProps {
  featuredProducts: any[]
  newArrivals: any[]
  onSaleProducts: any[]
  featuredCategories: any[]
  featuredCollections: any[]
}

export default function HomePageContent({
  featuredProducts,
  newArrivals,
  onSaleProducts,
  featuredCategories,
  featuredCollections
}: HomePageContentProps) {
  return (
    <>
      <style jsx>{luxuryStyles}</style>
      <div className="min-h-screen bg-white">
      {/* Luxury Hero Section */}
      <section className="relative min-h-[75vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Background Video - Luxury Jewelry Store */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        >
          <source src="https://player.vimeo.com/external/434045526.hd.mp4?s=c27eecc69a27dcc1dcb9259d43c8b071b5f87258&profile_id=169" type="video/mp4" />
          <source src="https://assets.mixkit.co/videos/preview/mixkit-luxury-jewelry-collection-4067-large.mp4" type="video/mp4" />
        </video>
        
        {/* Sophisticated Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Luxury Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light tracking-[0.02em] leading-tight mb-6 sm:mb-8">
              DEFINE YOUR
              <span className="block font-thin bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent animate-backdrop-glow">
                ELEGANCE
              </span>
            </h1>
          </div>
          
          <div className="animate-fade-in-up animation-delay-200">
            <p className="text-lg sm:text-xl md:text-2xl font-light tracking-wide mb-8 sm:mb-12 opacity-95 leading-relaxed">
              Discover timeless pieces that transcend trends and elevate every moment
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-400">
            <LoadingLink 
              href="/products"
              loadingMessage="Loading Collection..."
            >
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 font-semibold tracking-wider px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              >
                EXPLORE COLLECTION <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </LoadingLink>
            
            <LoadingLink 
              href="/about"
              loadingMessage="Loading Heritage..."
            >
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white border-2 text-white bg-transparent hover:bg-white hover:text-black font-semibold tracking-wider px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base shadow-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                OUR HERITAGE
              </Button>
            </LoadingLink>
          </div>
        </div>
        
        {/* Elegant Scroll Indicator */}
        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Luxury Services */}
      <section className="py-12 sm:py-16 md:py-20 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                icon: Truck,
                title: "Complimentary Delivery",
                description: "Free worldwide shipping on all orders above $200",
                delay: "animation-delay-200"
              },
              {
                icon: Shield,
                title: "Lifetime Warranty", 
                description: "Comprehensive protection for all premium pieces",
                delay: "animation-delay-400"
              },
              {
                icon: Crown,
                title: "VIP Concierge",
                description: "Personal styling consultation and exclusive access",
                delay: "animation-delay-600"
              }
            ].map((service, index) => (
              <div key={index} className={`text-center group animate-fade-in-up ${service.delay}`}>
                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full shadow-lg mb-6 group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-2">
                  <service.icon className="w-8 h-8 sm:w-10 sm:h-10 text-black" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 text-black tracking-wide group-hover:text-neutral-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed text-sm sm:text-base max-w-xs mx-auto">
                  {service.description}
                </p>
                <div className="w-6 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limited Edition Banner */}
      <section className="py-8 bg-black text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-4">
            <Calendar className="w-5 h-5" />
            <span className="text-sm tracking-wider">LIMITED TIME: WINTER COLLECTION NOW AVAILABLE</span>
            <Calendar className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Premium Categories */}
      <section className="py-16 sm:py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-xs sm:text-sm text-gray-500 font-semibold tracking-widest uppercase mb-2 sm:mb-3">Collections</h3>
            <h2 className="text-3xl md:text-5xl font-light tracking-wider mb-4 sm:mb-6 text-black">Defining Modern Luxury</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Carefully curated pieces that embody sophistication and timeless elegance
            </p>
          </div>

          {/* Premium Dynamic Collections System */}
          <DynamicCollectionsLayout 
            collections={featuredCollections || []} 
            isLoading={!featuredCollections}
          />

        </div>
      </section>

      {/* Premium Featured Products */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Sophisticated Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="inline-flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent"></div>
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-500" />
              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-400 to-transparent"></div>
            </div>
            <span className="inline-block text-xs sm:text-sm text-neutral-500 font-semibold tracking-[0.25em] uppercase mb-3 sm:mb-4">SIGNATURE COLLECTION</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.01em] mb-4 sm:mb-6 text-black leading-tight">
              Essential Pieces
            </h2>
            <p className="text-neutral-600 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto mb-8 sm:mb-10">
              Meticulously curated essentials that define contemporary elegance and timeless sophistication
            </p>
            <LoadingLink href="/products" loadingMessage="Loading Collection...">
              <Button 
                variant="outline" 
                size="lg"
                className="border-black border-2 text-black hover:bg-black hover:text-white font-semibold tracking-wide px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base shadow-lg hover:shadow-xl transition-all duration-500 transform hover:scale-105 flex items-center"
              >
                EXPLORE COLLECTION <ArrowRight className="ml-3 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </LoadingLink>
          </div>

          {/* Premium Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10">
            {featuredProducts && featuredProducts.length > 0 ? featuredProducts.slice(0, 4).map((product: any, index) => {
              const primaryImage = product.images?.find((img: any) => img.isPrimary)?.url || product.images?.[0]?.url
              const defaultVariant = product.variants?.find((v: any) => v.isDefault) || product.variants?.[0]
              const price = Number(defaultVariant?.price ?? 0)
              const compareAt = defaultVariant?.compareAtPrice ? Number(defaultVariant.compareAtPrice) : null
              
              // Determine badge based on product properties
              let badge = "FEATURED"
              if (product.isNewArrival) badge = "NEW"
              if (product.isOnSale) badge = "SALE"  
              if (product.isBestseller) badge = "BESTSELLER"
              
              return (
              <div key={index} className={`group cursor-pointer bg-white transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 rounded-none overflow-hidden border border-transparent hover:border-neutral-100 animate-fade-in-up animation-delay-${index * 200}`}>
                {/* Luxury Image Container */}
                <div className="relative overflow-hidden mb-4 sm:mb-6 bg-gradient-to-br from-gray-50 to-gray-100">
                  {primaryImage ? (
                    <SmartImage 
                      src={primaryImage}
                      alt={product.title}
                      className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 aspect-[4/5] lg:aspect-[3/4]"
                      fallbackSrc={FALLBACK_IMAGES.grid}
                    />
                  ) : (
                    <div className="aspect-[4/5] lg:aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-gray-300">
                        <svg className="w-16 h-16 lg:w-20 lg:h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Subtle Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                  
                  {/* Elegant Badge */}
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="inline-block bg-white/95 backdrop-blur-md text-black px-3 py-2 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-bold tracking-[0.15em] uppercase shadow-lg border border-white/20">
                      {badge}
                    </span>
                  </div>
                  
                  {/* Refined Heart Icon */}
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 z-20">
                    <button className="w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center shadow-xl border border-white/30 hover:scale-110 transition-all duration-300">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Premium Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-all duration-500 ease-out z-20">
                    <button className="w-full bg-white text-black py-3 sm:py-4 text-xs sm:text-sm font-bold tracking-[0.1em] uppercase hover:bg-neutral-100 transition-all duration-300 shadow-lg backdrop-blur-sm">
                      ADD TO CART
                    </button>
                  </div>

                  {/* Click-through overlay to product page */}
                  <LoadingLink 
                    href={`/products/${product.slug}`} 
                    aria-label={product.title} 
                    className="absolute inset-0 z-10"
                    loadingMessage="Loading Product..."
                  >
                    <span className="sr-only">{product.title}</span>
                  </LoadingLink>
                </div>
                
                {/* Sophisticated Product Information */}
                <div className="px-2 sm:px-4 pb-6 sm:pb-8 space-y-3 sm:space-y-4">
                  {/* Brand */}
                  {product.brand && (
                    <div className="text-[10px] sm:text-xs text-neutral-500 uppercase tracking-[0.2em] font-medium">
                      {product.brand}
                    </div>
                  )}
                  
                  {/* Product Title */}
                  <LoadingLink href={`/products/${product.slug}`} loadingMessage={`Loading ${product.title}...`} className="block">
                    <h3 className="text-sm sm:text-base lg:text-lg font-medium text-black group-hover:text-neutral-700 transition-colors leading-tight tracking-wide line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                      {product.title}
                    </h3>
                  </LoadingLink>
                  
                  {/* Category */}
                  {product.category && (
                    <div className="text-[10px] sm:text-xs text-neutral-600 uppercase tracking-wider font-medium">
                      {product.category.displayName || product.category.name}
                    </div>
                  )}
                  
                  {/* Premium Price Display */}
                  <div className="flex items-end justify-between pt-2 sm:pt-3 border-t border-neutral-100">
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <span className="text-lg sm:text-xl lg:text-2xl font-light text-black tracking-wide">
                          {formatPrice(price, defaultVariant?.currency)}
                        </span>
                        {compareAt && compareAt > price && (
                          <span className="text-sm sm:text-base text-neutral-400 line-through font-light">
                            {formatPrice(compareAt, defaultVariant?.currency)}
                          </span>
                        )}
                      </div>
                      {compareAt && compareAt > price && (
                        <span className="text-[10px] sm:text-xs text-red-600 uppercase tracking-wider font-medium mt-1">
                          {Math.round(((compareAt - price) / compareAt) * 100)}% OFF
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] sm:text-xs text-neutral-400 uppercase tracking-[0.15em] font-medium">
                      PREMIUM
                    </div>
                  </div>
                </div>
              </div>
              )
            }) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                <div className="text-center py-16 sm:py-20 lg:py-24">
                  <div className="max-w-md mx-auto">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-6 sm:mb-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300" />
                    </div>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-light mb-4 sm:mb-6 text-gray-900 tracking-wide">
                      Collection Coming Soon
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base lg:text-lg leading-relaxed mb-8 sm:mb-10">
                      Our essential pieces are being carefully curated to bring you the finest selection of premium products.
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-8">
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                      <Crown className="w-5 h-5 text-neutral-400" />
                      <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                    </div>
                    <LoadingLink href="/products" loadingMessage="Loading Products...">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-400 font-semibold tracking-wide px-8 py-3 transition-all duration-300"
                      >
                        Browse All Products
                      </Button>
                    </LoadingLink>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-16 sm:py-20 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-light mb-4 sm:mb-6 tracking-wider">
                CRAFTED FOR
                <span className="block">PERFECTION</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                Every piece in our collection tells a story of meticulous craftsmanship, 
                premium materials, and timeless design. From the initial sketch to the final stitch, 
                we pursue nothing less than excellence.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-4" />
                  <span>Premium materials sourced globally</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-4" />
                  <span>Handcrafted by skilled artisans</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-4" />
                  <span>Sustainable production practices</span>
                </div>
              </div>
              <LoadingLink href="/about" loadingMessage="Loading Our Story...">
                <Button variant="outline" className="border-white border-2 text-white bg-transparent hover:bg-white hover:text-black font-semibold shadow-lg">
                  OUR STORY
                </Button>
              </LoadingLink>
            </div>
            
            <div className="relative h-72 sm:h-96 lg:h-[500px] overflow-hidden">
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80')`
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Separator */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
              <Crown className="w-5 h-5 text-neutral-400" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      </div>
    </>
  )
}