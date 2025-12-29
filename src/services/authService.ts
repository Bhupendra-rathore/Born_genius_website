import { supabase } from '../lib/supabase';

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
};

export const loginWithEmailOTP = async (email: string) => {
  await supabase.auth.signInWithOtp({
    email,
  });
};

export const setPassword = async (password: string) => {
  await supabase.auth.updateUser({ password });
};
