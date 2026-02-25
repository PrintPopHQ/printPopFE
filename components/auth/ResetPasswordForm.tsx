"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Eye, EyeOff, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ResetPasswordForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Minimum of 8 Characters")
        .matches(/(?=.*[a-z])(?=.*[A-Z])/, "One uppercase and one lowercase character")
        .matches(/(?=.*[0-9])/, "One Number")
        .matches(/(?=.*[!@#$%^&*])/, "One Special character (e.g. !@#$%^&)")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), undefined], "Passwords must match")
        .required("Confirm Password is required"),
    }),
    onSubmit: async (values) => {
      // Handle password reset logic
      console.log(values);
    },
  });

  const passwordValue = formik.values.password;
  const validations = {
    length: passwordValue.length >= 8,
    casing: /(?=.*[a-z])(?=.*[A-Z])/.test(passwordValue),
    special: /(?=.*[!@#$%^&*])/.test(passwordValue),
    number: /(?=.*[0-9])/.test(passwordValue),
  };

  return (
    <div className="w-full">
      <h1 className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>RESET PASSWORD</h1>
      <p className="text-sm text-gray-400 mb-8 max-w-sm">Create a new, strong password for your account.</p>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div className="space-y-1 relative">
          <label className="text-sm font-medium text-white">New Password*</label>
          <div className="relative">
            <Input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter new Password"
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
          {formik.touched.password && formik.errors.password && typeof formik.errors.password === 'string' ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
          ) : null}
        </div>

        {/* Validation Checklist */}
        <div className="space-y-3 py-2">
          <div className="flex items-center gap-3 text-sm">
            <Check size={16} className={cn("transition-colors", validations.casing ? "text-primary" : "text-gray-600")} />
            <span className={cn("transition-colors", validations.casing ? "text-gray-300" : "text-gray-500")}>
              One uppercase and one lowercase character
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Check size={16} className={cn("transition-colors", validations.special ? "text-primary" : "text-gray-600")} />
            <span className={cn("transition-colors", validations.special ? "text-gray-300" : "text-gray-500")}>
              One Special character (e.g. !@#$%^&)
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Check size={16} className={cn("transition-colors", validations.number ? "text-primary" : "text-gray-600")} />
            <span className={cn("transition-colors", validations.number ? "text-gray-300" : "text-gray-500")}>
              One Number
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Check size={16} className={cn("transition-colors", validations.length ? "text-primary" : "text-gray-600")} />
            <span className={cn("transition-colors", validations.length ? "text-gray-300" : "text-gray-500")}>
              Minimum of 8 Character
            </span>
          </div>
        </div>

        <div className="space-y-1 relative">
          <label className="text-sm font-medium text-white">Confirm Password*</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new Password"
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-red"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          RESET PASSWORD
        </Button>
      </form>
    </div>
  );
}
