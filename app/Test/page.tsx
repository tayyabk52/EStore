"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ProductForm from "./testProductForm"

export default function TestAIPage() {
  const [message, setMessage] = useState<string>("")
  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">AI Product Form Test</h1>
        <p className="text-gray-600">This page is isolated for safely testing Gemini-powered generation.</p>
      </div>
      {message && (
        <div className="mb-4 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded p-3">{message}</div>
      )}
      <ProductForm onToast={setMessage} />
      <div className="mt-10 text-xs text-gray-500">Test-only page. Safe to delete the <code>app/Test</code> folder later.</div>
    </div>
  )
}


