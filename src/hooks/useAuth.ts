import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  country_code: string;
  child_age: number | null;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const userEmail = localStorage.getItem('userEmail');

      if (userEmail) {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, name, phone, country_code, child_age')
          .eq('email', userEmail)
          .maybeSingle();

        if (data && !error) {
          setUser(data);
        } else {
          localStorage.removeItem('userEmail');
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, name, phone, country_code, child_age')
        .eq('email', email)
        .maybeSingle();

      if (data && !error) {
        localStorage.setItem('userEmail', email);
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, error: 'User not found' };
      }
    } catch (error) {
      console.error('Error logging in:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('userEmail');
    setUser(null);
  };

  const register = async (userData: Omit<User, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert({
          email: userData.email,
          name: userData.name,
          phone: userData.phone,
          country_code: userData.country_code,
          child_age: userData.child_age,
          source: 'web',
          status: 'active',
        })
        .select('id, email, name, phone, country_code, child_age')
        .maybeSingle();

      if (data && !error) {
        localStorage.setItem('userEmail', userData.email);
        setUser(data);
        return { success: true, user: data };
      } else {
        return { success: false, error: error?.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Error registering:', error);
      return { success: false, error: error?.message || 'Registration failed' };
    }
  };

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    register,
  };
};
