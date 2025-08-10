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
  Tag,
  ShoppingBag,
  Users,
  Star,
  Crown
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = "evelon2024"

export default function CategoriesManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState([])
  const [editingCategory, setEditingCategory] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

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

  // Sample categories data - this will come from database
  const [sampleCategories, setSampleCategories] = useState([
    {
      id: "clothing",
      name: "Clothing",
      displayName: "Clothing",
      description: "Apparel and fashion items",
      slug: "clothing",
      parentId: null,
      level: 1,
      sortOrder: 1,
      isActive: true,
      isFeatured: true,
      showInNavigation: true,
      showInFooter: true,
      productCount: 89,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
      icon: "👕",
      color: "#3B82F6",
      subcategories: [
        {
          id: "clothing-tops",
          name: "Tops",
          displayName: "Tops & Shirts",
          description: "Shirts, t-shirts, blouses",
          slug: "tops",
          parentId: "clothing",
          level: 2,
          sortOrder: 1,
          isActive: true,
          productCount: 34,
          image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        },
        {
          id: "clothing-bottoms",
          name: "Bottoms",
          displayName: "Pants & Skirts",
          description: "Jeans, trousers, skirts",
          slug: "bottoms",
          parentId: "clothing",
          level: 2,
          sortOrder: 2,
          isActive: true,
          productCount: 28,
          image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        },
        {
          id: "clothing-outerwear",
          name: "Outerwear",
          displayName: "Jackets & Coats",
          description: "Blazers, coats, jackets",
          slug: "outerwear",
          parentId: "clothing",
          level: 2,
          sortOrder: 3,
          isActive: true,
          productCount: 27,
          image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        }
      ]
    },
    {
      id: "footwear",
      name: "Footwear",
      displayName: "Footwear",
      description: "Shoes, boots, and sneakers",
      slug: "footwear",
      parentId: null,
      level: 1,
      sortOrder: 2,
      isActive: true,
      isFeatured: true,
      showInNavigation: true,
      showInFooter: true,
      productCount: 45,
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1112&q=80",
      icon: "👟",
      color: "#10B981",
      subcategories: [
        {
          id: "footwear-sneakers",
          name: "Sneakers",
          displayName: "Sneakers & Athletic",
          description: "Casual and athletic shoes",
          slug: "sneakers",
          parentId: "footwear",
          level: 2,
          sortOrder: 1,
          isActive: true,
          productCount: 18,
          image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
        },
        {
          id: "footwear-boots",
          name: "Boots",
          displayName: "Boots & Formal",
          description: "Formal and casual boots",
          slug: "boots",
          parentId: "footwear",
          level: 2,
          sortOrder: 2,
          isActive: true,
          productCount: 15,
          image: "https://images.unsplash.com/photo-1608256246200-53e635b5b665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
        },
        {
          id: "footwear-sandals",
          name: "Sandals",
          displayName: "Sandals & Slides",
          description: "Summer and casual footwear",
          slug: "sandals",
          parentId: "footwear",
          level: 2,
          sortOrder: 3,
          isActive: true,
          productCount: 12,
          image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        }
      ]
    },
    {
      id: "accessories",
      name: "Accessories",
      displayName: "Accessories",
      description: "Jewelry, watches, and small items",
      slug: "accessories",
      parentId: null,
      level: 1,
      sortOrder: 3,
      isActive: true,
      isFeatured: false,
      showInNavigation: true,
      showInFooter: true,
      productCount: 67,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80",
      icon: "💍",
      color: "#8B5CF6",
      subcategories: [
        {
          id: "accessories-jewelry",
          name: "Jewelry",
          displayName: "Jewelry & Watches",
          description: "Necklaces, rings, watches",
          slug: "jewelry",
          parentId: "accessories",
          level: 2,
          sortOrder: 1,
          isActive: true,
          productCount: 23,
          image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80"
        },
        {
          id: "accessories-bags",
          name: "Bags",
          displayName: "Bags & Wallets",
          description: "Handbags, backpacks, wallets",
          slug: "bags",
          parentId: "accessories",
          level: 2,
          sortOrder: 2,
          isActive: true,
          productCount: 34,
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1035&q=80"
        },
        {
          id: "accessories-other",
          name: "Other",
          displayName: "Other Accessories",
          description: "Belts, scarves, hats",
          slug: "other",
          parentId: "accessories",
          level: 2,
          sortOrder: 3,
          isActive: true,
          productCount: 10,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80"
        }
      ]
    },
    {
      id: "sport",
      name: "Sport",
      displayName: "Sport & Active",
      description: "Athletic wear and equipment",
      slug: "sport",
      parentId: null,
      level: 1,
      sortOrder: 4,
      isActive: true,
      isFeatured: false,
      showInNavigation: true,
      showInFooter: false,
      productCount: 28,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      icon: "⚽",
      color: "#F59E0B",
      subcategories: []
    },
    {
      id: "home",
      name: "Home & Living",
      displayName: "Home & Living",
      description: "Home decor and lifestyle items",
      slug: "home",
      parentId: null,
      level: 1,
      sortOrder: 5,
      isActive: false,
      isFeatured: false,
      showInNavigation: false,
      showInFooter: false,
      productCount: 15,
      image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
      icon: "🏠",
      color: "#6366F1",
      subcategories: []
    }
  ])

  // Filter categories based on search
  const filteredCategories = sampleCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Handle category edit
  const handleEdit = (category) => {
    setEditingCategory({ ...category })
    setShowAddForm(true)
  }

  // Handle category save
  const handleSave = (categoryData) => {
    if (editingCategory) {
      // Update existing category
      setSampleCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
      ))
      setEditingCategory(null)
    } else {
      // Add new category
      const newCategory = {
        id: `category-${Date.now()}`,
        ...categoryData,
        productCount: 0,
        subcategories: [],
        level: categoryData.parentId ? 2 : 1
      }
      setSampleCategories(prev => [...prev, newCategory])
    }
    setShowAddForm(false)
  }

  // Handle category delete
  const handleDelete = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This will also remove all subcategories.')) {
      setSampleCategories(prev => prev.filter(cat => cat.id !== categoryId))
    }
  }

  // Handle category toggle
  const handleToggle = (categoryId, field) => {
    setSampleCategories(prev => prev.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: !cat[field] } : cat
    ))
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-600">Organize your store's product categories</p>
              </div>
            </div>
            
            <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-4">
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

        {/* Categories Display */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Categories ({filteredCategories.length})
            </h2>
            <div className="text-sm text-gray-600">
              Total: {sampleCategories.reduce((sum, cat) => sum + cat.productCount, 0)} products
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  {/* Category Header */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 space-y-1">
                      {category.isFeatured && (
                        <span className="inline-block px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded">
                          <Star className="w-3 h-3 inline mr-1" />
                          FEATURED
                        </span>
                      )}
                      {!category.isActive && (
                        <span className="inline-block px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                          INACTIVE
                        </span>
                      )}
                    </div>

                    {/* Category Icon */}
                    <div className="absolute top-3 right-3 text-4xl">
                      {category.icon}
                    </div>
                  </div>

                  {/* Category Info */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.displayName}</h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      
                      {/* Category Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{category.productCount} products</span>
                        <span className="text-gray-500">{category.subcategories.length} subcategories</span>
                      </div>
                    </div>

                    {/* Category Settings */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show in Navigation</span>
                        <button
                          onClick={() => handleToggle(category.id, 'showInNavigation')}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            category.showInNavigation ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            category.showInNavigation ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Show in Footer</span>
                        <button
                          onClick={() => handleToggle(category.id, 'showInFooter')}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            category.showInFooter ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            category.showInFooter ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Active</span>
                        <button
                          onClick={() => handleToggle(category.id, 'isActive')}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            category.isActive ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                            category.isActive ? 'translate-x-5' : 'translate-x-1'
                          }`} />
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleEdit(category)}
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDelete(category.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Subcategories Preview */}
                    {category.subcategories.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Subcategories</h4>
                        <div className="flex flex-wrap gap-2">
                          {category.subcategories.slice(0, 3).map((sub) => (
                            <span key={sub.id} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                              {sub.displayName}
                            </span>
                          ))}
                          {category.subcategories.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                              +{category.subcategories.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
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
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Subcategories
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
                    {filteredCategories.map((category) => (
                      <tr key={category.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 mr-3">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{category.displayName}</div>
                              <div className="text-sm text-gray-500">{category.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.productCount}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{category.subcategories.length}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {category.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {category.isFeatured && (
                              <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                              <Edit className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button size="sm" variant="outline">
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(category.id)}>
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

        {/* Category Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingCategory(null)
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <CategoryForm
                  category={editingCategory}
                  categories={sampleCategories}
                  onSave={handleSave}
                  onCancel={() => {
                    setShowAddForm(false)
                    setEditingCategory(null)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Categories are flexible and can be customized for any store type - clothing, electronics, home goods, etc.</p>
          <p className="mt-1">Each category can have subcategories, custom display names, and visibility settings.</p>
        </div>
      </div>
    </div>
  )
}

// Category Form Component
function CategoryForm({ category, categories, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    displayName: category?.displayName || '',
    description: category?.description || '',
    slug: category?.slug || '',
    parentId: category?.parentId || '',
    sortOrder: category?.sortOrder || 1,
    isActive: category?.isActive ?? true,
    isFeatured: category?.isFeatured ?? false,
    showInNavigation: category?.showInNavigation ?? true,
    showInFooter: category?.showInFooter ?? true,
    icon: category?.icon || '📦',
    color: category?.color || '#3B82F6'
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Clothing"
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
              placeholder="e.g., Fashion & Apparel"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe this category..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., clothing"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Parent Category
            </label>
            <select
              value={formData.parentId}
              onChange={(e) => handleChange('parentId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">No Parent (Main Category)</option>
              {categories.filter(cat => cat.level === 1).map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.displayName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleChange('sortOrder', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Icon
            </label>
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => handleChange('icon', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="📦"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color
            </label>
            <input
              type="color"
              value={formData.color}
              onChange={(e) => handleChange('color', e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Toggle Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-gray-900">Display Settings</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Active</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Featured</span>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => handleChange('isFeatured', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show in Navigation</span>
            <input
              type="checkbox"
              checked={formData.showInNavigation}
              onChange={(e) => handleChange('showInNavigation', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Show in Footer</span>
            <input
              type="checkbox"
              checked={formData.showInFooter}
              onChange={(e) => handleChange('showInFooter', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
          <Save className="w-4 h-4 mr-2" />
          {category ? 'Update Category' : 'Create Category'}
        </Button>
      </div>
    </form>
  )
} 