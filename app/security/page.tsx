import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import { Shield, Lock, Eye, CheckCircle2 } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-28 space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 rounded-full bg-[#00D4B1]/10 flex items-center justify-center text-[#00D4B1] border border-[#00D4B1]/20">
            <Shield size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Security & Compliance</h1>
            <p className="text-white/60 text-base max-w-lg mx-auto">
              How OneAtlas secures your generated applications, schema snapshots, and metadata infrastructure.
            </p>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="grid gap-6 md:grid-cols-2 pt-6">
          <div className="card p-6 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-[#635BFF]/10 flex items-center justify-center text-[#8a84ff]">
              <Lock size={18} />
            </div>
            <h3 className="font-semibold text-white">Isolated Runtimes</h3>
            <p className="text-sm text-[#8892A4] leading-relaxed">
              Every sandbox app execution and schema change is verified against isolated relational constraints to guarantee secure boundaries.
            </p>
          </div>

          <div className="card p-6 space-y-3">
            <div className="h-8 w-8 rounded-lg bg-[#00D4B1]/10 flex items-center justify-center text-[#00D4B1]">
              <Eye size={18} />
            </div>
            <h3 className="font-semibold text-white">Frozen Snapshots</h3>
            <p className="text-sm text-[#8892A4] leading-relaxed">
              Public preview tokens use cryptographically signed, immutable snapshot schemas. Changes to apps do not alter existing tokens.
            </p>
          </div>
        </div>

        {/* Verification Checkmark list */}
        <div className="card p-8 space-y-4">
          <h3 className="font-semibold text-white text-base">Platform Standards</h3>
          <ul className="grid gap-3 sm:grid-cols-2 text-sm text-white/70">
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00D4B1]" />
              <span>TLS 1.3 Encryption transit</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00D4B1]" />
              <span>Row-level org segregation</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00D4B1]" />
              <span>Complete mutation auditing</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-[#00D4B1]" />
              <span>SOC2 Compliant database hosts</span>
            </li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}
