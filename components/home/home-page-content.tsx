"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Truck, Shield, Crown, Calendar, Sparkles } from "lucide-react"

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
}

export default function HomePageContent({
  featuredProducts,
  newArrivals,
  onSaleProducts,
  featuredCategories
}: HomePageContentProps) {
  return (
    <>
      <style jsx>{luxuryStyles}</style>
      <div className="min-h-screen bg-white">
      {/* Luxury Hero Section */}
      <section className="relative min-h-[75vh] md:min-h-screen flex items-center justify-center overflow-hidden">
        {/* Premium Background with Parallax Effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 hover:scale-110 transition-transform duration-[12000ms] ease-out animate-float-gentle"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80')`
          }}
        />
        
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
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 font-semibold tracking-wider px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/products">
                EXPLORE COLLECTION <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white border-2 text-white bg-transparent hover:bg-white hover:text-black font-semibold tracking-wider px-8 sm:px-12 py-3 sm:py-4 text-sm sm:text-base shadow-xl backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              asChild
            >
              <Link href="/about">
                OUR HERITAGE
              </Link>
            </Button>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* Women's Collection */}
            <div className="group relative h-72 sm:h-96 lg:h-[500px] overflow-hidden border border-neutral-200 bg-white">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1088&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-light mb-2 tracking-wide drop-shadow-lg">WOMEN</h3>
                <p className="text-sm mb-4 opacity-90 drop-shadow-md">Sophisticated elegance for the modern woman</p>
                <Button 
                  variant="outline" 
                  className="bg-white/15 backdrop-blur-sm border-white border-2 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-xl"
                  asChild
                >
                  <Link href="/women">
                    DISCOVER COLLECTION
                  </Link>
                </Button>
              </div>
            </div>

            {/* Men's Collection */}
            <div className="group relative h-72 sm:h-96 lg:h-[500px] overflow-hidden border border-neutral-200 bg-white">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.03]"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-black/25 group-hover:bg-black/35 transition-colors duration-300" />
              <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white">
                <h3 className="text-2xl sm:text-3xl font-light mb-2 tracking-wide drop-shadow-lg">MEN</h3>
                <p className="text-sm mb-4 opacity-90 drop-shadow-md">Contemporary style meets classic refinement</p>
                <Button 
                  variant="outline" 
                  className="bg-white/15 backdrop-blur-sm border-white border-2 text-white hover:bg-white hover:text-black transition-all duration-300 font-semibold shadow-xl"
                  asChild
                >
                  <Link href="/men">
                    DISCOVER COLLECTION
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { 
                name: "ACCESSORIES", 
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                description: "Luxury details",
                href: "/accessories"
              },
              { 
                name: "FOOTWEAR", 
                image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1112&q=80",
                description: "Step forward",
                href: "/footwear"
              },
              { 
                name: "BAGS", 
                image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1035&q=80",
                description: "Carry elegance",
                href: "/bags"
              },
              { 
                name: "JEWELRY", 
                image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                description: "Timeless beauty",
                href: "/jewelry"
              }
            ].map((category, index) => (
              <div key={index} className="group relative h-64 sm:h-80 overflow-hidden border border-neutral-200 bg-white hover:shadow-lg transition-all duration-300">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                  <h3 className="text-lg sm:text-xl font-light mb-1 tracking-wide drop-shadow-lg">{category.name}</h3>
                  <p className="text-xs sm:text-sm opacity-90 drop-shadow-md mb-3">{category.description}</p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="bg-white/15 backdrop-blur-sm border-white text-white hover:bg-white hover:text-black font-medium text-xs transition-all duration-300"
                    asChild
                  >
                    <Link href={category.href}>
                      EXPLORE
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 sm:mb-10 md:mb-16">
            <div>
              <div className="flex items-center mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 mr-2" />
                <span className="text-neutral-400 text-xs sm:text-sm font-medium">CURATED SELECTION</span>
              </div>
              <h3 className="text-[10px] sm:text-xs text-neutral-500 font-bold tracking-[0.2em] uppercase mb-1 sm:mb-2">Signature Collection</h3>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.02em] mb-1 sm:mb-2 text-black">Essential Pieces</h2>
              <p className="text-neutral-600 text-sm sm:text-base lg:text-lg leading-relaxed">Handpicked essentials for the discerning wardrobe</p>
            </div>
            <Button variant="outline" className="self-start md:self-auto border-black border-2 text-black hover:bg-black hover:text-white font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-300" asChild>
              <Link href="/products" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
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
              <div key={index} className="group cursor-pointer bg-white border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg rounded-none sm:rounded-sm overflow-hidden">
                <div className="relative overflow-hidden mb-2 sm:mb-4">
                  {primaryImage ? (
                    <div 
                      className="aspect-[4/5] sm:aspect-[3/4] bg-cover bg-center transition-all duration-700 group-hover:scale-[1.02] sm:group-hover:scale-[1.03] group-hover:brightness-105"
                      style={{ backgroundImage: `url('${primaryImage}')` }}
                    />
                  ) : (
                    <div className="aspect-[4/5] sm:aspect-[3/4] bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-400">
                        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                  
                  {/* Luxury Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Premium Badge - Mobile Optimized */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="bg-white/95 backdrop-blur-sm text-black px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] uppercase shadow-sm border border-black/5">
                      {badge}
                    </span>
                  </div>
                  
                  {/* Premium Heart Icon - Mobile Optimized */}
                  <div className="absolute top-2 right-2 sm:top-3 sm:right-3 opacity-0 sm:group-hover:opacity-100 transition-all duration-300 transform translate-y-1 group-hover:translate-y-0">
                    <button className="w-7 h-7 sm:w-9 sm:h-9 bg-white/95 backdrop-blur-sm hover:bg-white rounded-full flex items-center justify-center shadow-md border border-black/5 hover:scale-110 transition-all duration-200">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Premium Quick Add - Mobile Optimized */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/98 backdrop-blur-md transform translate-y-full group-hover:translate-y-0 transition-all duration-400 ease-out border-t border-neutral-100">
                    <div className="p-2 sm:p-4">
                      <button className="w-full bg-black text-white py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold tracking-[0.1em] uppercase hover:bg-neutral-800 transition-all duration-200 shadow-sm">
                        ADD TO CART
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Premium Product Info - Mobile Optimized */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4">
                  <h3 className="text-xs sm:text-sm font-medium text-black group-hover:text-neutral-700 transition-colors leading-tight sm:leading-snug tracking-wide line-clamp-2">
                    {product.title}
                  </h3>
                  
                  {/* Brand */}
                  {product.brand && (
                    <div className="text-[9px] sm:text-[10px] text-neutral-500 uppercase tracking-wider font-medium">
                      {product.brand}
                    </div>
                  )}
                  
                  {/* Premium Price Display - Mobile Optimized */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <span className="text-sm sm:text-base font-semibold text-black tracking-wide">
                        ${price.toFixed(2)}
                      </span>
                      {compareAt && compareAt > price && (
                        <span className="text-xs sm:text-sm text-neutral-400 line-through">
                          ${compareAt.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-neutral-500 uppercase tracking-wider font-medium hidden sm:block">
                      PREMIUM
                    </div>
                  </div>
                  
                  {/* Category */}
                  {product.category && (
                    <div className="text-[9px] sm:text-[10px] text-blue-600 uppercase tracking-wider font-medium">
                      {product.category.displayName || product.category.name}
                    </div>
                  )}
                </div>
              </div>
              )
            }) : (
              <div className="col-span-2 lg:col-span-4 text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M9 5l7 7-7 7" />
                  </svg>
                  <p className="text-gray-600">No featured products available yet.</p>
                  <p className="text-sm text-gray-500 mt-2">Check back soon for our curated collection!</p>
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
              <Button variant="outline" className="border-white border-2 text-white bg-transparent hover:bg-white hover:text-black font-semibold shadow-lg" asChild>
                <Link href="/about">
                  OUR STORY
                </Link>
              </Button>
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