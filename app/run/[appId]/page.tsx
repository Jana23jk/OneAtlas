import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { jsonToAppSchema } from "@/lib/schema-json";
import { RuntimeShell } from "@/components/runtime/RuntimeShell";
import { RuntimeAppCanvas } from "@/components/runtime/RuntimeAppCanvas";
import { AppBackground } from "@/components/layout/AppBackground";
import { Search } from "lucide-react";
import type { AppSchema } from "@/types/app";

function RunNotFound() {
  return (
    <AppBackground className="flex min-h-screen items-center justify-center px-4 py-16">
      <div className="z-10 w-full max-w-md animate-fade-in-up">
        <div className="dashboard-card flex flex-col items-center gap-6 p-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(99,91,255,0.12)] text-[#635BFF]">
            <Search size={28} />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#1A1F36]">Application not found</h1>
            <p className="text-sm leading-relaxed text-[#667085]">
              The application you are trying to access does not exist or has been deleted.
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

export default async function RunPage({
  params,
}: {
  params: Promise<{ appId: string }>;
}) {
  const { appId } = await params;

  const appRecord = await prisma.app.findUnique({
    where: { id: appId },
    include: {
      template: true,
      runtimeSchema: true,
    },
  });

  if (!appRecord || !appRecord.runtimeSchema) {
    return <RunNotFound />;
  }

  const schema: AppSchema = jsonToAppSchema(appRecord.runtimeSchema.schema);
  const isInventory = appRecord.template.slug === "inventory-system";

  return (
    <RuntimeShell
      appName={appRecord.name}
      templateName={appRecord.template.name}
      templateSlug={appRecord.template.slug}
      version={appRecord.runtimeSchema.version}
      isInventory={isInventory}
    >
      <RuntimeAppCanvas schema={schema} isInventory={isInventory} />
    </RuntimeShell>
  );
}
