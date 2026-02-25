'use client';

import Image from 'next/image';
import Link from 'next/link';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Flame, Mail, Camera } from 'lucide-react';

const featuredPost = {
  id: 1,
  title: 'TOP 10 NEON CASE DESIGNS FOR 2024',
  excerpt: 'Looking to brighten up your daily carry? We\'ve curated the wildest, brightest, and most electrifying designs hitting the store this month!',
  category: 'TRENDING NOW',
  image: 'https://images.unsplash.com/photo-1601593346740-925612772716?q=80&w=2070&auto=format&fit=crop',
};

const blogPosts = [
  {
    id: 2,
    title: 'LEVEL UP YOUR MIRROR SELFIES',
    excerpt: 'Is your OOTD looking dull? Here are 5 quick tips to make your mirror selfies pop using our reflective cases. Angles matter!',
    date: '2 days ago',
    category: 'Photography',
    image: 'https://images.unsplash.com/photo-1511556820780-d912e42b4980?q=80&w=1974&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'WILL IT BREAK? THE CONCRETE TEST.',
    excerpt: 'We dropped our newest \'Armored Neon\' series from a 2-story building. You won\'t believe the results (spoiler: the phone lived!).',
    date: '5 days ago',
    category: 'Protection',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351cb315?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 4,
    title: 'MEET THE DESIGNER: SARAH K.',
    excerpt: 'The mind behind the \'Electric Jungle\' collection speaks about her inspiration, color choices, and love for retro aesthetics.',
    date: '1 week ago',
    category: 'Artist Spotlight',
    image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2071&auto=format&fit=crop',
  },
  {
    id: 5,
    title: 'KEEP IT CLEAN: CASE HYGIENE 101',
    excerpt: 'Your phone case goes everywhere with you. Here\'s how to keep it germ-free and looking brand new without damaging the print.',
    date: '2 weeks ago',
    category: 'Care Tips',
    image: 'https://images.unsplash.com/photo-1584820927498-cafe8c1c91ce?q=80&w=2070&auto=format&fit=crop',
  },
];

const trendingTopics = [
  '#NeonVibes', '#PhoneSafety', '#CustomArt', '#AndroidMods', '#iPhone15', '#Sustainable'
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#111111] font-sans pb-24">
      {/* Header Section */}
      <div className="bg-[#161616]">
        <PageHeader
          head="THE POP FEED"
          description={
            <>
              All the latest buzz, trends, and tips from the world of PrintPop. <br />
              Stay updated with the latest trends and get inspired with our latest blog posts.
            </>
          }
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-16">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left Column: Posts */}
          <div className="flex-1 space-y-8">

            {/* Featured Post */}
            <Link href={`/blog/${featuredPost.id}`} className="block group">
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <span className="inline-block bg-[#FF3366] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-[#5CE1E6] transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="text-[#D1D5DB] text-sm md:text-base max-w-2xl font-comic">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </div>
            </Link>

            {/* Post Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {blogPosts.map((post) => (
                <Link href={`/blog/${post.id}`} key={post.id} className="block group h-full">
                  <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden h-full flex flex-col border border-[#333333] hover:border-[#5CE1E6]/50 transition-colors">
                    {/* Image */}
                    <div className="relative h-56 w-full overflow-hidden bg-[#000000]">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      />
                      {post.id === 2 && (
                        <div className="absolute top-4 right-4 bg-black/50 p-2 rounded-lg backdrop-blur-sm">
                          <Camera size={20} className="text-white" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-3 font-comic">
                        <span>🕒 {post.date} • <span className="text-[#5CE1E6] font-semibold">{post.category}</span></span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#FF3366] transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-[#9CA3AF] text-sm flex-1 font-comic line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="mt-6">
                        <span className="text-[#5CE1E6] text-sm font-bold tracking-wider hover:underline uppercase">
                          Read More
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-2 pt-8">
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 border-0 h-10 px-4 rounded-lg font-semibold">Prev</Button>
              <Button className="bg-[#FF3366] text-white hover:bg-[#FF3366]/90 border-0 h-10 w-10 p-0 rounded-lg shadow-[0_0_15px_rgba(255,51,102,0.5)]">1</Button>
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 border-0 h-10 w-10 p-0 rounded-lg font-semibold">2</Button>
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 border-0 h-10 w-10 p-0 rounded-lg font-semibold">3</Button>
              <Button variant="outline" className="bg-white text-black hover:bg-gray-200 border-0 h-10 px-4 rounded-lg font-semibold">Next</Button>
            </div>

          </div>

          {/* Right Column: Sidebar */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            <div className="sticky top-24 space-y-6">

              {/* Search Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100">
                <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase">Search Posts</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    type="text"
                    placeholder="Keywords..."
                    className="pl-10 bg-gray-50 border-gray-200 text-black placeholder:text-gray-400 focus-visible:ring-1 focus-visible:ring-[#5CE1E6] rounded-xl h-11"
                  />
                </div>
              </div>

              {/* Trending Topics Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tr from-[#5CE1E6]/20 to-[#FF3366]/20 blur-3xl rounded-full -ml-16 -mb-16 pointer-events-none"></div>

                <h3 className="text-black font-bold text-lg mb-4 tracking-wider uppercase flex items-center gap-2 relative z-10">
                  <Flame className="text-[#FF3366]" size={20} />
                  Trending Topics
                </h3>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {trendingTopics.map((topic, i) => (
                    <span
                      key={i}
                      className="text-xs font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-full hover:bg-gray-200 hover:text-black transition-colors cursor-pointer"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              {/* Join The Club Widget */}
              <div className="bg-[#1A1A1A] rounded-2xl p-6 relative overflow-hidden border border-[#333333]">
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF3366]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#5CE1E6]/20 blur-3xl rounded-full -translate-x-1/2 translate-y-1/2"></div>

                <div className="relative z-10 text-center flex flex-col items-center">
                  <Mail className="text-white mb-3" size={28} />
                  <h3 className="text-white font-bold text-xl mb-2 tracking-wider">JOIN THE CLUB</h3>
                  <p className="text-[#9CA3AF] text-xs font-comic mb-5">
                    Get exclusive discounts and first access to new neon drops!
                  </p>

                  <div className="w-full space-y-3">
                    <Input
                      type="email"
                      placeholder="Your email"
                      className="bg-[#2A2A2A] border-[#444444] text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-[#5CE1E6] rounded-xl h-11 w-full"
                    />
                    <Button className="w-full bg-linear-to-r from-[#FF3366] to-[#9933FF] hover:opacity-90 text-white border-0 h-11 rounded-xl shadow-[0_0_15px_rgba(255,51,102,0.3)] font-semibold tracking-wide">
                      SUBSCRIBE
                    </Button>
                  </div>
                </div>
              </div>

              {/* Instagram/Social Widget */}
              <div className="bg-white rounded-2xl p-6 shadow-lg shadow-white/5 border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-black font-bold text-lg tracking-wider uppercase">@PRINTPOP</h3>
                  <Camera className="text-[#FF3366]" size={20} />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6].map((idx) => (
                    <div key={idx} className="aspect-square bg-gray-200 rounded-lg overflow-hidden group relative cursor-pointer">
                      <Image
                        src={`https://images.unsplash.com/photo-${1500000000000 + idx}?q=80&w=200&auto=format&fit=crop`}
                        alt={`Social post ${idx}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
