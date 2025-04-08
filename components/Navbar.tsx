'use client'

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { close, logo, menu, CodeMateDark, CodeMateLight } from "@/public/assets";
import { RainbowButton } from "@/components/magicui/rainbow-button";
import Image from 'next/image';
import Link from 'next/link';

type ProductType = "CodeMate Terminal" | "CodeMate VS Code Extension" | "CodeMate Web App" | "CodeMate for Education";

const products: { title: ProductType; description: string; link: string; icon: string }[] = [
    {
        title: "CodeMate Terminal",
        description: "Boost your productivity with our advanced AI-powered terminal assistant.",
        link: "https://cli.codemate.ai",
        icon: "🖥️"
    },
    {
        title: "CodeMate VS Code Extension",
        description: "Enhance your coding experience in VS Code with AI-driven autocompletions.",
        link: "https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details",
        icon: "🧩"
    },
    {
        title: "CodeMate Web App",
        description: "CodeMate Web App is a web-based code editor for AI-powered development.",
        link: "https://app.codemate.ai/",
        icon: "💬"
    },
    {
        title: "CodeMate for Education",
        description: "Empower students and educators with our AI-driven learning tools.",
        link: "https://codemate.ai/edu/",
        icon: "🎓"
    }
];

const navLinks = [
    {
        id: "home",
        title: "Home",
    },
    {
        id: "features",
        title: "Features",
    },
    {
        id: "product",
        title: "Products",
    },
    {
        id: "clients",
        title: "Clients",
    },
];

const ProductDropdown = ({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) => {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isVisible, onClose]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    ref={dropdownRef}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-16 left-1/2 transform -translate-x-1/2 w-full max-w-2xl z-50 bg-zinc-900/95 backdrop-blur-lg border border-zinc-800 rounded-xl shadow-xl overflow-hidden hidden sm:block"
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                        {products.map((product) => (
                            <Link 
                                href={product.link} 
                                key={product.title}
                                className="group p-4 rounded-lg hover:bg-zinc-800/50 transition-all duration-200"
                            >
                                <div className="flex items-center space-x-3 mb-2">
                                    <span className="text-2xl" role="img" aria-hidden="true">{product.icon}</span>
                                    <h3 className="font-medium text-zinc-100">{product.title}</h3>
                                </div>
                                <p className="text-sm text-zinc-400 group-hover:text-zinc-300 transition-colors">
                                    {product.description}
                                </p>
                            </Link>
                        ))}
                        {/* didnot put this in map coz of the comign soon badge */}
                            <div className="group p-4 rounded-lg transition-all duration-300 ease-in-out hover:bg-zinc-800/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-zinc-900/20">
      <div className="flex items-center space-x-3 mb-2">
        <span className="text-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">🤖</span>
        <h3 className="font-medium text-zinc-100 transition-colors duration-300 group-hover:text-white">
          CodeMate Agent
          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-emerald-900/60 text-emerald-400 rounded-md">
            coming soon
          </span>
        </h3>
      </div>
      <p className="text-sm text-zinc-400 transition-colors duration-300 group-hover:text-zinc-200">
        Generate full-stack applications with your choice of tech stack, from React to Django, Node to PostgreSQL, and
        everything in between.
      </p>
    </div>
                    </div>
                    {/* <div className="p-4 bg-zinc-800/30 border-t border-zinc-800">
                        <Link href="/products" className="text-sm text-zinc-400 hover:text-zinc-200 flex items-center">
                            <span>View all products</span>
                            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div> */}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

const Navbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [productDropdownOpen, setProductDropdownOpen] = useState(false);
    const productLinkRef = useRef<HTMLLIElement>(null);

    const handleProductClick = (e: React.MouseEvent) => {
        e.preventDefault();
        setProductDropdownOpen(!productDropdownOpen);
    };

    const closeProductDropdown = () => {
        setProductDropdownOpen(false);
    };

    return (
        <nav className="w-full flex py-6 justify-between items-center navbar relative px-6 md:px-12">
            <div className="flex items-center">
                <Image src={"/assets/CodeMateDark.png"} alt="CodeMate" width={150} height={52} />
            </div>
            
            <ul className="list-none sm:flex hidden justify-center items-center flex-1">
                {navLinks.map((nav, index) => (
                    <li
                        key={nav.id}
                        ref={nav.id === "product" ? productLinkRef : null}
                        className={`font-poppins font-normal cursor-pointer text-[16px] text-white ${index === navLinks.length - 1 ? 'mr-0' : 'mr-10'}`}
                    >
                        {nav.id === "product" ? (
                            <button 
                                onClick={handleProductClick}
                                className="flex items-center focus:outline-none"
                            >
                                {nav.title}
                                <span className="inline-block ml-1">
                                    {/* <svg 
                                        className={`w-4 h-4 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg> */}
                                </span>
                            </button>
                        ) : (
                            <a href={`#${nav.id}`}>
                                {nav.title}
                            </a>
                        )}
                    </li>
                ))}
            </ul>
            
            {/* <div className="hidden sm:flex">
                <RainbowButton>
                    Get Started
                </RainbowButton>
            </div> */}
            
            <div className="sm:hidden flex flex-1 justify-end items-center">
                <Image 
                    src={mobileMenuOpen ? close : menu}
                    alt="menu"
                    className="object-contain cursor-pointer"
                    width={28}
                    height={28}
                    onClick={() => setMobileMenuOpen((prev) => !prev)} 
                />
                
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[90%] rounded-xl shadow-lg z-10"
                        >
                            <ul className="list-none flex flex-col justify-end items-start flex-1">
                                {navLinks.map((nav, index) => (
                                    <li
                                        key={nav.id}
                                        className={`font-poppins font-normal cursor-pointer text-[16px] text-white w-full ${index === navLinks.length - 1 ? 'mb-0' : 'mb-4'}`}
                                    >
                                        {nav.id === "product" ? (
                                            <div>
                                                <button 
                                                    className="flex items-center justify-between w-full"
                                                    onClick={() => setProductDropdownOpen(!productDropdownOpen)}
                                                >
                                                    <span>{nav.title}</span>
                                                    {/* <svg 
                                                        className={`w-4 h-4 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180' : ''}`} 
                                                        fill="none" 
                                                        stroke="currentColor" 
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg> */}
                                                </button>
                                                
                                                <AnimatePresence>
                                                    {productDropdownOpen && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            className="mt-4 pl-4 border-l border-zinc-700 space-y-4"
                                                        >
                                                            {products.map((product) => (
                                                                <Link 
                                                                    href={product.link} 
                                                                    key={product.title}
                                                                    className="block py-2 text-sm text-zinc-300 hover:text-white"
                                                                >
                                                                    <div className="flex items-center">
                                                                        <span className="mr-2">{product.icon}</span>
                                                                        {product.title}
                                                                    </div>
                                                                </Link>
                                                            ))}
                                                            {/* not putting in map coz of coming soo badge */}
                                                            <div className="flex items-center py-2 text-sm mr-auto">
    <span className="mr-2" role="img" aria-hidden="true">
      🤖
    </span>
    CodeMate Agent
    <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-emerald-900/60 text-emerald-400 rounded-md">
      coming soon
    </span>
  </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        ) : (
                                            <a href={`#${nav.id}`}>
                                                {nav.title}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {/* <div className="mt-6">
                                <RainbowButton className="w-full">
                                    Get Started
                                </RainbowButton>
                            </div> */}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            <ProductDropdown 
                isVisible={productDropdownOpen} 
                onClose={closeProductDropdown} 
            />
        </nav>
    )
}

export default Navbar;