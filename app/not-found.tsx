import Link from "next/link";
import { AppBackground } from "@/components/layout/AppBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <AppBackground className="flex min-h-screen items-center justify-center px-4 py-16">
      <Card hover={false} className="max-w-md text-center">
        <CardContent className="flex flex-col items-center gap-6 pt-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-card border border-surface-border bg-surface-bg text-text-secondary">
            <AlertTriangle size={28} />
          </div>
          <div className="space-y-2">
            <span className="text-gradient-primary block text-5xl font-extrabold">
              404
            </span>
            <h1 className="text-xl font-bold text-text-primary">Page not found</h1>
            <p className="text-sm text-text-secondary">
              The page you are looking for does not exist or has been moved.
            </p>
          </div>
          <Button asChild className="w-full">
            <Link href="/">
              <Home size={16} /> Back to Homepage
            </Link>
          </Button>
        </CardContent>
      </Card>
    </AppBackground>
  );
}
