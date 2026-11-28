"use client";

import React, { useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/admin-api-client";
import { LIMIT_FIELDS, RateLimitsInput, type LimitKey, type RateLimits, type RateSettings } from "@/lib/docs-ai/limits";
import { useAnalyticsFetch } from "../analytics/useAnalyticsFetch";
import { card, formatDateTime, panelTitle, plural } from "../analytics/format";

const btn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg border border-[#27272a] px-4 text-sm transition-colors hover:bg-[#18181b] active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10";
// The filled button for Save; its own class list, since two border or background colours on one element do not resolve in Tailwind 4
const primaryBtn =
  "inline-flex min-h-11 cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-10";
const nf = new Intl.NumberFormat("en-GB");

// Share of a limit the busiest moment reached, and one colour for its meter and text: red once the limit turned
// anyone away or was reached, amber from 80% (the cue to raise it), blue with room left
function loadLevel(used: number, limit: number, blocked = 0) {
  const share = Math.min(1, used / limit);
  if (blocked > 0 || share >= 1) return { share, bar: "bg-red-500", text: "text-red-400" };
  if (share >= 0.8) return { share, bar: "bg-amber-400", text: "text-amber-300" };
  return { share, bar: "bg-blue-500", text: "text-neutral-400" };
}

// The 24-hour picture in one band: what got through, what was turned away, and the busiest minute overall
function UsageBand({ settings }: { settings: RateSettings }) {
  const { usage, limits } = settings;
  const turnedAway = Object.values(usage.blocked).reduce((a, b) => a + b, 0);
  const level = loadLevel(usage.busiest.globalMinute, limits.globalMinute, usage.blocked.globalMinute);
  const tiles = [
    { label: "Questions answered", value: nf.format(usage.questions), sub: null },
    { label: "Turned away", value: nf.format(turnedAway), sub: null },
    { label: "Busiest minute", value: nf.format(usage.busiest.globalMinute), sub: `of ${nf.format(limits.globalMinute)} allowed` },
  ];
  return (
    <dl className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-[#27272a] bg-[#27272a] sm:grid-cols-3">
      {tiles.map((t, i) => (
        <div key={t.label} className="flex flex-col gap-1 bg-[#18181b] p-4 sm:p-5">
          <dt className="text-sm text-neutral-400">{t.label}</dt>
          {/* Turned-away requests read red, so a blocked visitor is never missed */}
          <dd className={`text-2xl font-semibold tabular-nums sm:text-3xl ${i === 1 && turnedAway ? "text-red-400" : "text-white"}`}>{t.value}</dd>
          {/* The busiest-minute tile carries the same meter as its limit row, so the headroom shows at a glance */}
          {i === 2 && (
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#27272a]" aria-hidden>
              <div className={`h-full rounded-full ${level.bar}`} style={{ width: `${level.share * 100}%` }} />
            </div>
          )}
          {t.sub && <dd className="text-xs text-neutral-500 tabular-nums">{t.sub}</dd>}
        </div>
      ))}
    </dl>
  );
}

type Field = (typeof LIMIT_FIELDS)[number];

// A whole number between 1 and the field's max, or null while the field is empty or not a number yet
function toLimit(text: string, max: number): number | null {
  const n = Number(text);
  return text.trim() === "" || !Number.isInteger(n) ? null : Math.min(max, Math.max(1, n));
}

// Minus, the number, plus: the number can be typed, stepped with the buttons or with the arrow keys
function Stepper({ field, value, invalid, describedBy, onChange }: { field: Field; value: string; invalid: boolean; describedBy: string; onChange: (v: string) => void }) {
  const current = toLimit(value, field.max);
  // Steps snap to the field's step size, so 1,500 goes to 1,600 and 1,537 goes to 1,600, never 1,637
  const stepTo = (dir: 1 | -1) => {
    const base = current ?? 0;
    const next = dir === 1 ? Math.floor(base / field.step) * field.step + field.step : Math.ceil(base / field.step) * field.step - field.step;
    onChange(String(Math.min(field.max, Math.max(1, next))));
  };
  const side = "flex w-11 shrink-0 cursor-pointer items-center justify-center text-lg text-neutral-400 transition-colors hover:bg-[#27272a] hover:text-white focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div className={`flex h-11 w-40 shrink-0 overflow-hidden rounded-lg border bg-[#09090b] transition-colors focus-within:border-blue-500 ${invalid ? "border-red-500/70" : "border-[#3f3f46]"}`}>
      <button type="button" onClick={() => stepTo(-1)} disabled={current !== null && current <= 1} aria-label={`Lower ${field.label.toLowerCase()}`} className={`${side} border-r border-[#27272a]`}>−</button>
      <input
        id={`limit-${field.key}`}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        value={value}
        // Only digits can be typed; separators and letters are dropped as they arrive
        onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
        onKeyDown={(e) => {
          if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
          e.preventDefault();
          stepTo(e.key === "ArrowUp" ? 1 : -1);
        }}
        aria-label={field.label}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className="w-full min-w-0 bg-transparent text-center text-base font-semibold text-white tabular-nums outline-none"
      />
      <button type="button" onClick={() => stepTo(1)} disabled={current !== null && current >= field.max} aria-label={`Raise ${field.label.toLowerCase()}`} className={`${side} border-l border-[#27272a]`}>+</button>
    </div>
  );
}

// One limit on one line: its name, how close the busiest moment came, and the stepper to change it
function LimitRow({ field, value, settings, error, onChange }: { field: Field; value: string; settings: RateSettings; error?: string; onChange: (v: string) => void }) {
  const saved = settings.limits[field.key];
  const fallback = settings.defaults[field.key];
  const busiest = settings.usage.busiest[field.key];
  const blocked = settings.usage.blocked[field.key];
  // Measured against the saved limit, not a number still being edited
  const level = loadLevel(busiest, saved, blocked);
  const id = `limit-${field.key}`;
  return (
    <div className="grid gap-3 py-4 sm:grid-cols-[minmax(0,1fr)_10rem] sm:items-center sm:gap-10">
      <div className="min-w-0">
        <div className="flex items-baseline justify-between gap-3">
          <label htmlFor={id} className="font-medium text-white">{field.unit}</label>
          <span className={`shrink-0 text-sm tabular-nums ${level.text}`}>{nf.format(busiest)} of {nf.format(saved)} at peak</span>
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#27272a]" aria-hidden>
          <div className={`h-full rounded-full ${level.bar}`} style={{ width: `${level.share * 100}%` }} />
        </div>
        {blocked > 0 && <p className="mt-1.5 text-xs text-red-400 tabular-nums">{plural(blocked, "request")} turned away</p>}
      </div>
      <div className="flex flex-col gap-1.5">
        <Stepper field={field} value={value} invalid={!!error} describedBy={`${id}-note`} onChange={onChange} />
        {/* What the field held before this edit, and a way back to the default when it differs */}
        <p id={`${id}-note`} className="flex min-h-4 flex-wrap items-center gap-x-2 text-xs text-neutral-500 tabular-nums">
          {error ? <span className="text-red-400">{error}</span> : value !== String(saved) ? <span className="text-blue-300">Was {nf.format(saved)}</span> : null}
          {value !== String(fallback) && (
            <button type="button" onClick={() => onChange(String(fallback))} className="cursor-pointer underline decoration-neutral-600 underline-offset-2 hover:text-white">Default {nf.format(fallback)}</button>
          )}
        </p>
      </div>
    </div>
  );
}

const asText = (limits: RateLimits) => Object.fromEntries(LIMIT_FIELDS.map((f) => [f.key, String(limits[f.key])])) as Record<LimitKey, string>;
// Each group's one line of context, in place of a paragraph under every limit
const GROUPS = [
  { name: "Each visitor", note: "Counted per network address, so one office shares a limit. Days reset at midnight UTC." },
  { name: "All visitors together", note: "The cap on the AI bill. Raise it when the busiest minute gets close." },
] as const;

// The four limits as one form; it is keyed on the last save, so a save resets it to what the server stored
function LimitsForm({ settings, onSaved }: { settings: RateSettings; onSaved: (s: RateSettings) => void }) {
  const [values, setValues] = useState(() => asText(settings.limits));
  const [errors, setErrors] = useState<Partial<Record<LimitKey, string>>>({});
  const [status, setStatus] = useState<{ kind: "saving" | "error"; text: string } | null>(null);
  const changes = LIMIT_FIELDS.filter((f) => values[f.key] !== String(settings.limits[f.key])).length;
  const atDefaults = LIMIT_FIELDS.every((f) => values[f.key] === String(settings.defaults[f.key]));
  const setValue = (key: LimitKey, v: string) => setValues((prev) => ({ ...prev, [key]: v }));

  const discard = () => {
    setValues(asText(settings.limits));
    setErrors({});
    setStatus(null);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    // Same schema as the server, so most mistakes show next to their field before any request
    const parsed = RateLimitsInput.safeParse(Object.fromEntries(LIMIT_FIELDS.map((f) => [f.key, values[f.key].trim() === "" ? NaN : Number(values[f.key])])));
    if (!parsed.success) {
      setErrors(Object.fromEntries(parsed.error.issues.map((i) => [i.path[0], i.message])));
      return;
    }
    setErrors({});
    setStatus({ kind: "saving", text: "Saving..." });
    try {
      const res = await adminFetch("/api/admin/docs/settings", { method: "PUT", body: JSON.stringify(parsed.data) });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) return setStatus({ kind: "error", text: body.error || "Could not save the Ask AI settings." });
      setStatus(null);
      onSaved(body as RateSettings);
    } catch {
      setStatus({ kind: "error", text: "Could not save the Ask AI settings." });
    }
  };

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className={panelTitle}>Limits</h2>
          <p className="mt-1 text-sm text-neutral-400">
            {settings.updatedAt ? `Last changed ${formatDateTime(settings.updatedAt)} by ${settings.updatedBy}.` : "Using the default limits, sized for about 1 million visitors a day."}
          </p>
        </div>
        {/* Fills every field with its default; nothing changes until Save */}
        <button type="button" onClick={() => { setValues(asText(settings.defaults)); setErrors({}); }} disabled={atDefaults} className={btn}>Use all defaults</button>
      </div>

      {GROUPS.map(({ name: group, note }) => (
        <section key={group} aria-label={group} className={`${card} px-4 sm:px-6`}>
          <div className="border-b border-[#27272a] py-3.5">
            <h3 className="text-sm font-semibold text-neutral-200">{group}</h3>
            <p className="mt-0.5 text-xs text-neutral-500">{note}</p>
          </div>
          <div className="divide-y divide-[#27272a]">
            {LIMIT_FIELDS.filter((f) => f.group === group).map((f) => (
              <LimitRow key={f.key} field={f} value={values[f.key]} settings={settings} error={errors[f.key]} onChange={(v) => setValue(f.key, v)} />
            ))}
          </div>
        </section>
      ))}

      {/* The save bar stays in view at the bottom of the screen while there are unsaved changes */}
      <div aria-live="polite" className="sticky bottom-4 z-10">
        {/* Only shown while there are unsaved changes; after a save the "Last changed" line above confirms it */}
        {changes > 0 && (
          <div className="flex flex-col gap-3 rounded-xl border border-blue-500/40 bg-[#18181b]/95 p-3 shadow-2xl shadow-black/60 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:pl-5">
            <p className={`text-sm ${status?.kind === "error" ? "text-red-400" : "text-neutral-200"}`}>
              {status?.text ?? `${plural(changes, "change")} not saved. New limits apply on every server within 15 seconds.`}
            </p>
            <div className="flex gap-2">
              <button type="button" onClick={discard} className={`${btn} flex-1 sm:flex-none`}>Discard</button>
              <button type="submit" disabled={status?.kind === "saving"} className={`${primaryBtn} flex-1 sm:flex-none`}>Save changes</button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
}

// Ask AI settings: the last 24 hours of traffic and the rate limits the admin can raise or lower without a deploy
export default function AskAiSettingsPage() {
  const fetched = useAnalyticsFetch<RateSettings>("/api/admin/docs/settings");
  // A save returns fresh settings; they replace the loaded ones until the page is reloaded
  const [saved, setSaved] = useState<RateSettings | null>(null);
  const settings = saved ?? fetched.data;

  return (
    <main className="min-h-screen bg-[#09090b] px-4 py-6 font-sans text-neutral-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        <header className="mb-6 flex flex-col gap-4 border-b border-[#27272a] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl sm:leading-tight">Ask AI settings</h1>
            <p className="mt-1 text-sm text-neutral-400">How much visitors can ask Ask AI.</p>
          </div>
          <nav aria-label="Admin" className="flex shrink-0 flex-wrap gap-2 sm:flex-nowrap sm:gap-3">
            <Link href="/admin/docs" className={btn}>Back to Docs</Link>
            <Link href="/admin/docs/analytics" className={btn}>Analytics</Link>
          </nav>
        </header>

        {fetched.loading && !saved ? (
          <div className="flex flex-col gap-6" aria-label="Loading settings">
            <div className="h-32 rounded-xl border border-[#27272a] bg-[#18181b] motion-safe:animate-pulse" />
            <div className="h-96 rounded-xl border border-[#27272a] bg-[#18181b] motion-safe:animate-pulse" />
          </div>
        ) : fetched.error && !saved ? (
          <div role="alert" className="flex flex-wrap items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            <span>{fetched.error}</span>
            <button onClick={fetched.reload} className="inline-flex min-h-11 cursor-pointer items-center rounded-md border border-red-500/40 px-3 text-xs hover:bg-red-500/10 sm:min-h-8">Try again</button>
          </div>
        ) : settings ? (
          <div className="flex flex-col gap-6">
            <section aria-labelledby="usage-title" className="flex flex-col gap-3">
              <h2 id="usage-title" className={panelTitle}>Last 24 hours</h2>
              <UsageBand settings={settings} />
            </section>
            <LimitsForm key={settings.updatedAt ?? "defaults"} settings={settings} onSaved={setSaved} />
          </div>
        ) : null}
      </div>
    </main>
  );
}
