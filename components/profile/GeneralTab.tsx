'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User, X } from 'lucide-react';

export function GeneralTab() {
  return (
    <div className="space-y-8 md:max-w-xl">
      {/* Profile Picture Upload Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          {/* Avatar Circle */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center">
              <User className="w-10 h-10 text-gray-400" />
            </div>
            {/* Remove Button */}
            <button className="absolute bottom-0 right-0 translate-x-1/4 translate-y-1/4 w-6 h-6 rounded-full bg-[#112238] border border-[#333333] flex items-center justify-center hover:bg-[#1a3355] transition-colors">
              <X className="w-3 h-3 text-red-500" />
            </button>
          </div>

          {/* Upload Button */}
          <Button
            className="text-white font-medium h-10 px-6 rounded-xl shadow-glow-red hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
          >
            Upload Picture
          </Button>
        </div>
        <p className="text-sm text-gray-400">Upload Profile Picture (Max size 5 MB)</p>
      </div>

      {/* Form Fields */}
      <div className="space-y-6 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Name*</label>
          <Input
            name="name"
            type="text"
            defaultValue="John Martin"
            placeholder="Enter your Name"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Email</label>
          <Input
            name="email"
            type="email"
            defaultValue="john.martin@gmail.com"
            placeholder="Enter your Email"
            className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 focus-visible:ring-primary"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Address*</label>
          <Input
            name="address"
            type="text"
            defaultValue="New Dehli India"
            placeholder="Enter your Address"
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
