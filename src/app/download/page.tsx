"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle2 } from 'lucide-react';
import { FaWindows, FaApple, FaLinux } from 'react-icons/fa';
import Image from 'next/image';

type OS = 'Windows' | 'macOS' | 'Linux' | 'Unknown';

const DownloadPage = () => {
    const [detectedOS, setDetectedOS] = useState<OS>('Unknown');
    const [downloadState, setDownloadState] = useState<'idle' | 'downloading' | 'done'>('idle');

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
            downloadLink = 'https://storage.devdash.codemateai.dev/uploads/e161c3ff-a4b7-4204-bb8e-26ee64f7aae1/download';
        } else if (detectedOS === 'macOS') {
            downloadLink = 'https://storage.devdash.codemateai.dev/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download';
        } else if (detectedOS === 'Linux') {
            downloadLink = 'https://storage.devdash.codemateai.dev/uploads/adc0ea7f-42fe-47d0-aaf6-d27957eefaa8/download';
        }
        if (downloadLink) {
            window.location.href = downloadLink;
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground font-sans flex flex-col items-center pt-28 px-4 pb-20 relative">
            {/* Global Navbar */}
            <nav className="absolute top-0 w-full flex items-center justify-between px-6 py-5 md:px-10 z-50">
                <div onClick={() => { window.location.href = "https://app.codemate.ai/dashboard" }} className="flex items-center gap-2 cursor-pointer">
                    <Image
                        src="/codemateLogo.svg"
                        alt="Codemate Logo"
                        width={64}
                        height={64}
                        className={`-ml-8 -mt-4 h-16 p-0.5 rounded-full w-auto dark:block hidden`}
                        priority
                    />
                    <Image
                        src="/codemateLogo.png"
                        alt="Codemate Logo"
                        width={64}
                        height={64}
                        className={`-ml-8 -mt-4 h-16 p-0.5 rounded-full w-auto block dark:hidden`}
                        priority
                    />
                </div>
                <div className="hidden items-center gap-8">
                    <a href="#" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Product</a>
                    <a href="#" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Enterprise</a>
                    <a href="#" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Pricing</a>
                    <a href="#" className="text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Resources</a>
                </div>
                <div className="hidden items-center gap-5">
                    <a href="/login" className="hidden xl:block text-[14px] text-muted-foreground hover:text-foreground transition-colors font-medium">Sign in</a>
                    <a href="#" className="hidden sm:inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 hover:bg-white/5 text-[14px] transition-colors">Contact sales</a>
                    <a href="#download" className="px-4 py-1.5 bg-foreground text-background rounded-full text-[14px] font-medium hover:bg-foreground/90 transition-colors">Download</a>
                </div>
            </nav>
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
                            <Image src="/toolbox.png" alt="ToolBox Icon" width={80} height={80} />
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
                        {/* Primary CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
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
                                <DownloadRow label="Windows (ARM)" link='https://storage.devdash.codemateai.dev/uploads/800a8138-bf96-4e08-af58-b80486064f14/download' />
                                <DownloadRow label="Windows (x64)" link='https://storage.devdash.codemateai.dev/uploads/e161c3ff-a4b7-4204-bb8e-26ee64f7aae1/download' />
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
                                <DownloadRow link="https://storage.devdash.codemateai.dev/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download" label="Mac (ARM64)" />
                                <DownloadRow link="https://storage.devdash.codemateai.dev/uploads/9c40b92b-3d56-441d-9570-d0363b939f38/download" label="Mac (Universal)" />
                                {/* <DownloadRow link="https://storage.devdash.codemateai.dev/uploads/e4846b4b-0eef-4a1d-b6b1-b326ad69b6d6/download" label="Mac (ARM64)" /> */}
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
                                <DownloadRow link="https://storage.devdash.codemateai.dev/uploads/adc0ea7f-42fe-47d0-aaf6-d27957eefaa8/download" label="Linux (x86)" />
                                <DownloadRow link="https://storage.devdash.codemateai.dev/uploads/893fc28e-6b0d-444b-9f2c-f369389d07ff/download" label="Linux (AppImage)" />
                                {/* <DownloadRow isComingSoon={true} label="Linux .deb (ARM64)" /> */}
                                {/* <DownloadRow isComingSoon={true} label="Linux .deb (x64)" /> */}
                                {/* <DownloadRow isComingSoon={true} label="Linux RPM (x64)" /> */}
                                {/* <DownloadRow isComingSoon={true} label="Linux AppImage" /> */}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
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