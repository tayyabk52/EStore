"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Crown, Star, Heart, ShoppingBag, Filter, Grid, List, ChevronDown, ArrowRight, Sparkles, Leaf, Shield, Truck } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function MenPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 1000])

  const categories = [
    { name: "NEW IN", count: 24, href: "#" },
    { name: "CLOTHING", count: 156, href: "#" },
    { name: "SHOES", count: 89, href: "#" },
    { name: "ACCESSORIES", count: 67, href: "#" },
    { name: "SPORT", count: 43, href: "#" },
    { name: "SALE", count: 78, href: "#" }
  ]

  const sampleProducts = [
    {
      id: 1,
      name: "Italian Wool Blend Blazer",
      price: 299,
      originalPrice: 399,
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "BESTSELLER",
      colors: ["#2c3e50", "#1a1a1a", "#6b4423"],
      category: "CLOTHING",
      isNew: false,
      isSale: true
    },
    {
      id: 2,
      name: "Premium Cashmere Sweater",
      price: 189,
      originalPrice: 249,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "LIMITED",
      colors: ["#8b4513", "#1a1a1a", "#2d4a3e"],
      category: "CLOTHING",
      isNew: true,
      isSale: false
    },
    {
      id: 3,
      name: "Leather Chelsea Boots",
      price: 249,
      originalPrice: 299,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      badge: "EXCLUSIVE",
      colors: ["#654321", "#1a1a1a"],
      category: "SHOES",
      isNew: false,
      isSale: true
    },
    {
      id: 4,
      name: "Silk Blend Shirt",
      price: 129,
      originalPrice: 159,
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "NEW",
      colors: ["#ffffff", "#1a1a1a", "#4a4a4a"],
      category: "CLOTHING",
      isNew: true,
      isSale: false
    },
    {
      id: 5,
      name: "Premium Denim Jeans",
      price: 159,
      originalPrice: 199,
      rating: 4.8,
      reviews: 178,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "POPULAR",
      colors: ["#1a1a1a", "#2d4a3e", "#8b4513"],
      category: "CLOTHING",
      isNew: false,
      isSale: true
    },
    {
      id: 6,
      name: "Leather Crossbody Bag",
      price: 199,
      originalPrice: 249,
      rating: 4.9,
      reviews: 94,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "EXCLUSIVE",
      colors: ["#1a1a1a", "#654321"],
      category: "ACCESSORIES",
      isNew: false,
      isSale: true
    },
    {
      id: 7,
      name: "Performance Polo Shirt",
      price: 89,
      originalPrice: 119,
      rating: 4.5,
      reviews: 67,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "SPORT",
      colors: ["#1a1a1a", "#2d4a3e", "#ffffff"],
      category: "SPORT",
      isNew: false,
      isSale: true
    },
    {
      id: 8,
      name: "Wool Blend Coat",
      price: 399,
      originalPrice: 499,
      rating: 4.9,
      reviews: 145,
      image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      badge: "PREMIUM",
      colors: ["#1a1a1a", "#2c3e50", "#6b4423"],
      category: "CLOTHING",
      isNew: true,
      isSale: false
    }
  ]

  const features = [
    { icon: Shield, title: "Premium Quality", description: "Crafted with the finest materials" },
    { icon: Truck, title: "Free Shipping", description: "On orders over $200" },
    { icon: Leaf, title: "Sustainable", description: "Eco-friendly luxury fashion" },
    { icon: Crown, title: "Exclusive", description: "Limited edition pieces" }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] lg:min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60" />
        
        <div className="relative z-10 text-center text-white max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
              <Crown className="w-8 h-8 mx-6 text-white/80" />
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
            </div>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight tracking-[0.15em] text-white mb-6 leading-none">
              MEN'S COLLECTION
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              Contemporary elegance meets timeless sophistication. 
              <span className="block mt-2 text-lg md:text-xl text-white/70">Where modern luxury meets classic refinement.</span>
            </p>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <Leaf className="w-5 h-5 text-green-400" />
              <span className="text-sm tracking-wider text-white/70">PREMIUM MATERIALS • EXCLUSIVE DESIGNS • SUSTAINABLE LUXURY</span>
              <Leaf className="w-5 h-5 text-green-400" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="py-8 bg-neutral-50 border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-3 group-hover:shadow-lg transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-neutral-600" />
                </div>
                <h3 className="text-sm font-medium text-neutral-900 mb-1">{feature.title}</h3>
                <p className="text-xs text-neutral-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Navigation */}
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8 overflow-x-auto scrollbar-hide">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="flex flex-col items-center space-y-1 group"
                >
                  <span className="text-sm font-medium text-neutral-900 group-hover:text-black transition-colors duration-200">
                    {category.name}
                  </span>
                  <span className="text-xs text-neutral-500">{category.count}</span>
                  <div className="w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <div className="flex items-center space-x-2 border border-neutral-200 rounded-md p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="h-8 px-2"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="h-8 px-2"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-neutral-200 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-black/20"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {sampleProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group cursor-pointer bg-white ${
                  viewMode === 'grid' 
                    ? 'border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-lg' 
                    : 'border-b border-neutral-100 pb-6'
                }`}
              >
                {viewMode === 'grid' ? (
                  // Grid View
                  <div className="relative overflow-hidden">
                    <div 
                      className="aspect-[4/5] bg-cover bg-center transition-all duration-700 group-hover:scale-[1.02] group-hover:brightness-105"
                      style={{ backgroundImage: `url('${product.image}')` }}
                    />
                    
                    {/* Badge */}
                    {product.badge && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-sm text-black px-2 py-1 text-xs font-bold tracking-[0.1em] uppercase shadow-sm border border-black/5">
                          {product.badge}
                        </span>
                      </div>
                    )}

                    {/* New/Sale Indicators */}
                    <div className="absolute top-3 right-3 flex flex-col space-y-1">
                      {product.isNew && (
                        <span className="bg-black text-white px-2 py-1 text-xs font-bold tracking-[0.1em] uppercase">
                          NEW
                        </span>
                      )}
                      {product.isSale && (
                        <span className="bg-red-600 text-white px-2 py-1 text-xs font-bold tracking-[0.1em] uppercase">
                          SALE
                        </span>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="absolute bottom-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="sm" className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-black rounded-full shadow-lg">
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button size="sm" className="w-10 h-10 p-0 bg-white/90 hover:bg-white text-black rounded-full shadow-lg">
                        <ShoppingBag className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Color Options */}
                    <div className="absolute bottom-3 left-3 flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {product.colors.map((color, colorIndex) => (
                        <div
                          key={colorIndex}
                          className="w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-110 transition-transform duration-200"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  // List View
                  <div className="flex space-x-6">
                    <div className="relative w-32 h-40 flex-shrink-0">
                      <div 
                        className="w-full h-full bg-cover bg-center rounded-md"
                        style={{ backgroundImage: `url('${product.image}')` }}
                      />
                      {product.badge && (
                        <div className="absolute top-2 left-2">
                          <span className="bg-white/95 text-black px-2 py-1 text-xs font-bold tracking-[0.1em] uppercase">
                            {product.badge}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-neutral-900 mb-1">{product.name}</h3>
                          <p className="text-sm text-neutral-600 mb-2">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-lg font-semibold text-neutral-900">${product.price}</span>
                            {product.originalPrice > product.price && (
                              <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm text-neutral-600">{product.rating}</span>
                            <span className="text-xs text-neutral-500">({product.reviews})</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-3">
                        {product.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-4 h-4 rounded-full border-2 border-neutral-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-neutral-200">
                          <Heart className="w-4 h-4 mr-2" />
                          Wishlist
                        </Button>
                        <Button size="sm" className="bg-black text-white hover:bg-neutral-800">
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-medium text-neutral-900 group-hover:text-black transition-colors duration-200">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-sm text-neutral-600 mb-3">{product.category}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-semibold text-neutral-900">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-neutral-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-neutral-600">{product.rating}</span>
                      <span className="text-xs text-neutral-500">({product.reviews})</span>
                    </div>
                  </div>

                  {/* Color Options */}
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="text-xs text-neutral-500 uppercase tracking-wider">Colors:</span>
                    {product.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-4 h-4 rounded-full border-2 border-neutral-200 cursor-pointer hover:scale-110 transition-transform duration-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 border-neutral-200 hover:bg-neutral-50">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist
                    </Button>
                    <Button size="sm" className="flex-1 bg-black text-white hover:bg-neutral-800">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="border-neutral-300 text-neutral-700 hover:bg-neutral-50 px-8 py-3">
              Load More Products
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center mb-6">
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                <Sparkles className="w-5 h-5 mx-4 text-neutral-400" />
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-light tracking-[0.1em] text-neutral-900 mb-6">
                STAY INFORMED
              </h2>
              
              <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                Be the first to discover new arrivals, exclusive collections, and private sales. 
                Join our community of discerning gentlemen.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black"
                />
                <Button className="bg-black text-white hover:bg-neutral-800 px-8 py-3">
                  Subscribe
                </Button>
              </div>
              
              <p className="text-xs text-neutral-500 mt-4">
                Unsubscribe at any time. Privacy policy applies.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}