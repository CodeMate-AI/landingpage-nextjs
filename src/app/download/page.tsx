"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle2, ExternalLink } from 'lucide-react';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeroVideoDialog } from '@/components/ui/hero-video-dialog';
import Footer from '@/components/footer';

type OS = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

const DownloadPage = () => {
    const router = useRouter();
    const [detectedOS, setDetectedOS] = useState<OS>('Unknown');
    const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');

    // Ensure the page always opens at the top and disable automatic scroll retention
    useEffect(() => {
        if (typeof window === "undefined") return;

        if ("scrollRestoration" in window.history) {
            window.history.scrollRestoration = "manual";
        }

        window.scrollTo({ top: 0, left: 0, behavior: "instant" });

        const frameId = requestAnimationFrame(() => {
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        });

        return () => cancelAnimationFrame(frameId);
    }, []);

    useEffect(() => {
        // Basic OS detection
        const userAgent = window.navigator.userAgent.toLowerCase();
        if (userAgent.indexOf("win") > -1) setDetectedOS("Windows");
        else if (userAgent.indexOf("mac") > -1) setDetectedOS("macOS");
        else if (userAgent.indexOf("linux") > -1) setDetectedOS("Linux");
    }, []);

    const handlePrimaryDownload = () => {
        let downloadLink = '';
        if (detectedOS === 'Windows') {
            downloadLink = 'https://storage.devdash.codemate.ai/uploads/e161c3ff-a4b7-4204-bb8e-26ee64f7aae1/download';
        } else if (detectedOS === 'macOS') {
            downloadLink = 'https://storage.devdash.codemate.ai/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download';
        } else if (detectedOS === 'Linux') {
            downloadLink = 'https://storage.devdash.codemate.ai/uploads/adc0ea7f-42fe-47d0-aaf6-d27957eefaa8/download';
        }
        if (downloadLink) {
            window.location.href = downloadLink;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-between pt-28 relative">
            {/* Desktop Navbar identical to /pricing */}
            <div className="hidden lg:flex fixed top-0 justify-center items-center w-full" style={{ zIndex: 9999 }}>
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-5 w-[90%] rounded-lg border-y border-gray-400/10"
                    style={{
                        background: 'rgba(15, 20, 20, 0.45)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.1)',
                    }}
                >
                    <div className="flex justify-between items-center w-full text-white px-4 py-2 h-10">
                        <div className="w-56 flex justify-center overflow-hidden">
                            <img onClick={() => router.push('/')} src="/logos/brand/codemate-logo.svg" alt="CodeMate" className="cursor-pointer" />
                        </div>
                        <div className="flex gap-5 items-center">
                            <motion.button
                                onClick={() => router.push('/')}
                                whileHover={{ opacity: 1 }}
                                className="flex items-center gap-1 opacity-65 hover:opacity-100 transition-opacity"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                    <path d="M5 12l14 0" /><path d="M5 12l4 4" /><path d="M5 12l4 -4" />
                                </svg>
                                Back
                            </motion.button>
                            <a href="https://app.codemate.ai" target="_blank" rel="noreferrer">
                                <motion.button
                                    whileHover={{ opacity: 1, scale: 1.05 }}
                                    className="px-2 py-1 bg-white text-black rounded-sm font-semibold opacity-85 hover:opacity-100 text-sm"
                                >
                                    Get Started
                                </motion.button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Mobile Navbar identical to /pricing */}
            <div className="lg:hidden fixed flex top-0 justify-center items-center w-full" style={{ zIndex: 9999 }}>
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-5 w-[90%] rounded-lg border-y border-gray-400/10"
                    style={{
                        background: 'rgba(15, 20, 20, 0.45)',
                        backdropFilter: 'blur(5px)',
                        WebkitBackdropFilter: 'blur(5px)',
                        boxShadow: '0 4px 25px rgba(0,0,0,0.1)',
                    }}
                >
                    <div className="flex justify-between items-center w-full text-white px-3 py-2">
                        <div className="w-[30vw] flex justify-start overflow-hidden">
                            <img onClick={() => router.push('/')} src="/logos/brand/codemate-logo.svg" alt="CodeMate" className="cursor-pointer" />
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => router.push('/')}
                                className="text-xs text-neutral-300 hover:text-white flex items-center gap-0.5"
                            >
                                Back
                            </button>
                            <a href="https://app.codemate.ai" target="_blank" rel="noreferrer">
                                <button className="px-2 py-1 bg-white text-black text-xs rounded-sm font-semibold opacity-90 mr-1">
                                    Get Started
                                </button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col items-center px-4 pb-20 w-full">
                {/* Background Glow */}
                {/* <div className="fixed top-[-20%] left-1/2 transform -translate-x-1/2 w-[800px] h-[600px] bg-emerald blur-[120px] rounded-full pointer-events-none z-0"></div> */}
                <div className="z-10 flex flex-col items-center text-center w-full max-w-4xl">
                    {/* Horizontal Hero Section */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left w-full gap-6 sm:gap-8 mb-10">
                        {/* Compact App Logo / Hero Icon */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: -20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                            className="flex-shrink-0 relative group"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-[#2A2A2A] to-[#1A1A1A] rounded-[22px] border border-white/10 shadow-2xl flex items-center justify-center relative overflow-hidden backdrop-blur-md">
                                <Image src="/logos/brand/codemate-toolbox-icon.png" alt="ToolBox Icon" width={80} height={80} />
                            </div>
                        </motion.div>
                        {/* Text and Button Sequence */}
                        <div className="flex flex-col items-center sm:items-start mt-1">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                            >
                                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-1.5 text-foreground">
                                    Download ToolBox
                                </h1>
                                <p className="text-base sm:text-lg text-muted-foreground max-w-lg mb-6">
                                    Available for macOS, Windows, and Linux.
                                </p>
                            </motion.div>
                            {/* Primary CTA Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="flex flex-row flex-wrap items-center gap-4 justify-center sm:justify-start w-full"
                            >
                                <button
                                    onClick={handlePrimaryDownload}
                                    disabled={downloadState !== 'idle'}
                                    className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-2.5 bg-foreground hover:bg-foreground/90 text-background rounded-full font-medium text-sm overflow-hidden transition-transform duration-300"
                                >
                                    {/* <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div> */}
                                    {/* <AnimatePresence mode="wait"> */}
                                    {/* {downloadState === 'idle' && ( */}
                                    <motion.div key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative z-10 flex items-center gap-2">
                                        <span>Download for {detectedOS !== 'Unknown' ? detectedOS : 'your OS'}</span>
                                        <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                    </motion.div>
                                    {/* )} */}
                                    {/* {downloadState === 'downloading' && (
                      <motion.div key="downloading" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="relative z-10 flex items-center gap-2">
                        <div className="w-3.5 h-3.5 border-2 border-foreground border-t-foreground rounded-full animate-spin"></div>
                        <span>Preparing...</span>
                      </motion.div>
                    )}
                    {downloadState === 'done' && (
                      <motion.div key="done" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="relative z-10 flex items-center gap-2 text-fofreground">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Downloading</span>
                      </motion.div>
                    )} */}
                                    {/* </AnimatePresence> */}
                                </button>
                                <a
                                    href="https://docs.codemate.ai/toolbox"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2.5 px-6 py-2.5 border border-white/10 hover:bg-white/5 text-foreground rounded-full font-medium text-sm transition-colors duration-300"
                                >
                                    <span>Read Setup Guide</span>
                                    <ExternalLink className="w-3.5 h-3.5 text-foreground/80" />
                                </a>
                            </motion.div>
                        </div>
                    </div>
                    {/* Divider & Version Info - Without Toggle */}
                    {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="w-full"
          >
            <div className="flex items-center justify-start w-full pb-4 px-2">
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium tracking-tight text-muted-foreground">v3.5</span>
              </div>
            </div>
          </motion.div> */}
                    {/* Detailed Downloads Grid - Always Visible */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="w-full"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 px-0 text-left">
                            {/* Windows Column */}
                            <div className="flex flex-col relative group pt-6 md:pt-0">
                                <div className="flex items-center gap-3 mb-6 px-2">
                                    <FaWindows className="w-4 h-4 text-foreground" />
                                    <h3 className="text-lg font-semibold tracking-tight">Windows</h3>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <DownloadRow label="Windows (ARM)" link='https://storage.devdash.codemate.ai/uploads/800a8138-bf96-4e08-af58-b80486064f14/download' />
                                    <DownloadRow label="Windows (x64)" link='https://storage.devdash.codemate.ai/uploads/e161c3ff-a4b7-4204-bb8e-26ee64f7aae1/download' />
                                    {/* <DownloadRow label="Windows (x64) User" link='' /> */}
                                    {/* <DownloadRow label="Windows (ARM64)" link='https://github.com/codemate-ai/codemate/releases/download/v3.5.0/codemate-3.5.0-setup.exe' /> */}
                                </div>
                            </div>
                            {/* macOS Column */}
                            <div className="flex flex-col relative group">
                                <div className="flex items-center gap-3 mb-6 px-2">
                                    <FaApple className="w-5 h-5 text-foreground" />
                                    <h3 className="text-lg font-semibold tracking-tight">macOS</h3>
                                    {/* <span className="px-2 py-0.5 text-xs font-lighter lowercase tracking-tight text-muted-foreground bg-foreground/10 rounded-full ml-auto">Coming Soon</span> */}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <DownloadRow link="https://storage.devdash.codemate.ai/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download" label="Mac (ARM64)" />
                                    <DownloadRow link="https://storage.devdash.codemate.ai/uploads/9c40b92b-3d56-441d-9570-d0363b939f38/download" label="Mac (Universal)" />
                                    {/* <DownloadRow link="https://storage.devdash.codemate.ai/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download" label="Mac (ARM64)" /> */}
                                    {/* <DownloadRow isComingSoon={true} label="Mac (x64)" /> */}
                                    {/* <DownloadRow isComingSoon={true} label="Mac Universal" /> */}
                                </div>
                            </div>
                            {/* Linux Column */}
                            <div className="flex flex-col relative group md:pl-6 pt-6 md:pt-0">
                                <div className="flex items-center gap-3 mb-6 px-2">
                                    <FaLinux className="w-5 h-5 text-foreground" />
                                    <h3 className="text-lg font-semibold tracking-tight">Linux</h3>
                                    {/* <span className="px-2 py-0.5 text-xs font-lighter lowercase tracking-tight text-muted-foreground bg-foreground/10 rounded-full ml-auto">Coming Soon</span> */}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <DownloadRow link="https://storage.devdash.codemate.ai/uploads/adc0ea7f-42fe-47d0-aaf6-d27957eefaa8/download" label="Linux (x86)" />
                                    <DownloadRow link="https://storage.devdash.codemate.ai/uploads/893fc28e-6b0d-444b-9f2c-f369389d07ff/download" label="Linux (AppImage)" />
                                    <DownloadRow link="https://storage.devdash.codemate.ai/uploads/6b99ace3-8658-4fb1-9543-8abc8c3aa133/download" label="Linux (Arch)" />
                                    {/* <DownloadRow isComingSoon={true} label="Linux .deb (ARM64)" /> */}
                                    {/* <DownloadRow isComingSoon={true} label="Linux .deb (x64)" /> */}
                                    {/* <DownloadRow isComingSoon={true} label="Linux RPM (x64)" /> */}
                                    {/* <DownloadRow isComingSoon={true} label="Linux AppImage" /> */}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Installation Guide Video Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.7 }}
                        className="w-full mt-16 mb-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                                Steps to Install ToolBox
                            </h2>
                            <p className="text-base text-muted-foreground mt-2 max-w-md mx-auto">
                                Follow this step-by-step video guide to install and set up CodeMate Toolbox on your system.
                            </p>
                        </div>
                        <div className="relative w-full max-w-4xl mx-auto">
                            <HeroVideoDialog
                                className="block border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                                animationStyle="from-center"
                                videoSrc="https://www.youtube-nocookie.com/embed/XPDSybiI4h4"
                                thumbnailSrc="https://img.youtube.com/vi/XPDSybiI4h4/maxresdefault.jpg"
                                thumbnailAlt="CodeMate Toolbox Installation Guide"
                            />
                        </div>

                    </motion.div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

const DownloadRow = ({ label, link, isComingSoon = false }: { label: string, link?: string, isComingSoon?: boolean }) => {
    if (isComingSoon || !link) {
        return (
            <div className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-all duration-200">
                <span className="text-[14px] text-foreground transition-colors">{label}</span>
            </div>
        );
    }
    return (
        <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.04] cursor-pointer transition-all duration-200"
        >
            <span className="text-[14px] text-foreground transition-colors">{label}</span>
            <Download className="w-3.5 h-3.5 text-foreground opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-y-0.5" />
        </a>
    );
};

export default DownloadPage;
