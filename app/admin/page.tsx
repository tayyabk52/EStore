"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Shield, 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  DollarSign,
  Loader2,
  CheckCircle,
  Folder,
  ImageIcon,
  Tag,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Zap,
  Globe,
  Calendar,
  Activity
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin/admin-layout"
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
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">Invalid or missing admin key</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Loading Dashboard</h1>
            <p className="text-gray-600">Fetching your store data...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h1>
            <p className="text-gray-600">{error}</p>
            <Button onClick={fetchDashboardStats} className="mt-4">
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout 
      title="Dashboard" 
      subtitle={`Welcome back! Here's what's happening in your store today.`}
    >
      {/* Key Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {/* Revenue Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                ${(stats?.totalRevenue || 0).toLocaleString()}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500" />
                <span className="text-green-600 font-medium">+12.5%</span>
                <span className="text-gray-500">from last month</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-green-50 to-green-100 rounded-tl-full opacity-50" />
        </Card>

        {/* Products Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Products</CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalProducts || 0}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <ArrowUpRight className="w-4 h-4 text-blue-500" />
                <span className="text-blue-600 font-medium">+3 this week</span>
                <span className="text-gray-500">active products</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-tl-full opacity-50" />
        </Card>

        {/* Orders Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Total Orders</CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ShoppingCart className="w-4 h-4 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalOrders || 0}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-purple-600 font-medium">Processing</span>
                <span className="text-gray-500">0 pending</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-50 to-purple-100 rounded-tl-full opacity-50" />
        </Card>

        {/* Categories Card */}
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">Categories</CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Folder className="w-4 h-4 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-gray-900">
                {stats?.totalCategories || 0}
              </div>
              <div className="flex items-center space-x-1 text-sm">
                <Zap className="w-4 h-4 text-orange-500" />
                <span className="text-orange-600 font-medium">Organized</span>
                <span className="text-gray-500">structure</span>
              </div>
            </div>
          </CardContent>
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-br from-orange-50 to-orange-100 rounded-tl-full opacity-50" />
        </Card>
      </motion.div>

      {/* Quick Actions & Setup */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Quick Setup Guide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-blue-600" />
                <span>Quick Setup</span>
              </CardTitle>
              <CardDescription>
                Get your store ready in 3 simple steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Categories */}
                <Link href={`/admin/categories?key=${ADMIN_SECRET_KEY}`} className="group">
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          1
                        </div>
                        <span className="font-medium text-gray-900">Categories</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stats?.totalCategories || 0}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Organize products into categories and subcategories
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Setup Categories →
                    </Button>
                  </div>
                </Link>

                {/* Collections */}
                <Link href={`/admin/collections?key=${ADMIN_SECRET_KEY}`} className="group">
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-purple-300 hover:bg-purple-50/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          2
                        </div>
                        <span className="font-medium text-gray-900">Collections</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Featured
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Create featured collections for your homepage
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Manage Collections →
                    </Button>
                  </div>
                </Link>

                {/* Products */}
                <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`} className="group">
                  <div className="p-4 rounded-lg border-2 border-dashed border-gray-200 hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          3
                        </div>
                        <span className="font-medium text-gray-900">Products</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {stats?.totalProducts || 0}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Add products with variants, pricing, and images
                    </p>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Add Products →
                    </Button>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Store Status */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Store Status</span>
              </CardTitle>
              <CardDescription>
                System health and performance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Database</p>
                    <p className="text-xs text-gray-600">Connected</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 border border-blue-200">
                <div className="flex items-center space-x-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Security</p>
                    <p className="text-xs text-gray-600">Authenticated</p>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                  Secure
                </Badge>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-lg ${
                (stats?.lowStockProducts?.length || 0) > 0 
                  ? 'bg-yellow-50 border border-yellow-200' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className="flex items-center space-x-3">
                  <Package className={`w-5 h-5 ${
                    (stats?.lowStockProducts?.length || 0) > 0 ? 'text-yellow-600' : 'text-green-600'
                  }`} />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Inventory</p>
                    <p className="text-xs text-gray-600">
                      {(stats?.lowStockProducts?.length || 0) === 0 ? 'Well stocked' : `${stats?.lowStockProducts?.length} low stock`}
                    </p>
                  </div>
                </div>
                <Badge className={`${
                  (stats?.lowStockProducts?.length || 0) > 0 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                    : 'bg-green-100 text-green-800 border-green-300'
                }`}>
                  {(stats?.lowStockProducts?.length || 0) === 0 ? 'Good' : 'Alert'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span>Recent Products</span>
                  </CardTitle>
                  <CardDescription>
                    Latest additions to your inventory
                  </CardDescription>
                </div>
                <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`}>
                  <Button variant="ghost" size="sm" className="text-xs">
                    View All →
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {stats?.recentProducts && stats.recentProducts.length > 0 ? (
                <div className="space-y-3">
                  {stats.recentProducts.slice(0, 4).map((product: any, index: number) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 group transition-colors"
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                        {product.images?.[0]?.url ? (
                          <img 
                            src={product.images[0].url} 
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900 truncate">
                          {product.title}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs px-2 py-0">
                            ${product.variants?.[0]?.price || 0}
                          </Badge>
                          <Badge 
                            variant={product.variants?.[0]?.stock < 10 ? "destructive" : "default"}
                            className="text-xs px-2 py-0"
                          >
                            {product.variants?.[0]?.stock || 0} in stock
                          </Badge>
                        </div>
                      </div>
                      <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}&edit=${product.id}`}>
                        <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tag className="w-4 h-4" />
                        </Button>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="font-medium text-gray-700 mb-2">No products yet</p>
                  <p className="text-sm text-gray-600 mb-4">Start building your inventory</p>
                  <div className="space-y-2">
                    <Link href={`/admin/categories?key=${ADMIN_SECRET_KEY}`}>
                      <Button size="sm" variant="outline" className="w-full">
                        Setup Categories First
                      </Button>
                    </Link>
                    <Link href={`/admin/products?key=${ADMIN_SECRET_KEY}`}>
                      <Button size="sm" className="w-full">
                        Add Your First Product
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Performance Insights */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                <span>Performance Insights</span>
              </CardTitle>
              <CardDescription>
                Store analytics and trends
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 space-y-6">
              {/* Store Completion */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Store Setup</span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((stats?.totalCategories || 0) > 0 ? 33 : 0) + 
                                ((stats?.totalProducts || 0) > 0 ? 34 : 0) + 
                                (33))}%
                  </span>
                </div>
                <Progress 
                  value={((stats?.totalCategories || 0) > 0 ? 33 : 0) + 
                         ((stats?.totalProducts || 0) > 0 ? 34 : 0) + 
                         (33)}
                  className="h-2"
                />
                <p className="text-xs text-gray-500 mt-1">Complete setup to go live</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-blue-50">
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(((stats?.totalProducts || 0) / Math.max(1, stats?.totalCategories || 1)) * 10) / 10}
                  </p>
                  <p className="text-xs text-gray-600">Avg Products per Category</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-green-50">
                  <p className="text-2xl font-bold text-green-600">
                    {stats?.recentProducts?.reduce((acc: number, product: any) => 
                      acc + (product.variants?.length || 0), 0) || 0}
                  </p>
                  <p className="text-xs text-gray-600">Total Variants</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Store setup in progress</span>
                    <Badge variant="outline" className="ml-auto text-xs">
                      <Clock className="w-3 h-3 mr-1" />
                      Now
                    </Badge>
                  </div>
                  {(stats?.totalProducts || 0) > 0 && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Products added</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Today
                      </Badge>
                    </div>
                  )}
                  {(stats?.totalCategories || 0) > 0 && (
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Categories organized</span>
                      <Badge variant="outline" className="ml-auto text-xs">
                        <Calendar className="w-3 h-3 mr-1" />
                        Today
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AdminLayout>
  )
}