'use client';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface BillingDetailsProps {
  useSameAsShipping: boolean;
  setUseSameAsShipping: (val: boolean) => void;
  onChange: (data: any) => void;
}

export function BillingDetails({ useSameAsShipping, setUseSameAsShipping, onChange }: BillingDetailsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-wide text-[#FF3131]">BILLING DETAILS</h2>

      <div 
        className="flex items-center gap-3 cursor-pointer py-2 w-fit"
        onClick={() => setUseSameAsShipping(!useSameAsShipping)}
      >
        <div className={cn(
          "w-5 h-5 rounded-md border flex items-center justify-center transition-colors",
          useSameAsShipping ? "bg-[#5CE1E6] border-[#5CE1E6]" : "border-[#9CA3AF] bg-transparent"
        )}>
          {useSameAsShipping && <Check size={14} className="text-black" />}
        </div>
        <span className="text-sm text-white">Use same as shipping address</span>
      </div>

      {!useSameAsShipping && (
        <div className="space-y-6 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">First Name</label>
              <Input
                placeholder="John"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, firstName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Last Name</label>
              <Input
                placeholder="Martin"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, lastName: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Email Address</label>
            <Input
              type="email"
              placeholder="john.martin@gmail.com"
              className="bg-[#112238] border-none text-white h-12"
              onChange={(e) => onChange((prev: any) => ({ ...prev, email: e.target.value }))}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Phone Number</label>
            <Input
              type="tel"
              placeholder="+91 2344566"
              className="bg-[#112238] border-none text-white h-12"
              onChange={(e) => onChange((prev: any) => ({ ...prev, phone: e.target.value }))}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Suburb</label>
              <Input
                placeholder="Surry Hills"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, suburb: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">State</label>
              <Input
                placeholder="NSW"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, state: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Street Address 1</label>
              <Input
                placeholder="123 Example Street"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, streetAddress1: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Street Address 2</label>
              <Input
                placeholder="Apartment 4, Suite 10"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, streetAddress2: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Postal Code</label>
              <Input
                placeholder="4400"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, postal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white">Country</label>
              <Input
                placeholder="Australia"
                className="bg-[#112238] border-none text-white h-12"
                onChange={(e) => onChange((prev: any) => ({ ...prev, country: e.target.value }))}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
