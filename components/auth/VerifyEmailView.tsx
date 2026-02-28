"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { MailCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useVerifyEmailMutation } from "@/packages/Mutations";

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const verifyMutation = useVerifyEmailMutation();

  const handleVerify = () => {
    if (!token) {
      toast.error("Invalid Link", {
        description: "The verification link is missing a token. Please use the link from your email.",
      });
      return;
    }

    verifyMutation.mutate(token, {
      onSuccess: (data) => {
        toast.success("Email Verified!", {
          description: data.message || "Your email has been verified. You can now sign in.",
        });
        setTimeout(() => router.push("/signin"), 1500);
      },
      onError: (error: any) => {
        toast.error("Verification Failed", {
          description:
            error?.response?.data?.message ||
            error.message ||
            "The verification link may be expired or invalid.",
        });
      },
    });
  };

  return (
    <div className="w-full flex flex-col items-center text-center">
      <div
        className="flex items-center justify-center w-20 h-20 rounded-full mb-6"
        style={{ background: "linear-gradient(135deg, #5CE1E620, #FF313120)" }}
      >
        {verifyMutation.isError ? (
          <AlertCircle size={40} className="text-red-400" />
        ) : (
          <MailCheck size={40} className="text-cyan-400" />
        )}
      </div>

      <h1
        className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-3 text-transparent bg-clip-text"
        style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}
      >
        {verifyMutation.isSuccess ? "ALL DONE!" : "VERIFY EMAIL"}
      </h1>

      <p className="text-sm text-gray-400 mb-8 max-w-xs leading-relaxed">
        {verifyMutation.isSuccess
          ? "Your email has been verified. Redirecting you to sign in…"
          : "Click the button below to verify your email address and activate your account."}
      </p>

      {!verifyMutation.isSuccess && (
        <Button
          onClick={handleVerify}
          disabled={verifyMutation.isPending || !token}
          className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          {verifyMutation.isPending ? "VERIFYING..." : "VERIFY MY EMAIL"}
        </Button>
      )}

      <div className="mt-6 text-center text-sm text-gray-400">
        Already verified?{" "}
        <button
          onClick={() => router.push("/signin")}
          className="text-white hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
