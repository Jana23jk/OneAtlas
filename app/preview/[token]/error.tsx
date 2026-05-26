"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function PreviewError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error("Preview page crash:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center py-16 px-4 text-center hero-texture">
      <div className="z-10 max-w-md w-full glass bg-red-950/20 border border-red-500/20 p-8 rounded-xl flex flex-col items-center gap-6 shadow-xl">
        <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">Preview load error</h1>
          <p className="text-sm text-red-200/60 leading-relaxed">Failed to render the app preview.</p>
        </div>
        <Button
          onClick={reset}
          className="w-full bg-[#635BFF] hover:bg-[#7a73ff] text-white flex items-center justify-center gap-2 font-semibold"
          aria-label="Retry rendering preview"
        >
          <RotateCcw size={14} /> Reload Preview
        </Button>
      </div>
    </div>
  );
}
