'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';

export function NewsletterWidget() {
  const [email, setEmail] = useState('');

  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 relative overflow-hidden border border-[#333333]">
      <div className="absolute top-0 left-0 w-40 h-40 bg-[#FF3366]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-40 h-40 bg-[#5CE1E6]/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 text-center flex flex-col items-center">
        <Mail className="text-white mb-3" size={28} />
        <h3 className="text-white font-bold text-xl mb-2 tracking-wider">JOIN THE CLUB</h3>
        <p className="text-[#9CA3AF] text-xs font-comic mb-5">
          Get exclusive discounts and first access to new neon drops!
        </p>

        <div className="w-full space-y-3">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="bg-[#2A2A2A] border-[#444444] text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#5CE1E6] rounded-xl h-11 w-full"
          />
          <Button className="w-full bg-linear-to-r from-[#FF3366] to-[#9933FF] hover:opacity-90 text-white border-0 h-11 rounded-xl shadow-[0_0_15px_rgba(255,51,102,0.3)] font-semibold tracking-wide">
            SUBSCRIBE
          </Button>
        </div>
      </div>
    </div>
  );
}
