'use client'
import {motion} from 'framer-motion';
import { useState } from 'react';
import { IconFolderFilled,IconFolder,IconAlertCircle,IconPlus } from '@tabler/icons-react';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { Skeleton } from '../ui/skeleton';
export default function AutoCodeEditor({isFix,comp1,setIsFix}:{isFix:boolean;comp1:any,setIsFix:React.Dispatch<React.SetStateAction<boolean>>}){



const [isLoad,setIsLoad] = useState(false);
const [isComplete,setIsComplete] = useState(false);

const loadtimer = () => {
    setIsLoad(true);
    setTimeout(()=>{setIsLoad(false);setIsComplete(true)},2000);
 }   
useEffect(()=>{

 if(isFix){
    loadtimer();
 }

 
},[isFix])

useEffect(() => {
  return () => {
    setIsFix(false); // runs only on unmount
  };
}, []);

  return(
    <div className='relative h-full w-full bg-zinc-900  rounded-xl flex overflow-hidden'>
       <div className='absolute h-[7%] w-full top-0 bg-[#262626] rounded-t-xl z-50 flex  gap-5 items-center border-b-[0.1px] border-opacity-10 border-white'>
        <div className='flex gap-2 ml-5 opacity-50'>
         <div className='size-3 rounded-full bg-white '/>
         <div className='size-3 rounded-full bg-white '/>
         <div className='size-3 rounded-full bg-white '/>
         </div>
         
         <div className='flex gap-3 opacity-70'>
          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-git-branch"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M9 18h6a2 2 0 0 0 2 -2v-5" /><path d="M14 14l3 -3l3 3" /></svg>
          <h1>main</h1>
         </div>
       </div>

       <div className='absolute h-[5%] w-full bottom-0 bg-zinc-800 rounded-b-xl z-40 flex  gap-5 items-center border-t-[0.1px] border-white border-opacity-10 justify-between px-3'>
        <div className='flex gap-2  text-sm opacity-40'>
           <h1>Next.Js</h1>
         </div>
         
         <div className='flex gap-3 opacity-70 text-sm'>
           <h1>LF</h1>
           <h1>UTF-8</h1>
           <svg  xmlns="http://www.w3.org/2000/svg"  width="17"  height="17"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-lock-open-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2z" /><path d="M9 16a1 1 0 1 0 2 0a1 1 0 0 0 -2 0" /><path d="M13 11v-4a4 4 0 1 1 8 0v4" /></svg>
         </div>
       </div>

     <div className='bg-zinc-800 h-full w-[5%] rounded-l-3xl flex flex-col p-2  pt-10 justify-between'>
     <div className='flex flex-col gap-3  justify-center'>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-folders"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 3h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2" /><path d="M17 16v2a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-9a2 2 0 0 1 2 -2h2" /></svg>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-cube-unfolded"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M2 15h10v5h5v-5h5v-5h-10v-5h-5v5h-5z" /><path d="M7 15v-5h5v5h5v-5" /></svg>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-git-commit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M12 3l0 6" /><path d="M12 15l0 6" /></svg>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-dots"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M19 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>
      {/* <h1 className='opacity-80 text-lg'>my-nextjs-app/</h1> */}
     </div>


      <div className='flex flex-col gap-3  justify-center mt-[9.1rem]'>
      <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-player-play"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 4v16l13 -8z" /></svg>
     <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-git-branch"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 18m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 6m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M7 8l0 8" /><path d="M9 18h6a2 2 0 0 0 2 -2v-5" /><path d="M14 14l3 -3l3 3" /></svg>
    <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round"  className="icon icon-tabler icons-tabler-outline icon-tabler-timeline-event-exclamation"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 20m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M10 20h-6" /><path d="M14 20h6" /><path d="M12 15l-2 -2h-3a1 1 0 0 1 -1 -1v-8a1 1 0 0 1 1 -1h10a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-3l-2 2z" /><path d="M12 6v2" /><path d="M12 11v.01" /></svg>
      {/* <h1 className='opacity-80 text-lg'>my-nextjs-app/</h1> */}
     </div>
{/* 
     <div className='ml-5 mt-3 opacity-70 flex flex-col gap-1'>
     {nextJsStructure.map((e,idx)=>(
      <div key={idx} className='flex flex-col'> 
      <span className='flex gap-1'>
       <IconFolder stroke={2} size={20}/>
       <h1 className=''>{e.name}</h1>
       </span> 
        {e.children?.map((e,idx)=>(
          <h2 key={idx} className='ml-10 opacity-70 text-[0.8rem] mt-1'>{e.name}</h2>
        ))}
      </div>
      ))}
      </div> */}
      <div>
        
      </div>
     </div>
      
          <div  className='relative h-full w-[95%] flex gap-3 py-2 overflow-y-auto scrollbar-thin pt-20'>

     <div className='absolute top-8 h-[7%] w-full bg-zinc-900 z-40 border-b-[0.7px] border-white border-opacity-60'>
      <div className='flex  w-fit   gap-1 ml-4 border-b-2 border-[#00BFFF]'>
<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
<rect width="36" height="36" x="6" y="6" fill="#1976d2"></rect><polygon fill="#fff" points="27.49,22 14.227,22 14.227,25.264 18.984,25.264 18.984,40 22.753,40 22.753,25.264 27.49,25.264"></polygon><path fill="#fff" d="M39.194,26.084c0,0-1.787-1.192-3.807-1.192s-2.747,0.96-2.747,1.986 c0,2.648,7.381,2.383,7.381,7.712c0,8.209-11.254,4.568-11.254,4.568V35.22c0,0,2.152,1.622,4.733,1.622s2.483-1.688,2.483-1.92 c0-2.449-7.315-2.449-7.315-7.878c0-7.381,10.658-4.469,10.658-4.469L39.194,26.084z"></path>
</svg>

<h1 className='opacity-70 text-sm mt-2'>page.tsx</h1>
      </div>
     </div>
      <motion.div 
      animate={{scale:[0.95,1,0.95]}}
      transition={{duration:2,repeat:Infinity,repeatType:'loop'}}

      className='absolute top-0 h-10 w-10 bg-red-800 bg-opacity-15 z-20 right-0 m-5 rounded-sm flex items-center justify-center gap-2 '>
      <IconAlertCircle stroke={2} color='red'/>
      </motion.div>

      <div className='text-white flex flex-col ml-4 opacity-65 font-mono gap-1 '>

       {isComplete? [...Array(comp1.length)].map((_,idx)=>(
        <span key={idx}>{idx+1}</span>
       )) : [...Array(comp1.length-2)].map((_,idx)=>(
        <span key={idx}>{idx+1}</span>
       )) } 
      </div> 


      <div className='relative flex flex-col gap-[0.37rem] font-mono w-full '>
      {!isComplete && comp1
  .filter((_: any, idx: number) => idx !== 6 && idx !== 7)
  .map((e: any, idx: number) => (
    idx === 5?     
    <div key={idx} className="relative flex flex-col">
      <h1 className="w-full ml-2 cursor-text">{e.code}</h1>
        {/* skeleton for loader */}
        {isLoad && <motion.div 

        className='w-full flex flex-col gap-2  my-2'
        >
        <Skeleton className='h-3 ml-2 w-[60%] rounded-sm '/>
        <Skeleton className='h-3 ml-2 w-[70%] rounded-sm '/>
        <Skeleton className='h-3 ml-2 w-[50%] rounded-sm '/>
        </motion.div>}

        {/* skeleton for loader */}
    </div> :     
     idx === comp1.length - 3? 
    <div key={idx} className="relative flex">
      <h1 className="w-full ml-2 cursor-text">{e.code}</h1>
        <motion.img 
        animate={{opacity:[0,1]}}
        transition={{duration:0.7,repeat:Infinity,
        repeatDelay:0.7,  
        repeatType:'mirror'}}
        src="blinkin.png" className='ml-5  h-7 absolute   object-cover invert' alt="" />
     </div>
      :
    <div key={idx} className="relative flex">
      <h1 className="w-full ml-2 cursor-text">{e.code}</h1>
    </div>
  ))} 

   {isComplete && comp1.map((e: any, idx: number) => (
  
     idx === comp1.length - 1? 
    <div key={idx} className="relative flex">
      <h1 className="w-full ml-2 cursor-text">{e.code}</h1>
        <motion.img 
        animate={{opacity:[0,1]}}
        transition={{duration:0.7,repeat:Infinity,
        repeatDelay:0.7,  
        repeatType:'mirror'}}
        src="blinkin.png" className='ml-5  h-7 absolute   object-cover invert' alt="" />
     </div>
      :
    <div key={idx} className="relative flex">
      <h1 className=" ml-2 cursor-text">{e.code}</h1>
    </div>
  ))}
  

      </div>        
     </div> 

    </div>
  )
}
