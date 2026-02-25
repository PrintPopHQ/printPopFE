"use client";

import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VerifyOTPForm() {
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timerId);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleResend = () => {
    setTimeLeft(30);
    setCanResend(false);
    // Handle resend request here
    console.log("Resending OTP");
  };

  const formik = useFormik({
    initialValues: {
      otp: Array(6).fill(""),
    },
    validationSchema: Yup.object({
      otp: Yup.array()
        .of(Yup.string().length(1, "Digit required").matches(/^[0-9]$/, "Must be digit"))
        .length(6)
        .test("is-complete", "OTP must be exactly 6 digits", (arr) => {
          return !!arr && arr.every((val) => val && val.length === 1);
        }),
    }),
    onSubmit: async (values) => {
      const otpString = values.otp.join("");
      console.log({ otp: otpString });
      // Handle OTP verification logic
    },
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!formik.values.otp[index] && index > 0) {
        // focus previous and clear it
        const newOtp = [...formik.values.otp];
        newOtp[index - 1] = "";
        formik.setFieldValue("otp", newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      if (index < 5) inputRefs.current[index + 1]?.focus();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (!/^[0-9]*$/.test(val)) return;

    const newOtp = [...formik.values.otp];
    let nextIndex = index;

    // Handle manual input of a single digit
    if (val) {
      newOtp[index] = val.slice(-1);
      nextIndex = Math.min(index + 1, 5);
    } else {
      newOtp[index] = "";
    }

    formik.setFieldValue("otp", newOtp);
    if (val && nextIndex !== index) {
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/[^0-9]/g, "").slice(0, 6);
    if (pasted) {
      const newOtp = [...formik.values.otp];
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) newOtp[index + i] = pasted[i];
      }
      formik.setFieldValue("otp", newOtp);
      const nextIndex = Math.min(index + pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-4xl md:text-5xl font-bold font-neon tracking-wider mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>VERIFY OTP</h1>
      <p className="text-sm md:text-base text-gray-400 mb-8 max-w-sm leading-relaxed">
        We sent OTP to <span className="text-white">example@gmail.com</span>.<br />
        Enter it bellow to continue
      </p>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        <div className="flex gap-2 sm:gap-4 md:gap-5">
          {formik.values.otp.map((digit, index) => (
            <div
              key={index}
              className={cn(
                "relative flex-1 aspect-square rounded-[10px] p-px transition-all duration-200",
                activeIndex === index
                  ? "bg-linear-to-r from-[#5CE1E6] to-[#FF3131]"
                  : "bg-gray-800"
              )}
            >
              <input
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onFocus={() => setActiveIndex(index)}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  if (activeIndex === index) setActiveIndex(-1);
                }}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={(e) => handlePaste(e, index)}
                className="w-full h-full bg-black rounded-[9px] text-center text-xl text-white outline-none focus:ring-0"
              />
            </div>
          ))}
        </div>

        {/* Error message */}
        {formik.submitCount > 0 && formik.errors.otp && (
          <div className="text-red-500 text-xs">Please enter exactly 6 digits.</div>
        )}

        <div className="text-sm text-gray-400">
          {canResend ? (
            <button type="button" onClick={handleResend} className="text-white hover:underline transition-colors">
              Resend available in 00:00 Seconds,. Resend OTP
            </button>
          ) : (
            <>
              Resend available in 00:{timeLeft.toString().padStart(2, '0')} Seconds,.{" "}
              <span className="text-gray-600">Resend OTP</span>
            </>
          )}
        </div>

        <Button
          type="submit"
          disabled={!formik.isValid || !formik.dirty}
          className="w-full text-white font-bold h-12 rounded-xl mt-6 font-neon tracking-widest shadow-glow-cyan"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          VERIFY
        </Button>
      </form>
    </div>
  );
}
