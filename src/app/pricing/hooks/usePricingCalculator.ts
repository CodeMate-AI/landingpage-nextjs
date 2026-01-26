import { useMemo } from 'react'
import {
    FeatureState,
    PricingResult,
    ProductPricing,
    FeaturePricing,
    BillingPeriod,
    ProductConfig,
} from '../types/planBuilder'

/**
 * Custom hook to calculate pricing based on selected features
 * 
 * Pricing Logic:
 * - Range features: selectedCredits * base.value
 * - Boolean features: base.value (when enabled)
 * - Total: sum of all product prices
 */
export const usePricingCalculator = (
    productConfigs: ProductConfig[],
    featureState: FeatureState,
    billingPeriod: BillingPeriod = 'monthly'
): PricingResult => {
    return useMemo(() => {
        const products: ProductPricing[] = []

        // Calculate pricing for each product
        for (const config of productConfigs) {
            const productState = featureState[config.name] || {}
            const features: FeaturePricing[] = []
            let subtotal = 0

            // Calculate pricing for each feature
            for (const featureConfig of config.features) {
                const featureValue = productState[featureConfig.key]
                let price = 0

                if (featureConfig.type === 'range') {
                    // Range feature: credits * price per credit
                    const credits = typeof featureValue === 'number' ? featureValue : featureConfig.defaultValue
                    price = credits * featureConfig.base.value
                } else if (featureConfig.type === 'boolean') {
                    // Boolean feature: fixed price when enabled
                    const isEnabled = typeof featureValue === 'boolean' ? featureValue : featureConfig.defaultValue
                    price = isEnabled ? featureConfig.base.value : 0
                }

                features.push({
                    featureKey: featureConfig.key,
                    featureTitle: featureConfig.title,
                    value: featureValue ?? (featureConfig.type === 'range' ? featureConfig.defaultValue : featureConfig.defaultValue),
                    price,
                })

                subtotal += price
            }

            products.push({
                productName: config.displayName,
                features,
                subtotal,
            })
        }

        // Calculate total
        const monthlyTotal = products.reduce((sum, product) => sum + product.subtotal, 0)

        // Apply yearly discount (33% savings = pay for 8 months, get 12)
        let total = monthlyTotal
        let yearlyDiscount = 0

        if (billingPeriod === 'yearly') {
            total = monthlyTotal * 12 * 0.67 // 33% discount
            yearlyDiscount = monthlyTotal * 12 * 0.33
        }

        return {
            products,
            total: billingPeriod === 'monthly' ? monthlyTotal : total,
            billingPeriod,
            yearlyDiscount: billingPeriod === 'yearly' ? yearlyDiscount : undefined,
        }
    }, [productConfigs, featureState, billingPeriod])
}
