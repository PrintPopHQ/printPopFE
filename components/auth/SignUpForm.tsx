"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSignUpMutation } from "@/packages/Mutations";

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const signUpMutation = useSignUpMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    }),
    onSubmit: async (values) => {
      signUpMutation.mutate(
        { email: values.email, password: values.password },
        {
          onSuccess: (data) => {
            toast.success("Account Created!", {
              description: data.message || "Please check your email to verify your account.",
            });
          },
          onError: (error: any) => {
            toast.error("Sign Up Failed", {
              description: error?.response?.data?.message || error.message || "Something went wrong.",
            });
          },
        }
      );
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>CREATE ACCOUNT</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">Create your account and Discover world class customize Mobile casing</p>

      {/* <OAuthButtons /> */}

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

        <div className="space-y-1 relative">
          <label className="text-sm font-medium text-white">Password</label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your Password"
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || signUpMutation.isPending}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          {signUpMutation.isPending ? "CREATING ACCOUNT..." : "SIGN UP"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Already a User? <Link href="/signin" className="text-white hover:underline">Sign in</Link>
      </div>
    </div>
  );
}
