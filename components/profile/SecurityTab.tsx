'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

export function SecurityTab() {
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  return (
    <div className="space-y-8 md:max-w-xl">
      <div className="space-y-6 pt-4">
        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">Current Password</label>
          <div className="relative">
            <Input
              name="currentPassword"
              type={showPassword.current ? "text" : "password"}
              placeholder="Enter Current Password"
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, current: !showPassword.current })}
            >
              {showPassword.current ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">New Password</label>
          <div className="relative">
            <Input
              name="newPassword"
              type={showPassword.new ? "text" : "password"}
              placeholder="Enter New Password"
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
            >
              {showPassword.new ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-medium text-white">Confirm New Password</label>
          <div className="relative">
            <Input
              name="confirmPassword"
              type={showPassword.confirm ? "text" : "password"}
              placeholder="Confirm New Password"
              className="bg-[#112238] border-transparent h-12 rounded-xl text-white placeholder:text-gray-500 pr-10 focus-visible:ring-primary"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
            >
              {showPassword.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button
          className="w-full text-white font-bold h-12 rounded-xl font-neon tracking-widest shadow-glow-red hover:opacity-90 transition-opacity"
          style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }}
        >
          UPDATE PASSWORD
        </Button>
      </div>
    </div>
  );
}
