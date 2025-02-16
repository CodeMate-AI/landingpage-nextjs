import React from 'react';
import { motion } from 'framer-motion';

interface GlowButtonProps {
  text?: string;
  onClick?: () => void;
}

const GlowButton: React.FC<GlowButtonProps> = ({ text = "Get Started", onClick }) => {
  return (
    <div className="relative group mt-4 sm:mt-6">
      {/* Glow effect container */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      
      {/* Main button */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex items-center justify-center py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg leading-none text-white font-medium"
        onClick={onClick}
      >
        {text}
      </motion.button>
    </div>
  );
};

export default GlowButton;

