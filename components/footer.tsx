import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone } from "lucide-react"
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
    <footer className="bg-white">
      {/* Clean Newsletter Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-xl lg:text-2xl font-light tracking-wider mb-4">
              STAY UPDATED
            </h2>
            <p className="text-white/80 text-sm mb-6">
              Get exclusive access to new arrivals and special offers.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 h-11 px-4 bg-white/10 border-white/20 focus:border-white text-white placeholder-white/60"
              />
              <Button className="h-11 px-6 bg-white text-black hover:bg-gray-100 font-medium">
                SUBSCRIBE
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8 mb-8">
          
          {/* Company Info */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="text-2xl font-light tracking-[0.2em] text-black mb-4 block">
              EVELON
            </Link>
            <p className="text-neutral-600 text-sm mb-4 leading-relaxed">
              Premium fashion meets modern elegance.
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-neutral-600">
                <Mail className="w-4 h-4 mr-2" />
                hello@evelon.com
              </div>
              <div className="flex items-center text-neutral-600">
                <Phone className="w-4 h-4 mr-2" />
                +1 (555) 123-4567
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-xs font-bold tracking-wider text-black uppercase mb-3">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link 
                      href={link.href}
                      className="text-sm text-neutral-600 hover:text-black transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Social & Apps */}
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            
            {/* Social Media */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-wider text-black uppercase">FOLLOW</span>
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-8 h-8 rounded-full bg-black hover:bg-gray-800 flex items-center justify-center transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4 text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* App Downloads */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold tracking-wider text-black uppercase">GET APP</span>
              <div className="flex gap-2">
                <Link href="#" className="px-3 py-1 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                  iOS
                </Link>
                <Link href="#" className="px-3 py-1 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors">
                  Android
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-neutral-50 border-t border-neutral-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs text-neutral-500">
            
            {/* Copyright */}
            <div className="flex items-center gap-4">
              <span>&copy; 2024 EVELON. All rights reserved.</span>
              <span className="hidden sm:inline">Premium fashion redefined.</span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="hover:text-black transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-black transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="hover:text-black transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}