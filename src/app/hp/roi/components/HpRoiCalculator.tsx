'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency, CURRENCY_CONFIGS, CurrencyCode } from '@/utils/currencyConfig';
import ExclusiveTrialModal from '@/app/hp/components/ExclusiveTrialModal';

export default function HpRoiCalculator() {
  const { currency, config } = useCurrency();
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);

  // Engineering Team Inputs
  const [teamSize, setTeamSize] = useState<number>(20);
  const [hoursSavedPerWeek, setHoursSavedPerWeek] = useState<number>(5);
  const [hourlyCost, setHourlyCost] = useState<number>(config.roi.defaultHourlyCost);
  const [adoptionRate, setAdoptionRate] = useState<number>(75);

  // Partnership Investment Inputs
  const [annualSubPerDev, setAnnualSubPerDev] = useState<number>(config.roi.defaultAnnualSubPerDev);
  const [onboardingCost, setOnboardingCost] = useState<number>(config.roi.defaultOnboardingCost);

  const inputsTouchedRef = useRef(false);
  const prevCurrencyRef = useRef<CurrencyCode>(currency);

  // Rescale / update localized values when currency changes
  useEffect(() => {
    const prevCurr = prevCurrencyRef.current;
    if (prevCurr !== currency) {
      if (inputsTouchedRef.current) {
        const prevRate = CURRENCY_CONFIGS[prevCurr]?.rateVsUsd || 1;
        const newRate = config.rateVsUsd;
        setHourlyCost((prev) => {
          const converted = Math.round((prev / prevRate) * newRate);
          return Math.min(config.roi.maxHourlyCost, Math.max(config.roi.minHourlyCost, converted));
        });
        setAnnualSubPerDev((prev) => {
          const converted = Math.round((prev / prevRate) * newRate);
          const min = Math.round(config.roi.defaultAnnualSubPerDev * 0.5);
          const max = Math.round(config.roi.defaultAnnualSubPerDev * 3);
          return Math.min(max, Math.max(min, converted));
        });
        setOnboardingCost((prev) => {
          const converted = Math.round((prev / prevRate) * newRate);
          return Math.min(config.roi.maxOnboardingCost, Math.max(config.roi.minOnboardingCost, converted));
        });
      } else {
        setHourlyCost(config.roi.defaultHourlyCost);
        setAnnualSubPerDev(config.roi.defaultAnnualSubPerDev);
        setOnboardingCost(config.roi.defaultOnboardingCost);
      }
      prevCurrencyRef.current = currency;
    }
  }, [currency, config]);

  // Calculations based on verified business formulas
  const metrics = useMemo(() => {
    const validTeamSize = Math.max(1, teamSize);
    const validHoursSaved = Math.max(0.5, hoursSavedPerWeek);
    const validHourlyCost = Math.max(1, hourlyCost);
    const validAdoptionRate = Math.max(0, Math.min(100, adoptionRate));
    const validAnnualSub = Math.max(0, annualSubPerDev);
    const validOnboarding = Math.max(0, onboardingCost);

    // Productivity value = Developers * hours saved per week * hourly cost * 52 weeks * adoption rate
    const productivityValue = Math.round(
      validTeamSize * validHoursSaved * validHourlyCost * 52 * (validAdoptionRate / 100)
    );

    // Annual investment = Annual CodeMate subscription fees + one-time onboarding costs
    const annualSubscriptionFees = Math.round(validTeamSize * validAnnualSub);
    const annualInvestment = Math.round(annualSubscriptionFees + validOnboarding);

    // Net annual value = Estimated productivity value - annual investment
    const netAnnualValue = Math.max(0, productivityValue - annualInvestment);

    // ROI = Net annual value / annual investment * 100
    const roiPercentage =
      annualInvestment > 0 ? Math.round((netAnnualValue / annualInvestment) * 100) : 0;

    // Benefit / cost ratio
    const benefitCostRatio =
      annualInvestment > 0 ? (productivityValue / annualInvestment).toFixed(2) : '0';

    // Investment recovery estimate (Payback period in months)
    let paybackMonths = '0 months';
    if (productivityValue > 0 && annualInvestment > 0) {
      const months = (annualInvestment / productivityValue) * 12;
      paybackMonths = months > 12 ? '> 12 months' : `${months.toFixed(1)} months`;
    }

    return {
      productivityValue,
      annualSubscriptionFees,
      annualInvestment,
      netAnnualValue,
      roiPercentage,
      benefitCostRatio,
      paybackMonths,
    };
  }, [teamSize, hoursSavedPerWeek, hourlyCost, adoptionRate, annualSubPerDev, onboardingCost]);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: Interactive Inputs */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Your Engineering Team */}
          <div className="bg-white border border-[#D0E2FF]/80 shadow-[0_12px_40px_rgba(10,91,223,0.08)] rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="border-b border-[#EAEFF8] pb-3">
              <h3 className="font-heading text-xl font-normal text-black">
                Your Engineering Team
              </h3>
              <p className="text-xs text-[#5E6D82] font-sans mt-0.5">
                Configure your team size, productivity benchmarks, and hourly cost.
              </p>
            </div>

            {/* 1. Number of Developers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  Number of developers
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {teamSize} {teamSize === 1 ? 'developer' : 'developers'}
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={1}
                max={500}
                step={1}
                value={teamSize}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setTeamSize(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>1 dev</span>
                <span>250 devs</span>
                <span>500 devs</span>
              </div>
            </div>

            {/* 2. Estimated Hours Saved */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  Estimated hours saved per developer / week
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {hoursSavedPerWeek} hrs
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={1}
                max={20}
                step={0.5}
                value={hoursSavedPerWeek}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setHoursSavedPerWeek(parseFloat(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>1 hr</span>
                <span>10 hrs</span>
                <span>20 hrs</span>
              </div>
            </div>

            {/* 3. Effective Engineering Cost Per Hour */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  Effective engineering cost per hour
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {config.roi.formatHourlyCost(hourlyCost)}
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={config.roi.minHourlyCost}
                max={config.roi.maxHourlyCost}
                step={config.roi.hourlyStep}
                value={hourlyCost}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setHourlyCost(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>{config.roi.formatHourlyCost(config.roi.minHourlyCost)}</span>
                <span>{config.roi.formatHourlyCost(config.roi.maxHourlyCost)}</span>
              </div>
            </div>

            {/* 4. Expected Adoption / Utilization */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  Expected team adoption / utilization
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {adoptionRate}%
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={10}
                max={100}
                step={5}
                value={adoptionRate}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setAdoptionRate(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Partnership Investment */}
          <div className="bg-white border border-[#D0E2FF]/80 shadow-[0_12px_40px_rgba(10,91,223,0.08)] rounded-2xl p-6 sm:p-7 space-y-6">
            <div className="border-b border-[#EAEFF8] pb-3">
              <h3 className="font-heading text-xl font-normal text-black">
                Partnership Investment
              </h3>
              <p className="text-xs text-[#5E6D82] font-sans mt-0.5">
                Annual license subscription and one-time onboarding deployment fees.
              </p>
            </div>

            {/* Annual Subscription per Developer */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  Annual CodeMate subscription per developer ({currency})
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {formatCurrency(annualSubPerDev, currency)} / yr
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={Math.round(config.roi.defaultAnnualSubPerDev * 0.5)}
                max={Math.round(config.roi.defaultAnnualSubPerDev * 3)}
                step={Math.round(config.roi.defaultAnnualSubPerDev * 0.05)}
                value={annualSubPerDev}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setAnnualSubPerDev(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>{formatCurrency(Math.round(config.roi.defaultAnnualSubPerDev * 0.5), currency)}</span>
                <span>{formatCurrency(Math.round(config.roi.defaultAnnualSubPerDev * 3), currency)}</span>
              </div>
            </div>

            {/* One-time onboarding / deployment cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-[#1A1A1A] font-sans">
                  One-time onboarding & deployment cost ({currency})
                </label>
                <span className="text-sm font-semibold text-[#0A5BDF] px-3 py-0.5 rounded-full bg-[#EBF3FF] border border-[#D0E2FF]">
                  {formatCurrency(onboardingCost, currency)}
                </span>
              </div>
              <input
                suppressHydrationWarning
                type="range"
                min={config.roi.minOnboardingCost}
                max={config.roi.maxOnboardingCost}
                step={config.roi.onboardingStep}
                value={onboardingCost}
                onChange={(e) => {
                  inputsTouchedRef.current = true;
                  setOnboardingCost(parseInt(e.target.value));
                }}
                className="w-full h-2 bg-[#E2E8F0] rounded-lg appearance-none cursor-pointer accent-[#0A5BDF]"
              />
              <div className="flex justify-between text-[11px] text-[#718096] font-medium mt-1">
                <span>{formatCurrency(config.roi.minOnboardingCost, currency)}</span>
                <span>{formatCurrency(config.roi.maxOnboardingCost, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Estimated Annual Results */}
        <div className="lg:col-span-5 bg-white border border-[#D0E2FF]/80 shadow-[0_12px_40px_rgba(10,91,223,0.08)] rounded-2xl p-6 sm:p-8 space-y-6 h-fit lg:sticky lg:top-28">
          <div>
            <div className="border-b border-[#EAEFF8] pb-4 mb-6">
              <span className="text-[12px] font-heading font-semibold uppercase tracking-[0.08em] text-[#0A5BDF]">
                Projected Impact
              </span>
              <h3 className="font-heading text-2xl font-normal text-black mt-1">
                Estimated Annual Results
              </h3>
            </div>

            {/* Primary Highlight Block: Estimated Annual Productivity Value */}
            <div className="p-5 rounded-xl bg-[#F4F8FF] border border-[#D0E2FF] mb-6">
              <p className="text-xs font-semibold text-[#485571] uppercase tracking-wider mb-1.5 font-sans">
                Estimated Annual Productivity Value
              </p>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-[#0A5BDF] tracking-tight">
                {formatCurrency(metrics.productivityValue, currency)}
              </div>
            </div>

            {/* Summary Breakdown Rows */}
            <div className="py-4 border-y border-[#EAEFF8] space-y-3.5 font-sans">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-[#485571] font-medium">Annual subscription + setup</span>
                <span className="font-semibold text-black">
                  {formatCurrency(metrics.annualInvestment, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-[#485571] font-medium">Estimated net annual value</span>
                <span className="font-bold text-[#0A5BDF]">
                  {formatCurrency(metrics.netAnnualValue, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-[#485571] font-medium">Investment recovery estimate</span>
                <span className="font-semibold text-black">
                  {metrics.paybackMonths}
                </span>
              </div>
            </div>

            {/* Bottom ROI & Benefit / Cost */}
            <div className="pt-4 grid grid-cols-2 gap-4 items-end">
              <div className="p-4 rounded-xl bg-[#F9FBFE] border border-[#E0E8F5]">
                <p className="text-[11px] font-semibold text-[#5E6D82] uppercase tracking-wider mb-1 font-sans">
                  Estimated ROI
                </p>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-[#0A5BDF] tracking-tight">
                  {metrics.roiPercentage}%
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#F9FBFE] border border-[#E0E8F5]">
                <p className="text-[11px] font-semibold text-[#5E6D82] uppercase tracking-wider mb-1 font-sans">
                  Benefit / Cost
                </p>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-black tracking-tight flex items-center leading-none">
                  <span>{metrics.benefitCostRatio}</span>
                  <span className="text-[1.2em] font-bold leading-none ml-0.5 inline-block text-[#0A5BDF]">×</span>
                </div>
              </div>
            </div>

            {/* Call to action */}
            <div className="pt-4">
              <button
                type="button"
                onClick={() => setIsTrialModalOpen(true)}
                className="w-full inline-flex h-12 items-center justify-center gap-2 border border-black bg-black px-5 font-heading text-[16px] tracking-[0.5px] text-white transition-colors hover:bg-zinc-800 active:translate-y-px cursor-pointer"
              >
                Schedule Enterprise Consultation
              </button>
            </div>
          </div>
        </div>
      </div>

      <ExclusiveTrialModal
        isOpen={isTrialModalOpen}
        onClose={() => setIsTrialModalOpen(false)}
      />
    </div>
  );
}
