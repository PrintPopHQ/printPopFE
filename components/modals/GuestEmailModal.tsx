"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, ShoppingCart } from "lucide-react";
import { saveGuestEmail } from "@/lib/auth-store";
import Link from "next/link";

interface GuestEmailModalProps {
  open: boolean;
  onConfirm: (email: string) => void;
  onClose: () => void;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GuestEmailModal({ open, onConfirm, onClose }: GuestEmailModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!EMAIL_RE.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    saveGuestEmail(email);
    onConfirm(email);
    setEmail("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[420px] bg-[#0a0f1a] border border-white/10 text-white rounded-[2rem] p-8">
        <DialogHeader className="items-center text-center gap-3 mb-2">
          {/* icon badge */}
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-1"
            style={{ background: "linear-gradient(135deg, rgba(92,225,230,0.15), rgba(255,49,49,0.15))" }}>
            <ShoppingCart size={26} className="text-cyan-400" />
          </div>
          <DialogTitle className="text-2xl font-neon font-black tracking-tight">
            ALMOST THERE
          </DialogTitle>
          <DialogDescription className="text-gray-400 text-sm leading-relaxed">
            Enter your email so we can save your cart and send your order updates.
            Already have an account?{" "}
            <Link href="/signin" className="text-cyan-400 hover:underline font-semibold">
              Sign in instead
            </Link>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-2">
          <div className="relative">
            <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={handleKeyDown}
              autoFocus
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pl-10 focus-visible:ring-primary"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}

          <Button
            onClick={handleSubmit}
            disabled={!email}
            className="w-full h-12 text-white font-bold font-neon tracking-widest rounded-xl"
            style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
          >
            ADD TO CART
          </Button>

          <button
            onClick={onClose}
            className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-1"
          >
            Cancel
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
