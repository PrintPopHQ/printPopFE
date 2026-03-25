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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const { data: shippingOptions, isLoading } = useShippingCostQuery(searchTrigger);

  // Filter for only Parcel Post and Express Post
  const filteredOptions = shippingOptions?.reduce((acc: any[], opt: any) => {
    const name = opt.name.toLowerCase();
    if (name.includes('parcel post') && !acc.find(a => a.name === 'Parcel Post')) {
      acc.push({ ...opt, name: 'Parcel Post' });
    } else if (name.includes('express post') && !acc.find(a => a.name === 'Express Post')) {
      acc.push({ ...opt, name: 'Express Post' });
    }
    return acc;
  }, []) || [];

  const handlePostcodeSearch = () => {
    if (postcode.trim().length >= 2) {
      setSearchTrigger(postcode.trim());
    }
  };

  useEffect(() => {
    if (filteredOptions.length > 0) {
      // Find Parcel Post as default
      const parcelPost = filteredOptions.find(opt => opt.name === 'Parcel Post');
      const expressPost = filteredOptions.find(opt => opt.name === 'Express Post');
      
      if (!selectedOption) {
        if (parcelPost) {
          setSelectedOption('Parcel Post');
          onShippingCostChange(parcelPost.price, 'Parcel Post');
        } else if (expressPost) {
          setSelectedOption('Express Post');
          onShippingCostChange(expressPost.price, 'Express Post');
        }
      } else {
        // If an option was already selected, update its price if it changed in new data
        const current = filteredOptions.find(opt => opt.name === selectedOption);
        if (current) {
          onShippingCostChange(current.price, current.name);
        }
      }
    }
  }, [filteredOptions, selectedOption, onShippingCostChange]);

  const handleOptionSelect = (name: string, price: number) => {
    setSelectedOption(name);
    onShippingCostChange(price, name);
  };

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
              onBlur={() => {
                if (postcode.trim()) {
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

        {!isLoading && filteredOptions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {filteredOptions.map((option) => (
              <button
                key={option.name}
                type="button"
                onClick={() => handleOptionSelect(option.name, option.price)}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-200",
                  selectedOption === option.name
                    ? "bg-[#112238] border-[#5CE1E6] text-white"
                    : "bg-[#0A1628] border-gray-800 text-gray-400 hover:border-gray-700"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center",
                    selectedOption === option.name ? "border-[#5CE1E6]" : "border-gray-600"
                  )}>
                    {selectedOption === option.name && (
                      <div className="w-2 h-2 rounded-full bg-[#5CE1E6]" />
                    )}
                  </div>
                  <span className="font-medium">{option.name}</span>
                </div>
                <span className="font-bold text-[#5CE1E6]">${option.price.toFixed(2)}</span>
              </button>
            ))}
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
