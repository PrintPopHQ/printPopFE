"use client";

import { PageHeader } from "@/components/layout/PageHeader";

export default function TermsOfUsePage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="TERMS OF USE"
          description={
            <>
              Welcome to Printpop! These terms govern your use of our <br />
              custom design platform and your relationship with us.
            </>
          }
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              1. Using Our Service
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              By accessing Printpop, you agree to follow these Terms of Use and comply with all applicable laws and regulations. You are responsible for ensuring that the content you upload for your custom designs does not infringe on any third-party intellectual property rights.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              2. Intellectual Property
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              You retain ownership of any content you upload to Printpop. However, by uploading content, you grant Printpop a non-exclusive license to use, reproduce, and display that content solely for the purpose of fulfilling your order.
            </p>
            <p>
              Printpop reserves the right to reject any design that is deemed offensive, illegal, or in violation of copyright laws.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              3. Orders and Payments
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              All orders are subject to acceptance and availability. Prices are listed in AUD and include any applicable taxes. We use secure payment gateways for all transactions, ensuring your financial information is handled with care.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              4. Disclaimer of Liability
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              Printpop provides its services on an "as is" and "as available" basis. We do not guarantee that your experience will be error-free or uninterrupted, but we will make every effort to ensure satisfaction.
            </p>
          </div>
        </section>
      </div>

      <div className="py-20" />
    </div>
  );
}
