import { productsFrontendService, categoriesFrontendService, Category } from '@/lib/products-frontend'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductsListClient from '@/components/product/ProductsListClient'

type Props = { searchParams: Promise<{ cat?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  // Optional ?cat=slug path to filter by category tree
  const params = await searchParams
  const catSlug = params?.cat
  let products: any[]
  let viewRoot: any | null = null
  let allCategories: Category[] = []
  if (catSlug) {
    allCategories = await categoriesFrontendService.getAllCategories()
    const root = allCategories.find((c: any) => c.slug === catSlug)
    if (!root) return notFound()
    const ids = productsFrontendService.getDescendantCategoryIds(allCategories as unknown as Category[], root.id)
    products = await productsFrontendService.getProductsByCategoryIds(ids)
    viewRoot = root
  } else {
    products = await productsFrontendService.getAllProducts({ limit: 24 })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-24">
        {viewRoot ? (
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-light tracking-wider mb-2">{viewRoot.displayName || viewRoot.name}</h1>
            <p className="text-lg text-gray-600">{viewRoot.description || 'Explore all products in this collection'}</p>
          </div>
        ) : (
          <div className="text-center mb-10">
            <h1 className="text-4xl font-light tracking-wider mb-2">ALL PRODUCTS</h1>
            <p className="text-lg text-gray-600">Discover our complete collection</p>
          </div>
        )}

        {viewRoot ? (
          <CategorySections root={viewRoot} allCategories={allCategories} />
        ) : null}

        {products.length === 0 ? (
          <p className="text-center text-gray-500">No products yet.</p>
        ) : (
          <ProductsListClient products={products as any} />
        )}
      </div>
    </div>
  )
}

function CategorySections({ root, allCategories }: { root: any, allCategories: Category[] }) {
  const childrenL1 = allCategories.filter(c => c.parentId === root.id)
  const childrenMap = new Map<string, Category[]>()
  allCategories.forEach(c => {
    if (!c.parentId) return
    if (!childrenMap.has(c.parentId)) childrenMap.set(c.parentId, [])
    childrenMap.get(c.parentId)!.push(c)
  })

  if (childrenL1.length === 0) return null

  return (
    <div className="mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {childrenL1.map((l1) => {
          const l2 = (childrenMap.get(l1.id) || []).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
          return (
            <div key={l1.id} className="bg-white border border-neutral-200 rounded-lg p-5 shadow-sm">
              <div className="mb-3">
                <h3 className="text-xs font-bold tracking-[0.25em] text-black uppercase mb-1">{l1.displayName || l1.name}</h3>
                <div className="w-10 h-[2px] bg-black/80" />
              </div>
              <div className="flex flex-wrap gap-2">
                {l2.length > 0 ? (
                  l2.map(c => (
                    <Link key={c.id} href={`/products?cat=${c.slug}`} className="text-sm text-neutral-600 hover:text-black px-2 py-1 rounded transition-colors">
                      {c.displayName || c.name}
                    </Link>
                  ))
                ) : (
                  <Link href={`/products?cat=${l1.slug}`} className="text-sm text-neutral-600 hover:text-black px-2 py-1 rounded transition-colors">
                    {l1.displayName || l1.name}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}