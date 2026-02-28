"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSignInMutation } from "@/packages/Mutations";
import { saveUser } from "@/lib/auth-store";

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const signInMutation = useSignInMutation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Email is required"),
      password: Yup.string().required("Password is required"),
    }),
    onSubmit: async (values) => {
      signInMutation.mutate(
        { email: values.email, password: values.password },
        {
          onSuccess: (data) => {
            // Persist user to localStorage for auth-aware features
            if (data.data) saveUser(data.data);
            toast.success("Welcome back!", {
              description: data.message || "You have signed in successfully.",
            });
            router.push("/");
          },
          onError: (error: any) => {
            toast.error("Sign In Failed", {
              description: error?.response?.data?.message || error.message || "Invalid email or password.",
            });
          },
        }
      );
    },
  });

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>WELCOME BACK</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">Sign in to your account and Discover world class customize Mobile casing</p>

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

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              className="w-4 h-4 rounded bg-[#112238] border-transparent accent-primary"
              onChange={formik.handleChange}
              checked={formik.values.rememberMe}
            />
            <label htmlFor="rememberMe" className="text-sm text-gray-400 cursor-pointer">
              Remember me
            </label>
          </div>
          <Link href="/forgot-password" className="text-sm text-gray-400 hover:text-white">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty || signInMutation.isPending}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          {signInMutation.isPending ? "SIGNING IN..." : "SIGN IN"}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account? <Link href="/signup" className="text-white hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
