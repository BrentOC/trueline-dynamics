// src/utils/supabase/client.ts
import { createBrowserClient } from '@supabase/supabase-js';

// Load keys from the .env.local file using environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// This object handles all data fetching for the browser (frontend)
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);