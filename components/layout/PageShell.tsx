import { AppBackground } from "./AppBackground";
import { Footer } from "@/components/home/Footer";
import { Navbar } from "./Navbar";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
}

export function PageShell({ children, className = "" }: PageShellProps) {
  return (
    <AppBackground className={className}>
      <Navbar />
      <main className="pt-nav">{children}</main>
      <Footer />
    </AppBackground>
  );
}
