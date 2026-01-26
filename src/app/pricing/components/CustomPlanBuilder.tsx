'use client'
import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { FeatureState, BillingPeriod } from '../types/planBuilder'
import { allProductConfigs } from '../config/productConfigs'
import { usePricingCalculator } from '../hooks/usePricingCalculator'
import ProductSection from './ProductSection'
import PricingSummary from './PricingSummary'

const CustomPlanBuilder = () => {
    const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

    // Initialize feature state with default values
    const [featureState, setFeatureState] = useState<FeatureState>(() => {
        const initialState: FeatureState = {}

        allProductConfigs.forEach((config) => {
            initialState[config.name] = {}
            config.features.forEach((feature) => {
                initialState[config.name][feature.key] = feature.defaultValue
            })
        })

        return initialState
    })

    // Calculate pricing
    const pricing = usePricingCalculator(allProductConfigs, featureState, billingPeriod)

    // Handle feature value change
    const handleFeatureChange = (productName: string, featureKey: string, value: number | boolean) => {
        setFeatureState((prev) => ({
            ...prev,
            [productName]: {
                ...prev[productName],
                [featureKey]: value,
            },
        }))
    }

    // Get subtotal for a specific product
    const getProductSubtotal = (productName: string): number => {
        const productPricing = pricing.products.find((p) => p.productName === productName)
        return productPricing?.subtotal || 0
    }

    // Preset configurations
    const applyPreset = (preset: 'starter' | 'professional' | 'enterprise') => {
        const presets = {
            starter: {
                build: { credits: 500, imageSupport: false, prioritySupport: false, apiAccess: false },
                c0: { credits: 500, advancedAnalytics: false, teamCollaboration: false, customBranding: false },
                cora: { credits: 500, aiAssistant: false, offlineAccess: false, advancedSecurity: false },
            },
            professional: {
                build: { credits: 2000, imageSupport: true, prioritySupport: true, apiAccess: true },
                c0: { credits: 2000, advancedAnalytics: true, teamCollaboration: true, customBranding: false },
                cora: { credits: 2000, aiAssistant: true, offlineAccess: false, advancedSecurity: true },
            },
            enterprise: {
                build: { credits: 5000, imageSupport: true, prioritySupport: true, apiAccess: true },
                c0: { credits: 5000, advancedAnalytics: true, teamCollaboration: true, customBranding: true },
                cora: { credits: 5000, aiAssistant: true, offlineAccess: true, advancedSecurity: true },
            },
        }

        setFeatureState(presets[preset])
    }

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <motion.h2
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-white mb-4"
                >
                    Design Your Plan
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-zinc-400 text-lg max-w-2xl mx-auto"
                >
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </motion.p>

                {/* Preset Buttons */}
                {/* <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center gap-3 mt-6"
                >
                    <button
                        onClick={() => applyPreset('starter')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700"
                    >
                        Starter
                    </button>
                    <button
                        onClick={() => applyPreset('professional')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700"
                    >
                        Professional
                    </button>
                    <button
                        onClick={() => applyPreset('enterprise')}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-medium rounded-lg transition-colors border border-zinc-700"
                    >
                        Enterprise
                    </button>
                </motion.div> */}
            </div>

            {/* Billing Period Toggle - Matching Reference Image */}
            {/* <div className="flex items-center justify-center gap-2 mb-8">
                <button
                    onClick={() => setBillingPeriod('yearly')}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billingPeriod === 'yearly'
                        ? 'bg-white text-black'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                        }`}
                >
                    Yearly
                </button>
                <button
                    onClick={() => setBillingPeriod('monthly')}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${billingPeriod === 'monthly'
                        ? 'bg-black text-white border border-white'
                        : 'bg-transparent text-zinc-400 hover:text-white'
                        }`}
                >
                    Monthly
                </button>
            </div> */}

            {/* Savings Message */}
            {billingPeriod === 'yearly' && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-sm text-zinc-400 mb-8"
                >
                    Save 33% on a yearly subscription
                </motion.p>
            )}

            {/* Main Grid */}
            <div className="grid lg:grid-cols-4 gap-6">
                {/* Product Sections - 3 columns */}
                <div className="lg:col-span-3 grid md:grid-cols-3 gap-6">
                    {allProductConfigs.map((config, index) => (
                        <motion.div
                            key={config.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <ProductSection
                                config={config}
                                values={featureState[config.name]}
                                onChange={(featureKey, value) => handleFeatureChange(config.name, featureKey, value)}
                                subtotal={getProductSubtotal(config.displayName)}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* Pricing Summary - 1 column */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-1"
                >
                    <PricingSummary
                        pricing={pricing}
                        onBillingPeriodChange={setBillingPeriod}
                    />
                </motion.div>
            </div>

            {/* Additional Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center"
            >
                <p className="text-zinc-500 text-sm">
                    All plans include basic features. Customize your plan by selecting additional features above.
                </p>
            </motion.div>
        </div>
    )
}

export default CustomPlanBuilder
