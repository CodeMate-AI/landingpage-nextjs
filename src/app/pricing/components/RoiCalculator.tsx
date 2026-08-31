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
  const [teamSize, setTeamSize] = useState<number>(10);
  const [salary, setSalary] = useState<number>(config.roi.defaultSalary);
  const [dailyCodingHours, setDailyCodingHours] = useState<number>(4);
  const [efficiencyGain, setEfficiencyGain] = useState<number>(25);
  const [planTier, setPlanTier] = useState<'pro' | 'teams' | 'max'>('teams');
  const salaryTouchedRef = useRef(false);
  const prevCurrencyRef = useRef<CurrencyCode>(currency);

  useEffect(() => {
    const prevCurr = prevCurrencyRef.current;
    if (prevCurr !== currency) {
      if (salaryTouchedRef.current) {
        const prevRate = CURRENCY_CONFIGS[prevCurr].rateVsUsd;
        const newRate = config.rateVsUsd;
        const convertedSalary = Math.round((salary / prevRate) * newRate);
        setSalary(Math.min(config.roi.maxSalary, Math.max(config.roi.minSalary, convertedSalary)));
      } else {
        setSalary(config.roi.defaultSalary);
      }
      prevCurrencyRef.current = currency;
    }
  }, [currency, config, salary]);

  const metrics = useMemo(() => {
    const validTeamSize = Math.max(1, teamSize);
    const validSalary = Math.max(1000, salary);
    const workingDays = 250;
    const hourlyRate = validSalary / (workingDays * 8);
    const hoursSavedPerDevPerDay = dailyCodingHours * (efficiencyGain / 100);
    const teamHoursSavedYear = Math.round(validTeamSize * hoursSavedPerDevPerDay * workingDays);
    const grossSavings = Math.round(teamHoursSavedYear * hourlyRate);
    const monthlyRateUsd = planRatesUsd[planTier] ?? 30;
    const monthlyPlanRate = Math.round(monthlyRateUsd * config.rateVsUsd);
    const annualToolCost = Math.round(validTeamSize * monthlyPlanRate * 12);
    const netAnnualSavings = Math.max(0, grossSavings - annualToolCost);
    const roiPercentage = annualToolCost > 0 ? Math.max(0, Math.round(((grossSavings - annualToolCost) / annualToolCost) * 100)) : 0;

    let paybackMonths = '—';
    if (grossSavings > 0 && annualToolCost > 0) {
      const months = (annualToolCost / grossSavings) * 12;
      paybackMonths = months > 12 ? '> 12 months' : `${months.toFixed(1)} months`;
    }

    return { teamHoursSavedYear, grossSavings, annualToolCost, netAnnualSavings, roiPercentage, paybackMonths };
  }, [teamSize, salary, dailyCodingHours, efficiencyGain, planTier, config.rateVsUsd, planRatesUsd]);

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 lg:px-8 py-16">
      <div className="text-center mb-12">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-semibold mb-3">
          ROI & Cost-Savings Calculator
        </div>
        <h2 className="text-3xl lg:text-5xl font-bold text-white tracking-tight">
          Calculate Your Team's <span className="bg-gradient-to-b from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">Return on Investment</span>
        </h2>
        <p className="text-zinc-400 mt-3 text-base lg:text-lg max-w-2xl mx-auto">
          See the tangible engineering hours and financial savings CodeMate unlocks for your team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Left Card: Inputs */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Engineering Team Size
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
                  {teamSize} {teamSize === 1 ? 'Developer' : 'Developers'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                step={1}
                value={teamSize}
                onChange={(e) => setTeamSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="flex justify-between text-[11px] text-zinc-500 mt-1">
                <span>1 Dev</span>
                <span>50 Devs</span>
                <span>100+ Devs</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  {config.roi.salaryLabel}
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
                  {config.roi.formatSalary(salary)}
                </span>
              </div>
              <input
                type="range"
                min={config.roi.minSalary}
                max={config.roi.maxSalary}
                step={config.roi.step}
                value={salary}
                onChange={(e) => {
                  salaryTouchedRef.current = true;
                  setSalary(parseInt(e.target.value));
                }}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Routine Coding & Review Hours / Day
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
                  {dailyCodingHours} hrs / day
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={6}
                step={0.5}
                value={dailyCodingHours}
                onChange={(e) => setDailyCodingHours(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-zinc-300">
                  Estimated Productivity Gain
                </label>
                <span className="text-sm font-semibold text-white px-2.5 py-0.5 rounded-md bg-zinc-800 border border-zinc-700">
                  {efficiencyGain}% Faster
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={50}
                step={5}
                value={efficiencyGain}
                onChange={(e) => setEfficiencyGain(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-800/80">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block mb-2.5">
              Select Plan Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['pro', 'teams', 'max'] as const).map((tier) => (
                <button
                  key={tier}
                  type="button"
                  onClick={() => setPlanTier(tier)}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold uppercase tracking-wider border transition-colors ${
                    planTier === tier
                      ? 'bg-zinc-800 text-white border-zinc-600'
                      : 'bg-zinc-900/60 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Card: Output Metrics */}
        <div className="bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-5">
              Estimated Annual Impact
            </h3>
            <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1">
                Net Annual Cost Savings
              </p>
              <div className="text-3xl lg:text-4xl font-bold text-white">
                {formatCurrency(metrics.netAnnualSavings, currency)}
              </div>
              <p className="text-xs text-zinc-500 mt-1">
                After deducting full CodeMate annual licensing investment.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Hours Saved / Year
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics.teamHoursSavedYear.toLocaleString()}{' '}
                  <span className="text-xs font-normal text-zinc-400">hrs</span>
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Net ROI
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics.roiPercentage}%
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Payback Period
                </p>
                <p className="text-2xl font-bold text-white mt-1">
                  {metrics.paybackMonths}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800">
                <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Annual Tool Cost
                </p>
                <p className="text-2xl font-bold text-zinc-300 mt-1">
                  {formatCurrency(metrics.annualToolCost, currency)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
