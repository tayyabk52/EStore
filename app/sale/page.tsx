import { productsFrontendService } from "@/lib/products-frontend"
import ProductsListClient from "@/components/product/ProductsListClient"

// Force dynamic rendering to avoid stale cache
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function SalePage() {
  const saleProducts = await productsFrontendService.getOnSaleProducts(50)

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light tracking-wider mb-6 text-red-600">SALE</h1>
          <p className="text-lg text-gray-600 mb-8">Exceptional pieces at exceptional prices</p>
          {saleProducts.length === 0 && (
            <p className="text-gray-500">No sale items available at the moment. Check back soon for amazing deals!</p>
          )}
        </div>

        {saleProducts.length > 0 && (
          <ProductsListClient 
            products={saleProducts}
          />
        )}
      </div>
    </div>
  )
}