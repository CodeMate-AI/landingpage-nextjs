'use client'
import React, { useEffect, useState,useRef,useMemo } from 'react'
import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { FloatingNav } from '@/components/ui/floating-navbar';
import { IconArrowLeft,IconArrowRight,IconArrowBadgeDown } from '@tabler/icons-react';
import StaggeredMenu from '@/components/ui/Menu';
import AutoCodeEditor from '@/components/motion-components/aEditor';
import {AnimatePresence, motion,useMotionValueEvent,useScroll,useTransform} from 'framer-motion'
import { TextAnimate } from '@/components/ui/textAnimate'
import MagicBento from '@/components/ui/magicBento';
import Lenis from 'lenis'
import { Montserrat } from 'next/font/google';
import CodeEditor from '@/components/motion-components/editor'
import { LoaderFive, LoaderOne } from '@/components/ui/loader';
import { TypingAnimation,AnimatedSpan } from '@/components/ui/terminal';

import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useRouter } from 'next/navigation';
import Footer from '@/components/footer';

import VideoEmbed from '@/components/video';
import ReviewCodeEditor from '@/components/motion-components/rEditor';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

const montserrat2 = Montserrat({
  subsets: ['latin'],
  weight: ['200'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});


function Page() {
  const brokenComponent = [
  { code: "import React from 'react'", isError: false },
  { code: "", isError: false },
  { code: "type Props = {", isError: false },
  { code: "  name: string", isError: false },
  { code: "}", isError: false },
  { code: "", isError: false },
  { code: "export const ErrorComp: React.FC<Props> = ({ name }) => {", isError: false },
  { code: "  const [count, setCount]: number = useState(0)", isError: true }, // ❌ incorrect type annotation + useState not imported
  { code: "", isError: false },
  { code: "  useEffect(() => {", isError: true }, // ❌ useEffect not imported
  { code: "    console.logg('Name is:', name)", isError: true }, // ❌ typo `logg`
  { code: "  }, [nam])", isError: true }, // ❌ `nam` is not defined
  { code: "", isError: false },
  { code: "  return (", isError: false },
  { code: "    <div>", isError: false },
  { code: "      <h1>Hello, {namee}</h1>", isError: true }, // ❌ `namee` is a typo
  { code: "      <button onClick={() => setCount(cn => cn + 1)}>Click</buttn>", isError: true }, // ❌ `buttn` typo
  { code: "      <p>Count: {countt}</p>", isError: true }, // ❌ `countt` is a typo
  { code: "    </div>", isError: false },
  { code: "  )", isError: true }, // ❌ return not wrapped in fragment or single parent (could error in strict JSX)
  { code: "}", isError: false },
]

const fixedComponent = [
  { code: "import React, { useState, useEffect } from 'react'", isError: false },
  { code: "", isError: false },
  { code: "type Props = {", isError: false },
  { code: "  name: string", isError: false },
  { code: "}", isError: false },
  { code: "", isError: false },
  { code: "export const ErrorComp: React.FC<Props> = ({ name }) => {", isError: false },
  { code: "  const [count, setCount] = useState(0)", isError: true },
  { code: "", isError: false },
  { code: "  useEffect(() => {", isError: true },
  { code: "    console.log('Name is:', name)", isError: true },
  { code: "  }, [name])", isError: true },
  { code: "", isError: false },
  { code: "  return (", isError: false },
  { code: "    <div>", isError: false },
  { code: "      <h1>Hello, {name}</h1>", isError: true },
  { code: "      <button onClick={() => setCount(cn => cn + 1)}>Click</button>", isError: true },
  { code: "      <p>Count: {count}</p>", isError: true },
  { code: "    </div>", isError: false },
  { code: "  )", isError: true },
  { code: "}", isError: false },
];


const AfterReviewComponent = [
  { code: "import { useState } from 'react'",  },
  { code: "export default function Counter() {", },
  { code: "const [count, setCount] = useState(0)",  },
  { code: "  return (", },
  { code: " <div className='flex items-center gap-4'>",isError:true},
  { code: " <h2 className='text-xl font-bold'>Count: {count}</h2>",isError:true },
  {code: ""}, 
  { code: " <button aria-label='Increase count'  className='px-3 py-1", isError:true},
  { code: "bg-green-500 text-white rounded'",isError:true},
  { code:"onClick={() => setCount((prev) => prev + 1)}>+</button>",isError:true},
  { code:""},
  { code: "<button aria-label='Decrease count' className='px-3",isError:true },
  { code:"py-1 bg-green-500 text-white rounded'",isError:true},
  { code:" onClick={() => setCount((prev) => Math.max(prev - 1, 0))}>-</button>",isError:true},
  { code:""},
  { code: "    </div>",},
  { code: "  )",},
  { code: "}",},
];

const ReviewComponent = [
  { code: "import { useState } from 'react'",  },
  { code: "", },
  { code: "export default function Counter() {", },
  { code: "  const [count, setCount] = useState(0)",  },
  { code: "", },
  { code: "  return (", },
  { code: "    <div>",},
  { code: "      <h2>Count: {count}</h2>", },
  { code: "      <button onClick={() => setCount(count + 1)}>+</button>", },
  { code: "      <button onClick={() => setCount(count - 1)}>-</button>", },
  { code: "    </div>",},
  { code: "  )",},
  { code: "}",},
];

const AutoCompleteComponent = [
  { code: "import { useState } from 'react'", },
  { code: "", },
  { code: "export default function ThemeToggle() {", },
  { code: "  const [dark, setDark] = useState(false)", },
  { code: "  return (", },
  { code: "    <div className={dark ? 'bg-black text-white p-4' : 'bg-white text-black p-4'}>", },
  { code: "      <p>{dark ? 'Dark Mode 🌙' : 'Light Mode ☀️'}</p>", },
  { code: "      <button onClick={() => setDark(!dark)}>Toggle</button>", },
  { code: "    </div>", },
  { code: "  )", },
  { code: "}", },
];
 const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const heroRef2 = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const MFRef = useRef<HTMLDivElement>(null);
  const [d,setD] = useState(false); 
  const [r,setR] = useState(false);
  const [a,setA] = useState(false);
  const [lastScroll,setLastScroll] = useState(0);
  const [IsMascot,setIsMascot] = useState(false);
  const [isNBack,setIsNBack] = useState(false);
  const [isMenu,setMenu] = useState(false);
  const [isArrowV,setIsArrowV] = useState(false);
  const [isProducts,setIsProducts] = useState(false);
   const [isArrow,setIsArrow] = useState(false);
  const [isP1,setIsP1] = useState(false);
  const [isP2,setIsP2] = useState(false);
  const [isAuto,setIsAuto] = useState(false);
  const [isShowProd,setIsShowProd] = useState(true);
  const [isProds , setIsProds] = useState(false);
  const [isFix,setIsFix] = useState(false);
  const [isFix2,setIsFix2] = useState(false);
  const [reviewBtn,setReviewBtn] = useState(true);
  const [isRef1,setIsRef1] = useState(false);
  const [isRef2,setIsRef2] = useState(false);
  const [isRef3,setIsRef3] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const feature1Ref = useRef<HTMLDivElement>(null);
  const drawer1Ref = useRef<HTMLDivElement>(null);
  const drawer2Ref = useRef<HTMLDivElement>(null);
  const editor2Ref = useRef<HTMLDivElement>(null);
  const testiRef = useRef<HTMLDivElement>(null);
  const prodRef = useRef<HTMLDivElement>(null);
  const Ref1 = useRef<HTMLDivElement>(null);
  const Ref2 = useRef<HTMLDivElement>(null);
  const Ref3 = useRef<HTMLDivElement>(null);
  const productShowRef = useRef<HTMLDivElement>(null);
  const codeOverlayRef = useRef<HTMLDivElement>(null);
  const codeOverlayRef2 = useRef<HTMLDivElement>(null);
  const [isLoad,setIsLoad] = useState(false);
  const [isLoad2,setIsLoad2] = useState(false);
  const debugBtnRef = useRef<HTMLButtonElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const productRef2 = useRef<HTMLDivElement>(null);
  const productsWrapper = useRef<HTMLDivElement>(null);
  const exploreRef = useRef<HTMLDivElement>(null);
  const title = ["Don't","be","techy","to"];
  const title2 = ["Develop","Softwares"];
  const [isTitle,setIstitle] = useState(false);
    const {scrollYProgress:shadingProgress} = useScroll({
   target:heroRef,
   offset:['end end','end start']
  })
   const shadingHeight = useTransform(shadingProgress,[0,1],[0,1000]);
  
    const {scrollYProgress:p1YProg} = useScroll({
      target:productRef,
      offset:['start start','end start']
    });

    const {scrollYProgress:PShowYProg} = useScroll({
      target:productShowRef,
      offset:['start start','end start']
    });
        const {scrollYProgress:PShowYProg2} = useScroll({
      target:productShowRef,
      offset:['start end','end start']
    });
    const {scrollYProgress:testiYProg} = useScroll({
      target:testiRef,
      offset:['start start','end start']
    });
    const {scrollYProgress:WYProg} = useScroll({
      target:productsWrapper,
      offset:['start start','end start']
    });
    const {scrollYProgress:PYProg} = useScroll({
      target:prodRef,
      offset:['start start','end start']
    });
    const {scrollYProgress:MYProg} = useScroll({
      target:mainRef,
      offset:['start start','end start']
    });
    const {scrollYProgress:MFYProg} = useScroll({
      target:MFRef,
      offset:['start start','end start']
    });
    const feature1Scale = useTransform(p1YProg,[0,0.7],[1.2,1.1]);
    const featureTitleY = useTransform(p1YProg,[0,0.9],[0,-500]);
    const featureTitleOpacity = useTransform(p1YProg,[0,0.4],[1,0]);
    const codeBlur = useTransform(p1YProg,[0,0.4 ],['blur(15px)','blur(0px)']);
    const drawerX = useTransform(p1YProg,[0,0.1,0.3],[0,45,0]);
    const drawerX2 = useTransform(p1YProg,[0.3,0.4,0.6],[0,45,0]);
    const drawerX3 = useTransform(p1YProg,[0.7,0.8],[0,45]);
    

    ///for productShowcase 
    const div1X = useTransform(PShowYProg,[0,0.3],[1200,0]);
    const div2X = useTransform(PShowYProg,[0.3,0.6],[1800,0]);
    const div3X = useTransform(PShowYProg,[0.5,0.7],[2400,0]);

    const height = useTransform(PShowYProg,[0,1],[0,600]);

    const titlesX = useTransform(PShowYProg,[0,1],[0,-550]);

    const op1 = useTransform(PShowYProg,[0,0.2,0.4],[1,1,0]);
    const op2 = useTransform(PShowYProg,[0.2,0.3,0.6],[0.2,1,0]);
    const op3 = useTransform(PShowYProg,[0.4,0.5,0.8],[0.2,1,0]);
    const op4 = useTransform(PShowYProg,[0.6,0.8],[0.2,1]);

    ///for mobile feature section
    const mx = useTransform(MFYProg,[0,1],[0,-1200]);

    ///for code editor
    const barY = useTransform(p1YProg,[0,1],["0%","100%"]);

   useEffect(()=>{
     const lenis = new Lenis({
       duration:2
     });
     function raf(time: any){
      lenis.raf(time) 
      requestAnimationFrame(raf)
     }
     requestAnimationFrame(raf);
    },[]);

  ///codeEditor part

    const scaleE = useTransform(WYProg,[0.3164624761083433,0.34929470555864864,0.42436403710166223],[1,1.5,1]);
    const xE = useTransform(WYProg,[0.3164624761083433,0.42436403710166223],[0,-516]);

   ///for testi
    const tdiv1X = useTransform(testiYProg,[0,0.1],[700,0]);
    const tdiv2X = useTransform(testiYProg,[0.1,0.3],[1300,0]);
    const tdiv3X = useTransform(testiYProg,[0.3,0.5],[1900,0]);
    const tdiv4X = useTransform(testiYProg,[0.5,0.7],[2500,0]);
    const tdiv5X = useTransform(testiYProg,[0.7,0.8],[3100,0]);
    const tdiv6X = useTransform(testiYProg,[0.8,1],[3600,0]);
    const commentsX = useTransform(testiYProg,[0,1],[0,1500]);
    
   //for bento
   const scaleB = useTransform(WYProg,[0.8103453100614014,0.81325938924655],[1,1.5]);
   const xB = useTransform(WYProg,[0.8103453100614014,0.81325938924655],[0,550]);


   ///for mobile navbar menu
   const menuItems = [
  { label: 'Home', ariaLabel: 'Go to home page', link: '/' },
  { label: 'About', ariaLabel: 'Learn about us', link: '/about' },
  { label: 'Services', ariaLabel: 'View our services', link: '/services' },
  { label: 'Contact', ariaLabel: 'Get in touch', link: '/contact' }
];

const socialItems = [
  { label: 'Twitter', link: 'https://twitter.com' },
  { label: 'GitHub', link: 'https://github.com' },
  { label: 'LinkedIn', link: 'https://linkedin.com' }
];

   //for codeEditor
   function handleOverlay(){
    codeOverlayRef.current?.classList.remove('hidden');
    setIsLoad(true);
    setTimeout(()=>{
      
      setIsFix(true);
    },5000)

    setTimeout(()=>{
    codeOverlayRef.current?.classList.add('hidden');
    setIsLoad(false);
    },16000)
     
    setTimeout(()=>{
      debugBtnRef.current?.classList.add('hidden');
    },16500);

   }
   function handleOverlayR(){
     setIsLoad2(true);
     setReviewBtn(false);
   }
 useEffect(() => {
    const handleKeyDown = (event:any) => {
    if(event.key === "Tab"){
      event.preventDefault();
      setIsAuto(true);
    }
    }

    document.addEventListener('keydown', handleKeyDown);

    // Clean up the event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useMemo(() => {
  if (!isRef2) {
    setIsLoad2(false);
  }
}, [isRef2]);

  useMemo(() => {
  if (!isRef1) {
    setIsFix(false);
  }
}, [isRef1]);


useMotionValueEvent(p1YProg, 'change', (latest) => {
  // --- Main state handling ---
  if (latest > 0.6) {
    // Show Ref3 as flex, hide Ref1/Ref2, hide drawer2
    setIsRef3(true);
    setIsRef2(false);
    setIsRef1(false);
    drawer2Ref.current?.classList.add('hidden');
  } else if (latest > 0.3) {
    // Show Ref2, hide Ref1 & Ref3, show editor2, keep drawer2 visible
    drawer2Ref.current?.classList.remove('hidden');
    setIsRef1(false);
    setIsRef3(false);
    setIsRef2(true);
    editor2Ref.current?.classList.remove('hidden');

  } else if (latest > 0.1) {
    // Show Ref1 as flex, hide Ref2, hide editor2, keep drawer2 visible
    drawer2Ref.current?.classList.remove('hidden');
    setIsRef1(true);
    setIsRef2(false);
    setIsRef3(false);
    editor2Ref.current?.classList.add('hidden');

  } else {
    // Hide everything in the lowest range
    drawer2Ref.current?.classList.remove('hidden');
    setIsRef1(false);
    
    setIsRef2(false);
    setIsRef3(false);
    editor2Ref.current?.classList.add('hidden');
  }

  // --- Drawer1 logic (separate condition) ---
  if (latest > 0.5051476587223102) {
    drawer1Ref.current?.classList.add('hidden');
  } else {
    drawer1Ref.current?.classList.remove('hidden');
  }
});
 
///for mascot 
useMotionValueEvent(MYProg,'change',(latest) => {

  if(latest >= 0.027262813522355506) setIsMascot(true);
  if(latest <= 0.027262813522355506) setIsMascot(false);
});



  ///for new products section


useMotionValueEvent(PShowYProg2,'change',(lastest) => {
  // console.log(lastest);
  if(lastest >= 0.12578616352201258){
    setIsProds(true);
  }
  if(lastest <= 0.12578616352201258) {
    setIsProds(false);
  }
})



useMotionValueEvent(WYProg,'change',(lastest) => {
  // console.log(lastest);
  if(lastest >= 0.3004624761083433) setIsShowProd(false);
  if(lastest <= 0.3004624761083433) setIsShowProd(true);
  // if(lastest === 1) setIsProds(false);
  // if(lastest < 1 )  setIsProds(true);
  if(lastest  >= 0.9191078444275464) {
    setIsProds(false);
    console.log('working')
  } 
  if(lastest <= 0.9191078444275464){
    setIsProds(true);
  }
})

////for new prods
useMotionValueEvent(PYProg,'change',(latest) => {
if(latest > 0) setIsArrowV(true);
if(latest <= 0) setIsArrowV(false);
if(latest <= 0.15){ 
  setIsP1(false);
  setIsP2(false);
  }
if(latest >= 0.25){ 
  setIsP1(true);
  setIsP2(false);
  }
if(latest >= 0.45){
  setIsP2(true);
  setIsP1(false);
}  
})

// for main div events
useMotionValueEvent(MYProg,'change',(latest) => {

 if(latest >= 0.001203313524221142) setIsNBack(true);
 if(latest <= 0.001203313524221142) setIsNBack(false);
})

useMotionValueEvent(MYProg,'change',(e)=>{
    if( e >= lastScroll) setIsArrow(true);
    if( e <= lastScroll) setIsArrow(false);
    setLastScroll(e);
});


// mainRef.current?.addEventListener("scroll",(e:any)=>{
//     const currentScroll = e.target.scrollTop; 
//     // console.log(currentScroll);
           
//    if(currentScroll >= lastScroll) setIsArrow(true);
//    if(currentScroll <= lastScroll) setIsArrow(false);
//    setLastScroll(currentScroll); 
// });
  useEffect(() => {
  const timer = setTimeout(() => {
    setIstitle(true);
  }, 2000);

  return () => clearTimeout(timer);
}, []);


 ///arrow 
function handleArrow() {
  setIsArrow((prev) => {
    if (!prev) {
      heroRef2?.current?.scrollIntoView({ behavior: "smooth" });
    } else {
      footerRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
    return !prev; // flip state each time
  });
}

  return (
    <div style={{cursor:`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="22" height="22"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto`}} ref={mainRef} className={`${montserrat.className} bg-zinc-950`} >


     {/* arrow for going to hero section */}
     <AnimatePresence>
    {isArrowV && 
    <motion.div initial={{opacity:0,filter:'blur(20px)'}} animate={{opacity:1,filter:'blur(0px)'}} exit={{opacity:0,filter:'blur(20px)'}} transition={{duration:1}} className="fixed bottom-7 right-7 z-[9999999999]">
     <motion.div  onClick={handleArrow} whileTap={{scale:1}} whileHover={{scale:1.1}}  className='hidden lg:flex cursor-pointer  justify-center items-center  size-10 rounded-full bg-[#EDEADE]/90  text-black'>
     <motion.svg animate={{rotate:isArrow? 180 : 0}} transition={{duration:0.5}} xmlns="http://www.w3.org/2000/svg"  width={30}  height={30}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
     </motion.div>
     </motion.div>
     }
     </AnimatePresence>
     {/* arrow for going to hero section */}

     
{/* bottom blur */}
{/* <div className='fixed h-[2%] w-full bg-gradient-to-t from-white/30 to-transparent backdrop-blur-[5px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[4%] w-full bg-gradient-to-t from-white/30 to-transparent backdrop-blur-[10px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[6%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[9px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[8%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[6px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[10%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[5px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[12%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[4px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[14%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[3px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[16%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[2px] bottom-0 z-40 opacity-100'>
</div>
<div className='fixed h-[18%] w-full bg-gradient-to-t from-zinc-950/30 to-transparent backdrop-blur-[1px] bottom-0 z-40 opacity-100'>
</div> */}
{/* bottom blur */}



  {/*navBar*/}
<div 
style={{zIndex:999999999999,}}
className='hidden lg:flex fixed  top-0 justify-center items-center w-full'>
    <motion.div
   initial={{y:-100}}
   animate={{y:0}}
   transition={{duration:1,delay:0.5}}
  // initial={{opacity:0,filter:'blur(10px)'}}
  // animate={{opacity:1,filter:'blur(0px)'}}
  // transition={{duration:1,delay:7}}
  style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex:999999999999,
        }}
  className={`mt-5 w-fit bg-opacity-65 z-[9999999999] rounded-lg ${isNBack? 'border-y-[1px]   border-gray-400 border-opacity-10' : ''}`}>
    <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
    <div className='flex gap-[51vw]  justify-between items-center w-full h-10'>
      
    <div className="h-full w-[13vw] flex justify-center overflow-hidden">
      {!IsMascot && <img src="/codemateLogo.svg" alt="" />}
     {IsMascot && <motion.div initial={{opacity:0,filter:'blur(20px)',x:50}} animate={{opacity:1,filter:'blur(0px)',x:-80}} transition={{duration:0.5}}>
<svg width="50" height="40" viewBox="0 0 153 150" fill="none" xmlns="http://www.w3.org/2000/svg">

  <path d="M131.78 150H39.4727L60.2412 110.845H152.55L131.78 150ZM39.4727 39.0674V150L0.242188 125.04V14.1074L39.4727 39.0674ZM131.78 39.1553H39.4727L60.2412 0H152.55L131.78 39.1553Z" 
    fill="url(#paint0_linear_2014_66)"/>

<motion.svg
  animate={{ translateX: [0, 0,15,15,15,15, 0], translateY: [0,12,12,-10,-10,0, 0] }}
  transition={{ duration: 7, repeat: Infinity }}
>
  <motion.circle cx="71.7422" cy="75" r="11" fill="white"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity,repeatDelay:2 }}
  />
  <motion.circle cx="111.742" cy="75" r="11" fill="white"
    animate={{ opacity: [1, 0, 1] }}
    transition={{ duration: 0.8, repeat: Infinity,repeatDelay:2 }}
  />
</motion.svg>

  <defs>
    <linearGradient id="paint0_linear_2014_66" x1="0.580642" y1="0" x2="183.357" y2="82.4837" gradientUnits="userSpaceOnUse">
      <stop stop-color="#00BFFF"/>
      <stop offset="1" stop-color="#1E90FF"/>
    </linearGradient>
  </defs>
</svg>


      </motion.div>}
    
    </div>
    <div className={`${montserrat.className} relative flex flex-col gap-3 text-md  justify-center items-center cursor-pointer text-right z-50`}>
      <span className=' flex gap-3 justify-center items-center z-50'>
       <motion.h1 onClick={()=>setIsProducts(state=>!state)}  whileHover={{opacity:1}} animate={{y:isProducts? 55 : 0 ,x:isProducts? 15 : 0,scale:isProducts? 1.20 : 1,opacity:isProducts? 1 : ''}} transition={{duration:0.2}} className={`flex text-center justify-center items-center opacity-65 z-50 ${isProducts? 'font-semibold' : ''}`}>Products</motion.h1>
       <motion.h1 onClick={() => productShowRef.current?.scrollIntoView({ behavior: "smooth" })} whileHover={{opacity:1}} className='opacity-65'>Features</motion.h1>
       <motion.h1 whileHover={{opacity:1}}  onClick={()=>{router.push('pricing')}} className='opacity-65'>Pricing</motion.h1>
       <a href="https://app.codemate.ai" target='_blank'>
       <motion.button  whileHover={{opacity:1,scale:1.05}} className={`${montserrat.className} px-2 py-1  bg-[#FFFFFF] text-black  rounded-sm font-semibold opacity-85`}>Get Started</motion.button>
       </a>
       </span>

      {isProducts &&  
       <motion.div 
        initial={{scale:0}}
        animate={{scale:1}}
        transition={{duration:0.5}}
        style={{ 
        boxShadow: '0 14px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(50px)',
        WebkitBackdropFilter: 'blur(50px)'
        }} className='absolute h-32 w-[80%] mt-[12.4rem] left-0 rounded-md -z-10 bg-zinc-900 bg-opacity-95'>
        <div className="mt-10 px-5 flex flex-col gap-2">
        <div className='flex justify-between w-full'> 
          <a target="_blank" href="https://cli.codemate.ai">
          <motion.span whileHover={{opacity:1}} className="flex justify-center items-center gap-2 opacity-80"><h1>Terminal</h1><div className="size-7 bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center">
          <motion.svg initial={{rotate:50,opacity:0.7}} xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
          </div></motion.span>
          </a>
          <a target="_blank" href='https://edu.codemate.ai/'>
          <motion.span whileHover={{opacity:1}} className="flex justify-center items-center gap-2 opacity-80"><h1>Education</h1><div className="size-7 bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center">
          <motion.svg initial={{rotate:50,opacity:0.7}} xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
          </div></motion.span>
          </a>
        </div>
          <div className='flex justify-between w-full'> 
          <a  href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details" target="_blank">
          <motion.span whileHover={{opacity:1}} className="flex justify-center items-center gap-2 opacity-80"><h1>IDE</h1><div className="size-7 bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center">
          <motion.svg initial={{rotate:50,opacity:0.7}} xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
          </div></motion.span>
          </a>
          <a href='https://app.codemate.ai' target='_blank'>
          <motion.span whileHover={{opacity:1}} className="flex justify-center items-center gap-2 opacity-80"><h1>Web-App</h1><div className="size-7 bg-white/25 rounded-full bg-opacity-90 flex justify-center items-center">
          <motion.svg initial={{rotate:50,opacity:0.7}} xmlns="http://www.w3.org/2000/svg"  width={20}  height={20}  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth={2}  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></motion.svg>
          </div></motion.span>
          </a>
        </div>
        </div>
       </motion.div>
        }
    </div>

        {isProducts && 
        <div onClick={()=>setIsProducts(false)} className='fixed h-screen w-full z-40'/>
        }

    </div>
     {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
    </div>
    </motion.div>
</div>
{/*navBar*/}

  {/*navBar for mobile*/}
<div 
style={{zIndex:999999999999,}}
className='lg:hidden fixed flex top-0 justify-center items-center w-full'>
    <motion.div
   initial={{y:-100}}
   animate={{y:0}}
   transition={{duration:1,delay:0.5}}
  // initial={{opacity:0,filter:'blur(10px)'}}
  // animate={{opacity:1,filter:'blur(0px)'}}
  // transition={{duration:1,delay:7}}
  style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex:999999999999,
        }}
  className={`w-full bg-opacity-65 z-[9999999999]  ${isNBack? 'border-y-[1px]   border-gray-400 border-opacity-10' : ''}`}>
    <div className='flex  h-full w-full text-white px-[2rem] py-2 '>
    <div className='flex justify-between w-full h-10'>
      
    <div className="h-full w-[30vw] flex justify-center overflow-hidden">
       <img src="/codemateLogo.svg" alt="" />

      {/* {!IsMascot && <img src="/codemateLogo.svg" alt="" />}
     {IsMascot && <motion.div initial={{opacity:0,filter:'blur(20px)',x:50}} animate={{opacity:1,filter:'blur(0px)',x:0}} transition={{duration:0.5}}>
<svg width="155" height="150" viewBox="0 0 53 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M131.78 150H39.4727L60.2412 110.845H152.55L131.78 150ZM39.4727 39.0674V150L0.242188 125.04V14.1074L39.4727 39.0674ZM71.7422 64C77.8173 64 82.7422 68.9249 82.7422 75C82.7422 81.0751 77.8173 86 71.7422 86C65.6671 86 60.7422 81.0751 60.7422 75C60.7422 68.9249 65.6671 64 71.7422 64ZM111.742 64C117.817 64 122.742 68.9249 122.742 75C122.742 81.0751 117.817 86 111.742 86C105.667 86 100.742 81.0751 100.742 75C100.742 68.9249 105.667 64 111.742 64ZM131.78 39.1553H39.4727L60.2412 0H152.55L131.78 39.1553Z" fill="url(#paint0_linear_2014_66)"/>
<defs>
<linearGradient id="paint0_linear_2014_66" x1="0.580642" y1="1.09465e-05" x2="183.357" y2="82.4837" gradientUnits="userSpaceOnUse">
<stop stop-color="#396AFC"/>
<stop offset="1" stop-color="#2948FF"/>
</linearGradient>
</defs>
</svg>


      </motion.div>} */}
    
    </div>

    <div onClick={()=> setMenu(state => !state)} className={`${montserrat.className} flex gap-2 text-[4vw]  justify-center items-center cursor-pointer text-right `}>
     Menu
     <motion.svg  style={{ width: "5vw", height: "5vw" }} animate={{rotate: isMenu? 45 : 0}} transition={{duration:0.2}} xmlns="http://www.w3.org/2000/svg"   viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M5 12l14 0" /></motion.svg>
    </div>


    </div>
     {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
    </div>
    </motion.div>
</div>

{/* mobile menu */}
<AnimatePresence>
  {isMenu && (
    <div 
       
      className="fixed top-0 h-screen w-full left-0 z-[9999999999] flex"
    >
      <div className='h-full w-[70%]'>
      <motion.div
        key={1}
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ duration: 0.2 }}
        className="absolute h-full w-[70%] bg-white"
      />
      <motion.div
        key={2}
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="absolute h-full w-[70%] bg-cyan-600 z-10"
      />
      <motion.div
        key={3}
        initial={{ x: -400 }}
        animate={{ x: 0 }}
        exit={{ x: -400 }}
        transition={{ duration: 0.2, delay: 0.2 }}
        className="absolute h-full w-[70%] bg-zinc-900 z-50"
      >
      <div className='relative h-full w-full'>
      <div className='flex flex-col leading-[1] text-[8vw] pt-10 pl-5 gap-7'>
      <motion.div whileHover={{opacity:0.6}} className='flex gap-2 cursor-pointer'><span className='MenuText'>HOME</span><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>01</p></motion.div>
      <motion.div  className='flex flex-col gap-2 cursor-pointer'>
        <motion.div onClick={()=>setIsProducts(state => !state)} whileHover={{opacity:0.6}} className='flex gap-2'>
        <h1 className='MenuText'>PRODUCTS</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>02</p>
        </motion.div>
    
        {isProducts && 
        <motion.div  initial={{ height:0,opacity:0 }} animate={{height:130,opacity:1}} transition={{duration:0.3}} className='flex flex-col text-xl gap-2 text-center opacity-70'>
          <div className='relative border-b-[1px] border-white overflow-hidden'> 
            <a href="https://cli.codemate.ai" target='_blank'>
            <motion.h1  className='z-20'>Terminal</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Terminal</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>


                    <div className='relative border-b-[1px] border-white overflow-hidden'> 
             <a href="https://edu.codemate.ai/" target="_blank">         
            <motion.h1  className='z-20'>Education</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Education</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>
                    <div className='relative border-b-[1px] border-white overflow-hidden'> 
            <a href="https://app.codemate.ai" target="_blank">          
            <motion.h1  className='z-20'>Web-app</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>Web-app</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>
                   <div className='relative border-b-[1px] border-white overflow-hidden'> 
             <a href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate&ssr=false#review-details">       
            <motion.h1  className='z-20'>Vs Code Extenstion</motion.h1>
            <motion.div whileHover={{y:-50}} transition={{duration:0.8}} className='absolute h-full w-full  top-0 '>
              <motion.div initial={{y:50}} className= 'h-full w-full rounded-t-md bg-cyan-600'>
              <h1>VS Code Extension</h1>
              </motion.div>
            </motion.div>
            </a>
          </div>
        </motion.div>  
        }
      </motion.div>
      <motion.div  onClick={()=> router.push('/pricing')} whileHover={{opacity:0.6}} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>PRICING</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>03</p></motion.div>
      <motion.div whileHover={{opacity:0.6}} className='flex gap-2 cursor-pointer'><h1 className='MenuText'>GET STARTED</h1><p className='text-[3vw] mt-1 opacity-60 text-[#00FFFF]'>04</p></motion.div>
      </div>
       
       <div className='absolute bottom-0 pl-5 pb-8'>
        <h1 className='text-[5vw]  opacity-65 mb-3'>Socials</h1>
         <div className='flex text-[5vw] gap-4 opacity-90 group'>
          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'>Insta</h1>
          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'>Twitter</h1>
          <h1 className='group-hover:opacity-20 hover:!opacity-100 hover:text-[#00BFFF]'>Linkedin</h1>
         </div> 
       </div>


       </div>       
      </motion.div>
    </div>
 
    <div onClick={() => {setMenu(false);setIsProducts(false)}} className='h-full w-[30%]'></div>

    </div>
  )}
</AnimatePresence>
{/* mobile menu */}

{/*navBar for mobile*/}


  {/* hero section  */}
  <div ref={heroRef2} className='h-[100vh] w-full overflow-x-hidden'>
  <BackgroundGradientAnimation className='w-full overflow-hidden' interactive={true} gradientBackgroundStart='rgb(9, 9, 11)' gradientBackgroundEnd='rgb(9, 9, 11)' firstColor='0, 255, 255' secondColor='30, 144, 255' thirdColor='0, 255, 255' fourthColor='255,255,255' pointerColor='30, 144, 255' size='100%'>
   <div style={{cursor:`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="26" height="26"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto`}} ref={heroRef} className='relative h-screen w-full z-50 overflow-hidden cursor-default'>


     
    <motion.div
    style={{cursor:`url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 397 433" width="32" height="32"><path d="M40.31 32.13c-1.76-8.4 7.23-14.92 14.67-10.66l296.47 169.91c7.54 4.32 6.29 15.56-2.02 18.12L205.54 253.76c-2.23.69-4.15 2.13-5.42 4.09l-72.01 110.94c-4.83 7.44-16.25 5.3-18.07-3.38L40.31 32.13z" fill="black" stroke="white" stroke-width="25"/></svg>') 16 16, auto`}}
    className='absolute h-full w-full opacity-5 z-0'>
      <img src="/bgNoise.png" className='object-fit w-full' alt="" />
    </motion.div>

<div className='relative z-50 h-full w-full flex justify-center items-center overflow-hidden'>

 
 

    

    <div className=' flex  flex-col  items-center z-50 text-white gap-5'>

    <motion.div 
    // animate={{y:[120,35]}}
    // transition={{duration:1,delay:6}}    
    className='absolute top-[16vh] lg:left-[3.3vw] 
      text-[14vw]   lg:text-[8vw] leading-[1] font-semibold flex flex-col pb-1  pl-[8vw]  lg:pl-12  mt-5 z-50 !xxlHerotext'> 
    <div className={`${montserrat.className} `}>
     {/* {title.map((e,idx)=>(
      <motion.h1
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:1,delay: idx * 0.5}}
      key={idx}>
        {e}
      </motion.h1>
     ))} */}
      {/* <motion.div 
      initial={{ opacity: 0, filter: "blur(10px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 1,delay:4 }}
      className="text-sm text-nowrap flex gap-2 ml-3 text-gray-400">Build 3.0 is live. Start building.  <motion.span whileHover={{scale:1.05}} className='text-cyan-500 flex cursor-pointer  justify-center items-center'>   Explore now &gt;</motion.span></motion.div> */}

     <div className='xxlHero z-50'><motion.span   initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.3 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>On</motion.span> <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.3,delay:0.3}} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>Device</motion.span> <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.2,delay:0.6 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>AI</motion.span> <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.1,delay:0.8 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>First</motion.span></div>
    </div>
    <div className={`${montserrat.className} flex gap-4 bg-gradient-to-b from-white to-gray-300/10 bg-clip-text  text-transparent`}>
     {/* {title2.map((e,idx)=>(
      <motion.h1
      initial={{opacity:0}}
      animate={ isTitle? {opacity:1} : {}}
      transition={{duration:1,delay: idx * 0.5}}
      key={idx}>
        {e}
      </motion.h1>
     ))} */}

     <div className='pb-3'><motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.1,delay:0.9 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>Developer's</motion.span> <motion.span initial={{ opacity: 0, filter: "blur(10px)" }}
  animate={{ opacity: 1, filter: "blur(0px)" }}
  transition={{ duration: 0.1,delay:1 }} className='bg-gradient-to-b from-white to-gray-300/60 bg-clip-text  text-transparent'>Agent</motion.span></div>
     
    </div>
          <motion.div 
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.4,delay:1.5 }}
          className={`flex flex-col ${montserrat.className} text-[2.8vw] lg:text-[1.5vw] gap-1 leading-[1.] mt-5 opacity-60 `}>
        <p>Build and ship 20x faster with CodeMate IDE —</p>
        <p>Your all-in-one accelerator for the development lifecycle</p>
      </motion.div>
      <motion.div   
          initial={{ opacity: 0, filter: "blur(10px)",y:100 }}
          animate={{ opacity: 1, filter: "blur(0px)",y:0 }}
          transition={{ duration: 1,delay:0.5}} className={`${montserrat.className} flex gap-5 text-sm mt-10`}>
      <a href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate" target='_blank'>      
      <motion.button whileHover={{opacity:1,scale:1.05}} className='px-4 py-3  bg-black text-white  rounded-sm bg-opacity-90 text-opacity-60'>GET Extension</motion.button>
      </a>
      <a href="https://cal.com/ayushsinghal/book-a-demo" target="_blank" >
      <motion.button
      whileHover={{opacity:1,scale:1.05}} 
      className='px-4 py-3  bg-[#FFFFFF] text-black  rounded-sm   opacity-80'>Book a demo</motion.button>
      </a>
      </motion.div>
     </motion.div>
   
       {/* <motion.span className='mt-32' initial={{display:'none',y:50,filter:'blur(10px)'}}
       animate={{display:'block',y:0,filter:'blur(0px)'}}
       transition={{delay:7,duration:1}}
       >
       <img src="/chat.png" className='object-cover w-[45rem]' alt="" />
       </motion.span> */}

      {/* <motion.p
      initial={{opacity:0,display:'hidden',filter:'blur(10px)'}}
      animate={{opacity:1,filter:'blur(0px)',display:'block'}}
      transition={{duration:1,delay:8}}
      className={`${montserrat.className} opacity-60 text-xl`}>You Think ! We Develop</motion.p> */}

   {/* <motion.div 
   initial={{opacity:0}}
   animate={{opacity:0.6,y:[10,0,10]}}
   transition={{duration:4,delay:10,repeat:Infinity,repeatType:'reverse'}}
   className='absolute bottom-10 text-3xl opacity-50'>
     <span className='flex justify-center items-center'>Scroll Up <svg  xmlns="http://www.w3.org/2000/svg"  width="32"  height="32"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 5l0 14" /><path d="M16 9l-4 -4" /><path d="M8 9l4 -4" /></svg></span>
   </motion.div> */}
    </div>

  

    </div>
        <motion.div style={{height:shadingHeight}} className="absolute -bottom-2 left-0 right-0  bg-gradient-to-b from-zinc-950/0 to-zinc-950 z-50" />
   </div>
   </BackgroundGradientAnimation>
   </div>
   {/* hero section */}

   {/* enter section */}
   {/* <div
   ref={exploreRef} 
   className={`${montserrat2.className} flex justify-center items-center h-[100vh] w-full bg-zinc-950`}>
    <motion.span 
    initial={{opacity:0,filter:'blur(20px)'}}
    whileInView={{opacity:1,filter:'blur(0px)'}}
    viewport={{amount:1}}
    transition={{duration:1.3}}
    className='flex gap-5 text-6xl'>
      <h1 className='font-semibold text-white'>Press</h1>
      <motion.h1 animate={{scale:[1,1.1]}} 
      transition={{duration:2,repeat:Infinity,repeatType:'mirror',}}
      className='p-2 bg-opacity-80 bg-[#1B2021] text-[#00FFFF]'>Enter</motion.h1>
      <h1 className='font-semibold text-white'>to</h1>
      <h1 className='italic text-white'>Explore</h1>
    </motion.span>
   </div> */}
   {/* enter section */}



{/* scrolling bento */}
<div ref={prodRef} className='lg:h-[410vh] w-full bg-zinc-950 text-white -z-10 flex flex-col justify-center items-center '>
   <h1 className=' font-mono pt-8 opacity-75  text-center  text-lg'>Introducing Codemate.AI</h1>

   
    <div className={`${montserrat.className} mt-4 leading-[1] text-[8vw]   lg:text-6xl  font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 lg:pb-2 w-full text-center `}>Your<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent  lg:text-7xl'> Full-Stack</span> Coding Assistant.</div>

    <div className='relative h-full w-full  flex flex-col justify-center items-center'>
    {/* <div className='h-[30%] w-full flex gap-10 px-10'>
       <Safari className='dark h-[27vw] w-fit' />
       <div>
        <h1 className={`${montserrat.className} text-5xl font-semibold mt-2`}>Codemate Build</h1>
        <p className={`text-sm opacity-65 ${montserrat.className} w-[50vw] mt-5`}>Codemate Build is your reliable partner in turning ideas into impactful solutions. With a focus on innovation and precision, we craft scalable applications and seamless digital experiences that empower businesses to grow. Our team is dedicated to building not just products, but long-lasting value that helps you stay ahead in a competitive world.</p>
       </div>
    </div> */}

<div className='relative h-full w-full flex justify-center  gap-8 '>
      {/* section for products */}
        <div className='hidden lg:flex sticky  pt-24  top-0 h-screen
        '>
          
        


          <motion.div 
          animate={{x:0}}
          transition={{duration:0.8}}
          >
          
          <AnimatePresence mode='wait'>

          <div  key={3} className="flex flex-col gap-2 ">
          <motion.div 
          key={1} 
          initial={{opacity:0,filter:"blur(30px)"}}
          animate={{opacity:1,filter:"blur(0px)"}}
           exit={{opacity:0,filter:"blur(30px)"}}
          transition={{duration:1}}
          className='h-[70vh] w-[57vw] rounded-lg'>
            <VideoEmbed/>
         </motion.div>
         <span className={`${montserrat.className} text-4xl flex flex-col gap-2 mt-3`}>
         <h1>Codemate Webapp</h1>
         <p className='opacity-70 text-sm'>This is the browser-based version of CodeMate — accessible via app.codemate.ai.</p>
         </span>
         </div>
    

          {/* {!isP1 && !isP2 && 
          <div  key={3} className="flex flex-col gap-2 ">
          <motion.div 
          key={1} 
          initial={{opacity:0,filter:"blur(30px)"}}
          animate={{opacity:1,filter:"blur(0px)"}}
           exit={{opacity:0,filter:"blur(30px)"}}
          transition={{duration:1}}
          className='h-[70vh] w-[57vw] rounded-lg'>
            <VideoEmbed/>
         </motion.div>
         <span className={`${montserrat.className} text-4xl flex flex-col gap-2`}>
         <h1>Codemate Webapp</h1>
         <p className='opacity-70 text-sm'>This is the browser-based version of CodeMate — accessible via app.codemate.ai.</p>
         </span>
         </div>
         }          
          
          {isP1 && 
          <div  key={2} className="flex flex-col gap-2 ">
          <motion.div 
         
          initial={{opacity:0,filter:"blur(30px)"}}
          animate={{opacity:1,filter:"blur(0px)"}}
           exit={{opacity:0,filter:"blur(30px)"}}
          transition={{duration:1}}
          className='h-[70vh] w-[57vw]  rounded-lg'>
            <VideoEmbed/>
         </motion.div>
         <span className={`${montserrat.className} text-4xl flex flex-col gap-2`}>
         <h1>Codemate Webapp</h1>
         <p className='opacity-70 text-sm'>This is the browser-based version of CodeMate — accessible via app.codemate.ai.</p>
         </span>
         </div>}  

         {isP2 &&           
         <div  key={3}  className="flex flex-col gap-2 ">
          <motion.div 
         
          initial={{opacity:0,filter:"blur(30px)"}}
          animate={{opacity:1,filter:"blur(0px)"}}
           exit={{opacity:0,filter:"blur(30px)"}}
          transition={{duration:1}}
          className='h-[70vh] w-[57vw]  rounded-lg'>
            <VideoEmbed/>
         </motion.div>
         <span className={`${montserrat.className} text-4xl flex flex-col gap-2`}>
         <h1>Codemate Webapp</h1>
         <p className='opacity-70 text-sm'>This is the browser-based version of CodeMate — accessible via app.codemate.ai.</p>
         </span>
         </div>}         */}
        </AnimatePresence>
       </motion.div>
       <motion.div 
       animate={{x:isP1? -700 : isP2? 0 : 0}}
       transition={{duration:0.8}}
       className='mb-52'>
       </motion.div>
    </div>
      {/* section for products */}
     


     {/* features of product */}

  <div className={`h-full  flex flex-col pt-10 lg:pt-24  gap-[3rem] items-center  ${montserrat.className} `}>
    
    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="chat.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Chat</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Codemate Chat turns your prompts into working code, helping you build faster.</p>
    </div>

    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="build2.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Build</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Codemate Build turns your prompts into working, deployable applications.</p>
    </div>

    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="eduD.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Education</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Smart, AI-powered classroom management made easy.</p>
    </div>

    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="eduA.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Education</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Codemate Education is your AI-powered classroom for managing courses, assignments, and learning.</p>
    </div>

    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="term.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Terminal</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Run code and scripts instantly with AI-powered terminal.</p>
    </div>

    <div>
    <div className='relative h-[33vh] lg:h-[20rem] w-[88vw] lg:w-[30vw]   overflow-hidden' >
     
     <div className='absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20  rounded-t-[3rem] border-x-[1px] border-zinc-600'/>
    

     <div className="absolute -bottom-14 lg:-bottom-[3rem]  w-full  flex items-center justify-center shadow-2xl">
     <img src="pulgin.svg" className='object-fit size-[90%] shadow-2xl'  alt="" />
     </div>
    </div>
    <h1 className='mt-1 text-lg font-semibold'>Introducing Pulgin</h1>
    <p className='opacity-65 text-sm lg:text-sm w-[88vw] lg:w-[30vw]'>Your AI coding agent in VS Code that turns prompts into working code instantly.</p>
    </div>
  </div>
{/* features of products */} 
 </div>
    


    </div>
</div>
{/* scrolling bento */}






<div ref={productsWrapper} className='hidden lg:block -z-20'>
  {isProds &&      
  <AnimatePresence mode="wait">
  <motion.div
    key={1} 
     exit={{opacity:0,filter:'blur(20px)'}}
     initial={{opacity:0,filter:'blur(20px)'}}
     animate={{opacity:1,filter:'blur(0px)'}}
     transition={{duration:0.8}}
     className='fixed top-0 left-32 h-full w-[70%] flex items-center justify-center z-50'>

      
      {isShowProd && <motion.div 
    key={1}
     exit={{opacity:0,filter:'blur(20px)'}}
     initial={{opacity:0,filter:'blur(20px)'}}
     animate={{opacity:1,filter:'blur(0px)'}}
      className='absolute left-[30rem] h-[30vw] w-[58vw] rounded-xl bg-zinc-900 overflow-hidden'>
        {/* <Safari url='codemate.ai' imageSrc='chatss.png' className='dark'/> */}
        {/* <img src="https://drive.codemate.ai/playground.gif" className='w-full h-full object-fit rounded-xl' alt="" /> */}
        <motion.video autoPlay loop muted playsInline initial={{scale:1.025}} className='h-full w-full rounded-xl ' src='prR.mp4'></motion.video>
        </motion.div>}
     
       {isShowProd &&      <motion.div 
     key={2}
     style={{x:div1X}}
     exit={{opacity:0,filter:'blur(20px)'}}
     initial={{opacity:0,filter:'blur(20px)'}}
     animate={{opacity:1,filter:'blur(0px)'}}
     className='absolute left-[30rem] h-[30vw] w-[58vw] rounded-xl bg-zinc-950 overflow-hidden'>
      {/* <Safari url='codemate.ai' imageSrc='buildss.png' className='dark'/> */}
        <motion.video autoPlay loop muted playsInline initial={{scale:1.05}} className='h-full w-full rounded-xl ' src='doc.mp4'></motion.video>
      </motion.div>}  

     {isShowProd && <motion.div
     key={3}
     style={{x:div2X}} 
     exit={{opacity:0,filter:'blur(20px)'}}
     initial={{opacity:0,filter:'blur(20px)'}}
     animate={{opacity:1,filter:'blur(0px)'}}
     className='absolute left-[30rem] h-[30vw] w-[58vw] rounded-xl bg-white overflow-hidden'>
      {/* <Safari url='codemate.ai' className='dark object-cover 
      object-left-top' imageSrc='eduation.png'/> */}
        <motion.video autoPlay loop muted playsInline initial={{scale:1.025}} className='h-full w-full rounded-xl ' src='termvid.mp4'></motion.video>
     </motion.div>}
        
      {!isRef2 && !isRef3 &&      
    <motion.div 
     style={{x:div3X}} exit={{opacity:0,filter:'blur(20px)'}} key={4} className='absolute left-[30rem] h-[30vw] w-[58vw] rounded-xl  text-white z-50'>
             <motion.div  style={{x:xE}} className='h-full w-full overflow-y-auto'>
             <CodeOverlay ref={codeOverlayRef}/> 

        <CodeEditor comp1={brokenComponent} comp2={fixedComponent} isFix={isFix}/> 
        </motion.div>
     </motion.div>  }
     </motion.div>
     </AnimatePresence> }


   {/* products showcase */}
   <div 
   ref={productShowRef} 
   
   className='relative h-[200vw] w-full bg-zinc-950'>
   
 <div className={`${montserrat.className} sticky top-0 z-20  text-5xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pl-14 mb-6 pt-20 pr-[62vw] 2xl:pr-[55vw] pb-1`}>
  <div className='relative h-full w-full bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pb-2'>
   <span className='z-50'> 
   We got<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Everything</span> for you.</span>
   <div className='top-0 absolute w-full h-full bg-zinc-950 -z-10'/>
  </div>
 </div>



   <div className='sticky top-[85vh] z-40'> 
        <motion.div 
        initial={{opacity:0,filter:'blur(10px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{delay:0.2,duration:0.6}}
        className={`${montserrat.className}  text-2xl pr-[6rem] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 pb-2 w-full text-right`}>From <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl'>Web-Application</span></motion.div>
   </div>

   <div className='sticky top-[9rem]   h-screen w-full overflow-x-hidden'>
       
<div
className='relative h-[75%] w-[40%] flex  items-center justify-center  pl-10 py-3'>

    <div className={`relative ${montserrat.className}  text-7xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent flex flex-col   h-full w-full mt-10`}>
     
       <div className='relative h-full py-6 pl-5 flex justify-center overflow-hidden gap-5 '>
        
        <div>
        <motion.div 
        style={{y:height}}
        className='absolute rounded-md w-[0.25rem] h-[20%]  bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]  opacity-80 z-50'/>

       <div className='w-[0.20rem] rounded-md  h-full bg-[#1c1c1c] '/> 
       </div>

       <motion.div 
       style={{y:titlesX}}
       className='h-full w-full flex flex-col gap-[13rem]'>
          
        <motion.div 
        style={{opacity:op1}}
        className='text-white flex flex-col gap-2'>
          <h1 className='text-2xl'>PR Review</h1>

          <p className='text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal'>
         Acts as your AI coding partner by reviewing pull requests and catching issues early, so you can focus on building features that matter.
          </p>
        </motion.div>
         
                 <motion.div 
                 style={{opacity:op2}}
                 className='text-white flex flex-col gap-2'>
          <h1 className='text-2xl'>Documentation</h1>

          <p className='text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal'>
            Acts as your AI coding partner by simplifying documentation and keeping it up-to-date, so you can focus on writing clean, impactful code.
          </p>
        </motion.div>


                <motion.div 
                style={{opacity:op3}}
                className='text-white flex flex-col gap-2'>
          <h1 className='text-2xl'>Terminal</h1>

          <p className='text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal'>
            Reviews pull requests to catch errors, enforce coding standards, and suggest improvements before merging.
          </p>
        </motion.div>


                <motion.div 
                style={{opacity:op4}}
                className='text-white flex flex-col gap-2'>
          <h1 className='text-2xl'>Gonna help you in your shit..</h1>

          <p className='text-sm opacity-50 w-[33rem]'>
            It Surely does that...
          </p>
        </motion.div>
        
       </motion.div>

       </div>

    </div>


</div>

   </div>

   </div>
    {/* products showcase */}

   <div ref={productRef} className='relative h-[550vh] w-full bg-zinc-950 text-white flex  flex-col mb-32'>


      <div className='sticky  top-[85vh]  z-50'> 
        <div className={`${montserrat.className}  text-2xl pl-[6rem] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 pb-2 w-full `}>To your<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl'> IDE</span></div>
   </div>



 <div className={`${montserrat.className} sticky top-7  text-5xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pr-16 mb-6 pt-20 text-right pl-[50vw]  pb-1 z-40`}>
 <div className='bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent relative h-full w-full pb-2'>
  <span className='z-40'>
  Everything means <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent pb-1'>Everything</span> right?</span>
  <div className='h-full w-full absolute  z-50'/>
 </div>
 </div>

     <motion.div 
     initial={{opacity:0,filter:'blur(50px)'}}
     whileInView={{opacity:1,filter:'blur(0px)'}}
     transition={{duration:0.8}}
     className='sticky h-screen top-0 w-full flex  items-center z-50'>
     {/* <AnimatePresence mode='wait'>
      {!d && !r && !a && <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
            animate={{opacity:1,filter:'blur(0px)'}}
            transition={{duration:1}}
            exit={{opacity:0,filter:'blur(20px)'}}
            key={1}
            className='absolute top-0 z-30 left-0 h-screen flex  justify-center gap-3 items-center ml-9 text-2xl font-mono w-[15%] flex-col z-0'> <h1 className='opacity-45'>Press</h1> <h1 className='text-5xl text-[#00FFFF] opacity-70'>"D"</h1>  <h1 className='opacity-45'>for Debug mode</h1></motion.div>
            }

              {d && <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
            animate={{opacity:1,filter:'blur(0px)'}}
            transition={{duration:1}}
            exit={{opacity:0,filter:'blur(20px)'}}
            key={2}
            className='absolute top-0 z-30 left-0 h-screen flex  justify-center gap-3 items-center ml-9 text-2xl font-mono w-[15%] flex-col '> <h1 className='opacity-45'>Press</h1> <h1 className='text-5xl text-[#00FFFF] opacity-70'>"R"</h1>  <h1 className='opacity-45'>for Review mode</h1></motion.div>
            }    

            {r && 
            <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
            animate={{opacity:1,filter:'blur(0px)'}}
            transition={{duration:1}}
            exit={{opacity:0,filter:'blur(20px)'}}
            key={3}
            className='absolute top-0 z-30 right-0 h-screen flex  justify-center gap-3 items-center mr-9 text-2xl font-mono w-[15%] flex-col'> <h1 className='opacity-45'>Press</h1> <h1 className='text-5xl text-[#00FFFF] opacity-70'>"A"</h1>  <h1 className='opacity-45'>for Auto-complete mode</h1></motion.div>
            }

            {a && 
            <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
            animate={{opacity:1,filter:'blur(0px)'}}
            transition={{duration:1}}
            exit={{opacity:0,filter:'blur(20px)'}}
            key={4}
            className='absolute top-0 z-30 left-0 h-screen flex  justify-center gap-3 items-center ml-9 text-2xl font-mono w-[15%] flex-col'> <h1 className='opacity-45'>Press</h1> <h1 className='text-5xl text-[#00FFFF] opacity-70'>"D"</h1>  <h1 className='opacity-45'>for Debug mode</h1></motion.div>
            }
      </AnimatePresence> */}


      <div className='relative flex justify-center items-center w-[70%] z-50'>

        
      <motion.div 
      ref={feature1Ref}
      
      className='relative h-[30vw] w-[58vw] opacity-80 rounded-xl flex justify-center items-center ml-[3.3rem] mb-4 '>

          

       {/* {isRef1 && <motion.div className='absolute h-full w-full rounded-xl '>
          <CodeOverlay ref={codeOverlayRef}/> 

        <CodeEditor comp1={brokenComponent} comp2={fixedComponent} isFix={isFix}/>
        </motion.div>} */}

        
       {isRef2 &&  <motion.div
        initial={{opacity:0,filter:'blur(20px)'}}
        animate={{opacity:1,filter:'blur(0px)'}}
        transition={{duration:1}}
        onAnimationStart={() => setIsAuto(false)}
        className=' absolute h-full w-full bg-zinc-900 rounded-xl flex   opacity-100 overflow-hidden'>

        <AnimatePresence>
        {isLoad2 && <div data-lenis-prevent><CodeReviewOverlay setIsFix={setIsFix2} setIsLoad2={setIsLoad2}/></div>}
        </AnimatePresence>

        <div data-lenis-prevent className='w-full'>
        <ReviewCodeEditor isFix={isFix2}  comp1={ReviewComponent} comp2={AfterReviewComponent} />
        </div> 
        </motion.div>}

       {isRef3 &&  <motion.div
        
        initial={{opacity:0,filter:'blur(20px)'}}
        animate={{opacity:1,filter:'blur(0px)'}}
        transition={{duration:1}}
        
        className=' absolute h-full w-full bg-zinc-900 rounded-xl flex  opacity-100'>
               <AutoCodeEditor comp1={AutoCompleteComponent} setIsFix={setIsFix} isFix={isAuto}/>
                {/* <CodeEditor  />   */}
        </motion.div>}

        {/* <CodeOverlay ref={codeOverlayRef}/> 

        <CodeEditor comp1={brokenComponent} comp2={fixedComponent} isFix={isFix}/> */}


{/* 
<AnimatePresence mode="wait">
     
      
        <motion.div  
        key={1}
        
        
        transition={{duration:0.7}} 
        exit={{x:0}} 
        ref={drawer1Ref}
        whileHover={{background:'#ffffff',
           color:'black',
           opacity:0.4
        }}
        style={{background: 'rgba(255, 255, 255, 0.02)',
        y:drawerX,  
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4.7px)',
        WebkitBackdropFilter: 'blur(4.7px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        className='absolute bottom-0 right-8 py-2 px-4 bg-white rounded-b-2xl text-2xl  flex flex-col justify-center items-center  text-white cursor-pointer -z-10'>
       

          Debug

      


        </motion.div>
        

         
        <motion.div 
        key={2}
        transition={{duration:0.7}} 
        exit={{x:0}} 
        ref={drawer2Ref}
        style={{background: 'rgba(255, 255, 255, 0.02)',
        y:
        
        drawerX2,  
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(4.7px)',
        WebkitBackdropFilter: 'blur(4.7px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        className='absolute bottom-0 right-8 py-2 px-4 bg-white rounded-b-2xl text-2xl  flex flex-col justify-center items-center  text-white cursor-pointer -z-10'>
       

         Review


      


      </motion.div>
      


      
        <motion.div 
        exit={{x:0}} 
  
        key={3}

        style={{background: 'rgba(255, 255, 255, 0.02)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
        y:drawerX3,
        backdropFilter: 'blur(4.7px)',
        WebkitBackdropFilter: 'blur(4.7px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        }}
        className='absolute bottom-0 right-8 py-2 px-4 bg-white rounded-b-2xl text-2xl  flex flex-col justify-center items-center  text-white cursor-pointer -z-10'>
       
        Auto-Complete

        </motion.div>
        
</AnimatePresence> */}



      </motion.div>  
       
       {/* <motion.h1 
       style={{y:featureTitleY,opacity:featureTitleOpacity}}
       className='absolute text-7xl text-nowrap'>You can do much more with just Plugin...</motion.h1> */}
      </div>

        <div 
        className='relative w-[34%] h-[75%] flex  justify-end pr-[3.5rem] py-10 gap-10 z-50 mt-[10rem]'> 

       {isRef1 && !isRef2 && !isRef3 &&   
      <div className={`${montserrat.className}relative w-full z-[99999999]  flex justify-center items-start pt-10 h-full`}>
         <div className='z-[99999998]'>
          <h1 className={`${montserrat.className} text-white text-3xl mb-5  z-[99999996] font-semibold`}>Debug</h1>
       <motion.span

       className='z-[99999997]'
       >

        <p className={`${montserrat.className} text-lg  z-[99999996]`}><span className='opacity-60'>An</span> <span className='text-[#00BFFF] font-semibold'>AI-Powered Debugger</span> <span className='opacity-60'>that quickly identifies errors, explains their causes, and suggests precise fixes—making it easier to resolve issues and keep development moving smoothly.</span></p> 
       </motion.span>

       {isLoad?    
        <motion.span 
        initial={{opacity:0,filter:'blur(20px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{duration:1,delay:1}}
        className='mb-10 z-[99999996]'>
        <div className='mt-10'>
        <LoaderOne/>
        </div>
        </motion.span>  :         <button ref={debugBtnRef} onClick={handleOverlay} className={`${montserrat.className} bg-gradient-to-br border-y-[0.1px]  border-[#F0EAD6]/80 from-[#F0EAD6]/90  to-[#FAF9F6]/25  text-lg rounded-[25px] px-6 text-black py-2 mt-10 hover:opacity-70 z-[99999996]`}>
          <span className='font-semibold  text-zinc-950'>Debug</span> this code
        </button>} 
        </div>

      </div>
      }


      {isRef2 && !isRef1 && !isRef3 &&       
      <div className='relative w-full z-[99999999] flex justify-center items-start h-full pt-10'>
         <div className='z-[9999999]'>
          <h1 className={`${montserrat.className} text-white text-3xl mb-5  z-[99999996] font-semibold`}>Review</h1>
       <motion.span

       className='z-[99999997]'
       >

        <p className={`${montserrat.className} text-lg  z-[99999996]`}><span className='opacity-60'>An</span> <span className='text-[#00BFFF] font-semibold'>AI-Powered Code Reviewer</span> <span className='opacity-60'>that scans your code in real time, detects bugs and vulnerabilities, and suggests improvements for readability, performance, and best practices—helping you write cleaner, more reliable code faster.</span></p> 
       </motion.span>

       {/* {isLoad?    
        <motion.span 
        initial={{opacity:0,filter:'blur(20px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{duration:1,delay:1}}
        className='mb-10 z-[99999996]'>
        <LoaderOne/>
        </motion.span>  :         }  */}
        <AnimatePresence>
        {reviewBtn &&  <motion.button exit={{opacity:0,filter:'blur(20px)'}} transition={{duration:0.5}}  onClick={handleOverlayR} className={`${montserrat.className} bg-gradient-to-br border-y-[0.1px] border-[#F0EAD6]/80 from-[#F0EAD6]/80 to-[#FAF9F6]/25 text-lg rounded-[25px] px-6 text-black py-2 mt-10 hover:opacity-70 z-[99999996]`}>
            <span className='font-semibold  text-zinc-950'>Review</span> this code
        </motion.button>}
        </AnimatePresence>
        </div>

      </div>}

      {isRef3 && !isRef1 && !isRef2 &&       
      <div className='relative w-full z-[9999999999] flex justify-center items-start h-full pt-10'>
         <div className='z-[99999998]'>
          <h1 className={`${montserrat.className} text-white text-3xl mb-5 z-[99999996] font-semibold`}>Auto-Complete</h1>
       <motion.span

       className='z-[99999997]'
       >

        <p className={`${montserrat.className} text-lg  z-[99999996]`}><span className='opacity-60'>An</span> <span className='text-[#00BFFF] font-semibold'>Intelligent Auto-Completer</span> <span className='opacity-60'>tool that predicts your next lines of code, reduces repetitive typing, and speeds up development by suggesting accurate, context-aware completions in real time.</span></p> 
       </motion.span>

       {isLoad?    
        <motion.span 
        initial={{opacity:0,filter:'blur(20px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{duration:1,delay:1}}
        className='mb-10 z-[99999996]'>
        <LoaderOne/>
        </motion.span>  :         <div className={`${montserrat.className} text-2xl  mt-10 cursor-not-allowed font-extralight z-[99999996] opacity-30`}>
        <span>Press</span> <span className='font-mono text-3xl '>"TAB"</span> <span>to auto-complete</span>

        
        </div>} 
        </div>

      </div>}

      {isRef3  && 
      <div className='absolute z-[99999999] bg-zinc-950 w-[95%] h-full'>

      </div>}

        <div className='z-[99999999]'>
        <motion.div 
        style={{height:barY}}
        className='absolute rounded-md w-[0.25rem] h-[15%]  bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]  opacity-80 z-[99999999]'/>

       <div className='w-[0.20rem] rounded-md  h-full bg-[#1c1c1c] z-[99999999]'/> 
      </div>
        

      </div>
     </motion.div>
      


   </div>

</div>

{/* for mobile */}
<div className='lg:hidden'>

<div ref={MFRef} className='h-[200vh]'>
<div className='sticky top-0 w-full py-10 overflow-hidden'>
   <div className={`${montserrat.className}   z-20 leading-[1]  text-[7.7vw] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  mb-6 pt-20 2xl:pr-[55vw] pb-1`}>
  <div className='relative h-full w-full bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pb-2 text-center pr-2 pl-[5vw]'>
   <span className='z-50'> 
   We got<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Everything</span> for you.</span>
   <div className='top-0 absolute w-full h-full bg-zinc-950 -z-10'/>
  </div>
 </div>
 
 <motion.div style={{x:mx}} className='flex pl-16 gap-5'>
   <div className='flex flex-col gap-2'>
   <div className='h-[28vh] w-[95vw] bg-zinc-600 overflow-hidden rounded-xl'>
    <img src="https://drive.codemate.ai/debug-code.gif" alt="" className='h-full w-full'/>
   </div>
   <h1 className='font-bold text-2xl'>Debug</h1>
   <p className='w-full text-sm opacity-70'>Your AI debugger that identifies and resolves errors quickly, so you can keep building without interruptions.</p>
   </div>


   <div className='flex flex-col gap-2'>
      <div className='h-[28vh] w-[95vw] bg-zinc-600 overflow-hidden rounded-xl'>
    <img src="https://drive.codemate.ai/review-code.gif" alt="" className='h-full w-full'/>
   </div>
   <h1 className='font-bold text-2xl'>Review</h1>
   <p className='w-full text-sm opacity-70'>Your AI reviewer that ensures cleaner, more reliable code so you can ship with confidence.</p>
   </div>

   <div className='flex flex-col gap-2'>
      <div className='h-[28vh] w-[95vw] bg-zinc-600 overflow-hidden rounded-xl'>
    <img src="https://drive.codemate.ai/optimise-code.gif" alt="" className='h-full w-full'/>
   </div>
   <h1 className='font-bold text-2xl'>Optimize</h1>
   <p className='w-full text-sm opacity-70'>Your AI optimizer that refactors and enhances code performance so you can deliver faster, smoother applications.</p>
   </div>
 </motion.div>
  
    <div className='text-right mt-10 mr-10 z-40'> 
        <motion.div 
        initial={{opacity:0,filter:'blur(10px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{delay:0.2,duration:0.6}}
        className={`${montserrat.className}  text-[4vw]  font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 pb-2 w-full text-right`}>From your <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-2xl'>IDE</span></motion.div>
   </div>
  </div>


 </div>


 <div className=' w-full py-10'>
   <div className={`${montserrat.className}   z-20 leading-[1]  text-[7.7vw] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent   mb-6 pt-20 2xl:pr-[55vw] pb-1`}>
  <div className='relative h-full w-full bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pb-2 text-center '>
   <span className='z-50'> 
   Everthing means<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Everything</span> right?</span>
   <div className='top-0 absolute w-full h-full bg-zinc-950 -z-10'/>
  </div>
 </div>
 
 <div className='flex justify-center  gap-5'>
   <div className='flex flex-col gap-2'>
   <div className='h-[25vh] w-[85vw] bg-zinc-600 rounded-xl overflow-hidden'>
    <VideoEmbed/>
   </div>
  

   </div>





 </div>
  
    <div className='text-left mt-10 ml-10 z-40'> 
        <motion.div 
        initial={{opacity:0,filter:'blur(10px)'}}
        whileInView={{opacity:1,filter:'blur(0px)'}}
        transition={{delay:0.2,duration:0.6}}
        className={`${montserrat.className}  text-[5vw]  font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  pt-2 pb-2 w-full text-left`}>To<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-2xl'>Web-App</span></motion.div>
   </div>
  


 </div>
</div>
{/* for mobile */}

{/* enterprises section  */}
<div className=' w-full pt-16 px-8 lg:px-14 overflow-hidden'>
<h1 className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent lg:text-4xl font-semibold ">
For Enterprises
</h1>
<div className='text-[6.5vw] lg:text-[6vw] lg:text-6xl flex flex-col lg:gap-1 font-semibold bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent pb-1'>
<h1>Inspire your people</h1>
<h1>and grow with purpose</h1>
</div>

<div className='relative flex justify-center items-center mt-20 w-full'>
  <div 
  style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex:99999,
        }}
  className='relative  h-[60vh]  lg:h-[35rem] lg:w-[70%] rounded-[4rem] px-8 border-y-[1px]  border-white border-opacity-50'>
      <h1 className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-left text-9xl font-semibold mt-5">
“
</h1>
<div className='text-[1.45rem] lg:text-[2.75rem] leading-[1] font-semibold'>
Through the insights Codemate provides, teams are inspired to achieve what truly matters <span className='opacity-60'>— building impactful solutions, shaping future growth, and delivering measurable value.</span>
</div>


<div className='absolute bottom-10'>
  <h1 className='font-semibold'>Ayush Singhal</h1>
  <p className='opacity-50'>Founder of Codemate</p>
</div>
  </div>
  
  <motion.img initial={{scale:0.75,y:20}} src="gl.png" alt=""  className="absolute hidden lg:flex  "/>
  
    <motion.img initial={{scale:1.1,y:150}} src="gl.png" alt=""  className="absolute lg:hidden  "/>
  

</div>


<div className='text-2xl lg:text-5xl  flex flex-col gap-1 font-semibold mt-20 opacity-70'>
<h1 >Solutions that scales</h1>
<h1>your business</h1>
</div>

<div className='w-full flex flex-col lg:flex-row  justify-center items-center gap-5  lg:gap-[1.25] mt-10 '>
  <div className='relative h-[35vh] lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col  gap-2  border-x-[1px] border-y-[0.5px] border-white border-opacity-20 px-3'
  style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex:99999,
        }}
  >
  <h1 className='text-left text-[4vw] lg:text-xl font-semibold mt-[5.5rem] lg:mt-24  bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>Streamline and synchronize your codebase across knowledge bases with Codemate.</h1>  
  <p className='text-xs lg:text-sm opacity-50'>
    Codemate helps you streamline and synchronize your codebase across knowledge bases, ensuring consistency, reducing redundancy, and enabling your team to focus on innovation and faster delivery.
  </p>
  <motion.img initial={{scale:1.2}} src="1st icon (3).svg" alt=""  className="absolute object-fit top-5 left-3 lg:top-5 lg:left-1 brightness-90 size-[17%]"/>
  </div> 

  <div className='flex flex-col gap-5 lg:flex-row lg:gap-[1.25]'>
   <div className='relative h-[35vh] lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col gap-2   border-x-[1px] border-y-[0.5px] border-white border-opacity-20 px-3'
     style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex:99999,
        }}
   >
      <h1 className=' text-left text-[4vw] lg:text-xl font-semibold  mt-[5.5rem] lg:mt-24  bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>Run it seamlessly in your environment with Codemate.</h1>
        <p className='text-xs lg:text-sm opacity-50'>
Run it seamlessly in your environment with Codemate, ensuring smooth integration with your existing workflows. Codemate adapts to your setup, minimizing disruption while maximizing efficiency, so your team can maintain focus on delivering quality code without added complexity.
  </p>
    <motion.img initial={{scale:1}} src="icon2.svg" alt=""  className="object-fit absolute top-5 left-2 lg:left-0 brightness-90 size-[20%]"/>
   </div>
   <div className='relative h-[35vh] lg:h-[19rem] lg:w-[30vw] rounded-2xl flex flex-col  border-x-[1px] border-y-[0.5px]   border-white border-opacity-20 gap-2 px-3'
     style={{background:!isNBack? 'rgba(15, 12, 12, 0.2)' : 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex:99999,
        }}
   >
      <h1 className=' text-left text-[4vw] lg:text-xl font-semibold mt-[5.5rem] lg:mt-24  bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent'>Codemate makes it easy for developers and non-developers to work together.</h1>
        <p className='text-xs lg:text-sm opacity-50'>
Codemate’s full-stack nature bridges the gap between developers and non-developers, enabling seamless collaboration, simplifying workflows, and boosting productivity across projects.
  </p>
      <motion.img initial={{scale:1}} src="e3.svg" alt=""  className="object-fit absolute top-5 left-2 lg:left-0 brightness-90 size-[20%]"/>
   </div>
  </div>
</div>

<div className=' lg:text-2xl  flex flex-col gap-1 font-semibold mt-10 opacity-70'>
  <h1>Explore more reasons for your business</h1>
  <h1>to invest in Codemate tools</h1>
</div>
      <a href="https://cal.com/ayushsinghal/book-a-demo" target="_blank" >
      <motion.button
      whileHover={{opacity:1}} 
      className='px-4 py-2  bg-[#FFFFFF] text-black  rounded-full   opacity-80 mt-5 font-semibold'>Book a Call</motion.button>
      </a>
</div>
{/* enterprises section */}
  


{/* trusted by section */}
<div className={`${montserrat.className} lg:pb-32 pb-20  w-full bg-zinc-950 text-white z-50`}>
 <div className='pt-[5rem] lg:pt-[15rem]'>
 <h1 className='text-center text-[10vw] lg:text-7xl font-bold text-white  opacity-45'>Trusted By</h1>
 <p className='text-center mt-2  lg:text-xl opacity-30'>The Developers from the well known orgs around the globe</p>
     
     
     <div className='flex flex-col justify-center items-center w-full'>
      <div className='flex lg:gap-10 justify-center items-center mt-4'>
       <img src='paytm.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
       <img src='amazon.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
       <img src='fampay.svg' className='object-fit w-[30vw] lg:w-[25vw]'/>
      </div>
      <div className='flex gap-4'>
        <img src='inno.svg' className='object-fit w-[35vw] lg:w-[25vw]]'/>
        <img src='atl.svg' className='object-fit w-[35vw] lg:w-[25vw]'/>
      </div>
     </div>

 </div>


 <div className='flex flex-col w-full lg:flex-row gap-10 justify-center items-center lg:gap-32 mt-10 lg:mt-16'>
  <div className=' w-[50vw] lg:size-[13rem]'>

      <h1 className="text-8xl text-center w-full font-semibold opacity-70">55%</h1>   
      <p className='text-xl opacity-70 mt-3 text-center'>Faster coding</p>
    </div>
  <div className=' w-[50vw] lg:size-[13rem]'>

      <h1 className="text-8xl text-center w-full font-semibold opacity-70">39%</h1>   
      <p className='text-xl opacity-70 mt-3 text-center'>Improvement in code quality</p>
    </div>
  <div className=' w-[50vw] lg:size-[13rem]'>

         <h1 className="text-8xl text-center w-full font-semibold opacity-70">68%</h1>   
      <p className='text-xl opacity-70 mt-3 text-center'>Had a positive experience</p>
    </div>
 </div>
</div> 
{/* trusted by section */}


{/* bento */}
     {/* <div className=' relative h-[170vh] w-full bg-zinc-950 text-white overflow-hidden'>
   <div className={`${montserrat.className}  text-8xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent pl-10 mb-6 pt-20 text-center pb-1`}>What<span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> else</span> we got?</div>
   
  <MagicBento 
  textAutoHide={true}
  enableStars={true}
  enableSpotlight={true}
  enableBorderGlow={true}
  enableTilt={false}
  enableMagnetism={true}
  clickEffect={true}
  spotlightRadius={400}
  particleCount={12}
  glowColor="0, 191, 255"
/>

  </div>  */}
{/* bento   */}

<div className={`${montserrat.className} leading-[1] text-[10vw]  lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent lg:pl-10 pt-20 text-center`}>Do not listen to us but from <span className='bg-gradient-to-b  from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>People</span></div>

<div ref={testiRef} className='relative h-[400vh] w-full bg-zinc-950 '>


   <div className=' sticky top-0   h-screen w-full overflow-x-hidden '>
       
<div
className='relative h-full w-full flex  items-center justify-center    py-3 overflow-hidden'>


     {/* <motion.div 
     style={{x:commentsX}}
     className={`${montserrat.className} absolute flex gap-10 text-7xl text-white font-semibold`}>
<h1 className="whitespace-nowrap text-opacity-80">thrilled 🤩</h1>
<h1 className="whitespace-nowrap text-opacity-80">grateful 🙏</h1>
<h1 className="whitespace-nowrap text-opacity-80">inspired ✨</h1>
<h1 className="whitespace-nowrap text-opacity-80">amazed 🤯</h1>
<h1 className="whitespace-nowrap text-opacity-80">relieved 😌</h1>
<h1 className="whitespace-nowrap text-opacity-80">blessed 🥰</h1>
<h1 className="whitespace-nowrap text-opacity-80">accomplished 🏆</h1>
<h1 className="whitespace-nowrap text-opacity-80">delighted 😊</h1>
<h1 className="whitespace-nowrap text-opacity-80">empowered 💪</h1>
<h1 className="whitespace-nowrap text-opacity-80">fulfilled ❤️</h1>
     </motion.div> */}

      
        <img src="/codemateLogoB.svg" className='absolute object-fit w-[95vw] brightness-[0.6]' alt="" />
    


     <div className={`${montserrat.className} text-white h-full w-full flex items-center justify-center flex-col`}>
     <motion.div className='absolute  h-[30rem] w-[40rem]  rounded-3xl'></motion.div>
     

     <motion.div 
     style={{y:tdiv1X}}
     className='absolute h-[38vh] w-[90vw]  lg:h-[30rem] lg:w-[40rem]  rounded-3xl flex justify-center items-center'>
      <motion.div 
      animate={{rotate:10}}
      className='h-[70%] w-[99%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-center px-5 lg:px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/ayushbansal.jpeg" alt="" className='size-20 rounded-full' /></div>
      <div className='flex flex-col'>
       <h1 className='font-semibold text-2xl'>Ayush Bansal</h1>
        <p className='opacity-60 text-sm lg:text-md'>Software Engineer-II, Amazon</p> 
      </div>
       </div>

       <div className='leading-[1.1] text-[3.7vw] lg:text-2xl'><span className='text-[#00BFFF]'>CodeMate.ai</span> has revolutionized my coding workflow with accurate AI suggestions and a user-friendly interface. Highly recommended!</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div>
     <motion.div
     style={{y:tdiv2X}} 
     className='absolute  h-[38vh] w-[90vw]  lg:h-[30rem] lg:w-[40rem]  rounded-3xl flex justify-center items-center'>
            <motion.div 
      animate={{rotate:5}}
      className='h-[70%] w-[99%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-5 lg:px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/hani.webp" alt="" className='size-20 rounded-full' /></div>
      <div className='flex flex-col'>
        <h1 className='font-semibold text-2xl'>Hani H.</h1>
        <p className='opacity-60'>Founder</p> 
      </div>
       </div>

       <div className='leading-[1.1] text-[3.3vw] lg:text-2xl'><span className='text-[#00BFFF]'>CodeMate</span> has lots of great features. You can request code samples when stuck, or get a code review to spot issues you might miss. The Debugger is a life saver—it quickly found a bug in my code that was filling the error logs!</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div>
     <motion.div style={{y:tdiv3X}} className='absolute h-[38vh] w-[90vw]  lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
      <motion.div 
      animate={{rotate:0}}
      className='h-[70%] w-[99%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-5 lg:px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'><img src="https://drive.codemate.ai/vilkho_appsumo.webp" alt="" className='size-20 rounded-full' /></div>
      <div className='flex flex-col w-[50%]'>
       <h1 className='font-semibold text-xl lg:text-2xl'>Vilkhovskiy</h1>
        <p className='opacity-60 text-sm lg:text-md '>Chief Executive Officer, Softenq</p> 
      </div>
       </div>

       <div className='leading-[1.1] text-[3.3vw] lg:text-2xl'>An excellent solution for project analysis and efficient development! I love how <span className='text-[#00BFFF]'>CodeMate</span> can analyze an entire project, assign tasks for refactoring or code generation, and even ensure the project is covered with tests.</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
      </motion.div>  
     <motion.div style={{y:tdiv4X}} className='absolute  h-[38vh] w-[90vw]  lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
            <motion.div 
      animate={{rotate:-5}}
      className='h-[70%] w-[99%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-5 lg:px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'><img src="https://i.pravatar.cc/150?u=kitty.liu" alt="" className='size-20 rounded-full' /></div>
      <div className='flex flex-col'>
       <h1 className='font-semibold text-2xl'>Kitty Liu</h1>
        <p className='opacity-60'>Engineering</p> 
      </div>
       </div>

       <div className='leading-[1.1] text-[4vw] lg:text-2xl'><span className='text-[#00BFFF]'>Codemate</span> is doing a great job with its simplicity. I can't wait to see more features they are going to release soon.</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div>
     <motion.div style={{y:tdiv5X}} className='absolute  h-[38vh] w-[90vw]  lg:h-[30rem] lg:w-[40rem] rounded-3xl flex justify-center items-center'>
                  <motion.div 
      animate={{rotate:-10}}
      className='h-[70%] w-[99%] lg:w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-5 lg:px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'><img src="https://i.pravatar.cc/150?u=david.kim" alt="" className='size-20 rounded-full' /></div>
      <div className='flex flex-col'>
       <h1 className='font-semibold text-2xl'>Keith Price</h1>
        <p className='opacity-60'>Backend Engineer</p> 
      </div>
       </div>

       <div className='leading-[1.1] text-[3.1vw] lg:text-2xl'>Love this tool! It can train on the entire solution (and others), saving so much time and frustration. <span className='text-[#00BFFF]'>Unlike ChatGPT</span>, it finds the right methods and code blocks with ease, and the ability to retain training on past solutions is phenomenal.</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div>
     {/* <motion.div style={{y:tdiv6X}} className='absolute  h-[30rem] w-[40rem]  rounded-3xl flex justify-center items-center'>
                        <motion.div 
      animate={{rotate:-15}}
      className='h-[70%] w-[90%] bg-[#131316] border border-[#434344] rounded-[2rem] flex flex-col items-cente px-8 py-5 gap-5'>
       <div className='flex w-full gap-4 items-center'>
       <div className='rounded-full bg-white size-20'></div>
      <div className='flex flex-col'>
       <h1>Ayush Bansal</h1>
        <p>Software Engineer-II, Amazon</p> 
      </div>
       </div>

       <div className='text-2xl'>CodeMate.ai has revolutionized my coding workflow with accurate AI suggestions and a user-friendly interface. Highly recommended!</div>

       <div className='w-full flex justify-between'>
       </div>
      </motion.div>
     </motion.div> */}
     </div> 
</div>

   </div>
     </div>

     <div ref={footerRef}>
    <Footer/>
    </div>
    </div>


  )
}

export default Page



// function Product2({productRef2}:{productRef2:React.RefObject<HTMLDivElement>}){
  
//   const feature2Ref = useRef<HTMLDivElement>(null);
//   const {scrollYProgress:p2YProg} = useScroll({
//       target:productRef2,
//       offset:['start end','end start']
//     });
//   const drawerX = useTransform(p2YProg,[0.4,1],[0,-1500]);  
//   return(
//     <>
//     <motion.div 
//      initial={{opacity:0,filter:'blur(50px)'}}
//      whileInView={{opacity:1,filter:'blur(0px)'}}
//      transition={{duration:0.8}}
//      className='sticky h-screen top-0 w-full flex justify-center items-center'>
//       <div className='relative flex justify-center items-center'>
//       <motion.div 
//       ref={feature2Ref}
//       style={{scale:1,}}
//       className='relative h-[35vw] w-[55vw] opacity-80 rounded-xl flex justify-center items-center bg-white'>


//         {/* <CodeOverlay ref={codeOverlayRef}/> 

//         // <CodeEditor comp1={brokenComponent} comp2={fixedComponent} isFix={isFix}/> */}

//         <motion.div 
//         style={{x:drawerX,background:'rgba(255, 255, 255, 0.02)',
//         boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
//         backdropFilter: 'blur(4.7px)',
//         WebkitBackdropFilter: 'blur(4.7px)',
//         border: '1px solid rgba(255, 255, 255, 0.3)',
//         }}
//         className='absolute right-0 h-[99%] w-[60%] bg-white rounded-3xl pl-[20rem] flex flex-col justify-between  text-white'>
       
//        <motion.span
//        initial={{opacity:0,filter:'blur(20px)'}}
//        whileInView={{opacity:1,filter:'blur(0px)'}}
//        transition={{duration:0.7,delay:1}}
//        viewport={{amount:0.5}}
//        >
//         <h1 className='text-white text-5xl mb-5 mt-3 '>Debug</h1>
//         <p className='text-sm opacity-60'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius facilis fugiat tenetur in autem commodi dolor quae magni </p>
//        </motion.span>

//        {/* {isLoad?    
//         <motion.span 
//         initial={{opacity:0,filter:'blur(20px)'}}
//         whileInView={{opacity:1,filter:'blur(0px)'}}
//         transition={{duration:1,delay:1}}
//         className='mb-10 ml-14'>
//         <LoaderOne/>
//         </motion.span>  :         <button ref={debugBtnRef} onClick={handleOverlay} className='bg-[#343434] rounded-[54px] px-2 py-2 m-4 hover:opacity-70'>
//           Debug this code
//         </button>} */}
      


//       </motion.div>



//       </motion.div>  
       
//        {/* <motion.h1 
//        style={{y:featureTitleY,opacity:featureTitleOpacity}}
//        className='absolute text-7xl text-nowrap'>You can do much more with just Plugin...</motion.h1> */}
//       </div>
//      </motion.div>

//     </>
//   )
// }

function CodeOverlay({ref}:{ref:React.RefObject<HTMLDivElement>}){
  return(
      <motion.div 
       ref={ref}
       initial={{opacity:0,filter:'blur(20px)'}}
       whileInView={{opacity:1,filter:'blur(0px)'}}
       transition={{duration:1.5}}
       className='hidden absolute h-full w-full bg-zinc-900 z-50 rounded-xl text-white flex flex-col gap-5 p-10'>
       <LoaderFive text="Debugging Inprogress..."/>


      {/* <TypingAnimation className='text-2xl font-mono opacity-90'> </TypingAnimation> */}
      
       <TextAnimate animation="blurInUp" by="character" duration={2}>
      &gt; Analyzing your code...
    </TextAnimate>
      
      <AnimatedSpan delay={4000} className="text-[#00FFFF] font-mono opacity-75 text-md">
        <span>✔ Parsing the code line by line.</span>
      </AnimatedSpan>
       

      <AnimatedSpan delay={6000} className="text-[#00FFFF] font-mono opacity-75 text-md">
        <span>✔ Identified 8 errors.</span>
      </AnimatedSpan>

      <AnimatedSpan delay={8000} className="text-[#00FFFF] font-mono opacity-75 text-md">
        <span>✔ Applying changes.</span>
      </AnimatedSpan>

      <AnimatedSpan delay={10000} className="text-[#00FFFF] font-mono opacity-75 text-md">
        <span>✔ Success!</span>
      </AnimatedSpan>


      <AnimatedSpan delay={12000} className="text-white  font-mono opacity-55 text-sm">
        <span>All 8 errors are fixed!</span>
      </AnimatedSpan>
       </motion.div>

       
  )
}

function CodeReviewOverlay({setIsFix,setIsLoad2}:{setIsFix:React.Dispatch<React.SetStateAction<boolean>>,setIsLoad2:React.Dispatch<React.SetStateAction<boolean>>})
{
  const [isLoad,setIsLoad] = useState(false);
   
  const code1 = `<button onClick={() => setCount(count + 1)}>+</button>
<button onClick={() => setCount((prev) => Math.max(prev - 1, 0))}>-</button>`

  const code2 = `<button onClick={() => setCount((prev) => prev + 1)}>+</button>
<button onClick={() => setCount((prev) => prev - 1)}>-</button>`

  const code3 = `<button aria-label="Increase count" onClick={() => setCount((prev) => prev + 1)}>+</button>
<button aria-label="Decrease count" onClick={() => setCount((prev) => prev - 1)}>-</button>`

  const code4 = `<div className="flex items-center gap-4">
  <h2 className="text-xl font-bold">Count: {count}</h2>
  <button className="px-3 py-1 bg-green-500 text-white rounded" onClick={() => setCount((prev) => prev + 1)}>+</button>
  <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => setCount((prev) => prev - 1)}>-</button>
</div>`

function handleChange(){
  setIsLoad(true);
  setTimeout(() => {
    setIsLoad(false);
    setIsFix(true);
    setIsLoad2(false);
  }, 2000);
}
  return(
    <motion.div 
    // initial={{x:-100}}
    className='h-full w-full flex justify-center items-center mt-1'>
      <motion.div 
       
       initial={{opacity:0,filter:'blur(20px)',x:360}}
       animate={{opacity:1,filter:'blur(0px)',x:0}}
       transition={{duration:1.5}}
       exit={{opacity:0,filter:'blur(20px)',x:360}}
       className='absolute h-[86%] rounded-l-lg w-[40%] right-0  bg-zinc-800 z-50 text-white flex flex-col  p-5 overflow-y-auto shadow-[-15px_0_20px_-3px_rgba(0,0,0,0.3)]'>
       {/* <LoaderFive text="Reviewing Inprogress..."/> */}


      {/* <TypingAnimation className='text-2xl font-mono opacity-90'> </TypingAnimation> */}

  <img src="logoC.svg" alt="" className='size-[10%]'/>   
 <div className='flex gap-2 w-full'>
  
<TextAnimate
  animation="blurInUp"
  once={true}
  by="character"
  duration={2}
  className={`${montserrat.className} font-semibold text-sm opacity-80 mt-3 w-[90%]`}
>
  {`Your code is perfectly valid and works as expected. — it’s a simple counter component. \n here’s some suggestions for improvements:-`}
</TextAnimate>
</div>
      <motion.h1 
      initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:2}}
      className='mt-4 mb-4 font-semibold text-sm opacity-80'>🔧 Possible Improvements</motion.h1>

<div className='relative flex flex-col gap-10'>      


      <motion.div  
      initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:4}}
      className=" text-md flex flex-col">
        <h1 className='opacity-75'>1. Prevent negative values (if that’s not desired):</h1>
        <div className='h-20 w-full bg-zinc-950 rounded-xl mt-2 mb-4'>
          <div className='ml-3 text-xs mt-1'>tsx</div>
          <SyntaxHighlighter  language='jsx' style={vscDarkPlus}>
            {code1}
            </SyntaxHighlighter>
          
        </div>
      </motion.div>
       

      <motion.div 
      initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:5}}
      className=" text-md flex flex-col mt-3">
        <h1 className='opacity-75'>2. Use functional updates (best practice when updating based on the previous state):</h1>
        <div className='h-20 w-full bg-zinc-950 rounded-xl mt-2 mb-4'>
          <div className='ml-3 text-xs mt-1'>tsx</div>
          <SyntaxHighlighter  language='jsx' style={vscDarkPlus}>
            {code2}
            </SyntaxHighlighter>
          
        </div>
      </motion.div>

      <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:6}}
      className="text-md flex flex-col mt-3">
        <h1 className='opacity-75'>3. Accessibility – Add aria-label or descriptive text for screen readers:</h1>
        <div className='h-20 w-full bg-zinc-950 rounded-xl mt-2 mb-4'>
          <div className='ml-3 text-xs mt-1'>tsx</div>
          <SyntaxHighlighter  language='jsx' style={vscDarkPlus}>
            {code3}
            </SyntaxHighlighter>
          
        </div>
      </motion.div>

      <motion.div 
            initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:7}}
      className="  text-md flex flex-col mt-3 mb-32">
        <h1 className='opacity-75'>4. Styling – Add some minimal Tailwind or CSS for better UI (optional):</h1>
        <div className='h-20 w-full bg-zinc-950 rounded-xl mt-2 mb-4'>
          <div className='ml-3 text-xs mt-1'>tsx</div>
          <SyntaxHighlighter  language='jsx' style={vscDarkPlus}>
            {code4}
            </SyntaxHighlighter>
          
        </div>
      </motion.div>

      <motion.div 
      initial={{opacity:0,filter:'blur(20px)'}}
      animate={{opacity:1,filter:'blur(0px)'}}
      transition={{duration:1,delay:7}}
      className="absolute text-md bottom-0 w-full flex justify-center items-center">
           {isLoad? 
           <span className='mb-3'>
           <LoaderOne/>
           </span> 
             :
           <motion.button whileHover={{opacity:0.7}} onClick={handleChange} className='bg-white text-black font-semibold px-3 py-1 rounded-full w-full'>Make changes</motion.button>} 
      </motion.div>
</div>

       </motion.div>
    </motion.div>
       
  )
}