/**
 * Currency utility functions for dynamic currency handling
 * Supports multiple currencies including USD, PKR, EUR, GBP, etc.
 */

export interface CurrencyConfig {
  code: string
  symbol: string
  name: string
  position: 'before' | 'after'
  decimalPlaces: number
}

export const SUPPORTED_CURRENCIES: Record<string, CurrencyConfig> = {
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    position: 'before',
    decimalPlaces: 2,
  },
  PKR: {
    code: 'PKR',
    symbol: 'Rs',
    name: 'Pakistani Rupee',
    position: 'before',
    decimalPlaces: 0, // PKR typically doesn't use decimal places
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    position: 'before',
    decimalPlaces: 2,
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    position: 'before',
    decimalPlaces: 2,
  },
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    position: 'before',
    decimalPlaces: 2,
  },
  JPY: {
    code: 'JPY',
    symbol: '¥',
    name: 'Japanese Yen',
    position: 'before',
    decimalPlaces: 0,
  },
  CAD: {
    code: 'CAD',
    symbol: 'C$',
    name: 'Canadian Dollar',
    position: 'before',
    decimalPlaces: 2,
  },
  AUD: {
    code: 'AUD',
    symbol: 'A$',
    name: 'Australian Dollar',
    position: 'before',
    decimalPlaces: 2,
  },
}

// Get default currency from environment or fallback to PKR
export const getDefaultCurrency = (): string => {
  return process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || 'PKR'
}

// Get currency configuration
export const getCurrencyConfig = (currencyCode?: string): CurrencyConfig => {
  const code = currencyCode || getDefaultCurrency()
  return SUPPORTED_CURRENCIES[code] || SUPPORTED_CURRENCIES.USD
}

// Format price with currency symbol
export const formatPrice = (
  amount: number, 
  currencyCode?: string,
  options?: {
    showCode?: boolean
    compact?: boolean
  }
): string => {
  const currency = getCurrencyConfig(currencyCode)
  const { symbol, position, decimalPlaces } = currency
  
  // Format the number with appropriate decimal places
  const formattedAmount = amount.toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
  
  // Handle compact formatting for large numbers
  if (options?.compact && amount >= 1000) {
    const compactAmount = Intl.NumberFormat('en-US', {
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    }).format(amount)
    
    if (position === 'before') {
      return `${symbol}${compactAmount}${options?.showCode ? ` ${currency.code}` : ''}`
    } else {
      return `${compactAmount}${symbol}${options?.showCode ? ` ${currency.code}` : ''}`
    }
  }
  
  // Standard formatting
  if (position === 'before') {
    return `${symbol}${formattedAmount}${options?.showCode ? ` ${currency.code}` : ''}`
  } else {
    return `${formattedAmount}${symbol}${options?.showCode ? ` ${currency.code}` : ''}`
  }
}

// Format price range
export const formatPriceRange = (
  minPrice: number, 
  maxPrice: number, 
  currencyCode?: string,
  options?: {
    showCode?: boolean
    compact?: boolean
  }
): string => {
  const currency = getCurrencyConfig(currencyCode)
  
  // If same price, show single price
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currencyCode, options)
  }
  
  // Show range with currency symbol only once at the beginning
  const min = minPrice.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  })
  
  const max = maxPrice.toLocaleString('en-US', {
    minimumFractionDigits: currency.decimalPlaces,
    maximumFractionDigits: currency.decimalPlaces,
  })
  
  if (currency.position === 'before') {
    return `${currency.symbol}${min} - ${currency.symbol}${max}${options?.showCode ? ` ${currency.code}` : ''}`
  } else {
    return `${min}${currency.symbol} - ${max}${currency.symbol}${options?.showCode ? ` ${currency.code}` : ''}`
  }
}

// Get currency symbol only
export const getCurrencySymbol = (currencyCode?: string): string => {
  const currency = getCurrencyConfig(currencyCode)
  return currency.symbol
}

// Validate currency code
export const isValidCurrencyCode = (code: string): boolean => {
  return code in SUPPORTED_CURRENCIES
}

// Get all supported currencies for dropdowns
export const getAllCurrencies = (): CurrencyConfig[] => {
  return Object.values(SUPPORTED_CURRENCIES)
}