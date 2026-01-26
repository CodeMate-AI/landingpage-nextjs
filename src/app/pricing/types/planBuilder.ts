/**
 * Type definitions for Custom Plan Builder
 */

export type FeatureType = 'range' | 'boolean'

/**
 * Base configuration for pricing
 * - value: Price per credit (for range) or fixed price (for boolean) in dollars
 * - worth: Credit worth (optional, for display purposes)
 */
export interface BaseConfig {
    value: number // Price in dollars
    worth?: number // Credits (optional)
}

/**
 * Range feature configuration (e.g., Requests per day, Storage)
 */
export interface RangeFeatureConfig {
    key: string
    title: string
    type: 'range'
    base: BaseConfig
    min: number
    max: number
    step?: number // Default: 1
    defaultValue: number
    unit?: string // e.g., "GB", "requests", "credits"
}

/**
 * Boolean feature configuration (e.g., Image Support, API Access)
 */
export interface BooleanFeatureConfig {
    key: string
    title: string
    type: 'boolean'
    base: BaseConfig
    defaultValue: boolean
    description?: string
}

/**
 * Union type for all feature configurations
 */
export type FeatureConfig = RangeFeatureConfig | BooleanFeatureConfig

/**
 * Product configuration
 */
export interface ProductConfig {
    name: string
    displayName: string
    icon?: string
    features: FeatureConfig[]
    color?: string // Theme color for the product
}

/**
 * Feature state for a single product
 */
export interface ProductFeatureState {
    [featureKey: string]: number | boolean
}

/**
 * Complete feature state across all products
 */
export interface FeatureState {
    [productKey: string]: ProductFeatureState
}

/**
 * Pricing breakdown for a single feature
 */
export interface FeaturePricing {
    featureKey: string
    featureTitle: string
    value: number | boolean
    price: number
}

/**
 * Pricing breakdown for a single product
 */
export interface ProductPricing {
    productName: string
    features: FeaturePricing[]
    subtotal: number
}

/**
 * Complete pricing result
 */
export interface PricingResult {
    products: ProductPricing[]
    total: number
    billingPeriod: 'monthly' | 'yearly'
    yearlyDiscount?: number
}

/**
 * Billing period type
 */
export type BillingPeriod = 'monthly' | 'yearly'
