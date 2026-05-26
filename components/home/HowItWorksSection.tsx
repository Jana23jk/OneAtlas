import { SectionHeader } from "@/components/layout/SectionHeader";

function PencilIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function TableIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

function DeployIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 3 21 3 21 8" />
      <line x1="4" y1="20" x2="21" y2="3" />
      <polyline points="21 16 21 21 16 21" />
      <line x1="15" y1="15" x2="21" y2="21" />
    </svg>
  );
}

interface Step {
  number: string;
  title: string;
  description: string;
  Icon: () => React.JSX.Element;
  accent: string;
}

const steps: Step[] = [
  {
    number: "01",
    title: "Describe your app",
    description:
      "Type a natural-language prompt like 'a CRM for tracking customer deals' and OneAtlas understands your intent instantly.",
    Icon: PencilIcon,
    accent: "#F8BC42",
  },
  {
    number: "02",
    title: "Schema is generated",
    description:
      "Your app's data model, components, and layout are produced as a versioned JSON schema — stored, editable, and auditable.",
    Icon: TableIcon,
    accent: "#F8BC42",
  },
  {
    number: "03",
    title: "Edit and deploy",
    description:
      "Refine with plain English instructions. Every change is versioned and undoable. Share a live preview link in one click.",
    Icon: DeployIcon,
    accent: "#FF5996",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-24">
      <SectionHeader
        className="mb-16"
        eyebrow="How it works"
        title="From idea to app in three steps"
        description="OneAtlas automates database provisioning and UI compiling so you can build instantly."
      />

      {/* Cards + connector */}
      <div className="relative grid gap-8 md:grid-cols-3">
        {/* Dashed connector line — desktop only */}
        <div
          className="pointer-events-none absolute left-[calc(33.33%+2rem)] right-[calc(33.33%-2rem)] top-16 hidden border-t-2 border-dashed border-[#F8BC42]/15 md:block"
          aria-hidden
        />

        {steps.map((step) => (
          <div
            key={step.number}
            className="premium-card relative flex flex-col gap-5"
          >
            {/* Number pill + icon row */}
            <div className="flex items-center justify-between">
              <span
                className="inline-flex h-8 w-11 items-center justify-center rounded-lg text-xs font-bold"
                style={{ background: `${step.accent}12`, color: step.accent }}
              >
                {step.number}
              </span>
              <span style={{ color: step.accent }}>
                <step.Icon />
              </span>
            </div>
            <h3 className="text-lg font-bold text-text-primary">{step.title}</h3>
            <p className="text-sm leading-relaxed text-text-secondary">{step.description}</p>
            {/* Bottom accent bar */}
            <div
              className="mt-auto h-[3px] w-12 rounded-full"
              style={{ background: step.accent }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
