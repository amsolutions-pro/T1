import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export type Database = {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          email: string;
          nom: string;
          classe: string;
          matiere: string | null;
          source_utm: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nom: string;
          classe: string;
          matiere?: string | null;
          source_utm?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["leads"]["Insert"]>;
      };
      trial_bookings: {
        Row: {
          id: string;
          email: string;
          nom: string;
          classe: string;
          matiere: string;
          prof_souhaite: string | null;
          creneau_souhaite: string | null;
          stripe_session_id: string | null;
          status: "pending" | "confirmed" | "cancelled" | "refunded";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          nom: string;
          classe: string;
          matiere: string;
          prof_souhaite?: string | null;
          creneau_souhaite?: string | null;
          stripe_session_id?: string | null;
          status?: "pending" | "confirmed" | "cancelled" | "refunded";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["trial_bookings"]["Insert"]>;
      };
    };
  };
};

/**
 * Server-side Supabase client using the service-role key.
 * NEVER import this file from a client component.
 */
export function getSupabaseAdmin(): SupabaseClient<Database> {
  const env = getServerEnv();
  return createClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
