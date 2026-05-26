import { Navbar }             from "@/components/layout/Navbar";
import { HeroSection }         from "@/components/home/HeroSection";
import { HowItWorksSection }   from "@/components/home/HowItWorksSection";
import { TemplatesShowcase }   from "@/components/home/TemplatesShowcase";
import { Footer }              from "@/components/home/Footer";
import { templates }           from "@/config/templates";

export default function HomePage() {
  return (
    <div 
      className="min-h-screen text-[#0A2540] relative overflow-hidden" 
      style={{ background: "linear-gradient(180deg, #F7F8FF 0%, #FFFFFF 100%)" }}
    >
      {/* Light Grid Pattern Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(99, 91, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(99, 91, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px"
        }}
        aria-hidden="true"
      />

      {/* Radial Glows */}
      {/* Purple glow */}
      <div 
        className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(99, 91, 255, 0.12) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
        aria-hidden="true"
      />
      {/* Pink glow */}
      <div 
        className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none opacity-80"
        style={{
          background: "radial-gradient(circle, rgba(255, 89, 150, 0.08) 0%, transparent 70%)",
          filter: "blur(40px)"
        }}
        aria-hidden="true"
      />

      <Navbar light={true} />

      <main className="relative z-10">
        <HeroSection />

        {/* Divider glow */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#635BFF]/10 to-transparent" />
        </div>

        <HowItWorksSection />

        {/* Divider glow */}
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00D4B1]/20 to-transparent" />
        </div>

        <TemplatesShowcase templates={templates} />
      </main>

      <Footer light={true} />
    </div>
  );
}
