import Link from "next/link";
import { pricingTiers } from "@/config/site";
import type { PricingTier } from "@/config/site";

function CheckIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PricingCard({ tier }: { tier: PricingTier }) {
  return (
    <div className={`relative flex flex-col gap-6 rounded-2xl p-8 bg-white border transition-all duration-300 ${
      tier.highlighted
        ? "border-2 border-[#635BFF] shadow-2xl shadow-[#635BFF]/12"
        : "border-[#635BFF]/10 hover:border-[#635BFF]/25 hover:shadow-lg"
    }`}
    style={tier.highlighted ? { background: "rgba(99,91,255,0.02)" } : {}}>

      {/* Popular badge */}
      {tier.highlighted && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-gradient-to-r from-[#635BFF] to-[#7A73FF] px-4 py-1 text-xs font-semibold text-white shadow-lg shadow-[#635BFF]/30">
            Most Popular
          </span>
        </div>
      )}

      {/* Tier header */}
      <div className="flex flex-col gap-1.5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-[#667085]">
          {tier.name}
        </h3>
        <div className="flex items-end gap-1">
          <span className="text-4xl font-extrabold text-[#0A2540]">{tier.priceLabel}</span>
        </div>
        <p className="text-sm text-[#667085] leading-relaxed">{tier.description}</p>
      </div>

      {/* Features list */}
      <ul className="flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-2.5 text-sm text-[#344054]">
            <span className={tier.highlighted ? "text-[#635BFF]" : "text-[#00D4B1]"}>
              <CheckIcon />
            </span>
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link href={tier.ctaHref}
        className={`mt-auto block rounded-xl px-5 py-3 text-center text-sm font-semibold transition-all active:scale-[0.97] hover:-translate-y-[2px] ${
          tier.highlighted
            ? "bg-gradient-to-r from-[#635BFF] to-[#7A73FF] text-white shadow-lg shadow-[#635BFF]/25 hover:opacity-95"
            : "border border-[#635BFF]/25 text-[#635BFF] hover:bg-[#635BFF]/5 hover:border-[#635BFF]/40"
        }`}>
        {tier.cta}
      </Link>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-24">
      {/* Header */}
      <div className="mb-16 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#635BFF] bg-[#635BFF]/5 px-3 py-1 rounded-full">
          Pricing
        </span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
          Simple, transparent pricing.
        </h2>
        <p className="mt-3 text-[#667085] text-sm sm:text-base max-w-md mx-auto">Start free. Scale when you need to.</p>
      </div>

      {/* Cards grid */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {pricingTiers.map((tier) => (
          <PricingCard key={tier.name} tier={tier} />
        ))}
      </div>
    </section>
  );
}
