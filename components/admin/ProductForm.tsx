"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Save, 
  X, 
  Plus, 
  Trash2, 
  Upload, 
  Image as ImageIcon,
  Package,
  Tag,
  DollarSign,
  Star,
  Crown,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/ui/image-upload"

interface ProductFormProps {
  product?: any
  categories: any[]
  onSave: (productData: any) => void
  onCancel: () => void
}

export default function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    shortDescription: product?.shortDescription || '',
    price: product?.price || '',
    originalPrice: product?.originalPrice || '',
    costPrice: product?.costPrice || '',
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    brand: product?.brand || '',
    tags: product?.tags || [],
    colors: product?.colors || [],
    sizes: product?.sizes || [],
    stock: product?.stock || 0,
    minStockLevel: product?.minStockLevel || 5,
    weight: product?.weight || '',
    dimensions: product?.dimensions || '',
    materials: product?.materials || '',
    care: product?.care || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured ?? false,
    isNewArrival: product?.isNewArrival ?? false,
    isBestseller: product?.isBestseller ?? false,
    isOnSale: product?.isOnSale ?? false,
    showInNavigation: product?.showInNavigation ?? false,
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    metaKeywords: product?.metaKeywords || '',
    images: product?.images || [],
    mainImage: product?.mainImage || '',
    variants: product?.variants || [],
    shipping: {
      freeShipping: product?.shipping?.freeShipping ?? false,
      weight: product?.shipping?.weight || '',
      dimensions: product?.shipping?.dimensions || '',
      shippingClass: product?.shipping?.shippingClass || 'standard'
    }
  })

  const [errors, setErrors] = useState<any>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAIGenerating, setIsAIGenerating] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [newColor, setNewColor] = useState('')
  const [newSize, setNewSize] = useState('')
  const [newMaterial, setNewMaterial] = useState('')

  // Get available subcategories based on selected category
  const availableSubcategories = categories
    .find(cat => cat.id === formData.category)
    ?.subcategories || []

  // Validation
  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.name.trim()) newErrors.name = 'Product name is required'
    if (!formData.category) newErrors.category = 'Category is required'
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required'
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required'
    if (!formData.sku.trim()) newErrors.sku = 'SKU is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)
    
    try {
      // Prepare product data
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: parseFloat(formData.originalPrice) || null,
        costPrice: parseFloat(formData.costPrice) || null,
        stock: parseInt(formData.stock),
        minStockLevel: parseInt(formData.minStockLevel),
        weight: parseFloat(formData.weight) || null,
        createdAt: product ? product.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      await onSave(productData)
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // AI Generation Function
  const handleAIGenerate = async () => {
    const mainImageUrl = formData.mainImage || formData.images[0]
    if (!mainImageUrl) {
      alert('Please upload a main image first to generate product details with AI.')
      return
    }

    setIsAIGenerating(true)
    
    try {
      const response = await fetch('/api/admin/ai-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ''
        },
        body: JSON.stringify({ 
          imageUrl: mainImageUrl,
          context: { 
            name: formData.name, 
            brand: formData.brand,
            category: formData.category 
          }
        })
      })

      if (!response.ok) {
        throw new Error('AI generation failed')
      }

      const aiData = await response.json()
      
      // Update form data with AI generated content
      setFormData(prev => ({
        ...prev,
        name: aiData.name || prev.name,
        description: aiData.description || prev.description,
        shortDescription: aiData.shortDescription || prev.shortDescription,
        brand: aiData.brand || prev.brand,
        category: aiData.category || prev.category,
        subcategory: aiData.subcategory || prev.subcategory,
        price: aiData.price || prev.price,
        originalPrice: aiData.originalPrice || prev.originalPrice,
        costPrice: aiData.costPrice || prev.costPrice,
        sku: aiData.sku || prev.sku,
        barcode: aiData.barcode || prev.barcode,
        tags: Array.isArray(aiData.tags) ? aiData.tags : prev.tags,
        colors: Array.isArray(aiData.colors) ? aiData.colors : prev.colors,
        sizes: Array.isArray(aiData.sizes) ? aiData.sizes : prev.sizes,
        materials: aiData.materials || prev.materials,
        care: aiData.care || prev.care,
        stock: aiData.stock || prev.stock,
        minStockLevel: aiData.minStockLevel || prev.minStockLevel,
        weight: aiData.weight || prev.weight,
        dimensions: aiData.dimensions || prev.dimensions,
        metaTitle: aiData.metaTitle || prev.metaTitle,
        metaDescription: aiData.metaDescription || prev.metaDescription,
        metaKeywords: aiData.metaKeywords || prev.metaKeywords,
        images: Array.isArray(aiData.images) ? aiData.images : prev.images,
        mainImage: aiData.mainImage || prev.mainImage,
        variants: Array.isArray(aiData.variants) ? aiData.variants : prev.variants,
        isActive: typeof aiData.isActive === 'boolean' ? aiData.isActive : prev.isActive,
        isFeatured: typeof aiData.isFeatured === 'boolean' ? aiData.isFeatured : prev.isFeatured,
        isNewArrival: typeof aiData.isNewArrival === 'boolean' ? aiData.isNewArrival : prev.isNewArrival,
        isBestseller: typeof aiData.isBestseller === 'boolean' ? aiData.isBestseller : prev.isBestseller,
        isOnSale: typeof aiData.isOnSale === 'boolean' ? aiData.isOnSale : prev.isOnSale,
        showInNavigation: typeof aiData.showInNavigation === 'boolean' ? aiData.showInNavigation : prev.showInNavigation
      }))

      alert('AI has successfully generated product details! Please review and modify as needed before saving.')
      
    } catch (error) {
      console.error('AI generation error:', error)
      alert('Failed to generate product details with AI. Please try again or fill in manually.')
    } finally {
      setIsAIGenerating(false)
    }
  }

  // Handle field changes
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when field is corrected
    if (errors[field]) {
      setErrors((prev: any) => ({ ...prev, [field]: '' }))
    }
  }

  // Handle array field changes
  const handleArrayChange = (field: string, value: any, action: 'add' | 'remove' | 'update') => {
    setFormData(prev => {
      const currentArray = (prev as any)[field] || []
      let newArray

      switch (action) {
        case 'add':
          newArray = [...currentArray, value]
          break
        case 'remove':
          newArray = currentArray.filter((item: any, index: number) => index !== value)
          break
        case 'update':
          newArray = currentArray.map((item: any, index: number) => 
            index === value.index ? value.item : item
          )
          break
        default:
          newArray = currentArray
      }

      return { ...prev, [field]: newArray }
    })
  }

  // Add new tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      handleArrayChange('tags', newTag.trim(), 'add')
      setNewTag('')
    }
  }

  // Add new color
  const addColor = () => {
    if (newColor.trim() && !formData.colors.includes(newColor.trim())) {
      handleArrayChange('colors', newColor.trim(), 'add')
      setNewColor('')
    }
  }

  // Add new size
  const addSize = () => {
    if (newSize.trim() && !formData.sizes.includes(newSize.trim())) {
      handleArrayChange('sizes', newSize.trim(), 'add')
      setNewSize('')
    }
  }

  // Add new material
  const addMaterial = () => {
    if (newMaterial.trim() && !formData.materials.includes(newMaterial.trim())) {
      handleArrayChange('materials', newMaterial.trim(), 'add')
      setNewMaterial('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </h3>
          <Button
            type="button"
            onClick={handleAIGenerate}
            disabled={isAIGenerating || (!formData.mainImage && formData.images.length === 0)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            size="sm"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {isAIGenerating ? 'Generating...' : 'Generate via AI'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SKU *
            </label>
            <input
              type="text"
              required
              value={formData.sku}
              onChange={(e) => handleChange('sku', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.sku ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="e.g., PROD-001"
            />
            {errors.sku && <p className="text-red-500 text-sm mt-1">{errors.sku}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.displayName}
                </option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={formData.subcategory}
              onChange={(e) => handleChange('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Subcategory</option>
              {availableSubcategories.map((subcategory: any) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.displayName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Brand
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
              Barcode
            </label>
            <input
              type="text"
              value={formData.barcode}
              onChange={(e) => handleChange('barcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 1234567890123"
            />
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Short Description
          </label>
          <input
            type="text"
            value={formData.shortDescription}
            onChange={(e) => handleChange('shortDescription', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief product description for listings"
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Full Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Detailed product description..."
          />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <DollarSign className="w-5 h-5 mr-2 text-green-600" />
          Pricing & Inventory
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Selling Price *
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                required
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className={`w-full pl-8 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.price ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Original Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.originalPrice}
                onChange={(e) => handleChange('originalPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.costPrice}
                onChange={(e) => handleChange('costPrice', e.target.value)}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => handleChange('stock', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Stock Level
            </label>
            <input
              type="number"
              min="0"
              value={formData.minStockLevel}
              onChange={(e) => handleChange('minStockLevel', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.weight}
              onChange={(e) => handleChange('weight', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.5"
            />
          </div>
        </div>
      </div>

      {/* Product Attributes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Tag className="w-5 h-5 mr-2 text-purple-600" />
          Product Attributes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Colors
            </label>
            <div className="space-y-2">
              {formData.colors.map((color: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleArrayChange('colors', { index, item: e.target.value }, 'update')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayChange('colors', index, 'remove')}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="Add new color"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addColor} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sizes
            </label>
            <div className="space-y-2">
              {formData.sizes.map((size: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => handleArrayChange('sizes', { index, item: e.target.value }, 'update')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayChange('sizes', index, 'remove')}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newSize}
                  onChange={(e) => setNewSize(e.target.value)}
                  placeholder="Add new size"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addSize} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              {formData.tags.map((tag: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => handleArrayChange('tags', { index, item: e.target.value }, 'update')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayChange('tags', index, 'remove')}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add new tag"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addTag} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials
            </label>
            <div className="space-y-2">
              {formData.materials.map((material: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={material}
                    onChange={(e) => handleArrayChange('materials', { index, item: e.target.value }, 'update')}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => handleArrayChange('materials', index, 'remove')}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMaterial}
                  onChange={(e) => setNewMaterial(e.target.value)}
                  placeholder="Add new material"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button type="button" onClick={addMaterial} size="sm" variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Care Instructions
          </label>
          <textarea
            value={formData.care}
            onChange={(e) => handleChange('care', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Care and maintenance instructions..."
          />
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <ImageIcon className="w-5 h-5 mr-2 text-indigo-600" />
          Product Images
        </h3>

        <div className="space-y-6">
          {/* Main Product Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Main Product Image *
            </label>
            <p className="text-sm text-gray-500 mb-4">
              Upload a high-quality image or provide a URL. Supports local file uploads to Supabase storage or direct URLs from any source including Google Drive, Dropbox, etc.
            </p>
            <ImageUpload
              value={formData.mainImage}
              onChange={(url) => handleChange('mainImage', url)}
              onDelete={() => handleChange('mainImage', '')}
              productId={product?.id || 'temp-' + Date.now()}
              alt="Main product image"
              isPrimary={true}
              className="max-w-md"
            />
            
            {/* AI Generation Hint */}
            <div className="mt-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-purple-800 font-medium">AI-Powered Product Details</p>
                  <p className="text-purple-700 mt-1">
                    Once you upload an image, click &quot;Generate via AI&quot; to automatically populate product details, descriptions, pricing suggestions, and more based on the image analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Images */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Additional Images
              </label>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  const newImages = [...formData.images, '']
                  handleChange('images', newImages)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Image
              </Button>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Add multiple product images to showcase different angles, details, or variations.
            </p>
            
            <div className="space-y-4">
              {formData.images.map((image: string, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">
                      Image {index + 1}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const newImages = formData.images.filter((_: any, i: number) => i !== index)
                        handleChange('images', newImages)
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Remove
                    </Button>
                  </div>
                  
                  <ImageUpload
                    value={image}
                    onChange={(url) => {
                      const newImages = [...formData.images]
                      newImages[index] = url
                      handleChange('images', newImages)
                    }}
                    onDelete={() => {
                      const newImages = [...formData.images]
                      newImages[index] = ''
                      handleChange('images', newImages)
                    }}
                    productId={product?.id || 'temp-' + Date.now()}
                    alt={`Product image ${index + 1}`}
                    sortOrder={index}
                    className="max-w-md"
                  />
                </div>
              ))}
              
              {formData.images.length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No additional images added</p>
                  <p className="text-sm text-gray-400 mt-1">Click "Add Image" to include more product photos</p>
                </div>
              )}
            </div>
          </div>

          {/* Image Upload Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Image Upload Options</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>• File Upload:</strong> Drag & drop or click to upload files directly to Supabase storage</p>
              <p><strong>• URL Method:</strong> Paste image URLs - Google Drive sharing URLs are automatically converted</p>
              <p><strong>• Google Drive:</strong> Just paste the sharing URL (like /file/d/.../view) - no need to change permissions</p>
              <p><strong>• Supported formats:</strong> JPEG, PNG, WebP, GIF (max 10MB each)</p>
              <p><strong>• Recommended size:</strong> At least 800x800px for main image</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Status & Visibility */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <Star className="w-5 h-5 mr-2 text-yellow-600" />
          Status & Visibility
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleChange('isActive', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Featured</span>
            <input
              type="checkbox"
              checked={formData.isFeatured}
              onChange={(e) => handleChange('isFeatured', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">New Arrival</span>
            <input
              type="checkbox"
              checked={formData.isNewArrival}
              onChange={(e) => handleChange('isNewArrival', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Bestseller</span>
            <input
              type="checkbox"
              checked={formData.isBestseller}
              onChange={(e) => handleChange('isBestseller', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">On Sale</span>
            <input
              type="checkbox"
              checked={formData.isOnSale}
              onChange={(e) => handleChange('isOnSale', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Show in Navigation</span>
            <input
              type="checkbox"
              checked={formData.showInNavigation}
              onChange={(e) => handleChange('showInNavigation', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* SEO & Meta */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
          SEO & Meta Information
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Title
            </label>
            <input
              type="text"
              value={formData.metaTitle}
              onChange={(e) => handleChange('metaTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO title for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleChange('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="SEO description for search engines"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              value={formData.metaKeywords}
              onChange={(e) => handleChange('metaKeywords', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Comma-separated keywords"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-blue-600 hover:bg-blue-700"
          disabled={isSubmitting}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  )
} 