"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Save, 
  X,
  Package,
  ChevronRight,
  Folder,
  FolderOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ""

interface Category {
  id: string
  name: string
  displayName?: string
  description?: string
  slug: string
  parentId?: string
  sortOrder: number
  isActive: boolean
  isFeatured: boolean
  showInNavigation: boolean
  showInFooter: boolean
  imageUrl?: string
  icon?: string
  color?: string
  createdAt: string
  updatedAt: string
  children?: Category[]
}

export default function CategoriesManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)

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

  // Load categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
        const res = await fetch('/api/admin/categories', {
          headers: adminKey ? { 'x-admin-key': adminKey } : {},
        })
        if (res.ok) {
          const data = await res.json()
          setCategories(data)
        }
      } catch (e) {
        console.error('Error fetching categories:', e)
      }
    }
    
    if (isAuthenticated) {
      fetchCategories()
    }
  }, [isAuthenticated])

  // Organize categories into hierarchy
  const organizeCategories = (categories: Category[]): Category[] => {
    const categoryMap = new Map<string, Category>()
    const rootCategories: Category[] = []

    // First pass: create map and initialize children arrays
    categories.forEach(category => {
      categoryMap.set(category.id, { ...category, children: [] })
    })

    // Second pass: build hierarchy
    categories.forEach(category => {
      const cat = categoryMap.get(category.id)!
      if (category.parentId) {
        const parent = categoryMap.get(category.parentId)
        if (parent) {
          parent.children!.push(cat)
        }
      } else {
        rootCategories.push(cat)
      }
    })

    return rootCategories.sort((a, b) => a.sortOrder - b.sortOrder)
  }

  const hierarchicalCategories = organizeCategories(categories)

  // Handle category save
  const handleSave = async (categoryData: any) => {
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      
      console.log('Saving category:', categoryData)
      
      if (editingCategory) {
        const res = await fetch(`/api/admin/categories/${editingCategory.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify(categoryData),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Update failed')
        }
      } else {
        const res = await fetch('/api/admin/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(adminKey ? { 'x-admin-key': adminKey } : {}) },
          body: JSON.stringify(categoryData),
        })
        if (!res.ok) {
          const error = await res.json()
          throw new Error(error.error || 'Create failed')
        }
      }
      
      // Refresh categories
      const refreshed = await fetch('/api/admin/categories', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setCategories(refreshedData)
      setEditingCategory(null)
      setShowAddForm(false)
      
      alert(editingCategory ? 'Category updated successfully!' : 'Category created successfully!')
    } catch (e: any) {
      console.error('Save error:', e)
      alert(`Save failed: ${e.message}`)
    }
  }

  // Handle category delete
  const handleDelete = async (categoryId: string) => {
    if (!confirm('Delete this category? This action cannot be undone.')) return
    
    try {
      const adminKey = window.sessionStorage.getItem('ADMIN_KEY') || ADMIN_SECRET_KEY
      const res = await fetch(`/api/admin/categories/${categoryId}`, { 
        method: 'DELETE', 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Delete failed')
      }
      
      // Refresh categories
      const refreshed = await fetch('/api/admin/categories', { 
        headers: adminKey ? { 'x-admin-key': adminKey } : {} 
      })
      const refreshedData = await refreshed.json()
      setCategories(refreshedData)
      
      alert('Category deleted successfully!')
    } catch (e: any) {
      console.error('Delete error:', e)
      alert(`Delete failed: ${e.message}`)
    }
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
                <p className="text-sm text-gray-600">Organize your products into categories</p>
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
        {/* How It Works */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Category Structure:</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p><strong>Main Categories:</strong> Top-level categories (e.g., Clothing, Electronics)</p>
            <p><strong>Subcategories:</strong> Nested under main categories (e.g., Men's Clothing under Clothing)</p>
            <p><strong>Products:</strong> Are assigned to categories and appear in your store</p>
          </div>
        </div>

        {/* Categories Display */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Categories ({categories.length})
            </h2>
          </div>
          
          <div className="p-6">
            {hierarchicalCategories.length === 0 ? (
              <div className="text-center py-12">
                <Folder className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h3>
                <p className="text-gray-500 mb-4">Create your first category to organize your products</p>
                <Button onClick={() => setShowAddForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {hierarchicalCategories.map((category) => (
                  <CategoryRow 
                    key={category.id}
                    category={category}
                    level={0}
                    onEdit={(cat) => {
                      setEditingCategory(cat)
                      setShowAddForm(true)
                    }}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
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
                  categories={categories}
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
      </div>
    </div>
  )
}

// Category Row Component with Hierarchy
function CategoryRow({ 
  category, 
  level, 
  onEdit, 
  onDelete 
}: { 
  category: Category
  level: number
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}) {
  const [isExpanded, setIsExpanded] = useState(true)
  
  return (
    <>
      <div 
        className={`flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 ${
          level > 0 ? 'ml-8 border-gray-200 bg-gray-50/50' : 'border-gray-200'
        }`}
        style={{ marginLeft: level * 32 }}
      >
        <div className="flex items-center space-x-3 flex-1">
          {/* Expand/Collapse for categories with children */}
          {category.children && category.children.length > 0 ? (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {isExpanded ? (
                <FolderOpen className="w-4 h-4 text-blue-600" />
              ) : (
                <Folder className="w-4 h-4 text-gray-600" />
              )}
            </button>
          ) : (
            <div className="w-6 h-6 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
            </div>
          )}
          
          {/* Category Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">
                {category.displayName || category.name}
              </h3>
              {!category.isActive && (
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">
                  Inactive
                </span>
              )}
              {category.isFeatured && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                  Featured
                </span>
              )}
            </div>
            {category.description && (
              <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            )}
          </div>
          
          {/* Level indicator */}
          {level > 0 && (
            <div className="text-xs text-gray-400">
              Level {level + 1}
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(category)}>
            <Edit className="w-3 h-3 mr-1" />
            Edit
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(category.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
      
      {/* Children categories */}
      {isExpanded && category.children && category.children.length > 0 && (
        <div className="space-y-2">
          {category.children
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((child) => (
              <CategoryRow
                key={child.id}
                category={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
        </div>
      )}
    </>
  )
}

// Simplified Category Form
function CategoryForm({ 
  category, 
  categories, 
  onSave, 
  onCancel 
}: { 
  category: Category | null
  categories: Category[]
  onSave: (data: any) => void
  onCancel: () => void
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

  const [formData, setFormData] = useState({
    name: category?.name || '',
    displayName: category?.displayName || '',
    description: category?.description || '',
    slug: category?.slug || '',
    imageUrl: (category as any)?.imageUrl || '',
    icon: (category as any)?.icon || '',
    color: (category as any)?.color || '',
    parentId: category?.parentId || '',
    sortOrder: category?.sortOrder || 1,
    isActive: category?.isActive ?? true,
    isFeatured: category?.isFeatured ?? false,
    showInNavigation: category?.showInNavigation ?? true,
    showInFooter: category?.showInFooter ?? false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Generate slug if not provided
    if (!formData.slug && formData.name) {
      formData.slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }
    
    // Use name as displayName if displayName is empty
    if (!formData.displayName && formData.name) {
      formData.displayName = formData.name
    }
    
    onSave(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Allow choosing any existing category as parent (any depth), excluding current
  const idToCategory = new Map<string, Category>()
  categories.forEach(c => idToCategory.set(c.id, c))
  const getPath = (cat: Category): string => {
    const parts: string[] = []
    let cur: Category | undefined = cat
    while (cur) {
      parts.unshift(cur.displayName || cur.name)
      cur = cur.parentId ? idToCategory.get(cur.parentId) : undefined
    }
    return parts.join(' / ')
  }
  const parentCategories = categories
    .filter(cat => (!category || cat.id !== category.id))
    .map(cat => ({ ...cat, pathLabel: getPath(cat) }))
    .sort((a, b) => a.pathLabel.localeCompare(b.pathLabel))

  return (
    <div className="space-y-6">
      {/* Schema explanation */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-green-900 mb-2">Category Setup:</h4>
        <div className="text-xs text-green-700 space-y-1">
          <p><strong>Name:</strong> Internal name for your reference (e.g., "mens-clothing")</p>
          <p><strong>Display Name:</strong> What customers see (e.g., "Men's Clothing")</p>
          <p><strong>Parent Category:</strong> Leave empty for main category, or select parent for subcategory</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Name *
            <InfoTip text={"Short system name for category. Example: clothing, electronics"} />
          </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., clothing"
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
            <InfoTip text={"Name customers see. Example: Men's Clothing"} />
          </label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => handleChange('displayName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Clothing & Fashion"
            />
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image URL
            <InfoTip text={"Link for category image. Example: https://site.com/cat.jpg"} />
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) => handleChange('imageUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
            <InfoTip text={"Optional icon name/class. Example: shirt, star"} />
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="icon name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
            <InfoTip text={"Color code for styling. Example: #1e90ff"} />
          </label>
          <input
            type="text"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#000000"
          />
        </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Parent Category
            <InfoTip text={"Choose parent when this is sub-category. Example: Parent = Clothing"} />
          </label>
            <select
              value={formData.parentId}
              onChange={(e) => handleChange('parentId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">None (Main Category)</option>
              {parentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>{(cat as any).pathLabel}</option>
              ))}
            </select>
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
            <InfoTip text={"Number for ordering small to big. Example: 1 shows before 2"} />
          </label>
            <input
              type="number"
              value={formData.sortOrder}
              onChange={(e) => handleChange('sortOrder', parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
            <InfoTip text={"Small text explain category. Example: Clothes for men and women"} />
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of this category..."
          />
        </div>

        {/* Settings */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Settings</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[ 
              { key: 'isActive', label: 'Active', help: 'Category appears in store', tip: 'Turn on to show category to users. Example: On = visible' },
              { key: 'isFeatured', label: 'Featured', help: 'Highlighted on homepage', tip: 'Feature for promote. Example: On = show in home banner' },
              { key: 'showInNavigation', label: 'Show in Navigation', help: 'Appears in main menu', tip: 'Show inside top menu. Example: On = in main menu' },
              { key: 'showInFooter', label: 'Show in Footer', help: 'Appears in footer links', tip: 'Show in footer link area. Example: On = at page bottom' }
            ].map(({ key, label, help, tip }) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="text-sm font-medium text-gray-700">
                    {label}
                    <InfoTip text={tip} />
                  </span>
                  <p className="text-xs text-gray-500">{help}</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData[key as keyof typeof formData] as boolean}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
            ))}
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
    </div>
  )
}