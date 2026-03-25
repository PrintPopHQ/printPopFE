'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Flame, ArrowLeft, Loader2 } from 'lucide-react';
import { useGetBlogs } from '@/packages/Queries';

interface BlogSidebarProps {
  showBackCTA?: boolean;
}

export function BlogSidebar({ showBackCTA = false }: BlogSidebarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch a set of blogs (e.g., up to 100) to handle local search and trending
  const { data: blogsData, isLoading: isBlogsLoading } = useGetBlogs({
    limit: 100,
    published: true,
  });

  const allBlogs = blogsData?.blogs ?? [];

  // Local filtering for search results
  const searchResults = allBlogs
    .filter((blog) =>
      blog.title.toLowerCase().includes(debouncedSearch.toLowerCase())
    )
    .slice(0, 5);

  // Local sorting for trending (top 6 by updated_at)
  const trendingBlogs = [...allBlogs]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 6);

  const isSearchLoading = isBlogsLoading;
  const isTrendingLoading = isBlogsLoading;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsDropdownOpen(false);
      router.push(`/blogs?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <aside className="w-full lg:w-[320px] shrink-0 space-y-6">
      <div className="sticky top-24 space-y-6">

        {/* Search Widget */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100" ref={dropdownRef}>
          <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase">Search Posts</h3>
          <form onSubmit={handleSearch} className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder="Keywords..."
                className="w-full pl-10 pr-4 h-11 rounded-xl bg-gray-50 border border-gray-200 text-black placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#5CE1E6]"
              />
              {isSearchLoading && searchQuery.length > 0 && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" size={16} />
              )}
            </div>

            {/* Search Dropdown */}
            {isDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-xl border border-gray-100 shadow-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                {isSearchLoading ? (
                  <div className="p-4 text-center text-gray-400 text-sm">Searching...</div>
                ) : searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((blog) => (
                      <Link
                        key={blog.id}
                        href={`/blogs/${blog.slug}`}
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className="block px-4 py-3 hover:bg-gray-50 transition-colors group"
                      >
                        <p className="text-sm font-bold text-gray-900 group-hover:text-[#FF3366] transition-colors line-clamp-1">
                          {blog.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-gray-400 text-sm font-comic">No posts found</div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Trending Posts */}
        <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100 relative overflow-hidden text-black">
          <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -ml-16 -mb-16 pointer-events-none" />
          <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase flex items-center gap-2 relative z-10">
            <Flame className="text-[#FF3366]" size={20} />
            Trending Posts
          </h3>
          
          <div className="space-y-4 relative z-10">
            {isTrendingLoading ? (
              <div className="flex justify-center py-4">
                <Loader2 className="text-[#FF3366] animate-spin" size={24} />
              </div>
            ) : trendingBlogs.length > 0 ? (
              trendingBlogs.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blogs/${blog.slug}`}
                  className="group flex gap-3 items-start"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 group-hover:bg-[#FF3366]/10 transition-colors">
                    <Flame className="text-gray-400 group-hover:text-[#FF3366] transition-colors" size={14} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-[#FF3366] transition-colors line-clamp-2 leading-snug">
                      {blog.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block">
                      {new Date(blog.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">No trending posts yet.</p>
            )}
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
