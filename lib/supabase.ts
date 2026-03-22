import { createClient } from "@supabase/supabase-js";

// 先ほど .env.local に書いた情報を読み込みます
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Supabaseと接続するための「道具」をエクスポートします
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
