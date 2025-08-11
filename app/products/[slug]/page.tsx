import { notFound } from 'next/navigation'
import Link from 'next/link'
import { productsFrontendService, categoriesFrontendService, type Category } from '@/lib/products-frontend'
import ProductDetailClient from '@/components/product/ProductDetailClient'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const product = await productsFrontendService.getProductBySlug(resolvedParams.slug)
  if (!product) return notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-16 max-w-7xl">

        <ProductDetailClient product={product as any} />

        {/* Premium Reviews Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <ReviewsSection productId={product.id} />
        </div>
      </div>
    </div>
  )
}


async function ReviewsSection({ productId }: { productId: string }) {
  const reviews = await productsFrontendService.getProductReviews(productId)
  const average =
    reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length
      : 0
  
  return (
    <section>
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-12 lg:mb-16">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-px bg-gradient-to-r from-transparent via-neutral-300 to-neutral-300"></div>
          <span className="text-xs tracking-[0.25em] text-neutral-500 uppercase font-light px-6">
            CUSTOMER REVIEWS
          </span>
          <div className="w-12 h-px bg-gradient-to-r from-neutral-300 via-neutral-300 to-transparent"></div>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(average)
                        ? 'text-black'
                        : 'text-neutral-300'
                    }`}
                  >
                    ★
                  </div>
                ))}
              </div>
              <span className="font-medium">{average.toFixed(1)}</span>
            </div>
            <span className="w-1 h-1 rounded-full bg-neutral-300"></span>
            <span className="tracking-wide">
              {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <div className="text-2xl text-neutral-400">★</div>
            </div>
            <h3 className="text-lg font-light tracking-wide text-neutral-900 mb-3">
              No Reviews Yet
            </h3>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Be the first to share your experience with this product.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 lg:gap-10">
          {reviews.slice(0, 5).map((r: any) => (
            <article 
              key={r.id} 
              className="border border-neutral-100 bg-white/80 backdrop-blur-sm p-6 sm:p-8 lg:p-10 transition-all duration-300 hover:shadow-lg hover:border-neutral-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        className={`w-4 h-4 ${
                          star <= (r.rating || 0)
                            ? 'text-black'
                            : 'text-neutral-300'
                        }`}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-neutral-900">
                    {r.rating}/5
                  </span>
                </div>
                {r.createdAt && (
                  <time className="text-xs tracking-wide text-neutral-500 uppercase">
                    {new Date(r.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
              
              {r.title && (
                <h4 className="text-lg font-light tracking-wide text-neutral-900 mb-3">
                  {r.title}
                </h4>
              )}
              
              {r.content && (
                <p className="text-neutral-700 leading-relaxed font-light">
                  {r.content}
                </p>
              )}
            </article>
          ))}
        </div>
      )}
      
      <div className="mt-8 sm:mt-12 text-center">
        <p className="text-xs tracking-wide text-neutral-500 uppercase font-light">
          Enhanced review system and secure payments coming soon
        </p>
      </div>
    </section>
  )
}


