"use client"

import { ReactNode, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Crown, 
  LayoutDashboard,
  Package,
  Folder,
  Star,
  ShoppingCart,
  Users,
  BarChart3,
  Settings,
  Eye,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  User,
  ChevronDown,
  Home,
  Palette,
  Shield,
  RefreshCcw
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface AdminLayoutProps {
  children: ReactNode
  title?: string
  subtitle?: string
}

const ADMIN_SECRET_KEY = process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY || ""

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    description: "Overview & Analytics"
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Inventory Management"
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Folder,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    description: "Product Organization"
  },
  {
    name: "Collections",
    href: "/admin/collections",
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Featured Collections"
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Order Management",
    badge: "Soon"
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    description: "Customer Database",
    badge: "Soon"
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: BarChart3,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    description: "Sales & Insights",
    badge: "Soon"
  }
]

export function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const isCurrentPath = (href: string) => {
    if (href === "/admin") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="min-h-screen bg-gray-50/80">
      {/* Mobile sidebar backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-900/50 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 transform bg-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-gray-200/60 bg-gradient-to-r from-gray-50 to-white">
          <Link href="/admin" className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">EVELON</h1>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6 space-y-2">
            {navigationItems.map((item) => {
              const isActive = isCurrentPath(item.href)
              return (
                <Link
                  key={item.name}
                  href={`${item.href}?key=${ADMIN_SECRET_KEY}`}
                  className="group relative block"
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className={`flex items-center space-x-3 rounded-xl px-4 py-3 transition-all duration-200 hover:bg-gray-50 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-sm border border-blue-200/30'
                      : 'hover:shadow-sm'
                  }`}>
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                      isActive ? item.bgColor : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <item.icon className={`h-4 w-4 ${isActive ? item.color : 'text-gray-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium truncate ${
                          isActive ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {item.name}
                        </p>
                        {item.badge && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className={`text-xs truncate ${
                        isActive ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {item.description}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-1/2 w-1 h-8 -translate-y-1/2 bg-gradient-to-b from-blue-500 to-blue-600 rounded-r-full shadow-sm"
                    />
                  )}
                </Link>
              )
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="px-4 py-4 border-t border-gray-200/60 bg-gray-50/50">
            <div className="space-y-3">
              {/* View Store Button */}
              <Link href="/" target="_blank">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Eye className="mr-2 h-4 w-4" />
                  View Store
                </Button>
              </Link>

              {/* Settings & Logout */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="w-full justify-between">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Admin
                    </div>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Palette className="mr-2 h-4 w-4" />
                    Appearance
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-72">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200/60 shadow-sm sticky top-0 z-30">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                {title && (
                  <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                )}
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden md:block">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search..."
                    className="w-64 pl-9 pr-4 h-9 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </Button>

              {/* Refresh */}
              <Button variant="ghost" size="sm">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          <div className="px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}