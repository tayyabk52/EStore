"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Package,
  Tag,
  DollarSign,
  TrendingUp,
  Star,
  Crown,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = "evelon2024"

export default function ProductsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  // Check authentication on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const key = urlParams.get('key')
    
    if (key === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true)
    } else {
      window.location.href = '/admin/access-denied'
    }
  }, [])

  // Flexible category system - can be customized per store
  const storeCategories = [
    { id: "clothing", name: "Clothing", count: 89, color: "bg-blue-100 text-blue-800" },
    { id: "footwear", name: "Footwear", count: 45, color: "bg-green-100 text-green-800" },
    { id: "accessories", name: "Accessories", count: 67, color: "bg-purple-100 text-purple-800" },
    { id: "bags", name: "Bags", count: 34, color: "bg-yellow-100 text-yellow-800" },
    { id: "jewelry", name: "Jewelry", count: 23, color: "bg-pink-100 text-pink-800" },
    { id: "sport", name: "Sport", count: 28, color: "bg-orange-100 text-orange-800" },
    { id: "home", name: "Home & Living", count: 15, color: "bg-indigo-100 text-indigo-800" },
    { id: "beauty", name: "Beauty", count: 19, color: "bg-red-100 text-red-800" }
  ]

  // Sample products with flexible structure
  const sampleProducts = [
    {
      id: 1,
      name: "Italian Wool Blend Blazer",
      category: "clothing",
      subcategory: "Outerwear",
      price: 299,
      originalPrice: 399,
      stock: 15,
      status: "active",
      featured: true,
      newArrival: false,
      bestseller: true,
      rating: 4.9,
      reviews: 127,
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      colors: ["#2c3e50", "#1a1a1a", "#6b4423"],
      sizes: ["S", "M", "L", "XL"],
      tags: ["premium", "business", "formal"],
      description: "Premium Italian wool blend blazer with modern cut",
      sku: "BLZ-001",
      weight: "0.8kg",
      dimensions: "80x60x5cm"
    },
    {
      id: 2,
      name: "Premium Cashmere Sweater",
      category: "clothing",
      subcategory: "Knitwear",
      price: 189,
      originalPrice: 249,
      stock: 8,
      status: "active",
      featured: true,
      newArrival: true,
      bestseller: false,
      rating: 4.8,
      reviews: 89,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      colors: ["#8b4513", "#1a1a1a", "#2d4a3e"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      tags: ["luxury", "winter", "casual"],
      description: "Ultra-soft cashmere sweater for ultimate comfort",
      sku: "SWT-002",
      weight: "0.4kg",
      dimensions: "70x50x3cm"
    },
    {
      id: 3,
      name: "Leather Chelsea Boots",
      category: "footwear",
      subcategory: "Boots",
      price: 249,
      originalPrice: 299,
      stock: 3,
      status: "low-stock",
      featured: false,
      newArrival: false,
      bestseller: true,
      rating: 4.7,
      reviews: 156,
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      colors: ["#654321", "#1a1a1a"],
      sizes: ["7", "8", "9", "10", "11"],
      tags: ["leather", "classic", "versatile"],
      description: "Timeless leather Chelsea boots with premium construction",
      sku: "BTS-003",
      weight: "0.9kg",
      dimensions: "30x15x12cm"
    },
    {
      id: 4,
      name: "Silk Blend Shirt",
      category: "clothing",
      subcategory: "Shirts",
      price: 129,
      originalPrice: 159,
      stock: 22,
      status: "active",
      featured: false,
      newArrival: true,
      bestseller: false,
      rating: 4.6,
      reviews: 203,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      colors: ["#ffffff", "#1a1a1a", "#4a4a4a"],
      sizes: ["XS", "S", "M", "L", "XL"],
      tags: ["silk", "elegant", "business"],
      description: "Elegant silk blend shirt for sophisticated occasions",
      sku: "SHT-004",
      weight: "0.3kg",
      dimensions: "75x55x2cm"
    }
  ]

  // Filter products based on search and category
  const filteredProducts = sampleProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name)
      case "price":
        return a.price - b.price
      case "stock":
        return a.stock - b.stock
      case "rating":
        return b.rating - a.rating
      default:
        return 0
    }
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Invalid or missing admin key</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href={`/admin?key=${ADMIN_SECRET_KEY}`}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-600">Manage your store's product catalog</p>
              </div>
            </div>
            
            <Link href={`/admin/products/new?key=${ADMIN_SECRET_KEY}`}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {storeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>

              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
                <option value="stock">Sort by Stock</option>
                <option value="rating">Sort by Rating</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-3 py-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Category Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {storeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id === selectedCategory ? "all" : category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.id
                    ? "bg-blue-600 text-white"
                    : `${category.color} hover:bg-gray-100`
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid/List */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
            <div className="text-sm text-gray-600">
              Showing {filteredProducts.length} of {sampleProducts.length} products
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 space-y-1">
                      {product.featured && (
                        <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                          <Star className="w-3 h-3 inline mr-1" />
                          FEATURED
                        </span>
                      )}
                      {product.newArrival && (
                        <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                      {product.bestseller && (
                        <span className="inline-block px-2 py-1 bg-purple-500 text-white text-xs font-bold rounded">
                          <Crown className="w-3 h-3 inline mr-1" />
                          BESTSELLER
                        </span>
                      )}
                    </div>

                    {/* Stock Status */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                        product.status === 'low-stock' 
                          ? 'bg-red-500 text-white' 
                          : 'bg-green-500 text-white'
                      }`}>
                        {product.status === 'low-stock' ? 'LOW STOCK' : 'IN STOCK'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs text-gray-500 mb-2">{product.subcategory}</p>
                      
                      {/* Price */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg font-bold text-gray-900">${product.price}</span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                        )}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-2">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs text-gray-600">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.reviews})</span>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-600">Stock: {product.stock}</span>
                        <span className="text-xs text-gray-500">{product.sku}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortedProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${storeCategories.find(c => c.id === product.category)?.color}`}>
                            {storeCategories.find(c => c.id === product.category)?.name}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">${product.price}</div>
                          {product.originalPrice > product.price && (
                            <div className="text-sm text-gray-500 line-through">${product.originalPrice}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.stock}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            product.status === 'low-stock' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {product.status === 'low-stock' ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Category Management Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Category Management</h3>
              <p className="text-sm text-gray-600">Organize your product categories and navigation</p>
            </div>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {storeCategories.map((category) => (
              <div key={category.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${category.color}`}>
                    {category.name}
                  </span>
                  <div className="flex space-x-1">
                    <Button size="sm" variant="outline">
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{category.count}</div>
                <div className="text-sm text-gray-600">products</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Products are organized by flexible categories that can be customized for any store type.</p>
          <p className="mt-1">Each product can have multiple attributes, tags, and status indicators for comprehensive management.</p>
        </div>
      </div>
    </div>
  )
} 