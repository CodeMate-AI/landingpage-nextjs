import styles from '@/styles/style';
import { arrowUp } from '@/public/assets';
import Image from 'next/image';
import { ArrowRight, Terminal } from 'lucide-react';

const GetStarted: React.FC = () => (
  <button className=" px-8 py-4 font-medium tracking-wide text-white transition-all duration-500 bg-blue-gradient rounded-full w-fit transition-all duration-500 ease-in-out transform">
    <span className="relative flex text-primary font-bold items-center space-x-3">
      Get Started
      <svg
        className="w-6 h-6 ml-2 transition-transform duration-300 ease-in-out transform group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </span>
  </button>
);

export default GetStarted;