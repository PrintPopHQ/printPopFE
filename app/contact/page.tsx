"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Clock, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { ContactForm } from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div className="min-h-screen font-sans bg-[#000000]">
      <div className="bg-[#161616]">
        <PageHeader
          head="CONTACT US"
          description={
            <>
              Connect with us for any queries, support, or collaboration opportunities <br />
              and we will get back to you as soon as possible.
            </>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-16 pb-24 flex flex-col lg:flex-row gap-16 justify-between items-center">

        {/* Left Form Section */}
        <div className="w-full lg:w-[55%] flex flex-col relative">
          <h2 className="text-4xl font-black tracking-widest font-neon mb-6 z-10">
            <span className="text-shadow-[0_0_30px_#FF3131]">PRINTPOP</span> <span className="text-neon-red">LOCATIONS</span>
          </h2>

          <Card className="bg-[#112238] border-none shadow-2xl rounded-2xl w-full grow">
            <CardContent className="p-8 md:p-10 font-sans">
              <div className="space-y-2 mb-2">
                <h3 className="text-[1.1rem] font-medium text-white tracking-wide">WE WOULD LOVE TO HEAR FROM YOU!</h3>
                <p className="text-gray-400 text-sm">Let's get in touch</p>
              </div>

              <ContactForm />
            </CardContent>
          </Card>
        </div>

        {/* Right Info Section */}
        <div className="w-full lg:w-[45%] flex flex-col justify-start lg:pl-8 pt-16 lg:pt-24 mt-4 lg:mt-0 font-montserrat">

          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <MapPin className="w-6 h-6 text-white mt-1 shrink-0" strokeWidth={1.5} />
              <div className="text-gray-300 font-medium text-[15px]">
                <p>We are right in the heart of Sydney & Adelaide</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Mail className="w-6 h-6 text-white shrink-0" strokeWidth={1.5} />
              <a href="mailto:info@printpop.contactus" className="text-gray-300 font-medium text-[15px] hover:text-white transition-colors">
                info@printpop.contactus
              </a>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="w-6 h-6 text-white shrink-0" strokeWidth={1.5} />
              <a href="tel:+71456677888" className="text-gray-300 font-medium text-[15px] hover:text-white transition-colors">
                +71 456 677 888
              </a>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="w-6 h-6 text-white mt-1 shrink-0" strokeWidth={1.5} />
              <div>
                <h4 className="font-bold text-white text-[15px] mb-1">Bussiness Hours</h4>
                <p className="text-gray-400 text-sm">Monday to Friday</p>
                <p className="text-gray-400 text-sm">From 9 AM to 12 pM</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-16 max-w-[320px]">
            <p className="text-gray-400 text-xs leading-relaxed">
              Not Sure what you need? The team at Printpop will be happy to listen to you and suggest events ideas you hadn't considered
            </p>

            <div className="flex items-center gap-6 pt-2">
              <span className="font-bold text-white tracking-widest text-sm">FOLLOW US</span>
              <div className="flex items-center gap-4">
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Linkedin className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                </a>
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Facebook className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                </a>
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Instagram className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                </a>
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Youtube className="w-5 h-5 relative z-10" strokeWidth={1.5} />
                </a>
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z" /><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" /></svg>
                </a>
                <a href="#" className="relative flex items-center justify-center w-8 h-8 rounded-full text-white transition-all overflow-hidden group hover:scale-110 hover:border-transparent">
                  <div className="absolute inset-0 bg-linear-to-r from-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <svg className="relative z-10" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4v-12a5 5 0 0 0 5 5" /></svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
