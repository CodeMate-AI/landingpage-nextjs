'use client'
import React, { useState } from 'react';
import { Montserrat } from 'next/font/google';
import { motion, AnimatePresence, useTransform, useMotionValueEvent } from 'framer-motion';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

type ShowcaseProps = {
  productShowRef: React.RefObject<HTMLDivElement>;
  PShowYProg: any;
};

export default function UnlockShowcase({
  productShowRef,
  PShowYProg,
}: ShowcaseProps) {
  const [isProds, setIsProds] = useState(false);
  const [isShowProd, setIsShowProd] = useState(false);

  useMotionValueEvent(PShowYProg, 'change', (latest: any) => {
    if (latest > 0 && latest < 0.78) {
      setIsProds(true);
      setIsShowProd(true);
    } else if (latest >= 0.78) {
      setIsShowProd(false);
      setIsProds(false);
    } else {
      setIsProds(false);
      setIsShowProd(false);
    }
  });

  const height = useTransform(PShowYProg, [0, 0.75], ['0vh', '15vh']);
  const titlesX = useTransform(PShowYProg, [0, 0.75], ['0vh', '-180vh']);
  const headerY = useTransform(PShowYProg, [0.6, 0.72], [0, -200]);

  // Opacity transforms for items
  const opNew1 = useTransform(PShowYProg, [0, 0.03, 0.06, 0.125], [0, 0, 1, 0]);
  const opNew2 = useTransform(PShowYProg, [0.06, 0.125, 0.25], [0, 1, 0]);
  const opNew3 = useTransform(PShowYProg, [0.19, 0.25, 0.375], [0, 1, 0]);
  const op1 = useTransform(PShowYProg, [0.31, 0.375, 0.50], [0, 1, 0]);
  const op2 = useTransform(PShowYProg, [0.44, 0.50, 0.625], [0, 1, 0]);
  const op3 = useTransform(PShowYProg, [0.56, 0.625, 0.74, 0.78], [0, 1, 1, 0]);

  // Video/GIF opacities for 6 items
  const opVideoNew1 = useTransform(PShowYProg, [0, 0.03, 0.06, 0.125], [0, 0, 1, 0]);
  const opVideoNew2 = useTransform(PShowYProg, [0.125, 0.145, 0.25], [0, 1, 0]);
  const scaleVideoNew2 = useTransform(PShowYProg, [0.125, 0.145], [0.8, 1]);
  const opVideoNew3 = useTransform(PShowYProg, [0.25, 0.27, 0.375], [0, 1, 0]);
  const scaleVideoNew3 = useTransform(PShowYProg, [0.25, 0.27], [0.8, 1]);
  const opVideo1 = useTransform(PShowYProg, [0.375, 0.395, 0.50], [0, 1, 0]);
  const opVideo2 = useTransform(PShowYProg, [0.50, 0.52, 0.625], [0, 1, 0]);
  const scaleVideo2 = useTransform(PShowYProg, [0.50, 0.52], [0.8, 1]);
  const opVideo3 = useTransform(PShowYProg, [0.625, 0.645, 0.74, 0.78], [0, 1, 1, 0]);
  const scaleVideo3 = useTransform(PShowYProg, [0.625, 0.645], [0.8, 1]);

  return (
    <>
      {isProds && (
          <AnimatePresence mode="wait">
            <motion.div
              key={1}
              exit={{ opacity: 0, filter: 'blur(20px)' }}
              initial={{ opacity: 0, filter: 'blur(20px)' }}
              animate={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8 }}
              className="fixed top-0 left-32 h-full w-[70%] hidden lg:flex items-center justify-center z-10"
            >
              {/* --- NEW: Design Mode GIF --- */}
              {isShowProd && (
                <motion.div
                  key={'new1'}
                  style={{ opacity: opVideoNew1 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl bg-zinc-950 overflow-hidden"
                >
                  <img src="/design mode build.gif" className="h-full w-full object-cover rounded-xl" alt="Design Mode" />
                </motion.div>
              )}

              {/* --- NEW: Figma Mode GIF --- */}
              {isShowProd && (
                <motion.div
                  key={'new2'}
                  style={{ scale: scaleVideoNew2, opacity: opVideoNew2 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl bg-zinc-950 overflow-hidden"
                >
                  <img src="/build_figma_GIF.gif" className="h-full w-full object-cover rounded-xl" alt="Figma Mode" />
                </motion.div>
              )}

              {/* --- NEW: Skills GIF --- */}
              {isShowProd && (
                <motion.div
                  key={'new3'}
                  style={{ scale: scaleVideoNew3, opacity: opVideoNew3 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl bg-zinc-950 overflow-hidden"
                >
                  <img src="/skills_gif.gif" className="h-full w-full object-cover rounded-xl" alt="Skills" />
                </motion.div>
              )}

              {/* --- EXISTING: CORA --- */}
              {isShowProd && (
                <motion.div
                  key={1}
                  style={{ opacity: opVideo1 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl bg-zinc-950 overflow-hidden"
                >
                  <motion.video autoPlay loop muted playsInline initial={{ scale: 1.05 }} className="h-full w-full rounded-xl" src="https://drive.codemate.ai/CORA.mp4" />
                </motion.div>
              )}

              {isShowProd && (
                <motion.div
                  key={2}
                  style={{ scale: scaleVideo2, opacity: opVideo2 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl bg-zinc-950 overflow-hidden"
                >
                  <motion.video autoPlay loop muted playsInline initial={{ scale: 1.05 }} className="h-full w-full rounded-xl" src="https://drive.codemate.ai/PR_review.mp4" />
                </motion.div>
              )}

              {isShowProd && (
                <motion.div
                  key={3}
                  style={{ scale: scaleVideo3, opacity: opVideo3 }}
                  className="absolute left-[30rem] h-[30vw] w-[55vw] rounded-xl overflow-hidden"
                >
                  <motion.video autoPlay loop muted playsInline initial={{ scale: 1.05 }} className="h-full w-full rounded-xl" src="https://drive.codemate.ai/Documentation.mp4" />
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* products showcase */}
        <div ref={productShowRef} className="relative h-[280vw] w-full bg-zinc-950">
          <div className={`${montserrat.className} sticky top-5 z-20 text-[2.5rem] leading-[1.1] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pl-14 mb-6 pt-20 pr-[62vw] 2xl:pr-[55vw] pb-1`}>
            <motion.div style={{ y: headerY }} className="relative h-full w-full bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pb-5">
              <span className="z-50">
                What you'll<span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent"> Unlock</span>{' '}
              </span>
              <h1>with CodeMate AI.</h1>
            </motion.div>
          </div>

          <div className="sticky top-[85vh] z-40">
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)' }}
              whileInView={{ opacity: 1, filter: 'blur(0px)' }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className={`${montserrat.className} text-2xl pr-[6rem] font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pt-2 pb-2 w-full text-right`}
            >
              From <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent text-4xl">Web-Application</span>
            </motion.div>
          </div>

          <div className="sticky top-[9rem] h-screen w-full overflow-x-hidden">
            <div className="relative h-[75%] w-[40%] flex items-center justify-center pl-10 py-3">
              <div className={`relative ${montserrat.className} text-7xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent flex flex-col h-full w-full mt-10`}>
                <div className="relative h-full py-6 pl-5 flex justify-center overflow-hidden gap-5">
                  <div>
                    <motion.div style={{ y: height }} className="absolute rounded-md w-[0.25rem] h-[20%] bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] opacity-80 z-50" />
                    <div className="w-[0.20rem] rounded-md h-full bg-[#1c1c1c]" />
                  </div>

                  <motion.div style={{ y: titlesX }} className="h-full w-full flex flex-col gap-[15vh] pt-[15vh]">
                    {/* --- NEW: Design Mode --- */}
                    <motion.div style={{ opacity: opNew1 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Design Mode</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Generate pixel-perfect UI components and layouts instantly. Transform your visual ideas into production-ready code without writing boilerplate.
                      </p>
                    </motion.div>

                    {/* --- NEW: Figma to Code --- */}
                    <motion.div style={{ opacity: opNew2 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Figma to Code</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Seamlessly connect your Figma designs directly to CodeMate Build and export fully functional, responsive code that perfectly matches your mockups.
                      </p>
                    </motion.div>

                    {/* --- NEW: Custom AI Skills --- */}
                    <motion.div style={{ opacity: opNew3 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Custom AI Skills</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Teach CORA specific tasks, coding standards, and architectural patterns tailored perfectly to your team's unique workflows.
                      </p>
                    </motion.div>

                    {/* --- EXISTING: CORA --- */}
                    <motion.div style={{ opacity: op1 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Ship Autonomously with CORA</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Delegate tasks to our smartest coding agent that knows your codebase
                      </p>
                    </motion.div>

                    {/* --- EXISTING: PR Reviews --- */}
                    <motion.div style={{ opacity: op2 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Automated PR Reviews</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Integrated in your desired version control (Github/Bitbucket/Gitlab/Azure Devops) and automate your entire code reviews. summarizing changes, detecting bugs, and catching security flaws. Ship clean code to production up to 80% faster.
                      </p>
                    </motion.div>

                    {/* --- EXISTING: Documentation --- */}
                    <motion.div style={{ opacity: op3 }} className="text-white flex flex-col gap-2 h-[20vh] justify-center">
                      <h1 className="text-2xl">Documentation</h1>
                      <p className="text-lg opacity-50 w-[33rem] 2xl:w-[30rem] font-normal">
                        Acts as your AI coding partner by simplifying documentation and keeping it up-to-date, so you can focus on writing clean, impactful code.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </>
  );
}
