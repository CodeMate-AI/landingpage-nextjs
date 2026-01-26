import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface BadgeProps {
    children: React.ReactNode
    variant?: 'blue' | 'cyan' | 'purple' | 'green' | 'amber' | 'red' | 'gray'
    showPulse?: boolean
    icon?: React.ReactNode
    className?: string
    animated?: boolean
}

const variantStyles = {
    blue: {
        bg: 'bg-blue-500/10',
        border: 'border-blue-500/20',
        text: 'text-blue-400',
        pulse: 'bg-blue-500',
    },
    cyan: {
        bg: 'bg-cyan-500/10',
        border: 'border-cyan-500/20',
        text: 'text-cyan-400',
        pulse: 'bg-cyan-500',
    },
    purple: {
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/20',
        text: 'text-purple-400',
        pulse: 'bg-purple-500',
    },
    green: {
        bg: 'bg-green-500/10',
        border: 'border-green-500/20',
        text: 'text-green-400',
        pulse: 'bg-green-500',
    },
    amber: {
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        text: 'text-amber-400',
        pulse: 'bg-amber-500',
    },
    red: {
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        text: 'text-red-400',
        pulse: 'bg-red-500',
    },
    gray: {
        bg: 'bg-zinc-500/10',
        border: 'border-zinc-500/20',
        text: 'text-zinc-400',
        pulse: 'bg-zinc-500',
    },
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'blue',
    showPulse = false,
    icon,
    className,
    animated = true,
}) => {
    const styles = variantStyles[variant]

    const BadgeContent = (
        <div
            className={cn(
                'inline-flex items-center gap-2 border rounded-full px-4 py-2',
                styles.bg,
                styles.border,
                className
            )}
        >
            {showPulse && (
                <div className={cn('w-2 h-2 rounded-full animate-pulse', styles.pulse)} />
            )}
            {icon && <span className={styles.text}>{icon}</span>}
            <span className={cn('text-sm font-semibold', styles.text)}>{children}</span>
        </div>
    )

    if (animated) {
        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {BadgeContent}
            </motion.div>
        )
    }

    return BadgeContent
}

export default Badge
