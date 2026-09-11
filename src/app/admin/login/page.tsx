"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setAdminToken } from "@/lib/admin-api-client";

// Client-side authentication page for CodeMate CMS administrative access
export default function AdminLogin() {
  // Local state hooks for credential input, error messaging, loading state, and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordUnlocked, setPasswordUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Reset form inputs on initial component mount to prevent stale auto-fills
  useEffect(() => {
    setEmail("");
    setPassword("");
    setPasswordUnlocked(false);
  }, []);

  // Submits credentials to /api/admin/login and redirects to dashboard upon success
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Post email and password credentials to authentication route
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      // 2. On 200 OK, store Bearer token and navigate to admin dashboard; otherwise display error message
      if (res.ok) {
        if (data.token) {
          setAdminToken(data.token);
        }
        router.push("/admin/dashboard");
      } else {
        if (res.status === 429) {
          setIsLocked(true);
        }
        setError(data.error || "Login validation failed.");
      }
    } catch {
      setError("A connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#09090b] px-4 font-sans text-neutral-100">
      <div className="w-full max-w-[420px] rounded-xl border border-[#27272a] bg-[#18181b] p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-2xl font-bold tracking-tight text-white">
          CODEMATE CMS PORTAL
        </h2>
        {/* Error banner displayed when credentials fail or rate limit triggers */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-900/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}
        {/* Style overrides to prevent browser autofill from washing out dark input backgrounds and hide native reveal eyes */}
        <style>{`
          .admin-login-input:-webkit-autofill,
          .admin-login-input:-webkit-autofill:hover,
          .admin-login-input:-webkit-autofill:focus,
          .admin-login-input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px #09090b inset !important;
            -webkit-text-fill-color: #ffffff !important;
            caret-color: #ffffff !important;
            transition: background-color 5000s ease-in-out 0s;
          }
          .admin-login-input::-ms-reveal,
          .admin-login-input::-ms-clear {
            display: none !important;
          }
        `}</style>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Email Address</label>
            <input
              type="email"
              required
              disabled={loading || isLocked}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              suppressHydrationWarning
              className="admin-login-input w-full rounded-lg border border-[#27272a] bg-[#09090b] p-3 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading || isLocked}
                value={password}
                readOnly={!passwordUnlocked}
                onFocus={() => setPasswordUnlocked(true)}
                onMouseDown={() => setPasswordUnlocked(true)}
                onTouchStart={() => setPasswordUnlocked(true)}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                suppressHydrationWarning
                className="admin-login-input w-full rounded-lg border border-[#27272a] bg-[#09090b] p-3 pr-10 text-sm text-white focus:border-blue-500 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {/* Toggle button to show or hide password characters */}
              <button
                type="button"
                disabled={loading || isLocked}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-200 transition-colors cursor-pointer focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
                title={showPassword ? "Hide password" : "Show password"}
                aria-label={showPassword ? "Hide password" : "Show password"}
                suppressHydrationWarning
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-3.5 w-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {/* Submit button showing loading spinner state during network request or locked state */}
          <button
            type="submit"
            disabled={loading || isLocked}
            suppressHydrationWarning
            className={`w-full rounded-lg p-3 text-sm font-semibold text-white transition ${
              isLocked
                ? "bg-red-900/60 text-red-200 border border-red-800 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-500 disabled:opacity-50"
            }`}
          >
            {loading ? "Signing in..." : isLocked ? "Temporarily Locked (15m)" : "Sign In"}
          </button>
        </form>

        {/* Security notice clarifying that CMS access is restricted and invite-only */}
        <div className="mt-6 border-t border-[#27272a] pt-5">
          <div className="flex flex-col items-center gap-2 rounded-lg border border-amber-900/40 bg-amber-950/20 px-4 py-4">
            <div className="flex items-center gap-2 text-amber-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="h-4 w-4 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              <span className="text-xs font-semibold tracking-wide text-amber-400 uppercase">Administrative Access Only</span>
            </div>
            <p className="text-center text-xs leading-relaxed text-neutral-400">
              Public sign-ups are <span className="font-medium text-neutral-300">not permitted</span>. Contact your{" "}
              <span className="font-medium text-neutral-300">database owner</span> or{" "}
              <span className="font-medium text-neutral-300">system administrator</span> to request credentials.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
