"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Plus, Edit3, Trash2, Home, Building, Star, X, Save } from 'lucide-react'
import { profileService, type Address } from '@/lib/profile'

interface AddressManagementProps {
  addresses: Address[]
  onAddressesUpdate: (addresses: Address[]) => void
}

export default function AddressManagement({ addresses, onAddressesUpdate }: AddressManagementProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState({
    label: '',
    fullName: '',
    line1: '',
    line2: '',
    city: '',
    region: '',
    postalCode: '',
    countryCode: 'US',
    phone: '',
    isDefaultShip: false,
    isDefaultBill: false
  })

  const resetForm = () => {
    setFormData({
      label: '',
      fullName: '',
      line1: '',
      line2: '',
      city: '',
      region: '',
      postalCode: '',
      countryCode: 'US',
      phone: '',
      isDefaultShip: false,
      isDefaultBill: false
    })
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAdd = () => {
    resetForm()
    setIsAdding(true)
    setEditingId(null)
    setError('')
    setSuccess('')
  }

  const handleEdit = (address: Address) => {
    setFormData({
      label: address.label || '',
      fullName: address.fullName,
      line1: address.line1,
      line2: address.line2 || '',
      city: address.city,
      region: address.region || '',
      postalCode: address.postalCode || '',
      countryCode: address.countryCode,
      phone: address.phone || '',
      isDefaultShip: address.isDefaultShip,
      isDefaultBill: address.isDefaultBill
    })
    setEditingId(address.id)
    setIsAdding(false)
    setError('')
    setSuccess('')
  }

  const handleSave = async () => {
    setLoading(isAdding ? 'adding' : editingId)
    setError('')
    setSuccess('')

    try {
      let updatedAddress: Address

      if (isAdding) {
        updatedAddress = await profileService.createAddress(formData)
        onAddressesUpdate([...addresses, updatedAddress])
        setSuccess('Address added successfully!')
      } else if (editingId) {
        updatedAddress = await profileService.updateAddress(editingId, formData)
        onAddressesUpdate(addresses.map(addr => 
          addr.id === editingId ? updatedAddress : addr
        ))
        setSuccess('Address updated successfully!')
      }

      handleCancel()
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to save address')
    } finally {
      setLoading(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return

    setLoading(id)
    try {
      await profileService.deleteAddress(id)
      onAddressesUpdate(addresses.filter(addr => addr.id !== id))
      setSuccess('Address deleted successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to delete address')
    } finally {
      setLoading(null)
    }
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingId(null)
    resetForm()
    setError('')
  }

  const isFormValid = formData.fullName && formData.line1 && formData.city && formData.countryCode

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-wide text-black">Address Management</h2>
        <button
          onClick={handleAdd}
          disabled={isAdding || editingId !== null}
          className="flex items-center gap-2 bg-black text-white px-6 py-2 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50"
        >
          <Plus className="w-4 h-4" />
          Add Address
        </button>
      </div>

      {/* Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}
      
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
        >
          {success}
        </motion.div>
      )}

      {/* Add/Edit Form */}
      <AnimatePresence>
        {(isAdding || editingId) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border border-neutral-200 rounded-xl p-6 bg-neutral-50/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-black">
                {isAdding ? 'Add New Address' : 'Edit Address'}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  disabled={loading !== null}
                  className="flex items-center gap-2 border border-neutral-300 text-neutral-700 px-4 py-2 text-sm font-medium hover:bg-white transition-colors rounded-lg disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading !== null || !isFormValid}
                  className="flex items-center gap-2 bg-black text-white px-6 py-2 text-sm uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Label */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address Label (Optional)
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange('label', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Home, Work, etc."
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Address Line 1 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  value={formData.line1}
                  onChange={(e) => handleInputChange('line1', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="123 Main Street"
                  required
                />
              </div>

              {/* Address Line 2 */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  value={formData.line2}
                  onChange={(e) => handleInputChange('line2', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Apt 4B"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="New York"
                  required
                />
              </div>

              {/* Region/State */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  State/Region
                </label>
                <input
                  type="text"
                  value={formData.region}
                  onChange={(e) => handleInputChange('region', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="NY"
                />
              </div>

              {/* Postal Code */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange('postalCode', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="10001"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Country *
                </label>
                <select
                  value={formData.countryCode}
                  onChange={(e) => handleInputChange('countryCode', e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  required
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="GB">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                  <option value="ES">Spain</option>
                  <option value="NL">Netherlands</option>
                  <option value="SE">Sweden</option>
                </select>
              </div>

              {/* Default Options */}
              <div className="sm:col-span-2">
                <div className="space-y-3 sm:space-y-0 sm:flex sm:gap-6">
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isDefaultShip}
                      onChange={(e) => handleInputChange('isDefaultShip', e.target.checked)}
                      className="rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-neutral-700">Set as default shipping address</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isDefaultBill}
                      onChange={(e) => handleInputChange('isDefaultBill', e.target.checked)}
                      className="rounded border-neutral-300 text-black focus:ring-black"
                    />
                    <span className="text-sm text-neutral-700">Set as default billing address</span>
                  </label>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 mx-auto text-neutral-400 mb-4" />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">No addresses saved</h3>
          <p className="text-neutral-600 mb-6">Add your first address to make checkout faster</p>
          <button
            onClick={handleAdd}
            className="bg-black text-white px-6 py-3 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg"
          >
            Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {addresses.map((address) => (
            <motion.div
              key={address.id}
              layout
              className="border border-neutral-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {address.label === 'Home' ? (
                    <Home className="w-5 h-5 text-neutral-600" />
                  ) : address.label === 'Work' ? (
                    <Building className="w-5 h-5 text-neutral-600" />
                  ) : (
                    <MapPin className="w-5 h-5 text-neutral-600" />
                  )}
                  <div>
                    <h3 className="font-medium text-black">
                      {address.label || 'Address'}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {address.isDefaultShip && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          <Star className="w-3 h-3" />
                          Default Shipping
                        </span>
                      )}
                      {address.isDefaultBill && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                          <Star className="w-3 h-3" />
                          Default Billing
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-1 sm:gap-2">
                  <button
                    onClick={() => handleEdit(address)}
                    disabled={loading !== null}
                    className="p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    disabled={loading === address.id}
                    className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="text-sm text-neutral-600 space-y-1">
                <div className="font-medium text-black">{address.fullName}</div>
                <div>{address.line1}</div>
                {address.line2 && <div>{address.line2}</div>}
                <div>
                  {address.city}
                  {address.region && `, ${address.region}`}
                  {address.postalCode && ` ${address.postalCode}`}
                </div>
                <div>{address.countryCode}</div>
                {address.phone && <div>{address.phone}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}