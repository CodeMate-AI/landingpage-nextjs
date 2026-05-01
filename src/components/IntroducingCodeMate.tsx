'use client'
import React from 'react';
import { Montserrat } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import VideoEmbed from '@/components/video';
import { FaGithub, FaBitbucket, FaGitlab, FaXTwitter, FaLinkedin, FaInstagram, FaDiscord, FaYoutube } from "react-icons/fa6";
import { VscAzureDevops } from "react-icons/vsc";

function LazyViewportImage({ src, className, alt, customRef }: { src: string, className?: string, alt?: string, customRef?: React.RefObject<HTMLImageElement> }) {
  const localRef = React.useRef<HTMLImageElement>(null);
  const ref = customRef || localRef;
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return (
    <img 
      ref={ref}
      src={inView ? src : "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"} 
      className={className} 
      alt={alt} 
    />
  );
}

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

type Props = {
  prodRef: React.RefObject<HTMLDivElement>;
  isP1: boolean;
  isP2: boolean;
  unlockCopyRef: React.RefObject<HTMLParagraphElement>;
  codeMateImageRef: React.RefObject<HTMLImageElement>;
};

export default function IntroducingCodeMate({
  prodRef,
  isP1,
  isP2,
  unlockCopyRef,
  codeMateImageRef
}: Props) {
  return (
    <div ref={prodRef} className={`${montserrat.className} w-full bg-zinc-950 text-white -z-10 flex flex-col justify-center items-center`}>
      <h1 className="font-mono pt-8 opacity-75 text-center text-lg">Introducing CodeMate AI</h1>

      <div className="mt-4 leading-[1] text-[8vw] lg:text-6xl font-semibold bg-gradient-to-b from-white to-gray-300/80 bg-clip-text text-transparent pt-2 lg:pb-2 w-full text-center">
        Your
        <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent lg:text-7xl">
          {' '}Full-Stack
        </span>{' '}
        AI Engineer.
      </div>

      <div className="relative w-full flex flex-col justify-center items-center">
        <div className="relative w-full flex justify-center items-start gap-8">
          {/* section for products */}
          <div className="hidden lg:flex sticky pt-20 top-0 h-screen">
            <motion.div animate={{ x: 0 }} transition={{ duration: 0.8 }}>
              <AnimatePresence mode="wait">
                <div key={4} className="flex flex-col gap-2">
                  <motion.div
                    key={1}
                    initial={{ opacity: 0, filter: "blur(30px)" }}
                    whileInView={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(30px)" }}
                    transition={{ duration: 1 }}
                    className="h-[70vh] w-[57vw] rounded-lg"
                  >
                    <VideoEmbed />
                  </motion.div>
                  <span className="text-4xl flex flex-col gap-2 mt-3">
                    <p ref={unlockCopyRef} className="opacity-70 text-[1rem] w-[57vw] leading-[1.125]">
                      From developers to non-developers, it acts like your autonomous team mate that assist you in shipping code with AI.
                    </p>
                  </span>
                </div>
              </AnimatePresence>
            </motion.div>
            <motion.div
              animate={{ x: isP1 ? -700 : isP2 ? 0 : 0 }}
              transition={{ duration: 0.8 }}
              className="mb-52"
            />
          </div>
          {/* section for products */}

          {/* features of product */}
          <div className="flex flex-col items-center h-[90vh] lg:h-screen overflow-y-auto snap-y snap-mandatory no-scrollbar w-full lg:w-auto scroll-smooth">
            
            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://build.codemateai.dev/build" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[0.4rem] lg:bottom-[0.5rem] w-full flex items-center justify-center shadow-2xl">
                      <LazyViewportImage src="/build_gif.gif" className="object-fit size-[90%] shadow-2xl" alt="" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate Build</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Planning & Architecture</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    Turns prompts and Figma designs into deployable apps instantly with full design mode support.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://cli.codemate.ai/" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[-4.8rem] lg:bottom-[-6rem] w-full flex items-center justify-center shadow-2xl">
                      <LazyViewportImage src="term.svg" className="object-fit size-[90%] shadow-2xl" alt="" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">AI Terminal</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Development & Execution</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    Run code and scripts instantly through an AI-powered command-line interface.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://marketplace.visualstudio.com/items?itemName=CodeMateAI.codemate-agent" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[0.4rem] lg:bottom-[0.5rem] w-full flex items-center justify-center px-4 shadow-2xl">
                      <LazyViewportImage src="/CORA+FULL.gif" className="w-full h-auto object-contain rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" alt="CORA AI Agent Interface" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate CORA</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Development & Verification</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    End-to-end AI AI coding agent for writing, securing, and quality-gating code directly in your IDE.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://edu.codemate.ai/" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[1.5rem] lg:bottom-[3.5rem] w-full flex items-center justify-center shadow-2xl">
                      <LazyViewportImage src="/codemate_edu.gif" className="object-fit size-[90%] shadow-2xl" alt="CodeMate Education Preview" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate Education</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Learning & Upskilling</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    AI-powered classroom management built for educators and students to master modern development.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://marketplace.visualstudio.com/items?itemName=AyushSinghal.Code-Mate" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[0.4rem] lg:bottom-[0.5rem] w-full flex items-center justify-center shadow-2xl">
                      <LazyViewportImage src="/Codemaps (1).gif" className="object-fit size-[90%] shadow-2xl" alt="" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate C0 Extension</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Development & Optimization</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    Your in-IDE AI partner for code management, debugging, and performance optimization.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://app.codemate.ai/chat" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[0.4rem] lg:bottom-[0.5rem] w-full flex items-center justify-center px-4">
                      <LazyViewportImage src="/C0 Web app1.gif" className="w-full h-auto object-contain rounded-t-lg shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" alt="CodeMate C0 Web App Interface" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate C0</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Discovery & Research</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    Turns deep research and feasibility into production-ready code through AI-driven intelligence.
                  </p>
                </div>
              </a>
            </div>

            <div className="snap-center shrink-0 min-h-[90vh] lg:min-h-screen flex flex-col justify-center items-center py-10 w-full lg:w-auto">
              <a href="https://github.com/apps/codemate-ai-pr-review-agent" target="_blank" className="cursor-pointer">
                <div className="flex flex-col items-center lg:items-start">
                  <div className="relative h-[16rem] lg:h-[20rem] w-[88vw] lg:w-[30vw] overflow-hidden">
                    <div className="absolute bottom-0 h-[70%] w-full bg-gradient-to-b from-[#141E30]/90 to-[#000000]/20 rounded-t-[3rem] border-x-[1px] border-zinc-600" />
                    <div className="absolute bottom-[-4.8rem] lg:bottom-[-6rem] w-full flex items-center justify-center shadow-2xl">
                      <LazyViewportImage customRef={codeMateImageRef} src="/prneww.png" className="object-fit size-[90%] shadow-2xl" alt="" />
                    </div>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start flex-wrap gap-2 mt-3">
                    <h1 className="text-lg font-semibold">CodeMate PR Review Agent</h1>
                    <span className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 bg-white/5 text-white/70 rounded-full border border-white/10">Deployment & Release</span>
                  </div>
                  <p className="text-center lg:text-left opacity-70 text-sm lg:text-sm w-[88vw] lg:w-[30vw] mt-1.5 leading-relaxed">
                    Automates code reviews and security analysis across GitHub, GitLab, Bitbucket, and Azure DevOps.
                  </p>
                  <div className="flex items-center gap-4 mt-3 opacity-70 text-white">
                    <FaGithub className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" title="GitHub" />
                    <FaBitbucket className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" title="Bitbucket" />
                    <FaGitlab className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" title="GitLab" />
                    <VscAzureDevops className="w-5 h-5 hover:scale-110 transition-transform cursor-pointer" title="Azure DevOps" />
                  </div>
                </div>
              </a>
            </div>
            
          </div>
          {/* features of product */}
        </div>
      </div>
    </div>
  );
}
