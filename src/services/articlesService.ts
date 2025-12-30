import { supabase } from '../lib/supabase';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  author_photo?: string;
  reading_time_minutes?: number;
  views_count?: number;
  published_date: string;
}

/* =========================
   FETCH ALL PUBLISHED BLOGS
========================= */
export const fetchPublishedArticles = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      author_photo,
      reading_time_minutes,
      views_count,
      published_date
    `)
    .eq('status', 'published')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Blog fetch error:', error);
    throw error;
  }

  return data || [];
};

/* =========================
   FETCH RANDOM 3 BLOGS (HOME)
========================= */
/* =========================
   FETCH RANDOM 3 BLOGS (HOME)
========================= */
export const fetchRandomBlogs = async (): Promise<Article[]> => {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      slug,
      excerpt,
      category,
      author,
      author_photo,
      published_date
    `)
    .eq('status', 'published')
    .limit(12); // 👈 fetch more

  if (error) {
    console.error('Random blog fetch error:', error);
    throw error;
  }

  if (!data) return [];

  // ✅ Proper randomization
  return data.sort(() => 0.5 - Math.random()).slice(0, 3);
};

/* =========================
   FETCH BLOG BY SLUG
========================= */
export const fetchArticleBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from('blogs')
    .select(`
      id,
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      author_photo,
      reading_time_minutes,
      views_count,
      published_date
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    console.error('Fetch article by slug error:', error);
    throw error;
  }

  return data;
};
/* =========================
   INCREMENT BLOG VIEW COUNT
========================= */
export const incrementArticleViews = async (articleId: string): Promise<void> => {
  const { error } = await supabase.rpc('increment_blog_views', {
    blog_id: articleId,
  });

  if (error) {
    console.error('Increment views error:', error);
  }
};