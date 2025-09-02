"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
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
  MapPin,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  User,
  Star
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { AdminLayout } from "@/components/admin/admin-layout"
import { formatPrice } from "@/lib/currency"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "evelon2024"

interface Customer {
  id: string
  userId: string
  email?: string
  emailConfirmedAt?: string
  phone?: string
  phoneConfirmedAt?: string
  displayName?: string
  avatarUrl?: string
  isAdmin: boolean
  createdAt: string
  updatedAt: string
  lastSignInAt?: string
  authProvider?: string
  userMetadata?: any
  orderCount: number
  totalSpent: number
  addressCount: number
  cartCount: number
  wishlistCount: number
  addresses?: CustomerAddress[]
  orders?: CustomerOrder[]
  carts?: CustomerCart[]
  wishlists?: CustomerWishlist[]
}

interface CustomerAddress {
  id: string
  userId: string
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

interface CustomerOrder {
  id: string
  number: string
  status: string
  paymentStatus: string
  total: number
  currency: string
  createdAt: string
  placedAt?: string
}

interface CustomerCart {
  id: string
  isActive: boolean
  createdAt: string
}

interface CustomerWishlist {
  id: string
  createdAt: string
}

export default function CustomersManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [loading, setLoading] = useState({
    initial: false,
    saving: false,
    deleting: '',
    fetching: ''
  })

  // Check authentication on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const key = urlParams.get('key')
    const envKey = ADMIN_SECRET_KEY
    const stored = typeof window !== 'undefined' ? window.sessionStorage.getItem('ADMIN_KEY') : null

    if (key && envKey && key === envKey) {
      window.sessionStorage.setItem('ADMIN_KEY', key)
      setIsAuthenticated(true)
      return
    }
    if (stored && envKey && stored === envKey) {
      setIsAuthenticated(true)
      return
    }
    window.location.href = '/admin/access-denied'
  }, [])

  // Load customers
  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, initial: true }))
      try {
        const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
        
        // Fetch customers - API returns paginated format
        const customersRes = await fetch('/api/admin/customers', {
          headers: adminKey ? { 'x-admin-key': adminKey } : {},
        })
        if (customersRes.ok) {
          const customersData = await customersRes.json()
          setCustomers(customersData.items || customersData) // Handle both formats
        }
      } catch (e) {
        console.error('Error fetching data:', e)
      } finally {
        setLoading(prev => ({ ...prev, initial: false }))
      }
    }
    
    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated])

  // Filter customers based on search
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = 
      customer.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.userId.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Handle customer edit
  const handleEdit = async (customer: Customer) => {
    setLoading(prev => ({ ...prev, fetching: customer.id }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      const res = await fetch(`/api/admin/customers/${customer.id}`, {
        headers: adminKey ? { 'x-admin-key': adminKey } : {}
      })
      if (res.ok) {
        const full = await res.json()
        setEditingCustomer(full)
      } else {
        setEditingCustomer({ ...customer })
      }
    } catch {
      setEditingCustomer({ ...customer })
    } finally {
      setLoading(prev => ({ ...prev, fetching: '' }))
      setShowAddForm(true)
    }
  }

  const handleView = (customer: Customer) => {
    // Since we don't have a public customer page, just edit
    handleEdit(customer)
  }

  // Handle customer save
  const handleSave = async (customerData: any) => {
    setLoading(prev => ({ ...prev, saving: true }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      
      console.log('Saving customer data:', customerData)
      
      if (editingCustomer) {
        const res = await fetch(`/api/admin/customers/${editingCustomer.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify({ id: editingCustomer.id, ...customerData }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Update failed')
        }
      } else {
        const res = await fetch('/api/admin/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify(customerData),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Create failed')
        }
      }
      
      // Refresh customers
      const refreshed = await fetch('/api/admin/customers', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setCustomers(refreshedData.items || refreshedData)
      setEditingCustomer(null)
      setShowAddForm(false)
      
      alert(editingCustomer ? 'Customer updated successfully!' : 'Customer created successfully!')
    } catch (e: any) {
      console.error('Save error:', e)
      alert(`Save failed: ${e.message}`)
    } finally {
      setLoading(prev => ({ ...prev, saving: false }))
    }
  }

  // Handle customer delete
  const handleDelete = async (customerId: string) => {
    if (!confirm('Delete this customer? This action cannot be undone and will also delete all related data (addresses, orders, etc.).')) return
    setLoading(prev => ({ ...prev, deleting: customerId }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      const res = await fetch(`/api/admin/customers/${customerId}`, { 
        method: 'DELETE', 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      if (!res.ok) throw new Error('Delete failed')
      
      // Refresh customers
      const refreshed = await fetch('/api/admin/customers', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setCustomers(refreshedData.items || refreshedData)
      alert('Customer deleted successfully!')
    } catch (e) {
      console.error(e)
      alert('Delete failed')
    } finally {
      setLoading(prev => ({ ...prev, deleting: '' }))
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">Invalid or missing admin key</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Customer Management" subtitle="Manage your store's customers and their data">
      {/* Loading Overlay for Initial Load */}
      {loading.initial && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Loading customers...</p>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customers ({filteredCustomers.length})</h2>
            <p className="text-sm text-gray-600">Total: {customers.length} customers</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading.saving}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

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

      {/* Customers Display */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Customers ({filteredCustomers.length})
          </h2>
          <div className="text-sm text-gray-600">
            Total: {customers.length} customers
          </div>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCustomers.map((customer) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Customer Avatar/Info */}
                <div className="relative h-32 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {customer.avatarUrl ? (
                    <img
                      src={customer.avatarUrl}
                      alt={customer.displayName || 'Customer'}
                      className="w-16 h-16 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full border-4 border-white bg-white flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Admin Badge */}
                  {customer.isAdmin && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                        <Shield className="w-3 h-3 inline mr-1" />
                        ADMIN
                      </span>
                    </div>
                  )}
                </div>

                {/* Customer Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {customer.displayName || customer.email?.split('@')[0] || 'No Name'}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">{customer.email}</p>
                    {customer.phone && (
                      <p className="text-gray-600 text-sm flex items-center mb-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {customer.phone}
                      </p>
                    )}
                    {customer.lastSignInAt && (
                      <p className="text-gray-500 text-xs">
                        Last login: {new Date(customer.lastSignInAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Customer Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">{customer.orderCount}</div>
                      <div className="text-xs text-gray-500">Orders</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-lg font-semibold text-green-600">
                        {formatPrice(customer.totalSpent, 'PKR')}
                      </div>
                      <div className="text-xs text-gray-500">Spent</div>
                    </div>
                  </div>

                  {/* Additional Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{customer.addressCount} addresses</span>
                    <span>Joined {new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEdit(customer)}
                      disabled={loading.fetching === customer.id || loading.deleting === customer.id}
                    >
                      {loading.fetching === customer.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-1" />
                      ) : (
                        <Edit className="w-3 h-3 mr-1" />
                      )}
                      {loading.fetching === customer.id ? 'Loading...' : 'Edit'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(customer.id)}
                      disabled={loading.deleting === customer.id || loading.fetching === customer.id}
                    >
                      {loading.deleting === customer.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
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
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
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
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 mr-3">
                            {customer.avatarUrl ? (
                              <img
                                src={customer.avatarUrl}
                                alt={customer.displayName || 'Customer'}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <User className="w-5 h-5" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {customer.displayName || customer.email?.split('@')[0] || 'No Name'}
                            </div>
                            <div className="text-sm text-gray-500">{customer.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.phone || 'No phone'}</div>
                        <div className="text-sm text-gray-500">{customer.addressCount} addresses</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{customer.orderCount}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatPrice(customer.totalSpent, 'PKR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {customer.isAdmin && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              Admin
                            </span>
                          )}
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Active
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleEdit(customer)}
                            disabled={loading.fetching === customer.id || loading.deleting === customer.id}
                          >
                            {loading.fetching === customer.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-1" />
                            ) : (
                              <Edit className="w-3 h-3 mr-1" />
                            )}
                            {loading.fetching === customer.id ? 'Loading...' : 'Edit'}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:text-red-700" 
                            onClick={() => handleDelete(customer.id)}
                            disabled={loading.deleting === customer.id || loading.fetching === customer.id}
                          >
                            {loading.deleting === customer.id ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-2 border-red-600 border-t-transparent" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
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

      {/* Customer Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingCustomer(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <InlineCustomerForm
                customer={editingCustomer}
                onSave={handleSave}
                onCancel={() => {
                  setShowAddForm(false)
                  setEditingCustomer(null)
                }}
                isLoading={loading.saving}
              />
            </div>
          </div>
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Customers are managed through their profiles and related data.</p>
        <p className="mt-1">Deleting a customer will also remove all their addresses, orders, carts, and wishlists.</p>
      </div>
    </AdminLayout>
  )
}

// Customer Form Component
function InlineCustomerForm({ 
  customer, 
  onSave, 
  onCancel,
  isLoading = false
}: { 
  customer: Customer | null
  onSave: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}) {
  const [formData, setFormData] = useState({
    userId: customer?.userId || '',
    email: customer?.email || '',
    displayName: customer?.displayName || '',
    avatarUrl: customer?.avatarUrl || '',
    phone: customer?.phone || '',
    isAdmin: customer?.isAdmin ?? false,
  })

  // Sync when switching between customers to edit
  useEffect(() => {
    setFormData({
      userId: customer?.userId || '',
      email: customer?.email || '',
      displayName: customer?.displayName || '',
      avatarUrl: customer?.avatarUrl || '',
      phone: customer?.phone || '',
      isAdmin: customer?.isAdmin ?? false,
    })
  }, [customer])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Schema Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Customer Profile Information:</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Profile:</strong> Basic customer information and admin status</p>
          <p><strong>Related Data:</strong> Addresses, orders, carts, and wishlists are linked via userId</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Customer Basic Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Customer Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@example.com"
                disabled={!!customer} // Don't allow changing email for existing customers in this simple form
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleChange('displayName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1234567890"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => handleChange('avatarUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Admin Status */}
          <div className="mt-6">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isAdmin}
                onChange={(e) => handleChange('isAdmin', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Administrator Access
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Admin users have access to the admin panel and management features
            </p>
          </div>
        </div>

        {/* Customer Stats (Read-only for existing customers) */}
        {customer && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-6">
              <Star className="w-5 h-5 mr-2 text-green-600" />
              Customer Statistics
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{customer.orderCount}</div>
                <div className="text-sm text-gray-500">Orders</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-green-600">
                  {formatPrice(customer.totalSpent, 'PKR')}
                </div>
                <div className="text-sm text-gray-500">Total Spent</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{customer.addressCount}</div>
                <div className="text-sm text-gray-500">Addresses</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-semibold text-gray-900">{customer.wishlistCount}</div>
                <div className="text-sm text-gray-500">Wishlists</div>
              </div>
            </div>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="bg-blue-600 hover:bg-blue-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isLoading 
              ? (customer ? 'Updating...' : 'Creating...') 
              : (customer ? 'Update Customer' : 'Create Customer')
            }
          </Button>
        </div>
      </form>
    </div>
  )
}