"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { authService } from '@/lib/auth'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSwitchToRegister?: () => void
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await authService.login(email, password)
      onClose()
      window.location.reload() // Refresh to update auth state
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setPassword('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-hidden will-change-transform">
        <DialogHeader>
          <DialogTitle className="text-2xl font-light tracking-wide text-center">
            Sign In
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-700 border border-red-200 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-3 border border-neutral-200 focus:border-neutral-400 focus:outline-none transition-colors"
              placeholder="Enter your password"
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
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
          
          {onSwitchToRegister && (
            <div className="text-center pt-4">
              <p className="text-sm text-neutral-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-black hover:underline font-medium"
                >
                  Create Account
                </button>
              </p>
            </div>
          )}
        </form>
      </DialogContent>
    </Dialog>
  )
}