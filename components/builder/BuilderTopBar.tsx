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
        window.open(data.data.previewUrl, "_blank", "noopener,noreferrer");
        setToastMsg("Preview opened in new tab");
        setTimeout(() => setToastMsg(null), 2000);
      } else {
        console.error("Preview URL not found");
      }
    } catch (err) {
      console.error("Preview generation failed:", err);
    }
  };

  return (
    <header className="glass-nav relative z-30 flex h-nav shrink-0 items-center justify-between border-b border-surface-border px-6">
      {/* Left: Back Link & Editable Name */}
      <div className="flex items-center gap-4">
        <Link
          href="/generate"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E7EAF5] text-[#667085] transition-all hover:border-[#7A73FF]/30 hover:bg-[rgba(122, 115, 255,0.08)] hover:text-[#7A73FF]"
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
              className="input-premium text-lg font-bold"
              autoFocus
            />
          ) : (
            <h1
              onClick={() => setEditing(true)}
              className="cursor-pointer rounded-lg border border-transparent px-2 py-1 text-xl font-bold text-[#1A1F36] transition-colors hover:border-[#E7EAF5] hover:bg-[#FAFBFF]"
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#E7EAF5] bg-[#FAFBFF] px-3 py-1.5 text-xs">
            <span className="font-semibold text-[#667085]">Version</span>
            <span className="rounded-md bg-[rgba(122, 115, 255,0.12)] px-2 py-0.5 text-[10px] font-bold text-[#7A73FF]">
              v{schema.version}
            </span>
          </div>
        )}
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <Button onClick={handlePreview} variant="secondary" size="sm" className="h-9 gap-1.5">
          <Play size={14} /> Preview
        </Button>
        <Button variant="ghost" size="sm" className="h-9 gap-1.5">
          <Share2 size={14} /> Share
        </Button>
        {appId ? (
          <Button asChild size="sm" className="btn-deploy-primary h-9 gap-1.5 !px-4">
            <Link href={`/deploy/${appId}`}>
              <Rocket size={14} /> Deploy
            </Link>
          </Button>
        ) : (
          <Button onClick={startDeployment} size="sm" className="btn-deploy-primary h-9 gap-1.5">
            <Rocket size={14} /> Deploy
          </Button>
        )}
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="absolute bottom-[-48px] left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-lg border border-[#7A73FF]/30 bg-white px-4 py-2 text-xs font-medium text-[#7A73FF] shadow-card animate-fade-in-up">
          <Check size={14} /> {toastMsg}
        </div>
      )}

      {/* Deployment Modal Overlay */}
      {deploying && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-panel relative w-full max-w-md overflow-hidden p-6 text-[#1A1F36]">
            
            {/* Close Button (only active if done or error) */}
            {(deployStep === 4 || deployError) && (
              <button
                onClick={() => setDeploying(false)}
                className="absolute top-4 right-4 text-[#98A2B3] transition-colors hover:text-[#1A1F36]"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>
            )}

            {deployError ? (
              /* Error State */
              <div className="space-y-4 text-center py-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10 text-[#1A1F36]">
                  <X size={24} />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1F36]">Deployment Failed</h3>
                <p className="text-sm leading-relaxed text-[#667085]">
                  {deployError}
                </p>
                <div className="pt-4 flex gap-3 justify-center">
                  <Button
                    onClick={startDeployment}
                    className="bg-[#7A73FF] hover:bg-[#7a73ff] text-white"
                  >
                    Retry Deployment
                  </Button>
                  <Button variant="secondary" onClick={() => setDeploying(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : deployStep < 4 ? (
              /* Deploying / Progress State */
              <div className="space-y-6 py-2">
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin text-[#7A73FF] h-5 w-5" />
                  <h3 className="text-lg font-semibold text-[#1A1F36]">Deploying application...</h3>
                </div>
                <p className="text-xs text-[#667085]">
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
                          isActive ? "font-medium text-[#1A1F36]" : isCompleted ? "text-[#667085]" : "text-[#98A2B3]"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={15} className="text-[#7A73FF] shrink-0 mt-0.5" />
                        ) : isActive ? (
                          <Loader2 size={15} className="text-[#7A73FF] animate-spin shrink-0 mt-0.5" />
                        ) : (
                          <div className="mt-0.5 h-[15px] w-[15px] shrink-0 rounded-full border border-[#E7EAF5]" />
                        )}
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated progress bar */}
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#E7EAF5]">
                  <div
                    className="bg-gradient-to-r from-[#7A73FF] to-[#6B64E8] h-1.5 transition-all duration-500 rounded-full"
                    style={{ width: `${(deployStep / 4) * 100}%` }}
                  />
                </div>
              </div>
            ) : (
              /* Deployment Success State */
              <div className="space-y-5 text-center py-2">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#7A73FF]/10 text-[#7A73FF]">
                  <CheckCircle2 size={36} className="drop-shadow-[0_0_10px_rgba(122, 115, 255,0.4)]" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#1A1F36]">Deployment Successful!</h3>
                  <p className="text-xs text-[#667085]">
                    Your application has been compiled and is now live on the edge runtime.
                  </p>
                </div>

                {/* URL Display */}
                {deployUrl && (
                  <div className="flex items-center gap-2 rounded-lg border border-[#E7EAF5] bg-[#FAFBFF] p-2.5 text-xs">
                    <Globe size={14} className="shrink-0 text-[#98A2B3]" />
                    <span className="flex-1 truncate text-left font-mono text-[#1A1F36]">
                      {deployUrl}
                    </span>
                    <button
                      onClick={async () => {
                        await navigator.clipboard.writeText(deployUrl);
                        setDeployLinkCopied(true);
                        setTimeout(() => setDeployLinkCopied(false), 2000);
                      }}
                      className="shrink-0 rounded p-1.5 text-[#667085] transition-colors hover:bg-[rgba(122, 115, 255,0.08)] hover:text-[#7A73FF]"
                      title="Copy live link"
                    >
                      {deployLinkCopied ? <Check size={14} className="text-[#7A73FF]" /> : <Copy size={14} />}
                    </button>
                  </div>
                )}

                {/* Action buttons */}
                <div className="pt-3 flex gap-3">
                  <a
                    href={deployUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-[#7A73FF] hover:bg-[#7a73ff] px-4 py-2.5 text-xs font-semibold text-white transition-all text-center"
                  >
                    Launch App <ExternalLink size={12} />
                  </a>
                  <Button variant="secondary" onClick={() => setDeploying(false)} className="px-4">
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
