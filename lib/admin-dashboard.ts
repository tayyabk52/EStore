import { createClient } from '@supabase/supabase-js'
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export interface DashboardStats {
  totalProducts: number
  totalCategories: number
  totalOrders: number
  totalRevenue: number
  recentProducts: any[]
  recentOrders: any[]
  lowStockProducts: any[]
}

export const adminDashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      // Get total counts
      const [productsCount, categoriesCount, ordersCount] = await Promise.all([
        supabaseAdmin.from('Product').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('Category').select('*', { count: 'exact', head: true }),
        supabaseAdmin.from('Order').select('*', { count: 'exact', head: true })
      ])

      // Get recent products
      const { data: recentProducts } = await supabaseAdmin
        .from('Product')
        .select(`
          *,
          category:Category(name, displayName),
          images:ProductImage(url, isPrimary),
          variants:ProductVariant(price, stock, isDefault)
        `)
        .order('createdAt', { ascending: false })
        .limit(5)

      // Get recent orders
      const { data: recentOrders } = await supabaseAdmin
        .from('Order')
        .select(`
          *,
          items:OrderItem(productName, quantity, unitPrice)
        `)
        .order('createdAt', { ascending: false })
        .limit(5)

      // Get low stock products
      const { data: lowStockProducts } = await supabaseAdmin
        .from('ProductVariant')
        .select(`
          *,
          product:Product(title, slug, images:ProductImage(url, isPrimary))
        `)
        .lt('stock', 10)
        .order('stock', { ascending: true })
        .limit(10)

      // Calculate total revenue from completed orders
      const { data: completedOrders } = await supabaseAdmin
        .from('Order')
        .select('total, currency')
        .eq('status', 'COMPLETED')

      const totalRevenue = completedOrders?.reduce((sum, order) => {
        return sum + Number(order.total || 0)
      }, 0) || 0

      return {
        totalProducts: productsCount.count || 0,
        totalCategories: categoriesCount.count || 0,
        totalOrders: ordersCount.count || 0,
        totalRevenue,
        recentProducts: recentProducts || [],
        recentOrders: recentOrders || [],
        lowStockProducts: lowStockProducts || []
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  },

  async getProductStats() {
    try {
      const { data: products } = await supabaseAdmin
        .from('Product')
        .select(`
          *,
          category:Category(name, displayName),
          variants:ProductVariant(price, stock, isDefault)
        `)

      const stats = {
        total: products?.length || 0,
        active: products?.filter(p => p.isActive).length || 0,
        featured: products?.filter(p => p.isFeatured).length || 0,
        onSale: products?.filter(p => p.isOnSale).length || 0,
        newArrivals: products?.filter(p => p.isNewArrival).length || 0,
        bestsellers: products?.filter(p => p.isBestseller).length || 0,
        byStatus: {
          draft: products?.filter(p => p.status === 'DRAFT').length || 0,
          published: products?.filter(p => p.status === 'PUBLISHED').length || 0,
          archived: products?.filter(p => p.status === 'ARCHIVED').length || 0
        }
      }

      return stats
    } catch (error) {
      console.error('Error fetching product stats:', error)
      throw error
    }
  },

  async getCategoryStats() {
    try {
      const { data: categories } = await supabaseAdmin
        .from('Category')
        .select(`
          *,
          _count:Product(count)
        `)

      const stats = {
        total: categories?.length || 0,
        active: categories?.filter(c => c.isActive).length || 0,
        featured: categories?.filter(c => c.isFeatured).length || 0,
        withProducts: categories?.filter(c => (c as any)._count > 0).length || 0,
        withoutProducts: categories?.filter(c => (c as any)._count === 0).length || 0
      }

      return stats
    } catch (error) {
      console.error('Error fetching category stats:', error)
      throw error
    }
  },

  async getOrderStats() {
    try {
      const { data: orders } = await supabaseAdmin
        .from('Order')
        .select('*')

      const stats = {
        total: orders?.length || 0,
        pending: orders?.filter(o => o.status === 'PENDING').length || 0,
        processing: orders?.filter(o => o.status === 'PROCESSING').length || 0,
        completed: orders?.filter(o => o.status === 'COMPLETED').length || 0,
        cancelled: orders?.filter(o => o.status === 'CANCELLED').length || 0,
        totalRevenue: orders?.reduce((sum, o) => sum + Number(o.total || 0), 0) || 0
      }

      return stats
    } catch (error) {
      console.error('Error fetching order stats:', error)
      throw error
    }
  }
}
