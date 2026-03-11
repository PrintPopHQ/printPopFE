"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";

interface InputFieldProps {
  label: string;
  id: string;
  value: string;
  onChange: (val: string) => void;
  prefix?: string;
  suffix?: string;
  hint?: string;
}

const InputField = ({ label, id, value, onChange, prefix, suffix, hint }: InputFieldProps) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-200 font-comic tracking-wide">
      {label}
    </label>
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-4 text-gray-400 text-sm font-comic select-none">{prefix}</span>
      )}
      <input
        id={id}
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full bg-[#112238] border border-white/10 rounded-lg py-3 text-white text-sm font-comic placeholder-gray-500 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition-all ${prefix ? "pl-8" : "pl-4"} ${suffix ? "pr-12" : "pr-4"}`}
      />
      {suffix && (
        <span className="absolute right-4 text-gray-400 text-sm font-comic select-none">{suffix}</span>
      )}
    </div>
    {hint && <p className="text-xs text-gray-500 font-comic leading-relaxed">{hint}</p>}
    <div className="h-px bg-white/5 mt-3" />
  </div>
);

interface SummaryRowProps {
  label: string;
  value: string;
}

const SummaryRow = ({ label, value }: SummaryRowProps) => (
  <div className="flex justify-between items-center py-3 border-b border-white/5">
    <span className="text-gray-300 text-sm font-comic">{label}</span>
    <span className="text-white font-bold font-comic text-sm">{value}</span>
  </div>
);

export const ROICalculator = () => {
  const [A, setA] = useState("42500"); // Initial Investment
  const [B, setB] = useState("35");    // Retail price per case
  const [C, setC] = useState("300");   // Units sold per month
  const [D, setD] = useState("6.5");   // Unit production cost
  const [E, setE] = useState("800");   // Monthly overhead cost
  const [I, setI] = useState("16");    // Royalty %

  const results = useMemo(() => {
    const a = parseFloat(A) || 0;
    const b = parseFloat(B) || 0;
    const c = parseFloat(C) || 0;
    const d = parseFloat(D) || 0;
    const e = parseFloat(E) || 0;
    const royaltyPct = parseFloat(I) || 0;

    // F: Total monthly revenue
    const F = c * b;
    // G: Total monthly production cost
    const G = c * d;
    // H: Total monthly overhead
    const H = e;
    // Royalty amount
    const royalty = F * (royaltyPct / 100);
    // J: Total monthly profit
    const J = F - G - H - royalty;
    // Months to recoup
    const months = J > 0 ? a / J : Infinity;

    return { F, G, H, royalty, J, months };
  }, [A, B, C, D, E, I]);

  const fmt = (n: number) =>
    n === Infinity ? "∞" : `$${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const fmtMonths = (n: number) =>
    n === Infinity ? "N/A" : n.toFixed(1);

  return (
    <section className="relative overflow-hidden py-8 pb-24 bg-black">
      {/* Background Glows */}
      {/* <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-[200px] h-[200px] bg-secondary opacity-15 blur-[140px] rounded-full mix-blend-screen animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[200px] h-[200px] bg-primary opacity-10 blur-[120px] rounded-full mix-blend-screen animate-pulse"></div>
      </div> */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-4 tracking-tighter">
            <span className="text-neon-blue">ROI</span> CALCULATOR
          </h2>
          <p className="text-gray-300 font-comic text-lg max-w-xl mx-auto leading-relaxed">
            Turn Your Project Numbers into Clear Profit Forecasts
          </p>
          <div className="h-1.5 w-16 bg-linear-to-r from-primary to-secondary mx-auto rounded-full mt-6" />
        </div>

        {/* How it works */}
        <div className="bg-[#112238] border border-white/5 rounded-2xl p-6 mb-10 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h3 className="text-white font-bold font-neon text-sm tracking-widest uppercase mb-4 text-neon-blue">How it works</h3>
          <ul className="space-y-2 font-comic text-gray-300 text-sm leading-relaxed">
            <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Enter your key numbers: Franchise cost, selling price per case, average units sold per month, and typical operating expenses.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Refine your scenario: Adjust unit production cost, average overhead cost, and royalty percentage paid to PrintPop.</span></li>
            <li className="flex gap-2"><span className="text-cyan-400 mt-0.5">•</span><span>Get instant projections: View your estimated monthly profit, breakeven timeline, and annual return so you can plan with confidence.</span></li>
          </ul>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Inputs */}
          <div className="bg-[#111827] border border-white/5 rounded-2xl p-8 space-y-6 animate-in fade-in slide-in-from-left-4 duration-1000">
            <div>
              <h3 className="font-neon text-xl font-bold text-white mb-1 tracking-wide">Scenario Setup</h3>
              <p className="text-gray-400 font-comic text-sm">Adjust these numbers to match your market and business environment.</p>
            </div>

            <InputField
              id="investment"
              label="Initial Investment ($) *"
              value={A}
              onChange={setA}
              prefix="$"
              hint="Typical range: $25,000 – $60,000"
            />
            <InputField
              id="retailPrice"
              label="Final Retail Price per Case ($) *"
              value={B}
              onChange={setB}
              prefix="$"
              hint="Typical range: $35"
            />
            <InputField
              id="unitsSold"
              label="Expected Units Sold per Month *"
              value={C}
              onChange={setC}
              suffix="units"
              hint="Typical range: 250 – 350 units/month"
            />
            <InputField
              id="productionCost"
              label="Unit Production Cost ($) *"
              value={D}
              onChange={setD}
              prefix="$"
              hint="Typical range: $5 – $8 per case"
            />
            <InputField
              id="overhead"
              label="Average Overhead Cost / Month ($) *"
              value={E}
              onChange={setE}
              prefix="$"
              hint="Typical range: $600 – $1,000 (rent, electricity, supplies)"
            />
            <InputField
              id="royalty"
              label="Royalty Paid to PrintPop (%) *"
              value={I}
              onChange={setI}
              suffix="%"
              hint="Typical range: 12% – 20% of monthly revenue"
            />
          </div>

          {/* Right: Summary */}
          <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-1000">
            <div className="bg-[#112238] border border-white/5 rounded-2xl p-8">
              <h3 className="font-neon text-xl font-bold text-white mb-1 tracking-widest uppercase">ROI Summary</h3>
              <p className="text-gray-400 font-comic text-sm mb-6">Based on your numbers, here's what your franchise could earn.</p>

              <div className="space-y-0">
                <SummaryRow label="Total Monthly Revenue" value={fmt(results.F)} />
                <SummaryRow label="Total Monthly Production Cost" value={fmt(results.G)} />
                <SummaryRow label="Total Monthly Overhead Cost" value={fmt(results.H)} />
                <SummaryRow label={`Royalty to PrintPop (${I}% of Revenue)`} value={fmt(results.royalty)} />
              </div>

              {/* Profit highlight */}
              <div className="mt-6 rounded-xl overflow-hidden">
                <div className="bg-primary text-white px-6 py-4 flex justify-between items-center">
                  <span className="font-neon font-bold text-base tracking-wide uppercase">Total Monthly Profit</span>
                  <span className="font-neon font-black text-lg">{fmt(results.J)}</span>
                </div>
              </div>

              {/* Break-even months */}
              <div className="mt-3 rounded-xl overflow-hidden">
                <div className="bg-secondary text-white px-6 py-4 flex justify-between items-center">
                  <span className="font-neon font-bold text-base tracking-wide uppercase leading-tight">Months to Recoup<br />Investment</span>
                  <span className="font-neon font-black text-lg">{fmtMonths(results.months)} <span className="text-sm font-normal">mo</span></span>
                </div>
              </div>

              {/* Annual Profit hint */}
              {results.J > 0 && (
                <div className="mt-4 text-center text-gray-400 font-comic text-sm">
                  Estimated Annual Profit:{" "}
                  <span className="text-cyan-400 font-bold">
                    {fmt(results.J * 12)}
                  </span>
                </div>
              )}
            </div>

            {/* CTA card */}
            <div className="bg-[#112238] border border-white/5 rounded-2xl p-8 space-y-4">
              <h4 className="font-neon text-xl font-bold text-white leading-tight">
                Ready to See These Numbers<br />in Real Life?
              </h4>
              <p className="text-gray-400 font-comic text-sm leading-relaxed">
                Start with a PrintPop franchise designed for your market. Low startup cost, high-margin sales, and growing demand for personalized phone accessories.
              </p>
              <p className="text-gray-400 font-comic text-sm leading-relaxed">
                You've seen the numbers — now imagine what they look like with real customers walking up and buying from your machine.
              </p>
              <div className="pt-2">
                <Link
                  href="/franchise#contact"
                  className="inline-block px-10 py-4 btn-brand-gradient text-white font-black rounded-[8px] shadow-[0_0_20px_rgba(92,225,230,0.3)] hover:shadow-[0_0_35px_rgba(92,225,230,0.6)] transition-all duration-300 uppercase tracking-widest text-sm"
                >
                  Get Franchise
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
