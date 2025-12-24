
// Mock implementation of Supabase client for frontend-only environment
// In a real Vercel deployment, you would import { createClient } from '@supabase/supabase-js'
export const supabase = {
  from: (table: string) => ({
    select: () => ({ data: [], error: null }),
    insert: (data: any) => ({ data, error: null }),
    update: (data: any) => ({ data, error: null }),
    delete: () => ({ data: null, error: null }),
  })
};

export const generateClientID = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let result = "";
  for (let i = 0; i < 3; i++) result += letters.charAt(Math.floor(Math.random() * letters.length));
  for (let i = 0; i < 3; i++) result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  return result;
};
