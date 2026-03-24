'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { useCreatePaymentIntentMutation } from '@/packages/Mutations';
import { toast } from 'sonner';
import { getAccessToken } from '@/lib/auth-store';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51TCoFqDlb5yHu0ZOhQF6Mbo4cXREhTJptD0tvDNZe0uQx31DW4ZUUphiCEUfINQxv7W4u6V4mkcfKl9CjkYdWDVh00pFvHLrnP');

interface StripePaymentWrapperProps {
  orderId: string;
  amount: number;
  shippingAddress: any;
  shippingDetails: any;
  billingAddress: any;
  couponCode: string;
  onStripeStateChange: (complete: boolean) => void;
  onSubmittingChange: (isSubmitting: boolean) => void;
  bindSubmit: (fn: () => void) => void;
}

export function StripePaymentWrapper({ orderId, amount, shippingAddress, shippingDetails, billingAddress, couponCode, onStripeStateChange, onSubmittingChange, bindSubmit }: StripePaymentWrapperProps) {
  const [clientSecret, setClientSecret] = useState<string>('');
  const createIntentMutation = useCreatePaymentIntentMutation();

  useEffect(() => {
    // Only create intent when amount is available and orderId is known
    if (amount > 0 && orderId) {
      // Clear existing client secret so Elements remounts
      setClientSecret('');

      const paymentPayload = {
        orderId,
        billingAddress,
        shippingAddress,
        shippingDetails,
        totalCost: amount,
        couponCode
      };

      createIntentMutation.mutate(
        { payload: paymentPayload, token: getAccessToken() ?? undefined },
        {
          onSuccess: (data) => {
            if (data?.clientSecret) {
              setClientSecret(data.clientSecret);
            }
          },
          onError: (err: any) => {
            console.error('Failed to create PaymentIntent', err);
            toast.error('Payment Error', { description: 'Failed to initialize payment method. Please try again.' });
          }
        }
      );
    }
  }, [amount, orderId, couponCode]);

  if (createIntentMutation.isPending || !clientSecret) {
    return (
      <div className="pt-8 flex flex-col items-center justify-center p-6 border border-white/10 rounded-xl bg-black/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#5CE1E6] mb-4" />
        <p className="text-[#9CA3AF] text-sm">
          {createIntentMutation.isPending ? 'Updating payment details...' : 'Initializing secure payment gateway...'}
        </p>
      </div>
    );
  }

  return (
    <div className="pt-8 animate-in fade-in duration-500">
      <h2 className="text-2xl font-bold tracking-wide text-[#FF3131] mb-6">PAYMENT SECURE</h2>
      <div className="bg-[#000000] p-6 rounded-xl border border-white/10">
        <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'night' } }}>
          <CheckoutForm 
            shippingAddress={shippingAddress} 
            shippingDetails={shippingDetails} 
            billingAddress={billingAddress} 
            onComplete={onStripeStateChange}
            onSubmitting={onSubmittingChange}
            bindSubmit={bindSubmit}
          />
        </Elements>
      </div>
    </div>
  );
}

function CheckoutForm({ shippingAddress, shippingDetails, billingAddress, onComplete, onSubmitting, bindSubmit }: { shippingAddress: any, shippingDetails: any, billingAddress: any, onComplete: (c: boolean) => void, onSubmitting: (s: boolean) => void, bindSubmit: (fn: () => void) => void }) {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async () => {
    if (!stripe || !elements) return;
    if (!shippingDetails.email || !shippingDetails.firstName || !shippingAddress.address) {
      toast.error('Incomplete Details', { description: 'Please fill out missing shipping/billing details.' });
      return;
    }

    onSubmitting(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/success`,
        payment_method_data: {
          billing_details: {
            name: `${billingAddress.firstName || shippingDetails.firstName} ${billingAddress.lastName || shippingDetails.lastName}`,
            email: billingAddress.email || shippingDetails.email,
            phone: billingAddress.phone || shippingDetails.phone,
            address: {
              line1: billingAddress.address || shippingAddress.address,
              city: billingAddress.city || shippingAddress.city,
              country: billingAddress.country || shippingAddress.country,
              postal_code: billingAddress.postcode || shippingAddress.postcode,
            }
          }
        }
      },
    });

    if (error) {
      toast.error('Payment Failed', { description: error.message || 'An unexpected error occurred.' });
    }
    
    onSubmitting(false);
  };

  useEffect(() => {
    if (stripe && elements) {
      bindSubmit(handleSubmit);
    }
  }, [stripe, elements, shippingAddress, shippingDetails, billingAddress]);

  return (
    <div className="space-y-6">
      <PaymentElement 
        options={{ layout: 'tabs' }} 
        onChange={(e) => onComplete(e.complete)}
      />
    </div>
  );
}
