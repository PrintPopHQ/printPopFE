import { Suspense } from "react";
import { VerifyEmailView } from "@/components/auth/VerifyEmailView";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading…</div>}>
      <VerifyEmailView />
    </Suspense>
  );
}
