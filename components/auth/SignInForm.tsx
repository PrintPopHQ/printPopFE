"use client";

import { useState } from "react";
import Link from "next/link";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3 mb-6">
      <Button variant="outline" type="button" className="w-full bg-[#112238] border-transparent text-white hover:bg-[#1a3355] h-12 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2">
          <path d="M16.365 21.444c-1.343.916-2.584.97-3.926.046-1.554-1.077-3.83-2.316-5.83-3.69-2.03-1.393-3.855-3.076-5.46-5.06C-.282 10.957-.406 8.35.688 6.07c.563-1.17 1.343-2.186 2.34-3.048.81-.69 1.702-1.22 2.668-1.573 2.1-.772 4.092-.5 6.13.784.81.512 1.625 1.134 2.508 1.552 1.933.916 3.996 1.096 6.095.34.8-.29 1.56-.677 2.302-1.135C22.618 2.35 23.36 3.2 23.94 4.14c-1.61.9-2.91 2.146-3.415 4-.492 1.81.042 3.52 1.408 4.88 1.07 1.066 2.396 1.72 3.91 1.928-1.353 3.65-3.66 6.47-7.39 6.55-1.07.02-2.115-.41-3.088-.894zM15.485 5.564c-.37 0-.74-.01-1.11-.02-.87-.02-1.72-.25-2.52-.61-1.57-.7-2.79-1.84-3.6-3.37-.152-.286-.27-.582-.36-.884 1.25.122 2.385.642 3.32 1.48 1.428 1.28 2.213 2.99 2.17 4.93.03.02.06.05.1.07z" />
        </svg>
        Sign in with Apple
      </Button>
      <Button variant="outline" type="button" className="w-full bg-[#112238] border-transparent text-white hover:bg-[#1a3355] h-12 rounded-xl">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="mr-2 text-blue-500 hidden" /* You can use standard Google multicolor SVG here */>
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Sign in with google
      </Button>
    </div>
  );
}

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);

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
      // Handle sign in logic
      console.log(values);
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
          disabled={!formik.isValid || !formik.dirty}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          SIGN IN
        </Button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-400">
        Don't have an account? <Link href="/signup" className="text-white hover:underline">Sign up</Link>
      </div>
    </div>
  );
}
