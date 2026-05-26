import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { TemplatesShowcase } from "@/components/home/TemplatesShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { templates } from "@/config/templates";

export default function HomePage() {
  return (
    <PageShell>
      <HeroSection />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />
      </div>

      <HowItWorksSection />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-teal/30 to-transparent" />
      </div>

      <TemplatesShowcase templates={templates} id="templates" />
      <PricingSection />
    </PageShell>
  );
}
