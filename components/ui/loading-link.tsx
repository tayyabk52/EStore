"use client"

import Link, { LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { useLoading } from "@/lib/loading-context"
import { ReactNode } from "react"

interface LoadingLinkProps extends LinkProps {
  children: ReactNode
  className?: string
  loadingMessage?: string
  onClick?: () => void
}

export function LoadingLink({ 
  children, 
  href, 
  className = "", 
  loadingMessage,
  onClick,
  ...props 
}: LoadingLinkProps) {
  const router = useRouter()
  const { showLoading } = useLoading()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    
    // Execute custom onClick if provided
    if (onClick) {
      onClick()
    }
    
    // Show loading
    showLoading(loadingMessage)
    
    // Navigate after brief delay for smooth UX
    setTimeout(() => {
      router.push(href.toString())
    }, 100)
  }

  return (
    <Link 
      href={href} 
      className={className} 
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  )
}