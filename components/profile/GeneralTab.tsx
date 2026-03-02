'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';
import { getUser } from '@/lib/auth-store';

export function GeneralTab() {
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");

  useEffect(() => {
    const user = getUser();
    if (user) {
      if (user.email) setUserEmail(user.email);
      const anyUser = user as any;
      if (anyUser.full_name) setUserName(anyUser.full_name);
      else if (anyUser.name) setUserName(anyUser.name);

      if (anyUser.phone) setUserPhone(anyUser.phone);
    }
  }, []);

  return (
    <div className="space-y-8 md:max-w-xl">
      {/* Profile Picture Upload Section */}
      {/* <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            <button className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-6 h-6 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center hover:bg-[#1a3355] transition-colors">
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>
          <Button
            className="text-white font-medium h-10 px-6 rounded-xl shadow-glow-red hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
          >
            Upload Picture
          </Button>
        </div>
        <p className="text-sm text-gray-400">Upload Profile Picture (Max size 5 MB)</p>
      </div> */}

      {/* Form Fields */}
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Full Name</label>
          <Input
            name="name"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Enter your Name"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Email</label>
          <Input
            name="email"
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            disabled
            placeholder="Enter your Email"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-gray-400 placeholder:text-gray-500 focus-visible:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Phone</label>
          <Input
            name="phone"
            type="text"
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="Enter your Phone"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="pt-6">
        <Button
          className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          SAVE PROFILE
        </Button>
      </div>
    </div>
  );
}
