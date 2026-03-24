'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';
import { useShippingCostQuery } from '@/packages/Mutations';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ShippingDetailsProps {
  onChange: (data: any) => void;
  onShippingCostChange: (cost: number, name: string) => void;
}

export function ShippingDetails({ onChange, onShippingCostChange }: ShippingDetailsProps) {
  const [postcode, setPostcode] = useState('');
  const [searchTrigger, setSearchTrigger] = useState('');

  const { data: shippingOptions, isLoading } = useShippingCostQuery(searchTrigger);

  const handlePostcodeSearch = () => {
    if (postcode.trim().length >= 2) {
      setSearchTrigger(postcode.trim());
    }
  };

  useEffect(() => {
    if (shippingOptions && shippingOptions.length > 0) {
      // Find the Parcel Post pricing specifically
      const parcelPost = shippingOptions.find(opt => opt.name.toLowerCase().includes('parcel post'));
      if (parcelPost) {
        onShippingCostChange(parcelPost.price, 'Parcel Post');
      } else {
        // Fallback if not exactly named Parcel Post
        onShippingCostChange(shippingOptions[0].price, shippingOptions[0].name);
      }
    }
  }, [shippingOptions]);

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold tracking-wide text-[#FF3131]">SHIPPING DETAILS</h2>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Postal Code</label>
          <div className="relative">
            <Input
              value={postcode}
              required
              onChange={(e) => {
                setPostcode(e.target.value);
                onChange((prev: any) => ({ ...prev, postcode: e.target.value }));
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handlePostcodeSearch();
                }
              }}
              placeholder="44000"
              className="bg-[#112238] border-none text-white h-12 pr-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
            />
            <button
              onClick={handlePostcodeSearch}
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#333333] hover:bg-[#444444] rounded-md transition-colors"
            >
              <Search size={16} className="text-[#9CA3AF]" />
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center gap-2 text-[#5CE1E6] py-1 text-sm">
            <Loader2 size={16} className="animate-spin" />
            <span>Calculating shipping cost...</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">First Name</label>
            <Input
              required
              placeholder="John"
              className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
              onChange={(e) => onChange((prev: any) => ({ ...prev, firstName: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Last Name</label>
            <Input
              required
              placeholder="Martin"
              className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
              onChange={(e) => onChange((prev: any) => ({ ...prev, lastName: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Email Address</label>
          <Input
            required
            type="email"
            placeholder="john.martin@gmail.com"
            className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
            onChange={(e) => onChange((prev: any) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">Phone Number</label>
            <Input
              required
              type="tel"
              placeholder="+91 2344566"
              className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
              onChange={(e) => onChange((prev: any) => ({ ...prev, phone: e.target.value }))}
            />
          </div>
        </div>

        <h2 className="text-xl font-bold tracking-wide text-[#5CE1E6] pt-6 pb-2">SHIPPING ADDRESS</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white">City</label>
            <Input
              required
              placeholder="Delhi"
              className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
              onChange={(e) => onChange((prev: any) => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Address</label>
          <Input
            required
            placeholder="house Npo 123 Streat no 1234"
            className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
            onChange={(e) => onChange((prev: any) => ({ ...prev, address: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white">Country</label>
          <Input
            required
            placeholder="India"
            className="bg-[#112238] border-none text-white h-12 focus-visible:ring-1 focus-visible:ring-[#5CE1E6]"
            onChange={(e) => onChange((prev: any) => ({ ...prev, country: e.target.value }))}
          />
        </div>
      </div>
    </div>
  );
}
