import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Search, Flame, ArrowLeft, Calendar, User } from 'lucide-react';
import { BlogSidebar } from '@/components/blogs/BlogSidebar';
import type { Blog } from '@/services/ApiService';

/* ─── Constants ──────────────────────────────────────────────────────── */
const BASE_URL = 'https://printpop-be.onrender.com';

// const trendingTopics = [
//   '#NeonVibes', '#PhoneSafety', '#CustomArt', '#AndroidMods', '#iPhone15', '#Sustainable',
// ];

/* ─── Fetch helper ───────────────────────────────────────────────────── */
async function fetchBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/blogs/slug/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.responseCode !== 2000) return null;
    return json.data as Blog;
  } catch {
    return null;
  }
}

/* ─── Dynamic metadata ───────────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await fetchBlog(slug);
  if (!blog) return { title: 'Blog Not Found | PrintPop' };
  return {
    title: `${blog.title} | PrintPop Blog`,
    description: `By ${blog.author_name} — Read this article on PrintPop's blog.`,
    openGraph: {
      title: blog.title,
      description: `By ${blog.author_name}`,
      images: [{ url: blog.cover_image }],
      type: 'article',
    },
  };
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await fetchBlog(slug);

  if (!blog) notFound();

  return (
    <div className="min-h-screen bg-[#111111] font-sans pb-24">
      {/* Header */}
      <div className="bg-[#161616]">
        <PageHeader
          head="BLOG DETAILS"
          description="Fresh drops, style hacks, and everything needed to keep your tech protected and looking 🔥"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 w-full pt-10">
        {/* Back link */}
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-[#9CA3AF] hover:text-[#5CE1E6] text-sm font-semibold mb-8 transition-colors group"
        >
          <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Main Content ── */}
          <article className="flex-1 min-w-0">

            {/* ① Hero Image */}
            {/* <div className="relative h-[320px] md:h-[420px] w-full rounded-2xl overflow-hidden mb-6">
              <Image
                src={blog.cover_image}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <span className="absolute top-5 left-5 bg-[#FF3366] text-white text-[10px] font-extrabold px-3 py-1 rounded-full tracking-widest uppercase shadow-[0_0_12px_rgba(255,51,102,0.6)]">
                TRENDING NOW
              </span>

              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h2 className="text-xl md:text-2xl font-extrabold text-white leading-snug uppercase mb-2">
                  {blog.title}
                </h2>
                <p className="text-[#D1D5DB] text-xs md:text-sm font-comic line-clamp-2 max-w-xl">
                  By {blog.author_name} — dive into this guide on PrintPop.
                </p>
              </div>
            </div> */}

            {/* ② Meta row */}
            <div className="flex flex-wrap items-center gap-1 text-xs text-[#9CA3AF] mb-5 font-comic">
              <span className="flex items-center gap-1">
                <User size={12} className="text-[#5CE1E6]" />
                {blog.author_name}
              </span>
              <span className="mx-1.5 text-[#555]">•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} className="text-[#5CE1E6]" />
                {formatDate(blog.created_at)}
              </span>
            </div>

            {/* ③ Article title (large, outside the hero) */}
            {/* <h1 className="text-2xl md:text-3xl font-extrabold text-white uppercase leading-tight mb-6 tracking-wide">
              {blog.title}
            </h1> */}

            {/* ④ Thin gradient divider */}
            <div className="h-px bg-linear-to-r from-[#FF3366]/50 via-[#5CE1E6]/40 to-transparent mb-8" />

            {/* ⑤ HTML Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

          </article>

          {/* ── Sidebar ── */}
          <BlogSidebar showBackCTA />

        </div>
      </div>
    </div>
  );
}
