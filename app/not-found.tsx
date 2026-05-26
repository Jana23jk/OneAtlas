import Link from "next/link";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center py-16 px-4 text-center hero-texture">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#635BFF]/10 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" />

      <div className="z-10 max-w-md w-full glass bg-[#1a1f36]/40 border border-white/[0.08] p-8 rounded-xl flex flex-col items-center gap-6 shadow-xl">
        <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/50 border border-white/10">
          <AlertTriangle size={28} />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#00D4B1] block">
            404
          </span>
          <h1 className="text-xl font-bold text-white">Page Not Found</h1>
          <p className="text-sm text-[#8892A4] leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <Link
          href="/"
          className="w-full bg-[#635BFF] hover:bg-[#7a73ff] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#635BFF]/25 transition-all text-sm cursor-pointer"
        >
          <Home size={16} /> Back to Homepage
        </Link>
      </div>
    </div>
  );
}
