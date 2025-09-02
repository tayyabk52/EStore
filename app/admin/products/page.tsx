"use client"

import { useState, useEffect, useId } from "react"
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
  Tag,
  ShoppingBag,
  Users,
  Star,
  Crown,
  ImageIcon,
  DollarSign,
  Hash,
  Calendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { SmartImage } from "@/components/ui/smart-image"
import { ImageUpload } from "@/components/ui/image-upload"
import { FALLBACK_IMAGES } from "@/lib/image-utils"
import { AdminLayout } from "@/components/admin/admin-layout"
import { formatPriceRange, getDefaultCurrency, getAllCurrencies } from "@/lib/currency"
import Link from "next/link"
import type { Category as FrontCategory } from '@/lib/products-frontend'
// Local admin type for Collection
interface AdminCollection { id: string; name: string; slug: string }

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "evelon2024"

interface Product {
  id: string
  title: string
  slug: string
  description: string
  shortDescription: string
  brand: string
  categoryId: string
  currency: string
  isActive: boolean
  isBestseller: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isOnSale: boolean
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  status: string
  createdAt: string
  updatedAt: string
  category?: {
    name: string
    displayName: string
  }
  variants?: ProductVariant[]
  images?: ProductImage[]
}

interface ProductVariant {
  id: string
  sku: string
  title: string
  price: number
  compareAtPrice: number | null
  currency: string
  stock: number
  isDefault: boolean
  attributes: Record<string, any>
  barcode: string | null
}

interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  sortOrder: number
}

interface Category {
  id: string
  name: string
  displayName: string
  parentId?: string
}

export default function ProductsManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [collections, setCollections] = useState<AdminCollection[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [loading, setLoading] = useState({
    initial: false,
    saving: false,
    deleting: '',
    fetching: ''
  })

  // Build a breadcrumb-like path for categories to avoid ambiguity (e.g., "Men's Clothing / Shirts / Tees")
  const categoryIdToCategory = new Map<string, (Category & { parentId?: string }) | FrontCategory>()
  categories.forEach((c) => categoryIdToCategory.set(c.id, c))
  const getCategoryPath = (cat: Category): string => {
    const parts: string[] = []
    let current: (Category & { parentId?: string }) | FrontCategory | undefined = cat as any
    // climb using Category.parentId if present in the fetched list
    while (current) {
      parts.unshift(current.displayName || current.name)
      const parentCat = (current as any).parentId ? categoryIdToCategory.get((current as any).parentId as string) : undefined
      current = parentCat
    }
    return parts.join(' / ')
  }
  const categoriesWithPath = categories
    .map((c) => ({ ...c, pathLabel: getCategoryPath(c) }))
    .sort((a, b) => a.pathLabel.localeCompare(b.pathLabel))

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

  // Load products and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(prev => ({ ...prev, initial: true }))
      try {
        const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
        
        // Fetch products - API now returns paginated format
        const productsRes = await fetch('/api/admin/products', {
          headers: adminKey ? { 'x-admin-key': adminKey } : {},
        })
        if (productsRes.ok) {
          const productsData = await productsRes.json()
          setProducts(productsData.items || productsData) // Handle both formats
        }

        // Fetch categories
        const categoriesRes = await fetch('/api/admin/categories', {
          headers: adminKey ? { 'x-admin-key': adminKey } : {},
        })
        if (categoriesRes.ok) {
          const categoriesData = await categoriesRes.json()
          setCategories(categoriesData)
        }

        // Fetch collections
        const collectionsRes = await fetch('/api/admin/collections', {
          headers: adminKey ? { 'x-admin-key': adminKey } : {},
        })
        if (collectionsRes.ok) {
          const data = await collectionsRes.json()
          setCollections((data.collections || []).map((c: any) => ({ id: c.id, name: c.name, slug: c.slug })))
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

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || product.categoryId === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Handle product edit
  const handleEdit = async (product: Product) => {
    setLoading(prev => ({ ...prev, fetching: product.id }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      const res = await fetch(`/api/admin/products/${product.id}`, {
        headers: adminKey ? { 'x-admin-key': adminKey } : {}
      })
      if (res.ok) {
        const full = await res.json()
        setEditingProduct(full)
      } else {
        setEditingProduct({ ...product })
      }
    } catch {
      setEditingProduct({ ...product })
    } finally {
      setLoading(prev => ({ ...prev, fetching: '' }))
      setShowAddForm(true)
    }
  }

  const handleView = (product: Product) => {
    const slug = product.slug || ''
    window.open(slug ? `/products/${slug}` : '/products', '_blank')
  }

  // Handle product save
  const handleSave = async (productData: any) => {
    setLoading(prev => ({ ...prev, saving: true }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      
      console.log('Saving product data:', productData)
      
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify({ id: editingProduct.id, ...productData }),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Update failed')
        }
      } else {
        const res = await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify(productData),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Create failed')
        }
      }
      
      // Refresh products
      const refreshed = await fetch('/api/admin/products', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setProducts(refreshedData.items || refreshedData)
      setEditingProduct(null)
      setShowAddForm(false)
      
      alert(editingProduct ? 'Product updated successfully!' : 'Product created successfully!')
    } catch (e: any) {
      console.error('Save error:', e)
      alert(`Save failed: ${e.message}`)
    } finally {
      setLoading(prev => ({ ...prev, saving: false }))
    }
  }

  // Handle product delete
  const handleDelete = async (productId: string) => {
    if (!confirm('Delete this product? This action cannot be undone.')) return
    setLoading(prev => ({ ...prev, deleting: productId }))
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      const res = await fetch(`/api/admin/products/${productId}`, { 
        method: 'DELETE', 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      if (!res.ok) throw new Error('Delete failed')
      
      // Refresh products
      const refreshed = await fetch('/api/admin/products', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setProducts(refreshedData.items || refreshedData)
      alert('Product deleted successfully!')
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
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">Invalid or missing admin key</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Product Management" subtitle="Manage your store's products and inventory">
      {/* Loading Overlay for Initial Load */}
      {loading.initial && (
        <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-40">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Package className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Products ({filteredProducts.length})</h2>
            <p className="text-sm text-gray-600">Total: {products.length} products</p>
          </div>
        </div>
        
        <Button 
          onClick={() => setShowAddForm(true)} 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={loading.saving}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
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
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {categoriesWithPath.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.pathLabel}
                  </option>
                ))}
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
        </div>

        {/* Products Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Products ({filteredProducts.length})
            </h2>
            <div className="text-sm text-gray-600">
              Total: {products.length} products
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    {product.images?.[0]?.url ? (
                      <SmartImage
                        src={product.images[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover"
                        fallbackSrc={FALLBACK_IMAGES.grid}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Package className="w-16 h-16" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 space-y-1">
                      {product.isFeatured && (
                        <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                          <Star className="w-3 h-3 inline mr-1" />
                          FEATURED
                        </span>
                      )}
                      {product.isNewArrival && (
                        <span className="inline-block px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                          NEW
                        </span>
                      )}
                      {product.isOnSale && (
                        <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          SALE
                        </span>
                      )}
                      {!product.isActive && (
                        <span className="inline-block px-2 py-1 bg-gray-500 text-white text-xs font-bold rounded">
                          INACTIVE
                        </span>
                      )}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute bottom-3 left-3">
                      <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                        {product.category?.displayName || 'Uncategorized'}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{product.shortDescription}</p>
                      
                      {/* Product Stats */}
                      <div className="flex items-center justify-between text-sm mb-3">
                        <span className="text-gray-500">{product.brand}</span>
                        <span className="text-gray-500">{product.variants?.length || 0} variants</span>
                      </div>

                      {/* Price Range */}
                      {product.variants && product.variants.length > 0 && (
                        <div className="text-sm">
                          <span className="text-gray-500">Price: </span>
                          <span className="font-semibold text-green-600">
                            {formatPriceRange(
                              Math.min(...product.variants.map(v => Number(v.price) || 0)),
                              Math.max(...product.variants.map(v => Number(v.price) || 0)),
                              product.currency
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(product)}
                        disabled={loading.fetching === product.id || loading.deleting === product.id}
                      >
                        {loading.fetching === product.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-1" />
                        ) : (
                          <Edit className="w-3 h-3 mr-1" />
                        )}
                        {loading.fetching === product.id ? 'Loading...' : 'Edit'}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleView(product)}
                        disabled={loading.fetching === product.id || loading.deleting === product.id}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                        disabled={loading.deleting === product.id || loading.fetching === product.id}
                      >
                        {loading.deleting === product.id ? (
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
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
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
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 mr-3">
                              {product.images?.[0]?.url ? (
                                <SmartImage
                                  src={product.images[0].url}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  fallbackSrc={FALLBACK_IMAGES.grid}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <Package className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{product.title}</div>
                              <div className="text-sm text-gray-500">{product.shortDescription}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.category?.displayName || 'Uncategorized'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{product.brand}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {product.isFeatured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                            {product.isNewArrival && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                New
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(product)}
                              disabled={loading.fetching === product.id || loading.deleting === product.id}
                            >
                              {loading.fetching === product.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent mr-1" />
                              ) : (
                                <Edit className="w-3 h-3 mr-1" />
                              )}
                              {loading.fetching === product.id ? 'Loading...' : 'Edit'}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleView(product)}
                              disabled={loading.fetching === product.id || loading.deleting === product.id}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600 hover:text-red-700" 
                              onClick={() => handleDelete(product.id)}
                              disabled={loading.deleting === product.id || loading.fetching === product.id}
                            >
                              {loading.deleting === product.id ? (
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

        {/* Product Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingProduct(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <InlineProductForm
                  product={editingProduct}
                  categories={categories}
                  collections={collections}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowAddForm(false)
                    setEditingProduct(null)
                  }}
                  isLoading={loading.saving}
                />
              </div>
            </div>
          </div>
        )}

      {/* Footer Note */}
      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Products can have multiple variants (sizes, colors, etc.) and images.</p>
        <p className="mt-1">Set featured, new arrival, and sale flags to highlight products on your store.</p>
      </div>
    </AdminLayout>
  )
}

// Simplified Product Form - Schema-Aligned
function InlineProductForm({ 
  product, 
  categories, 
  collections,
  onSave, 
  onCancel,
  isLoading = false
}: { 
  product: Product | null
  categories: Category[]
  collections: { id: string; name: string; slug: string }[]
  onSave: (data: any) => void
  onCancel: () => void
  isLoading?: boolean
}) {
  function InfoTip({ text }: { text: string }) {
    return (
      <span
        title={text}
        className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-200 text-gray-700 text-[10px] leading-none cursor-help align-middle"
      >
        ?
      </span>
    )
  }
  const [detailsText, setDetailsText] = useState(
    JSON.stringify(((product as any)?.details ?? {}), null, 2)
  )
  const newProductId = useId()
  // Collections state
  const [selectedCollections, setSelectedCollections] = useState<string[]>(
    (product as any)?.collectionIds || []
  )
  const [collectionSortOrders, setCollectionSortOrders] = useState<Record<string, number>>(() => {
    const ids: string[] = (product as any)?.collectionIds || []
    const orders: number[] = (product as any)?.collectionSortOrders || []
    const map: Record<string, number> = {}
    ids.forEach((id, idx) => { map[id] = typeof orders[idx] === 'number' ? orders[idx] : 0 })
    return map
  })
  // Build breadcrumb labels for category selector to avoid ambiguity
  const idToCategoryInForm = new Map<string, Category>()
  categories.forEach((c) => idToCategoryInForm.set(c.id, c))
  const buildCategoryPathLabel = (cat: Category): string => {
    const parts: string[] = []
    let current: Category | undefined = cat
    while (current) {
      parts.unshift(current.displayName || current.name)
      current = current.parentId ? idToCategoryInForm.get(current.parentId) : undefined
    }
    return parts.join(' / ')
  }
  const categoryOptionsWithPath = categories
    .map((c) => ({ ...c, pathLabel: buildCategoryPathLabel(c) }))
    .sort((a, b) => (a as any).pathLabel.localeCompare((b as any).pathLabel))
  const [formData, setFormData] = useState({
    // Product Basic Info (Master Record)
    title: product?.title || '',
    slug: product?.slug || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    brand: product?.brand || '',
    categoryId: product?.categoryId || '',
    currency: product?.currency || getDefaultCurrency(),
    status: product?.status || 'PUBLISHED',
    
    // Product Flags
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isBestseller: product?.isBestseller ?? false,
    isOnSale: product?.isOnSale ?? false,
    
    // SEO Fields
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    metaKeywords: product?.metaKeywords || '',
  })

  const [variants, setVariants] = useState(
    (product?.variants && product.variants.length > 0)
      ? product.variants.map(v => ({
          sku: v.sku || '',
          title: v.title || '',
          price: Number(v.price || 0),
          compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : null,
          currency: v.currency || getDefaultCurrency(),
          stock: Number(v.stock || 0),
          isDefault: !!v.isDefault,
          attributes: v.attributes || {},
          barcode: v.barcode || '',
          weightGrams: (v as any).weightGrams ?? null,
        }))
      : [
          {
            sku: '',
            title: 'Default',
            price: 0,
            compareAtPrice: null,
            currency: getDefaultCurrency(),
            stock: 0,
            isDefault: true,
            attributes: {},
            barcode: '',
            weightGrams: null,
          }
        ]
  )

  const [images, setImages] = useState(
    (product?.images && product.images.length > 0)
      ? product.images
          .slice()
          .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          .map(img => ({
            url: img.url || '',
            alt: img.alt || '',
            isPrimary: !!img.isPrimary,
            sortOrder: img.sortOrder ?? 0,
          }))
      : [
          {
            url: '',
            alt: '',
            isPrimary: true,
            sortOrder: 0
          }
        ]
  )

  // AI Generation State
  const [isAIGenerating, setIsAIGenerating] = useState(false)

  // Sync when switching between products to edit
  useEffect(() => {
    setFormData({
      title: product?.title || '',
      slug: product?.slug || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      brand: product?.brand || '',
      categoryId: product?.categoryId || '',
      currency: product?.currency || getDefaultCurrency(),
      status: product?.status || 'PUBLISHED',
      isActive: product?.isActive ?? true,
      isFeatured: product?.isFeatured ?? false,
      isNewArrival: product?.isNewArrival ?? false,
      isBestseller: product?.isBestseller ?? false,
      isOnSale: product?.isOnSale ?? false,
      metaTitle: product?.metaTitle || '',
      metaDescription: product?.metaDescription || '',
      metaKeywords: product?.metaKeywords || '',
    })

    setVariants(
      (product?.variants && product.variants.length > 0)
        ? product.variants.map(v => ({
            sku: v.sku || '',
            title: v.title || '',
            price: Number(v.price || 0),
            compareAtPrice: v.compareAtPrice != null ? Number(v.compareAtPrice) : null,
            currency: v.currency || getDefaultCurrency(),
            stock: Number(v.stock || 0),
            isDefault: !!v.isDefault,
            attributes: v.attributes || {},
            barcode: v.barcode || '',
            weightGrams: (v as any).weightGrams ?? null,
          }))
        : [
            {
              sku: '',
              title: 'Default',
              price: 0,
              compareAtPrice: null,
              currency: getDefaultCurrency(),
              stock: 0,
              isDefault: true,
              attributes: {},
              barcode: '',
              weightGrams: null,
            }
          ]
    )

    setImages(
      (product?.images && product.images.length > 0)
        ? product.images
            .slice()
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
            .map(img => ({
              url: img.url || '',
              alt: img.alt || '',
              isPrimary: !!img.isPrimary,
              sortOrder: img.sortOrder ?? 0,
            }))
        : [
            {
              url: '',
              alt: '',
              isPrimary: true,
              sortOrder: 0
            }
          ]
    )

    // Sync collections
    setSelectedCollections((product as any)?.collectionIds || [])
    const ids: string[] = (product as any)?.collectionIds || []
    const orders: number[] = (product as any)?.collectionSortOrders || []
    const map: Record<string, number> = {}
    ids.forEach((id, idx) => { map[id] = typeof orders[idx] === 'number' ? orders[idx] : 0 })
    setCollectionSortOrders(map)
  }, [product])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate slug if not provided
    if (!formData.slug && formData.title) {
      formData.slug = formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    
    const productData = {
      ...formData,
      variants: variants.filter(v => v.sku && v.price > 0),
      images: images.filter(img => img.url),
      collectionIds: selectedCollections,
      collectionSortOrders: selectedCollections.map(id => collectionSortOrders[id] ?? 0)
    }
    
    onSave(productData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // AI Generation Function
  const handleAIGenerate = async () => {
    const mainImageUrl = images.find(img => img.isPrimary)?.url || images[0]?.url
    if (!mainImageUrl) {
      alert('Please upload a main image first to generate product details with AI.')
      return
    }

    console.log('AI Generate called with image:', mainImageUrl)
    setIsAIGenerating(true)
    
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      console.log('Using admin key:', !!adminKey)
      
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': adminKey
        },
        body: JSON.stringify({ 
          imageUrl: mainImageUrl,
          context: { 
            title: formData.title, 
            brand: formData.brand,
            categoryId: formData.categoryId 
          }
        })
      })

      console.log('AI Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.log('AI Error response:', errorText)
        
        let errorData
        try {
          errorData = JSON.parse(errorText)
        } catch {
          errorData = { error: errorText }
        }
        
        if (response.status === 429 || (errorData.details && errorData.details.includes('429'))) {
          throw new Error('API quota exceeded. Please wait a few minutes and try again, or consider upgrading your Gemini API plan.')
        } else if (response.status === 401) {
          throw new Error('API authentication failed. Please check your Gemini API key.')
        } else {
          throw new Error(errorData.error || 'AI generation failed')
        }
      }

      const aiData = await response.json()
      
      // Update form data with AI generated content
      setFormData(prev => ({
        ...prev,
        title: aiData.name || prev.title,
        description: aiData.description || prev.description,
        shortDescription: aiData.shortDescription || prev.shortDescription,
        brand: aiData.brand || prev.brand,
        categoryId: aiData.category || prev.categoryId,
        metaTitle: aiData.metaTitle || prev.metaTitle,
        metaDescription: aiData.metaDescription || prev.metaDescription,
        metaKeywords: aiData.metaKeywords || prev.metaKeywords,
        isActive: typeof aiData.isActive === 'boolean' ? aiData.isActive : prev.isActive,
        isFeatured: typeof aiData.isFeatured === 'boolean' ? aiData.isFeatured : prev.isFeatured,
        isNewArrival: typeof aiData.isNewArrival === 'boolean' ? aiData.isNewArrival : prev.isNewArrival,
        isBestseller: typeof aiData.isBestseller === 'boolean' ? aiData.isBestseller : prev.isBestseller,
        isOnSale: typeof aiData.isOnSale === 'boolean' ? aiData.isOnSale : prev.isOnSale
      }))

      // Update variants with AI data
      if (aiData.price || aiData.sku || aiData.stock) {
        setVariants(prev => {
          const updated = [...prev]
          if (updated[0]) {
            updated[0] = {
              ...updated[0],
              price: aiData.price || updated[0].price,
              sku: aiData.sku || updated[0].sku,
              stock: aiData.stock || updated[0].stock,
              weightGrams: aiData.weight ? aiData.weight * 1000 : updated[0].weightGrams,
              barcode: aiData.barcode || updated[0].barcode
            }
          }
          return updated
        })
      }

      // Update images with AI data
      if (Array.isArray(aiData.images) && aiData.images.length > 0) {
        setImages(() => {
          const aiImages = aiData.images.map((url: string, index: number) => ({
            url,
            alt: aiData.name || `Product image ${index + 1}`,
            isPrimary: index === 0,
            sortOrder: index
          }))
          return aiImages
        })
      }

      alert('AI has successfully generated product details! Please review and modify as needed before saving.')
      
    } catch (error) {
      console.error('AI generation error:', error)
      
      // Check if it's a quota error and offer fallback
      if (error instanceof Error && error.message.includes('quota exceeded')) {
        const useBasicGeneration = confirm(
          'AI quota exceeded. Would you like to use basic auto-generation instead? ' +
          'This will create basic product fields based on the image filename and common patterns.'
        )
        
        if (useBasicGeneration) {
          // Basic fallback generation
          const imageName = images.find(img => img.isPrimary)?.url?.split('/').pop()?.split('.')[0] || 'product'
          const basicName = imageName.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
          
          setFormData(prev => ({
            ...prev,
            title: prev.title || basicName,
            description: prev.description || `High-quality ${basicName.toLowerCase()} with excellent craftsmanship and attention to detail.`,
            shortDescription: prev.shortDescription || `Premium ${basicName.toLowerCase()} for discerning customers.`,
            metaTitle: prev.metaTitle || `${basicName} | Premium Quality`,
            metaDescription: prev.metaDescription || `Shop premium ${basicName.toLowerCase()} with fast shipping and excellent customer service.`,
            isActive: true,
            isNewArrival: true
          }))
          
          // Update first variant with basic data
          setVariants(prev => {
            const updated = [...prev]
            if (updated[0]) {
              updated[0] = {
                ...updated[0],
                price: updated[0].price || 50,
                sku: updated[0].sku || `SKU-${Date.now()}`,
                stock: updated[0].stock || 10
              }
            }
            return updated
          })
          
          alert('Basic product details generated! Please review and customize as needed.')
        }
      } else {
        alert(`Failed to generate product details: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    } finally {
      setIsAIGenerating(false)
    }
  }

  const addVariant = () => {
    setVariants([...variants, {
      sku: '',
      title: '',
      price: 0,
      compareAtPrice: null,
      currency: getDefaultCurrency(),
      stock: 0,
      isDefault: false,
      attributes: {},
      barcode: '',
      weightGrams: null,
    }])
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const addImage = () => {
    setImages([...images, {
      url: '',
      alt: '',
      isPrimary: false,
      sortOrder: images.length
    }])
  }

  const updateImage = (index: number, field: string, value: any) => {
    const updated = [...images]
    updated[index] = { ...updated[index], [field]: value }
    setImages(updated)
  }

  const removeImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const setPrimaryImage = (index: number) => {
    const updated = images.map((img, i) => ({ ...img, isPrimary: i === index }))
    setImages(updated)
  }

  return (
    <div className="space-y-8">
      {/* Schema Explanation */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">How This Works:</h4>
        <div className="text-xs text-blue-700 space-y-1">
          <p><strong>Product:</strong> Basic info (name, description, category)</p>
          <p><strong>Variants:</strong> Actual items customers buy (price, SKU, stock, size/color)</p>
          <p><strong>Images:</strong> Photos of the product (first image is primary)</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* 1. PRODUCT BASIC INFO */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Package className="w-5 h-5 mr-2 text-blue-600" />
              1. Product Information
            </h3>
            <Button
              type="button"
              onClick={handleAIGenerate}
              disabled={isAIGenerating || (!images.find(img => img.isPrimary)?.url && !images[0]?.url)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
              size="sm"
            >
              <Star className="w-4 h-4 mr-2" />
              {isAIGenerating ? 'Generating...' : 'Generate via AI'}
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
                <InfoTip text={"Name of product customer see. Example: Classic Cotton T-Shirt"} />
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Classic Cotton T-Shirt"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
                <InfoTip text={"Lowercase URL part. Example: classic-cotton-t-shirt"} />
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="auto-generated from name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
                <InfoTip text={"Producer or label. Example: Evelon"} />
              </label>
              <input
                type="text"
                value={formData.brand}
                onChange={(e) => handleChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Evelon"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Short Description
                <InfoTip text={"Small summary line. Example: Soft cotton tee for everyday"} />
              </label>
              <input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleChange('shortDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief summary shown in listings"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
                <InfoTip text={"Choose where product belongs. Example: Men > Clothing"} />
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Category</option>
                {categoryOptionsWithPath.map((cat) => (
                  <option key={cat.id} value={cat.id}>{(cat as any).pathLabel}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Collections */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Collections</h4>
            {collections.length === 0 ? (
              <p className="text-sm text-gray-500">No collections yet. Create one in Admin → Collections.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {collections.map((c) => {
                  const checked = selectedCollections.includes(c.id)
                  return (
                    <label key={c.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const isOn = e.target.checked
                          setSelectedCollections(prev => {
                            if (isOn) return Array.from(new Set([...prev, c.id]))
                            return prev.filter(id => id !== c.id)
                          })
                        }}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{c.name}</div>
                            <div className="text-xs text-gray-500">/{c.slug}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sort</span>
                            <input
                              type="number"
                              value={collectionSortOrders[c.id] ?? 0}
                              onChange={(e) => setCollectionSortOrders(prev => ({ ...prev, [c.id]: parseInt(e.target.value) || 0 }))}
                              className="w-20 px-2 py-1 border rounded"
                              disabled={!checked}
                            />
                          </div>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            )}
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
              <InfoTip text={"Long text to explain product. Example: Fabric, fit, care info"} />
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Detailed product description..."
            />
          </div>

            {/* SEO Fields */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">SEO</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                    <InfoTip text={"Browser/page title. Example: Buy Classic Cotton T-Shirt | Evelon"} />
                  </label>
                  <input
                    type="text"
                    value={formData.metaTitle}
                    onChange={(e) => handleChange('metaTitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Custom page title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Keywords
                    <InfoTip text={"Comma separate keywords. Example: t-shirt, cotton, men"} />
                  </label>
                  <input
                    type="text"
                    value={formData.metaKeywords}
                    onChange={(e) => handleChange('metaKeywords', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="keyword1, keyword2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                    <InfoTip text={"Short SEO description. Example: Soft classic tee made from 100% cotton"} />
                  </label>
                  <textarea
                    value={formData.metaDescription}
                    onChange={(e) => handleChange('metaDescription', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Short description for search engines"
                  />
                </div>
              </div>
            </div>

            {/* Advanced */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Advanced</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                    <InfoTip text={"Choose the currency for this product. Example: PKR, USD, EUR"} />
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => handleChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {getAllCurrencies().map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code} ({currency.symbol}) - {currency.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Details (JSON)
                    <InfoTip text={"Extra info as JSON. Example: {\"material\":\"Cotton\"}"} />
                  </label>
                  <textarea
                    value={detailsText}
                    onChange={(e) => {
                      setDetailsText(e.target.value)
                      try {
                        const parsed = JSON.parse(e.target.value || '{}')
                        handleChange('details' as any, parsed)
                      } catch {
                        // ignore invalid JSON while typing
                      }
                    }}
                    rows={4}
                    className="w-full font-mono text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder={`{\n  \"material\": \"Cotton\"\n}`}
                  />
                </div>
              </div>
            </div>
          
          {/* Product Settings */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-4">Settings</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[
                { key: 'isActive', label: 'Active' },
                { key: 'isFeatured', label: 'Featured' },
                { key: 'isNewArrival', label: 'New Arrival' },
                { key: 'isBestseller', label: 'Bestseller' },
                { key: 'isOnSale', label: 'On Sale' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData[key as keyof typeof formData] as boolean}
                    onChange={(e) => handleChange(key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label className="text-sm text-gray-700">{label}</label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 2. PRODUCT VARIANTS */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-600" />
              2. Product Variants (Pricing & Inventory)
            </h3>
            <Button type="button" size="sm" onClick={addVariant}>
              <Plus className="w-4 h-4 mr-2" /> Add Variant
            </Button>
          </div>
          
          <div className="space-y-4">
            {variants.map((variant, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Variant {index + 1} {variant.isDefault && '(Default)'}
                  </h4>
                  {variants.length > 1 && (
                    <Button type="button" size="sm" variant="outline" onClick={() => removeVariant(index)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                    <input
                      type="text"
                      required
                      value={variant.sku}
                      onChange={(e) => updateVariant(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="PROD-001-S-RED"
                    />
                  </div>
                  
                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variant Name
                    <InfoTip text={"Optional name. Example: Small Red"} />
                  </label>
                    <input
                      type="text"
                      value={variant.title}
                      onChange={(e) => updateVariant(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Small Red"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      min="0"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, 'price', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="29.99"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={variant.stock}
                      onChange={(e) => updateVariant(index, 'stock', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100"
                    />
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Compare At Price
                    <InfoTip text={"Old/original price. Example: 39.99"} />
                  </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={variant.compareAtPrice ?? ''}
                      onChange={(e) => updateVariant(index, 'compareAtPrice', e.target.value === '' ? null : parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="39.99"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Currency
                      <InfoTip text={"Currency for this variant. Usually same as product currency."} />
                    </label>
                    <select
                      value={variant.currency}
                      onChange={(e) => updateVariant(index, 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {getAllCurrencies().map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code} ({currency.symbol})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Barcode
                    <InfoTip text={"Code on product. Example: 1234567890123"} />
                  </label>
                    <input
                      type="text"
                      value={variant.barcode || ''}
                      onChange={(e) => updateVariant(index, 'barcode', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="EAN/UPC"
                    />
                  </div>

                  <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (g)
                        <InfoTip text={"Weight in grams. Example: 500"} />
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={(variant as any).weightGrams ?? ''}
                        onChange={(e) => updateVariant(index, 'weightGrams', e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Length (cm)
                        <InfoTip text={"Length in centimeter. Example: 30"} />
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={(variant as any).lengthCm ?? ''}
                        onChange={(e) => updateVariant(index, 'lengthCm', e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="30"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Width (cm)
                        <InfoTip text={"Width in centimeter. Example: 20"} />
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={(variant as any).widthCm ?? ''}
                        onChange={(e) => updateVariant(index, 'widthCm', e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="20"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Height (cm)
                        <InfoTip text={"Height in centimeter. Example: 10"} />
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={(variant as any).heightCm ?? ''}
                        onChange={(e) => updateVariant(index, 'heightCm', e.target.value === '' ? null : parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Attributes (JSON)
                      <InfoTip text={"Size/color etc as JSON. Example: {\"size\":\"M\"}"} />
                    </label>
                    <textarea
                      value={JSON.stringify(variant.attributes || {}, null, 2)}
                      onChange={(e) => {
                        try {
                          const parsed = JSON.parse(e.target.value || '{}')
                          updateVariant(index, 'attributes', parsed)
                        } catch {
                          // ignore invalid JSON
                        }
                      }}
                      rows={3}
                      className="w-full font-mono text-xs px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder={`{\n  \"size\": \"M\",\n  \"color\": \"Red\"\n}`}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="defaultVariant"
                      checked={variant.isDefault === true}
                      onChange={() => {
                        // ensure only one default
                        setVariants(prev => prev.map((v, i) => ({ ...v, isDefault: i === index })))
                      }}
                    />
                    <span className="text-sm text-gray-700">Set as Default</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. PRODUCT IMAGES */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <ImageIcon className="w-5 h-5 mr-2 text-purple-600" />
              3. Product Images
            </h3>
            <Button type="button" size="sm" onClick={addImage}>
              <Plus className="w-4 h-4 mr-2" /> Add Image
            </Button>
          </div>
          
          {/* AI Generation Hint */}
          <div className="mb-6 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <Star className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-purple-800 font-medium">AI-Powered Product Details</p>
                <p className="text-purple-700 mt-1">
                  Upload an image first, then click "Generate via AI" in the Product Information section to automatically populate product details, descriptions, pricing suggestions, and more based on the image analysis.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {images.map((image, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-medium text-gray-900">
                    Image {index + 1} {image.isPrimary && '(Primary)'}
                  </h4>
                  <div className="flex space-x-2">
                    {!image.isPrimary && (
                      <Button type="button" size="sm" variant="outline" onClick={() => setPrimaryImage(index)}>
                        Set as Primary
                      </Button>
                    )}
                    {images.length > 1 && (
                      <Button type="button" size="sm" variant="outline" onClick={() => removeImage(index)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
                
                <ImageUpload
                  value={image.url}
                  onChange={(url: string) => updateImage(index, 'url', url)}
                  onDelete={() => removeImage(index)}
                  productId={product?.id || `new-${newProductId}`}
                  alt={image.alt}
                  onAltChange={(alt: string) => updateImage(index, 'alt', alt)}
                  isPrimary={image.isPrimary}
                  onPrimaryChange={() => setPrimaryImage(index)}
                  sortOrder={image.sortOrder}
                  onSortOrderChange={(sortOrder: number) => updateImage(index, 'sortOrder', sortOrder)}
                />
              </div>
            ))}
          </div>
        </div>

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
              ? (product ? 'Updating...' : 'Creating...') 
              : (product ? 'Update Product' : 'Create Product')
            }
          </Button>
        </div>
      </form>
    </div>
  )
} 