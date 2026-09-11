"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";


const demos = [
  {
    id: 1,
    videoId: "hamhzIcbDKg",
    name: "CodeMate BUILD",
    title: "AI WebApp Builder | Build Production Ready Application Instantly",
    description:
      "In this demo, we will explore how CodeMate Build turns a simple prompt into a fully functional application.",
  },
  {
    id: 2,
    videoId: "jA3S5KuvFkM",
    name: "CodeMate CORA",
    title: "Autonomous Coding Agent | Deep Codebase Reasoning & Auto Mode",
    description:
      "In this demo, we will explore CORA’s Auto Mode, designed to automate entire development workflows from planning to execution.",
  },
  {
    id: 3,
    videoId: "7vTEW_eNZC8",
    name: "CodeMate C0",
    title: "Research Agent | Local On-Device AI Intelligence & Assistance",
    description:
      "In this demo, we explore how the c0 web app combines knowledge base and rulebooks to generate more accurate and structured outputs.",
  },
] as const;

const resources = [
  {
    name: "Quick Start Guide",
    tagline: "Get Started with CodeMate",
    url: "/pdfs/codemate-quick-start-guide.pdf",
  },
  {
    name: "Product Overview",
    tagline: "Explore CodeMate Products",
    url: "/pdfs/codemate-product-overview.pdf",
  },
  {
    name: "CodeMate Build",
    tagline: "AI Full-Stack App Builder",
    url: "/pdfs/codemate-build-guide.pdf",
  },
  {
    name: "CodeMate Cora",
    tagline: "Agentic Software Architect",
    url: "/pdfs/codemate-cora-guide.pdf",
  },
  {
    name: "CodeMate C0 Web",
    tagline: "AI-Powered Research Agent",
    url: "/pdfs/codemate-c0-guide.pdf",
  },
  {
    name: "CodeMate PR Review Agent",
    tagline: "Automated PR Code Reviews",
    url: "/pdfs/codemate-pr-review-guide.pdf",
  },
  {
    name: "CodeMate Education",
    tagline: "AI Learning & Academic Platform",
    url: "/pdfs/codemate-education.pdf",
  },
  {
    name: "FAQs",
    tagline: "Frequently Asked Questions",
    url: "/pdfs/codemate-unified-faq.pdf",
  },
  {
    name: "Technical & Security Overview",
    tagline: "Security Architecture & Safeguards",
    url: "/pdfs/codemate-security-overview.pdf",
  },
] as const;

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModalVideo, setActiveModalVideo] = useState<{ id: string; name: string } | null>(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [hpPartnerId, setHpPartnerId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveModalVideo(null);
        setIsTrialModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isTrialModalOpen) {
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTrialModalOpen]);

  const handleMobileNavClick = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setTimeout(() => {
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 200);
  };

  const handleOpenTrialModal = () => {
    setOrganizationName("");
    setHpPartnerId("");
    setMobileNumber("");
    setCity("");
    setIsSubmitted(false);
    setIsSubmitting(false);
    setFormError("");
    setIsTrialModalOpen(true);
  };

  const handleTrialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organizationName.trim()) {
      setFormError("Organization Name is required.");
      return;
    }
    if (!hpPartnerId.trim()) {
      setFormError("HP Partner ID is required.");
      return;
    }
    if (!mobileNumber.trim()) {
      setFormError("Mobile Number is required.");
      return;
    }
    const phoneRegex = /^\+?[0-9\s\-()]{7,15}$/;
    if (!phoneRegex.test(mobileNumber.trim())) {
      setFormError("Please enter a valid mobile number.");
      return;
    }
    if (!city.trim()) {
      setFormError("City is required.");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    // Post clean JSON to /api/submit-trial server route
    try {
      const res = await fetch("/api/submit-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: organizationName.trim(),
          hpPartnerId: hpPartnerId.trim(),
          mobileNumber: mobileNumber.trim(),
          city: city.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Failed to submit request. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } catch {
      setFormError("Network error. Please try again.");
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  return (
    <div className="relative min-h-dvh bg-white flex flex-col items-start p-0 custom-cursor">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-divider/60 h-18 md:h-22 flex flex-col justify-center">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 h-17 md:h-20 flex items-center justify-between gap-4">
          <Link href="/" className="shrink-0 flex items-center transition-opacity hover:opacity-90">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate AI"
              width={210}
              height={70}
              priority
              unoptimized
              className="w-43 h-14.5 md:w-52.5 md:h-17.5 object-contain"
            />
          </Link>
          <div className="flex items-center gap-4">
            <ul className="hidden md:flex items-center gap-10 list-none m-0 p-0">
              <li>
                <a
                  href="#resources"
                  className="font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="#demos"
                  className="font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Demos
                </a>
              </li>
              <li>
                <a
                  href="#download"
                  className="font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Download
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
            {/* Custom Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="relative w-8 h-6.5 flex flex-col justify-between p-1 bg-transparent border-0 cursor-pointer md:hidden focus:outline-none"
              aria-label="Menu"
              aria-expanded={isMenuOpen}
            >
              <span className="block w-6 h-0.5 bg-black" />
              <span className="block w-6 h-0.5 bg-black" />
              <span className="block w-6 h-0.5 bg-black" />
            </button>
          </div>
        </div>

        {/* Backdrop overlay */}
        <div
          className={`fixed inset-0 bg-black/45 z-40 transition-opacity duration-300 md:hidden ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Side Drawer Modal */}
        <div
          className={`fixed top-0 right-0 h-full w-full max-w-97.5 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Drawer Header */}
          <div className="h-16.5 px-6 border-b border-divider/60 flex items-center justify-between">
            <Link href="/" onClick={() => setIsMenuOpen(false)} className="shrink-0 flex items-center">
              <Image
                src="/HPxCodeMateAI_LOGO_NAV.png"
                alt="HP x CodeMate AI"
                width={172}
                height={58}
                priority
                unoptimized
                className="w-43 h-14.5 object-contain"
              />
            </Link>
            {/* Close button with custom proper X */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-transparent border-0 cursor-pointer focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-black"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {/* Drawer Content */}
          <div className="py-8 px-6">
            <ul className="flex flex-col gap-6 list-none m-0 p-0">
              <li>
                <a
                  href="#resources"
                  onClick={(e) => handleMobileNavClick(e, "#resources")}
                  className="block font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Resources
                </a>
              </li>
              <li>
                <a
                  href="#demos"
                  onClick={(e) => handleMobileNavClick(e, "#demos")}
                  className="block font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Demos
                </a>
              </li>
              <li>
                <a
                  href="#download"
                  onClick={(e) => handleMobileNavClick(e, "#download")}
                  className="block font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Download
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  onClick={(e) => handleMobileNavClick(e, "#contact")}
                  className="block font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative w-full bg-white border-b border-divider/60 overflow-hidden min-h-120 lg:h-130 flex items-center scroll-mt-18 sm:scroll-mt-22" id="hero">
        {/* Full Bleed Right Slanted Image for Desktop (Official HP 20° Stripe Angle) */}
        <div
          className="hidden lg:block absolute top-0 right-0 h-full w-[54%] z-0 overflow-hidden pointer-events-none"
          style={{
            clipPath: "polygon(190px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <Image
            src="/hero_workspace_v1.png"
            alt="Professional using CodeMate on HP laptop"
            fill
            sizes="55vw"
            priority
            className="object-cover object-center"
          />
        </div>

        {/* Hero Content Container */}
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 py-10 lg:py-0 z-10 flex flex-col lg:flex-row items-center justify-between">
          {/* Left Column: Text & CTA */}
          <div className="w-full lg:w-[48%] max-w-2xl flex flex-col items-start text-left gap-[14.9px]">
            <h1 className="font-heading font-normal text-[38px] leading-10.5 sm:text-[44px] sm:leading-12.5 lg:text-[48px] lg:leading-13 text-black m-0 tracking-[1px]">
              HP x CodeMate AI : The future of AI-native development
            </h1>
            <p className="font-heading font-normal text-base text-[#333333] leading-5.25 sm:text-lg sm:leading-7 lg:leading-6 tracking-[1px] m-0">
              From idea to deployment, CodeMate AI accelerates the entire Software Development Lifecycle with deep codebase intelligence on HP&apos;s Next Gen AI PCs.
            </p>
            <div className="mt-[9.1px] w-full flex justify-start">
              <button
                onClick={handleOpenTrialModal}
                className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-heading text-[18px] tracking-[1px] w-full sm:w-50 h-[43.39px] lg:h-[53.39px] transition-colors duration-200 cursor-pointer border-0"
              >
                Exclusive Trial
              </button>
            </div>
          </div>

          {/* Mobile/Tablet Image */}
          <div className="block lg:hidden w-full mt-8 relative h-65 sm:h-95 overflow-hidden rounded-xl border border-[#E2E8F0] shadow-sm">
            <Image
              src="/hero_workspace_v1.png"
              alt="Professional using CodeMate on HP laptop"
              fill
              sizes="(max-width: 1024px) 100vw, 616px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>
      {/* Resources Section */}
      <section className="bg-[#EBF3FF] py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 sm:scroll-mt-22" id="resources">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {resources.map((resource) => (
              <a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-accent-blue/40 transition-all duration-200 group"
              >
                {/* Blue Icon Box */}
                <div className="w-11 h-11 rounded-lg bg-[#EBF3FF] flex items-center justify-center shrink-0 group-hover:bg-accent-blue/10 transition-colors duration-200">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
                  </svg>
                </div>
                {/* Text details */}
                <div className="flex flex-col text-left">
                  <span className="font-heading font-normal text-[17px] leading-tight text-black group-hover:text-accent-blue transition-colors duration-200">
                    {resource.name}
                  </span>
                  <span className="font-sans text-[12px] font-normal text-[#919191] mt-1.5 leading-none">
                    {resource.tagline}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section className="bg-white py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 sm:scroll-mt-22" id="demos">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Demos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {demos.map((demo) => (
              <div
                key={demo.id}
                className="group flex flex-col bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-full aspect-video bg-black overflow-hidden pointer-events-none">
                  <Image
                    src={`https://img.youtube.com/vi/${demo.videoId}/hqdefault.jpg`}
                    alt={demo.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="p-6 flex flex-col justify-between flex-1 gap-6">
                  <div className="flex flex-col text-left">
                    <h3 className="font-heading font-normal text-[20px] text-black leading-snug m-0">
                      {demo.title}
                    </h3>
                    <p className="font-sans text-[14px] text-[#525252] leading-relaxed mt-2.5 m-0">
                      {demo.description}
                    </p>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setActiveModalVideo({ id: demo.videoId, name: demo.name })}
                      className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-heading text-[15px] font-normal tracking-[0.5px] px-5 py-2.5 transition-colors cursor-pointer border-0"
                    >
                      Watch video
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal Pop-up */}
      {activeModalVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 transition-opacity duration-300"
          onClick={() => setActiveModalVideo(null)}
        >
          <div
            className="relative w-full max-w-4xl sm:max-w-5xl flex flex-col items-end"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Top-Right Circular Close Button */}
            <button
              type="button"
              onClick={() => setActiveModalVideo(null)}
              className="mb-3 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center backdrop-blur-md transition-all duration-200 cursor-pointer border border-white/20 shadow-lg"
              aria-label="Close video modal"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Frame */}
            <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube.com/embed/${activeModalVideo.id}?autoplay=1&vq=hd1080&rel=0&modestbranding=1`}
                title={activeModalVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Download Section */}
      <section className="bg-[#EBF3FF] py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 sm:scroll-mt-22" id="download">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Download CodeMate Toolbox
          </h2>
          <div className="w-full bg-white border border-[#E2E8F0] shadow-sm rounded-2xl p-8 sm:p-12 min-h-75.5 flex flex-col justify-center items-center gap-6">
            <p className="font-sans text-base lg:text-[18px] leading-relaxed text-[#525252] max-w-2xl m-0 text-center">
              Get the official CodeMate Toolbox developer package to enable deep codebase intelligence, optimized performance, and offline-capable models on your HP Next Gen AI PC.
            </p>
            <div className="mt-2">
              <a
                href="https://codemate.ai/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-heading text-[16px] tracking-[1px] px-6 h-11 transition-colors duration-200 gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      </section>


      {/* Contact Section */}
      <section className="bg-white py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 sm:scroll-mt-22" id="contact">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Contact Us
          </h2>
          <div className="flex flex-col lg:flex-row items-stretch border border-[#E2E8F0] overflow-hidden w-full rounded-2xl shadow-sm bg-white min-h-75.5">
            {/* Left Column: Image */}
            <div className="relative w-full lg:w-1/2 min-h-75">
              <Image
                src="/footer_image.png"
                alt="Team working together on HP laptops"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover"
              />
            </div>
            {/* Right Column: Blue Card */}
            <div className="w-full lg:w-1/2 bg-accent-blue p-8 lg:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left text-white">
              <h3 className="font-heading mb-3 text-[38px] leading-9.5 lg:text-[40px] lg:leading-10 font-normal tracking-[1px] m-0">
                Get in touch
              </h3>
              <p className="font-sans text-base lg:text-[18px] leading-relaxed text-white/95 mb-8 m-0">
                Reach out to learn more about this partnership.
              </p>
              <div className="w-full flex justify-center lg:justify-start">
                <a
                  href="https://codemate.ai/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-heading text-[16px] tracking-[1px] px-6 h-11 transition-colors duration-200"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-[#262626] py-14 sm:py-16 text-white w-full">
        <div className="max-w-340 mx-auto flex w-full flex-col items-center gap-6 px-6 sm:px-10">
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
            <a
              href="https://docs.codemate.ai/faqs/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
            >
              Privacy
            </a>
            <a
              href="https://docs.codemate.ai/faqs/terms-of-service"
              target="_blank"
              rel="noopener noreferrer"
              className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
            >
              Terms of Service
            </a>
            <a
              href="mailto:contact@codemate.ai"
              className="font-heading text-[15px] font-normal uppercase tracking-[0.15em] text-white/75 transition-colors duration-200 hover:text-white"
            >
              Support
            </a>
          </div>

          <Link href="/" className="shrink-0 flex items-center">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate"
              width={280}
              height={94}
              unoptimized
              className="h-15 sm:h-18 w-auto object-contain transition-opacity hover:opacity-95"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          {/* Contact & Social Icon Buttons under HP x CodeMate Logo */}
          <div className="flex items-center gap-4 mt-2">
            {/* Phone Icon */}
            <a
              href="tel:+918766330253"
              aria-label="Call +91 87663 30253"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white stroke-current" fill="none" strokeWidth="2.2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.824-1.802-5.122-4.1-6.924-6.924l1.293-.97a1.173 1.173 0 00.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </a>

            {/* Gmail / Mail Icon */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=contact@codemate.ai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email contact@codemate.ai via Gmail"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
            </a>

            {/* LinkedIn Icon */}
            <a
              href="https://www.linkedin.com/company/codemateai/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>

            {/* X (Twitter) Icon */}
            <a
              href="https://x.com/codemateai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="flex items-center justify-center w-11 h-11 rounded-full border border-white/20 text-white hover:border-white/60 hover:bg-white/10 transition-all duration-200"
            >
              <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          </div>
        </div>
      </footer>

      {isTrialModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsTrialModalOpen(false)} />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="trial-modal-title"
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg transform flex-col gap-6 overflow-hidden overflow-y-auto rounded-2xl border border-divider/60 bg-white p-6 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 sm:p-8"
          >
            <button
              onClick={() => setIsTrialModalOpen(false)}
              className="absolute right-4 top-4 border-0 bg-transparent text-menu-text transition-colors duration-200 hover:text-navy cursor-pointer"
              aria-label="Close modal"
              type="button"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <form
              onSubmit={handleTrialSubmit}
              className={isSubmitted ? "hidden" : "flex flex-col gap-5"}
            >
              <div className="flex flex-col gap-2">
                <h3 id="trial-modal-title" className="m-0 font-heading text-2xl tracking-[0.5px] text-navy sm:text-3xl">Exclusive Trial</h3>
                <p className="m-0 font-sans text-sm text-gray-text sm:text-base">
                  Request trial licenses of CodeMate AI, optimized for HP&apos;s Next Gen AI PCs.
                </p>
              </div>

              {formError && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-sans text-sm text-red-600">{formError}</div>}

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="org-name" className="font-sans text-sm font-semibold text-navy">
                    Organization Name *
                  </label>
                  <input
                    ref={firstInputRef}
                    id="org-name"
                    type="text"
                    required
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    placeholder="e.g. Acme Corporation"
                    className="h-11 w-full rounded-lg border border-divider-light px-4 font-sans text-navy transition-colors duration-200 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="partner-id" className="font-sans text-sm font-semibold text-navy">
                    HP Partner ID *
                  </label>
                  <input
                    id="partner-id"
                    type="text"
                    required
                    value={hpPartnerId}
                    onChange={(e) => setHpPartnerId(e.target.value)}
                    placeholder="e.g. HP-12345"
                    className="h-11 w-full rounded-lg border border-divider-light px-4 font-sans text-navy transition-colors duration-200 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="mobile" className="font-sans text-sm font-semibold text-navy">
                    Mobile Number *
                  </label>
                  <input
                    id="mobile"
                    type="tel"
                    required
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/[^0-9+\s\-()]/g, ""))}
                    placeholder="e.g. +91 98765 43210"
                    className="h-11 w-full rounded-lg border border-divider-light px-4 font-sans text-navy transition-colors duration-200 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="city" className="font-sans text-sm font-semibold text-navy">
                    City *
                  </label>
                  <input
                    id="city"
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. San Francisco"
                    className="h-11 w-full rounded-lg border border-divider-light px-4 font-sans text-navy transition-colors duration-200 focus:border-accent-blue focus:outline-none focus:ring-1 focus:ring-accent-blue"
                  />
                </div>
              </div>

              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsTrialModalOpen(false)}
                  className="flex-1 h-11 rounded-lg border border-divider-light bg-transparent font-sans font-semibold text-navy transition-all duration-200 hover:bg-pale-blue active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 h-11 inline-flex items-center justify-center gap-2 rounded-lg border-0 bg-accent-blue font-sans font-semibold text-white transition-all duration-200 hover:bg-accent-hover active:scale-[0.98] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    "Submit Request"
                  )}
                </button>
              </div>
            </form>

            {isSubmitted && (
              <div className="flex flex-col items-center gap-4 py-6 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-green-100 bg-green-50 text-green-500">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="m-0 font-heading text-2xl tracking-[0.5px] text-navy sm:text-3xl">Thank you!</h3>
                <p className="m-0 max-w-sm font-sans text-sm text-gray-text sm:text-base">
                  Your trial request has been submitted successfully. Our team will contact you shortly.
                </p>
                <button
                  onClick={() => setIsTrialModalOpen(false)}
                  className="mt-4 h-11 rounded-lg border-0 bg-navy px-8 font-sans font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
