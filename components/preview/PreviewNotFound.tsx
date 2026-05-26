import Link from "next/link";
import { Search } from "lucide-react";
import { AppBackground } from "@/components/layout/AppBackground";

export function PreviewNotFound() {
  return (
    <AppBackground className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="z-10 w-full max-w-md animate-fade-in-up">
        <div className="dashboard-card flex flex-col items-center gap-6 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(99, 91, 255,0.1)] text-[#635BFF]">
            <Search size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1A1F36]">Preview not found</h1>
            <p className="text-sm leading-relaxed text-[#667085]">
              This preview link is invalid or has been removed.
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

export default PreviewNotFound;
