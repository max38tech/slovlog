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
      admin_users: {
        Row: {
          id: string;
          email: string;
          role: 'owner' | 'admin';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'owner' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'owner' | 'admin';
          created_at?: string;
        };
      };
      posts: {
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
      };
      media: {
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
      };
    };
  };
}

export type Post = Database['public']['Tables']['posts']['Row'];
export type PostInsert = Database['public']['Tables']['posts']['Insert'];
export type PostUpdate = Database['public']['Tables']['posts']['Update'];

export type MediaItem = Database['public']['Tables']['media']['Row'];
export type MediaInsert = Database['public']['Tables']['media']['Insert'];

export type AdminUser = Database['public']['Tables']['admin_users']['Row'];
