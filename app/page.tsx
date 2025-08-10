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

export default function HomePage() {
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
            backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        {/* Sophisticated Multi-layer Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/60 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Floating Luxury Content Container */}
        <div className="relative z-20 text-center text-white max-w-6xl mx-auto px-4 sm:px-6">
          {/* Ultra-Premium Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-black/10 to-white/[0.02] backdrop-blur-[2px] rounded-[2rem] border border-white/[0.08] animate-backdrop-glow shimmer-effect" style={{ transform: 'scale(1.15)' }} />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/[0.03] to-transparent rounded-[2rem] transition-all duration-1000 ease-out" style={{ transform: 'scale(1.1)' }} />
          
          <div className="relative py-12 sm:py-16 md:py-20">
          
          {/* Luxury Brand Name with Refined Typography */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-[0.15em] sm:tracking-[0.2em] mb-6 sm:mb-8 md:mb-10 animate-fade-in-up animation-delay-200">
            <span className="inline-block transform hover:scale-110 transition-all duration-1000 ease-out drop-shadow-2xl hover:drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)] hover:tracking-[0.25em]">
              EVELON
            </span>
          </h1>
          
          {/* Elegant Separator */}
          <div className="flex items-center justify-center mb-6 sm:mb-8 md:mb-10 animate-fade-in-up animation-delay-400">
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent transform origin-center scale-x-0 animate-[scale-x_2s_ease-out_0.8s_forwards]"></div>
            <div className="w-2 h-2 bg-white/60 rounded-full mx-4 sm:mx-6 transform scale-0 animate-[scale_1s_ease-out_1.2s_forwards] hover:scale-125 transition-transform duration-500"></div>
            <div className="w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent transform origin-center scale-x-0 animate-[scale-x_2s_ease-out_0.8s_forwards]"></div>
          </div>
          
          {/* Sophisticated Description */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light mb-10 sm:mb-14 md:mb-16 max-w-4xl mx-auto leading-relaxed px-4 sm:px-6 text-white/90 animate-fade-in-up animation-delay-600">
            <span className="block mb-2 sm:mb-3">Redefining modern luxury through</span>
            <span className="block font-normal tracking-wide">timeless design & exceptional craftsmanship</span>
          </p>
          
          {/* Luxury Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center animate-fade-in-up animation-delay-800">
            <Button 
              asChild
              size="lg" 
              className="group relative bg-white text-black hover:bg-white/95 hover:scale-105 hover:-translate-y-1 px-12 sm:px-16 py-4 sm:py-5 text-sm sm:text-base font-medium tracking-[0.1em] uppercase border-0 shadow-lg hover:shadow-2xl transition-all duration-500 ease-out overflow-hidden"
            >
              <Link href="/women">
                <span className="relative z-10 transition-all duration-300 group-hover:tracking-[0.15em]">Explore Collection</span>
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-50 to-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
              </Link>
            </Button>
            <Button 
              asChild
              size="lg" 
              variant="outline" 
              className="group relative border-white border text-white hover:text-black hover:scale-105 hover:-translate-y-1 bg-transparent hover:bg-white px-12 sm:px-16 py-4 sm:py-5 text-sm sm:text-base font-medium tracking-[0.1em] uppercase transition-all duration-500 ease-out overflow-hidden"
            >
              <Link href="/about">
                <span className="relative z-10 transition-all duration-300 group-hover:tracking-[0.15em]">Our Story</span>
                <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shimmer_2s_ease-in-out_infinite]" />
              </Link>
            </Button>
          </div>
          </div>
        </div>

        
        {/* Ambient Light Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-[float-gentle_10s_ease-in-out_infinite] animation-delay-1000" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl animate-[float-gentle_12s_ease-in-out_infinite_reverse] animation-delay-2000" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white/[0.008] rounded-full blur-2xl animate-[float-gentle_14s_ease-in-out_infinite] animation-delay-3000 transform -translate-x-1/2 -translate-y-1/2" />
        </div>
      </section>

      {/* Luxury Brand Values Section */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-stone-100 relative overflow-hidden">
        {/* Subtle Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-stone-100 via-stone-50 to-stone-100 opacity-50" />
        
        <div className="container mx-auto px-4 relative z-10">
          {/* Refined Header */}
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <div className="flex items-center justify-center mb-4 sm:mb-6">
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-stone-400 to-transparent"></div>
              <div className="w-1.5 h-1.5 bg-stone-400 rounded-full mx-4 sm:mx-6"></div>
              <div className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent via-stone-400 to-transparent"></div>
            </div>
            <h3 className="text-[10px] sm:text-xs text-stone-500 font-bold tracking-[0.3em] uppercase mb-3 sm:mb-4">Our Promise</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extralight text-black tracking-wide mb-4 sm:mb-6">Crafted for Perfection</h2>
            <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">Every detail reflects our unwavering commitment to excellence</p>
          </div>
          
          {/* Luxury Value Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              {
                icon: Truck,
                title: "Premium Delivery",
                description: "Complimentary white-glove service on orders over $150"
              },
              {
                icon: Shield,
                title: "Quality Promise",
                description: "30-day return guarantee on all premium pieces"
              },
              {
                icon: Crown,
                title: "Exclusive Access",
                description: "First access to limited collections and private sales"
              }
            ].map((item, index) => (
              <div key={index} className="group text-center">
                {/* Luxury Icon Container */}
                <div className="relative mx-auto mb-6 sm:mb-8">
                  <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-black rounded-full flex items-center justify-center mx-auto group-hover:scale-110 group-hover:shadow-2xl transition-all duration-500 ease-out relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-700 to-black rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <item.icon className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-white relative z-10 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  {/* Subtle Ring Effect */}
                  <div className="absolute inset-0 border-2 border-stone-200 rounded-full opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-700 ease-out" />
                </div>
                
                {/* Content */}
                <div className="space-y-2 sm:space-y-3 px-2">
                  <h3 className="text-base sm:text-lg md:text-xl font-medium text-black tracking-wide group-hover:text-stone-800 transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-stone-600 leading-relaxed max-w-xs mx-auto group-hover:text-stone-700 transition-colors duration-300">
                    {item.description}
                  </p>
                </div>
                
                {/* Subtle Separator */}
                <div className="mt-6 sm:mt-8 flex justify-center">
                  <div className="w-6 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
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
                description: "Refined sparkle",
                href: "/jewelry"
              },
            ].map((category) => (
              <Link key={category.name} href={category.href} className="group relative h-64 overflow-hidden cursor-pointer border border-neutral-200 bg-white">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
                  style={{ backgroundImage: `url('${category.image}')` }}
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center">
                  <h4 className="text-lg font-medium mb-1 tracking-wide drop-shadow-lg">{category.name}</h4>
                  <p className="text-sm opacity-90 drop-shadow-md">{category.description}</p>
                </div>
              </Link>
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
                <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 mx-2 sm:mx-3 text-neutral-400" />
                <div className="w-4 sm:w-6 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
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
            {[
              {
                name: "Cashmere Blend Coat",
                price: "$299",
                originalPrice: "$399",
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                badge: "BESTSELLER",
                colors: ["#1a1a1a", "#8b4513", "#2d4a3e"]
              },
              {
                name: "Italian Leather Boots",
                price: "$189",
                originalPrice: "$249",
                rating: 4.8,
                image: "https://images.unsplash.com/photo-1608256246200-53e635b5b665?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
                badge: "LIMITED",
                colors: ["#654321", "#1a1a1a"]
              },
              {
                name: "Silk Midi Dress",
                price: "$159",
                originalPrice: "$199",
                rating: 4.7,
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1846&q=80",
                badge: "NEW",
                colors: ["#8b7355", "#1a1a1a", "#4a4a4a"]
              },
              {
                name: "Premium Wool Blazer",
                price: "$229",
                originalPrice: "$299",
                rating: 4.9,
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                badge: "EXCLUSIVE",
                colors: ["#2c3e50", "#1a1a1a", "#6b4423"]
              },
            ].map((product, index) => (
              <div key={index} className="group cursor-pointer bg-white border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg rounded-none sm:rounded-sm overflow-hidden">
                <div className="relative overflow-hidden mb-2 sm:mb-4">
                  <div 
                    className="aspect-[4/5] sm:aspect-[3/4] bg-cover bg-center transition-all duration-700 group-hover:scale-[1.02] sm:group-hover:scale-[1.03] group-hover:brightness-105"
                    style={{ backgroundImage: `url('${product.image}')` }}
                  />
                  
                  {/* Luxury Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Premium Badge - Mobile Optimized */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
                    <span className="bg-white/95 backdrop-blur-sm text-black px-2 py-1 sm:px-3 sm:py-1.5 text-[8px] sm:text-[9px] font-bold tracking-[0.1em] uppercase shadow-sm border border-black/5">
                      {product.badge}
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
                    {product.name}
                  </h3>
                  
                  {/* Premium Color Options - Mobile Optimized */}
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    {product.colors.slice(0, 3).map((color, colorIndex) => (
                      <button 
                        key={colorIndex}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-neutral-200 hover:border-neutral-400 hover:scale-110 transition-all duration-200 shadow-sm"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <span className="text-[9px] sm:text-[10px] text-neutral-500 ml-1 sm:ml-2 uppercase tracking-wider font-medium">+{product.colors.length}</span>
                  </div>
                  
                  {/* Premium Price Display - Mobile Optimized */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <span className="text-sm sm:text-base font-semibold text-black tracking-wide">{product.price}</span>
                      <span className="text-xs sm:text-sm text-neutral-400 line-through">{product.originalPrice}</span>
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-neutral-500 uppercase tracking-wider font-medium hidden sm:block">
                      PREMIUM
                    </div>
                  </div>
                </div>
              </div>
            ))}
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