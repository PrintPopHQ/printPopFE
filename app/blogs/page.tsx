import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Search, Flame } from 'lucide-react';
import { BlogSidebar } from '@/components/blogs/BlogSidebar';
import type { Blog, BlogMeta } from '@/services/ApiService';

/* ─── SEO ────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'The Pop Feed | PrintPop Blog',
  description:
    'All the latest buzz, trends, and tips from the world of PrintPop. Stay updated with custom phone case trends, design inspiration, and care guides.',
  openGraph: {
    title: 'The Pop Feed | PrintPop Blog',
    description:
      'Stay updated with the latest trends and get inspired with our latest blog posts from PrintPop.',
    type: 'website',
  },
};

/* ─── Constants ──────────────────────────────────────────────────────── */
const LIMIT = 6;
const BASE_URL = 'https://printpop-be.onrender.com';

// const trendingTopics = [
//   '#NeonVibes', '#PhoneSafety', '#CustomArt', '#AndroidMods', '#iPhone15', '#Sustainable',
// ];

/* ─── Fetch helper ───────────────────────────────────────────────────── */
async function fetchBlogs(
  page: number,
  search?: string,
): Promise<{ blogs: Blog[]; meta: BlogMeta } | null> {
  try {
    const url = new URL('/api/blogs', BASE_URL);
    
    if (search) {
      // If searching, fetch a large enough set to filter locally
      url.searchParams.set('page', '1');
      url.searchParams.set('limit', '500'); // Assuming max 500 blogs for search
      url.searchParams.set('published', 'true');

      const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
      });

      if (!res.ok) return null;
      const json = await res.json();
      if (json.responseCode !== 2000) return null;

      const allBlogs = json.data.blogs as Blog[];
      const filteredBlogs = allBlogs.filter((blog) =>
        blog.title.toLowerCase().includes(search.toLowerCase())
      );

      const total = filteredBlogs.length;
      const totalPages = Math.ceil(total / LIMIT);
      const start = (page - 1) * LIMIT;
      const paginatedBlogs = filteredBlogs.slice(start, start + LIMIT);

      return {
        blogs: paginatedBlogs,
        meta: {
          total,
          page,
          limit: LIMIT,
          totalPages,
        },
      };
    } else {
      url.searchParams.set('page', String(page));
      url.searchParams.set('limit', String(LIMIT));
      url.searchParams.set('published', 'true');

      const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
      });

      if (!res.ok) return null;
      const json = await res.json();
      if (json.responseCode !== 2000) return null;

      return json.data as { blogs: Blog[]; meta: BlogMeta };
    }
  } catch {
    return null;
  }
}

/* ─── Helpers ────────────────────────────────────────────────────────── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/* ─── Page ───────────────────────────────────────────────────────────── */
export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const { page: pageParam, search } = await searchParams;
  const page = Math.max(1, Number(pageParam ?? 1));

  const result = await fetchBlogs(page, search);
  const blogs: Blog[] = result?.blogs ?? [];
  const meta: BlogMeta = result?.meta ?? { total: 0, page, limit: LIMIT, totalPages: 1 };

  const featuredPost = blogs[0] ?? null;
  const gridPosts = blogs.slice(1);

  return (
    <div className="min-h-screen bg-[#111111] font-sans pb-24">
      {/* Header */}
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

          {/* ── Left Column ── */}
          <div className="flex-1 space-y-8">

            {/* Error / Empty state */}
            {!result && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-[#9CA3AF]">
                <p className="text-2xl font-bold text-[#FF3366]">Oops!</p>
                <p className="text-sm font-comic">Failed to load blogs. Please try again later.</p>
              </div>
            )}

            {result && blogs.length === 0 && (
              <div className="flex flex-col items-center justify-center py-32 gap-3 text-[#9CA3AF]">
                <p className="text-sm font-comic">No blog posts found.</p>
              </div>
            )}

            {/* Featured Post */}
            {featuredPost && (
              <Link href={`/blogs/${featuredPost.slug}`} className="block group">
                <div className="relative h-[400px] w-full rounded-2xl overflow-hidden">
                  <Image
                    src={featuredPost.cover_image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="inline-block bg-[#FF3366] text-white text-xs font-bold px-3 py-1 rounded-full mb-4 tracking-wider">
                      FEATURED
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:text-[#5CE1E6] transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="text-[#D1D5DB] text-sm md:text-base font-comic">
                      By {featuredPost.author_name} · {formatDate(featuredPost.created_at)}
                    </p>
                  </div>
                </div>
              </Link>
            )}

            {/* Post Grid */}
            {gridPosts.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {gridPosts.map((post) => (
                  <Link href={`/blogs/${post.slug}`} key={post.id} className="block group h-full">
                    <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden h-full flex flex-col border border-[#333333] hover:border-[#5CE1E6]/50 transition-colors">
                      <div className="relative h-56 w-full overflow-hidden bg-[#000000]">
                        <Image
                          src={post.cover_image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                        />
                      </div>
                      <div className="p-6 flex flex-col flex-1">
                        <div className="flex items-center gap-3 text-xs text-[#9CA3AF] mb-3 font-comic">
                          <span>
                            🕒 {formatDate(post.created_at)} ·{' '}
                            <span className="text-[#5CE1E6] font-semibold">{post.author_name}</span>
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 leading-tight group-hover:text-[#FF3366] transition-colors">
                          {post.title}
                        </h3>
                        <div className="mt-auto pt-4">
                          <span className="text-[#5CE1E6] text-sm font-bold tracking-wider hover:underline uppercase">
                            Read More
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination – plain <a> tags so no JS needed */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-8">
                <Link
                  href={`/blogs?page=${page - 1}${search ? `&search=${search}` : ''}`}
                  aria-disabled={page === 1}
                  className={`h-10 px-4 rounded-lg font-semibold text-sm inline-flex items-center bg-white text-black hover:bg-gray-200 transition-colors ${page === 1 ? 'pointer-events-none opacity-40' : ''
                    }`}
                >
                  Prev
                </Link>

                {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blogs?page=${p}${search ? `&search=${search}` : ''}`}
                    className={`h-10 w-10 rounded-lg font-semibold text-sm inline-flex items-center justify-center transition-colors ${p === page
                      ? 'bg-[#FF3366] text-white shadow-[0_0_15px_rgba(255,51,102,0.5)]'
                      : 'bg-white text-black hover:bg-gray-200'
                      }`}
                  >
                    {p}
                  </Link>
                ))}

                <Link
                  href={`/blogs?page=${page + 1}${search ? `&search=${search}` : ''}`}
                  aria-disabled={page === meta.totalPages}
                  className={`h-10 px-4 rounded-lg font-semibold text-sm inline-flex items-center bg-white text-black hover:bg-gray-200 transition-colors ${page === meta.totalPages ? 'pointer-events-none opacity-40' : ''
                    }`}
                >
                  Next
                </Link>
              </div>
            )}
          </div>

          {/* ── Right Column: Sidebar ── */}
          <BlogSidebar />

        </div>
      </div>
    </div>
  );
}
