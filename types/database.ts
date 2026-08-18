export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      passages: {
        Row: {
          id: number;
          book: string;
          chapter: number;
          verse_start: number;
          verse_end: number | null;
          content: string;
          version: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          book: string;
          chapter: number;
          verse_start: number;
          verse_end?: number | null;
          content: string;
          version?: string;
          created_at?: string;
        };
        Update: {
          id?: number;
          book?: string;
          chapter?: number;
          verse_start?: number;
          verse_end?: number | null;
          content?: string;
          version?: string;
          created_at?: string;
        };
      };
      game_progress: {
        Row: {
          id: string;
          user_id: string;
          passage_id: number;
          score: number;
          completed: boolean;
          time_spent_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          passage_id: number;
          score?: number;
          completed?: boolean;
          time_spent_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          passage_id?: number;
          score?: number;
          completed?: boolean;
          time_spent_seconds?: number;
          created_at?: string;
        };
      };
      rankings: {
        Row: {
          id: string;
          user_id: string;
          total_score: number;
          games_played: number;
          streak_days: number;
          last_played_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          total_score?: number;
          games_played?: number;
          streak_days?: number;
          last_played_at?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          total_score?: number;
          games_played?: number;
          streak_days?: number;
          last_played_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
