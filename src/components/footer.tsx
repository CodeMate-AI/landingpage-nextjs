'use client'
import Link from "next/link";
import { FaXTwitter, FaLinkedin, FaInstagram, FaDiscord } from "react-icons/fa6";
import { motion } from 'framer-motion';

function Footer() {
  return (
    <motion.footer className="relative text-gray-200 pb-0 pt-16 overflow-hide bg-[#121214] border-t-[1px] border-zinc-500 rounded-t-[3rem] z-[9999999999]">
      <motion.div className="w-full px-10 mx-auto flex flex-col md:flex-row md:justify-center gap-10 md:gap-12 pb-10">
        {/* Left: Logo, tagline, social */}
        <div className="flex-1 min-w-[220px] ml-0 md:ml-8">
          <div className="flex items-center gap-2 mb-2">
            <img src="/codemateLogo.svg" alt="codemate Logo" className="w-50 h-10" />
          </div>
          <p className="text-gray-400 mb-4 text-sm md:text-lg w-full md:w-1/2">
            Codemate AI, your smart coding partner. Review, debug, and complete code faster with AI-powered assistance.
          </p>
          <div className="flex gap-3 mt-2">
            <a href="https://twitter.com/codemateai" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white">
              <FaXTwitter size={32} className="md:w-10 md:h-10" />
            </a>
            <a href="https://www.linkedin.com/company/codemateai/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="hover:text-white">
              <FaLinkedin size={32} className="md:w-10 md:h-10" />
            </a>
          </div>
        </div>

        {/* Center: Product & Others */}
        <div className="flex-2 flex flex-col sm:flex-row gap-6 md:gap-12">
          <div className="mb-6 sm:mb-0">
            <h4 className="font-semibold mb-3 text-white text-sm md:text-base">COMMUNITY</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li><a href="https://www.instagram.com/codemateai" target="_blank" rel="noopener noreferrer" className="hover:underline">Instagram</a></li>
              <li><a href="https://www.linkedin.com/company/codemateai/" target="_blank" rel="noopener noreferrer" className="hover:underline">Linkedin</a></li>
              <li><a href="https://twitter.com/codemateai" target="_blank" rel="noopener noreferrer" className="hover:underline">Twitter</a></li>
              <li><a href="https://www.youtube.com/@codemateai" target="_blank" rel="noopener noreferrer" className="hover:underline">YouTube</a></li>
            </ul>
          </div>
          <div className="mb-6 sm:mb-0">
            <h4 className="font-semibold mb-3 text-white text-sm md:text-base">OTHERS</h4>
            <ul className="space-y-2 text-xs md:text-sm">
              <li><a href="https://huggingface.co/codemateai/CodeMate-v0.1" target="_blank" rel="noopener noreferrer" className="hover:underline">Hugging Face</a></li>
              <li><a href="https://docs.codemate.ai/policies/refund-policy" target="_blank" rel="noopener noreferrer" className="hover:underline">Refund Policy</a></li>
            </ul>
          </div>
        </div>

        {/* Right: Legal */}
        <div className="flex-2 min-w-[180px] mb-6 md:mb-0">
          <h4 className="font-semibold mb-3 text-white text-sm md:text-base">LEGAL</h4>
          <ul className="space-y-2 text-xs md:text-sm">
            <li><a href="https://docs.codemate.ai/faqs/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:underline">Privacy Policy</a></li>
            <li><a href="https://docs.codemate.ai/faqs/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms of Service</a></li>
          </ul>
        </div>
      </motion.div>
    </motion.footer>
  );
}

export default Footer;
