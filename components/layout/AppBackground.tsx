interface AppBackgroundProps {
  children: React.ReactNode;
  className?: string;
}

export function AppBackground({ children, className = "" }: AppBackgroundProps) {
  return (
    <div className={`app-background ${className}`}>
      <div className="glow-purple -left-32 -top-32 animate-glow-pulse" aria-hidden />
      <div
        className="glow-pink right-0 top-1/3 animate-glow-pulse"
        style={{ animationDelay: "-2s" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-brand-cyan/10 blur-3xl animate-float"
        aria-hidden
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
