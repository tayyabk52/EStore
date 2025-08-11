"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { authService } from '@/lib/auth'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToLogin?: () => void
}

export function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long')
      setIsLoading(false)
      return
    }

    try {
      await authService.register(email, password, displayName)
      setSuccess('Account created successfully! Please check your email to verify your account.')
      setEmail('')
      setPassword('')
      setConfirmPassword('')
      setDisplayName('')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setDisplayName('')
    setError('')
    setSuccess('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-hidden will-change-transform">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-wide text-center">
            Create Account
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 text-sm bg-green-50 text-green-700 border border-green-200 rounded">
              {success}
            </div>
          )}
          
          <div>
            <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 mb-2">
              Full Name (Optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Enter your full name"
            />
          </div>
          
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              id="register-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="register-password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              id="register-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Create a password (min. 6 characters)"
            />
          </div>
          
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-neutral-700 mb-2">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Confirm your password"
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full h-12 text-sm tracking-wide uppercase font-medium border-2 transition-all ${
              isLoading
                ? 'bg-neutral-200 text-neutral-500 border-neutral-200 cursor-not-allowed'
                : 'bg-black hover:bg-neutral-800 text-white border-black hover:border-neutral-800'
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
          
          {onSwitchToLogin && (
            <div className="text-center pt-4">
              <p className="text-sm text-neutral-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-black hover:underline font-medium"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}