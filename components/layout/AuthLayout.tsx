import Link from "next/link";
import { AppBackground } from "./AppBackground";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <AppBackground className="flex min-h-screen">
      <div className="grid min-h-screen w-full lg:grid-cols-2">
        {/* Brand panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-brand-dark via-brand-darker to-brand-dark p-12 text-white lg:flex">
          <div className="glow-purple left-0 top-0 opacity-60" aria-hidden />
          <div className="glow-pink bottom-0 right-0 opacity-50" aria-hidden />

          <Link href="/" className="relative z-10 text-2xl font-bold">
            One<span className="text-brand-primary-light">Atlas</span>
          </Link>

          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Build internal tools at the speed of thought
            </h1>
            <p className="max-w-md text-lg text-white/70">
              AI-native runtime for teams who ship fast — templates, schemas,
              and live previews in one premium workspace.
            </p>
            <div className="flex gap-4">
              <div className="rounded-card border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-bold text-brand-teal">5+</p>
                <p className="text-xs text-white/60">Templates</p>
              </div>
              <div className="rounded-card border border-white/10 bg-white/5 px-4 py-3 backdrop-blur">
                <p className="text-2xl font-bold text-brand-cyan">∞</p>
                <p className="text-xs text-white/60">Schema edits</p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-sm text-white/40">
            © {new Date().getFullYear()} OneAtlas
          </p>
        </div>

        {/* Form panel */}
        <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="mx-auto w-full max-w-md space-y-8 reveal">
            <div className="space-y-2 lg:hidden">
              <Link href="/" className="text-xl font-bold text-text-primary">
                One<span className="text-brand-primary">Atlas</span>
              </Link>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-text-primary">{title}</h2>
              <p className="text-text-secondary">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </AppBackground>
  );
}
