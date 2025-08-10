"use client"

import { Shield, Lock, ArrowLeft, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AccessDenied() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-red-600" />
          </div>
          <Lock className="w-8 h-8 text-red-500 mx-auto" />
        </div>

        {/* Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-lg text-gray-600 mb-6">
          You don't have permission to access the admin panel.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          Please contact your store administrator for the correct access credentials.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/">
            <Button className="w-full bg-blue-600 hover:bg-blue-700">
              <Home className="w-4 h-4 mr-2" />
              Return to Store
            </Button>
          </Link>
          
          <div className="text-xs text-gray-400">
            <p>Admin access requires a valid secret key</p>
            <p>Format: yourstore.com/admin?key=YOUR_SECRET_KEY</p>
          </div>
        </div>
      </div>
    </div>
  )
} 