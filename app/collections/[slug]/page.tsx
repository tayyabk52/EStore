import { notFound } from "next/navigation"
import { collectionsService } from "@/lib/products-frontend"
import ProductsListClient from "@/components/product/ProductsListClient"

export default async function CollectionPage({ params }: { params: { slug: string } }) {
  const collection = await collectionsService.getCollectionBySlug(params.slug)
  const products = await collectionsService.getProductsForCollection(params.slug)

  if (!collection) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-light tracking-wider mb-6 text-black">
            {collection.name.toUpperCase()}
          </h1>
          {collection.description && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {collection.description}
            </p>
          )}
        </div>

        {collection.imageUrl && (
          <div className="mb-16">
            <div className="relative h-96 md:h-[500px] overflow-hidden rounded-lg">
              <img 
                src={collection.imageUrl} 
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div>
        )}

        {products.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-600 mb-8">
              Products in this collection are coming soon.
            </p>
            <p className="text-sm text-gray-500">
              Check back soon for amazing products in the {collection.name} collection!
            </p>
          </div>
        ) : (
          <ProductsListClient products={products as any} />
        )}
      </div>
    </div>
  )
}