export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action: string
          admin_id: string | null
          created_at: string | null
          details: Json | null
          id: string
        }
        Insert: {
          action: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Update: {
          action?: string
          admin_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
        }
        Relationships: []
      }
      appointments: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          id: string
          message: string | null
          notes: string | null
          package_id: string | null
          patient_email: string | null
          patient_id: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time: string
          rejection_reason: string | null
          service_id: string | null
          slot_id: string | null
          status: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          package_id?: string | null
          patient_email?: string | null
          patient_id?: string | null
          patient_name: string
          patient_phone: string
          preferred_date: string
          preferred_time: string
          rejection_reason?: string | null
          service_id?: string | null
          slot_id?: string | null
          status?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          id?: string
          message?: string | null
          notes?: string | null
          package_id?: string | null
          patient_email?: string | null
          patient_id?: string | null
          patient_name?: string
          patient_phone?: string
          preferred_date?: string
          preferred_time?: string
          rejection_reason?: string | null
          service_id?: string | null
          slot_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_slot_id_fkey"
            columns: ["slot_id"]
            isOneToOne: true
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
        ]
      }
      clinic_settings: {
        Row: {
          address: string | null
          clinic_name: string
          consultation_fee: number | null
          email: string | null
          google_maps_embed: string | null
          id: string
          phone: string | null
          social_links: Json | null
          tagline: string | null
          updated_at: string | null
          whatsapp: string | null
          working_hours: Json | null
        }
        Insert: {
          address?: string | null
          clinic_name: string
          consultation_fee?: number | null
          email?: string | null
          google_maps_embed?: string | null
          id?: string
          phone?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          working_hours?: Json | null
        }
        Update: {
          address?: string | null
          clinic_name?: string
          consultation_fee?: number | null
          email?: string | null
          google_maps_embed?: string | null
          id?: string
          phone?: string | null
          social_links?: Json | null
          tagline?: string | null
          updated_at?: string | null
          whatsapp?: string | null
          working_hours?: Json | null
        }
        Relationships: []
      }
      doctors: {
        Row: {
          availability: string | null
          availability_json: Json | null
          consultation_type: string | null
          created_at: string | null
          designation: string
          display_order: number | null
          experience_description: string | null
          experience_years: number | null
          full_name: string
          id: string
          is_active: boolean | null
          photo_url: string | null
          profile_image: string | null
          qualification: string
          short_bio: string | null
          specialization: string
        }
        Insert: {
          availability?: string | null
          availability_json?: Json | null
          consultation_type?: string | null
          created_at?: string | null
          designation: string
          display_order?: number | null
          experience_description?: string | null
          experience_years?: number | null
          full_name: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          profile_image?: string | null
          qualification: string
          short_bio?: string | null
          specialization: string
        }
        Update: {
          availability?: string | null
          availability_json?: Json | null
          consultation_type?: string | null
          created_at?: string | null
          designation?: string
          display_order?: number | null
          experience_description?: string | null
          experience_years?: number | null
          full_name?: string
          id?: string
          is_active?: boolean | null
          photo_url?: string | null
          profile_image?: string | null
          qualification?: string
          short_bio?: string | null
          specialization?: string
        }
        Relationships: []
      }
      faq: {
        Row: {
          action: string | null
          answer: string
          created_at: string | null
          id: string
          is_active: boolean | null
          keywords: string[] | null
          question: string
          sort_order: number | null
        }
        Insert: {
          action?: string | null
          answer: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          question: string
          sort_order?: number | null
        }
        Update: {
          action?: string | null
          answer?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          keywords?: string[] | null
          question?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          question: string
          suggested_services: string[] | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          question: string
          suggested_services?: string[] | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          question?: string
          suggested_services?: string[] | null
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          id: string
          image_url: string
          is_visible: boolean | null
          title: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url: string
          is_visible?: boolean | null
          title?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          id?: string
          image_url?: string
          is_visible?: boolean | null
          title?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          appointment_id: string | null
          channel: string | null
          created_at: string | null
          id: string
          message: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          message: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          appointment_id?: string | null
          channel?: string | null
          created_at?: string | null
          id?: string
          message?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          included_services_json: Json | null
          included_treatments: string[] | null
          is_active: boolean | null
          name: string
          price: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          included_services_json?: Json | null
          included_treatments?: string[] | null
          is_active?: boolean | null
          name: string
          price: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          included_services_json?: Json | null
          included_treatments?: string[] | null
          is_active?: boolean | null
          name?: string
          price?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_minutes: number | null
          icon_name: string | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price_range: string | null
          short_description: string | null
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price_range?: string | null
          short_description?: string | null
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_minutes?: number | null
          icon_name?: string | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price_range?: string | null
          short_description?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string | null
          display_order: number | null
          id: string
          name: string
          photo_url: string | null
          qualifications: string[] | null
          role: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name: string
          photo_url?: string | null
          qualifications?: string[] | null
          role: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          display_order?: number | null
          id?: string
          name?: string
          photo_url?: string | null
          qualifications?: string[] | null
          role?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          created_at: string | null
          id: string
          is_featured: boolean | null
          is_live: boolean | null
          is_video: boolean | null
          is_visible: boolean | null
          patient_name: string
          patient_photo_url: string | null
          rating: number | null
          review_text: string
          treatment: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_video?: boolean | null
          is_visible?: boolean | null
          patient_name: string
          patient_photo_url?: string | null
          rating?: number | null
          review_text: string
          treatment?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_video?: boolean | null
          is_visible?: boolean | null
          patient_name?: string
          patient_photo_url?: string | null
          rating?: number | null
          review_text?: string
          treatment?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          end_time: string
          id: string
          is_available: boolean | null
          shift: string
          slot_date: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          end_time: string
          id?: string
          is_available?: boolean | null
          shift: string
          slot_date: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          end_time?: string
          id?: string
          is_available?: boolean | null
          shift?: string
          slot_date?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "doctors"
            referencedColumns: ["id"]
          },
        ]
      }
      treatments: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          price_range: string | null
          sort_order: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          price_range?: string | null
          sort_order?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          price_range?: string | null
          sort_order?: number | null
        }
        Relationships: []
      }
      users: {
        Row: {
          age: number
          created_at: string | null
          email: string | null
          full_name: string
          id: string
          phone: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          age: number
          created_at?: string | null
          email?: string | null
          full_name: string
          id: string
          phone: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: number
          created_at?: string | null
          email?: string | null
          full_name?: string
          id?: string
          phone?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const