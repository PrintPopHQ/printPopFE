'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RemoveCartItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RemoveCartItemModal({ isOpen, onClose, onConfirm }: RemoveCartItemModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] lg:min-w-[500px] backdrop-blur-2xl bg-black/80 border border-white/10 text-white rounded-[2.5rem] p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-black uppercase tracking-wider text-center mb-2">
            Remove Item
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            Are you sure you want to remove this item from your cart?
            <br />
            <span className="font-bold">Note:</span> This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl border-white/10 bg-transparent hover:bg-white/10 hover:border-white/20 text-white font-black tracking-widest uppercase text-xs h-12"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black tracking-widest uppercase text-xs h-12"
          >
            Remove
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
