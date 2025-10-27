'use client'
import React from 'react'
import {motion} from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Montserrat } from 'next/font/google';
import Footer from '@/components/footer';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], // Add what you need
  variable: '--font-montserrat', // Optional, for CSS variable usage
});

function Page() {
    const router = useRouter();
  return (
    <div className={`${montserrat.className} h-screen w-full bg-zinc-950 py-20`}>
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
      <img onClick={()=>router.push('/')} src="/codemateLogo.svg" alt="" className="cursor-pointer"/>
      {/* {!IsMascot && <img src="/codemateLogo.svg" alt="" />}
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


      </motion.div>} */}
    
    </div>
    <div className={`flex gap-5 text-md  justify-center items-center cursor-pointer text-right `}>
       <motion.h1 onClick={()=> router.push("/")} whileHover={{opacity:1}} className='flex text-center justify-center items-center opacity-65 gap-1'><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
       <a href="https://app.codemate.ai" target='_blank'>
       <motion.button  whileHover={{opacity:1,scale:1.05}} className={`${montserrat.className} px-2 py-1  bg-[#FFFFFF] text-black  rounded-sm font-semibold opacity-85`}>Get Started</motion.button>
       </a>
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
       <motion.h1 onClick={()=> router.push("/")} whileHover={{opacity:1}} className='flex text-center justify-center items-center opacity-65 gap-1'><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>Back</motion.h1>
       <button className={` px-2 py-1  bg-[#FFFFFF] text-black text-sm rounded-sm font-semibold opacity-85`}>Get Started</button>
    </div>


    </div>
     {/* <h1 className=' p-2 bg-[#1a1a1a] border border-opacity-15 bg-opacity-25 rounded-md flex justify-center items-center'>Book a Demo</h1> */}
    </div>
    </motion.div>
</div>
 {/* mobile navbar*/}

 {/* header */}

 {/* dasktop */}
    <div className='hidden lg:flex justify-between'>
    <div className='px-24 mt-2 flex gap-3'>
    <h1 className='font-bold text-9xl bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent text-nowrap'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>THE</span> CANVAS</h1>
     <div className='pt-[1.1rem] font-bold  flex flex-col bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent opacity-75'>
        <h3>Blog about</h3>
        <h3>Growth.</h3>
        <h3>Tech.</h3>
        <h3>Achivements.</h3>
     </div>

    </div>

          <div className='px-24 py-7 flex gap-5'>
        <div className='relative'>
            <div className='absolute bg-zinc-100 p-1 rounded-full -top-1 -left-1'> 
               <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-instagram"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 8a4 4 0 0 1 4 -4h8a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-8a4 4 0 0 1 -4 -4z" /><path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M16.5 7.5v.01" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
                <div className='relative'>
            <div className='absolute bg-zinc-100 p-1 rounded-full -top-1 -left-1'> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-brand-linkedin"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 11v5" /><path d="M8 8v.01" /><path d="M12 16v-5" /><path d="M16 16v-3a2 2 0 1 0 -4 0" /><path d="M3 7a4 4 0 0 1 4 -4h10a4 4 0 0 1 4 4v10a4 4 0 0 1 -4 4h-10a4 4 0 0 1 -4 -4z" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
     </div>
    </div>
 {/* dasktop */}



{/* mobile */}
    <div className='lg:hidden text-center'>
    <h1 className='font-bold text-5xl bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent text-nowrap'><span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>THE</span> CANVAS</h1>
    <p className='text-[0.9rem] bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent '>Blog about Growth, Tech, Achivements</p>
    </div>
{/* mobile */}


 {/* header */}

{/* hero section */}
<div className='px-5 lg:px-24 mt-5 text-black'>
  <div className='hidden lg:flex w-full h-[28rem] bg-gradient-to-b from-white/90 to-gray-300/90 rounded-lg p-5 shadow-xl gap-1'>
    <div className='w-[35%] '>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-2xl'>
        CodeMate® AI has officially entered the Russian market
    </h1>
    <h2 className='font-semibold opacity-30'>8 min read</h2>
    <p className='mt-2  font-semibold opacity-60'>
        Proud to share that CodeMate® AI has officially entered the Russian market and was among the Top 25 startups globally selected for the Sberbank x 500 Global Accelerator Program by 2080 Ventures, representing India at the Moscow Startup Summit (Oct 1–2, 2025) held in Moscow, Russia.
    </p>
    <div className='mt-7 flex gap-2 text-sm'>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Trends</div>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Achivements</div>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Tech</div>
    </div>
    </div>
<div className="overflow-hidden rounded-lg h-full w-full">
  <motion.img
    src="https://media.licdn.com/dms/image/v2/D5622AQGSD7Q2nJLMhw/feedshare-shrink_1280/B56Zmoyh26JsAs-/0/1759473449826?e=1762387200&v=beta&t=H4UiurUN-pe__cdmLoSlWrHVHgRfBDLHr3UL6ayfyGA"
    alt=""
    className="object-cover object-[center_20%] h-full w-full cursor-pointer"
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
  />
</div>
  </div>

  <div className='lg:hidden w-full  bg-gradient-to-b from-white/90 to-gray-300/90 rounded-lg p-4  shadow-xl gap-1'>

    <motion.img  src="https://media.licdn.com/dms/image/v2/D5622AQGSD7Q2nJLMhw/feedshare-shrink_1280/B56Zmoyh26JsAs-/0/1759473449826?e=1762387200&v=beta&t=H4UiurUN-pe__cdmLoSlWrHVHgRfBDLHr3UL6ayfyGA" alt="" className='h-full w-full rounded-lg'/>

    <div className='mt-2'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-2xl'>
        CodeMate® AI has officially entered the Russian market
    </h1>
    <h2 className='font-semibold opacity-30'>8 min read</h2>
    <p className='mt-2  font-semibold opacity-60'>
        Proud to share that CodeMate® AI has officially entered the Russian market and was among the Top 25 startups globally selected for the Sberbank x 500 Global Accelerator Program by 2080 Ventures, representing India at the Moscow Startup Summit (Oct 1–2, 2025) held in Moscow, Russia.
    </p>
    <div className='mt-7 flex gap-2 text-sm'>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Trends</div>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Achivements</div>
        <div className='bg-black text-white rounded-full px-3 py-1 font-semibold'>Tech</div>
    </div>
    </div>

  </div>
</div>

{/* hero section */}

{/* section 2 */}
<div className='px-5 lg:px-24 mt-20 overflow-hidden'>

<div className='w-full lg:h-[28rem]  rounded-lg  lg:flex gap-10 '>
<img src="https://media.licdn.com/dms/image/v2/D5622AQHGWF3m4zwRNw/feedshare-shrink_2048_1536/B56ZnMMR2sJYAw-/0/1760067646075?e=1762387200&v=beta&t=SVor5gvqKLdal-VyzzvP7e6vvzXw6w6-_gb1AfoVlO4" alt="" className='rounded-lg  lg:w-[75%]'/>

<div className='flex flex-col'>
<h1 className='text-3xl lg:text-5xl font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent  mt-5 lg:mt-0'>On Device made with <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Snapdragon</span>.</h1>
<div className='mt-7 flex flex-col gap-5 opacity-70'>
<p>CodeMate® AI , running entirely on the edge on Snapdragon X Series chipsets, is being showcased live at the Qualcomm booth at hashtag#IMC2025, happening at Yashobhoomi, Delhi, from 8th to 11th October 2025.</p>
<p>
  Experience the power of AI-assisted coding with zero cloud dependency running offline - live at our booth.
</p>
</div>
</div>

</div>

</div>
{/* section 2 */}

{/* section 3 */}

{/* dasktop */}
<div className='hidden lg:flex px-24 py-20 gap-4 '>

     <div className='relative h-[35rem] w-[30rem] bg-gradient-to-b from-white to-gray-300/80 rounded-lg text-black  p-5 flex flex-col gap-2'>
      <h1 className='text-7xl font-bold'>Spotlight</h1>
      <h1 className='text-7xl font-bold'>On</h1>
      <h1 className='text-7xl font-bold text-nowrap bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Events</h1>

        <div className='flex gap-5 absolute bottom-7 right-7'>
        <div className='relative'>
            <div className='absolute bg-black p-1 rounded-full -top-1 -left-1 '> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
                <div className='relative'>
            <div className='absolute bg-black p-1 rounded-full -top-1 -left-1'> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
     </div>
     </div>
     <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D4E22AQGbqBNOTBeZWw/feedshare-shrink_1280/B4EZniRum3HMAs-/0/1760437923398?e=1762387200&v=beta&t=3uq3ntGMe5JkvYMpnss69-5rSKqSwiX3WCwJSqxRK3U" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

   <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Codemate AI Placement Drive [Hackathon] kickstarted at Geeta University.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
       A golden opportunity for our B.Tech & MCA (Batch 2026) students to showcase their skills, innovation, and tech brilliance. 🌟
       Let the journey to success begin! 
    </p>

    </div>
    </div>
     </div>
          <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D5622AQFKFOsJT-kUnQ/feedshare-shrink_800/B56ZlVm3B2JoAg-/0/1758078012097?e=1762387200&v=beta&t=gEYdpdoCF4TGm46yIvrIC1yKB4c0POTsePTW9pyJimw" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

     <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Had a fruitful Meeting and discussion with Prof. Diwakar Bhardwaj.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
Pro Vice chancellor GLA University for live projects and trainings to trainers along with industry integrated modules and placement opportunities for BTech CSE students at GLA University.  
    </p>

    </div>
    </div>
     </div>
    </div>
{/* dasktop */}

{/* mobile */}
<div className='lg:hidden px-5 py-20  gap-4 '>
      
      
      <h1 className='font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent text-3xl text-center'>Spotlight On
      <span className='font-bold text-nowrap bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Events</span></h1>
      


     <div className='h-[35rem] w-full bg-zinc-900 rounded-lg px-2 py-2 mt-5'>
      <img src="https://media.licdn.com/dms/image/v2/D4E22AQGbqBNOTBeZWw/feedshare-shrink_1280/B4EZniRum3HMAs-/0/1760437923398?e=1762387200&v=beta&t=3uq3ntGMe5JkvYMpnss69-5rSKqSwiX3WCwJSqxRK3U" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

   <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Codemate AI Placement Drive [Hackathon] kickstarted at Geeta University.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
       A golden opportunity for our B.Tech & MCA (Batch 2026) students to showcase their skills, innovation, and tech brilliance. 🌟
       Let the journey to success begin! 
    </p>

    </div>
    </div>
     </div>

             <div className='flex gap-5 justify-end mt-5 right-7'>
        <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1 '> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
                <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1'> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
     </div>
          {/* <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D5622AQFKFOsJT-kUnQ/feedshare-shrink_800/B56ZlVm3B2JoAg-/0/1758078012097?e=1762387200&v=beta&t=gEYdpdoCF4TGm46yIvrIC1yKB4c0POTsePTW9pyJimw" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

     <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Had a fruitful Meeting and discussion with Prof. Diwakar Bhardwaj.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
Pro Vice chancellor GLA University for live projects and trainings to trainers along with industry integrated modules and placement opportunities for BTech CSE students at GLA University.  
    </p>

    </div>
    </div>
     </div> */}
    </div>
{/* mobile */}


{/* section 3 */}

{/* section 4 */}
<div className='px-5 lg:px-24 lg:pb-24'>

{/* dasktop */}

  <div  className='hidden lg:flex justify-between items-center mb-5'>
  <h1 className='text-7xl font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text  text-transparent '>Must-See <span className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'>Moments</span></h1>
          <div className='flex gap-5'>
        <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1 '> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
                <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1'> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
     </div>
  </div>
<div className='hidden lg:flex gap-4 '>

     <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D4E22AQGbqBNOTBeZWw/feedshare-shrink_1280/B4EZniRum3HMAs-/0/1760437923398?e=1762387200&v=beta&t=3uq3ntGMe5JkvYMpnss69-5rSKqSwiX3WCwJSqxRK3U" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

    <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Codemate AI Placement Drive [Hackathon] kickstarted at Geeta University.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
       A golden opportunity for our B.Tech & MCA (Batch 2026) students to showcase their skills, innovation, and tech brilliance. 🌟
       Let the journey to success begin! 
    </p>

    </div>
    </div>
     </div>
     <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D4E22AQGbqBNOTBeZWw/feedshare-shrink_1280/B4EZniRum3HMAs-/0/1760437923398?e=1762387200&v=beta&t=3uq3ntGMe5JkvYMpnss69-5rSKqSwiX3WCwJSqxRK3U" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

    <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Codemate AI Placement Drive [Hackathon] kickstarted at Geeta University.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
       A golden opportunity for our B.Tech & MCA (Batch 2026) students to showcase their skills, innovation, and tech brilliance. 🌟
       Let the journey to success begin! 
    </p>

    </div>
    </div>
     </div>
          <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D5622AQFKFOsJT-kUnQ/feedshare-shrink_800/B56ZlVm3B2JoAg-/0/1758078012097?e=1762387200&v=beta&t=gEYdpdoCF4TGm46yIvrIC1yKB4c0POTsePTW9pyJimw" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

    <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Had a fruitful Meeting and discussion with Prof. Diwakar Bhardwaj.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
Pro Vice chancellor GLA University for live projects and trainings to trainers along with industry integrated modules and placement opportunities for BTech CSE students at GLA University.  
    </p>

    </div>
    </div>
     </div>
    </div>
{/* dasktop */}


{/* mobile */}
<div className='lg:hidden pb-10  gap-4 '>
      
      
      <h1 className='font-bold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent text-3xl text-center'>Must-See
      <span className='font-bold text-nowrap bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent'> Moments</span></h1>
      


     <div className='h-[35rem] w-full bg-zinc-900 rounded-lg px-2 py-2 mt-5'>
      <img src="https://media.licdn.com/dms/image/v2/D4E22AQGbqBNOTBeZWw/feedshare-shrink_1280/B4EZniRum3HMAs-/0/1760437923398?e=1762387200&v=beta&t=3uq3ntGMe5JkvYMpnss69-5rSKqSwiX3WCwJSqxRK3U" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

   <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Codemate AI Placement Drive [Hackathon] kickstarted at Geeta University.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
       A golden opportunity for our B.Tech & MCA (Batch 2026) students to showcase their skills, innovation, and tech brilliance. 🌟
       Let the journey to success begin! 
    </p>

    </div>
    </div>
     </div>

             <div className='flex gap-5 justify-end mt-5 right-7'>
        <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1 '> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
                <div className='relative'>
            <div className='absolute bg-white p-1 rounded-full -top-1 -left-1'> 
            <svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-narrow-right"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M15 16l4 -4" /><path d="M15 8l4 4" /></svg>
            </div>
            <div className='bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] size-[2.6rem] rounded-full'/>
        </div>
     </div>
          {/* <div className='h-[35rem] w-[30rem] bg-zinc-900 rounded-lg px-2 py-2'>
      <img src="https://media.licdn.com/dms/image/v2/D5622AQFKFOsJT-kUnQ/feedshare-shrink_800/B56ZlVm3B2JoAg-/0/1758078012097?e=1762387200&v=beta&t=gEYdpdoCF4TGm46yIvrIC1yKB4c0POTsePTW9pyJimw" alt="" className='object-cover object-top w-full h-[40%] rounded-lg'/>

     <div className='px-2'>
    <div className='mt-5 flex gap-2 text-sm'>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Trends</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Achivements</div>
        <div className='bg-white text-black rounded-full px-3 py-1 font-bold'>Tech</div>
    </div>

        <div className='mt-5'>
    <h1 className='opacity-50 font-semibold'>October 15,2025</h1>
    <h1 className='font-bold text-xl'>
        Had a fruitful Meeting and discussion with Prof. Diwakar Bhardwaj.
    </h1>
    <p className='mt-2 text-sm font-semibold opacity-60'>
Pro Vice chancellor GLA University for live projects and trainings to trainers along with industry integrated modules and placement opportunities for BTech CSE students at GLA University.  
    </p>

    </div>
    </div>
     </div> */}
    </div>
{/* mobile */}


    </div>
{/* section 4 */}

<Footer/>
    </div>
  )
}

export default Page