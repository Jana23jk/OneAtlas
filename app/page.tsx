import { Navbar }             from "@/components/layout/Navbar";
import { HeroSection }         from "@/components/home/HeroSection";
import { HowItWorksSection }   from "@/components/home/HowItWorksSection";
import { TemplatesShowcase }   from "@/components/home/TemplatesShowcase";
import { PricingSection }      from "@/components/home/PricingSection";
import { Footer }              from "@/components/home/Footer";
import { templates }           from "@/config/templates";

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#0A2540" }}>
      <Navbar />

      <main>
        <HeroSection />

        {/* Divider glow */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="h-px w-full"
            style={{ background: "linear-gradient(to right, transparent, rgba(99,91,255,0.4), transparent)" }} />
        </div>

        <HowItWorksSection />

        {/* Divider glow */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="h-px w-full"
            style={{ background: "linear-gradient(to right, transparent, rgba(0,212,177,0.3), transparent)" }} />
        </div>

        <TemplatesShowcase templates={templates} />

        {/* Divider glow */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="h-px w-full"
            style={{ background: "linear-gradient(to right, transparent, rgba(99,91,255,0.3), transparent)" }} />
        </div>

        <PricingSection />
      </main>

      <Footer />
    </div>
  );
}
