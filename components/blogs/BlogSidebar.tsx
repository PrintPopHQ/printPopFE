'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, ArrowLeft } from 'lucide-react';

const trendingTopics = [
  '#NeonVibes', '#PhoneSafety', '#CustomArt', '#AndroidMods', '#iPhone15', '#Sustainable',
];

interface BlogSidebarProps {
  showBackCTA?: boolean;
}

export function BlogSidebar({ showBackCTA = false }: BlogSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Normalize slug: remove accidental hashtag or leading slash, but usually just use as is
      const slug = searchQuery.trim().replace(/^#/, '');
      router.push(`/blogs/${slug}`);
    }
  };

  const getTopicSlug = (topic: string) => {
    return topic.replace(/^#/, '');
  };

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      <div className="sticky top-24 space-y-6">

        {/* Search Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100">
          <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase">Search Posts</h3>
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Keywords..."
                className="w-full pl-10 pr-4 h-11 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5CE1E6]"
              />
            </div>
          </form>
        </div>

        {/* Trending Topics */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -ml-16 -mb-16 pointer-events-none" />
          <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase flex items-center gap-2 relative z-10">
            <Flame className="text-[#FF3366]" size={20} />
            Trending Topics
          </h3>
          <div className="flex flex-wrap gap-2 relative z-10">
            {trendingTopics.map((topic) => (
              <Link
                key={topic}
                href={`/blogs/${getTopicSlug(topic)}`}
                className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-black transition-colors"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>

        {/* Back to all posts CTA (Conditional for detail page) */}
        {showBackCTA && (
          <div className="bg-[#1A1A1A] rounded-2xl p-5 border border-[#2D2D2D] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-[#FF3366]/10 blur-3xl rounded-full pointer-events-none" />
            <p className="text-white font-bold text-sm mb-1.5 relative z-10">Explore More Posts</p>
            <p className="text-[#9CA3AF] text-xs font-comic mb-4 relative z-10">
              Discover more tips, trends, and stories from the PrintPop world.
            </p>
            <Link
              href="/blogs"
              className="relative z-10 inline-flex items-center gap-2 bg-[#FF3366] hover:bg-[#FF3366]/85 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shadow-[0_0_12px_rgba(255,51,102,0.3)]"
            >
              <ArrowLeft size={13} />
              All Posts
            </Link>
          </div>
        )}

      </div>
    </aside>
  );
}
