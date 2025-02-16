import styles from "@/styles/style";
import { CodeMateDark } from "@/public/assets";
import Image from "next/image";
import Link from "next/link";
import { Twitter, Linkedin, Instagram, MessageCircle } from "lucide-react";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { name: "For Students", link: "#" },
      { name: "For Teachers", link: "#" },
      { name: "For Guests", link: "#" },
      { name: "Pricing", link: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Documentation", link: "#" },
      { name: "Blog", link: "#" },
      { name: "Community", link: "#" },
      { name: "Roadmap", link: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", link: "#" },
      { name: "Contact", link: "#" },
      { name: "Privacy Policy", link: "#" },
      { name: "Terms of Service", link: "#" },
    ],
  },
];

const Footer = () => (
  <footer className="relative mt-20 border-t border-gray-800">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/50 to-primary pointer-events-none" />
    
    <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Logo and Description */}
        <div className="flex flex-col space-y-6 max-w-md">
          <Link href="https://codemate.ai" target="_blank" rel="noopener noreferrer">
            <Image
              src={CodeMateDark}
              alt="CodeMate.ai"
              className="h-14 w-auto hover:opacity-90 transition-opacity"
              width={170}
              height={59}
            />
          </Link>
          <p className="text-sm leading-6 text-gray-400">
            Empowering the next generation of developers with AI-powered learning tools and 
            personalized guidance for a better coding education experience.
          </p>
          
          {/* Social Links */}
          <div className="flex items-center space-x-6">
            <Link 
              href="https://x.com/codemateai" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link 
              href="https://www.linkedin.com/company/codemateai/"
              target="_blank"
              rel="noopener noreferrer" 
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <Linkedin size={20} />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link 
              href="https://www.instagram.com/codemateai/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </Link>
            <Link 
              href="https://api.whatsapp.com/send?phone=918766330253"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
            >
              <MessageCircle size={20} />
              <span className="sr-only">WhatsApp</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-row gap-16 flex-wrap mt-10 md:mt-0">
          <div className="flex flex-row gap-16 flex-1">
            {footerLinks.slice(0, 2).map((group) => (
              <div key={group.title} className="flex flex-col flex-1">
                <h3 className="text-md font-semibold leading-6 text-white">
                  {group.title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.link}
                        className="text-md leading-6 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex">
            {footerLinks.slice(2).map((group) => (
              <div key={group.title} className="flex flex-col flex-1">
                <h3 className="text-md font-semibold leading-6 text-white">
                  {group.title}
                </h3>
                <ul role="list" className="mt-6 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.link}
                        className="text-md leading-6 text-gray-400 hover:text-blue-400 transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-16 border-t border-gray-800/10 pt-8">
        <p className="text-xs leading-5 text-gray-400">
          &copy; {new Date().getFullYear()} CodeMate.ai. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
