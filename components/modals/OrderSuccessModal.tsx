'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderSuccessModal({ isOpen, onClose }: OrderSuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px] backdrop-blur-3xl bg-black/90 border border-[#5CE1E6]/20 text-white rounded-[2rem] p-10 overflow-hidden relative">
        {/* Abstract background glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#5CE1E6]/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#FF3131]/10 blur-[100px] rounded-full" />

        <DialogHeader className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-linear-to-br from-[#5CE1E6] to-[#FF3131] rounded-full flex items-center justify-center mb-6 shadow-glow-cyan/50">
            <CheckCircle2 size={40} className="text-white" />
          </div>
          
          <DialogTitle className="text-3xl font-black uppercase tracking-tighter text-center mb-3 bg-linear-to-r from-[#5CE1E6] to-[#FF3131] bg-clip-text text-transparent">
            Order Placed!
          </DialogTitle>
          
          <DialogDescription className="text-center text-gray-400 text-base leading-relaxed max-w-[280px]">
            Your masterpiece is on its way. Ready for the next one?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-10 relative z-10">
          <Button
            onClick={onClose}
            className="w-full rounded-2xl bg-linear-to-r from-[#5CE1E6] to-[#FF3131] hover:opacity-90 text-white font-bold tracking-widest uppercase text-sm h-14 shadow-lg shadow-cyan-500/20 transition-all active:scale-[0.98]"
          >
            Start New Design
          </Button>
          
          <p className="mt-4 text-center text-xs text-gray-500 font-medium tracking-wide">
            Redirecting to payment window...
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
