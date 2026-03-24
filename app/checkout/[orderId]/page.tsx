'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { ShippingDetails } from '@/components/checkout/ShippingDetails';
import { BillingDetails } from '@/components/checkout/BillingDetails';
import { StripePaymentWrapper } from '@/components/checkout/StripePaymentWrapper';

export default function CheckoutPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [shippingCost, setShippingCost] = useState<number>(0);
  const [shippingMethodName, setShippingMethodName] = useState<string>('');
  
  const [shippingData, setShippingData] = useState<any>({});
  const [billingAddress, setBillingAddress] = useState<any>({});
  const [useSameAsShipping, setUseSameAsShipping] = useState(true);

  const [couponCode, setCouponCode] = useState<string>('');
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  const [isStripeComplete, setIsStripeComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitRef = useRef<() => void>(null);

  useEffect(() => {
    setIsMounted(true);
    const cartRaw = localStorage.getItem('printpop_cart');
    if (cartRaw) {
      try {
        setCartItems(JSON.parse(cartRaw));
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    } else {
      // If no cart, might redirect to cart page
      // router.push('/cart'); // disabled for testing locally
    }
  }, []);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal - discountAmount + shippingCost);

  const shippingDetails = {
    firstName: shippingData.firstName,
    lastName: shippingData.lastName,
    email: shippingData.email,
    phone: shippingData.phone,
    shippingMethodName: shippingMethodName,
    shippingCost: shippingCost,
  };

  const shippingAddress = {
    address: shippingData.address,
    city: shippingData.city,
    postcode: shippingData.postcode,
    country: shippingData.country,
  };

  if (!isMounted) return <div className="min-h-screen bg-[#000000]" />;

  return (
    <div className="min-h-screen font-sans bg-[#000000] text-white">
      <div className="bg-[#161616]">
        <PageHeader
          head="CHECKOUT"
          description={
            <>
              Almost there! Provide your shipping and billing details below <br />
              to secure your order and finalize your purchase. 🔒🛒
            </>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col lg:flex-row gap-12 lg:gap-24">
        <div className="flex-1 space-y-12">
          {/* Form Sections */}
          <ShippingDetails 
            onChange={setShippingData} 
            onShippingCostChange={(cost: number, name: string) => {
              setShippingCost(cost);
              setShippingMethodName(name);
            }} 
          />
          
          <BillingDetails 
            useSameAsShipping={useSameAsShipping}
            setUseSameAsShipping={setUseSameAsShipping}
            onChange={setBillingAddress} 
          />

          {/* Render Stripe Wrapper after Shipping Cost is selected/loaded */}
          {shippingCost > 0 && (
            <StripePaymentWrapper 
              orderId={orderId} 
              amount={total} 
              shippingAddress={shippingAddress}
              shippingDetails={shippingDetails}
              billingAddress={useSameAsShipping ? shippingAddress : billingAddress}
              couponCode={couponCode}
              onStripeStateChange={setIsStripeComplete}
              onSubmittingChange={setIsSubmitting}
              bindSubmit={(fn) => { submitRef.current = fn; }}
            />
          )}

        </div>

        <div className="w-full lg:w-[380px] shrink-0">
          <OrderSummary 
            cartItems={cartItems} 
            subtotal={subtotal} 
            shippingCost={shippingCost} 
            shippingMethodName={shippingMethodName}
            discountAmount={discountAmount}
            total={total} 
            onCouponApplied={(val, code) => {
              setDiscountAmount(val);
              setCouponCode(code);
            }}
            isStripeComplete={isStripeComplete}
            isSubmitting={isSubmitting}
            onConfirmPurchase={() => submitRef.current?.()}
          />
        </div>
      </div>
    </div>
  );
}
