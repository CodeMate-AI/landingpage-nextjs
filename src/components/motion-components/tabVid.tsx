'use client'
import React from 'react'
import { animate, AnimatePresence, easeIn, motion, MotionValue, stagger, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { HtmlHTMLAttributes, ReactNode, useEffect, useRef, useState, useTransition } from "react";

interface values {
    springX:MotionValue<number>;
    springY:MotionValue<number>;
    
}

function Tabvid({prop}:{prop:values}) {
    const [stage,setStage] = useState(1);


  const MotionX = useMotionValue(0);
  const MotionY = useMotionValue(0);

  
//   const springX = useSpring(MotionX);
//   const springY= useSpring(MotionY);

  const rotateX = useTransform(prop.springY,[-0.5,0.5],['17.5deg','-17.5deg']);
  const rotateY = useTransform(prop.springX,[-0.5,0.5],['-17.5deg','17.5deg']);

  const bottomx = useTransform(prop.springX, [-0.5, 0.5], ['200%', '110%']);
  const bottomx2 = useTransform(MotionX, [-0.5, 0.5], ['50%', '200%']);

  function handleMouseLeave(){
    MotionX.set(0);
    MotionY.set(0);
  }


  const [polygon,setPolygon] = useState('polygon(100% 0%, 100%  5%, 0 150%, 0% 0%)')

  function handleMouseMove(e:any){
    const rect  = e.target.getBoundingClientRect();

    const width = rect.width;
    const height = rect.height;

    const MouseX = e.clientX - rect.left;
    const MouseY = e.clientY - rect.top;

    const xPct = MouseX / width - 0.5;
    const yPct = MouseY / height - 0.5;


    
    MotionX.set(xPct);
    MotionY.set(yPct);
  }


  useEffect(()=>{
    let dynamicPolygon:string;
    const unsubscribeBottomx = bottomx.onChange((value) => {
       dynamicPolygon = `polygon(${value} 0%, ${value} 5%, 0 ${value}, 0% 0%)`;
       setPolygon(dynamicPolygon)
    });
  },[bottomx])


    return (
        <motion.div
        style={{
          rotateX,
          rotateY,      
          transformStyle:'preserve-3d',
          
          
        }}
        initial={{
          scale:5,
        }}
        animate={
         stage === 1? 
          {
          scale:1,
          } : 
        {
          scale:1,
         
        } }
        transition={
        stage === 1?   
        {
          duration:1.5,
          ease:"easeInOut",
          type:'spring'
          
        } :
        {
          duration:1
        }
        
      }
        onAnimationComplete={() => setStage((prev:number)=>(prev === 1? 2:1))}
    >
    <div
      className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[3rem] h-[600px] w-[300px] shadow-xl" style={{boxShadow: "0 0 15px 5px rgba(248, 248, 248, 0.6)"}}>
        <motion.div className="absolute z-50   bg-gradient-to-b from-transparent to-white opacity-[20%] h-[572px] w-[272px] rounded-[2rem]  " initial={{clipPath:'polygon(0% 0%, 0% 0%, 0 0%, 0% 0%)'}} animate={{clipPath:polygon}} transition={stage === 1? {duration:2} : {ease:'linear'}}></motion.div>
        <div className="w-[75px] pr-2 z-20 h-[25px] bg-gray-800 top-[5px] rounded-[3rem] left-1/2 -translate-x-1/2 absolute flex justify-end items-center"><div className='h-3 w-3 right-0 bg-black rounded-full'></div></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
    <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
    <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
    <div className="rounded-[2rem] overflow-hidden w-[272px] h-[572px] bg-white dark:bg-gray-800">
     <img src="ss.jpeg" className='h-full' alt="" />
      </div>
      </div>
      </motion.div>
  )
}

export default Tabvid