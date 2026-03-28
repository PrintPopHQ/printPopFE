'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { useValidateCouponMutation } from '@/packages/Mutations';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shippingCost: number;
  shippingMethodName: string;
  discountAmount?: number;
  total: number;
  onCouponApplied: (discount: number, code: string) => void;
  isStripeComplete: boolean;
  isSubmitting: boolean;
  onConfirmPurchase: () => void;
}

export function OrderSummary({ cartItems, subtotal, shippingCost, shippingMethodName, discountAmount = 0, total, onCouponApplied, isStripeComplete, isSubmitting, onConfirmPurchase }: OrderSummaryProps) {
  const [couponInput, setCouponInput] = useState('');
  const [appliedCode, setAppliedCode] = useState('');
  const validateCoupon = useValidateCouponMutation();

  const handleApplyCoupon = () => {
    if (!couponInput.trim()) return;
    
    validateCoupon.mutate(couponInput.trim(), {
      onSuccess: (data) => {
        toast.success('Coupon Applied', { description: data.message });
        const coupon = data.data.coupon;
        let discount = 0;
        
        if (coupon.amount_off) {
          discount = coupon.amount_off;
        } else if (coupon.percent_off) {
          discount = subtotal * (coupon.percent_off / 100);
        }
        
        setAppliedCode(data.data.code);
        onCouponApplied(discount, data.data.code);
      },
      onError: (err: any) => {
        toast.error('Coupon Error', { description: err.message || 'Invalid coupon' });
        setAppliedCode('');
        onCouponApplied(0, '');
      }
    });
  };

  const handleRemoveCoupon = () => {
    setCouponInput('');
    setAppliedCode('');
    onCouponApplied(0, '');
  };

  return (
    <div className="bg-[#000000] sticky top-32 p-6 rounded-xl border border-white/10">
      <h2 className="text-xl font-bold mb-6 tracking-wide bg-linear-to-r from-[#5CE1E6] to-[#FF3131] bg-clip-text text-transparent">
        ORDER SUMMARY
      </h2>

      <div className="space-y-4 mb-6">
        {cartItems.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-sm text-[#9CA3AF]">
            <span>{item.isGroup ? item.groupName : item.caseType} x{item.quantity}</span>
            <span className="text-white">${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}

        <div className="h-px w-full bg-[#333333] my-4" />

        <div className="flex justify-between items-center text-sm text-[#9CA3AF]">
          <span>Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>

        {shippingCost > 0 && (
          <div className="flex justify-between items-center text-sm text-[#9CA3AF]">
            <span>Shipping ({shippingMethodName})</span>
            <span className="text-white">${shippingCost.toFixed(2)}</span>
          </div>
        )}

        {discountAmount > 0 && (
          <div className="flex justify-between items-center text-sm text-[#5CE1E6]">
            <span>Discount ({appliedCode})</span>
            <span>-${discountAmount.toFixed(2)}</span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <label className="text-sm text-[#9CA3AF] block mb-2">Discount Code</label>
        <div className="flex gap-2">
          <Input 
            type="text" 
            placeholder="coupon code" 
            className="bg-[#112238] border-none text-white h-11 focus-visible:ring-1 focus-visible:ring-[#5CE1E6] disabled:opacity-50"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value)}
            disabled={validateCoupon.isPending || !!appliedCode}
          />
          <button 
            type="button"
            onClick={appliedCode ? handleRemoveCoupon : handleApplyCoupon}
            disabled={validateCoupon.isPending || (!couponInput.trim() && !appliedCode)}
            className="bg-[#333333] hover:bg-[#444444] text-white px-4 rounded-md transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {validateCoupon.isPending && <Loader2 size={14} className="animate-spin" />}
            {appliedCode ? 'Remove' : 'Apply'}
          </button>
        </div>
      </div>

      <div className="h-px w-full bg-[#333333] my-6" />

      <div className="flex justify-between items-center mb-6">
        <span className="text-lg font-bold text-white">Total</span>
        <span className="text-lg font-bold text-white">${total.toFixed(2)}</span>
      </div>

      <button 
        onClick={onConfirmPurchase}
        disabled={!isStripeComplete || isSubmitting}
        className="w-full h-12 text-sm font-semibold capitalize tracking-wide rounded-xl text-white bg-linear-to-r from-[#5CE1E6] to-[#FF3131] hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Processing...
          </>
        ) : 'Confirm Purchase'}
      </button>
    </div>
  );
}
