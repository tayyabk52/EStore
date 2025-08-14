import WishlistPageClient from '@/components/wishlist/WishlistPageClient'

export const metadata = {
  title: 'Wishlist - La Elegance',
  description: 'Save your favorite pieces and shop them later.',
}

export default function WishlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-7xl">
        <WishlistPageClient />
      </div>
    </div>
  )
}