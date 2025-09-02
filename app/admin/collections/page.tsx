"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Crown, 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  ImageIcon,
  Star,
  StarOff,
  Loader2,
  Package,
  ArrowLeft
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { AdminLayout } from "@/components/admin/admin-layout"
import { toast } from "sonner"
import Link from "next/link"
import { isValidImageUrl, getImageSourceType } from "@/lib/image-utils"
import { SmartImage } from "@/components/ui/smart-image"

// Secret key for admin access
const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || "evelon2024"

interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  imageUrl?: string
  isFeatured: boolean
  createdAt: string
  updatedAt: string
}

interface CollectionFormData {
  name: string
  slug: string
  description: string
  imageUrl: string
  isFeatured: boolean
}

export default function CollectionsAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CollectionFormData>({
    name: '',
    slug: '',
    description: '',
    imageUrl: '',
    isFeatured: false
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
      fetchCollections()
      return
    }
    if (stored && envKey && stored === envKey) {
      setIsAuthenticated(true)
      fetchCollections()
      return
    }
    window.location.href = '/admin/access-denied'
  }, [])

  const fetchCollections = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/collections', {
        headers: {
          'x-admin-key': ADMIN_SECRET_KEY
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch collections')
      }
      
      const data = await response.json()
      setCollections(data.collections || [])
    } catch (error) {
      console.error('Error fetching collections:', error)
      toast.error('Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }))
  }

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      imageUrl: '',
      isFeatured: false
    })
    setEditingCollection(null)
    setShowForm(false)
  }

  const handleEdit = (collection: Collection) => {
    setFormData({
      name: collection.name,
      slug: collection.slug,
      description: collection.description || '',
      imageUrl: collection.imageUrl || '',
      isFeatured: collection.isFeatured
    })
    setEditingCollection(collection)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }

    try {
      setSaving(true)
      const url = editingCollection 
        ? `/api/admin/collections/${editingCollection.id}` 
        : '/api/admin/collections'
      
      const method = editingCollection ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': ADMIN_SECRET_KEY
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        console.error('Server error response:', error)
        throw new Error(error.details || error.message || `HTTP ${response.status}: Failed to save collection`)
      }

      await response.json()
      toast.success(editingCollection ? 'Collection updated successfully' : 'Collection created successfully')
      
      resetForm()
      fetchCollections()
    } catch (error) {
      console.error('Error saving collection:', error)
      
      // Try to get the actual error from the response
      let errorMessage = 'Failed to save collection'
      if (error instanceof Error) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (collection: Collection) => {
    if (!confirm(`Are you sure you want to delete "${collection.name}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/collections/${collection.id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-key': ADMIN_SECRET_KEY
        }
      })

      if (!response.ok) {
        throw new Error('Failed to delete collection')
      }

      toast.success('Collection deleted successfully')
      fetchCollections()
    } catch (error) {
      console.error('Error deleting collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  const formatDate = (isoDate: string) => {
    try {
      return new Date(isoDate).toISOString().slice(0, 10)
    } catch {
      return isoDate
    }
  }

  if (!isAuthenticated) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Crown className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600">Invalid or missing admin key</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Collections Management" subtitle="Manage featured collections and promotional sections">
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <Star className="w-6 h-6 text-yellow-600" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Collections ({collections.length})</h2>
            <p className="text-sm text-gray-600">Featured promotional sections</p>
          </div>
        </div>
        
        <Button onClick={() => setShowForm(true)} disabled={loading} className="bg-yellow-600 hover:bg-yellow-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Collection
        </Button>
      </div>
        {/* Instructions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 mb-8"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            About Collections
          </h3>
          <div className="text-blue-700 space-y-2">
            <p>Collections are featured promotional sections displayed on your homepage. They showcase special product groupings or seasonal campaigns.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-medium mb-2">✨ Featured Collections:</p>
                <ul className="text-sm space-y-1">
                  <li>• First 2 featured collections appear as large hero cards</li>
                  <li>• Remaining featured collections appear in the 4-card grid</li>
                  <li>• Use high-quality images (recommended: 1200x800px)</li>
                </ul>
              </div>
              <div>
                <p className="font-medium mb-2">🎯 Best Practices:</p>
                <ul className="text-sm space-y-1">
                  <li>• Use descriptive names (e.g., "Summer Collection 2024")</li>
                  <li>• Write compelling descriptions for customer engagement</li>
                  <li>• Feature seasonal or promotional collections</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Modal */}
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => e.target === e.currentTarget && resetForm()}
          >
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingCollection ? 'Edit Collection' : 'Add New Collection'}
                </h3>
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Collection Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g., Summer Collection 2024"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug *</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                      placeholder="summer-collection-2024"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this collection..."
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageUrl">Image URL</Label>
                  <Input
                    id="imageUrl"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                    placeholder="https://drive.google.com/file/d/... or https://images.unsplash.com/..."
                  />
                  <div className="text-sm text-gray-500 space-y-1">
                    <p><strong>Supported sources:</strong></p>
                    <ul className="list-disc list-inside ml-2 space-y-0.5">
                      <li><strong>Google Drive:</strong> Right-click → Get link → Set to &quot;Anyone with the link&quot; → Copy</li>
                      <li><strong>Unsplash:</strong> Copy image URL for free stock photos</li>
                      <li><strong>Direct URLs:</strong> Any direct image URL (.jpg, .png, etc.)</li>
                    </ul>
                    <p className="text-blue-600"><strong>Google Drive tip:</strong> Make sure the file permission is set to &quot;Anyone with the link can view&quot; for images to display properly.</p>
                    <p>Recommended size: 1200x800px for best quality across all card types.</p>
                  </div>
                  
                  {formData.imageUrl && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-medium text-gray-700">Preview:</p>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          getImageSourceType(formData.imageUrl) === 'google-drive' 
                            ? 'bg-blue-100 text-blue-800' 
                            : getImageSourceType(formData.imageUrl) === 'unsplash'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {getImageSourceType(formData.imageUrl) === 'google-drive' ? 'Google Drive' : 
                           getImageSourceType(formData.imageUrl) === 'unsplash' ? 'Unsplash' : 
                           getImageSourceType(formData.imageUrl) === 'direct' ? 'Direct URL' : 'Unknown'}
                        </span>
                      </div>
                      <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 relative">
                        <SmartImage
                          src={formData.imageUrl}
                          alt="Collection preview"
                          className="w-full h-full object-cover"
                          fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gIDxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjZjNmNGY2Ii8+ICA8dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIENvdWxkbid0IExvYWQ8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5DaGVjayB5b3VyIFVSTC9wZXJtaXNzaW9uczwvdGV4dD48L3N2Zz4="
                        />
                      </div>
                      {getImageSourceType(formData.imageUrl) === 'google-drive' && (
                        <p className="text-xs text-blue-600 mt-1">
                          📁 Google Drive link detected and converted for display
                        </p>
                      )}
                      {!isValidImageUrl(formData.imageUrl) && (
                        <p className="text-xs text-orange-600 mt-1">
                          ⚠️ URL might not be a valid image. Please check if it displays correctly.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isFeatured: checked }))}
                  />
                  <Label htmlFor="featured" className="flex items-center space-x-2">
                    <Star className={`w-4 h-4 ${formData.isFeatured ? 'text-yellow-500' : 'text-gray-400'}`} />
                    <span>Featured Collection (appears on homepage)</span>
                  </Label>
                </div>
              </div>
              
              <div className="flex justify-end space-x-4 p-6 border-t border-gray-200 bg-gray-50">
                <Button variant="outline" onClick={resetForm} disabled={saving}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Collections List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                All Collections ({collections.length})
              </h3>
            </div>
          </div>
          
          <div className="overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 mx-auto mb-4 animate-spin" />
                <p className="text-gray-600">Loading collections...</p>
              </div>
            ) : collections.length === 0 ? (
              <div className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No collections yet</h4>
                <p className="text-gray-600 mb-6">Create your first collection to showcase on the homepage</p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Collection
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Collection
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {collections.map((collection) => (
                      <motion.tr 
                        key={collection.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                              {collection.imageUrl ? (
                                <SmartImage
                                  src={collection.imageUrl}
                                  alt={collection.name}
                                  className="w-full h-full object-cover"
                                  fallbackSrc="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+ICA8cmVjdCB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIGZpbGw9IiNmM2Y0ZjYiLz4gIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOWNhM2FmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+4p2MPC90ZXh0Pjwvc3ZnPg=="
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                  <ImageIcon className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{collection.name}</h4>
                              <p className="text-sm text-gray-600">/{collection.slug}</p>
                              {collection.description && (
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                  {collection.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            {collection.isFeatured ? (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                <StarOff className="w-3 h-3 mr-1" />
                                Normal
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {formatDate(collection.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEdit(collection)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDelete(collection)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
    </AdminLayout>
  )
}