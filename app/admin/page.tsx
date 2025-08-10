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
  BarChart3
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = "evelon2024" // This will be moved to environment variables

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [searchParams, setSearchParams] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Check authentication on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const key = urlParams.get('key')
    
    if (key === ADMIN_SECRET_KEY) {
      setIsAuthenticated(true)
    } else {
      // Redirect to access denied if no valid key
      window.location.href = '/admin/access-denied'
    }
  }, [])

  // Sample data for demonstration
  const storeStats = {
    totalProducts: 247,
    totalOrders: 89,
    totalCustomers: 156,
    totalRevenue: 45230,
    recentOrders: 12,
    lowStockItems: 8
  }

  const recentProducts = [
    {
      id: 1,
      name: "Italian Wool Blend Blazer",
      category: "Clothing",
      price: 299,
      stock: 15,
      status: "active",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      name: "Premium Cashmere Sweater",
      category: "Clothing",
      price: 189,
      stock: 8,
      status: "active",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      name: "Leather Chelsea Boots",
      category: "Footwear",
      price: 249,
      stock: 3,
      status: "low-stock",
      image: "https://images.unsplash.com/photo-1608256246200-53e635b5b665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
    }
  ]

  const quickActions = [
    {
      title: "Add Product",
      description: "Create new product listing",
      icon: Plus,
      href: "/admin/products/new",
      color: "bg-blue-500"
    },
    {
      title: "Manage Categories",
      description: "Organize product categories",
      icon: Package,
      href: "/admin/categories",
      color: "bg-green-500"
    },
    {
      title: "View Orders",
      description: "Process customer orders",
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-purple-500"
    },
    {
      title: "Store Settings",
      description: "Configure store options",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500"
    }
  ]

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Crown className="w-8 h-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">Evelon Admin</h1>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Admin Panel
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Store Dashboard</h2>
          <p className="text-gray-600">Manage your products, orders, and store settings from one central location.</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900">{storeStats.totalProducts}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{storeStats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{storeStats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${storeStats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg ${action.color}`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{action.title}</h4>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Recent Products & Quick Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Products */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
                <Link href="/admin/products">
                  <Button variant="outline" size="sm">
                    View All <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-600">{product.category} • ${product.price}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          product.status === 'low-stock' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {product.status === 'low-stock' ? 'Low Stock' : 'In Stock'}
                        </span>
                        <span className="text-xs text-gray-500">Stock: {product.stock}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Store Configuration */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Store Configuration</h3>
            </div>
            
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Store Categories</h4>
                    <p className="text-sm text-gray-600">Manage product categories</p>
                  </div>
                  <Link href="/admin/categories">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Navigation Menu</h4>
                    <p className="text-sm text-gray-600">Customize store navigation</p>
                  </div>
                  <Link href="/admin/navigation">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Featured Content</h4>
                    <p className="text-sm text-gray-600">Manage homepage sections</p>
                  </div>
                  <Link href="/admin/featured">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">Store Settings</h4>
                    <p className="text-sm text-gray-600">General store configuration</p>
                  </div>
                  <Link href="/admin/settings">
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>Admin access via: <code className="bg-gray-100 px-2 py-1 rounded">yourstore.com/admin?key=YOUR_SECRET_KEY</code></p>
          <p className="mt-2">Keep this URL secure and share only with authorized personnel.</p>
        </motion.div>
      </div>
    </div>
  )
} 