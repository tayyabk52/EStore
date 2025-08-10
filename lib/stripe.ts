import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const getStripe = async () => {
  if (typeof window !== 'undefined') {
    const { loadStripe } = await import('@stripe/stripe-js')
    return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return null
} 