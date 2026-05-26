import type { AppSchema } from "@/types/app";

interface SchemaPreviewProps {
  schema: AppSchema;
}

const componentTypeColors: Record<string, { bg: string; text: string; border: string }> = {
  table: { bg: "bg-teal-500/10", text: "text-[#00D4B1]", border: "border-teal-500/20" },
  chart: { bg: "bg-pink-500/10", text: "text-[#FF5996]", border: "border-pink-500/20" },
  form: { bg: "bg-[#635BFF]/10", text: "text-[#8a84ff]", border: "border-[#635BFF]/20" },
  metric: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  card: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  list: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
};

const fieldTypeColors: Record<string, { bg: string }> = {
  text: { bg: "bg-white/5 text-white/70" },
  number: { bg: "bg-amber-500/10 text-amber-300" },
  date: { bg: "bg-blue-500/10 text-blue-300" },
  boolean: { bg: "bg-emerald-500/10 text-emerald-300" },
  select: { bg: "bg-purple-500/10 text-purple-300" },
  relation: { bg: "bg-pink-500/10 text-pink-300" },
};

export function SchemaPreview({ schema }: SchemaPreviewProps) {
  // Sort components by order ascending
  const sortedComponents = [...schema.components].sort((a, b) => a.order - b.order);

  return (
    <div className="glass overflow-hidden rounded-xl border border-white/[0.08] bg-[#0d1b2e]/60 p-6 shadow-2xl">
      <div className="mb-6 flex items-center justify-between border-b border-white/[0.08] pb-4">
        <div>
          <h3 className="text-lg font-semibold text-white">App Structure</h3>
          <p className="text-xs text-white/50">Interactive schema representation</p>
        </div>
        <div className="rounded-full bg-[#635BFF]/10 px-3 py-1 text-xs font-medium text-[#8a84ff]">
          v{schema.version}
        </div>
      </div>

      <div className="space-y-4">
        {sortedComponents.map((component) => {
          const typeStyle = componentTypeColors[component.type] || {
            bg: "bg-white/5",
            text: "text-white/80",
            border: "border-white/10",
          };

          return (
            <div
              key={component.id}
              className="group relative rounded-lg border border-white/[0.05] bg-white/[0.02] p-4 transition-all duration-300 hover:border-white/[0.1] hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-white transition-colors group-hover:text-[#8a84ff]">
                    {component.name}
                  </h4>
                  <span className="text-[10px] font-mono text-white/40">{component.id}</span>
                </div>
                <span
                  className={`rounded border px-2 py-0.5 text-xs font-semibold uppercase tracking-wider ${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}
                >
                  {component.type}
                </span>
              </div>

              {component.fields.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {component.fields.map((field) => {
                    const fieldStyle = fieldTypeColors[field.type] || {
                      bg: "bg-white/5 text-white/60",
                    };
                    return (
                      <div
                        key={field.id}
                        className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border border-white/[0.03] ${fieldStyle.bg}`}
                      >
                        <span className="font-medium">{field.name}</span>
                        <span className="text-[9px] opacity-65 font-mono">({field.type})</span>
                        {field.required && (
                          <span className="text-[9px] text-red-400 font-bold" title="Required">
                            *
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs italic text-white/30">No fields defined</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SchemaPreview;
