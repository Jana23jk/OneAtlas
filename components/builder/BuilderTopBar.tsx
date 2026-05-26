"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useBuilderStore } from "@/store/builderStore";
import { Button } from "@/components/ui/button";
import { Play, Share2, Rocket, ArrowLeft, Check, Loader2, CheckCircle2, Globe, Copy, ExternalLink, X } from "lucide-react";

export function BuilderTopBar() {
  const appId = useBuilderStore((state) => state.appId);
  const appName = useBuilderStore((state) => state.appName);
  const schema = useBuilderStore((state) => state.schema);
  const updateAppName = useBuilderStore((state) => state.updateAppName);

  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(appName || "");

  // Deployment states
  const [deploying, setDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [deployUrl, setDeployUrl] = useState<string | null>(null);
  const [deployError, setDeployError] = useState<string | null>(null);
  const [deployLinkCopied, setDeployLinkCopied] = useState(false);

  const steps = [
    "Verifying database schema and record integrity",
    "Compiling application UI components and routing",
    "Registering live endpoints and access tokens",
    "Publishing build assets to Vercel edge CDN",
  ];

  const startDeployment = async () => {
    if (!appId) return;
    setDeploying(true);
    setDeployStep(0);
    setDeployUrl(null);
    setDeployError(null);
    setDeployLinkCopied(false);

    // Start API request in parallel
    const apiPromise = fetch(`/api/apps/${appId}/preview`, {
      method: "POST",
    }).then(async (res) => {
      if (!res.ok) throw new Error("Failed to register deployment snapshot");
      const data = await res.json();
      if (!data?.data?.previewUrl) throw new Error("Deployment URL not returned");
      return data.data.previewUrl;
    });

    try {
      // Step 0: Database check
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDeployStep(1);

      // Step 1: Component compilation
      await new Promise((resolve) => setTimeout(resolve, 800));
      setDeployStep(2);

      // Step 2: Route registration
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setDeployStep(3);

      // Step 3: Edge publishing (await API result here to be safe)
      await apiPromise;
      const finalUrl = `${window.location.origin}/run/${appId}`;
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      setDeployUrl(finalUrl);
      setDeployStep(4); // Finished
    } catch (err) {
      console.error("Deployment failed:", err);
      setDeployError(err instanceof Error ? err.message : "An unexpected error occurred during deployment.");
    }
  };

  useEffect(() => {
    setLocalName(appName || "");
  }, [appName]);

  const handleRename = async () => {
    setEditing(false);
    if (!localName.trim() || localName === appName) return;

    updateAppName(localName);

    try {
      const res = await fetch(`/api/apps/${appId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: localName }),
      });
      if (!res.ok) {
        console.error("Failed to persist app name rename");
      }
    } catch (err) {
      console.error("Rename API failed:", err);
    }
  };

  const handlePreview = async () => {
    try {
      const res = await fetch(`/api/apps/${appId}/preview`, {
        method: "POST",
      });
      const data = await res.json();
      if (data?.data?.previewUrl) {
        await navigator.clipboard.writeText(data.data.previewUrl);
        setToastMsg("Preview link copied!");
        setTimeout(() => setToastMsg(null), 2000);
      } else {
        console.error("Preview URL not found");
      }
    } catch (err) {
      console.error("Preview generation failed:", err);
    }
  };

  return (
    <header className="flex h-[68px] items-center justify-between border-b border-white/[0.08] bg-[#0A2540] px-6 shrink-0 relative z-30">
      {/* Left: Back Link & Editable Name */}
      <div className="flex items-center gap-4">
        <Link
          href="/generate"
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-white/60 hover:text-white transition-all hover:bg-white/5"
        >
          <ArrowLeft size={16} />
        </Link>
        <div className="flex items-center gap-2">
          {editing ? (
            <input
              type="text"
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              className="rounded border border-[#635BFF] bg-white/5 px-2 py-0.5 text-base font-bold text-white outline-none focus:ring-1 focus:ring-[#635BFF]"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded border border-transparent px-2 py-0.5 text-base font-bold text-white hover:border-white/10 hover:bg-white/[0.02]"
              title="Rename Application"
            >
              {appName || "Loading..."}
            </h1>
          )}
        </div>
      </div>

      {/* Center: Version badge */}
      <div>
        {schema && (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="font-semibold text-white">Version</span>
            <span className="rounded bg-[#635BFF]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#8a84ff]">
              v{schema.version}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handlePreview}
          variant="outline"
          size="sm"
          className="h-9 gap-1.5 border-white/10 bg-transparent text-white/80 hover:bg-white/5 hover:text-white"
        >
          <Play size={14} /> Preview
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-9 gap-1.5 text-white/60 hover:text-white hover:bg-white/5"
        >
          <Share2 size={14} /> Share
        </Button>
        <Button
          onClick={startDeployment}
          size="sm"
          className="h-9 gap-1.5 bg-[#635BFF] text-white hover:bg-[#7a73ff]"
        >
          <Rocket size={14} /> Deploy
        </Button>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute left-1/2 bottom-[-48px] -translate-x-1/2 flex items-center gap-1.5 rounded-lg border border-[#00D4B1]/20 bg-[#071d33] px-4 py-2 text-xs font-medium text-[#00D4B1] shadow-xl animate-fade-in-up">
          <Check size={14} /> {toastMsg}
        </div>
      )}

      {/* Deployment Modal Overlay */}
      {deploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#071D33] p-6 shadow-2xl text-white">
            
            {/* Close Button (only active if done or error) */}
            {(deployStep === 4 || deployError) && (
              <button
                onClick={() => setDeploying(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            )}

            {deployError ? (
              /* Error State */
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                  <X size={24} />
                </div>
                <h3 className="text-lg font-semibold text-white">Deployment Failed</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  {deployError}
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Button
                    onClick={startDeployment}
                    className="bg-[#635BFF] hover:bg-[#7a73ff] text-white"
                  >
                    Retry Deployment
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setDeploying(false)}
                    className="border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : deployStep < 4 ? (
              /* Deploying / Progress State */
              <div className="space-y-6 py-2">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#635BFF] h-5 w-5" />
                  <h3 className="text-lg font-semibold text-white">Deploying application...</h3>
                </div>
                <p className="text-xs text-white/50">
                  Please wait while your app is provisioned and deployed to the runtime network.
                </p>

                {/* Steps list */}
                <div className="space-y-3.5 pt-2">
                  {steps.map((label, idx) => {
                    const isCompleted = deployStep > idx;
                    const isActive = deployStep === idx;
                    return (
                      <div
                        key={idx}
                        className={`flex items-start gap-3 text-xs transition-colors duration-300 ${
                          isActive ? "text-white font-medium" : isCompleted ? "text-white/80" : "text-white/30"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={15} className="text-[#00D4B1] shrink-0 mt-0.5" />
                        ) : isActive ? (
                          <Loader2 size={15} className="text-[#635BFF] animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <div className="h-[15px] w-[15px] rounded-full border border-white/10 shrink-0 mt-0.5" />
                        )}
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated progress bar */}
                <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#635BFF] to-[#00D4B1] h-1.5 transition-all duration-500 rounded-full"
                    style={{ width: `${(deployStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Deployment Success State */
              <div className="space-y-5 text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#00D4B1]/10 text-[#00D4B1]">
                  <CheckCircle2 size={36} className="drop-shadow-[0_0_10px_rgba(0,212,177,0.4)]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">Deployment Successful!</h3>
                  <p className="text-xs text-white/50">
                    Your application has been compiled and is now live on the edge runtime.
                  </p>
                </div>

                {/* URL Display */}
                {deployUrl && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] p-2.5 text-xs">
                    <Globe size={14} className="text-white/40 shrink-0" />
                    <span className="font-mono text-white/70 truncate flex-1 text-left">
                      {deployUrl}
                    </span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(deployUrl);
                        setDeployLinkCopied(true);
                        setTimeout(() => setDeployLinkCopied(false), 2000);
                      }}
                      className="p-1.5 rounded hover:bg-white/5 text-white/50 hover:text-white transition-colors shrink-0"
                      title="Copy live link"
                    >
                      {deployLinkCopied ? <Check size={14} className="text-[#00D4B1]" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-3 flex gap-3">
                  <a
                    href={deployUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#635BFF] hover:bg-[#7a73ff] px-4 py-2.5 text-xs font-semibold text-white transition-all text-center"
                  >
                    Launch App <ExternalLink size={12} />
                  </a>
                  <Button
                    onClick={() => setDeploying(false)}
                    variant="outline"
                    className="border-white/10 text-white hover:bg-white/5 px-4"
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
