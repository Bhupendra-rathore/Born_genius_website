import { supabase } from '../lib/supabase';

export const addToFavorites = async (courseId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('course_favorites').upsert({
    user_id: user.id,
    course_id: courseId,
  });
};

export const removeFromFavorites = async (courseId: string) => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from('course_favorites')
    .delete()
    .eq('user_id', user.id)
    .eq('course_id', courseId);
};

export const getUserFavorites = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from('course_favorites')
    .select('course_id')
    .eq('user_id', user.id);

  return data?.map(f => f.course_id) || [];
};
