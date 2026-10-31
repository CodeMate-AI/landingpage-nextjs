"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import type { MouseEvent } from "react";
import { hpDemos, hpResources, hpUsecases, hpContact } from "./config/hpData";
import HpFooter from "./components/HpFooter";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModalVideo, setActiveModalVideo] = useState<{ id: string; name: string } | null>(null);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [organizationName, setOrganizationName] = useState("");
  const [hpPartnerId, setHpPartnerId] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [city, setCity] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Close modals on Escape key press
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

  // Lock body scroll whenever a modal is open
  useEffect(() => {
    if (isTrialModalOpen || activeModalVideo) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isTrialModalOpen, activeModalVideo]);

  // Auto-focus first input when trial modal opens
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
    setHoneypot("");
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

    // Post clean JSON to /api/submit-trial server route with honeypot protection
    try {
      const res = await fetch("/api/submit-trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: organizationName.trim(),
          hpPartnerId: hpPartnerId.trim(),
          mobileNumber: mobileNumber.trim(),
          city: city.trim(),
          website: honeypot.trim(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormError(data.error || "Failed to submit request. Please try again.");
        setIsSubmitting(false);
        return;
      }
    } catch (err) {
      // Explicitly log the error with context to comply with error handling standards
      console.error("Trial submission request failed:", err);
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
            <ul className="hidden md:flex items-center gap-6 lg:gap-10 list-none m-0 p-0">
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
                  href="#usecases"
                  className="font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Usecases
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
            {/* Close button */}
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
                aria-hidden="true"
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
                  href="#usecases"
                  onClick={(e) => handleMobileNavClick(e, "#usecases")}
                  className="block font-heading text-[18px] font-normal text-black hover:text-accent-blue transition-colors duration-200"
                >
                  Usecases
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
      <section className="relative w-full bg-white border-b border-divider/60 overflow-hidden min-h-120 lg:h-130 flex items-center scroll-mt-18 md:scroll-mt-22" id="hero">
        {/* Full Bleed Right Slanted Image for Desktop (Official HP 20° Stripe Angle) */}
        <div
          className="hidden lg:block absolute top-0 right-0 h-full w-[54%] z-0 overflow-hidden pointer-events-none"
          style={{
            clipPath: "polygon(190px 0, 100% 0, 100% 100%, 0 100%)",
          }}
        >
          <Image
            src={hpContact.heroImageUrl}
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
              src={hpContact.heroImageUrl}
              alt="Professional using CodeMate on HP laptop"
              fill
              sizes="(max-width: 1024px) 100vw, 680px"
              priority
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="bg-[#EBF3FF] py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 md:scroll-mt-22" id="resources">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {hpResources.map((resource) => (
              <a
                key={resource.name}
                href={`/api/pdf?url=${encodeURIComponent(resource.url)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-3.5 rounded-xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md hover:border-accent-blue/40 transition-all duration-200 group"
              >
                {/* Blue Icon Box */}
                <div className="w-11 h-11 rounded-lg bg-[#EBF3FF] flex items-center justify-center shrink-0 group-hover:bg-accent-blue/10 transition-colors duration-200">
                  <svg className="w-5 h-5 text-accent-blue" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
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

      {/* Usecases Section */}
      <section className="bg-white py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 md:scroll-mt-22" id="usecases">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Usecases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
            {hpUsecases.map((usecase, index) => (
              <Link
                key={usecase.slug}
                href={`/hp/usecases/${usecase.slug}`}
                className="group flex flex-col bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-accent-blue/40 transition-all duration-200"
              >
                <div className="relative w-full aspect-[398/210] overflow-hidden">
                  <Image
                    src={usecase.image}
                    alt=""
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center gap-3 p-4">
                  <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-[#EBF3FF] font-heading text-[17px] text-accent-blue shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="font-heading font-normal text-[20px] leading-tight text-black group-hover:text-accent-blue transition-colors duration-200">
                    {usecase.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Demos Section */}
      <section className="bg-[#EBF3FF] py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 md:scroll-mt-22" id="demos">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Demos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {hpDemos.map((demo) => (
              <div
                key={demo.id}
                className="group flex flex-col bg-white border border-[#E2E8F0] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="relative w-full aspect-video bg-black overflow-hidden pointer-events-none">
                  <Image
                    src={demo.thumbnail}
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
          role="dialog"
          aria-modal="true"
          aria-label={activeModalVideo.name}
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
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Video Frame */}
            <div className="relative w-full aspect-video bg-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${activeModalVideo.id}?autoplay=1&vq=hd1080&rel=0&modestbranding=1`}
                title={activeModalVideo.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Download Section */}
      <section className="bg-white py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 md:scroll-mt-22" id="download">
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
                href={hpContact.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-black hover:bg-zinc-800 text-white font-heading text-[16px] tracking-[1px] px-6 h-11 transition-colors duration-200 gap-3"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#EBF3FF] py-5 sm:py-6 lg:py-8 w-full border-b border-divider/60 scroll-mt-18 md:scroll-mt-22" id="contact">
        <div className="max-w-340 mx-auto w-full px-6 sm:px-10 flex flex-col items-center gap-4 sm:gap-5">
          <h2 className="font-heading font-normal text-[32px] sm:text-[36px] lg:text-[38px] leading-tight text-black tracking-[1px] text-center m-0">
            Contact Us
          </h2>
          <div className="flex flex-col lg:flex-row items-stretch border border-[#E2E8F0] overflow-hidden w-full rounded-2xl shadow-sm bg-white min-h-75.5">
            {/* Left Column: Image - below-the-fold image loads lazily without priority */}
            <div className="relative w-full lg:w-1/2 min-h-75">
              <Image
                src={hpContact.contactImageUrl}
                alt="Team working together on HP laptops"
                fill
                sizes="(max-width: 1024px) 100vw, 680px"
                className="object-cover"
              />
            </div>
            {/* Right Column: Blue Card */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#0B45A6] via-[#0A5BDF] to-[#1E90FF] p-8 sm:p-10 lg:p-12 flex flex-col justify-center items-center lg:items-start text-center lg:text-left text-white">
              <h3 className="font-heading mb-3 text-[38px] leading-9.5 lg:text-[40px] lg:leading-10 font-normal tracking-[1px] m-0">
                Get in touch
              </h3>
              <p className="font-sans text-base lg:text-[18px] leading-relaxed text-white/95 mb-8 m-0">
                Reach out to learn more about this partnership.
              </p>
              <div className="w-full flex justify-center lg:justify-start">
                <a
                  href={hpContact.contactUrl}
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

      <HpFooter />

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
              <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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

              {/* Hidden honeypot anti-spam field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

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
                      <svg className="h-4 w-4 animate-spin text-white" fill="none" viewBox="0 0 24 24" aria-hidden="true">
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
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
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
