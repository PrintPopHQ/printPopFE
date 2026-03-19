"use client";

import { PageHeader } from "@/components/layout/PageHeader";

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="SHIPPING & RETURNS"
          description={
            <>
              Got questions about shipping or returns? Find everything you <br />
              need to know about our delivery process and refund policy here.
            </>
          }
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              1. Shipping Information
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              We ship Australia-wide! To ensure you get the most accurate and fair price, shipping costs are calculated dynamically at checkout based on your delivery postcode via the **Australia Post API**.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-primary transition-colors">
                <h4 className="text-white font-bold mb-2">Standard Delivery</h4>
                <p className="text-sm">Reliable shipping to your door</p>
                <p className="text-sm text-primary font-bold mt-2">Calculated at Checkout</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-secondary transition-colors">
                <h4 className="text-white font-bold mb-2">Express Delivery</h4>
                <p className="text-sm">Priority handling for urgent orders</p>
                <p className="text-sm text-secondary font-bold mt-2">Available on Request</p>
              </div>
            </div>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              2. Returns Policy
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              Since each Printpop case is custom-made to order, we generally do not accept returns for change of mind. However, if your case arrives damaged or with a printing defect, we will replace it free of charge!
            </p>
            <p>
              To initiate a return for a defective item, please contact us within 14 days of receiving your order with your order number and photos of the issue.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              3. Order Tracking
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              Once your order has been dispatched, you will receive an email with your tracking number. You can use this number to track your custom case's journey from our workshop to your door!
            </p>
          </div>
        </section>
      </div>

      <div className="py-20" />
    </div>
  );
}
