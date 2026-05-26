"use client";

import Link from "next/link";
import { useGeneratorStore } from "@/store/generatorStore";
import { SchemaPreview } from "@/components/builder/SchemaPreview";
import { Button } from "@/components/ui/button";
import { ArrowRight, RotateCcw, AlertCircle, Sparkles } from "lucide-react";

export default function GeneratePage() {
  const {
    prompt,
    status,
    loadingStep,
    result,
    error,
    errorCode,
    setPrompt,
    updateAppName,
    renameAppOnServer,
    generateApp,
    reset,
  } = useGeneratorStore();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleExampleClick = (text: string) => {
    setPrompt(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && prompt.trim().length >= 5) {
      e.preventDefault();
      generateApp();
    }
  };

  const stepsList = ["Matching template...", "Building schema...", "Finalizing app..."];
  const currentStepIndex = stepsList.indexOf(loadingStep);

  return (
    <div className="min-h-screen bg-[#0A2540] relative overflow-hidden flex flex-col items-center justify-center py-16 px-4 hero-texture">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#635BFF]/10 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" />
      <div
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#00D4B1]/10 rounded-full blur-[120px] pointer-events-none animate-glow-pulse"
        style={{ animationDelay: "-2s" }}
      />

      <div className="w-full max-w-[720px] z-10 flex flex-col gap-8 animate-fade-in-up">
        {/* IDLE STATE */}
        {status === "idle" && (
          <div className="flex flex-col items-center text-center gap-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <svg width="48" height="48" viewBox="0 0 28 28" fill="none">
                <path
                  d="M14 2L25.26 8.5V21.5L14 28L2.74 21.5V8.5L14 2Z"
                  stroke="#635BFF"
                  strokeWidth="1.5"
                  fill="none"
                />
                <circle cx="14" cy="14" r="5" stroke="#00D4B1" strokeWidth="1.5" fill="none" />
                <circle cx="14" cy="14" r="2" fill="#635BFF" />
              </svg>
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                One<span className="text-[#635BFF]">Atlas</span>
              </h1>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-white">Generate Your Application</h2>
              <p className="text-[#8892A4] max-w-md mx-auto">
                Describe your data schema and workflows in plain English. OneAtlas matches templates and drafts the app structure in seconds.
              </p>
            </div>

            {/* Input card */}
            <div className="w-full glass bg-[#1a1f36]/40 border border-white/[0.08] p-6 rounded-xl flex flex-col gap-4 shadow-xl">
              <textarea
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyPress}
                placeholder="Describe the internal tool you need... e.g. 'A CRM for tracking sales deals and customer contacts'"
                rows={4}
                className="w-full bg-white/[0.02] border border-white/10 rounded-lg p-4 text-white placeholder-white/30 text-base focus:border-[#635BFF] focus:ring-1 focus:ring-[#635BFF] outline-none transition-all resize-none"
              />

              {/* Example prompt chips */}
              <div className="flex flex-col gap-2 items-start">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#8892A4]">
                  Examples:
                </span>
                <div className="flex flex-wrap gap-2 w-full">
                  {[
                    "A CRM with contacts and deal pipeline",
                    "HR dashboard for employee leave tracking",
                    "Inventory system with stock alerts",
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      className="text-xs text-white/70 bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 px-3 py-1.5 rounded-full transition-all text-left"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <div className="flex justify-end mt-2">
                <Button
                  onClick={generateApp}
                  disabled={prompt.trim().length < 5}
                  className="bg-[#635BFF] hover:bg-[#7a73ff] text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-semibold shadow-lg shadow-[#635BFF]/20 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  Generate App <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {status === "loading" && (
          <div className="glass bg-[#1a1f36]/40 border border-white/[0.08] p-12 rounded-xl flex flex-col items-center justify-center text-center gap-8 shadow-xl min-h-[350px]">
            {/* Pulsing Spinner */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#635BFF]/20 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-4 border-t-[#635BFF] border-r-[#00D4B1] animate-spin" />
              <Sparkles className="text-[#635BFF] animate-bounce" size={24} />
            </div>

            {/* Current step text */}
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white transition-all duration-300">
                {loadingStep}
              </h3>
              <p className="text-xs text-[#8892A4]">Please wait, this will take just a moment...</p>
            </div>

            {/* Progress indicators */}
            <div className="flex items-center gap-3">
              {stepsList.map((step, idx) => (
                <div
                  key={step}
                  className={`h-2.5 rounded-full transition-all duration-500 ${
                    idx <= currentStepIndex ? "w-8 bg-[#635BFF]" : "w-2.5 bg-white/10"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {status === "success" && result && (
          <div className="flex flex-col gap-6 w-full animate-fade-in-up">
            {/* Header section with template info */}
            <div className="flex flex-col items-center text-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00D4B1]/20 bg-[#00D4B1]/5 px-3 py-1 text-xs font-semibold text-[#00D4B1]">
                Generated from {result.templateUsed} · Confidence: {Math.round(result.confidence * 100)}%
              </div>

              {/* Inline editable app name */}
              <div className="w-full flex flex-col items-center">
                <input
                  type="text"
                  value={result.generatedName}
                  onChange={(e) => updateAppName(e.target.value)}
                  onBlur={(e) => renameAppOnServer(e.target.value)}
                  className="text-2xl sm:text-3xl font-bold text-white text-center bg-transparent border-b-2 border-dashed border-white/15 focus:border-[#635BFF] focus:bg-white/5 px-2 py-0.5 rounded outline-none transition-all w-full max-w-xl text-ellipsis"
                  placeholder="App Name"
                  title="Click to rename"
                />
                <span className="text-xs text-white/40 mt-1 font-mono">App ID: {result.appId}</span>
              </div>
            </div>

            {/* Schema Preview Panel */}
            <SchemaPreview schema={result.schema} />

            {/* Data Model Summary */}
            <div className="glass bg-[#1a1f36]/40 border border-white/[0.08] p-4 rounded-xl flex items-center justify-between text-sm text-white/70">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Data Model:</span>
                <span className="text-white/60">
                  Entities: {result.schema.dataModel.entities.join(", ")}
                </span>
              </div>
              <div className="text-xs rounded bg-white/5 border border-white/10 px-2 py-1 text-white/50">
                Primary: <strong className="text-white/70">{result.schema.dataModel.primaryEntity}</strong>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mt-4">
              <button
                onClick={reset}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg border border-white/20 px-6 py-2.5 text-sm font-medium text-white/80 transition-all hover:border-white/40 hover:text-white cursor-pointer"
              >
                <RotateCcw size={16} /> Regenerate
              </button>
              <Link
                href={`/builder/${result.appId}`}
                className="w-full sm:w-auto bg-[#635BFF] hover:bg-[#7a73ff] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#635BFF]/25 transition-all cursor-pointer"
              >
                Open Builder <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* ERROR STATE */}
        {status === "error" && (
          <div className="glass bg-red-950/20 border border-red-500/20 p-8 rounded-xl flex flex-col items-center justify-center text-center gap-6 shadow-xl">
            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500">
              <AlertCircle size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Generation Failed</h3>
              <p className="text-sm text-red-200/70 max-w-md mx-auto">{error}</p>
            </div>

            {errorCode === "NO_TEMPLATE_MATCH" ? (
              <div className="space-y-4 w-full">
                <Button
                  onClick={reset}
                  className="bg-[#635BFF] hover:bg-[#7a73ff] text-white px-6 py-2 rounded-lg font-medium shadow transition-all"
                >
                  Try a different prompt
                </Button>
              </div>
            ) : (
              <Button
                onClick={generateApp}
                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg font-medium shadow transition-all flex items-center gap-2"
              >
                <RotateCcw size={16} /> Retry
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
