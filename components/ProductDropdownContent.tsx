'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { RainbowButton } from "@/components/magicui/rainbow-button"
import Link from 'next/link'

type ProductType = "CodeMate Terminal" | "CodeMate VS Code Extension" | "CodeMate Web App" | "CodeMate for Education" | "CodeMate Agent";

const products: { title: ProductType; description: string; link: string; icon: string }[] = [
    {
        title: "CodeMate Terminal",
        description: "Boost your productivity with our advanced AI-powered terminal assistant. Get instant code suggestions, error explanations, and command recommendations as you work.",
        link: "/",
        icon: "🖥️"
    },
    {
        title: "CodeMate VS Code Extension",
        description: "Enhance your coding experience in VS Code with AI-driven autocompletions, code refactoring suggestions, and real-time error detection and fixes.",
        link: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details",
        icon: "🧩"
    },
    {
        title: "CodeMate Web App",
        description: "Check detailed analytics or interact with your synced knowledge bases right from your browser. Collaborate seamlessly with your team and get instant coding assistance with our AI chat.",
        link: "https://app.codemate.ai/",
        icon: "💬"
    },
    {
        title: "CodeMate for Education",
        description: "Empower students and educators with our AI-driven learning tools. Create interactive coding exercises, provide personalized feedback, and track progress effortlessly.",
        link: "https://codemate.ai/edu/",
        icon: "🎓"
    }
]

export default function EnhancedMobileProductCard() {
    return (
        <div className="min-h-screen px-6 py-10 space-y-8 pt-20 md:px-12 lg:px-24">
            <header className="text-center mb-10">
                <motion.h1
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.25, ease: "easeInOut" }}
                    className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-50 mb-4">
                    Our Products
                </motion.h1>
                <motion.p
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.25, ease: "easeInOut" }}
                    className="text-zinc-300 text-sm md:text-base lg:text-lg max-w-2xl mx-auto">
                    Discover our range of AI-powered development tools
                </motion.p>
            </header>
            <div className="space-y-8 md:grid md:grid-cols-2 md:gap-8 md:space-y-0 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductItem
                        key={product.title}
                        title={product.title}
                        description={product.description}
                        icon={product.icon}
                        link={product.link}
                    />
                ))}
            </div>
        </div>
    )
}

const ProductItem = ({ title, description, icon, link }: { title: string; description: string; icon: string; link: string }) => {
    const [isOpen, setIsOpen] = React.useState(true)

    return (
        <motion.div
            className="overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/30 backdrop-blur-sm shadow-lg h-full flex flex-col"
            initial={{ y: 25, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.25, ease: "easeInOut" }}
        >
            <motion.button
                className="flex w-full items-center justify-between p-8 text-left"
                onClick={() => setIsOpen(!isOpen)}
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                aria-expanded={isOpen}
            >
                <div className="flex items-center space-x-6">
                    <span className="text-4xl" role="img" aria-hidden="true">{icon}</span>
                    <h2 className="font-semibold text-xl text-zinc-50">{title}</h2>
                </div>
            </motion.button>
            <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 1.25, ease: "easeInOut" }}
                className="flex-grow flex flex-col justify-between"
            >
                <div className="px-8 pb-8 flex-grow">
                    <p className="text-base text-zinc-300 mb-6">{description}</p>
                    <Link href={link} passHref>
                        <RainbowButton className="w-full mt-auto">
                            Learn More
                        </RainbowButton>
                    </Link>
                </div>
            </motion.div>
        </motion.div>
    )
}

