import { productsFrontendService, categoriesFrontendService } from "@/lib/products-frontend"
import HomePageContent from "@/components/home/home-page-content"

export default async function HomePage() {
  // Fetch dynamic data
  const [featuredProducts, newArrivals, onSaleProducts, featuredCategories] = await Promise.all([
    productsFrontendService.getFeaturedProducts(6),
    productsFrontendService.getNewArrivals(4),
    productsFrontendService.getOnSaleProducts(4),
    categoriesFrontendService.getFeaturedCategories()
  ])
  
  return (
    <HomePageContent 
      featuredProducts={featuredProducts}
      newArrivals={newArrivals}
      onSaleProducts={onSaleProducts}
      featuredCategories={featuredCategories}
    />
  )
}