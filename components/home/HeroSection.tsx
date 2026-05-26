"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Terminal, Shield, Zap } from "lucide-react";

/* Mini builder UI mock — rendered as real divs, no placeholder images */
function BuilderMock() {
  const fields = ["name", "email", "status", "createdAt"];
  return (
    <div className="animate-float relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-2xl border border-[#635BFF]/15 shadow-2xl shadow-[#635BFF]/8"
      style={{ background: "#1A1F36" }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3 bg-[#071D33]/40">
        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5996]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#00D4B1]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#635BFF]" />
        <span className="ml-4 text-[11px] font-mono text-[#8892A4]">oneatlas.app / crm-workspace</span>
      </div>
      <div className="flex divide-x divide-white/[0.06] text-left">
        {/* Sidebar */}
        <div className="hidden w-44 flex-col gap-1.5 p-3 sm:flex bg-[#071D33]/20">
          {["Contacts", "Deals", "Pipeline", "Reports"].map((item, i) => (
            <div key={item}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${i === 0 ? "bg-[#635BFF]/15 text-[#635BFF]" : "text-[#8892A4] hover:text-white/60"}`}>
              {item}
            </div>
          ))}
        </div>
        {/* Main panel */}
        <div className="flex-1 p-4 bg-[#1A1F36]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-white/90">Contacts</span>
            <span className="rounded bg-[#635BFF]/20 px-2 py-0.5 text-[10px] text-[#635BFF] font-medium">+ Add field</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/[0.06] bg-[#071D33]/30">
            <div className="grid grid-cols-4 border-b border-white/[0.06] bg-white/[0.02] px-3 py-2">
              {fields.map((f) => (
                <span key={f} className="text-[10px] font-semibold uppercase tracking-wider text-[#8892A4]">{f}</span>
              ))}
            </div>
            {[["Alice Chen", "alice@co.com", "Active", "Jan 12"], ["Bob Torres", "bob@co.com", "Lead", "Jan 14"], ["Caro Kim", "caro@co.com", "Churned", "Jan 9"]].map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-white/[0.04] px-3 py-2 last:border-0 hover:bg-white/[0.01]">
                {row.map((cell, j) => (
                  <span key={j} className={`text-xs ${j === 2
                    ? cell === "Active" ? "text-[#635BFF]" : cell === "Lead" ? "text-[#FF5996]" : "text-[#FF5996]"
                    : "text-white/70"}`}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Prompt bar */}
      <div className="border-t border-white/[0.08] px-4 py-3 bg-[#071D33]/40">
        <div className="flex items-center gap-2 rounded-lg border border-[#635BFF]/20 bg-[#635BFF]/5 px-3 py-2">
          <span className="text-xs text-[#635BFF]">✦</span>
          <span className="text-xs text-[#8892A4]">add a revenue field to Contacts…</span>
          <span className="ml-auto h-3.5 w-0.5 animate-pulse bg-[#635BFF]" />
        </div>
      </div>
    </div>
  );
}

const trustBadges = [
  { icon: <Terminal size={14} />, label: "GPT-4o Powered" },
  { icon: <Shield size={14} />, label: "Versioned Schemas" },
  { icon: <Zap size={14} />, label: "Deploy in Seconds" },
];

const chips = [
  "CRM for sales deals",
  "Employee onboarding",
  "Warehouse tracker",
  "Support helpdesk"
];

export function HeroSection() {
  const [prompt, setPrompt] = useState("");
  const router = useRouter();

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    router.push(`/generate?prompt=${encodeURIComponent(prompt.trim())}`);
  };

  const handleChipClick = (chipText: string) => {
    setPrompt(chipText);
  };

  return (
    <section className="relative overflow-hidden pt-[68px]">
      <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#635BFF]/20 bg-[#635BFF]/5 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#635BFF] shadow-sm shadow-[#635BFF]" />
          <span className="text-xs font-semibold text-[#635BFF]">Now in public beta — schema versioning live</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up mx-auto max-w-4xl text-5xl font-extrabold leading-[1.1] tracking-tight text-[#1A1F36] sm:text-6xl lg:text-7xl">
          Build operational apps at the speed of{" "}
          <span className="bg-gradient-to-r from-[#635BFF] to-[#FF5996] bg-clip-text text-transparent">
            thought.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="animate-fade-in-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#667085] sm:text-lg lg:text-xl"
          style={{ animationDelay: "0.1s" }}>
          OneAtlas generates, stores, and evolves your app schemas in real-time — from a single prompt.
        </p>

        {/* Search/Input Area */}
        <form onSubmit={handleGenerate} className="animate-fade-in-up mx-auto mt-10 max-w-2xl w-full" style={{ animationDelay: "0.15s" }}>
          <div className="relative flex items-center p-2 rounded-2xl bg-white border border-[#635BFF]/10 shadow-lg shadow-[#635BFF]/5 hover:border-[#635BFF]/30 transition-all duration-300 focus-within:border-[#635BFF] focus-within:ring-4 focus-within:ring-[#635BFF]/15">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the operational app you need... (e.g. CRM for sales deals)"
              className="w-full bg-transparent px-4 py-3 text-sm sm:text-base text-[#1A1F36] placeholder-[#8892A4] outline-none"
            />
            <button
              type="submit"
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#635BFF] to-[#544cf4] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-[#635BFF]/20 hover:opacity-95 transition-all duration-300 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-[#635BFF]/30 active:scale-[0.98] cursor-pointer"
            >
              <span>Generate</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>

        {/* Suggestion Chips */}
        <div className="animate-fade-in-up mt-5 flex flex-wrap items-center justify-center gap-2.5 max-w-2xl mx-auto" style={{ animationDelay: "0.2s" }}>
          <span className="text-xs font-semibold text-[#667085] mr-1">Suggestions:</span>
          {chips.map((chipText) => (
            <button
              key={chipText}
              type="button"
              onClick={() => handleChipClick(chipText)}
              className="rounded-full bg-white border border-[#635BFF]/10 px-4 py-1.5 text-xs font-medium text-[#475467] shadow-sm hover:bg-[#F4F5FF] hover:border-[#635BFF] hover:text-[#635BFF] hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              {chipText}
            </button>
          ))}
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up mt-10 flex flex-wrap items-center justify-center gap-6"
          style={{ animationDelay: "0.25s" }}>
          {trustBadges.map((badge) => (
            <span key={badge.label}
              className="flex items-center gap-2 text-xs font-semibold text-[#667085]">
              <span className="text-[#635BFF]">{badge.icon}</span>
              {badge.label}
            </span>
          ))}
        </div>

        {/* Mini builder preview */}
        <BuilderMock />
      </div>
    </section>
  );
}
