"use client";

import { useState, useEffect, useRef } from "react";

interface ExclusiveTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExclusiveTrialModal({
  isOpen,
  onClose,
}: ExclusiveTrialModalProps) {
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
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setOrganizationName("");
      setHpPartnerId("");
      setMobileNumber("");
      setCity("");
      setIsSubmitted(false);
      setIsSubmitting(false);
      setFormError("");
      const timer = setTimeout(() => {
        firstInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="trial-modal-title"
        className="relative z-10 flex max-h-[90vh] w-full max-w-lg transform flex-col gap-6 overflow-hidden overflow-y-auto rounded-2xl border border-divider/60 bg-white p-6 shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 sm:p-8 text-black"
      >
        <button
          onClick={onClose}
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
            <h3 id="trial-modal-title" className="m-0 font-heading text-2xl tracking-[0.5px] text-navy sm:text-3xl">
              Exclusive Trial
            </h3>
            <p className="m-0 font-sans text-sm text-gray-text sm:text-base">
              Request trial licenses of CodeMate AI, optimized for HP&apos;s Next Gen AI PCs.
            </p>
          </div>

          {formError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 font-sans text-sm text-red-600">
              {formError}
            </div>
          )}

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="org-name" className="font-sans text-sm font-semibold text-navy">
                Organization Name *
              </label>
              <input
                suppressHydrationWarning
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
                suppressHydrationWarning
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
                suppressHydrationWarning
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
                suppressHydrationWarning
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
              suppressHydrationWarning
              type="button"
              disabled={isSubmitting}
              onClick={onClose}
              className="flex-1 h-11 rounded-lg border border-divider-light bg-transparent font-sans font-semibold text-navy transition-all duration-200 hover:bg-pale-blue active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              suppressHydrationWarning
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
              suppressHydrationWarning
              onClick={onClose}
              className="mt-4 h-11 rounded-lg border-0 bg-navy px-8 font-sans font-semibold text-white transition-colors duration-200 hover:bg-zinc-800 cursor-pointer"
            >
              Close Window
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
