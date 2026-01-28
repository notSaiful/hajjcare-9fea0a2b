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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      applicants: {
        Row: {
          age: number
          application_id: string
          city: string | null
          created_at: string
          full_name: string
          id: string
          low_income: boolean
          masjid_name: string
          mobile: string
          never_umrah: boolean
          no_money_paid: boolean
          pincode: string | null
          proof_type: string | null
          proof_url: string | null
          rejection_reason: string | null
          role: string
          social_harmony: boolean
          state: string
          status: string
          updated_at: string
          user_id: string | null
          years_of_service: number
        }
        Insert: {
          age: number
          application_id?: string
          city?: string | null
          created_at?: string
          full_name: string
          id?: string
          low_income?: boolean
          masjid_name: string
          mobile: string
          never_umrah?: boolean
          no_money_paid?: boolean
          pincode?: string | null
          proof_type?: string | null
          proof_url?: string | null
          rejection_reason?: string | null
          role: string
          social_harmony?: boolean
          state: string
          status?: string
          updated_at?: string
          user_id?: string | null
          years_of_service: number
        }
        Update: {
          age?: number
          application_id?: string
          city?: string | null
          created_at?: string
          full_name?: string
          id?: string
          low_income?: boolean
          masjid_name?: string
          mobile?: string
          never_umrah?: boolean
          no_money_paid?: boolean
          pincode?: string | null
          proof_type?: string | null
          proof_url?: string | null
          rejection_reason?: string | null
          role?: string
          social_harmony?: boolean
          state?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          years_of_service?: number
        }
        Relationships: []
      }
      family_groups: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          name: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          name: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          name?: string
          user_id?: string | null
        }
        Relationships: []
      }
      group_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string
          member_id: string
          member_name: string
          user_id: string | null
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string
          member_id: string
          member_name: string
          user_id?: string | null
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string
          member_id?: string
          member_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      health_tickets: {
        Row: {
          action_taken: string | null
          ai_category: string | null
          ai_recommendations: string[] | null
          ai_translated_text: string | null
          ai_triage_summary: string | null
          ai_urgency_level: Database["public"]["Enums"]["urgency_level"] | null
          alert_sent_at: string | null
          coordinator_notes: string | null
          created_at: string | null
          description: string
          id: string
          location_lat: number | null
          location_lng: number | null
          original_language: string | null
          outcome: string | null
          professional_response: string | null
          resolved_at: string | null
          status: Database["public"]["Enums"]["health_ticket_status"] | null
          symptoms: string[] | null
          updated_at: string | null
          user_id: string | null
          whatsapp_group_alerted: string | null
          zone: string | null
        }
        Insert: {
          action_taken?: string | null
          ai_category?: string | null
          ai_recommendations?: string[] | null
          ai_translated_text?: string | null
          ai_triage_summary?: string | null
          ai_urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          alert_sent_at?: string | null
          coordinator_notes?: string | null
          created_at?: string | null
          description: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          original_language?: string | null
          outcome?: string | null
          professional_response?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["health_ticket_status"] | null
          symptoms?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_group_alerted?: string | null
          zone?: string | null
        }
        Update: {
          action_taken?: string | null
          ai_category?: string | null
          ai_recommendations?: string[] | null
          ai_translated_text?: string | null
          ai_triage_summary?: string | null
          ai_urgency_level?: Database["public"]["Enums"]["urgency_level"] | null
          alert_sent_at?: string | null
          coordinator_notes?: string | null
          created_at?: string | null
          description?: string
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          original_language?: string | null
          outcome?: string | null
          professional_response?: string | null
          resolved_at?: string | null
          status?: Database["public"]["Enums"]["health_ticket_status"] | null
          symptoms?: string[] | null
          updated_at?: string | null
          user_id?: string | null
          whatsapp_group_alerted?: string | null
          zone?: string | null
        }
        Relationships: []
      }
      member_locations: {
        Row: {
          current_stage: string | null
          group_id: string
          id: string
          latitude: number
          longitude: number
          member_id: string
          pilgrim_status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          current_stage?: string | null
          group_id: string
          id?: string
          latitude: number
          longitude: number
          member_id: string
          pilgrim_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          current_stage?: string | null
          group_id?: string
          id?: string
          latitude?: number
          longitude?: number
          member_id?: string
          pilgrim_status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_locations_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          embarkation_point: string | null
          emergency_contact: string | null
          family_sharing_enabled: boolean
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          embarkation_point?: string | null
          emergency_contact?: string | null
          family_sharing_enabled?: boolean
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          embarkation_point?: string | null
          emergency_contact?: string | null
          family_sharing_enabled?: boolean
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          created_at: string
          id: string
          identifier: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          identifier: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          identifier?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          zone: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
          zone?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
          zone?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      applicants_status_check: {
        Row: {
          application_id: string | null
          created_at: string | null
          status: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          status?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_coordinator_or_admin: { Args: { _user_id: string }; Returns: boolean }
      is_member_of_group: { Args: { p_group_id: string }; Returns: boolean }
      lookup_user_id_by_phone: {
        Args: { target_phone: string }
        Returns: {
          full_name: string
          user_id: string
        }[]
      }
      shares_group_with: { Args: { target_user_id: string }; Returns: boolean }
      upsert_member_location:
        | {
            Args: {
              p_current_stage: string
              p_group_id: string
              p_latitude: number
              p_longitude: number
            }
            Returns: undefined
          }
        | {
            Args: {
              p_current_stage: string
              p_group_id: string
              p_latitude: number
              p_longitude: number
              p_pilgrim_status?: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_current_stage: string
              p_group_id: string
              p_latitude: number
              p_longitude: number
              p_member_id: string
            }
            Returns: undefined
          }
    }
    Enums: {
      app_role: "admin" | "coordinator" | "medical_staff" | "user"
      health_ticket_status:
        | "submitted"
        | "ai_triaged"
        | "coordinator_reviewing"
        | "whatsapp_alerted"
        | "professional_responding"
        | "action_taken"
        | "resolved"
        | "closed"
      urgency_level: "low" | "medium" | "high" | "critical"
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
    Enums: {
      app_role: ["admin", "coordinator", "medical_staff", "user"],
      health_ticket_status: [
        "submitted",
        "ai_triaged",
        "coordinator_reviewing",
        "whatsapp_alerted",
        "professional_responding",
        "action_taken",
        "resolved",
        "closed",
      ],
      urgency_level: ["low", "medium", "high", "critical"],
    },
  },
} as const
