'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface InventoryCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export default function InventoryCheckModal({ isOpen, onClose, onContinue }: InventoryCheckModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] lg:min-w-[500px] backdrop-blur-2xl bg-black/80 border border-white/10 text-white rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-wider text-center mb-2 bg-linear-to-r from-[#5CE1E6] to-[#FF3131] bg-clip-text text-transparent">
            Inventory Notice
          </DialogTitle>
          <DialogDescription className="text-center text-white/80 text-base">
            This will take around <span className="font-bold text-[#5CE1E6]">7 to 10 business days</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl border-white/10 bg-transparent hover:bg-white/10 hover:border-white/20 text-white font-black tracking-widest uppercase text-xs h-12"
          >
            Cancel Order
          </Button>
          <Button
            onClick={() => {
              onContinue();
              onClose();
            }}
            className="flex-1 rounded-xl bg-linear-to-r from-[#5CE1E6] to-[#FF3131] hover:opacity-90 text-white font-black tracking-widest uppercase text-xs h-12 border-0"
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
