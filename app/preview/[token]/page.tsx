import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";
import { AppCanvas } from "@/components/builder/AppCanvas";
import { PreviewNotFound } from "@/components/preview/PreviewNotFound";
import { PreviewExpired } from "@/components/preview/PreviewExpired";
import type { AppSchema } from "@/types/app";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  // 1. Fetch preview snapshot directly using Prisma
  const snapshot = await prisma.previewSnapshot.findUnique({
    where: { token },
    include: {
      app: {
        include: {
          template: true,
        },
      },
    },
  });

  // 2. Custom 404 if not found
  if (!snapshot) {
    return <PreviewNotFound />;
  }

  // 3. Custom 410 if expired or revoked
  const isExpired = snapshot.expiresAt && new Date(snapshot.expiresAt) < new Date();
  const isRevoked = snapshot.revokedAt !== null;

  if (isExpired || isRevoked) {
    return <PreviewExpired />;
  }

  const schema: AppSchema = jsonToAppSchema(snapshot.schema);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0A2540] text-white">
      {/* Top Banner */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 h-16 bg-[#1A1F36] border-l-4 border-l-[#635BFF] border-b border-white/[0.08] px-6 flex items-center justify-between z-30 shrink-0 animate-fade-in-up"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
          <span className="font-semibold text-white flex items-center gap-1.5">
            <span>👁</span> This is a preview — {snapshot.app.name}
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="text-white/60 text-xs">
            Generated from {snapshot.app.template.name} · Snapshot v{schema.version} · Created{" "}
            {new Date(snapshot.createdAt).toLocaleDateString()}
          </span>
        </div>
        <Link
          href="/generate"
          className="rounded-lg bg-[#635BFF] px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-[#635BFF]/25 transition-all hover:bg-[#7a73ff] shrink-0"
        >
          Create your own →
        </Link>
      </header>

      {/* Main viewport canvas */}
      <main className="flex-1 overflow-hidden pt-16 flex flex-col bg-[#0A2540]">
        <AppCanvas schema={schema} readOnly={true} />
      </main>
    </div>
  );
}
