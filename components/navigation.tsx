"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, Globe, MapPin, LifeBuoy, Crown } from "lucide-react"
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
  const [isDesktop, setIsDesktop] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)
  const [menuTop, setMenuTop] = useState<number>(80)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const topMessages = [
    "Free shipping worldwide",
    "Premium service guaranteed",
    "Welcome to EVELON",
  ]
  const [msgIndex, setMsgIndex] = useState(0)
  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % topMessages.length)
    }, 4000)
    return () => clearInterval(id)
  }, [topMessages.length])

  const openMenu = (menu: string) => {
    if (!isDesktop) return
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    openTimerRef.current = setTimeout(() => {
      setActiveDropdown(menu)
    }, 50)
  }

  const closeMenuDelayed = () => {
    if (!isDesktop) return
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const cancelDelayedClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Match desktop breakpoint and measure nav height for dynamic mega menu top
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener?.('change', update)
    window.addEventListener('resize', update)
    return () => {
      mq.removeEventListener?.('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  useEffect(() => {
    const recalcTop = () => {
      const h = navRef.current?.getBoundingClientRect().height ?? 80
      setMenuTop(Math.ceil(h))
    }
    recalcTop()
    window.addEventListener('resize', recalcTop)
    return () => window.removeEventListener('resize', recalcTop)
  }, [])

  // Lock body scroll only for the mobile drawer
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.documentElement.classList.add('overflow-hidden')
      document.body.classList.add('overflow-hidden')
    } else {
      document.documentElement.classList.remove('overflow-hidden')
      document.body.classList.remove('overflow-hidden')
    }
    return () => {
      document.documentElement.classList.remove('overflow-hidden')
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  const megaMenuData = {
    women: {
      categories: [
        { title: "NEW IN", items: ["Latest Arrivals", "Trending Now", "Editor&apos;s Picks", "Pre-Order"] },
        { title: "CLOTHING", items: ["Dresses", "Tops & Blouses", "Jackets & Coats", "Knitwear", "Pants", "Skirts"] },
        { title: "SHOES", items: ["Heels", "Flats", "Boots", "Sneakers", "Sandals"] },
        { title: "ACCESSORIES", items: ["Bags", "Jewelry", "Scarves", "Belts", "Sunglasses"] },
      ],
      featured: {
        title: "SIGNATURE COLLECTION",
        subtitle: "Sophisticated pieces for the modern woman",
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
        title: "ESSENTIAL COLLECTION",
        subtitle: "Contemporary elegance for the modern gentleman",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    }
  }

  return (
    <>
      {/* Top Bar */}
      <div className="bg-black text-white text-[11px] sm:text-xs tracking-wider">
        <div className="max-w-[100vw] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-8">
            {/* Left utility (desktop) */}
            <div className="hidden md:flex items-center gap-4 text-white/80 justify-self-start">
              <button className="flex items-center gap-1 hover:text-white transition-colors">
                <Globe className="w-3.5 h-3.5" />
                <span>EN</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>
            </div>

            {/* Center rotating message */}
            <div className="flex items-center justify-center justify-self-center">
              <div className="relative h-4 sm:h-5 overflow-hidden">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={msgIndex}
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -10, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                    className="inline-block whitespace-nowrap text-center px-2 text-white/90"
                  >
                    {topMessages[msgIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Right utilities (desktop) */}
            <div className="hidden md:flex items-center gap-5 text-white/80 justify-self-end">
              <Link href="/store-locator" className="flex items-center gap-1 hover:text-white transition-colors">
                <MapPin className="w-3.5 h-3.5" />
                <span>Store Locations</span>
              </Link>
              <Link href="/help" className="flex items-center gap-1 hover:text-white transition-colors">
                <LifeBuoy className="w-3.5 h-3.5" />
                <span>Help</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav ref={navRef} className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white border-b border-gray-100'
      }`}>
        <div className="max-w-[100vw] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">
            
            {/* Logo */}
            <Link href="/" className="text-2xl md:text-3xl font-light tracking-[0.15em] md:tracking-[0.3em] text-black hover:text-gray-600 transition-all duration-300">
              EVELON
            </Link>

            {/* Main Navigation Links */}
            <div className="hidden lg:flex items-center space-x-12">
              {/* Women's Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => openMenu('women')}
                onMouseLeave={closeMenuDelayed}
              >
                <Link 
                  href="/women" 
                  className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors py-2 flex items-center"
                >
                  WOMEN
                  <ChevronDown className="w-3 h-3 ml-1 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                
                <AnimatePresence>
                  {isDesktop && activeDropdown === 'women' && (
                    <motion.div 
                      className="fixed inset-x-0 z-[60] bg-white/98 backdrop-blur-xl border-t border-neutral-100 shadow-[0_8px_60px_rgba(0,0,0,0.08)]"
                      style={{ top: menuTop }}
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.16, 1, 0.3, 1],
                        scale: { duration: 0.3 }
                      }}
                      onMouseEnter={cancelDelayedClose}
                      onMouseLeave={closeMenuDelayed}
                    >
                      {/* Premium Backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white/50" />
                      
                      <div className="relative w-full max-w-[1300px] mx-auto px-6 lg:px-8">
                        <div className="py-12 lg:py-16">
                          {/* Elegant Header */}
                          <div className="text-center mb-10 lg:mb-12">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                              <Crown className="w-4 h-4 mx-4 text-neutral-400" />
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                            </div>
                            <h2 className="text-xl font-light tracking-[0.1em] text-black mb-2">WOMEN&apos;S COLLECTION</h2>
                            <p className="text-sm text-neutral-600">Sophisticated elegance for the modern woman</p>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                            {megaMenuData.women.categories.map((category, index) => (
                              <motion.div 
                                key={index} 
                                className="space-y-5 group"
                                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ 
                                  delay: 0.1 + (index * 0.05), 
                                  duration: 0.5,
                                  ease: [0.16, 1, 0.3, 1]
                                }}
                              >
                                <div className="relative">
                                  <h3 className="text-[11px] font-bold tracking-[0.25em] text-black uppercase mb-6 pb-3 border-b border-neutral-200 group-hover:border-neutral-300 transition-colors duration-300">
                                    {category.title}
                                  </h3>
                                  <div className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-8 transition-all duration-500 ease-out" />
                                </div>
                                <ul className="space-y-1.5">
                                  {category.items.map((item, itemIndex) => (
                                    <motion.li 
                                      key={item}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ 
                                        delay: 0.2 + (index * 0.05) + (itemIndex * 0.02),
                                        duration: 0.3
                                      }}
                                    >
                                      <Link 
                                        href={`/women/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group/item text-sm text-neutral-600 hover:text-black transition-all duration-300 block py-1 hover:pl-3 relative overflow-hidden"
                                      >
                                        <span className="relative z-10">{item}</span>
                                        <div className="absolute inset-0 bg-neutral-50 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left" />
                                      </Link>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                            
                            {/* Enhanced Featured Section */}
                            <motion.div 
                              className="space-y-5 lg:col-start-5"
                              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                              transition={{ 
                                delay: 0.3, 
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                            >
                              <div className="relative h-64 lg:h-80 overflow-hidden shadow-2xl group rounded-sm">
                                <img 
                                  src={megaMenuData.women.featured.image} 
                                  alt={megaMenuData.women.featured.title}
                                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 text-white">
                                  <h4 className="text-lg font-light mb-2 tracking-wide group-hover:tracking-wider transition-all duration-300">
                                    {megaMenuData.women.featured.title}
                                  </h4>
                                  <p className="text-xs opacity-90 leading-relaxed mb-4 group-hover:opacity-100 transition-opacity duration-300">
                                    {megaMenuData.women.featured.subtitle}
                                  </p>
                                  <div className="w-6 h-px bg-white/60 group-hover:w-12 transition-all duration-500" />
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Men's Mega Menu */}
              <div 
                className="relative group"
                onMouseEnter={() => openMenu('men')}
                onMouseLeave={closeMenuDelayed}
              >
                <Link 
                  href="/men" 
                  className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors py-2 flex items-center"
                >
                  MEN
                  <ChevronDown className="w-3 h-3 ml-1 opacity-60 transition-transform duration-200 group-hover:rotate-180" />
                </Link>
                
                <AnimatePresence>
                  {isDesktop && activeDropdown === 'men' && (
                    <motion.div 
                      className="fixed inset-x-0 z-[60] bg-white/98 backdrop-blur-xl border-t border-neutral-100 shadow-[0_8px_60px_rgba(0,0,0,0.08)]"
                      style={{ top: menuTop }}
                      initial={{ opacity: 0, y: -12, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -12, scale: 0.98 }}
                      transition={{ 
                        duration: 0.4, 
                        ease: [0.16, 1, 0.3, 1],
                        scale: { duration: 0.3 }
                      }}
                      onMouseEnter={cancelDelayedClose}
                      onMouseLeave={closeMenuDelayed}
                    >
                      {/* Premium Backdrop */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white/50" />
                      
                      <div className="relative w-full max-w-[1300px] mx-auto px-6 lg:px-8">
                        <div className="py-12 lg:py-16">
                          {/* Elegant Header */}
                          <div className="text-center mb-10 lg:mb-12">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                              <Crown className="w-4 h-4 mx-4 text-neutral-400" />
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                            </div>
                            <h2 className="text-xl font-light tracking-[0.1em] text-black mb-2">MEN&apos;S COLLECTION</h2>
                            <p className="text-sm text-neutral-600">Contemporary elegance for the modern gentleman</p>
                          </div>
                          
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
                            {megaMenuData.men.categories.map((category, index) => (
                              <motion.div 
                                key={index} 
                                className="space-y-5 group"
                                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                                transition={{ 
                                  delay: 0.1 + (index * 0.05), 
                                  duration: 0.5,
                                  ease: [0.16, 1, 0.3, 1]
                                }}
                              >
                                <div className="relative">
                                  <h3 className="text-[11px] font-bold tracking-[0.25em] text-black uppercase mb-6 pb-3 border-b border-neutral-200 group-hover:border-neutral-300 transition-colors duration-300">
                                    {category.title}
                                  </h3>
                                  <div className="absolute bottom-0 left-0 w-0 h-px bg-black group-hover:w-8 transition-all duration-500 ease-out" />
                                </div>
                                <ul className="space-y-4">
                                  {category.items.map((item, itemIndex) => (
                                    <motion.li 
                                      key={item}
                                      initial={{ opacity: 0, x: -10 }}
                                      animate={{ opacity: 1, x: 0 }}
                                      transition={{ 
                                        delay: 0.2 + (index * 0.05) + (itemIndex * 0.02),
                                        duration: 0.3
                                      }}
                                    >
                                      <Link 
                                        href={`/men/${item.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="group/item text-sm text-neutral-600 hover:text-black transition-all duration-300 block py-1.5 hover:pl-3 relative overflow-hidden"
                                      >
                                        <span className="relative z-10">{item}</span>
                                        <div className="absolute inset-0 bg-neutral-50 transform scale-x-0 group-hover/item:scale-x-100 transition-transform duration-300 origin-left" />
                                      </Link>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                            
                            {/* Enhanced Featured Section */}
                            <motion.div 
                              className="space-y-5 lg:col-start-5"
                              initial={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                              transition={{ 
                                delay: 0.3, 
                                duration: 0.6,
                                ease: [0.16, 1, 0.3, 1]
                              }}
                            >
                              <div className="relative h-64 lg:h-80 overflow-hidden shadow-2xl group rounded-sm">
                                <img 
                                  src={megaMenuData.men.featured.image} 
                                  alt={megaMenuData.men.featured.title}
                                  className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 group-hover:brightness-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500" />
                                <div className="absolute bottom-6 left-6 text-white">
                                  <h4 className="text-lg font-light mb-2 tracking-wide group-hover:tracking-wider transition-all duration-300">
                                    {megaMenuData.men.featured.title}
                                  </h4>
                                  <p className="text-xs opacity-90 leading-relaxed mb-4 group-hover:opacity-100 transition-opacity duration-300">
                                    {megaMenuData.men.featured.subtitle}
                                  </p>
                                  <div className="w-6 h-px bg-white/60 group-hover:w-12 transition-all duration-500" />
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Simple Navigation Links */}
              <Link href="/kids" className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors">
                KIDS
              </Link>
              <Link href="/about" className="text-sm font-medium tracking-wider text-black hover:text-gray-600 transition-colors">
                ABOUT
              </Link>
              <Link href="/sale" className="text-sm font-medium tracking-wider text-red-600 hover:text-red-700 transition-colors">
                SALE
              </Link>
            </div>

            {/* Premium Backdrop Overlay */}
            <AnimatePresence>
              {isDesktop && activeDropdown && (
                <motion.div 
                  className="fixed inset-0 z-50 bg-black/5 backdrop-blur-[1px]"
                  style={{ top: menuTop }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onMouseEnter={cancelDelayedClose}
                  onClick={() => setActiveDropdown(null)}
                />
              )}
            </AnimatePresence>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3 md:space-x-6 flex-shrink-0">
              {/* Search */}
              <div className="hidden md:block">
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
                          {['New Arrivals', 'Premium Collection', 'Essential Pieces', 'Limited Edition', 'Accessories'].map((term) => (
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
              </div>

              {/* User Account */}
              <div className="hidden md:block">
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
              </div>

              {/* Wishlist */}
              <div className="hidden md:block">
                <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 relative">
                  <Link href="/wishlist">
                    <Heart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </Link>
                </Button>
              </div>

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

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="fixed inset-0 z-50 lg:hidden backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%)' }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              className="fixed right-0 top-0 z-[60] h-[100dvh] w-full max-w-[85vw] sm:max-w-md bg-white/98 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border-l border-neutral-100"
              initial={{ x: '100%', scale: 0.95, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              exit={{ x: '100%', scale: 0.95, opacity: 0 }}
              transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            >
              {/* Elegant Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-neutral-100 bg-gradient-to-r from-white/90 to-neutral-50/50">
                <Link href="/" className="text-2xl font-light tracking-[0.2em] text-black hover:text-neutral-600 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  EVELON
                </Link>
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100/80 rounded-full transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-5 w-5 text-neutral-600" />
                </Button>
              </div>

              {/* Premium Search */}
              <div className="px-6 pt-6 pb-4">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 group-focus-within:text-black transition-colors duration-200" />
                  <Input
                    placeholder="Search collections..."
                    className="pl-12 h-12 text-sm bg-neutral-50/80 border-neutral-200/50 focus:bg-white focus:border-black/20 focus:ring-black/10 placeholder:text-neutral-400 rounded-lg transition-all duration-300"
                  />
                </div>
              </div>

              {/* Navigation Sections */}
              <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* WOMEN */}
                <div className="mb-2">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-lg font-light tracking-[0.1em] text-black hover:bg-neutral-50/80 rounded-lg transition-all duration-200 group"
                    onClick={() => setOpenMobileSection(openMobileSection === 'women' ? null : 'women')}
                  >
                    <span>WOMEN</span>
                    <ChevronDown className={`h-4 w-4 text-neutral-500 transition-all duration-300 group-hover:text-black ${openMobileSection === 'women' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openMobileSection === 'women' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-1">
                          {megaMenuData.women.categories.map((category, index) => (
                            <motion.div
                              key={category.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="mb-4"
                            >
                              <h4 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2 px-3">{category.title}</h4>
                              <div className="space-y-1">
                                {category.items.slice(0, 4).map((item) => (
                                  <Link 
                                    key={item} 
                                    href={`/women/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                                    className="block text-sm text-neutral-600 hover:text-black hover:bg-neutral-50/60 px-3 py-2 rounded-md transition-all duration-200" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* MEN */}
                <div className="mb-2">
                  <button
                    className="w-full flex items-center justify-between px-4 py-4 text-lg font-light tracking-[0.1em] text-black hover:bg-neutral-50/80 rounded-lg transition-all duration-200 group"
                    onClick={() => setOpenMobileSection(openMobileSection === 'men' ? null : 'men')}
                  >
                    <span>MEN</span>
                    <ChevronDown className={`h-4 w-4 text-neutral-500 transition-all duration-300 group-hover:text-black ${openMobileSection === 'men' ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {openMobileSection === 'men' && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, scale: 0.95 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                        exit={{ height: 0, opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-4 space-y-1">
                          {megaMenuData.men.categories.map((category, index) => (
                            <motion.div
                              key={category.title}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05, duration: 0.2 }}
                              className="mb-4"
                            >
                              <h4 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase mb-2 px-3">{category.title}</h4>
                              <div className="space-y-1">
                                {category.items.slice(0, 4).map((item) => (
                                  <Link 
                                    key={item} 
                                    href={`/men/${item.toLowerCase().replace(/\s+/g, '-')}`} 
                                    className="block text-sm text-neutral-600 hover:text-black hover:bg-neutral-50/60 px-3 py-2 rounded-md transition-all duration-200" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                  >
                                    {item}
                                  </Link>
                                ))}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Other Navigation Links */}
                <div className="space-y-1 mt-6 pt-6 border-t border-neutral-100">
                  <Link href="/kids" className="block px-4 py-4 text-lg font-light tracking-[0.1em] text-black hover:bg-neutral-50/80 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    KIDS
                  </Link>
                  <Link href="/about" className="block px-4 py-4 text-lg font-light tracking-[0.1em] text-black hover:bg-neutral-50/80 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    ABOUT
                  </Link>
                  <Link href="/sale" className="block px-4 py-4 text-lg font-light tracking-[0.1em] text-red-600 hover:bg-red-50/80 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    SALE
                  </Link>
                </div>
              </div>

              {/* Luxury Footer Actions */}
              <div className="px-6 py-6 border-t border-neutral-100 bg-gradient-to-t from-neutral-50/30 to-white/50" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <Link href="/account" className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-black transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="w-4 h-4" />
                      <span>Account</span>
                    </Link>
                    <Link href="/orders" className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-black transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Orders</span>
                    </Link>
                  </div>
                  <Link href="/help" className="flex items-center space-x-2 text-sm text-neutral-600 hover:text-black transition-colors duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    <LifeBuoy className="w-4 h-4" />
                    <span>Help</span>
                  </Link>
                </div>
                
                {/* Premium Brand Badge */}
                <div className="text-center">
                  <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black/5 rounded-full">
                    <Crown className="w-3 h-3 text-neutral-400" />
                    <span className="text-xs tracking-wider text-neutral-500 font-light">PREMIUM COLLECTION</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}