'use client'
import { motion } from 'framer-motion'

const MostRecommendedBadge = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="absolute -top-10 -left-2 px-0.5 z-1"
        >
            {/* Badge with angled right edge */}
            <div className="relative">
                {/* Main badge body with clip-path for angled edge */}
                <div
                    className="bg-orange-500 text-white px-6 pr-12 py-2 text-sm font-bold shadow-lg flex items-center gap-2 rounded-tl-lg"
                    style={{
                        clipPath: 'polygon(0 0, calc(100% - 30px) 0, 100% 100%, calc(100% - 0px) 100%, 0 100%)'
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                    Republic Day Special
                </div>
            </div>
        </motion.div>
    )
}

export default MostRecommendedBadge
