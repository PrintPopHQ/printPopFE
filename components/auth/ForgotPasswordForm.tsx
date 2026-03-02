"use client";

import { useFormik } from "formik";
import * as Yup from "yup";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/packages/Mutations";

export function ForgotPasswordForm() {
  const forgotPasswordMutation = useForgotPasswordMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
    }),
    onSubmit: (values) => {
      forgotPasswordMutation.mutate(
        { email: values.email },
        {
          onSuccess: (data) => {
            toast.success("Email Sent!", {
              description: data.message || "If that email is registered, a reset link has been sent.",
            });
          },
          onError: (error: unknown) => {
            const message =
              (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
              (error as Error)?.message ||
              "Something went wrong. Please try again.";
            toast.error("Request Failed", { description: message });
          },
        }
      );
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>FORGOT PASSWORD</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">
        Enter your email address and we will send you an OTP to reset your password.
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm font-medium text-white">Email*</label>
          <Input
            name="email"
            type="email"
            placeholder="Enter your Email"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || forgotPasswordMutation.isPending}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-cyan"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          {forgotPasswordMutation.isPending ? "FORGOT PASSWORD..." : "FORGOT PASSWORD"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Remember your password? <Link href="/signin" className="text-white hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
