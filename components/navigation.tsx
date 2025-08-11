"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Search, ShoppingBag, User, Menu, X, Heart, ChevronDown, Globe, MapPin, LifeBuoy, Crown, LogOut } from "lucide-react"
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
import { categoriesFrontendService } from "@/lib/products-frontend"
import { authService } from "@/lib/auth"
import { useCart } from "@/lib/cart-context"
import { LoginModal } from "@/components/auth/LoginModal"
import { RegisterModal } from "@/components/auth/RegisterModal"

export function Navigation() {
  const { cartCount, wishlistCount } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const navRef = useRef<HTMLDivElement | null>(null)
  const [menuTop, setMenuTop] = useState<number>(80)
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null)
  const [hasMounted, setHasMounted] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  // Desktop account dropdown (hover + click controlled)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const accountOpenTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const accountCloseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [isClient, setIsClient] = useState(false)
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

  // Client-side only effect to prevent hydration issues
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Load user and cart data only on client
  useEffect(() => {
    if (!isClient) return
    
    const loadUserData = async () => {
      try {
        const currentUser = authService.getUser()
        setUser(currentUser)
        
        // Counts are now handled by CartProvider context
      } catch (error) {
        console.error('Error loading user data:', error)
        setUser(null)
      }
    }
    
    loadUserData()
  }, [isClient])

  const handleLogout = async () => {
    await authService.logout()
    setUser(null)
    window.location.reload()
  }

  // Enhanced smooth hover handlers for desktop account dropdown
  const openAccountMenu = () => {
    if (!isDesktop) return
    if (accountCloseTimerRef.current) clearTimeout(accountCloseTimerRef.current)
    if (accountOpenTimerRef.current) clearTimeout(accountOpenTimerRef.current)
    accountOpenTimerRef.current = setTimeout(() => setIsAccountOpen(true), 100)
  }
  const closeAccountMenuDelayed = () => {
    if (!isDesktop) return
    if (accountOpenTimerRef.current) clearTimeout(accountOpenTimerRef.current)
    if (accountCloseTimerRef.current) clearTimeout(accountCloseTimerRef.current)
    accountCloseTimerRef.current = setTimeout(() => setIsAccountOpen(false), 200)
  }
  const cancelAccountClose = () => {
    if (accountCloseTimerRef.current) clearTimeout(accountCloseTimerRef.current)
  }

  const switchToRegister = () => {
    setShowLoginModal(false)
    setShowRegisterModal(true)
  }

  const switchToLogin = () => {
    setShowRegisterModal(false)
    setShowLoginModal(true)
  }

  const openMenu = (menu: string) => {
    if (!isDesktop) return
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    // Luxury timing - immediate open, no delay for premium feel
    openTimerRef.current = setTimeout(() => {
      setActiveDropdown(menu)
    }, 0)
  }

  const closeMenuDelayed = () => {
    if (!isDesktop) return
    if (openTimerRef.current) clearTimeout(openTimerRef.current)
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    // Premium delay - gives user time to navigate without closing too quickly
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 300)
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

  // Ensure client-only dynamic pieces render after hydration to avoid mismatches on mobile
  useEffect(() => {
    setHasMounted(true)
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

  // Lock body scroll only for the mobile drawer (avoid layout shift on desktop)
  useEffect(() => {
    const getScrollbarWidth = () => {
      const scrollDiv = document.createElement('div')
      scrollDiv.style.cssText = 'width: 100px; height: 100px; overflow: scroll; position: absolute; top: -9999px;'
      document.body.appendChild(scrollDiv)
      const scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
      document.body.removeChild(scrollDiv)
      return scrollbarWidth
    }
    
    const lock = () => {
      const scrollbarWidth = getScrollbarWidth()
      document.body.style.setProperty('overflow', 'hidden')
      document.body.style.setProperty('padding-right', `${scrollbarWidth}px`)
    }
    const unlock = () => {
      document.body.style.removeProperty('overflow')
      document.body.style.removeProperty('padding-right')
    }
    if (isMobileMenuOpen) lock()
    else unlock()
    return unlock
  }, [isMobileMenuOpen])

  type MenuItem = { title: string; slug: string }
  type MenuSection = { title: string; items: MenuItem[] }
  type MegaMenu = { categories: MenuSection[]; featured: { title: string; subtitle: string; image: string } }
  const [rootCategories, setRootCategories] = useState<{ title: string; slug: string }[]>([])

  const staticMegaMenu: { women: MegaMenu; men: MegaMenu } = {
    women: {
      categories: [
        { title: "NEW IN", items: [
          { title: "Latest Arrivals", slug: "latest-arrivals" },
          { title: "Trending Now", slug: "trending-now" },
          { title: "Editor's Picks", slug: "editors-picks" },
          { title: "Pre-Order", slug: "pre-order" }
        ]},
        { title: "CLOTHING", items: [
          { title: "Dresses", slug: "dresses" },
          { title: "Tops & Blouses", slug: "tops-blouses" },
          { title: "Jackets & Coats", slug: "jackets-coats" },
          { title: "Knitwear", slug: "knitwear" },
          { title: "Pants", slug: "pants" },
          { title: "Skirts", slug: "skirts" }
        ]},
        { title: "SHOES", items: [
          { title: "Heels", slug: "heels" },
          { title: "Flats", slug: "flats" },
          { title: "Boots", slug: "boots" },
          { title: "Sneakers", slug: "sneakers" },
          { title: "Sandals", slug: "sandals" }
        ]},
        { title: "ACCESSORIES", items: [
          { title: "Bags", slug: "bags" },
          { title: "Jewelry", slug: "jewelry" },
          { title: "Scarves", slug: "scarves" },
          { title: "Belts", slug: "belts" },
          { title: "Sunglasses", slug: "sunglasses" }
        ]},
      ],
      featured: {
        title: "SIGNATURE COLLECTION",
        subtitle: "Sophisticated pieces for the modern woman",
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    },
    men: {
      categories: [
        { title: "NEW IN", items: [
          { title: "Latest Arrivals", slug: "latest-arrivals" },
          { title: "Trending Now", slug: "trending-now" },
          { title: "Essentials", slug: "essentials" },
          { title: "Limited Edition", slug: "limited-edition" }
        ]},
        { title: "CLOTHING", items: [
          { title: "Shirts", slug: "shirts" },
          { title: "T-Shirts & Polos", slug: "t-shirts-polos" },
          { title: "Suits & Blazers", slug: "suits-blazers" },
          { title: "Knitwear", slug: "knitwear" },
          { title: "Pants", slug: "pants" },
          { title: "Denim", slug: "denim" }
        ]},
        { title: "SHOES", items: [
          { title: "Dress Shoes", slug: "dress-shoes" },
          { title: "Sneakers", slug: "sneakers" },
          { title: "Boots", slug: "boots" },
          { title: "Loafers", slug: "loafers" },
          { title: "Casual Shoes", slug: "casual-shoes" }
        ]},
        { title: "ACCESSORIES", items: [
          { title: "Watches", slug: "watches" },
          { title: "Bags", slug: "bags" },
          { title: "Ties", slug: "ties" },
          { title: "Belts", slug: "belts" },
          { title: "Wallets", slug: "wallets" }
        ]},
      ],
      featured: {
        title: "ESSENTIAL COLLECTION",
        subtitle: "Contemporary elegance for the modern gentleman",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      }
    }
  }

  const [womenMenu, setWomenMenu] = useState<MegaMenu>(staticMegaMenu.women)
  const [menMenu, setMenMenu] = useState<MegaMenu>(staticMegaMenu.men)
  const [womenBaseSlug, setWomenBaseSlug] = useState<string>('women')
  const [menBaseSlug, setMenBaseSlug] = useState<string>('men')
  const [menusByRoot, setMenusByRoot] = useState<Record<string, MegaMenu>>({})

  // Build hierarchical menus from categories
  useEffect(() => {
    const loadCategories = async () => {
      const all = await categoriesFrontendService.getAllCategories()
      if (!all || all.length === 0) return

      type Cat = typeof all[number]
      const byId = new Map<string, Cat>()
      const childrenMap = new Map<string | null, Cat[]>()
      all.forEach(c => {
        byId.set(c.id, c)
        const pid = (c.parentId as string | undefined) || null
        if (!childrenMap.has(pid)) childrenMap.set(pid, [])
        childrenMap.get(pid)!.push(c)
      })

      const findRootBySlugOrName = (key: string) => {
        const roots = (childrenMap.get(null) || []).filter(c => c.showInNavigation)
        return (
          roots.find(c => (c.slug || '').toLowerCase() === key) ||
          roots.find(c => (c.displayName || c.name || '').toLowerCase() === key) ||
          null
        )
      }

      // Prepare dynamic root tabs menu from all top-level categories
      const rootsList = (childrenMap.get(null) || [])
        .filter(c => c.showInNavigation)
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.displayName || a.name).localeCompare(b.displayName || b.name))
        .map(c => ({ title: c.displayName || c.name, slug: c.slug }))
      setRootCategories(rootsList)

      const makeMenuFor = (rootKey: 'men' | 'women'): MegaMenu => {
        const roots = (childrenMap.get(null) || []).filter(c => c.showInNavigation)
        let root = findRootBySlugOrName(rootKey)
        if (!root) {
          // Fallback to first/second root by sortOrder then name to keep menu populated
          const sortedRoots = roots.slice().sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0) || (a.displayName || a.name).localeCompare(b.displayName || b.name))
          root = rootKey === 'women' ? sortedRoots[0] : sortedRoots[1] || sortedRoots[0]
          if (!root) return staticMegaMenu[rootKey]
        }
        const level1 = (childrenMap.get(root.id) || []).filter(c => c.showInNavigation)
        const sections: MenuSection[] = level1.map(l1 => {
          const level2 = (childrenMap.get(l1.id) || []).filter(c => c.showInNavigation)
          const items: MenuItem[] = (level2.length > 0 ? level2 : [l1]).map(c => ({
            title: c.displayName || c.name,
            slug: c.slug,
          }))
          return {
            title: (l1.displayName || l1.name || '').toUpperCase(),
            items: items.slice(0, 10),
          }
        })

        // Featured pick: first featured under root, else root
        const featuredCat = level1.find(c => c.isFeatured) || root
        const image = featuredCat.imageUrl || (rootKey === 'women' ? staticMegaMenu.women.featured.image : staticMegaMenu.men.featured.image)
        // update base slug for links
        if (rootKey === 'women') setWomenBaseSlug(root.slug)
        else setMenBaseSlug(root.slug)
        return {
          categories: sections,
          featured: {
            title: (featuredCat.displayName || featuredCat.name || '').toUpperCase(),
            subtitle: featuredCat.description || (rootKey === 'women' ? staticMegaMenu.women.featured.subtitle : staticMegaMenu.men.featured.subtitle),
            image,
          }
        }
      }

      const wm = makeMenuFor('women')
      const mm = makeMenuFor('men')
      setWomenMenu(wm)
      setMenMenu(mm)
      const dyn: Record<string, MegaMenu> = {}
      rootsList.forEach(root => {
        dyn[root.slug] = root.slug === (womenBaseSlug || 'women') ? wm : root.slug === (menBaseSlug || 'men') ? mm : makeMenuFor(root.slug as 'women')
      })
      setMenusByRoot(dyn)
    }
    loadCategories()
  }, [])

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
            <div className="hidden lg:flex items-center space-x-16">
              {hasMounted && rootCategories.map((root) => {
                const menu = menusByRoot[root.slug] as MegaMenu | undefined
                if (!menu) return null
                return (
              <div 
                    key={root.slug}
                className="relative group"
                    onMouseEnter={() => openMenu(root.slug)}
                onMouseLeave={closeMenuDelayed}
              >
                <Link 
                      href={`/products?cat=${root.slug}`} 
                  className="text-sm font-medium tracking-wider text-black hover:text-gray-800 transition-all duration-300 py-2 flex items-center relative group/nav overflow-hidden"
                >
                      <span className="relative z-10 transition-transform duration-300 group-hover/nav:scale-[1.02]">
                        {root.title.toUpperCase()}
                      </span>
                  <ChevronDown className="w-3 h-3 ml-1 opacity-60 transition-all duration-300 group-hover:opacity-90 group-hover:rotate-180 group-hover:scale-110" />
                      {/* Premium underline effect */}
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-black via-gray-800 to-black transition-all duration-500 group-hover/nav:w-full" />
                </Link>
                
                <AnimatePresence mode="wait">
                      {isDesktop && activeDropdown === root.slug && (
                    <motion.div 
                      className="fixed left-0 right-0 z-[60] bg-white/96 backdrop-blur-2xl border-t border-neutral-200/60 shadow-[0_20px_80px_rgba(0,0,0,0.12)] overflow-hidden"
                      style={{ top: menuTop }}
                      initial={{ opacity: 0, y: -16, scale: 0.96, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -12, scale: 0.97, filter: "blur(4px)" }}
                      transition={{ 
                        duration: 0.6, 
                        ease: [0.16, 1, 0.3, 1],
                        opacity: { duration: 0.4 },
                        scale: { duration: 0.5 },
                        filter: { duration: 0.3 }
                      }}
                      onMouseEnter={cancelDelayedClose}
                      onMouseLeave={closeMenuDelayed}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/80 to-white/50" />
                      <div className="relative w-full max-w-[1300px] mx-auto px-6 lg:px-8">
                        <div className="py-12 lg:py-16">
                          <div className="text-center mb-10 lg:mb-12">
                            <div className="flex items-center justify-center mb-4">
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                              <Crown className="w-4 h-4 mx-4 text-neutral-400" />
                              <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
                            </div>
                                <h2 className="text-xl font-light tracking-[0.1em] text-black mb-2">{root.title.toUpperCase()}</h2>
                                <p className="text-sm text-neutral-600">{menu.featured.subtitle}</p>
                          </div>
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-16">
                                {menu.categories.map((category, index) => (
                              <motion.div 
                                    key={`${root.slug}-${index}`}
                                className="space-y-6 group/category relative"
                                initial={{ opacity: 0, y: 24, scale: 0.98, filter: "blur(6px)" }}
                                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                                    transition={{ delay: 0.15 + (index * 0.08), duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
                              >
                                <div className="relative">
                                  <h3 className="text-[11px] font-bold tracking-[0.25em] text-black uppercase mb-6 pb-3 border-b border-neutral-200 group-hover/category:border-neutral-400 transition-all duration-400">
                                    {category.title}
                                  </h3>
                                  <div className="absolute bottom-0 left-0 w-0 h-px bg-gradient-to-r from-black to-neutral-600 group-hover/category:w-12 transition-all duration-600 ease-out" />
                                </div>
                                <ul className="space-y-2.5">
                                  {category.items.map((item, itemIndex) => (
                                    <motion.li 
                                          key={item.slug}
                                      initial={{ opacity: 0, x: -12, filter: "blur(2px)" }}
                                      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                                          transition={{ delay: 0.25 + (index * 0.06) + (itemIndex * 0.025), duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                      <Link 
                                            href={`/products?cat=${item.slug}`}
                                        className="group/item text-sm text-neutral-600 hover:text-black transition-all duration-300 block py-1.5 px-1 hover:px-3 rounded-sm relative overflow-hidden hover:bg-gradient-to-r hover:from-neutral-50/80 hover:to-neutral-100/40"
                                      >
                                            <span className="relative z-10 transition-transform duration-200 group-hover/item:translate-x-0.5">{item.title}</span>
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0 h-4 bg-gradient-to-r from-black to-transparent opacity-0 group-hover/item:w-0.5 group-hover/item:opacity-100 transition-all duration-300" />
                                      </Link>
                                    </motion.li>
                                  ))}
                                </ul>
                              </motion.div>
                            ))}
                            <motion.div 
                              className="space-y-5 lg:col-start-5"
                              initial={{ opacity: 0, scale: 0.92, filter: "blur(12px)", rotateY: -10 }}
                              animate={{ opacity: 1, scale: 1, filter: "blur(0px)", rotateY: 0 }}
                                  transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            >
                              <div className="relative h-64 lg:h-80 overflow-hidden shadow-[0_25px_100px_rgba(0,0,0,0.3)] group rounded-lg hover:shadow-[0_35px_120px_rgba(0,0,0,0.4)] transition-all duration-700 hover:scale-[1.02]">
                                    <img src={menu.featured.image} alt={menu.featured.title} className="w-full h-full object-cover transition-all duration-1200 group-hover:scale-115 group-hover:brightness-110 group-hover:saturate-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent group-hover:from-black/75 group-hover:via-black/15 transition-all duration-600" />
                                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="absolute bottom-6 left-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                                      <h4 className="text-lg font-light mb-3 tracking-wide group-hover:tracking-widest transition-all duration-400 drop-shadow-lg">{menu.featured.title}</h4>
                                      <p className="text-xs opacity-85 leading-relaxed mb-4 group-hover:opacity-100 transition-all duration-400 max-w-xs">{menu.featured.subtitle}</p>
                                  <div className="w-6 h-px bg-gradient-to-r from-white/80 to-white/40 group-hover:w-16 transition-all duration-600" />
                                </div>
                                {/* Premium shine effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000" />
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
                )
              })}

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
                  className="fixed inset-0 z-50 bg-gradient-to-b from-black/8 via-black/4 to-black/8 backdrop-blur-sm"
                  style={{ top: menuTop }}
                  initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
                  exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
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
                  <DialogContent className="sm:max-w-2xl fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-h-[90vh] overflow-hidden">
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
                {isClient && user ? (
                  <div 
                    className="relative"
                    onMouseEnter={openAccountMenu}
                    onMouseLeave={closeAccountMenuDelayed}
                  >
                    <DropdownMenu open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 transition-all duration-200 ease-out hover:scale-105 hover:shadow-sm">
                          <User className="h-5 w-5 transition-all duration-200 ease-out" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        sideOffset={8}
                        collisionPadding={8}
                        avoidCollisions={true}
                        sticky="partial"
                        onMouseEnter={cancelAccountClose}
                        onMouseLeave={closeAccountMenuDelayed}
                        className="w-64 rounded-lg shadow-xl border-neutral-200/70 bg-white/95 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:slide-in-from-top-2 data-[state=closed]:slide-out-to-top-2 will-change-transform transition-all duration-200 ease-out overflow-hidden"
                        style={{ maxHeight: 'calc(100vh - 120px)', maxWidth: 'calc(100vw - 40px)' }}
                      >
                        <div className="px-3 py-3 border-b">
                          <p className="text-sm font-medium">
                            Welcome back{user.profile?.displayName ? `, ${user.profile.displayName}` : ''}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
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
                          <button onClick={handleLogout} className="w-full text-left">Sign Out</button>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : isClient ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowLoginModal(true)}
                      className="text-xs tracking-wide uppercase font-medium hover:bg-gray-100"
                    >
                      Sign In
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setShowRegisterModal(true)}
                      className="text-xs tracking-wide uppercase font-medium hover:bg-gray-100"
                    >
                      Register
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-16 bg-gray-100 rounded animate-pulse"></div>
                    <div className="h-8 w-20 bg-gray-100 rounded animate-pulse"></div>
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <div className="hidden md:block">
                <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 relative">
                  <Link href="/wishlist">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {wishlistCount}
                    </span>
                    )}
                  </Link>
                </Button>
              </div>

              {/* Shopping Cart */}
              <Button variant="ghost" size="icon" asChild className="hover:bg-gray-100 relative">
                <Link href="/cart">
                  <ShoppingBag className="h-5 w-5" />
                  {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                  </span>
                  )}
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
              className="fixed right-0 top-0 z-[60] h-[100dvh] w-full max-w-[82vw] sm:max-w-sm bg-white/97 backdrop-blur-xl shadow-2xl flex flex-col overflow-hidden border-l border-neutral-100/60"
              initial={{ x: '100%', scale: 0.96, opacity: 0 }}
              animate={{ x: 0, scale: 1, opacity: 1 }}
              exit={{ x: '100%', scale: 0.96, opacity: 0 }}
              transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.35 }}
            >
              {/* Premium Header */}
              <div className="flex items-center justify-between px-5 py-5 border-b border-neutral-100/50 bg-gradient-to-r from-white/95 to-neutral-50/30">
                <Link href="/" className="text-xl font-light tracking-[0.15em] text-black hover:text-neutral-600 transition-colors duration-300" onClick={() => setIsMobileMenuOpen(false)}>
                  EVELON
                </Link>
                <Button variant="ghost" size="icon" className="hover:bg-neutral-100/60 rounded-full transition-all duration-200 h-8 w-8" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-4 w-4 text-neutral-600" />
                </Button>
              </div>

              {/* Refined Search */}
              <div className="px-4 pt-4 pb-3">
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400 group-focus-within:text-black transition-colors duration-200" />
                  <Input
                    placeholder="Search collections..."
                    className="pl-10 h-10 text-sm bg-neutral-50/60 border-neutral-200/40 focus:bg-white focus:border-black/15 focus:ring-black/5 placeholder:text-neutral-400 rounded-lg transition-all duration-300"
                  />
                </div>
              </div>

              {/* Premium Navigation Sections */}
              <div className="flex-1 overflow-y-auto px-3 py-2">
                {rootCategories.map((root) => {
                  const menu = menusByRoot[root.slug] as MegaMenu | undefined
                  if (!menu) return null
                  const isOpen = openMobileSection === root.slug
                  return (
                    <div className="mb-1" key={`m-${root.slug}`}>
                  <button
                        className="w-full flex items-center justify-between px-3 py-3 text-base font-medium tracking-[0.05em] text-black hover:bg-neutral-50/60 rounded-lg transition-all duration-200 group"
                        onClick={() => setOpenMobileSection(isOpen ? null : root.slug)}
                  >
                        <span>{root.title.toUpperCase()}</span>
                        <ChevronDown className={`h-3.5 w-3.5 text-neutral-400 transition-all duration-300 group-hover:text-black ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence initial={false}>
                        {isOpen && (
                      <motion.div
                            initial={{ height: 0, opacity: 0, scale: 0.96 }}
                        animate={{ height: 'auto', opacity: 1, scale: 1 }}
                            exit={{ height: 0, opacity: 0, scale: 0.96 }}
                            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                            <div className="px-2 pb-2 space-y-1">
                              {menu.categories.map((category, index) => (
                            <motion.div
                                  key={`${root.slug}-${category.title}-${index}`}
                                  initial={{ opacity: 0, x: -8 }}
                              animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03, duration: 0.2 }}
                                  className="mb-2"
                                >
                                  <h4 className="text-[9px] font-bold tracking-[0.15em] text-neutral-400 uppercase mb-1.5 px-2">{category.title}</h4>
                                  <div className="grid grid-cols-2 gap-1">
                                    {category.items.slice(0, 6).map((item, itemIndex) => (
                                  <Link 
                                        key={item.slug} 
                                        href={`/products?cat=${item.slug}`} 
                                        className="block text-xs text-neutral-600 hover:text-black hover:bg-neutral-50/50 px-2 py-1.5 rounded-md transition-all duration-200 truncate" 
                                    onClick={() => setIsMobileMenuOpen(false)}
                                        title={item.title}
                                  >
                                        {item.title}
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
                  )
                })}

                {/* Compact Other Navigation Links */}
                <div className="space-y-1 mt-4 pt-3 border-t border-neutral-100/60">
                  <Link href="/kids" className="block px-3 py-2.5 text-sm font-medium tracking-[0.05em] text-black hover:bg-neutral-50/60 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    KIDS
                  </Link>
                  <Link href="/about" className="block px-3 py-2.5 text-sm font-medium tracking-[0.05em] text-black hover:bg-neutral-50/60 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    ABOUT
                  </Link>
                  <Link href="/sale" className="block px-3 py-2.5 text-sm font-medium tracking-[0.05em] text-red-600 hover:bg-red-50/60 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    SALE
                  </Link>
                  <Link href="/help" className="block px-3 py-2.5 text-sm font-medium tracking-[0.05em] text-neutral-600 hover:bg-neutral-50/60 rounded-lg transition-all duration-200" onClick={() => setIsMobileMenuOpen(false)}>
                    HELP
                  </Link>
                </div>
              </div>

              {/* Compact Footer */}
              <div className="px-4 py-4 border-t border-neutral-100/60 bg-gradient-to-t from-neutral-50/20 to-white/30" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 16px)' }}>
                {/* Account area - simplified luxury style */}
                {isClient && user ? (
                  <div className="mb-2.5">
                    <div className="flex items-center justify-between p-2.5 rounded-lg border border-neutral-200/70 bg-white/80 backdrop-blur-sm">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center border border-neutral-200">
                          <User className="w-3.5 h-3.5 text-neutral-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-black truncate">{user.profile?.displayName || user.email?.split('@')[0] || 'Account'}</p>
                          <p className="text-[11px] text-neutral-500 truncate leading-tight">{user.email}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => { handleLogout(); setIsMobileMenuOpen(false) }}
                        className="p-1.5 rounded-full text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        aria-label="Sign out"
                      >
                        <LogOut className="w-4 h-4" />
                      </button>
                    </div>
                    {/* Compact quick actions */}
                    <div className="mt-1.5 space-y-1">
                      <Link href="/account" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between px-2.5 py-2.5 rounded-md hover:bg-neutral-50 transition-colors">
                        <span className="flex items-center gap-2.5 text-[13px] text-neutral-800">
                          <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-neutral-600" />
                          </span>
                          Account
                        </span>
                        <ChevronDown className="w-3 h-3 text-neutral-400 -rotate-90 group-hover:text-black transition-colors" />
                      </Link>
                      <Link href="/orders" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between px-2.5 py-2.5 rounded-md hover:bg-neutral-50 transition-colors">
                        <span className="flex items-center gap-2.5 text-[13px] text-neutral-800">
                          <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                            <ShoppingBag className="w-3.5 h-3.5 text-neutral-600" />
                          </span>
                          Orders
                        </span>
                        <ChevronDown className="w-3 h-3 text-neutral-400 -rotate-90 group-hover:text-black transition-colors" />
                    </Link>
                      <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="group flex items-center justify-between px-2.5 py-2.5 rounded-md hover:bg-neutral-50 transition-colors">
                        <span className="flex items-center gap-2.5 text-[13px] text-neutral-800">
                          <span className="w-6 h-6 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                            <Heart className="w-3.5 h-3.5 text-neutral-600" />
                          </span>
                          Wishlist
                        </span>
                        <ChevronDown className="w-3 h-3 text-neutral-400 -rotate-90 group-hover:text-black transition-colors" />
                    </Link>
                  </div>
                  </div>
                ) : isClient ? (
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <Button
                        onClick={() => { setShowLoginModal(true); setIsMobileMenuOpen(false) }}
                        className="flex-1 bg-black text-white hover:bg-neutral-800 h-10 text-xs tracking-[0.2em] uppercase rounded-lg"
                      >
                        Sign In
                      </Button>
                      <Button
                        onClick={() => { setShowRegisterModal(true); setIsMobileMenuOpen(false) }}
                        variant="outline"
                        className="flex-1 border-neutral-300 text-neutral-800 hover:bg-neutral-900 hover:text-white h-10 text-xs tracking-[0.2em] uppercase rounded-lg"
                      >
                        Join
                      </Button>
                    </div>
                </div>
                ) : (
                  <div className="mb-3">
                    <div className="flex gap-2">
                      <div className="flex-1 h-10 bg-neutral-100/60 rounded-lg animate-pulse" />
                      <div className="flex-1 h-10 bg-neutral-100/60 rounded-lg animate-pulse" />
                  </div>
                </div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      
      {/* Auth Modals */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={switchToRegister}
      />
      <RegisterModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </>
  )
}