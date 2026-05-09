'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Montserrat } from 'next/font/google';
import { useInView } from 'framer-motion';
import { motion } from 'framer-motion';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});

// Mock data based on the provided screenshot
const mediaItems = [
  {
    logoText: "THE HINDU",
    logoBg: "bg-white",
    logoColor: "text-[#0A3055]",
    fontFamily: "font-serif",
    headline: "CodeMate AI presented its AI-powered development platform to an Austrian delegation, aiming to transform how software is designed, built, and maintained at scale.",
    image: "/The HINDU.png",
    link: "https://www.thehindubusinessline.com/info-tech/codemate-ai-chief-meets-austrian-ministerial-delegation/article70887794.ece"
  },
  {
    logoText: "Inc42",
    logoBg: "bg-[#111111]",
    logoColor: "text-white",
    fontFamily: "font-sans",
    headline: "Inc42 featured CodeMate in this article on how the startup aims to become the Grammarly of coding.",
    image: "https://drive.codemate.ai/inc42.jpg",
    link: "https://inc42.com/startups/how-codemate-aspires-to-become-the-grammarly-of-coding/",
    fill: true
  },
  {
    logoText: "YourStory",
    logoBg: "bg-[#E03C31]",
    logoColor: "text-white",
    fontFamily: "font-sans",
    headline: "CodeMate got mentioned in this YourStory article featuring top startups of Nasscom GenAI Foundry.",
    image: "https://drive.codemate.ai/yourstory_banner.png",
    link: "https://yourstory.com/2023/08/nasscom-genai-foundry-indian-startups-artificial-intelligence",
    fill: true
  },
  {
    logoText: "moneycontrol",
    logoBg: "bg-white",
    logoColor: "text-[#1C9B54]",
    fontFamily: "font-serif font-bold italic",
    headline: "Featured as one of the top 9 interesting generative AI startups in India by Moneycontrol.",
    image: "https://getlogo.net/wp-content/uploads/2020/04/moneycontrol-logo-vector.png",
    link: "https://www.moneycontrol.com/news/trends/features/9-interesting-generative-ai-startups-in-india-11616981.html"
  },
  {
    logoText: "BW BUSINESSWORLD",
    logoBg: "bg-white",
    logoColor: "text-[#DA251D]",
    fontFamily: "font-sans font-bold",
    headline: "Ayush Singhal interviewed with BusinessWorld and talked about how CodeMate AI is becoming the forefront of AI in software development.",
    image: "https://drive.codemate.ai/businessworld_banner.jpeg",
    link: "https://businessworld.in/article/rs-10k-cr-infusion-for-ai-positive-ongoing-support-now-crucial-ayush-singhal-codemate-513036",

  },
  {
    logoText: "Indian Startup News",
    logoBg: "bg-[#0A2640]",
    logoColor: "text-white",
    fontFamily: "font-sans font-bold",
    headline: "Indian Startup News featured CodeMate in this article on how we are building AI for developers and making them 10x productive.",
    image: "https://drive.codemate.ai/indian_startupnews.png",
    link: "https://indianstartupnews.com/stories/how-codemate-is-revolutionising-the-way-software-developers-code-3690321"
  },
  {
    logoText: "Dainik Jagran",
    logoBg: "bg-white",
    logoColor: "text-[#E3000F]",
    fontFamily: "font-serif font-bold",
    headline: "Our journey was featured in Dainik Jaagran, a leading Hindi daily newspaper in India.",
    image: "https://ppimedia.de/wp-content/uploads/2019/09/DJ-Logo-Eng.png"
  }
];

export default function MediaPresence() {
  const [currCards, setCurrCards] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const carouselRef = useRef(null);
  const isInView = useInView(carouselRef, { once: false, amount: 0.3 });

  // Adjust card widths based on the Achivements component but tailored to new sizes
  const DESKTOP_CARD_WIDTH = 376; // e.g. 352px + 24px gap
  const MOBILE_CARD_WIDTH = 344;
  const DESKTOP_VISIBLE = 3;
  const MOBILE_VISIBLE = 1;

  const maxDesktop = -((mediaItems.length - DESKTOP_VISIBLE) * DESKTOP_CARD_WIDTH);
  const maxMobile = -((mediaItems.length - MOBILE_VISIBLE) * MOBILE_CARD_WIDTH);

  useEffect(() => {
    let interval: number;

    if (isInView && !isPaused) {
      if (!isMobile) {
        interval = window.setInterval(() => {
          setCurrCards((prev) => {
            const next = prev - DESKTOP_CARD_WIDTH;
            return next <= maxDesktop ? 0 : next;
          });
        }, 5000);
      } else {
        interval = window.setInterval(() => {
          setCurrCards((prev) => {
            const next = prev - MOBILE_CARD_WIDTH;
            return next <= maxMobile ? 0 : next;
          });
        }, 5000);
      }
    }

    return () => window.clearInterval(interval);
  }, [isInView, isPaused, isMobile, maxDesktop, maxMobile]);

  useEffect(() => {
    setIsMobile(window.innerWidth <= 1024);

    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function handleArrow(dir: 'left' | 'right') {
    if (dir === 'left') {
      currCards < 0 ? setCurrCards(state => state + (isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH)) : null;
    } else {
      currCards > (isMobile ? maxMobile : maxDesktop) ? setCurrCards(state => state - (isMobile ? MOBILE_CARD_WIDTH : DESKTOP_CARD_WIDTH)) : null;
    }
  }

  return (
    <div className='relative flex flex-col justify-center items-center mb-20 pt-10'>
      <div className={`${montserrat.className} relative flex flex-col items-center w-full pt-10 lg:pt-20`}>
        <h2 className='leading-[1] text-[10vw] lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent text-center'>Our <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Media</span> Presence</h2>
      </div>
      <p className='text-xs w-[80%] mt-3 lg:mt-4 lg:text-lg lg:w-[50%] text-center text-zinc-500'>We are recognized by some of the most recognised news and media platforms around the globe.</p>

      {/* Carousel & Desktop Arrows Wrapper */}
      <div className="relative flex justify-center mt-16 w-[20rem] lg:w-[69rem]">
        {/* Desktop Left Arrow */}
        <motion.div onClick={() => handleArrow('left')} whileHover={{ opacity: 1 }} className='absolute hidden lg:flex items-center justify-center size-16 -left-20 xl:-left-24 top-1/2 -translate-y-1/2 rounded-full cursor-pointer text-white opacity-70 z-10'>
          <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12h-12" /><path d="M13 16l-4 -4l4 -4" /><path d="M12 3a9 9 0 1 0 0 18" /></svg>
        </motion.div>

        {/* Carousel */}
        <div
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className='flex w-full overflow-hidden'
        >
          <motion.div animate={{ x: currCards }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className='flex gap-6'>
            {mediaItems.map((item, idx) => (
              <div key={idx}>
                <MediaCard {...item} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Desktop Right Arrow */}
        <motion.div onClick={() => handleArrow('right')} whileHover={{ opacity: 1 }} className='absolute hidden lg:flex items-center justify-center size-16 -right-20 xl:-right-24 top-1/2 -translate-y-1/2 rounded-full cursor-pointer text-white opacity-70 z-10'>
          <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h12" /><path d="M11 8l4 4l-4 4" /><path d="M12 21a9 9 0 0 0 0 -18" /></svg>
        </motion.div>
      </div>

      {/* Mobile Arrows */}
      <div className='flex gap-10 mt-10 lg:hidden'>
        <motion.div onClick={() => handleArrow('left')} whileHover={{ opacity: 0.7 }} className='lg:hidden size-16 rounded-full cursor-pointer text-zinc-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-left-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M21 12h-12" /><path d="M13 16l-4 -4l4 -4" /><path d="M12 3a9 9 0 1 0 0 18" /></svg>
        </motion.div>

        <motion.div onClick={() => handleArrow('right')} whileHover={{ opacity: 0.7 }} className='lg:hidden size-16 rounded-full cursor-pointer text-zinc-400'>
          <svg xmlns="http://www.w3.org/2000/svg" width={60} height={60} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-right-to-arc"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M3 12h12" /><path d="M11 8l4 4l-4 4" /><path d="M12 21a9 9 0 0 0 0 -18" /></svg>
        </motion.div>
      </div>
    </div>
  );
}

function MediaCard({ logoText, logoBg, logoColor, fontFamily, headline, image, link, fill }: { logoText: string, logoBg: string, logoColor: string, fontFamily: string, headline: string, image?: string, link?: string, fill?: boolean }) {
  return (
    <motion.div className='relative h-[24rem] w-[20rem] lg:w-[22rem] bg-zinc-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 flex flex-col p-5 hover:border-white/20 transition-all'>
      {/* Logo Area */}
      <div className={`h-[10rem] w-full ${fill ? 'bg-zinc-800' : 'bg-white p-6'} rounded-2xl flex items-center justify-center shadow-inner overflow-hidden`}>
        {image ? (
          <img src={image} alt={logoText} className={`${fill ? 'object-cover' : 'object-contain'} h-full w-full`} />
        ) : (
          <h3 className={`${fontFamily} ${logoColor} text-3xl font-bold tracking-tight text-center`}>{logoText}</h3>
        )}
      </div>

      {/* Divider */}
      <div className="w-full h-[1px] bg-white/5 my-6"></div>

      {/* Headline */}
      <div className='px-1'>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="group">
            <p className='text-zinc-400 group-hover:text-white text-sm md:text-base font-medium leading-relaxed transition-colors line-clamp-4'>{headline}</p>
          </a>
        ) : (
          <p className='text-zinc-400 text-sm md:text-base font-medium leading-relaxed line-clamp-4'>{headline}</p>
        )}
      </div>
    </motion.div>
  );
}
