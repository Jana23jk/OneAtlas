import Link from "next/link";
import { Clock } from "lucide-react";
import { AppBackground } from "@/components/layout/AppBackground";

export function PreviewExpired() {
  return (
    <AppBackground className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="z-10 w-full max-w-md animate-fade-in-up">
        <div className="dashboard-card flex flex-col items-center gap-6 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(255,89,150,0.12)] text-[#FF5996]">
            <Clock size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#0A2540]">Preview expired</h1>
            <p className="text-sm leading-relaxed text-[#667085]">
              This preview link has expired or been revoked. Generate a new preview from the
              builder.
            </p>
          </div>
          <Link href="/generate" className="btn-deploy-primary w-full">
            Create your own app
          </Link>
        </div>
      </div>
    </AppBackground>
  );
}

export default PreviewExpired;
