import { Suspense } from "react";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/home/Footer";
import TemplatesClient from "./TemplatesClient";

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-28 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Templates</h1>
          <p className="text-white/60 text-base max-w-xl">
            Operational app systems for every team. Get started with pre-designed data schemas, charts, and metrics.
          </p>
        </div>

        {/* Client side filtered template grid */}
        <Suspense
          fallback={
            <div className="flex h-40 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-t-[#635BFF] border-white/20" />
            </div>
          }
        >
          <TemplatesClient />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
