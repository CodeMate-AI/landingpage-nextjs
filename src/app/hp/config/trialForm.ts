// Validation rules shared by the trial form and /api/submit-trial so both always agree.
export const TRIAL_FIELD_LIMITS = {
  organizationName: 120,
  hpPartnerId: 80,
  mobileNumber: 25,
  city: 100,
} as const;

export function isValidTrialPhone(value: string): boolean {
  if (!/^\+?[0-9\s\-()]+$/.test(value)) return false;
  const digits = value.replace(/\D/g, "").length;
  return digits >= 7 && digits <= 15;
}
