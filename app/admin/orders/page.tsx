"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Package, 
  ArrowLeft, 
  Save, 
  X,
  Check,
  AlertCircle,
  Grid,
  List,
  Search,
  Filter,
  MoreHorizontal,
  ShoppingBag,
  CreditCard,
  Truck,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  TrendingUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin/admin-layout"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "evelon2024"

interface Order {
  id: string
  userId: string
  number: string
  status: 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  paymentStatus: 'PAYMENT_PENDING' | 'AUTHORIZED' | 'PAID' | 'FAILED' | 'REFUNDED'
  currency: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  shippingAddressId?: string
  billingAddressId?: string
  placedAt?: string
  notes?: string
  metadata?: any
  paymentProvider?: string
  paymentIntentId?: string
  paymentData?: any
  createdAt: string
  updatedAt: string
  // Related data
  orderItems?: OrderItem[]
  shippingAddress?: OrderAddress
  billingAddress?: OrderAddress
  payments?: Payment[]
  shipments?: Shipment[]
}

interface OrderItem {
  id: string
  orderId: string
  productId?: string
  variantId?: string
  quantity: number
  unitPrice: number
  currency: string
  productName: string
  sku: string
  imageUrl?: string
  createdAt: string
}

interface OrderAddress {
  id: string
  userId?: string
  label?: string
  fullName: string
  line1: string
  line2?: string
  city: string
  region?: string
  postalCode?: string
  countryCode: string
  phone?: string
  isDefaultShip: boolean
  isDefaultBill: boolean
  createdAt: string
  updatedAt: string
}

interface Payment {
  id: string
  orderId: string
  provider: string
  status: string
  amount: number
  currency: string
  transactionId?: string
  data?: any
  createdAt: string
  updatedAt: string
}

interface Shipment {
  id: string
  orderId: string
  status: string
  carrier?: string
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
  createdAt: string
  updatedAt: string
}

const ORDER_STATUSES = [
  { value: 'PENDING', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'CONFIRMED', label: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
  { value: 'PROCESSING', label: 'Processing', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'SHIPPED', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'DELIVERED', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'CANCELLED', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
]

const PAYMENT_STATUSES = [
  { value: 'PAYMENT_PENDING', label: 'Pending', color: 'bg-gray-100 text-gray-800' },
  { value: 'AUTHORIZED', label: 'Authorized', color: 'bg-blue-100 text-blue-800' },
  { value: 'PAID', label: 'Paid', color: 'bg-green-100 text-green-800' },
  { value: 'FAILED', label: 'Failed', color: 'bg-red-100 text-red-800' },
  { value: 'REFUNDED', label: 'Refunded', color: 'bg-orange-100 text-orange-800' },
]

export default function OrdersAdminPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingOrder, setEditingOrder] = useState<Order | null>(null)
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [stats, setStats] = useState<any>(null)
  const [showOrderDetails, setShowOrderDetails] = useState<Order | null>(null)

  const perPage = 20

  // Form state
  const [orderForm, setOrderForm] = useState({
    userId: '',
    number: '',
    status: 'PENDING' as Order['status'],
    paymentStatus: 'PAYMENT_PENDING' as Order['paymentStatus'],
    currency: 'PKR',
    subtotal: '',
    tax: '',
    shipping: '',
    discount: '',
    total: '',
    notes: '',
    paymentProvider: '',
    paymentIntentId: '',
  })

  useEffect(() => {
    fetchOrders()
    fetchStats()
  }, [page, searchQuery, selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        key: ADMIN_SECRET_KEY,
        page: page.toString(),
        perPage: perPage.toString(),
        ...(searchQuery && { q: searchQuery }),
        ...(selectedStatus && { status: selectedStatus }),
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      const data = await response.json()

      if (!response.ok) throw new Error(data.error)

      setOrders(data.items || [])
      setTotalOrders(data.total || 0)
      setError('')
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/admin/orders/stats?key=${ADMIN_SECRET_KEY}`)
      const data = await response.json()
      if (response.ok) {
        setStats(data)
      }
    } catch (err) {
      console.error('Error fetching stats:', err)
    }
  }

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
        body: JSON.stringify({
          ...orderForm,
          subtotal: parseFloat(orderForm.subtotal) || 0,
          tax: parseFloat(orderForm.tax) || 0,
          shipping: parseFloat(orderForm.shipping) || 0,
          discount: parseFloat(orderForm.discount) || 0,
          total: parseFloat(orderForm.total) || 0,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      // Reset form and refresh orders
      setOrderForm({
        userId: '',
        number: '',
        status: 'PENDING',
        paymentStatus: 'PAYMENT_PENDING',
        currency: 'PKR',
        subtotal: '',
        tax: '',
        shipping: '',
        discount: '',
        total: '',
        notes: '',
        paymentProvider: '',
        paymentIntentId: '',
      })
      setShowCreateForm(false)
      fetchOrders()
      fetchStats()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleUpdateOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingOrder) return
    
    try {
      const response = await fetch('/api/admin/orders', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
        body: JSON.stringify({
          id: editingOrder.id,
          ...orderForm,
          subtotal: parseFloat(orderForm.subtotal) || editingOrder.subtotal,
          tax: parseFloat(orderForm.tax) || editingOrder.tax,
          shipping: parseFloat(orderForm.shipping) || editingOrder.shipping,
          discount: parseFloat(orderForm.discount) || editingOrder.discount,
          total: parseFloat(orderForm.total) || editingOrder.total,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update order')
      }

      setEditingOrder(null)
      fetchOrders()
      fetchStats()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to delete this order?')) return

    try {
      const response = await fetch(`/api/admin/orders?key=${ADMIN_SECRET_KEY}&id=${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete order')
      }

      fetchOrders()
      fetchStats()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleEditOrder = (order: Order) => {
    setEditingOrder(order)
    setOrderForm({
      userId: order.userId,
      number: order.number,
      status: order.status,
      paymentStatus: order.paymentStatus,
      currency: order.currency,
      subtotal: order.subtotal.toString(),
      tax: order.tax.toString(),
      shipping: order.shipping.toString(),
      discount: order.discount.toString(),
      total: order.total.toString(),
      notes: order.notes || '',
      paymentProvider: order.paymentProvider || '',
      paymentIntentId: order.paymentIntentId || '',
    })
  }

  const createTestData = async () => {
    try {
      const response = await fetch('/api/admin/orders/test-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY,
        },
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create test data')
      }

      alert(data.message)
      fetchOrders()
      fetchStats()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getStatusColor = (status: string, type: 'order' | 'payment') => {
    const statuses = type === 'order' ? ORDER_STATUSES : PAYMENT_STATUSES
    return statuses.find(s => s.value === status)?.color || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string, type: 'order' | 'payment') => {
    const statuses = type === 'order' ? ORDER_STATUSES : PAYMENT_STATUSES
    return statuses.find(s => s.value === status)?.label || status
  }

  const totalPages = Math.ceil(totalOrders / perPage)

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
              <Package className="w-7 h-7 text-blue-600" />
              Orders
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage customer orders and track their status
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={createTestData}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Generate Test Data
            </Button>
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Total Orders</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Revenue</p>
                  <p className="text-lg font-semibold text-gray-900">{formatPrice(stats.totalRevenue, 'PKR')}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.statusCounts?.PENDING || 0}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-500">Shipped</p>
                  <p className="text-lg font-semibold text-gray-900">{stats.statusCounts?.SHIPPED || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search orders by number or notes..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setPage(1)
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setPage(1)
              }}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Statuses</option>
              {ORDER_STATUSES.map(status => (
                <option key={status.value} value={status.value}>{status.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {/* Orders List/Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Loading orders...</p>
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Package className="w-8 h-8 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.number}</div>
                            <div className="text-sm text-gray-500">{order.orderItems?.length || 0} items</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <User className="w-4 h-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">{order.userId.slice(0, 8)}...</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status, 'order')}`}>
                          {getStatusLabel(order.status, 'order')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                          {getStatusLabel(order.paymentStatus, 'payment')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPrice(order.total, 'PKR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setShowOrderDetails(order)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditOrder(order)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(order.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {orders.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No orders found</p>
                <p className="text-sm text-gray-400">
                  {searchQuery || selectedStatus ? 'Try adjusting your filters' : 'Create your first order to get started'}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => setShowOrderDetails(order)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Package className="w-8 h-8 text-gray-400 mr-3" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{order.number}</h3>
                      <p className="text-xs text-gray-500">{order.orderItems?.length || 0} items</p>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Status</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status, 'order')}`}>
                      {getStatusLabel(order.status, 'order')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Payment</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.paymentStatus, 'payment')}`}>
                      {getStatusLabel(order.paymentStatus, 'payment')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-sm font-medium text-gray-900">
                      {formatPrice(order.total, 'PKR')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Date</span>
                    <span className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      setShowOrderDetails(order)
                    }}
                    className="text-blue-600 hover:text-blue-900 p-1"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditOrder(order)
                    }}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteOrder(order.id)
                    }}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
            
            {orders.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No orders found</p>
                <p className="text-sm text-gray-400">
                  {searchQuery || selectedStatus ? 'Try adjusting your filters' : 'Create your first order to get started'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing {((page - 1) * perPage) + 1} to {Math.min(page * perPage, totalOrders)} of {totalOrders} orders
            </p>
            <div className="flex items-center space-x-2">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="px-3 py-2 text-sm text-gray-700">
                Page {page} of {totalPages}
              </span>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Create New Order</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID *
                    </label>
                    <input
                      type="text"
                      value={orderForm.userId}
                      onChange={(e) => setOrderForm({...orderForm, userId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={orderForm.number}
                      onChange={(e) => setOrderForm({...orderForm, number: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={orderForm.status}
                      onChange={(e) => setOrderForm({...orderForm, status: e.target.value as Order['status']})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={orderForm.paymentStatus}
                      onChange={(e) => setOrderForm({...orderForm, paymentStatus: e.target.value as Order['paymentStatus']})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {PAYMENT_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtotal (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.subtotal}
                      onChange={(e) => setOrderForm({...orderForm, subtotal: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.tax}
                      onChange={(e) => setOrderForm({...orderForm, tax: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.shipping}
                      onChange={(e) => setOrderForm({...orderForm, shipping: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.discount}
                      onChange={(e) => setOrderForm({...orderForm, discount: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.total}
                    onChange={(e) => setOrderForm({...orderForm, total: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Create Order
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Edit Order</h2>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleUpdateOrder} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      User ID *
                    </label>
                    <input
                      type="text"
                      value={orderForm.userId}
                      onChange={(e) => setOrderForm({...orderForm, userId: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Number
                    </label>
                    <input
                      type="text"
                      value={orderForm.number}
                      onChange={(e) => setOrderForm({...orderForm, number: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Order Status
                    </label>
                    <select
                      value={orderForm.status}
                      onChange={(e) => setOrderForm({...orderForm, status: e.target.value as Order['status']})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {ORDER_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Status
                    </label>
                    <select
                      value={orderForm.paymentStatus}
                      onChange={(e) => setOrderForm({...orderForm, paymentStatus: e.target.value as Order['paymentStatus']})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {PAYMENT_STATUSES.map(status => (
                        <option key={status.value} value={status.value}>{status.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subtotal (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.subtotal}
                      onChange={(e) => setOrderForm({...orderForm, subtotal: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tax (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.tax}
                      onChange={(e) => setOrderForm({...orderForm, tax: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Shipping (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.shipping}
                      onChange={(e) => setOrderForm({...orderForm, shipping: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discount (PKR)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={orderForm.discount}
                      onChange={(e) => setOrderForm({...orderForm, discount: e.target.value})}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total (PKR)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={orderForm.total}
                    onChange={(e) => setOrderForm({...orderForm, total: e.target.value})}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={orderForm.notes}
                    onChange={(e) => setOrderForm({...orderForm, notes: e.target.value})}
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setEditingOrder(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    Update Order
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {showOrderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <button
                  onClick={() => setShowOrderDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Order Information</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Order Number:</span>
                      <span className="text-sm font-medium text-gray-900">{showOrderDetails.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showOrderDetails.status, 'order')}`}>
                        {getStatusLabel(showOrderDetails.status, 'order')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Payment Status:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(showOrderDetails.paymentStatus, 'payment')}`}>
                        {getStatusLabel(showOrderDetails.paymentStatus, 'payment')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Created:</span>
                      <span className="text-sm text-gray-900">{new Date(showOrderDetails.createdAt).toLocaleString()}</span>
                    </div>
                    {showOrderDetails.placedAt && (
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Placed:</span>
                        <span className="text-sm text-gray-900">{new Date(showOrderDetails.placedAt).toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Customer Info */}
                  <h3 className="text-lg font-medium text-gray-900 mt-6">Customer</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <User className="w-5 h-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{showOrderDetails.userId}</p>
                        <p className="text-xs text-gray-500">User ID</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Financial Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Financial Details</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Subtotal:</span>
                      <span className="text-sm text-gray-900">{formatPrice(showOrderDetails.subtotal, 'PKR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Tax:</span>
                      <span className="text-sm text-gray-900">{formatPrice(showOrderDetails.tax, 'PKR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Shipping:</span>
                      <span className="text-sm text-gray-900">{formatPrice(showOrderDetails.shipping, 'PKR')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Discount:</span>
                      <span className="text-sm text-gray-900">-{formatPrice(showOrderDetails.discount, 'PKR')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-base font-medium text-gray-900">Total:</span>
                      <span className="text-base font-medium text-gray-900">{formatPrice(showOrderDetails.total, 'PKR')}</span>
                    </div>
                  </div>

                  {/* Payment Info */}
                  {showOrderDetails.paymentProvider && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Payment Information</h4>
                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Provider:</span>
                          <span className="text-sm text-gray-900">{showOrderDetails.paymentProvider}</span>
                        </div>
                        {showOrderDetails.paymentIntentId && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Intent ID:</span>
                            <span className="text-sm text-gray-900 font-mono">{showOrderDetails.paymentIntentId}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Order Items */}
                {showOrderDetails.orderItems && showOrderDetails.orderItems.length > 0 && (
                  <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Order Items ({showOrderDetails.orderItems.length})</h3>
                    <div className="bg-gray-50 rounded-lg overflow-hidden">
                      <div className="divide-y divide-gray-200">
                        {showOrderDetails.orderItems.map((item) => (
                          <div key={item.id} className="p-4 flex items-center space-x-4">
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                              {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover rounded-lg" />
                              ) : (
                                <ShoppingBag className="w-6 h-6 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                              <p className="text-xs text-gray-500">SKU: {item.sku}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-900">Qty: {item.quantity}</p>
                              <p className="text-sm font-medium text-gray-900">{formatPrice(item.unitPrice, 'PKR')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Notes */}
                {showOrderDetails.notes && (
                  <div className="lg:col-span-2 space-y-2">
                    <h3 className="text-lg font-medium text-gray-900">Notes</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{showOrderDetails.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}