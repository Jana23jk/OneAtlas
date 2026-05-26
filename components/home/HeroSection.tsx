import Link from "next/link";

/* Mini builder UI mock — rendered as real divs, no placeholder images */
function BuilderMock() {
  const fields = ["name", "email", "status", "createdAt"];
  return (
    <div className="animate-float relative mx-auto mt-10 max-w-2xl overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-[#635BFF]/10"
      style={{ background: "#0d1b30" }}>
      {/* Window chrome */}
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF5996]/70" />
        <span className="h-3 w-3 rounded-full bg-[#f8bc42]/70" />
        <span className="h-3 w-3 rounded-full bg-[#00D4B1]/70" />
        <span className="ml-4 text-xs text-[#8892A4]">oneatlas.app / crm-workspace</span>
      </div>
      <div className="flex divide-x divide-white/5">
        {/* Sidebar */}
        <div className="hidden w-40 flex-col gap-2 p-3 sm:flex">
          {["Contacts", "Deals", "Pipeline", "Reports"].map((item, i) => (
            <div key={item}
              className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${i === 0 ? "bg-[#635BFF]/20 text-[#635BFF]" : "text-[#8892A4]"}`}>
              {item}
            </div>
          ))}
        </div>
        {/* Main panel */}
        <div className="flex-1 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Contacts</span>
            <span className="rounded bg-[#635BFF]/20 px-2 py-0.5 text-[10px] text-[#635BFF]">+ Add field</span>
          </div>
          <div className="overflow-hidden rounded-lg border border-white/5">
            <div className="grid grid-cols-4 border-b border-white/5 bg-white/[0.03] px-3 py-2">
              {fields.map((f) => (
                <span key={f} className="text-[10px] font-semibold uppercase tracking-wider text-[#8892A4]">{f}</span>
              ))}
            </div>
            {[["Alice Chen", "alice@co.com", "Active", "Jan 12"], ["Bob Torres", "bob@co.com", "Lead", "Jan 14"], ["Caro Kim", "caro@co.com", "Churned", "Jan 9"]].map((row, i) => (
              <div key={i} className="grid grid-cols-4 border-b border-white/5 px-3 py-2 last:border-0 hover:bg-white/[0.02]">
                {row.map((cell, j) => (
                  <span key={j} className={`text-xs ${j === 2
                    ? cell === "Active" ? "text-[#00D4B1]" : cell === "Lead" ? "text-[#f8bc42]" : "text-[#FF5996]"
                    : "text-white/70"}`}>{cell}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Prompt bar */}
      <div className="border-t border-white/10 px-4 py-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#635BFF]/30 bg-[#635BFF]/5 px-3 py-2">
          <span className="text-[10px] text-[#635BFF]">✦</span>
          <span className="text-xs text-[#8892A4]">add a revenue field to Contacts…</span>
          <span className="ml-auto h-3.5 w-0.5 animate-pulse bg-[#635BFF]" />
        </div>
      </div>
    </div>
  );
}

const trustBadges = [
  { icon: "✦", label: "GPT-4o Powered" },
  { icon: "⟳", label: "Versioned Schemas" },
  { icon: "⚡", label: "Deploy in Seconds" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-[68px]">
      {/* Dot texture background */}
      <div className="hero-texture absolute inset-0 opacity-40" aria-hidden />

      {/* Animated glow blobs */}
      <div className="animate-glow-pulse pointer-events-none absolute left-1/2 top-24 h-[480px] w-[700px] -translate-x-1/2 rounded-full"
        style={{ background: "radial-gradient(ellipse, rgba(99,91,255,0.22) 0%, transparent 70%)" }}
        aria-hidden />
      <div className="animate-glow-pulse pointer-events-none absolute -right-24 top-48 h-72 w-72 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, rgba(0,212,177,0.3) 0%, transparent 70%)", animationDelay: "2s" }}
        aria-hidden />

      <div className="relative mx-auto max-w-5xl px-6 pb-12 pt-20 text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#635BFF]/30 bg-[#635BFF]/10 px-4 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00D4B1] shadow-sm shadow-[#00D4B1]" />
          <span className="text-xs font-medium text-[#00D4B1]">Now in public beta — schema versioning live</span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in-up mx-auto max-w-3xl text-4xl font-bold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-6xl">
          Build internal tools at the{" "}
          <span className="bg-gradient-to-r from-[#635BFF] to-[#00D4B1] bg-clip-text text-transparent">
            speed of thought.
          </span>
        </h1>

        {/* Sub-headline */}
        <p className="animate-fade-in-up mx-auto mt-6 max-w-xl text-base leading-relaxed text-[#8892A4] sm:text-lg"
          style={{ animationDelay: "0.1s" }}>
          OneAtlas generates, stores, and evolves your app schemas in real-time —
          from a single prompt.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in-up mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          style={{ animationDelay: "0.2s" }}>
          <Link href="/generate"
            className="rounded-xl bg-[#635BFF] px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-[#635BFF]/30 transition-all hover:bg-[#7a73ff] hover:shadow-[#635BFF]/50 active:scale-[0.97]">
            Start Building →
          </Link>
          <Link href="#templates"
            className="rounded-xl border border-white/20 px-7 py-3.5 text-sm font-semibold text-white/80 transition-all hover:border-white/40 hover:text-white">
            See Templates
          </Link>
        </div>

        {/* Trust badges */}
        <div className="animate-fade-in-up mt-8 flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}>
          {trustBadges.map((badge) => (
            <span key={badge.label}
              className="flex items-center gap-1.5 text-xs font-medium text-[#8892A4]">
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
