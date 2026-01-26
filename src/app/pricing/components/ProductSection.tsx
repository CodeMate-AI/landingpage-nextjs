'use client'
import { motion } from 'framer-motion'
import { ProductConfig, ProductFeatureState, RangeFeatureConfig, BooleanFeatureConfig } from '../types/planBuilder'

interface ProductSectionProps {
    config: ProductConfig
    values: ProductFeatureState
    onChange: (featureKey: string, value: number | boolean) => void
    subtotal: number
}

const ProductSection = ({ config, values, onChange, subtotal }: ProductSectionProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-zinc-900 to-zinc-950 rounded-2xl p-6 border border-zinc-800 h-full flex flex-col"
        >
            {/* Product Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: config.color }}
                    />
                    <h3 className="text-xl font-bold text-white">{config.displayName}</h3>
                </div>
                <motion.div
                    key={subtotal}
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-bold text-white"
                >
                    <span className="font-[mulish]">$</span>{subtotal.toFixed(2)}
                    <span className="text-sm text-zinc-400 font-normal ml-2">/month</span>
                </motion.div>
            </div>

            {/* Features */}
            <div className="space-y-6 flex-1">
                {config.features.map((feature) => (
                    <div key={feature.key}>
                        {feature.type === 'range' ? (
                            <RangeControl
                                feature={feature as RangeFeatureConfig}
                                value={values[feature.key] as number ?? feature.defaultValue}
                                onChange={(value) => onChange(feature.key, value)}
                            />
                        ) : (
                            <BooleanControl
                                feature={feature as BooleanFeatureConfig}
                                value={values[feature.key] as boolean ?? feature.defaultValue}
                                onChange={(value) => onChange(feature.key, value)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

// Range Control Component (Slider)
interface RangeControlProps {
    feature: RangeFeatureConfig
    value: number
    onChange: (value: number) => void
}

const RangeControl = ({ feature, value, onChange }: RangeControlProps) => {
    const percentage = ((value - feature.min) / (feature.max - feature.min)) * 100

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <label className="text-zinc-300 text-sm font-medium">{feature.title}</label>
                <div className="text-white font-semibold text-sm">
                    {value.toLocaleString()} {feature.unit || ''}
                </div>
            </div>

            {/* Slider */}
            <input
                type="range"
                min={feature.min}
                max={feature.max}
                step={feature.step || 1}
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, ${feature.base.value ? '#3b82f6' : '#8b5cf6'} 0%, ${feature.base.value ? '#3b82f6' : '#8b5cf6'} ${percentage}%, #3f3f46 ${percentage}%, #3f3f46 100%)`,
                }}
            />

            <div className="flex justify-between mt-1 text-[10px] text-zinc-500">
                <span>{feature.min.toLocaleString()}</span>
                <span className="text-zinc-400">
                    ${(value * feature.base.value).toFixed(2)}
                </span>
                <span>{feature.max.toLocaleString()}</span>
            </div>
        </div>
    )
}

// Boolean Control Component (Checkbox)
interface BooleanControlProps {
    feature: BooleanFeatureConfig
    value: boolean
    onChange: (value: boolean) => void
}

const BooleanControl = ({ feature, value, onChange }: BooleanControlProps) => {
    return (
        <div className="flex items-start gap-3">
            <div className="flex items-center h-5">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="w-4 h-4 text-blue-500 bg-zinc-800 border-zinc-700 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center">
                    <label className="text-zinc-300 text-sm font-medium cursor-pointer" onClick={() => onChange(!value)}>
                        {feature.title}
                    </label>
                    <span className="text-zinc-400 text-xs">
                        {value ? `+$${feature.base.value}` : '$0'}
                    </span>
                </div>
                {feature.description && (
                    <p className="text-zinc-500 text-xs mt-1">{feature.description}</p>
                )}
            </div>
        </div>
    )
}

export default ProductSection
