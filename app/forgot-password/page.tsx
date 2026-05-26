import Link from "next/link";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset your password"
      subtitle="We'll send a reset link to your email"
    >
      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
      </form>
      <p className="text-center text-sm text-text-secondary">
        <Link href="/login" className="font-medium text-brand-primary hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
