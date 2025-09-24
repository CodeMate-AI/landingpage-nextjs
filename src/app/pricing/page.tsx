'use client'
import React, { useRef, useState } from 'react'
import {motion, useMotionValueEvent, useScroll} from 'framer-motion'
import { useRouter } from 'next/navigation'
import Footer from '@/components/footer';
import { Montserrat } from 'next/font/google';
import { ShineBorder } from '@/components/ui/shainingBoader';
import {   Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent, } from '@/components/ui/accordion';
  import { ChevronUp } from 'lucide-react';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

function Page() {
  const router = useRouter();
  const ref = useRef(null);
  const [oneTimePlan,setOneTimePlan] = useState(false);
  const [isPlan1,setIsPlan1] = useState(true);
   const [isPlan2,setIsPlan2] = useState(false);
    const [isPlan3,setIsPlan3] = useState(false);
    const [IsMascot,setIsMascot] = useState(false);
  function handleCurrPlan(e:number){
    if(e === 1){
     setIsPlan1(true);
     setIsPlan2(false);
     setIsPlan3(false);
    }
    if(e === 2){
      setIsPlan2(true);
      setIsPlan1(false);
      setIsPlan3(false);
    }
    if(e === 3){
      setIsPlan3(true);
      setIsPlan2(false);
      setIsPlan1(false);
    }
  }

   const {scrollYProgress} = useScroll({
    target:ref,
    offset:['start start','end start']
   })

  useMotionValueEvent(scrollYProgress,'change',e => {
    if(e >= 0.3) setIsMascot(true);
    if(e <= 0.3) setIsMascot(false);
  });

  return (
    <div ref={ref} className={`${montserrat.className} h-screen w-full bg-zinc-950`}>
     {/* navbar */}
<div 
style={{zIndex:999999999999,}}
className='hidden lg:flex  fixed  top-0 justify-center items-center w-full'>
    <motion.div
   initial={{y:-100}}
   animate={{y:0}}
   transition={{duration:1,delay:0.5}}
  // initial={{opacity:0,filter:'blur(10px)'}}
  // animate={{opacity:1,filter:'blur(0px)'}}
  // transition={{duration:1,delay:7}}
  style={{background: 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex:999999999999,
        }}
  className={`mt-5 w-[90%]  bg-opacity-65 z-[9999999999] rounded-lg border-y-[1px]   border-gray-400 border-opacity-10`}>
    <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
    <div className='flex   justify-between items-center w-full h-10'>
    <div className="h-full w-[13rem] flex justify-center overflow-hidden">
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
    <div className={`flex gap-5 text-md  justify-center items-center cursor-pointer text-right `}>
       <motion.h1 onClick={()=> router.push("/")} whileHover={{opacity:1}} className='flex text-center justify-center items-center opacity-65 gap-1'><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
       <button className={` px-2 py-1  bg-[#FFFFFF] text-black  rounded-sm font-semibold opacity-85`}>Get Started</button>
    </div>


    </div>
     {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
    </div>
    </motion.div>
</div>
     {/* navbar */}

     {/* mobile Navbar */}
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
  style={{background: 'rgba(15, 20, 20, 0.45)',   
        boxShadow: '0 4px 25px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(5px)',
        WebkitBackdropFilter: 'blur(5px)',
        zIndex:999999999999,
        }}
  className={`mt-5 w-[90%]  bg-opacity-65 z-[9999999999] rounded-lg border-y-[1px]   border-gray-400 border-opacity-10`}>
    <div className='flex  h-full w-full text-white px-[1rem] py-2 '>
    <div className='flex   justify-between items-center w-full h-10'>
    <div className="h-full w-[25vw] flex justify-center overflow-hidden">
      <img src="/codemateLogo.svg" alt="" />

    
    </div>
    <div className={`flex gap-5 text-md  justify-center items-center cursor-pointer text-right `}>
       <motion.h1 onClick={()=> router.push("/")} whileHover={{opacity:1}} className='flex text-center justify-center items-center opacity-65 gap-1'><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
       <button className={` px-2 py-1  bg-[#FFFFFF] text-black text-sm rounded-sm font-semibold opacity-85`}>Get Started</button>
    </div>


    </div>
     {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
    </div>
    </motion.div>
</div>
 {/* mobile responsivess */}

      <div className='flex flex-col'>
        <h1 className='text-5xl text-center pt-32 pb-1 font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent '>Let's <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-6xl'>Upgrade</span> your vision</h1>
        <p className='text-center text-xl mt-1 opacity-60'>Choose a plan which feels right for you.</p>
      </div>
        
       <div className='flex justify-center  mt-10 mb-10'>
        <div className='relative border-[3px] border-zinc-500 text-xl px-5 py-2 rounded-full flex gap-5  items-center '>
        <motion.div initial={{x:-9,width:'6.6rem',color:'black'}} animate={ isPlan1? {x:-9,width:'6.3rem'} : isPlan2? {x:92,width:'5rem'} : {x:176,width:'7rem'} } transition={{duration:0.5}}  className='absolute h-9  rounded-3xl bg-gradient-to-b from-[#00BFFF] to-[#1E90FF]'/>  
        <h1 onClick={()=> handleCurrPlan(1)} className={`${isPlan1? 'text-black font-semibold' : 'text-white'} z-20 text-black cursor-pointer`}>Monthly</h1>
        <h1 onClick={()=> handleCurrPlan(2)} className={`${isPlan2? 'text-black font-semibold' : 'text-white'} z-20 text-black cursor-pointer`}>Yearly</h1>
        <h1 onClick={()=> handleCurrPlan(3)} className={`${isPlan3? 'text-black font-semibold' : 'text-white'} z-20 text-black cursor-pointer`}>One-time</h1>
        </div>
       </div>
         
         {isPlan1 && 
         <MonthlyPlans/>
         } 

        {isPlan2 && 
         <YearlyPlans/>
         }
        {isPlan1 && 
        <div> 
        <ComparePlans2/>
        <ComparePlans2Mobile/>
        </div>} 
        {isPlan2 && 
        <div> 
        <ComparePlans2/>
        <ComparePlans2Mobile/>
        </div>} 
        {isPlan3 && <OneTimePlans/>}
        
        {isPlan3 && 
        <div>
        <ComparePlans/>
        <ComparePlansMobile/>
        </div>
        }
        <FAQ/>
        <Footer/>

    </div>
  )
}

export default Page



function YearlyPlans() {
  return(
       <div className='flex-col  flex  lg:flex-row  justify-center items-center  gap-10 mt-4 mb-20 '>

        <div className='relative h-[30rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  mt-[3rem]'>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
          
           <div className='pl-5 pt-5'> 
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Pro Plan</span>
          <p className='opacity-70'>For individual developers and freelancers</p>
          <div className='text-4xl font-bold mt-5'>$17<span className='text-sm opacity-80 font-normal text-cyan-400'>/ Monthly</span></div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Includes</h1>
          
         <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Debug, Review and Refactor Code.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Unlimited internet seaches.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Codemate Assistant Access.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Search & Chat with Documentation & Codebases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Generate Unit/Functional Test cases.</span>
  </div>
         </div>
         </div>
         </div>


          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://app.codemate.ai/pricing" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Subscribe
         </motion.button>
         </a>
         </div>
        </div>

                <div className='relative h-[33rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl '>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
           
           <div className='pl-5 pt-5'>
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Teams Plan</span>
          <p className='opacity-70'>For development in teams and startups</p>
          <div className='text-4xl font-bold mt-5'>$31<span className='text-sm opacity-80 font-normal text-cyan-400'> / Monthly</span></div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Everything in Pro, plus</h1>
          
          <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Collaborative Knowledge Base Hub.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Bring your own key.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Advanced ML models.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Seat Management.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Automated PR reviews.</span>
  </div>
          </div>
        


          </div>
          </div>
          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://app.codemate.ai/pricing" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Subscribe
         </motion.button>
         </a>
         </div>
        </div>
                <div className='relative h-[30rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  lg:mt-[3rem]'>
           
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
       

       <div className='pl-5 pt-5'>
        <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Orgnisation</span>
          <p className='opacity-70'>For SMBs and Enterprises</p>
          <div className='text-4xl font-bold mt-5 '>Let's Talk</div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Everything in Teams, plus</h1>
          
           <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Dedicated Account Manager.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>On-premises Deployment.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Custom fine-tuned models.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Search & Chat with Documentation & Codebases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Priority Support.</span>
  </div>
           </div>
        </div>


          </div>

          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://cal.com/ayushsinghal/book-a-demo" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Contact Us
         </motion.button>
         </a>
         </div>
        </div>  
      </div>  
  )
}

function MonthlyPlans() {
  return(
       <div className='flex-col  flex  lg:flex-row justify-center items-center gap-10 mt-4 mb-20'>

        <div className='relative h-[30rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  mt-[3rem]'>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
          
           <div className='pl-5 pt-5'> 
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Pro Plan</span>
          <p className='opacity-70'>For individual developers and freelancers</p>
          <div className='text-4xl font-bold mt-5'>$20<span className='text-sm opacity-80 font-normal text-cyan-400'>/ Monthly</span></div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Includes</h1>
          
         <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Debug, Review and Refactor Code.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Unlimited internet seaches.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Codemate Assistant Access.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Search & Chat with Documentation & Codebases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Generate Unit/Functional Test cases.</span>
  </div>
         </div>
         </div>
         </div>


          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://app.codemate.ai/pricing" target="_blank"> 
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Subscribe
         </motion.button>
         </a>
         </div>
        </div>

                <div className='relative h-[33rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl '>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
           
           <div className='pl-5 pt-5'>
          <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Teams Plan</span>
          <p className='opacity-70'>For development in teams and startups</p>
          <div className='text-4xl font-bold mt-5'>$37<span className='text-sm opacity-80 font-normal text-cyan-400'>/ Monthly</span></div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Everything in Pro, plus</h1>
          
          <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Collaborative Knowledge Base Hub.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Bring your own key.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Advanced ML models.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Seat Management.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Automated PR reviews.</span>
  </div>
          </div>
        


          </div>
          </div>
          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://app.codemate.ai/pricing" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Subscribe
         </motion.button>
         </a>
         </div>
        </div>
                <div className='relative h-[30rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  lg:mt-[3rem]'>
           
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
       

       <div className='pl-5 pt-5'>
       <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Orgnisation</span>
          <p className='opacity-70'>For SMBs and Enterprises</p>
          <div className='text-4xl font-bold mt-5 '>Let's Talk</div>
         
          <div className='flex flex-col gap-2 mt-10 '>
          <h1 className='text-xl font-semibold'>Everything in Teams, plus</h1>
          
           <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Dedicated Account Manager.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>On-premises Deployment.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Custom fine-tuned models.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Search & Chat with Documentation & Codebases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Priority Support.</span>
  </div>
           </div>
        </div>


          </div>

          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://cal.com/ayushsinghal/book-a-demo" target="_blank">  
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Contact Us
         </motion.button>
         </a>
         </div>
        </div>  
      </div>  
  )
}

function OneTimePlans() {
  const [isDrawer,setIsDrawer] = useState(false);
  const [isTier3,setIsTier3] = useState(true);
  const [isTier4,setIsTier4] = useState(false);
  const [isTier5,setIsTier5] = useState(false);

  function handleTier(e:number){
    if(e === 3 ){
      setIsTier4(false);
      setIsTier5(false);
      setIsTier3(true);
    }
    if(e === 4 ){
      setIsTier3(false);
      setIsTier5(false);
      setIsTier4(true);
    }
    if(e === 5 ){
      setIsTier4(false);
      setIsTier3(false);
      setIsTier5(true);
    }
    setIsDrawer(false);
  } 
  return(
       <div className='flex-col  flex  lg:flex-row justify-center items-center gap-10 mt-4 mb-20'>

        <div className='relative h-[30rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  mt-[3rem]'>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
          
           <div className='pl-5 pt-5'> 
           <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Tier Plan 1</span>
          <p className='opacity-70'>For solo developers and Programming Enthusiasts</p>
          <div className='text-4xl font-bold mt-5'>$59<span className='text-sm opacity-80 font-normal text-cyan-400'></span></div>
         
          <div className='flex flex-col gap-2 mt-4'>
          <h1 className='text-xl font-semibold'>Includes</h1>
          
         <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>1 seat.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>60,000 total tokens per month.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>5 total knowledge bases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>1GB total storage space.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>250 internet searches per month.</span>
  </div>

    <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Github Integration(s).</span>
  </div>
         </div>
         </div>
         </div>


          <div className='absolute bottom-5 w-full px-5'>
          <a href=" https://buy.stripe.com/14k027abj3Kzgjm6oo" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Buy Now
         </motion.button>
         </a>
         </div>
        </div>

        <div className='relative h-[33rem] w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  '>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
          
           <div className='px-5 pt-5'> 
           <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1'>Tier Plan 2</span>
          <p className='opacity-70'>For Professional developers and freelancers</p>
          <div className='text-4xl font-bold mt-5'>$169<span className='text-sm opacity-80 font-normal text-cyan-400'></span></div>
         
          <div className='flex flex-col gap-2 mt-4'>
          <h1 className='text-xl font-semibold'>Includes</h1>
          
         <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>1 seat.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>175,000 total tokens per month</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>10 total knowledge bases.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>3GB total storage space.</span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>500 internet searches per month.</span>
  </div>

    <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Codebase + Github + URL Integration(s).</span>
  </div>
         </div>
         </div>
         </div>


          <div className='absolute bottom-5 w-full px-5'>
          <a href="https://buy.stripe.com/dR69CH4QZ4OD4AEaEF" target="_blank">
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Buy Now
         </motion.button>
         </a>
         </div>
        </div>
        <div className='relative h-[30rem]  w-[21.5rem] sm:w-[23rem] bg-zinc-900 rounded-2xl  lg:mt-[3rem]'>
          
          <ShineBorder shineColor={["#00BFFF", "#1E90FF","#00FFFF"]} borderWidth={1.5} className='rounded-2xl'/>
          
          {isDrawer && 
           <motion.div
           initial={{height:0}} 
           animate={{height:100}}
           transition={{duration:0.3}}
           className='absolute top-16 right-[7.5rem] sm:right-[9rem] h-20 w-[13rem]  bg-zinc-800 z-50 rounded-b-lg px-2 pt-2 flex flex-col gap-2 items-center justify-center overflow-hidden'>
            {!isTier3 && 
            <motion.h1 
            onClick={()=>handleTier(3)}
            whileHover={{opacity:1}} className='opacity-70 text-xl border-b-[1px] border-zinc-700 w-full text-center cursor-pointer pb-2 flex justify-center items-center'>Tier Plan 3</motion.h1>}

            {!isTier4 && 
            <motion.h1 
            onClick={()=>handleTier(4)}
            whileHover={{opacity:1}} className='opacity-70 text-xl border-b-[1px] border-zinc-700 w-full text-center cursor-pointer pb-2  flex justify-center items-center'>Tier Plan 4</motion.h1>}

            {!isTier5 && 
            <motion.h1 
            onClick={()=>handleTier(5)}
            whileHover={{opacity:1}}
            className='opacity-70 text-xl border-b-[1px]  w-full text-center cursor-pointer pb-2  flex justify-center items-center'>Tier Plan 5</motion.h1>}
           </motion.div>}

           <div className='px-5 pt-5'> 
            <motion.span
            onClick={()=>setIsDrawer(state => !state)}
            className='cursor-pointer relative bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl font-semibold mb-1 flex items-center gap-2 w-fit'>
              {isTier3 && 
              "Tier Plan 3" }  
              {isTier4 && 
              "Tier Plan 4" }
              {isTier5 && 
              "Tier Plan 5" }    
            <motion.span
            whileHover={{opacity:1}}
            animate={{rotate:isDrawer? 180 : 0}}
            >  
            <ChevronUp
                className="size-6 shrink-0 grow-0 text-zinc-950 transition-transform -rotate-180 dark:text-zinc-50 cursor-pointer"
              />
              </motion.span>
              


              </motion.span>
          <p className='opacity-70'>For development teams and agencies</p>
          <div className='text-4xl font-bold mt-5'>
            {isTier3 && 
              "$299" }  
            {isTier4 && 
              "$579" }  
            {isTier5 && 
              "$999" }    
            <span className='text-sm opacity-80 font-normal text-cyan-400'></span></div>
         
          <div className='flex flex-col gap-2 mt-4'>
          <h1 className='text-xl font-semibold'>Includes</h1>
          
         <div className="flex flex-col gap-2 opacity-75">
  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>
    {isTier3 && "5 seats." }
    {isTier4 && "15 seats." }  
    {isTier5 && "Unlimited seats" }
    </span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>
      {isTier3 && "750,000 total tokens per month." }
      {isTier4 && "3,750,000 total tokens per month." }
      {isTier5 && "20,000,000 total tokens per month." }
    </span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>
      {isTier3 && "20 total knowledge bases." }
      {isTier4 && "60 total knowledge bases." } 
      {isTier5 && "Unlimited knowledge bases." }
    </span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>
      {isTier3 && "6GB total storage space." }
      {isTier4 && "15GB total storage space." } 
      {isTier5 && "35GB total storage space." }
    </span>
  </div>

  <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span>Unlimited internet searches per month.</span>
  </div>

    <div className="flex gap-1 items-center">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 shrink-0 opacity-80 text-gray-400"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 7a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
    </svg>
    <span className='text-sm'>
      {isTier3 && "Codebase + Github + URL Integration(s)." }
      {isTier4 && "All Integrations Supported." }
      {isTier5 && "All Integrations Supported." }
    </span>
  </div>
         </div>
         </div>
         </div>

      
          <div className='absolute bottom-5 w-full px-5'>
           <a  target="_blank" href={
    isTier3
      ? "https://buy.stripe.com/8wMbKP3MV1Crebe28a"
      : isTier4
      ? "https://buy.stripe.com/28o7uz97f80Pgjm4gj"
      : isTier5
      ? "https://buy.stripe.com/3cs7uzdnv0ynd7a004"
      : ""
  }> 
          <motion.button whileHover={{scale:1.01}} className='bg-white/85  flex justify-center items-center w-full py-1 rounded-md text-black font-bold'> 
          Buy Now
         </motion.button>
         </a>
         </div>
        </div>
      </div>  
  )
}


function ComparePlans(){
  return(
    <div className='hidden lg:flex pb-10 w-full  flex-col items-center'>
     <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 h-[8rem] px-10 py-10'>
      <h1 className='text-5xl font-semibold mb-2'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans</h1>

      <div className='flex gap-[3.7rem] text-2xl'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Tier 1 Plan</h1>
        <p className='text-xl opacity-35'>$59</p>
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Tier 2 Plan</h1>
        <p className='text-xl opacity-35'>$169</p>
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Tier 3 Plan</h1>
         <p className='text-xl opacity-35'>$299</p>
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Tier 4 Plan</h1>
         <p className='text-xl opacity-35'>$579</p>
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Tier 5 Plan</h1>
         <p className='text-xl opacity-35'>$999</p>
      </div>
      </div>
     </div>
     
    <div className='w-full'> 
  
      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left  pl-[2rem]'>Seats</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <h1>1 Seat</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <h1>1 Seat</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <h1>5 Seats</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <h1>15 Seats</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <h1>Unlimited</h1>
      </div>
      </div>
     </div>

            <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left   pl-[2rem]'>Tokens</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>60,000/month</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>175,000/month</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>750,000/month</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>3,750,000/month</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>20,000,000/month</h1>
      </div>
      </div>
     </div>

      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold  text-left  pl-[2rem]'>Knowledge bases</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>5 Total</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>10 Total</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>20 Total</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>40 Total</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
      </div>
     </div>

      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left  pl-[2rem]'>Storage space</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>1GB</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>3GB</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>6GB</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>15GB</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>35GB</h1>
      </div>
      </div>
     </div> 

      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold  text-left  pl-[2rem]'>Internet Searches</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>250/month</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>500/month</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
      </div>
     </div>  

      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left pl-[2rem]'>Integrations</h1>
      <div className='flex gap-[3.7rem] text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[9rem]'>
        <h1>Github</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Codebase + Github + URL</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Codebase + Github + URL</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1 className='text-center'>All Supported</h1>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1 className='text-center'>All Supported</h1>
      </div>
      </div>
     </div>

            <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-leftr pl-[2rem]'>Own API Key</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

      <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold  text-left pl-[2rem]'>Knowledge Base Sharing</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

           <div className='w-full flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left pl-[2rem]'>Seat Management</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
            <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>
     </div>
    </div>
  )
}

function ComparePlans2(){
  return(
    <div className='hidden lg:flex pb-10 w-full  flex-col items-center'>
     <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35 h-[8rem] px-10 py-10 items-center'>
      <h1 className='text-5xl font-semibold mb-2'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans</h1>

      <div className='flex gap-[3.7rem] text-2xl'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Pro Plan</h1>
        
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Teams Plan</h1>
        
      </div>
      </div>
     </div>

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10  items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left'>Seats Management</h1>
      <div className='flex gap-16 text-lg'>


      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
               <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.8rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>

      </div>
     </div>


      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 items-center'>
      <h1 className='text-xl font-semibold w-[20rem] text-left'>Knowledge base Sharing</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        {/* <h1>Included</h1> */}
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10  items-center'>
      <h1 className='text-xl font-semibold  text-left'>Advance ML Model</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
               <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
          <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div> 

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10  items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left'>Automated PR Review</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
          <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>  


            <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10  items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left'>Own API Key</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
                       <svg  xmlns="http://www.w3.org/2000/svg"  width={36}  height={36}  viewBox="0 0 24 24"  fill="currentColor"  className="icon icon-tabler icons-tabler-filled icon-tabler-circle-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35 px-10  items-center'>
      <h1 className='text-xl font-semibold  text-left'>Debug, Review and Refactor Code.</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

           <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10 py-3 items-center'>
      <h1 className='text-xl font-semibold w-[15rem] text-left'>Internet Search.</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <h1>Unlimited</h1>
      </div>
      </div>
     </div>

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10  items-center'>
      <h1 className='text-xl font-semibold  text-left'>Search & Chat with Documentation & Codebases.</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

      <div className='w-[80%] flex justify-between border-b-[1px] border-gray-500 border-opacity-35  px-10  items-center'>
      <h1 className='text-xl font-semibold  text-left'>Generate Unit/Functional Test cases.</h1>
      <div className='flex gap-16 text-lg'>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 w-[7.7rem]'>
        <img src='/tick.svg' className='object-fit size-[48%]'/>
      </div>
      </div>
     </div>

    </div>
  )
}

function ComparePlans2Mobile(){
    return(
    <div className='pb-10 w-full lg:hidden flex flex-col items-center'>
     <div className='w-full flex justify-between mb-4'>
      <h1 className='text-[10vw] w-full  font-semibold text-center'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans</h1>

      {/* <div className='flex gap-[3.7rem] text-2xl'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Pro Plan</h1>
        
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Teams Plan</h1>
        
      </div>
      </div> */}
     </div>

      <Accordion className='flex w-[90%] flex-col  gap-3'
      transition={{ duration: 0.2, ease: 'easeInOut' }}>


      <AccordionItem value='Seats Management' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Seats Management
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Not Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Knowledge base Sharing' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Knowledge base Sharing
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Not Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Advance ML Model' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Advance ML Model
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Not Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>      

      <AccordionItem value='Own API Key' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Own API Key
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Not Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>    

      <AccordionItem value='Debug, Review and Refactor Code' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Debug, Review and Refactor Code
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>
         
      <AccordionItem value='Internet Search' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Internet Search
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Search & Chat with Documentation & Codebases' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Search & Chat with Documentation & Codebases
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Generate Unit/Functional Test cases' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Generate Unit/Functional Test cases
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-5'>
                  <h1 className='text-xl'>Pro Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
                  <div className='flex w-full justify-between'>
                  <h1 className='text-xl'>Team Plan</h1>
                  <p className='opacity-80'>Included</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>    

     </Accordion>
    </div>
  )
}

function ComparePlansMobile(){
    return(
    <div className='pb-10 w-full lg:hidden flex flex-col items-center'>
     <div className='w-fullflex justify-between mb-4'>
      <h1 className='text-[10vw] font-semibold  text-center'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Compare</span> Plans</h1>

      {/* <div className='flex gap-[3.7rem] text-2xl'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Pro Plan</h1>
        
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Teams Plan</h1>
        
      </div>
      </div> */}
     </div>

      <Accordion className='flex w-[90%] flex-col  gap-3'
      transition={{ duration: 0.2, ease: 'easeInOut' }}>


      <AccordionItem value='Seats' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Seats
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>1 Seat</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>1 Seat</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>5 Seats</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>15 Seats</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Unlimited</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Tokens' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Tokens
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>60,000/month</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>175,000/month</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>750,000/month</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>3,750,000/month</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>20,000,000/month</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Knowledge bases' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Knowledge bases
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>5 Total</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>10 Total</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>20 Total</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>40 Total</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Unlimited</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>      

      <AccordionItem value='Storage space' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Storage space
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>1GB</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>3GB</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>6GB</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>15GB</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>35GB</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>    

      <AccordionItem value='Debug, Review and Refactor Code' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Internet Searches
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>250/month</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>500/month</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>Unlimited</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>Unlimited</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Unlimited</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>
         
      <AccordionItem value='Integrations' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Integrations
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>Github</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>Codebase + Github + URL</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>Codebase + Github + URL</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>All Supported</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>All Supported</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Own API Key' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Own API Key
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Available</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Knowledge Base Sharing' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Knowledge Base Sharing
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Available</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Seat Management' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Seat Management
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-between gap-8 '>
                <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 1</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 2</h1>
                  <p className='opacity-80'>N/A</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 3</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between border-b-[1px] pb-3'>
                  <h1 className='text-xl'>Tier 4</h1>
                  <p className='opacity-80'>Available</p>
                </div>
                  <div className='flex w-full justify-between '>
                  <h1 className='text-xl'>Tier 5</h1>
                  <p className='opacity-80'>Available</p>
                </div>
               </div>
        </AccordionContent>
      </AccordionItem>
      
     </Accordion>
    </div>
  )
}

function FAQ(){
  return(
        <div className='pb-10 w-full  flex flex-col items-center mt-32 mb-10'>
     <div className='w-fullflex justify-between  h-[8rem] px-10'>
      <h1 className='text-[8vw] lg:text-[3vw] font-semibold mb-2 text-center'>
        Frequently
        <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Asked</span> Questions</h1>

      {/* <div className='flex gap-[3.7rem] text-2xl'>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Pro Plan</h1>
        
      </div>
      <div className='flex flex-col justify-center items-center gap-2'>
        <h1 className='font-semibold'>Teams Plan</h1>
        
      </div>
      </div> */}
     </div>

      <Accordion className='flex w-[90%] lg:w-[50%] flex-col  gap-3'
      transition={{ duration: 0.2, ease: 'easeInOut' }}>


      <AccordionItem value='Seats' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          What kind of coding errors does your tool help fix?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>Our tool can help fix a variety of coding errors, including syntax errors, logical errors, performance issues and even run-time errors. We use advanced algorithms and machine learning techniques to analyze your code and provide suggestions for improvement.</p>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Tokens' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          How does your tool perform code reviews?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>

               <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.</p>
               </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value='Knowledge bases' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
        Can your tool optimize code automatically?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>CodeMate can analyze your code against best practices and industry standards to help identify potential issues and improve the overall quality of your code. We can provide feedback on things like code style, naming guidelines, formatting, documentation, and more.</p>
               </div>
        </AccordionContent>
      </AccordionItem>      

      <AccordionItem value='Storage space' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          Is my code kept private and secure?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
               <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>Our tool supports all programming languages and frameworks including but not limited to Python, JavaScript, Java, C++, C#, PHP, TypeScript, Ruby, Swift, Go, Kotlin, Rust, R, MATLAB, Perl, Shell scripting, SQL, Objective-C, Scala, Haskell, Dart, Elixir, Erlang, Fortran and Prolog. and many more. We're constantly adding support for new languages, so if you don't see your language working with CodeMate, please contact us and let us know. Moreover, you can also add the documentation of any new language/framework in your Knowledge base and refer it while asking questions to get up-to-date information.</p>
               </div>
        </AccordionContent>
      </AccordionItem>    

      <AccordionItem value='Debug, Review and Refactor Code' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          How do I get started with your tool?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
                <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>CodeMate offers a quick and easy way to fix your coding errors, without the need for switching your existing environment. If you are working in Visual Studio Code, you can simply install CodeMate extension there and start using. Or else, you can use our own IDE to code and fix your errors.</p>
               </div>
        </AccordionContent>
      </AccordionItem>
         
      <AccordionItem value='Integrations' className='border-b-[1px] pb-3'>
        <AccordionTrigger className='w-full py-0.5 text-left text-zinc-950 dark:text-zinc-50 font-semibold'>
          How accurate is results generated by CodeMate?
        </AccordionTrigger>
        <AccordionContent className='mt-4 pb-5'>
                <div className='flex flex-col w-full justify-center items-center gap-8 text-zinc-500'>
                <p>The accuracy of the results generated by CodeMate depends on several factors, including the quality and specificity of the code description provided by the user. Our models are trained on the latest data available from sources such as Stack Overflow and open-source repositories, but it's important to note that they may not always produce perfect results. However, users can edit and refine the results as needed to ensure that they meet their specific requirements. Overall, we strive to provide the most accurate and useful results possible to help developers improve their code</p>
               </div>
        </AccordionContent>
      </AccordionItem>      
     </Accordion>
    </div>
  )
}