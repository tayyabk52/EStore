"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  ChevronDown,
  ChevronUp,
  Calendar,
  CreditCard,
  MapPin,
  Eye,
  ExternalLink
} from 'lucide-react'
import { type Order } from '@/lib/profile'

interface OrderHistoryProps {
  orders: Order[]
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'SHIPPED':
        return <Truck className="w-5 h-5 text-blue-600" />
      case 'PROCESSING':
        return <Package className="w-5 h-5 text-amber-600" />
      default:
        return <Clock className="w-5 h-5 text-neutral-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'DELIVERED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'PROCESSING':
        return 'bg-amber-100 text-amber-800 border-amber-200'
      case 'PENDING':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'FAILED':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200'
    }
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-8">
        <h2 className="text-2xl font-light tracking-wide text-black">Order History</h2>
        
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto text-neutral-400 mb-6" />
          <h3 className="text-xl font-light text-neutral-900 mb-4">No orders yet</h3>
          <p className="text-neutral-600 mb-8 max-w-md mx-auto">
            When you make your first purchase, your order history will appear here
          </p>
          <button
            onClick={() => window.location.href = '/products'}
            className="bg-black text-white px-8 py-3 text-sm tracking-wide uppercase font-medium hover:bg-neutral-800 transition-colors rounded-lg"
          >
            Start Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-light tracking-wide text-black">Order History</h2>
        <div className="text-sm text-neutral-600">
          {orders.length} total order{orders.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <motion.div
            key={order.id}
            layout
            className="border border-neutral-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            {/* Order Header */}
            <div className="p-4 sm:p-6 bg-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                  {getStatusIcon(order.status)}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium text-black text-sm sm:text-base truncate">Order #{order.number}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs sm:text-sm text-neutral-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                      <span className="truncate">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-left sm:text-right">
                    <div className="font-medium text-black text-base sm:text-lg">
                      ${order.total.toFixed(2)}
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600">
                      {order.OrderItem.length} item{order.OrderItem.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleOrderExpansion(order.id)}
                    className="p-1.5 sm:p-2 text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    {expandedOrder === order.id ? (
                      <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Status badges */}
              <div className="flex flex-wrap gap-3 mt-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wide font-medium border rounded-full ${getStatusColor(order.status)}`}>
                  Order {order.status}
                </span>
                <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs uppercase tracking-wide font-medium border rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}>
                  <CreditCard className="w-3 h-3" />
                  Payment {order.paymentStatus}
                </span>
              </div>
            </div>

            {/* Expanded Order Details */}
            <AnimatePresence>
              {expandedOrder === order.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-neutral-200 bg-neutral-50/30"
                >
                  <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    
                    {/* Order Items */}
                    <div>
                      <h4 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Order Items</h4>
                      <div className="space-y-3 sm:space-y-4">
                        {order.OrderItem.map((item) => (
                          <div key={item.id} className="flex items-center gap-3 sm:gap-4 bg-white rounded-lg p-3 sm:p-4">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                              {item.imageUrl ? (
                                <img 
                                  src={item.imageUrl} 
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-400" />
                              )}
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-black text-sm sm:text-base truncate">{item.productName}</h5>
                              <div className="text-xs sm:text-sm text-neutral-600 space-y-1">
                                <div>SKU: {item.sku}</div>
                                <div>Qty: {item.quantity}</div>
                              </div>
                            </div>
                            
                            <div className="text-right flex-shrink-0">
                              <div className="font-medium text-black text-sm sm:text-base">
                                ${item.unitPrice.toFixed(2)}
                              </div>
                              <div className="text-xs sm:text-sm text-neutral-600">
                                each
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      
                      {/* Pricing Breakdown */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-medium text-black mb-4">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Subtotal</span>
                            <span className="text-neutral-900">${order.subtotal.toFixed(2)}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount</span>
                              <span>-${order.discount.toFixed(2)}</span>
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Shipping</span>
                            <span className="text-neutral-900">
                              {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-600">Tax</span>
                            <span className="text-neutral-900">${order.tax.toFixed(2)}</span>
                          </div>
                          <div className="border-t border-neutral-200 pt-2 mt-3">
                            <div className="flex justify-between font-medium text-black">
                              <span>Total</span>
                              <span>${order.total.toFixed(2)} {order.currency}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div className="bg-white rounded-lg p-3 sm:p-4">
                        <h4 className="font-medium text-black mb-3 sm:mb-4 text-sm sm:text-base">Order Actions</h4>
                        <div className="space-y-2 sm:space-y-3">
                          <button className="w-full flex items-center justify-center gap-2 bg-black text-white px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-neutral-800 transition-colors rounded-lg">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            View Details
                          </button>
                          
                          {order.status.toUpperCase() === 'SHIPPED' && (
                            <button className="w-full flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-neutral-50 transition-colors rounded-lg">
                              <Truck className="w-3 h-3 sm:w-4 sm:h-4" />
                              Track Package
                            </button>
                          )}
                          
                          {order.status.toUpperCase() === 'DELIVERED' && (
                            <button className="w-full flex items-center justify-center gap-2 border border-neutral-300 text-neutral-700 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-neutral-50 transition-colors rounded-lg">
                              <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                              Leave Review
                            </button>
                          )}
                          
                          {['PENDING', 'PROCESSING'].includes(order.status.toUpperCase()) && (
                            <button className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-700 px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium hover:bg-red-50 transition-colors rounded-lg">
                              Cancel Order
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Order Timeline */}
                    <div className="bg-white rounded-lg p-4">
                      <h4 className="font-medium text-black mb-4">Order Timeline</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium text-black">Order Placed</div>
                            <div className="text-sm text-neutral-600">
                              {new Date(order.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        {order.placedAt && (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <Package className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-black">Order Confirmed</div>
                              <div className="text-sm text-neutral-600">
                                {new Date(order.placedAt).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {order.status.toUpperCase() === 'SHIPPED' && (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                              <Truck className="w-4 h-4 text-amber-600" />
                            </div>
                            <div>
                              <div className="font-medium text-black">Order Shipped</div>
                              <div className="text-sm text-neutral-600">In transit</div>
                            </div>
                          </div>
                        )}
                        
                        {order.status.toUpperCase() === 'DELIVERED' && (
                          <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-black">Order Delivered</div>
                              <div className="text-sm text-neutral-600">Package delivered successfully</div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  )
}