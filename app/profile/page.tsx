'use client';

import { useState } from 'react';
import { GeneralTab } from '@/components/profile/GeneralTab';
import { SecurityTab } from '@/components/profile/SecurityTab';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<'general' | 'security'>('general');

  return (
    <div className="min-h-screen font-sans bg-[#000000]">
      <div className="max-w-7xl mx-auto px-4 w-full pt-12 pb-2">
        <h1 className="text-3xl md:text-4xl font-bold font-neon tracking-wide mb-2 text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #FFFFFF 0%, #9CA3AF 100%)" }}>USER PROFILE</h1>
        <p className="text-sm text-gray-400">Please enter following information to create your profile</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-6 pb-24">
        {/* Tabs */}
        <div className="flex space-x-4 mb-8 border-b border-[#333333]">
          <button
            className={`pb-4 px-2 text-sm font-medium transition-colors cursor-pointer relative ${activeTab === 'general' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('general')}
          >
            General
            {activeTab === 'general' && (
              <div className="absolute -bottom-px left-0 w-full h-0.5" style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }} />
            )}
          </button>
          <button
            className={`pb-4 px-2 text-sm font-medium transition-colors cursor-pointer relative ${activeTab === 'security' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            onClick={() => setActiveTab('security')}
          >
            Security
            {activeTab === 'security' && (
              <div className="absolute -bottom-px left-0 w-full h-0.5" style={{ background: "linear-gradient(90deg, #5CE1E6 0%, #FF3131 100%)" }} />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="">
          {activeTab === 'general' ? <GeneralTab /> : <SecurityTab />}
        </div>
      </div>
    </div>
  );
}
