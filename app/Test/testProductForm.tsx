"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SimpleImageUpload } from "./SimpleImageUpload"

// Match ProductForm structure exactly
type ProductData = {
  name: string
  description: string
  shortDescription: string
  price: number | string
  originalPrice: number | string
  costPrice: number | string
  sku: string
  barcode: string
  category: string
  subcategory: string
  brand: string
  tags: string[]
  colors: string[]
  sizes: string[]
  stock: number | string
  minStockLevel: number | string
  weight: number | string
  dimensions: string
  materials: string
  care: string
  isActive: boolean
  isFeatured: boolean
  isNewArrival: boolean
  isBestseller: boolean
  isOnSale: boolean
  showInNavigation: boolean
  metaTitle: string
  metaDescription: string
  metaKeywords: string
  images: string[]
  mainImage: string
  variants: Record<string, unknown>[]
  shipping: {
    freeShipping: boolean
    weight: string
    dimensions: string
    shippingClass: string
  }
}

export default function TestProductForm({ onToast }: { onToast?: (m: string) => void }) {
  const [formData, setFormData] = useState<ProductData>({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    originalPrice: '',
    costPrice: '',
    sku: '',
    barcode: '',
    category: '',
    subcategory: '',
    brand: '',
    tags: [],
    colors: [],
    sizes: [],
    stock: 0,
    minStockLevel: 5,
    weight: '',
    dimensions: '',
    materials: '',
    care: '',
    isActive: true,
    isFeatured: false,
    isNewArrival: false,
    isBestseller: false,
    isOnSale: false,
    showInNavigation: false,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    images: [],
    mainImage: '',
    variants: [],
    shipping: {
      freeShipping: false,
      weight: '',
      dimensions: '',
      shippingClass: 'standard'
    }
  })
  const [aiLoading, setAiLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [existingImages, setExistingImages] = useState<Array<{ path: string; url: string }>>([])
  const [selectedExisting, setSelectedExisting] = useState<string>("")
  const [loadingExisting, setLoadingExisting] = useState(false)
  const [folders, setFolders] = useState<string[]>([])
  const [selectedFolder, setSelectedFolder] = useState<string>("")

  const handleChange = (field: keyof ProductData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const runAIGenerate = async () => {
    const main = formData.mainImage || formData.images[0]
    if (!main) { onToast?.('Upload a main image first'); return }
    try {
      setAiLoading(true)
      const res = await fetch('/api/test-ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ''
        },
        body: JSON.stringify({ imageUrl: main, context: { name: formData.name, brand: formData.brand } })
      })
      if (!res.ok) throw new Error('AI request failed')
      const ai = await res.json()
      setFormData(prev => ({
        ...prev,
        name: ai.name ?? prev.name,
        description: ai.description ?? prev.description,
        shortDescription: ai.shortDescription ?? prev.shortDescription,
        brand: ai.brand ?? prev.brand,
        category: ai.category ?? prev.category,
        subcategory: ai.subcategory ?? prev.subcategory,
        price: ai.price ?? prev.price,
        originalPrice: ai.originalPrice ?? prev.originalPrice,
        costPrice: ai.costPrice ?? prev.costPrice,
        sku: ai.sku ?? prev.sku,
        barcode: ai.barcode ?? prev.barcode,
        tags: Array.isArray(ai.tags) ? ai.tags : prev.tags,
        colors: Array.isArray(ai.colors) ? ai.colors : prev.colors,
        sizes: Array.isArray(ai.sizes) ? ai.sizes : prev.sizes,
        stock: ai.stock ?? prev.stock,
        minStockLevel: ai.minStockLevel ?? prev.minStockLevel,
        weight: ai.weight ?? prev.weight,
        dimensions: ai.dimensions ?? prev.dimensions,
        materials: ai.materials ?? prev.materials,
        care: ai.care ?? prev.care,
        isActive: typeof ai.isActive === 'boolean' ? ai.isActive : prev.isActive,
        isFeatured: typeof ai.isFeatured === 'boolean' ? ai.isFeatured : prev.isFeatured,
        isNewArrival: typeof ai.isNewArrival === 'boolean' ? ai.isNewArrival : prev.isNewArrival,
        isBestseller: typeof ai.isBestseller === 'boolean' ? ai.isBestseller : prev.isBestseller,
        isOnSale: typeof ai.isOnSale === 'boolean' ? ai.isOnSale : prev.isOnSale,
        showInNavigation: typeof ai.showInNavigation === 'boolean' ? ai.showInNavigation : prev.showInNavigation,
        metaTitle: ai.metaTitle ?? prev.metaTitle,
        metaDescription: ai.metaDescription ?? prev.metaDescription,
        metaKeywords: ai.metaKeywords ?? prev.metaKeywords,
        images: Array.isArray(ai.images) ? ai.images : prev.images,
        mainImage: ai.mainImage ?? prev.mainImage,
        variants: Array.isArray(ai.variants) ? ai.variants : prev.variants
      }))
      onToast?.('AI generated fields populated. Review and save if correct.')
    } catch (e: unknown) {
      console.error(e)
      onToast?.('AI generation failed')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('TEST SAVE data:', formData)
      onToast?.('Saved locally (test). Check console output.')
    } finally {
      setSaving(false)
    }
  }

  const loadExistingImages = async () => {
    try {
      setLoadingExisting(true)
      const prefix = selectedFolder.trim()
      const res = await fetch(`/api/test-storage/images?prefix=${encodeURIComponent(prefix)}`, {
        method: 'GET',
        headers: {
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ''
        }
      })
      if (!res.ok) throw new Error(`Failed to load images: ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setExistingImages(data.images || [])
      onToast?.(`Loaded ${data.images?.length || 0} images${prefix ? ` from ${prefix}` : ''}`)
    } catch (e: unknown) {
      console.error(e)
      onToast?.(`Failed to load images: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      setLoadingExisting(false)
    }
  }

  const loadFolders = async () => {
    try {
      setLoadingExisting(true)
      const res = await fetch('/api/test-storage/folders', {
        method: 'GET',
        headers: {
          'x-admin-key': process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ''
        }
      })
      if (!res.ok) throw new Error(`Failed to load folders: ${res.status}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      const results = data.folders || []
      results.sort()
      setFolders(results)
      if (results.length > 0) setSelectedFolder(results[0])
      onToast?.(`Loaded ${results.length} folders`)
    } catch (e: unknown) {
      console.error(e)
      onToast?.(`Failed to load folders: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      setLoadingExisting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Images */}
      <div className="bg-white rounded-lg border p-4 space-y-4">
        <h2 className="text-lg font-semibold">Images</h2>
        <div className="space-y-3">
          {/* Main Image */}
          <div>
            <label className="block text-sm font-medium mb-3">Main Product Image</label>
            {formData.mainImage && (
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Current main image preview:</p>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={formData.mainImage} 
                  alt="Main product preview" 
                  className="w-32 h-32 object-cover rounded border"
                  onError={(e) => {
                    console.error('Failed to load main image:', formData.mainImage);
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            )}
            
            <p className="text-sm text-gray-500 mb-2">Direct Image Test:</p>
            {/* Direct main image test */}
            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 mb-4">
              {formData.mainImage ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={formData.mainImage} 
                    alt="Direct main test" 
                    className="w-full h-full object-cover"
                    onLoad={() => console.log('✅ Direct main image loaded successfully:', formData.mainImage)}
                    onError={(e) => {
                      console.error('❌ Direct main image failed to load:', formData.mainImage);
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Direct Main Image Working
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No main image URL
                </div>
              )}
            </div>
            
            <p className="text-sm text-gray-500 mb-2">SimpleImageUpload Component:</p>
            <SimpleImageUpload
              value={formData.mainImage}
              onChange={(url: string) => handleChange('mainImage', url)}
              onDelete={() => handleChange('mainImage', '')}
              alt="Main product image"
              className="max-w-md"
            />
            {formData.mainImage && (
              <p className="text-xs text-gray-400 mt-1">URL: {formData.mainImage.substring(0, 50)}...</p>
            )}
          </div>

          {/* Existing images picker */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button type="button" variant="outline" onClick={loadFolders} disabled={loadingExisting}>{loadingExisting ? 'Loading…' : 'Load Folders'}</Button>
            <select className="border rounded px-2 py-1" value={selectedFolder} onChange={(e) => { setSelectedFolder(e.target.value); setExistingImages([]); setSelectedExisting('') }}>
              <option value="">{folders.length ? 'Select folder…' : 'No folders loaded'}</option>
              {folders.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <Button type="button" variant="outline" onClick={loadExistingImages} disabled={loadingExisting || !selectedFolder}>{loadingExisting ? 'Loading…' : 'Load Images'}</Button>
            <select className="border rounded px-2 py-1" value={selectedExisting} onChange={(e) => {
              const val = e.target.value
              setSelectedExisting(val)
            }}>
              <option value="">{existingImages.length ? 'Pick from storage…' : 'No images found'}</option>
              {existingImages.map(img => (
                <option key={img.path} value={img.path}>{img.path}</option>
              ))}
            </select>
            {selectedExisting && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={existingImages.find(i => i.path === selectedExisting)?.url || ''} 
                  alt="preview" 
                  className="w-8 h-8 object-cover rounded border" 
                  onError={(e) => {
                    console.error('Failed to load preview image');
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <Button type="button" size="sm" onClick={() => {
                  const selected = existingImages.find(i => i.path === selectedExisting)
                  if (!selected) return
                  console.log('Adding to gallery:', selected.url);
                  const next = [...formData.images, selected.url]
                  handleChange('images', next)
                }}>Add to Gallery</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  const selected = existingImages.find(i => i.path === selectedExisting)
                  if (!selected) return
                  console.log('Setting as main image:', selected.url);
                  handleChange('mainImage', selected.url)
                }}>Set as Main</Button>
              </>
            )}
          </div>

          {/* Additional Images */}
          <div>
            <label className="block text-sm font-medium mb-3">Additional Images</label>
            {formData.images.map((img, idx) => (
              <div key={idx} className="flex items-center gap-3 mb-2">
                {img && (
                  <div className="flex flex-col items-center">
                    <p className="text-xs text-gray-500 mb-1">Preview:</p>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={img} 
                      alt="thumb" 
                      className="w-16 h-16 object-cover rounded border" 
                      onError={(e) => {
                        console.error('Failed to load gallery image:', img);
                        e.currentTarget.style.display = 'none';
                      }}
                      onLoad={() => {
                        console.log('Successfully loaded gallery image:', img);
                      }}
                    />
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-2">Direct Image Test:</p>
                  {/* Direct image test */}
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    {img ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                          src={img} 
                          alt="Direct test" 
                          className="w-full h-full object-cover"
                          onLoad={() => console.log('✅ Direct image loaded successfully:', img)}
                          onError={(e) => {
                            console.error('❌ Direct image failed to load:', img);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                          Direct Image Working
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">
                        No image URL
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mb-2 mt-4">SimpleImageUpload Component:</p>
                  <SimpleImageUpload
                    value={img}
                    onChange={(url: string) => {
                      console.log('Image upload changed to:', url);
                      const arr = [...formData.images]; arr[idx] = url; handleChange('images', arr)
                    }}
                    onDelete={() => {
                      const arr = formData.images.filter((_, i) => i !== idx); handleChange('images', arr)
                    }}
                    alt=""
                    className="max-w-md"
                  />
                  <p className="text-xs text-gray-400 mt-1">URL: {img.substring(0, 50)}...</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => {
                  if (img) {
                    console.log('Setting gallery image as main:', img);
                    handleChange('mainImage', img)
                  }
                }}>Set as Main</Button>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => handleChange('images', [...formData.images, ''])}>Add Image</Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button type="button" onClick={runAIGenerate} disabled={aiLoading}>
            {aiLoading ? 'Generating…' : 'Generate via AI'}
          </Button>
        </div>
        
        {/* Debug Section */}
        <div className="mt-4 p-3 bg-gray-50 rounded text-xs">
          <p><strong>Debug Info:</strong></p>
          <p>Main Image URL: {formData.mainImage || 'None'}</p>
          <p>Gallery Images: {formData.images.length} images</p>
          {formData.images.map((url, idx) => (
            <p key={idx}>- Image {idx + 1}: {url.substring(0, 60)}...</p>
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white rounded-lg border p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Product Name</label>
          <input className="w-full border rounded px-3 py-2" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">SKU</label>
          <input className="w-full border rounded px-3 py-2" value={formData.sku} onChange={(e) => handleChange('sku', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Brand</label>
          <input className="w-full border rounded px-3 py-2" value={formData.brand} onChange={(e) => handleChange('brand', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input className="w-full border rounded px-3 py-2" value={formData.category} onChange={(e) => handleChange('category', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subcategory</label>
          <input className="w-full border rounded px-3 py-2" value={formData.subcategory} onChange={(e) => handleChange('subcategory', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Barcode</label>
          <input className="w-full border rounded px-3 py-2" value={formData.barcode} onChange={(e) => handleChange('barcode', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Price</label>
          <input className="w-full border rounded px-3 py-2" type="number" step="0.01" value={formData.price} onChange={(e) => handleChange('price', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Original Price</label>
          <input className="w-full border rounded px-3 py-2" type="number" step="0.01" value={formData.originalPrice} onChange={(e) => handleChange('originalPrice', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Cost Price</label>
          <input className="w-full border rounded px-3 py-2" type="number" step="0.01" value={formData.costPrice} onChange={(e) => handleChange('costPrice', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Stock</label>
          <input className="w-full border rounded px-3 py-2" type="number" value={formData.stock} onChange={(e) => handleChange('stock', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Min Stock Level</label>
          <input className="w-full border rounded px-3 py-2" type="number" value={formData.minStockLevel} onChange={(e) => handleChange('minStockLevel', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Weight</label>
          <input className="w-full border rounded px-3 py-2" type="number" step="0.01" value={formData.weight} onChange={(e) => handleChange('weight', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Short Description</label>
          <input className="w-full border rounded px-3 py-2" value={formData.shortDescription} onChange={(e) => handleChange('shortDescription', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea className="w-full border rounded px-3 py-2" rows={5} value={formData.description} onChange={(e) => handleChange('description', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Dimensions</label>
          <input className="w-full border rounded px-3 py-2" value={formData.dimensions} onChange={(e) => handleChange('dimensions', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Materials</label>
          <input className="w-full border rounded px-3 py-2" value={formData.materials} onChange={(e) => handleChange('materials', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Care Instructions</label>
          <textarea className="w-full border rounded px-3 py-2" rows={3} value={formData.care} onChange={(e) => handleChange('care', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Title</label>
          <input className="w-full border rounded px-3 py-2" value={formData.metaTitle} onChange={(e) => handleChange('metaTitle', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Meta Description</label>
          <input className="w-full border rounded px-3 py-2" value={formData.metaDescription} onChange={(e) => handleChange('metaDescription', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Meta Keywords (comma-separated)</label>
          <input className="w-full border rounded px-3 py-2" value={formData.metaKeywords} onChange={(e) => handleChange('metaKeywords', e.target.value)} />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
          <input className="w-full border rounded px-3 py-2" 
            value={formData.tags.join(', ')} 
            onChange={(e) => handleChange('tags', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Colors (comma-separated)</label>
          <input className="w-full border rounded px-3 py-2" 
            value={formData.colors.join(', ')} 
            onChange={(e) => handleChange('colors', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Sizes (comma-separated)</label>
          <input className="w-full border rounded px-3 py-2" 
            value={formData.sizes.join(', ')} 
            onChange={(e) => handleChange('sizes', e.target.value.split(',').map(s => s.trim()).filter(Boolean))} 
          />
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => handleChange('isActive', e.target.checked)} /> Active
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isFeatured} onChange={(e) => handleChange('isFeatured', e.target.checked)} /> Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isNewArrival} onChange={(e) => handleChange('isNewArrival', e.target.checked)} /> New Arrival
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isBestseller} onChange={(e) => handleChange('isBestseller', e.target.checked)} /> Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isOnSale} onChange={(e) => handleChange('isOnSale', e.target.checked)} /> On Sale
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.showInNavigation} onChange={(e) => handleChange('showInNavigation', e.target.checked)} /> Show in Navigation
          </label>
        </div>
      </div>

      {/* Variants - JSON editor for test */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="text-lg font-semibold mb-3">Variants (JSON)</h3>
        <textarea className="w-full border rounded px-3 py-2 font-mono text-xs" rows={8}
          value={JSON.stringify(formData.variants, null, 2)}
          onChange={(e) => { try { handleChange('variants', JSON.parse(e.target.value || '[]')) } catch {} }}
        />
        <div className="mt-2 flex gap-2">
          <Button type="button" variant="outline" onClick={() => handleChange('variants', [...formData.variants, { sku: '', name: 'Default', price: '0', originalPrice: null, stock: '0', isDefault: formData.variants.length === 0, attributes: {}, barcode: '' }])}>Add Variant</Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => setFormData({
          name: '',
          description: '',
          shortDescription: '',
          price: '',
          originalPrice: '',
          costPrice: '',
          sku: '',
          barcode: '',
          category: '',
          subcategory: '',
          brand: '',
          tags: [],
          colors: [],
          sizes: [],
          stock: 0,
          minStockLevel: 5,
          weight: '',
          dimensions: '',
          materials: '',
          care: '',
          isActive: true,
          isFeatured: false,
          isNewArrival: false,
          isBestseller: false,
          isOnSale: false,
          showInNavigation: false,
          metaTitle: '',
          metaDescription: '',
          metaKeywords: '',
          images: [],
          mainImage: '',
          variants: [],
          shipping: {
            freeShipping: false,
            weight: '',
            dimensions: '',
            shippingClass: 'standard'
          }
        })}>Reset</Button>
        <Button type="button" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save (Test)'}</Button>
      </div>
    </div>
  )
}


