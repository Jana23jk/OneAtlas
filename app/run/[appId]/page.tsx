import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";
import { AppCanvas } from "@/components/builder/AppCanvas";
import { Search } from "lucide-react";
import type { AppSchema } from "@/types/app";

function RunNotFound() {
  return (
    <div className="min-h-screen bg-[#0A2540] flex flex-col items-center justify-center py-16 px-4 text-center hero-texture">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#635BFF]/10 rounded-full blur-[120px] pointer-events-none animate-glow-pulse" />

      <div className="z-10 max-w-md w-full glass bg-[#1a1f36]/40 border border-white/[0.08] p-8 rounded-xl flex flex-col items-center gap-6 shadow-xl">
        <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-white/60">
          <Search size={24} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">🔍 Application not found</h1>
          <p className="text-sm text-[#8892A4] leading-relaxed">
            The application you are trying to access does not exist or has been deleted.
          </p>
        </div>
        <Link
          href="/generate"
          className="w-full bg-[#635BFF] hover:bg-[#7a73ff] text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 font-semibold shadow-lg shadow-[#635BFF]/25 transition-all text-sm cursor-pointer"
        >
          Create your own app →
        </Link>
      </div>
    </div>
  );
}

export default async function RunPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  // 1. Fetch current live application details and its runtime schema
  const appRecord = await prisma.app.findUnique({
    where: { id: appId },
    include: {
      template: true,
      runtimeSchema: true,
    },
  });

  // 2. Render not found page if missing
  if (!appRecord || !appRecord.runtimeSchema) {
    return <RunNotFound />;
  }

  const schema: AppSchema = jsonToAppSchema(appRecord.runtimeSchema.schema);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#0A2540] text-white">
      {/* Top Banner */}
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 h-16 bg-[#071D33] border-l-4 border-l-[#00D4B1] border-b border-white/[0.08] px-6 flex items-center justify-between z-30 shrink-0"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#00D4B1] animate-pulse" />
            <span>{appRecord.name}</span>
          </span>
          <span className="hidden sm:inline text-white/30">|</span>
          <span className="text-white/50 text-xs">
            Live Runtime · v{appRecord.runtimeSchema.version} · Based on {appRecord.template.name}
          </span>
        </div>
        <Link
          href={`/builder/${appId}`}
          className="rounded-lg border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 transition-all hover:bg-white/10 hover:text-white"
        >
          Open in Builder →
        </Link>
      </header>

      {/* Main viewport canvas */}
      <main className="flex-1 overflow-hidden pt-16 flex flex-col bg-[#0A2540]">
        <AppCanvas schema={schema} readOnly={true} />
      </main>
    </div>
  );
}
