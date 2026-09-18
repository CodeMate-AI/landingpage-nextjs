"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconCircleCheck,
  IconKey,
  IconLoader2,
  IconLock,
  IconMail,
  IconPhone,
  IconShieldCheck,
} from "@tabler/icons-react";

type RedeemState = "idle" | "submitting" | "complete";

export default function PromotionPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh bg-white" />}>
      <PromotionPageContent />
    </Suspense>
  );
}

function PromotionPageContent() {
  const searchParams = useSearchParams();
  const urlPromo = searchParams.get("promo") ?? "";
  const source = searchParams.get("source") ?? "";
  const [promoCode, setPromoCode] = useState(urlPromo);
  const [error, setError] = useState("");
  const [redeemState, setRedeemState] = useState<RedeemState>("idle");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCode = promoCode.trim();
    if (!normalizedCode) {
      setError("Enter your promotion code to continue.");
      return;
    }

    setError("");
    setRedeemState("submitting");

    try {
      const response = await fetch("https://api.identity.codemate.ai/v2/auth/init", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Client-Id": "webapp",
        },
        body: JSON.stringify({
          client_id: "landing",
          code_challenge: "BNtRp5GCWkdMb8zT6ZVGI4A7qFlQTfTftRA5dXmOC3g",
          code_challenge_method: "S256",
          fingerprint: "v1:54baed3b1d99dfdc8ad0fbeaeed5208d1083cff72dacfe46f7eb378688eaffd6",
          redirect_uri: "https://codemate.ai/download",
          state: "pp1ZXRGIArvS2OnniJmMlE_XvRGNkJ8CMlqo_MMM-Sc",
          ...(urlPromo ? { promo: normalizedCode } : {}),
          ...(source ? { source } : {}),
        }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error?.message || payload?.detail || "Unable to start your promotion redemption.");
      }

      const authorizationUrl = payload?.authorization_url;
      if (typeof authorizationUrl !== "string") {
        throw new Error("The authorization service returned an invalid response.");
      }

      const target = new URL(authorizationUrl);
      if (target.protocol !== "https:" && target.protocol !== "http:") {
        throw new Error("The authorization service returned an invalid redirect.");
      }

      window.location.assign(target.toString());
    } catch (requestError) {
      setRedeemState("idle");
      setError(requestError instanceof Error ? requestError.message : "Unable to start your promotion redemption. Please try again.");
    }
  };

  return (
    <div className="custom-cursor flex min-h-dvh flex-col bg-white text-black">
      <nav className="sticky top-0 z-20 w-full border-b border-divider/60 bg-white">
        <div className="mx-auto flex h-18 w-full max-w-340 items-center justify-between gap-5 px-6 sm:px-10">
          <Link href="/hp" className="flex shrink-0 items-center transition-opacity hover:opacity-80" aria-label="Back to HP x CodeMate AI">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate AI"
              width={210}
              height={70}
              priority
              unoptimized
              className="h-14.5 w-43 object-contain sm:h-17.5 sm:w-52.5"
            />
          </Link>
          <Link
            href="/hp"
            className="inline-flex items-center gap-2 font-heading text-[15px] tracking-[0.4px] text-black transition-colors hover:text-accent-blue"
          >
            <IconArrowLeft size={17} stroke={1.8} aria-hidden="true" />
            Back to HP x CodeMate
          </Link>
        </div>
      </nav>

      <main className="relative flex flex-1 overflow-hidden border-b border-divider/60 bg-[#EBF3FF]">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[47%] overflow-hidden lg:block" style={{ clipPath: "polygon(130px 0, 100% 0, 100% 100%, 0 100%)" }}>
          <Image
            src="https://backend.codemate.ai/uploaded/images/ee959115-9252-4e9f-8287-ea84bdadf702"
            alt="Developer working on an HP laptop"
            fill
            priority
            sizes="47vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[#0A5BDF]/70 mix-blend-multiply" />
        </div>

        <div className="relative z-10 mx-auto grid w-full max-w-340 grid-cols-1 items-center gap-10 px-6 py-12 sm:px-10 lg:min-h-[calc(100dvh-4.5rem)] lg:grid-cols-[minmax(0,0.98fr)_minmax(25rem,0.72fr)] lg:gap-18 lg:py-16">
          <section className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-accent-blue/20 bg-white px-3 py-2 font-heading text-[13px] tracking-[0.7px] text-accent-blue">
              <IconShieldCheck size={17} stroke={1.8} aria-hidden="true" />
              HP x CodeMate partner access
            </div>
            <h1 className="m-0 max-w-xl font-heading text-[42px] font-normal leading-[1.02] tracking-[0.4px] text-black sm:text-[54px] lg:text-[62px]">
              Your next build starts with more power.
            </h1>
            <p className="mt-6 max-w-xl font-sans text-[17px] leading-7 text-[#333333] sm:text-[19px]">
              Redeem your unique code to unlock paid CodeMate access and bring AI-native development to your HP workflow.
            </p>

            <div className="mt-10 grid max-w-xl grid-cols-1 gap-x-8 gap-y-4 border-t border-black/15 pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <IconCircleCheck size={21} stroke={1.8} className="mt-0.5 shrink-0 text-accent-blue" aria-hidden="true" />
                <p className="m-0 font-sans text-[14px] leading-5.5 text-[#3d3d3d]">Access the CodeMate products included with your promotion.</p>
              </div>
              <div className="flex items-start gap-3">
                <IconLock size={21} stroke={1.8} className="mt-0.5 shrink-0 text-accent-blue" aria-hidden="true" />
                <p className="m-0 font-sans text-[14px] leading-5.5 text-[#3d3d3d]">Your invitation code is verified securely before activation.</p>
              </div>
            </div>
          </section>

          <section className="w-full bg-white p-6 shadow-[0_18px_55px_rgba(10,91,223,0.13)] sm:p-8" aria-labelledby="redeem-title">
            {redeemState === "complete" ? (
              <div className="flex min-h-[360px] flex-col justify-center">
                <div className="mb-6 flex h-13 w-13 items-center justify-center rounded-full bg-[#EBF3FF] text-accent-blue">
                  <IconCheck size={30} stroke={2} aria-hidden="true" />
                </div>
                <p className="m-0 font-heading text-[14px] tracking-[0.7px] text-accent-blue">CODE RECEIVED</p>
                <h2 id="redeem-title" className="mt-3 font-heading text-[36px] font-normal leading-[1.05] tracking-[0.3px] text-black">We&apos;re checking your access.</h2>
                <p className="mt-4 max-w-md font-sans text-[16px] leading-6 text-[#485571]">
                  Your promotion is now being verified. Follow the activation instructions delivered with your invitation to complete access.
                </p>
                <button
                  type="button"
                  onClick={() => setRedeemState("idle")}
                  className="mt-7 inline-flex w-fit items-center gap-2 border border-black bg-white px-5 py-3 font-heading text-[15px] tracking-[0.4px] text-black transition-colors hover:bg-black hover:text-white active:translate-y-px"
                >
                  Redeem another code
                  <IconArrowRight size={17} stroke={1.8} aria-hidden="true" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <div className="flex items-start justify-between gap-4 border-b border-divider pb-6">
                  <div>
                    <p className="m-0 font-heading text-[13px] tracking-[0.7px] text-accent-blue">PROMOTION REDEMPTION</p>
                    <h2 id="redeem-title" className="mt-2 mb-0 font-heading text-[32px] font-normal leading-none tracking-[0.3px] text-black sm:text-[36px]">Claim your access</h2>
                  </div>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#EBF3FF] text-accent-blue">
                    <IconKey size={23} stroke={1.8} aria-hidden="true" />
                  </div>
                </div>

                <p className="mt-6 mb-0 font-sans text-[15px] leading-6 text-[#485571]">Enter the unique code from your HP x CodeMate invitation to start verification.</p>

                <div className="mt-7">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="promo-code" className="font-sans text-sm font-semibold text-black">Unique promotion code</label>
                    <div className="group relative">
                      <input
                        id="promo-code"
                        name="promo-code"
                        value={promoCode}
                        onChange={(event) => setPromoCode(event.target.value.toUpperCase())}
                        placeholder="Enter your code"
                        autoComplete="off"
                        className="h-14 w-full border border-[#aebdce] bg-[#f9fbfe] px-4 font-sans text-[16px] font-medium tracking-[1.5px] text-black outline-none transition-colors placeholder:font-normal placeholder:tracking-normal placeholder:text-[#737f8e] hover:border-[#6d8bb3] focus:border-accent-blue focus:bg-white focus:ring-1 focus:ring-accent-blue"
                        aria-describedby={error ? "redeem-error" : undefined}
                      />
                    </div>
                  </div>
                </div>

                {error && <p id="redeem-error" role="alert" className="mt-4 mb-0 border-l-2 border-red-600 bg-red-50 px-3 py-2 font-sans text-sm text-red-700">{error}</p>}

                <button
                  type="submit"
                  disabled={redeemState === "submitting"}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 border border-black bg-black px-5 font-heading text-[16px] tracking-[0.5px] text-white transition-colors hover:bg-zinc-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {redeemState === "submitting" ? <IconLoader2 className="animate-spin" size={19} stroke={2} aria-hidden="true" /> : <IconArrowRight size={18} stroke={1.8} aria-hidden="true" />}
                  {redeemState === "submitting" ? "Checking your code" : "Redeem promotion"}
                </button>

                <div className="mt-6 flex flex-col gap-3 border-t border-divider pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="m-0 flex items-start gap-2 font-sans text-[12px] leading-4.5 text-[#667085]">
                    <IconLock size={15} stroke={1.8} className="mt-0.5 shrink-0 text-accent-blue" aria-hidden="true" />
                    Your code is used only to verify this promotion.
                  </p>
                  <a
                    href="mailto:contact@codemate.ai?subject=Promotion%20code%20support"
                    className="inline-flex w-fit items-center gap-1.5 font-heading text-[13px] tracking-[0.35px] text-accent-blue underline decoration-accent-blue/35 underline-offset-4 transition-colors hover:text-accent-hover hover:decoration-accent-hover"
                  >
                    Need support?
                    <IconArrowRight size={15} stroke={1.8} aria-hidden="true" />
                  </a>
                </div>
              </form>
            )}
          </section>
        </div>
      </main>

      <footer className="w-full bg-black py-10 text-white sm:py-12">
        <div className="mx-auto flex w-full max-w-340 flex-col items-center justify-between gap-8 px-6 sm:px-10 lg:flex-row">
          <Link href="/hp" className="flex shrink-0 items-center" aria-label="HP x CodeMate AI home">
            <Image
              src="/HPxCodeMateAI_LOGO_NAV.png"
              alt="HP x CodeMate"
              width={210}
              height={70}
              unoptimized
              className="h-14.5 w-43 object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>
          <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 font-heading text-[13px] uppercase tracking-[0.13em] text-white/75">
            <a href="https://docs.codemate.ai/faqs/privacy-policy" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Privacy</a>
            <a href="https://docs.codemate.ai/faqs/terms-of-service" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-white">Terms</a>
            <a href="mailto:contact@codemate.ai" className="transition-colors hover:text-white">Support</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="tel:+918766330253" aria-label="Call CodeMate" className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10">
              <IconPhone size={18} stroke={1.8} aria-hidden="true" />
            </a>
            <a href="mailto:contact@codemate.ai" aria-label="Email CodeMate" className="flex h-10 w-10 items-center justify-center border border-white/20 text-white transition-colors hover:border-white hover:bg-white/10">
              <IconMail size={18} stroke={1.8} aria-hidden="true" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
