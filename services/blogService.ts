import { BlogPost } from '../types';
import { INITIAL_BLOG_POSTS } from '../constants';
import { supabase } from './supabaseClient';

export const blogService = {
  getAll: async (): Promise<BlogPost[]> => {
    // Fallback if no DB connection
    if (!supabase) {
      return INITIAL_BLOG_POSTS;
    }

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('date', { ascending: false }); // Assuming standard string dates, ISO 8601 preferred for real sorting

      if (error) {
        console.error('Supabase Fetch Error:', error);
        return INITIAL_BLOG_POSTS;
      }

      // Map DB snake_case columns to our CamelCase TypeScript interface
      return data.map((post: any) => ({
        id: post.id,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        date: post.date,
        readTime: post.read_time,
        tags: post.tags || [],
        imageUrl: post.image_url
      }));
    } catch (e) {
      console.error("Unexpected error fetching posts:", e);
      return INITIAL_BLOG_POSTS;
    }
  },

  save: async (post: BlogPost): Promise<void> => {
    if (!supabase) {
      throw new Error("Database not connected. Cannot save.");
    }

    const dbPost = {
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      read_time: post.readTime,
      tags: post.tags,
      image_url: post.imageUrl
    };

    // Upsert handles both Insert (new ID) and Update (existing ID)
    const { error } = await supabase
      .from('posts')
      .upsert(dbPost);

    if (error) {
      console.error('Supabase Save Error:', error);
      throw new Error(`Failed to save: ${error.message}`);
    }
  },

  delete: async (id: string): Promise<void> => {
    if (!supabase) {
      throw new Error("Database not connected. Cannot delete.");
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase Delete Error:', error);
      throw new Error(`Failed to delete: ${error.message}`);
    }
  }
};