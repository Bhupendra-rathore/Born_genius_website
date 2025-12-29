import { supabase } from '../lib/supabase';

export const getMyProfile = async () => {
  const { data } = await supabase
    .from('user_profiles')
    .select('*')
    .single();

  return data;
};

export const createProfile = async (profile: {
  parent_name: string;
  child_name: string;
  child_age: number;
  phone?: string;
}) => {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error('Not logged in');

  await supabase.from('user_profiles').insert({
    id: user.id,
    email: user.email,
    ...profile,
  });
};
