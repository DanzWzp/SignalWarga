export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "citizen" | "admin" | "officer";

export type ReportCategory =
  | "jalan_rusak"
  | "banjir"
  | "sampah"
  | "lampu_mati"
  | "pohon_tumbang"
  | "fasilitas_rusak"
  | "lainnya";

export type ReportStatus =
  | "pending"
  | "verified"
  | "in_progress"
  | "resolved"
  | "rejected";

export type ReportPriority = "low" | "medium" | "high" | "urgent";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      reports: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: ReportCategory;
          status: ReportStatus;
          priority: ReportPriority;
          latitude: number;
          longitude: number;
          address: string | null;
          rt: string | null;
          rw: string | null;
          kelurahan: string | null;
          kecamatan: string | null;
          city: string | null;
          province: string | null;
          postal_code: string | null;
          photo_url: string | null;
          created_by: string | null;
          assigned_to: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: ReportCategory;
          status?: ReportStatus;
          priority?: ReportPriority;
          latitude: number;
          longitude: number;
          address?: string | null;
          rt?: string | null;
          rw?: string | null;
          kelurahan?: string | null;
          kecamatan?: string | null;
          city?: string | null;
          province?: string | null;
          postal_code?: string | null;
          photo_url?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: ReportCategory;
          status?: ReportStatus;
          priority?: ReportPriority;
          latitude?: number;
          longitude?: number;
          address?: string | null;
          rt?: string | null;
          rw?: string | null;
          kelurahan?: string | null;
          kecamatan?: string | null;
          city?: string | null;
          province?: string | null;
          postal_code?: string | null;
          photo_url?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reports_assigned_to_fkey";
            columns: ["assigned_to"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reports_created_by_fkey";
            columns: ["created_by"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      report_updates: {
        Row: {
          id: string;
          report_id: string | null;
          user_id: string | null;
          status: ReportStatus | null;
          note: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          report_id?: string | null;
          user_id?: string | null;
          status?: ReportStatus | null;
          note?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          report_id?: string | null;
          user_id?: string | null;
          status?: ReportStatus | null;
          note?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "report_updates_report_id_fkey";
            columns: ["report_id"];
            referencedRelation: "reports";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "report_updates_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Report = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];
export type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"];
export type ReportTimeline = Database["public"]["Tables"]["report_updates"]["Row"];

export type ReportWithProfile = Report & {
  profiles?: Pick<Profile, "id" | "full_name" | "avatar_url" | "role"> | null;
};

export type ReportDetail = Report & {
  profiles?: Pick<Profile, "id" | "full_name" | "avatar_url" | "role" | "phone"> | null;
  assigned_profile?: Pick<Profile, "id" | "full_name" | "role"> | null;
  report_updates?: (ReportTimeline & {
    profiles?: Pick<Profile, "id" | "full_name" | "role"> | null;
  })[];
};
