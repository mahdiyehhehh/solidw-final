/**
 * Hand-written types mirroring `supabase/migrations/*_create_businesses_table.sql`.
 *
 * If you have the Supabase CLI linked to your project, you can replace
 * this file with a generated one at any time:
 *
 *   supabase gen types typescript --linked > lib/supabase/database.types.ts
 *
 * Keep the shape (Database.public.Tables.<table>.Row/Insert/Update)
 * so `createClient<Database>()` continues to type `.from(...)` calls.
 */
export type Database = {
  public: {
    Tables: {
      businesses: {
        Row: {
          id: string;
          user_id: string;
          slug: string;
          name: string;
          category: string;
          description: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          address: string | null;
          city: string;
          country: string;
          logo_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          // Omitted on create — a database trigger derives a unique slug
          // from `name`. Callers may still pass one explicitly if a
          // future feature needs a custom slug.
          slug?: string;
          name: string;
          category: string;
          description?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          city: string;
          country: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          slug?: string;
          name?: string;
          category?: string;
          description?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          address?: string | null;
          city?: string;
          country?: string;
          logo_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      services: {
        Row: {
          id: string;
          business_id: string;
          name: string;
          description: string | null;
          duration_minutes: number;
          price: number;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          name: string;
          description?: string | null;
          duration_minutes: number;
          price: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          name?: string;
          description?: string | null;
          duration_minutes?: number;
          price?: number;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      appointments: {
        Row: {
          id: string;
          business_id: string;
          service_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          notes: string | null;
          appointment_date: string;
          appointment_time: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          business_id: string;
          service_id: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          notes?: string | null;
          appointment_date: string;
          appointment_time: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          business_id?: string;
          service_id?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          notes?: string | null;
          appointment_date?: string;
          appointment_time?: string;
          status?: string;
          created_at?: string;
        };
      };
    };
  };
};
