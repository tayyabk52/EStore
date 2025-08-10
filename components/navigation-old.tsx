"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const megaMenuData = {
    women: {
      categories: [
        { title: "NEW IN", items: ["Latest Arrivals", "Trending Now", "Editor's Picks", "Pre-Order"] },
        { title: "CLOTHING", items: ["Dresses", "Tops & Blouses", "Jackets & Coats", "Knitwear", "Pants", "Skirts"] },
        { title: "SHOES", items: ["Heels", "Flats", "Boots", "Sneakers", "Sandals"] },
        { title: "ACCESSORIES", items: ["Bags", "Jewelry", "Scarves", "Belts", "Sunglasses"] },
      ],
      featured: {
        title: "HERITAGE COLLECTION",
        subtitle: "Phulkari-inspired elegance for the modern woman",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    men: {
      categories: [
        { title: "NEW IN", items: ["Latest Arrivals", "Trending Now", "Essentials", "Limited Edition"] },
        { title: "CLOTHING", items: ["Shirts", "T-Shirts & Polos", "Suits & Blazers", "Knitwear", "Pants", "Denim"] },
        { title: "SHOES", items: ["Dress Shoes", "Sneakers", "Boots", "Loafers", "Casual Shoes"] },
        { title: "ACCESSORIES", items: ["Watches", "Bags", "Ties", "Belts", "Wallets"] },
      ],
      featured: {
        title: "AJRAK COLLECTION",
        subtitle: "Heritage sophistication for the modern gentleman",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white text-xs py-2">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span>Free heritage delivery across Pakistan • Global shipping available</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">خوش آمدید - Welcome to Heritage</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-1 hover:text-gray-300 transition-colors">
                <Globe className="w-3 h-3" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3" />
              </button>
              <Link href="/store-locator" className="hover:text-gray-300 transition-colors">
                Stores in Karachi, Lahore, Islamabad
              </Link>
              <Link href="/help" className="hover:text-gray-300 transition-colors">
                Help
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <div className="text-3xl font-light tracking-[0.3em] text-black hover:text-indigo-600 transition-all duration-300">
                EVELON
              </div>
              <div className="hidden sm:block text-sm text-amber-600 font-light tracking-widest opacity-70">
                إيفيلون
              </div>
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              {/* Women's Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('women')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href="/category/women" 
                  className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors py-2 flex items-center"
                >
                  WOMEN
                  <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                </Link>
                
                {activeDropdown === 'women' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white shadow-2xl border-t border-gray-100 mt-0">
                    <div className="p-12">
                      <div className="grid grid-cols-5 gap-8">
                        {megaMenuData.women.categories.map((category, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-xs font-semibold tracking-wider text-black mb-4">
                              {category.title}
                            </h3>
                            <ul className="space-y-3">
                              {category.items.map((item) => (
                                <li key={item}>
                                  <Link 
                                    href={`/category/women/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="space-y-4">
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={megaMenuData.women.featured.image} 
                              alt={megaMenuData.women.featured.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <h4 className="text-sm font-medium mb-1">
                                {megaMenuData.women.featured.title}
                              </h4>
                              <p className="text-xs opacity-90">
                                {megaMenuData.women.featured.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Men's Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => setActiveDropdown('men')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link 
                  href="/category/men" 
                  className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors py-2 flex items-center"
                >
                  MEN
                  <ChevronDown className="w-3 h-3 ml-1 opacity-60" />
                </Link>
                
                {activeDropdown === 'men' && (
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-screen max-w-6xl bg-white shadow-2xl border-t border-gray-100 mt-0">
                    <div className="p-12">
                      <div className="grid grid-cols-5 gap-8">
                        {megaMenuData.men.categories.map((category, index) => (
                          <div key={index} className="space-y-4">
                            <h3 className="text-xs font-semibold tracking-wider text-black mb-4">
                              {category.title}
                            </h3>
                            <ul className="space-y-3">
                              {category.items.map((item) => (
                                <li key={item}>
                                  <Link 
                                    href={`/category/men/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm text-gray-600 hover:text-black transition-colors"
                                  >
                                    {item}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="space-y-4">
                          <div className="relative h-64 overflow-hidden">
                            <img 
                              src={megaMenuData.men.featured.image} 
                              alt={megaMenuData.men.featured.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20" />
                            <div className="absolute bottom-4 left-4 text-white">
                              <h4 className="text-sm font-medium mb-1">
                                {megaMenuData.men.featured.title}
                              </h4>
                              <p className="text-xs opacity-90">
                                {megaMenuData.men.featured.subtitle}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Simple Navigation Links */}
              <Link href="/category/kids" className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors">
                KIDS
              </Link>
              <Link href="/evelon-heritage" className="text-sm font-medium tracking-wider text-amber-700 hover:text-amber-800 transition-colors">
                HERITAGE
              </Link>
              <Link href="/sale" className="text-sm font-medium tracking-wider text-red-600 hover:text-red-700 transition-colors">
                SALE
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-6">
              {/* Search */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <Search className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <div className="space-y-6 p-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">Search</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Search for products, brands, or styles..."
                          className="pl-10 h-12 text-base"
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-600 tracking-wider">TRENDING SEARCHES</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Heritage Collection', 'Ajrak Patterns', 'Phulkari Dresses', 'Premium Leather', 'Artisan Accessories'].map((term) => (
                          <button 
                            key={term}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* User Account */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-3 border-b">
                    <p className="text-sm font-medium">Welcome back</p>
                    <p className="text-xs text-gray-500">Manage your account and orders</p>
                  </div>
                  <DropdownMenuItem>
                    <Link href="/account" className="w-full">My Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/orders" className="w-full">Order History</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/wishlist" className="w-full">Wishlist</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="/help" className="w-full">Customer Service</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/logout" className="w-full">Sign Out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Wishlist */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 relative">
                <Link href="/wishlist">
                  <Heart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </Link>
              </Button>

              {/* Shopping Cart */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 relative">
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    2
                  </span>
                </Link>
              </Button>

              {/* Mobile Menu */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden hover:bg-gray-100"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-medium">Menu</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <Link 
                  href="/category/women"
                  className="block text-lg font-medium text-black py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  WOMEN
                </Link>
                <Link 
                  href="/category/men"
                  className="block text-lg font-medium text-black py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  MEN
                </Link>
                <Link 
                  href="/category/kids"
                  className="block text-lg font-medium text-black py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  KIDS
                </Link>
                <Link 
                  href="/category/home"
                  className="block text-lg font-medium text-black py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  HOME
                </Link>
                <Link 
                  href="/sale"
                  className="block text-lg font-medium text-red-600 py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  SALE
                </Link>
              </div>
              
              <div className="border-t pt-6 space-y-4">
                <Link 
                  href="/account"
                  className="block text-sm text-gray-600 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Account
                </Link>
                <Link 
                  href="/orders"
                  className="block text-sm text-gray-600 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Order History
                </Link>
                <Link 
                  href="/wishlist"
                  className="block text-sm text-gray-600 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Wishlist
                </Link>
                <Link 
                  href="/help"
                  className="block text-sm text-gray-600 py-1"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Customer Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}