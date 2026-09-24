export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      slog_admin_users: {
        Row: {
          id: string;
          email: string;
          role: "owner" | "admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: "owner" | "admin";
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: "owner" | "admin";
          created_at?: string;
        };
        Relationships: [];
      };
      slog_posts: {
        Row: {
          id: string;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string;
          cover_image: string | null;
          location: string | null;
          trip_date: string;
          published: boolean;
          featured: boolean;
          gallery_images: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          location?: string | null;
          trip_date?: string;
          published?: boolean;
          featured?: boolean;
          gallery_images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          excerpt?: string | null;
          content?: string;
          cover_image?: string | null;
          location?: string | null;
          trip_date?: string;
          published?: boolean;
          featured?: boolean;
          gallery_images?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      slog_media: {
        Row: {
          id: string;
          file_name: string;
          file_path: string;
          public_url: string;
          mime_type: string | null;
          size_bytes: number | null;
          caption: string | null;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_path: string;
          public_url: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          caption?: string | null;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          file_path?: string;
          public_url?: string;
          mime_type?: string | null;
          size_bytes?: number | null;
          caption?: string | null;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      slog_is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Post = Database["public"]["Tables"]["slog_posts"]["Row"];
export type PostInsert = Database["public"]["Tables"]["slog_posts"]["Insert"];
export type PostUpdate = Database["public"]["Tables"]["slog_posts"]["Update"];

export type MediaItem = Database["public"]["Tables"]["slog_media"]["Row"];
export type MediaInsert = Database["public"]["Tables"]["slog_media"]["Insert"];

export type AdminUser = Database["public"]["Tables"]["slog_admin_users"]["Row"];
