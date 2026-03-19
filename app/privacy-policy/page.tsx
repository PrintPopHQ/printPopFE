"use client";

import { PageHeader } from "@/components/layout/PageHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="bg-[#161616]">
        <PageHeader
          head="PRIVACY POLICY"
          description={
            <>
              Your privacy is our priority. This policy outlines how we collect, <br />
              use, and protect your personal information at Printpop.
            </>
          }
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-20 space-y-16">
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              1. Information Collection
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              We collect information you provide directly to us when you create an account, design a case, or make a purchase. This includes your name, email address, shipping address, and payment information.
            </p>
            <p>
              We also automatically collect certain information when you visit our site, such as your IP address, browser type, and how you interact with our platform to improve your experience.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              2. How We Use Data
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              Printpop uses your data to process orders, provide customer support, and send you updates about your designs. We also use aggregated data to analyze trends and improve our customization tools.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Processing and fulfilling your custom orders</li>
              <li>Providing support and responding to inquiries</li>
              <li>Sending necessary transactional notifications</li>
              <li>Improving website functionality and user experience</li>
            </ul>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              3. Data Protection
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              We implement industry-standard security measures to protect your personal information. Your design files and transaction details are stored securely, and we do not sell your personal data to third parties.
            </p>
          </div>
        </section>

        <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-1.5 h-8 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
            <h2 className="text-2xl font-black tracking-widest font-neon uppercase">
              4. Your Rights
            </h2>
          </div>
          <div className="space-y-4 text-gray-400 leading-relaxed pl-6">
            <p>
              You have the right to access, update, or delete your personal information at any time. If you have questions about your data, please contact us through our support channels.
            </p>
          </div>
        </section>
      </div>

      <div className="py-20" />
    </div>
  );
}
