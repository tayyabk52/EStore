"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  User, 
  MapPin, 
  ShoppingBag, 
  Settings, 
  CreditCard,
  Lock,
  Bell,
  Heart,
  LogOut,
  Edit3,
  Plus,
  Crown
} from 'lucide-react'
import { authService } from '@/lib/auth'
import { profileService, type Profile, type Address, type Order } from '@/lib/profile'
import { useCart } from '@/lib/cart-context'
import ProfileSettings from './ProfileSettings'
import AddressManagement from './AddressManagement'
import OrderHistory from './OrderHistory'

type TabKey = 'overview' | 'profile' | 'addresses' | 'orders' | 'settings'

export default function AccountPageClient() {
  const { cartCount, wishlistCount } = useCart()
  const [activeTab, setActiveTab] = useState<TabKey>('overview')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    loadAccountData()
  }, [isClient])

  const loadAccountData = async () => {
    if (!authService.isAuthenticated()) {
      setLoading(false)
      return
    }

    try {
      const currentUser = authService.getUser()
      setUser(currentUser)

      const [profileData, addressesData, ordersData] = await Promise.all([
        profileService.getProfile().catch(() => null),
        profileService.getAddresses().catch(() => []),
        profileService.getOrders(5, 0).catch(() => ({ orders: [] }))
      ])

      setProfile(profileData)
      setAddresses(addressesData)
      setOrders(ordersData.orders || [])
    } catch (error) {
      console.error('Failed to load account data:', error)
      setError('Failed to load account information')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await authService.logout()
    window.location.href = '/'
  }

  const tabs = [
    { key: 'overview' as TabKey, label: 'Overview', icon: User },
    { key: 'profile' as TabKey, label: 'Profile', icon: Edit3 },
    { key: 'addresses' as TabKey, label: 'Addresses', icon: MapPin },
    { key: 'orders' as TabKey, label: 'Orders', icon: ShoppingBag },
    { key: 'settings' as TabKey, label: 'Settings', icon: Settings }
  ]

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white animate-pulse">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-200 rounded-2xl h-64"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!authService.isAuthenticated()) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white flex items-center justify-center">
        <div className="text-center">
          <Crown className="w-16 h-16 mx-auto text-neutral-400 mb-6" />
          <h1 className="text-2xl font-light tracking-wide text-neutral-900 mb-4">
            Sign in Required
          </h1>
          <p className="text-neutral-600 mb-8">
            Please sign in to access your account
          </p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-black text-white px-8 py-3 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors"
          >
            Return Home
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white animate-pulse">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-gray-200 rounded-2xl h-64"></div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-gray-200 rounded-2xl h-96"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50/30 to-white">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 lg:py-16 max-w-7xl">
        
        {/* Page Header */}
        <div className="mb-6 sm:mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
            <Crown className="w-4 h-4 mx-4 text-neutral-400" />
            <div className="w-8 h-px bg-gradient-to-r from-transparent via-neutral-300 to-transparent"></div>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-light tracking-[0.08em] sm:tracking-[0.1em] text-center text-black mb-2 sm:mb-4">
            MY ACCOUNT
          </h1>
          <p className="text-center text-neutral-600 text-sm sm:text-base">
            Welcome back{profile?.displayName ? `, ${profile.displayName}` : ''}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-12">
          
          {/* Mobile Tab Navigation */}
          <div className="lg:hidden mb-5">
            <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-3 shadow-md">
              {/* Mobile Profile Summary */}
              <div className="flex items-center space-x-3 mb-3">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.displayName || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-6 h-6 text-neutral-400" />
                    )}
                  </div>
                  {profile?.isAdmin && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                      <Crown className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-light tracking-wide text-black truncate">
                    {profile?.displayName || user?.email?.split('@')[0] || 'User'}
                  </h3>
                  <p className="text-sm text-neutral-500 truncate">{user?.email}</p>
                  <div className="flex items-center space-x-3 mt-1 text-xs text-neutral-400">
                    <span>{cartCount} Cart</span>
                    <span>{wishlistCount} Wishlist</span>
                  </div>
                </div>
              </div>

              {/* Mobile Tab Selector */}
              <div className="flex overflow-x-auto space-x-2 scrollbar-hide">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex-shrink-0 flex flex-col items-center justify-center px-3 py-2.5 text-center text-[11px] tracking-wide transition-all duration-200 rounded-lg border min-w-[76px] ${
                        isActive
                          ? 'bg-black text-white border-black shadow'
                          : 'text-neutral-700 border-neutral-200 hover:bg-neutral-50 hover:text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="font-medium whitespace-nowrap">{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-6 lg:p-8 shadow-lg sticky top-24">
              
              {/* Profile Summary */}
              <div className="text-center mb-8">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center overflow-hidden">
                    {profile?.avatarUrl ? (
                      <img 
                        src={profile.avatarUrl} 
                        alt={profile.displayName || 'Profile'} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 sm:w-10 sm:h-10 text-neutral-400" />
                    )}
                  </div>
                  {profile?.isAdmin && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-black rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-light tracking-wide text-black mb-1">
                  {profile?.displayName || user?.email?.split('@')[0] || 'User'}
                </h3>
                <p className="text-sm text-neutral-500 mb-4">{user?.email}</p>
                
                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-light text-black mb-1">{cartCount}</div>
                    <div className="text-xs tracking-wide text-neutral-500 uppercase">Cart Items</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-light text-black mb-1">{wishlistCount}</div>
                    <div className="text-xs tracking-wide text-neutral-500 uppercase">Wishlist</div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm tracking-wide transition-all duration-200 rounded-lg ${
                        isActive
                          ? 'bg-black text-white shadow-lg'
                          : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  )
                })}
                
                <div className="pt-4 mt-4 border-t border-neutral-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm tracking-wide text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200 rounded-lg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="col-span-1 lg:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-2xl p-3 sm:p-6 lg:p-8 shadow-lg"
              >
                {activeTab === 'overview' && (
                  <AccountOverview 
                    profile={profile} 
                    addresses={addresses} 
                    orders={orders}
                    onTabChange={setActiveTab}
                  />
                )}
                {activeTab === 'profile' && (
                  <ProfileSettings 
                    profile={profile} 
                    onProfileUpdate={setProfile}
                  />
                )}
                {activeTab === 'addresses' && (
                  <AddressManagement 
                    addresses={addresses} 
                    onAddressesUpdate={setAddresses}
                  />
                )}
                {activeTab === 'orders' && (
                  <OrderHistory orders={orders} />
                )}
                {activeTab === 'settings' && (
                  <AccountSettings user={user} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

// Account Overview Component
function AccountOverview({ 
  profile, 
  addresses, 
  orders,
  onTabChange 
}: { 
  profile: Profile | null
  addresses: Address[]
  orders: Order[]
  onTabChange: (tab: TabKey) => void
}) {
  const defaultAddress = addresses.find(addr => addr.isDefaultShip) || addresses[0]
  const recentOrders = orders.slice(0, 3)

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light tracking-wide text-black mb-6">Account Overview</h2>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange('profile')}
          className="p-6 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <Edit3 className="w-8 h-8 text-neutral-600 mb-4" />
          <h3 className="font-medium text-black mb-2">Edit Profile</h3>
          <p className="text-sm text-neutral-600">Update your personal information</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange('addresses')}
          className="p-6 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <MapPin className="w-8 h-8 text-neutral-600 mb-4" />
          <h3 className="font-medium text-black mb-2">Manage Addresses</h3>
          <p className="text-sm text-neutral-600">{addresses.length} saved addresses</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onTabChange('orders')}
          className="p-6 border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-md transition-all duration-200 text-left"
        >
          <ShoppingBag className="w-8 h-8 text-neutral-600 mb-4" />
          <h3 className="font-medium text-black mb-2">Order History</h3>
          <p className="text-sm text-neutral-600">{orders.length} total orders</p>
        </motion.button>
      </div>

      {/* Default Address */}
      {defaultAddress && (
        <div className="border border-neutral-200 rounded-xl p-6">
          <h3 className="font-medium text-black mb-4">Default Shipping Address</h3>
          <div className="text-sm text-neutral-600 space-y-1">
            <div className="font-medium text-black">{defaultAddress.fullName}</div>
            <div>{defaultAddress.line1}</div>
            {defaultAddress.line2 && <div>{defaultAddress.line2}</div>}
            <div>{defaultAddress.city}, {defaultAddress.region} {defaultAddress.postalCode}</div>
            <div>{defaultAddress.countryCode}</div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div>
          <h3 className="font-medium text-black mb-4">Recent Orders</h3>
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="border border-neutral-200 rounded-xl p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-black">#{order.number}</div>
                    <div className="text-sm text-neutral-600">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-black">${order.total.toFixed(2)}</div>
                    <div className={`text-xs uppercase tracking-wide px-2 py-1 rounded ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </div>
                  </div>
                </div>
                <div className="text-sm text-neutral-600">
                  {order.OrderItem.length} item{order.OrderItem.length !== 1 ? 's' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Account Settings Component
function AccountSettings({ user }: { user: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-light tracking-wide text-black mb-6">Account Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-neutral-600" />
            <h3 className="font-medium text-black">Password & Security</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Manage your password and security settings
          </p>
          <button className="text-sm bg-neutral-100 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-200 transition-colors">
            Update Password
          </button>
        </div>

        <div className="border border-neutral-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-neutral-600" />
            <h3 className="font-medium text-black">Notifications</h3>
          </div>
          <p className="text-sm text-neutral-600 mb-4">
            Control how you receive notifications
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-neutral-300" defaultChecked />
              <span className="text-sm text-neutral-700">Order updates</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-neutral-300" defaultChecked />
              <span className="text-sm text-neutral-700">Promotional emails</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" className="rounded border-neutral-300" />
              <span className="text-sm text-neutral-700">SMS notifications</span>
            </label>
          </div>
        </div>

        <div className="border border-red-200 rounded-xl p-6 bg-red-50/50">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-red-600" />
            <h3 className="font-medium text-red-800">Account Management</h3>
          </div>
          <p className="text-sm text-red-700 mb-4">
            Permanently delete your account and all associated data
          </p>
          <button className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  )
}