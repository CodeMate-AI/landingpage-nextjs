'use-client'
import React from 'react'
import {motion} from 'framer-motion'
function Mascot() {
  return (
   <div className="h-screen w-full flex justify-center items-center perspective-[1000px]">
  <div className="relative flex flex-col gap-1 transform-style-preserve-3d">
    <div className="flex gap-1">
      <div className="h-[7rem] w-[8rem]" />
      <motion.div
        initial={{ x: -72, y: 70, rotateZ: -19, rotateX: -80,
        rotateY: -7 
         }}
        className="size-32 bg-white"
      />
    </div>

    <div className="flex gap-1 transform-style-preserve-3d">
      <motion.div
        initial={{ rotateY: 70, rotateZ: 10 }}
        className="size-32 bg-white"
      />
      <motion.div
        initial={{ x: -55, y: 14.5, rotateY: 30, rotateZ: 3.5 }}
        className="size-32 bg-white"
      />
    </div>
  </div>
</div>
  )
}

export default Mascot