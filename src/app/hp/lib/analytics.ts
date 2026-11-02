// Google Analytics events for /hp. Never pass form values or personal data here.
type HpEvent =
  | { name: "hp_trial_opened" }
  | { name: "hp_trial_submitted" }
  | { name: "hp_demo_played"; demo: string }
  | { name: "hp_resource_opened"; resource: string }
  | { name: "hp_software_visited"; software: string };

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Record<string, string>) => void;
  }
}

export function trackHpEvent({ name, ...params }: HpEvent) {
  // gtag loads lazily and can be blocked, and tracking must never break the page.
  if (typeof window !== "undefined") window.gtag?.("event", name, params);
}
