import CartPageClient from '@/components/cart/CartPageClient'

export const metadata = {
  title: 'Shopping Cart - La Elegance',
  description: 'Review your selected items and proceed to checkout.',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl">
        <CartPageClient />
      </div>
    </div>
  )
}