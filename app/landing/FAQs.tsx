"use client"

import Image from "next/image"
import { Plus, X } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import faqIcon from "@/public/printpop-fqs-icon.svg"

const faqData = [
  {
    question: "How do I design a personalised phone case?",
    answer: "Designing a personalised phone case is simple. Upload your photo, logo, or artwork, adjust the layout, and preview your design in real time. Our system shows you exactly how the final product will look before you order. PrintPOP makes the process clear and easy, even if you have no design experience.",
  },
  {
    question: "What phone models do you support?",
    answer: "We offer personalised phone case options for major brands including Apple, Samsung, Google Pixel and Oppo. Our custom phone cases are made to fit precisely, ensuring proper button access and camera alignment. If you don't see your model listed, contact us and we'll check availability.",
  },
  {
    question: "How durable are your custom phone cases?",
    answer: "Our custom phone cases combine strong materials with high-resolution printing. They protect against everyday drops and scratches while keeping a slim profile. Your personalised phone case will look sharp and hold up well with daily use.",
  },
  {
    question: "Will my design look exactly like the preview?",
    answer: "Yes. We print your personalised phone case based on the exact preview you approve. Colours may vary slightly depending on screen settings, but we aim for accurate and vibrant results. We focus on clarity, alignment, and print precision.",
  },
  {
    question: "How long does it take to receive my personalised phone case?",
    answer: "Production times are fast, and we ship promptly once your personalised phone case is ready. Delivery times depend on your location and chosen shipping method. We keep you updated so you know when to expect your order.",
  },
  {
    question: "Can I use my own logo or brand artwork?",
    answer: "Yes, you can upload logos and brand graphics to create custom phone cases. Many customers use personalised phone case designs for business branding, events, and promotions. Make sure your artwork is high resolution for the best result.",
  },
  {
    question: "Do you offer bulk orders?",
    answer: "Yes, we handle bulk orders for events, teams, and businesses. Our custom phone cases are popular for corporate branding and group gifts. Contact PrintPOP directly to discuss quantities and turnaround times.",
  },
  {
    question: "What image quality should I use?",
    answer: "For the best personalised phone case result, upload high-resolution images. Clear photos with good lighting produce sharper prints. Low-quality images may appear pixelated when printed at full size.",
  },
  {
    question: "Can I return or exchange my order?",
    answer: "Because each personalised phone case is made to order, we cannot accept returns for design changes. However, if there is a production issue, we will review and resolve it quickly. Customer satisfaction remains important to us.",
  },
  {
    question: "Why choose PrintPOP for custom phone cases?",
    answer: "PrintPOP focuses on quality, simplicity, and fast service. We combine durable materials with precise printing to create custom phone cases that look great and last. Our easy design process and responsive support make creating a personalised phone case straightforward and reliable.",
  },
]

export const FAQs = () => {
  return (
    <section className="relative py-24 pb-6 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-neon text-3xl md:text-4xl font-bold text-white mb-6 uppercase leading-tight">
            <span className="text-neon-blue text-shadow-[0_0_30px_rgba(92,225,230,0.8)]">Frequently Asked Questions</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Side: Illustration */}
          <div className="hidden lg:block relative group animate-in fade-in slide-in-from-left-4 duration-1000 order-2 lg:order-1">
            <div className="absolute inset-0 z-0 pointer-events-none">
              <div className="absolute -top-28 left-[70%] w-[180px] h-[180px] bg-secondary opacity-20 blur-[120px] rounded-full mix-blend-screen animate-pulse duration-4000"></div>
            </div>
            <div className="relative z-10 p-4">
              <Image
                src={faqIcon}
                alt="FAQ Illustration"
                width={350}
                height={350}
              />
            </div>
          </div>

          {/* Right Side: Accordion */}
          <div className="animate-in fade-in slide-in-from-right-4 duration-1000 order-1 lg:order-2">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqData.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-none bg-[#112238] rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                >
                  <AccordionTrigger
                    hideIcon
                    className="flex justify-between items-center px-6 py-5 hover:no-underline group data-[state=open]:bg-[#112238]"
                  >
                    <span className="font-comic text-left text-lg text-white group-hover:text-primary transition-colors">
                      {faq.question}
                    </span>
                    <div className="ml-4 shrink-0">
                      <Plus className="h-5 w-5 text-white block group-data-[state=open]:hidden" />
                      <X className="h-5 w-5 text-white hidden group-data-[state=open]:block" />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-6 pt-0">
                    <p className="font-comic text-gray-400 text-base leading-relaxed">
                      {faq.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}
