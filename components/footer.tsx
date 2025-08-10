import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  const footerSections = {
    shop: {
      title: "SHOP",
      links: [
        { label: "Women", href: "/women" },
        { label: "Men", href: "/men" },
        { label: "Kids", href: "/kids" },
        { label: "About", href: "/about" },
        { label: "Sale", href: "/sale" },
        { label: "New Arrivals", href: "/products" },
      ]
    },
    company: {
      title: "COMPANY",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Careers", href: "/careers" },
        { label: "Press", href: "/press" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Investors", href: "/investors" },
        { label: "Corporate", href: "/corporate" },
      ]
    },
    help: {
      title: "CUSTOMER CARE",
      links: [
        { label: "Contact Us", href: "/help" },
        { label: "Size Guide", href: "/size-guide" },
        { label: "Shipping & Returns", href: "/shipping" },
        { label: "Payment Methods", href: "/payment" },
        { label: "Product Care", href: "/care" },
        { label: "Store Locator", href: "/store-locator" },
      ]
    },
    account: {
      title: "ACCOUNT",
      links: [
        { label: "Sign In", href: "/login" },
        { label: "Register", href: "/register" },
        { label: "My Orders", href: "/orders" },
        { label: "Wishlist", href: "/wishlist" },
        { label: "Address Book", href: "/addresses" },
        { label: "Profile", href: "/account" },
      ]
    }
  }

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
    { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
  ]

  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Newsletter Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex items-center justify-center mb-4 lg:mb-6">
              <Crown className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
            </div>
            <h2 className="text-xl lg:text-3xl font-light tracking-wider mb-3 lg:mb-4">
              STAY INFORMED
            </h2>
            <p className="text-gray-300 text-sm lg:text-lg mb-6 lg:mb-8 max-w-2xl mx-auto leading-relaxed">
              Exclusive access to new collections, private sales, and styling insights.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-4 lg:mb-6">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 h-10 lg:h-12 px-4 bg-white/10 border-white/20 focus:border-white/50 focus:ring-white/20 text-white placeholder-gray-400"
              />
              <Button className="h-10 lg:h-12 px-6 lg:px-8 bg-white text-black hover:bg-gray-100 font-medium tracking-wide">
                SUBSCRIBE
              </Button>
            </div>
            
            <p className="text-xs text-gray-400">
              Unsubscribe at any time. Privacy policy applies.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-8 lg:mb-12">
          
          {/* Company Info - Hidden on mobile, shown on lg+ */}
          <div className="hidden lg:block lg:col-span-1">
            <Link href="/" className="block mb-6">
              <div className="text-2xl font-light tracking-[0.2em] text-black mb-2">
                EVELON
              </div>
            </Link>
            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              Premium fashion meets modern elegance. Crafted for the discerning wardrobe.
            </p>
            
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-600">hello@evelon.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-3 text-gray-400" />
                <span className="text-gray-600">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Footer Links - Optimized for mobile */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-3 lg:space-y-4">
              <h3 className="text-xs lg:text-sm font-bold tracking-wider text-black uppercase">
                {section.title}
              </h3>
              <ul className="space-y-2 lg:space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-xs lg:text-sm text-gray-600 hover:text-black transition-colors block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Apps */}
        <div className="border-t border-neutral-100 pt-6 lg:pt-8">
          <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
            
            {/* Social Media */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
              <span className="text-xs lg:text-sm font-bold tracking-wider text-black uppercase">FOLLOW</span>
              <div className="flex space-x-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-3 h-3 lg:w-4 lg:h-4 text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* App Downloads - Simplified for mobile */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <span className="text-xs lg:text-sm font-bold tracking-wider text-black uppercase">GET THE APP</span>
              <div className="flex space-x-2 lg:space-x-3">
                <Link href="#" className="transition-opacity hover:opacity-80">
                  <div className="h-8 lg:h-10 bg-black text-white px-3 lg:px-4 py-1 lg:py-2 rounded flex items-center text-[10px] lg:text-xs font-medium">
                    <span>iOS</span>
                  </div>
                </Link>
                <Link href="#" className="transition-opacity hover:opacity-80">
                  <div className="h-8 lg:h-10 bg-black text-white px-3 lg:px-4 py-1 lg:py-2 rounded flex items-center text-[10px] lg:text-xs font-medium">
                    <span>Android</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4 py-4 lg:py-6">
          <div className="flex flex-col space-y-3 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between text-xs text-neutral-500">
            
            {/* Copyright */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <span>&copy; 2024 EVELON. All rights reserved.</span>
              <span className="hidden sm:inline text-neutral-300">•</span>
              <span className="hidden sm:inline">Premium fashion redefined</span>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-3 lg:gap-6 text-[10px] lg:text-xs">
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-black transition-colors">
                Cookies
              </Link>
              <Link href="/accessibility" className="hover:text-black transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}