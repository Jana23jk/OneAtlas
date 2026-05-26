import type { AppSchema } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SchemaPreviewProps {
  schema: AppSchema;
}

const componentTypeVariant: Record<string, "success" | "cta" | "default" | "warning" | "info"> = {
  table: "success",
  chart: "cta",
  form: "default",
  metric: "warning",
  list: "info",
};

export function SchemaPreview({ schema }: SchemaPreviewProps) {
  const sortedComponents = [...schema.components].sort((a, b) => a.order - b.order);

  return (
    <Card hover={false} className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between border-b border-surface-border">
        <div>
          <CardTitle>App structure</CardTitle>
          <p className="text-xs text-text-secondary">Interactive schema representation</p>
        </div>
        <Badge variant="default">v{schema.version}</Badge>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {sortedComponents.map((component) => (
          <div
            key={component.id}
            className="group rounded-card border border-surface-border bg-surface-bg p-4 transition-all duration-300 hover:border-brand-primary/20 hover:shadow-soft"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h4 className="font-medium text-text-primary transition-colors group-hover:text-brand-primary">
                  {component.name}
                </h4>
                <span className="font-mono text-[10px] text-text-secondary">
                  {component.id}
                </span>
              </div>
              <Badge variant={componentTypeVariant[component.type] ?? "outline"}>
                {component.type}
              </Badge>
            </div>
            {component.fields.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {component.fields.map((field) => (
                  <span
                    key={field.id}
                    className="inline-flex items-center gap-1 rounded-full border border-surface-border bg-white px-2.5 py-1 text-xs text-text-secondary"
                  >
                    <span className="font-medium text-text-primary">{field.name}</span>
                    <span className="font-mono text-[9px] opacity-70">({field.type})</span>
                    {field.required ? (
                      <span className="font-bold text-[#1A1F36]">*</span>
                    ) : null}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs italic text-text-secondary">No fields defined</p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default SchemaPreview;
