import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type Database = {
  public: {
    Tables: {
      leaderboard_entries: {
        Row: {
          id: string;
          name: string;
          score: number;
          character_id: "ivory-twin" | "onyx-twin";
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          score: number;
          character_id: "ivory-twin" | "onyx-twin";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          score?: number;
          character_id?: "ivory-twin" | "onyx-twin";
          created_at?: string;
        };
        Relationships: [];
      };
      used_run_tokens: {
        Row: {
          token_id: string;
          used_at: string;
        };
        Insert: {
          token_id: string;
          used_at?: string;
        };
        Update: {
          token_id?: string;
          used_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

let cachedClient: SupabaseClient<Database> | null = null;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function getSupabaseAdminClient(): SupabaseClient<Database> {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = createClient<Database>(
    requiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );

  return cachedClient;
}
