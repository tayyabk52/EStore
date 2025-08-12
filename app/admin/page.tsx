"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Plus,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  Grid,
  List,
  ArrowRight,
  Crown,
  Star,
  DollarSign,
  Calendar,
  BarChart3,
  Loader2,
  CheckCircle,
  Folder,
  ImageIcon,
  Tag,
  ArrowDown,
  ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ""

interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  recentProducts: any[]
  recentOrders: any[]
  lowStockProducts: any[]
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check authentication on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const key = urlParams.get('key')
    const envKey = ADMIN_SECRET_KEY
    const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('ADMIN_KEY') : null

    if (key && envKey && key === envKey) {
      window.sessionStorage.setItem('ADMIN_KEY', key)
      setIsAuthenticated(true)
      fetchDashboardStats()
      return
    }
    if (stored && envKey && stored === envKey) {
      setIsAuthenticated(true)
      fetchDashboardStats()
      return
    }
    window.location.href = '/admin/access-denied'
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/dashboard', {
        headers: {
          'x-admin-key': ADMIN_SECRET_KEY
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats')
      }
      
      const data = await response.json()
      setStats(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Invalid or missing admin key</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loading Dashboard</h1>
          <p className="text-gray-600">Fetching your store data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h1>
          <p className="text-gray-600">{error}</p>
          <Button onClick={fetchDashboardStats} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Store Admin</h1>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Store
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Store Admin</h2>
          <p className="text-gray-600">Manage your online store with a simple 4-step process: Create Categories → Setup Collections → Add Products → Manage Orders</p>
        </motion.div>

        {/* How Your Store Works */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            How Your E-Commerce Store Works
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Folder className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-blue-900 mb-2">1. Categories</h4>
              <p className="text-sm text-blue-700">
                Organize your products into categories like "Clothing", "Electronics", etc. 
                Categories can have subcategories (e.g., "Men's Clothing" under "Clothing").
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-green-900 mb-2">2. Products</h4>
              <p className="text-sm text-green-700">
                Each product has basic info (name, description) plus variants (different sizes, colors) 
                with their own prices and stock levels, plus images.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3">
                <ShoppingCart className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-purple-900 mb-2">3. Orders</h4>
              <p className="text-sm text-purple-700">
                When customers buy specific product variants, orders are created with 
                the exact items, quantities, and shipping details.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Folder className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalCategories || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Package className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Setup Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Setup Guide</h3>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Step 1: Categories */}
              <Link href={`/admin/categories?key=${ADMIN_SECRET_KEY}`} className="group">
                <div className="p-6 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <h4 className="font-semibold text-gray-900">Setup Categories</h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center"><Folder className="w-4 h-4 mr-2" />Create main categories (e.g., Clothing)</p>
                    <p className="flex items-center"><Folder className="w-4 h-4 mr-2" />Add subcategories (e.g., Men's, Women's)</p>
                    <p className="flex items-center"><Settings className="w-4 h-4 mr-2" />Configure display settings</p>
                  </div>
                  <Button size="sm" className="mt-4 w-full">
                    Manage Categories
                  </Button>
                </div>
              </Link>

              {/* Step 2: Collections */}
              <Link href={`/admin/collections?key=${ADMIN_SECRET_KEY}`} className="group">
                <div className="p-6 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <h4 className="font-semibold text-gray-900">Setup Collections</h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center"><Star className="w-4 h-4 mr-2" />Create featured collections</p>
                    <p className="flex items-center"><ImageIcon className="w-4 h-4 mr-2" />Add compelling imagery</p>
                    <p className="flex items-center"><Crown className="w-4 h-4 mr-2" />Display on homepage</p>
                  </div>
                  <Button size="sm" className="mt-4 w-full">
                    Manage Collections
                  </Button>
                </div>
              </Link>

              {/* Step 3: Products */}
              <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`} className="group">
                <div className="p-6 rounded-lg border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <h4 className="font-semibold text-gray-900">Add Products</h4>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-green-600" />
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p className="flex items-center"><Package className="w-4 h-4 mr-2" />Create product (name, description)</p>
                    <p className="flex items-center"><Tag className="w-4 h-4 mr-2" />Add variants (price, stock, size/color)</p>
                    <p className="flex items-center"><ImageIcon className="w-4 h-4 mr-2" />Upload product images</p>
                  </div>
                  <Button size="sm" className="mt-4 w-full">
                    Add Products
                  </Button>
                </div>
              </Link>

              {/* Step 4: Orders */}
              <div className="p-6 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-400 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <h4 className="font-semibold text-gray-900">Manage Orders</h4>
                  </div>
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center"><ShoppingCart className="w-4 h-4 mr-2" />Orders appear when customers buy</p>
                  <p className="flex items-center"><TrendingUp className="w-4 h-4 mr-2" />Track sales and revenue</p>
                  <p className="flex items-center"><Users className="w-4 h-4 mr-2" />Manage customer information</p>
                </div>
                <Button size="sm" className="mt-4 w-full" variant="outline" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Recent Products & Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`}>
                  <Button variant="outline" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {stats?.recentProducts && stats.recentProducts.length > 0 ? (
                  stats.recentProducts.map((product: any) => (
                    <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                        {product.images?.[0]?.url ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{product.title}</h4>
                        <p className="text-sm text-gray-600">
                          {product.category?.displayName || product.category?.name || 'Uncategorized'}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm font-medium text-green-600">
                            ${product.variants?.[0]?.price || 0}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            product.variants?.[0]?.stock < 10 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            Stock: {product.variants?.[0]?.stock || 0}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.variants?.length || 0} variants
                          </span>
                        </div>
                      </div>
                      <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}&edit=${product.id}`}>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p className="font-medium">No products yet</p>
                    <p className="text-sm mb-4">Start by creating categories, then add your products</p>
                    <div className="space-y-2">
                      <Link href={`/admin/categories?key=${ADMIN_SECRET_KEY}`}>
                        <Button size="sm" variant="outline" className="w-full">
                          1. Create Categories First
                        </Button>
                      </Link>
                      <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`}>
                        <Button size="sm" className="w-full">
                          2. Then Add Products
                        </Button>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* System Status */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Store Status</h3>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Database Connected</p>
                    <p className="text-sm text-gray-600">Supabase integration working</p>
                  </div>
                </div>
                <span className="text-sm text-green-600 font-medium">✓ Active</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Admin Access</p>
                    <p className="text-sm text-gray-600">Authenticated with secret key</p>
                  </div>
                </div>
                <span className="text-sm text-blue-600 font-medium">✓ Secure</span>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                (stats?.lowStockProducts?.length || 0) > 0 ? 'bg-yellow-50' : 'bg-green-50'
              }`}>
                <div className="flex items-center space-x-3">
                  <Package className={`w-5 h-5 ${
                    (stats?.lowStockProducts?.length || 0) > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">Inventory Status</p>
                    <p className="text-sm text-gray-600">
                      {(stats?.lowStockProducts?.length || 0) === 0 
                        ? 'All products well stocked' 
                        : `${stats?.lowStockProducts?.length} items low on stock`
                      }
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-medium ${
                  (stats?.lowStockProducts?.length || 0) > 0 ? 'text-yellow-600' : 'text-green-600'
                }`}>
                  {(stats?.lowStockProducts?.length || 0) === 0 ? '✓ Good' : '⚠ Attention'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <div className="bg-gray-100 rounded-lg p-4">
            <p className="font-medium text-gray-700 mb-2">🔒 Admin Panel Security</p>
            <p>This admin panel is secured with a secret key. Keep your admin URL private:</p>
            <code className="bg-white px-3 py-1 rounded mt-2 inline-block text-gray-800">
              yourstore.com/admin?key=YOUR_SECRET_KEY
            </code>
            <p className="mt-2 text-xs">Only share this URL with authorized store managers.</p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}