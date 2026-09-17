'use client';
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useCurrency } from '@/context/CurrencyContext';
import { formatCurrency, CURRENCY_CONFIGS, CurrencyCode } from '@/utils/currencyConfig';

interface RoiCalculatorProps {
  planRatesUsd?: {
    pro: number;
    teams: number;
    max: number;
  };
}

export default function RoiCalculator({ planRatesUsd = { pro: 20, teams: 30, max: 100 } }: RoiCalculatorProps) {
  const { currency, config } = useCurrency();

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

  // Calculations based on the exact verified business formulas
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
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-16">
      {/* ── Section Title ── */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold mb-3">
          ROI & Cost-Savings Calculator
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
          Calculate Your Team's{' '}
          <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
            Return on Investment
          </span>
        </h2>
        <p className="text-zinc-400 mt-3 text-base lg:text-lg max-w-2xl mx-auto">
          See the tangible engineering hours and financial savings CodeMate unlocks for your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
        {/* ── Left Column: Inputs ── */}
        <div className="flex flex-col gap-6">
          {/* Card 1: Your Engineering Team */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 lg:p-7 space-y-6">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Your engineering team</h3>
            </div>

            {/* 1. Number of Developers */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">Number of developers</label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>1 developer</span>
                <span>250 developers</span>
                <span>500 developers</span>
              </div>
            </div>

            {/* 2. Estimated Hours Saved */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Estimated hours saved per developer / week
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>1 hr</span>
                <span>10 hrs</span>
                <span>20 hrs</span>
              </div>
            </div>

            {/* 3. Effective Engineering Cost Per Hour */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Effective engineering cost per hour
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>{config.roi.formatHourlyCost(config.roi.minHourlyCost)}</span>
                <span>{config.roi.formatHourlyCost(config.roi.maxHourlyCost)}</span>
              </div>
            </div>

            {/* 4. Expected Adoption / Utilization */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Expected adoption / utilization
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Partnership Investment */}
          <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 lg:p-7 space-y-6">
            <div className="border-b border-zinc-800 pb-3">
              <h3 className="text-base font-semibold text-white">Partnership investment</h3>
            </div>

            {/* Annual Subscription per Developer */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Annual CodeMate subscription per developer ({currency})
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>{formatCurrency(Math.round(config.roi.defaultAnnualSubPerDev * 0.5), currency)}</span>
                <span>{formatCurrency(Math.round(config.roi.defaultAnnualSubPerDev * 3), currency)}</span>
              </div>
            </div>

            {/* One-time onboarding / deployment cost */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  One-time onboarding / deployment cost ({currency})
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
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
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>{formatCurrency(config.roi.minOnboardingCost, currency)}</span>
                <span>{formatCurrency(config.roi.maxOnboardingCost, currency)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Column: Estimated Annual Results ── */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 lg:p-7 space-y-6 h-fit lg:sticky lg:top-28">
          <div>
            <div className="border-b border-zinc-800 pb-3 mb-6">
              <h3 className="text-lg font-semibold text-white">Estimated annual results</h3>
            </div>

            {/* Top Block: Estimated Annual Productivity Value */}
            <div className="mb-6">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                Estimated annual productivity value
              </p>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {formatCurrency(metrics.productivityValue, currency)}
              </div>
            </div>

            {/* Middle Section: Row List */}
            <div className="py-5 border-y border-zinc-800/80 space-y-4">
              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-zinc-300 font-medium">Annual subscription + setup</span>
                <span className="font-semibold text-white">
                  {formatCurrency(metrics.annualInvestment, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-zinc-300 font-medium">Estimated net annual value</span>
                <span className="font-semibold text-white">
                  {formatCurrency(metrics.netAnnualValue, currency)}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm sm:text-base">
                <span className="text-zinc-300 font-medium">Investment recovery estimate</span>
                <span className="font-semibold text-zinc-200">
                  {metrics.paybackMonths}
                </span>
              </div>
            </div>

            {/* Bottom Section: Estimated ROI & Benefit / Cost */}
            <div className="pt-6 grid grid-cols-2 gap-4 sm:gap-6 items-end">
              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Estimated ROI
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-400 tracking-tight">
                  {metrics.roiPercentage}%
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
                  Benefit / cost
                </p>
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight flex items-center leading-none">
                  <span>{metrics.benefitCostRatio}</span>
                  <span className="text-[1.3em] font-bold leading-none ml-0.5 inline-block">×</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


