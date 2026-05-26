"use client";

import Link from "next/link";
import { useGeneratorStore } from "@/store/generatorStore";
import { SchemaPreview } from "@/components/builder/SchemaPreview";
import { AppBackground } from "@/components/layout/AppBackground";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  const stepsList = ["Matching template...", "Building schema...", "Finalizing app..."];
  const currentStepIndex = stepsList.indexOf(loadingStep);

  return (
    <AppBackground>
      <Navbar />
      <div className="mx-auto flex min-h-screen max-w-[720px] flex-col justify-center px-4 pb-16 pt-nav">
        <div className="z-10 flex flex-col gap-8 reveal">
          {status === "idle" && (
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="space-y-2">
                <Badge>AI Generator</Badge>
                <h1 className="text-3xl font-bold text-text-primary sm:text-4xl">
                  Generate your application
                </h1>
                <p className="mx-auto max-w-md text-text-secondary">
                  Describe your data schema and workflows in plain English. OneAtlas
                  matches templates and drafts the app structure in seconds.
                </p>
              </div>

              <Card hover={false} className="w-full">
                <CardContent className="flex flex-col gap-4 pt-6">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && prompt.trim().length >= 5) {
                        e.preventDefault();
                        generateApp();
                      }
                    }}
                    placeholder="Describe the internal tool you need... e.g. 'A CRM for tracking sales deals and customer contacts'"
                    rows={4}
                  />
                  <div className="flex flex-wrap gap-2">
                    {[
                      "A CRM with contacts and deal pipeline",
                      "HR dashboard for employee leave tracking",
                      "Inventory system with stock alerts",
                    ].map((example) => (
                      <button
                        key={example}
                        type="button"
                        onClick={() => setPrompt(example)}
                        className="rounded-full border border-surface-border bg-surface-bg px-3 py-1.5 text-left text-xs text-text-secondary transition-all hover:border-brand-primary/30 hover:text-brand-primary"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={generateApp} disabled={prompt.trim().length < 5}>
                      Generate App <ArrowRight size={16} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {status === "loading" && (
            <Card hover={false} className="flex min-h-[350px] flex-col items-center justify-center gap-8 p-12 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center">
                <div className="absolute inset-0 animate-pulse rounded-full border-4 border-brand-primary/20" />
                <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-brand-primary border-r-brand-primary" />
                <Sparkles className="text-brand-primary animate-bounce" size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">{loadingStep}</h3>
                <p className="text-xs text-text-secondary">Please wait...</p>
              </div>
              <div className="flex items-center gap-3">
                {stepsList.map((step, idx) => (
                  <div
                    key={step}
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      idx <= currentStepIndex ? "w-8 bg-brand-primary" : "w-2.5 bg-surface-border"
                    }`}
                  />
                ))}
              </div>
            </Card>
          )}

          {status === "success" && result && (
            <div className="flex w-full flex-col gap-6 animate-fade-in-up">
              <div className="flex flex-col items-center gap-3 text-center">
                <Badge variant="success">
                  {result.templateUsed} · {Math.round(result.confidence * 100)}% match
                </Badge>
                <input
                  type="text"
                  value={result.generatedName}
                  onChange={(e) => updateAppName(e.target.value)}
                  onBlur={(e) => renameAppOnServer(e.target.value)}
                  className="input-premium max-w-xl text-center text-2xl font-bold sm:text-3xl"
                  placeholder="App Name"
                />
                <span className="font-mono text-xs text-text-secondary">
                  {result.appId}
                </span>
              </div>
              <SchemaPreview schema={result.schema} />
              <Card hover={false}>
                <CardContent className="flex items-center justify-between py-4 text-sm">
                  <span className="text-text-secondary">
                    Entities: {result.schema.dataModel.entities.join(", ")}
                  </span>
                  <Badge variant="outline">
                    Primary: {result.schema.dataModel.primaryEntity}
                  </Badge>
                </CardContent>
              </Card>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
                <Button variant="secondary" onClick={reset}>
                  <RotateCcw size={16} /> Regenerate
                </Button>
                <Button asChild>
                  <Link href={`/builder/${result.appId}`}>
                    Open Builder <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>
          )}

          {status === "error" && (
            <Card hover={false} className="border-brand-accent/40 bg-brand-accent/10">
              <CardContent className="flex flex-col items-center gap-6 py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/25 text-[#1A1F36]">
                  <AlertCircle size={28} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-text-primary">Generation failed</h3>
                  <p className="max-w-md text-sm text-text-secondary">{error}</p>
                </div>
                {errorCode === "NO_TEMPLATE_MATCH" ? (
                  <Button onClick={reset}>Try a different prompt</Button>
                ) : (
                  <Button variant="destructive" onClick={generateApp}>
                    <RotateCcw size={16} /> Retry
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppBackground>
  );
}
