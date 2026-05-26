"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { AppBackground } from "@/components/layout/AppBackground";

export default function BuilderError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Builder workspace crash:", error);
  }, [error]);

  return (
    <AppBackground className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="z-10 w-full max-w-md animate-fade-in-up">
        <div className="dashboard-card flex flex-col items-center gap-6 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-accent/20 text-brand-accent">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1A1F36]">Something went wrong</h1>
            <p className="text-sm leading-relaxed text-[#667085]">
              The builder workspace encountered an unexpected error.
            </p>
          </div>
          <Button onClick={reset} className="w-full" aria-label="Retry loading workspace">
            <RotateCcw size={14} /> Retry Loading
          </Button>
        </div>
      </div>
    </AppBackground>
  );
}
