import Link from "next/link";
import Image from "next/image";
import { X, Instagram, Linkedin, Facebook, Youtube } from "lucide-react";
import { Newsletter } from "@/components/footer/Newsletter";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className="p-px"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a8.87 8.87 0 0 1-1.87-1.34c-.01 1.05-.01 2.1-.01 3.14 0 2.22-.44 4.39-1.8 6.13-1.6 2.05-4.25 3.19-6.79 3.03-2.54-.16-5-1.55-6.19-3.81-1.18-2.25-1.01-5.1.43-7.18 1.44-2.11 4.11-3.26 6.64-2.88v4.03a4.03 4.03 0 0 0-2.85 1.79c-.83 1.2-.76 2.87.16 3.98.92 1.1 2.5 1.51 3.84 1.01 1.34-.5 2.22-1.83 2.22-3.26V.02Z" />
  </svg>
);

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" fillRule="evenodd"><path d="M818 800 498.11 333.745l.546.437L787.084 0h-96.385L455.738 272 269.15 0H16.367l298.648 435.31-.036-.037L0 800h96.385l261.222-302.618L565.217 800zM230.96 72.727l448.827 654.546h-76.38L154.217 72.727z" transform="translate(103 112)" /></svg>
);

export function Footer() {
  return (
    <>
      <Newsletter />
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link href="/" className="inline-block relative">
              <Image
                src="/printpop-logo.svg"
                alt="PrintPop"
                width={160}
                height={50}
                className="object-contain"
              />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Create personalised phone cases with Printpop. Design your custom phone case easily and stylishly. 📱✨
            </p>
          </div>

          {/* Shop Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-linear-to-b from-[#FF3131] to-[#FF3131]/0 rounded-full" />
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Shop
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Design", href: "/customize" },
                { name: "Trending Styles", href: "/#trending-styles" },
                { name: "Blogs", href: "/blogs" },
                { name: "Franchise", href: "/franchise" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#FF3131] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-gray-400 group-hover:text-[#FF3131] transition-colors">
                      ›
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-linear-to-b from-[#5CE1E6] to-[#5CE1E6]/0 rounded-full" />
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Policies
              </h3>
            </div>
            <ul className="space-y-4">
              {[
                { name: "Terms of Use", href: "/blogs/terms-conditions" },
                { name: "Privacy Policy", href: "/blogs/privacy-policy" },
                { name: "Returns and Refunds", href: "/blogs/refund-returns-policy" },
                { name: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-400 hover:text-[#5CE1E6] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="text-gray-400 group-hover:text-[#5CE1E6] transition-colors">
                      ›
                    </span>
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-linear-to-b from-[#D946EF] to-[#D946EF]/0 rounded-full" />
              <h3 className="text-sm font-semibold tracking-wider uppercase">
                Connect
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4 w-fit mx-auto md:mx-0">
              {[
                {
                  icon: Facebook,
                  href: "https://www.facebook.com/people/Print-POP/61575643527682/",
                  hoverClass:
                    "hover:bg-[#1877F2] hover:text-white shadow-[#1877F2]/25",
                },
                {
                  icon: XIcon,
                  href: "https://x.com/print__pop",
                  hoverClass:
                    "hover:bg-[#5CE1E6] hover:text-[#112238] shadow-[#5CE1E6]/25",
                },
                {
                  icon: Instagram,
                  href: "https://www.instagram.com/printpopptyltd/",
                  hoverClass:
                    "hover:bg-[#FF3131] hover:text-white shadow-[#FF3131]/25",
                },
                {
                  icon: TikTokIcon,
                  href: "https://www.tiktok.com/@print._.pop",
                  hoverClass:
                    "hover:bg-black hover:text-white shadow-white/25",
                },
                {
                  icon: Youtube,
                  href: "https://www.youtube.com/@Print_POP",
                  hoverClass:
                    "hover:bg-[#FF0000] hover:text-white shadow-[#FF0000]/25",
                },
                {
                  icon: Linkedin,
                  href: "https://www.linkedin.com/company/printpopptyltd/",
                  hoverClass:
                    "hover:bg-purple-600 hover:text-white shadow-purple-600/25",
                },
              ].map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 transition-all hover:scale-110 shadow-lg ${social.hoverClass}`}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
            <p className="text-gray-500 text-xs">
              Tag us @PrintPop for a chance to be featured!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} Printopop Pty Ltd. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="/blogs/privacy-policy"
              className="text-gray-600 hover:text-gray-200 text-xs transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/blogs/terms-conditions"
              className="text-gray-600 hover:text-gray-200 text-xs transition-colors"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
