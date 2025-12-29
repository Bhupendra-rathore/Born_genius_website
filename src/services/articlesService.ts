import { supabase } from '../lib/supabase';

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  author_photo?: string;
  image_url?: string;
  published_date: string;
  status: string;
  views_count?: number;
  upvotes_count?: number;
  reading_time_minutes?: number;
  created_at: string;
  updated_at: string;
}

export async function fetchPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching articles:', error);
    throw error;
  }

  return data || [];
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle();

  if (error) {
    console.error('Error fetching article:', error);
    throw error;
  }

  return data;
}

export async function fetchArticlesByCategory(category: string): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .order('published_date', { ascending: false });

  if (error) {
    console.error('Error fetching articles by category:', error);
    throw error;
  }

  return data || [];
}

export async function incrementArticleViews(articleId: string, sessionId: string): Promise<void> {
  try {
    await supabase.from('article_views').insert({
      article_id: articleId,
      session_id: sessionId,
    });

    await supabase.rpc('increment_article_views', { article_id: articleId });
  } catch (error) {
    console.error('Error incrementing article views:', error);
  }
}
