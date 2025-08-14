"use client"

import { forwardRef, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { ButtonLoading } from "@/components/ui/luxury-loading"
import { cn } from "@/lib/utils"

interface LoadingButtonProps {
  children: ReactNode
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  onClick?: () => void | Promise<void>
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  type?: "button" | "submit" | "reset"
  asChild?: boolean
}

export const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ 
    children, 
    loading = false, 
    loadingText, 
    disabled = false, 
    onClick, 
    className,
    variant = "default",
    size = "default",
    type = "button",
    asChild = false,
    ...props 
  }, ref) => {
    
    const handleClick = async () => {
      if (!onClick || loading || disabled) return
      
      try {
        await onClick()
      } catch (error) {
        console.error('Button click error:', error)
      }
    }

    return (
      <Button
        ref={ref}
        type={type}
        variant={variant}
        size={size}
        disabled={disabled || loading}
        onClick={handleClick}
        className={cn(
          "relative overflow-hidden",
          loading && "cursor-not-allowed",
          className
        )}
        asChild={asChild && !loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center space-x-2">
            <ButtonLoading size={size === "sm" ? "xs" : size === "lg" ? "md" : "sm"} />
            <span className="ml-2">
              {loadingText || (typeof children === "string" ? children : "Loading...")}
            </span>
          </div>
        ) : (
          children
        )}
      </Button>
    )
  }
)

LoadingButton.displayName = "LoadingButton"