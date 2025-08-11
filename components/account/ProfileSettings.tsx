"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Camera, Save, X } from 'lucide-react'
import { profileService, type Profile } from '@/lib/profile'

interface ProfileSettingsProps {
  profile: Profile | null
  onProfileUpdate: (profile: Profile) => void
}

export default function ProfileSettings({ profile, onProfileUpdate }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const [formData, setFormData] = useState({
    displayName: profile?.displayName || '',
    phone: profile?.phone || '',
    avatarUrl: profile?.avatarUrl || ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const updatedProfile = await profileService.updateProfile(formData)
      onProfileUpdate(updatedProfile)
      setIsEditing(false)
      setSuccess('Profile updated successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: profile?.displayName || '',
      phone: profile?.phone || '',
      avatarUrl: profile?.avatarUrl || ''
    })
    setIsEditing(false)
    setError('')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-wide text-black">Profile Settings</h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-black text-white px-6 py-2 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg"
          >
            <User className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2 border border-neutral-300 text-neutral-700 px-4 py-2 text-sm tracking-wide font-medium hover:bg-neutral-50 transition-colors rounded-lg disabled:opacity-50"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-black text-white px-6 py-2 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
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

      {/* Profile Form */}
      <div className="space-y-6 sm:space-y-8">
        
        {/* Avatar Section */}
        <div className="text-center">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
              {formData.avatarUrl ? (
                <img 
                  src={formData.avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 sm:w-16 sm:h-16 text-neutral-400" />
              )}
            </div>
            {isEditing && (
              <button className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-8 h-8 sm:w-10 sm:h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors">
                <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>
          
          {isEditing && (
            <div className="max-w-full sm:max-w-md mx-auto px-2 sm:px-0">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Avatar URL
              </label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => handleInputChange('avatarUrl', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          
          {/* Display Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">
              Display Name
            </label>
            {isEditing ? (
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="Enter your display name"
              />
            ) : (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50 rounded-lg text-neutral-900 text-sm sm:text-base">
                {profile?.displayName || 'Not set'}
              </div>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">
              Phone Number
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                placeholder="+1 (555) 123-4567"
              />
            ) : (
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50 rounded-lg text-neutral-900 text-sm sm:text-base">
                {profile?.phone || 'Not set'}
              </div>
            )}
          </div>

          {/* Email (Read-only) */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">
              Email Address
            </label>
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50 rounded-lg text-neutral-600 text-sm sm:text-base">
              {profile ? 'Connected via Supabase Auth' : 'Not available'}
              <div className="text-xs mt-1 text-neutral-500">
                Email cannot be changed from this interface
              </div>
            </div>
          </div>

          {/* Account Type */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-2 sm:mb-3">
              Account Type
            </label>
            <div className="px-3 sm:px-4 py-2 sm:py-3 bg-neutral-50 rounded-lg">
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs uppercase tracking-wide font-medium ${
                profile?.isAdmin 
                  ? 'bg-black text-white' 
                  : 'bg-neutral-200 text-neutral-700'
              }`}>
                {profile?.isAdmin && <User className="w-3 h-3" />}
                {profile?.isAdmin ? 'Administrator' : 'Customer'}
              </span>
            </div>
          </div>
        </div>

        {/* Account Info */}
        {profile && (
          <div className="border-t border-neutral-200 pt-6 sm:pt-8">
            <h3 className="font-medium text-black mb-3 sm:mb-4 text-base sm:text-lg">Account Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm">
              <div className="bg-neutral-50/50 rounded-lg p-3 sm:p-4">
                <div className="text-neutral-500 mb-1 text-xs sm:text-sm">Account Created</div>
                <div className="text-neutral-900 font-medium text-sm sm:text-base">
                  {new Date(profile.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
              <div className="bg-neutral-50/50 rounded-lg p-3 sm:p-4">
                <div className="text-neutral-500 mb-1 text-xs sm:text-sm">Last Updated</div>
                <div className="text-neutral-900 font-medium text-sm sm:text-base">
                  {new Date(profile.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}