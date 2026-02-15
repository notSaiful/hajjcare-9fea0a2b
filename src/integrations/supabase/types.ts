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
      ai_feedback: {
        Row: {
          created_at: string
          feedback_text: string | null
          id: string
          intent_log_id: string | null
          rating: number | null
          user_id: string
          was_helpful: boolean | null
        }
        Insert: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          intent_log_id?: string | null
          rating?: number | null
          user_id: string
          was_helpful?: boolean | null
        }
        Update: {
          created_at?: string
          feedback_text?: string | null
          id?: string
          intent_log_id?: string | null
          rating?: number | null
          user_id?: string
          was_helpful?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_feedback_intent_log_id_fkey"
            columns: ["intent_log_id"]
            isOneToOne: false
            referencedRelation: "ai_intent_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_intent_logs: {
        Row: {
          confidence: number
          created_at: string
          detected_intent: string
          id: string
          language: string
          processing_time_ms: number | null
          raw_input: string
          response_summary: string | null
          routed_module: string
          session_id: string | null
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          detected_intent: string
          id?: string
          language?: string
          processing_time_ms?: number | null
          raw_input: string
          response_summary?: string | null
          routed_module: string
          session_id?: string | null
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          detected_intent?: string
          id?: string
          language?: string
          processing_time_ms?: number | null
          raw_input?: string
          response_summary?: string | null
          routed_module?: string
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_intent_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_sessions: {
        Row: {
          created_at: string
          id: string
          language: string
          metadata: Json | null
          module: string
          session_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          language?: string
          metadata?: Json | null
          module?: string
          session_type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          metadata?: Json | null
          module?: string
          session_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
          masjid_registration_number: string | null
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
          masjid_registration_number?: string | null
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
          masjid_registration_number?: string | null
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
      emotional_support_logs: {
        Row: {
          confidence: number
          created_at: string
          detected_emotion: string
          id: string
          language: string
          response_given: string | null
          session_id: string | null
          support_type: string
          user_id: string
        }
        Insert: {
          confidence?: number
          created_at?: string
          detected_emotion: string
          id?: string
          language?: string
          response_given?: string | null
          session_id?: string | null
          support_type: string
          user_id: string
        }
        Update: {
          confidence?: number
          created_at?: string
          detected_emotion?: string
          id?: string
          language?: string
          response_given?: string | null
          session_id?: string | null
          support_type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_support_logs_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "ai_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      family_groups: {
        Row: {
          created_at: string
          created_by: string
          id: string
          invite_code: string
          invite_expires_at: string | null
          name: string
          user_id: string | null
          verified_phone: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          invite_code?: string
          invite_expires_at?: string | null
          name: string
          user_id?: string | null
          verified_phone?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          invite_code?: string
          invite_expires_at?: string | null
          name?: string
          user_id?: string | null
          verified_phone?: string | null
        }
        Relationships: []
      }
      fraud_alerts: {
        Row: {
          created_at: string
          created_by: string | null
          description: string
          id: string
          is_active: boolean
          location: string | null
          severity: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          is_active?: boolean
          location?: string | null
          severity?: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          is_active?: boolean
          location?: string | null
          severity?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      fraud_scores: {
        Row: {
          auto_blacklist_suggested: boolean
          complaint_count: number
          created_at: string
          fraud_probability: number
          id: string
          last_analyzed_at: string
          operator_id: string
          payment_anomaly_count: number
          recommendation: string | null
          risk_factors: Json | null
          updated_at: string
        }
        Insert: {
          auto_blacklist_suggested?: boolean
          complaint_count?: number
          created_at?: string
          fraud_probability?: number
          id?: string
          last_analyzed_at?: string
          operator_id: string
          payment_anomaly_count?: number
          recommendation?: string | null
          risk_factors?: Json | null
          updated_at?: string
        }
        Update: {
          auto_blacklist_suggested?: boolean
          complaint_count?: number
          created_at?: string
          fraud_probability?: number
          id?: string
          last_analyzed_at?: string
          operator_id?: string
          payment_anomaly_count?: number
          recommendation?: string | null
          risk_factors?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fraud_scores_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: true
            referencedRelation: "verified_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fraud_scores_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: true
            referencedRelation: "verified_operators_public"
            referencedColumns: ["id"]
          },
        ]
      }
      geofence_zones: {
        Row: {
          center_lat: number
          center_lng: number
          created_at: string
          id: string
          is_active: boolean
          max_stationary_minutes: number | null
          name: string
          name_ar: string | null
          radius_meters: number
          updated_at: string
          zone_type: string
        }
        Insert: {
          center_lat: number
          center_lng: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_stationary_minutes?: number | null
          name: string
          name_ar?: string | null
          radius_meters?: number
          updated_at?: string
          zone_type?: string
        }
        Update: {
          center_lat?: number
          center_lng?: number
          created_at?: string
          id?: string
          is_active?: boolean
          max_stationary_minutes?: number | null
          name?: string
          name_ar?: string | null
          radius_meters?: number
          updated_at?: string
          zone_type?: string
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
      inspector_audit_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          id: string
          performed_by: string | null
          registration_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          registration_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          id?: string
          performed_by?: string | null
          registration_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspector_audit_log_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "inspector_registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      inspector_registrations: {
        Row: {
          city: string
          created_at: string
          duty_status: string
          full_name: string
          id: string
          is_active: boolean
          language_preference: string
          mobile: string
          rejection_reason: string | null
          role: string
          state: string
          status: string
          updated_at: string
          user_id: string | null
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          city: string
          created_at?: string
          duty_status?: string
          full_name: string
          id?: string
          is_active?: boolean
          language_preference?: string
          mobile: string
          rejection_reason?: string | null
          role: string
          state: string
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          city?: string
          created_at?: string
          duty_status?: string
          full_name?: string
          id?: string
          is_active?: boolean
          language_preference?: string
          mobile?: string
          rejection_reason?: string | null
          role?: string
          state?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      member_link_requests: {
        Row: {
          created_at: string
          expires_at: string
          group_id: string
          id: string
          message: string | null
          requester_id: string
          responded_at: string | null
          status: string
          target_user_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          group_id: string
          id?: string
          message?: string | null
          requester_id: string
          responded_at?: string | null
          status?: string
          target_user_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          group_id?: string
          id?: string
          message?: string | null
          requester_id?: string
          responded_at?: string | null
          status?: string
          target_user_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "member_link_requests_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
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
      operator_reviews: {
        Row: {
          created_at: string
          id: string
          is_fraud_report: boolean | null
          operator_id: string
          rating: number
          review_text: string | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_fraud_report?: boolean | null
          operator_id: string
          rating: number
          review_text?: string | null
          status?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_fraud_report?: boolean | null
          operator_id?: string
          rating?: number
          review_text?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "operator_reviews_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "verified_operators"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "operator_reviews_operator_id_fkey"
            columns: ["operator_id"]
            isOneToOne: false
            referencedRelation: "verified_operators_public"
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
      promo_code_usage: {
        Row: {
          discount_applied: number
          id: string
          promo_code_id: string
          used_at: string
          user_id: string
        }
        Insert: {
          discount_applied?: number
          id?: string
          promo_code_id: string
          used_at?: string
          user_id: string
        }
        Update: {
          discount_applied?: number
          id?: string
          promo_code_id?: string
          used_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "promo_code_usage_promo_code_id_fkey"
            columns: ["promo_code_id"]
            isOneToOne: false
            referencedRelation: "promo_codes"
            referencedColumns: ["id"]
          },
        ]
      }
      promo_codes: {
        Row: {
          code: string
          commission_percentage: number
          created_at: string
          creator_type: string
          creator_user_id: string | null
          current_uses: number
          description: string | null
          discount_type: string
          discount_value: number
          id: string
          is_active: boolean
          max_uses: number | null
          max_uses_per_user: number
          updated_at: string
          valid_from: string
          valid_until: string | null
        }
        Insert: {
          code: string
          commission_percentage?: number
          created_at?: string
          creator_type?: string
          creator_user_id?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
        }
        Update: {
          code?: string
          commission_percentage?: number
          created_at?: string
          creator_type?: string
          creator_user_id?: string | null
          current_uses?: number
          description?: string | null
          discount_type?: string
          discount_value?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          max_uses_per_user?: number
          updated_at?: string
          valid_from?: string
          valid_until?: string | null
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
      referral_codes: {
        Row: {
          code: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          referred_id: string
          referrer_id: string
          reward_credited: boolean
          status: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id: string
          referrer_id: string
          reward_credited?: boolean
          status?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          referred_id?: string
          referrer_id?: string
          reward_credited?: boolean
          status?: string
        }
        Relationships: []
      }
      tracking_alerts: {
        Row: {
          alert_type: string
          created_at: string
          details: Json | null
          geofence_zone_id: string | null
          group_id: string | null
          id: string
          location_lat: number | null
          location_lng: number | null
          member_id: string | null
          resolved_at: string | null
          resolved_by: string | null
          severity: string
          status: string
          user_id: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          details?: Json | null
          geofence_zone_id?: string | null
          group_id?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          member_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          details?: Json | null
          geofence_zone_id?: string | null
          group_id?: string | null
          id?: string
          location_lat?: number | null
          location_lng?: number | null
          member_id?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          severity?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_alerts_geofence_zone_id_fkey"
            columns: ["geofence_zone_id"]
            isOneToOne: false
            referencedRelation: "geofence_zones"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_alerts_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "family_groups"
            referencedColumns: ["id"]
          },
        ]
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
      verified_operators: {
        Row: {
          avg_rating: number | null
          blacklist_reason: string | null
          city: string | null
          company_name: string
          created_at: string
          email: string | null
          id: string
          is_blacklisted: boolean
          is_verified: boolean
          license_number: string | null
          name: string
          phone: string | null
          state: string
          total_reviews: number | null
          updated_at: string
          verification_date: string | null
          website: string | null
        }
        Insert: {
          avg_rating?: number | null
          blacklist_reason?: string | null
          city?: string | null
          company_name: string
          created_at?: string
          email?: string | null
          id?: string
          is_blacklisted?: boolean
          is_verified?: boolean
          license_number?: string | null
          name: string
          phone?: string | null
          state: string
          total_reviews?: number | null
          updated_at?: string
          verification_date?: string | null
          website?: string | null
        }
        Update: {
          avg_rating?: number | null
          blacklist_reason?: string | null
          city?: string | null
          company_name?: string
          created_at?: string
          email?: string | null
          id?: string
          is_blacklisted?: boolean
          is_verified?: boolean
          license_number?: string | null
          name?: string
          phone?: string | null
          state?: string
          total_reviews?: number | null
          updated_at?: string
          verification_date?: string | null
          website?: string | null
        }
        Relationships: []
      }
      volunteers: {
        Row: {
          age: number
          availability_days: string
          availability_tag: string | null
          city: string
          city_tag: string | null
          created_at: string
          declaration_agreed: boolean
          district: string
          duty_location: string
          email: string | null
          father_name: string
          full_address: string
          full_name: string
          id: string
          languages: string[]
          mobile: string
          skill_tag: string | null
          skills: string[]
          state: string
          status: string
          updated_at: string
          user_id: string | null
          volunteer_id: string
          whatsapp: string
        }
        Insert: {
          age: number
          availability_days: string
          availability_tag?: string | null
          city: string
          city_tag?: string | null
          created_at?: string
          declaration_agreed?: boolean
          district: string
          duty_location: string
          email?: string | null
          father_name: string
          full_address: string
          full_name: string
          id?: string
          languages?: string[]
          mobile: string
          skill_tag?: string | null
          skills?: string[]
          state: string
          status?: string
          updated_at?: string
          user_id?: string | null
          volunteer_id: string
          whatsapp: string
        }
        Update: {
          age?: number
          availability_days?: string
          availability_tag?: string | null
          city?: string
          city_tag?: string | null
          created_at?: string
          declaration_agreed?: boolean
          district?: string
          duty_location?: string
          email?: string | null
          father_name?: string
          full_address?: string
          full_name?: string
          id?: string
          languages?: string[]
          mobile?: string
          skill_tag?: string | null
          skills?: string[]
          state?: string
          status?: string
          updated_at?: string
          user_id?: string | null
          volunteer_id?: string
          whatsapp?: string
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          reference_id: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          reason: string
          reference_id?: string | null
          type: string
          user_id: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          reference_id?: string | null
          type?: string
          user_id?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          reward_credits: number
          updated_at: string
          user_id: string
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          reward_credits?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          reward_credits?: number
          updated_at?: string
          user_id?: string
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
      profiles_limited: {
        Row: {
          created_at: string | null
          embarkation_point: string | null
          family_sharing_enabled: boolean | null
          full_name: string | null
          id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          embarkation_point?: string | null
          family_sharing_enabled?: boolean | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          embarkation_point?: string | null
          family_sharing_enabled?: boolean | null
          full_name?: string | null
          id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      verified_operators_public: {
        Row: {
          avg_rating: number | null
          blacklist_reason: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          id: string | null
          is_blacklisted: boolean | null
          is_verified: boolean | null
          license_number: string | null
          name: string | null
          state: string | null
          total_reviews: number | null
          updated_at: string | null
          verification_date: string | null
          website: string | null
        }
        Insert: {
          avg_rating?: number | null
          blacklist_reason?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          id?: string | null
          is_blacklisted?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          name?: string | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Update: {
          avg_rating?: number | null
          blacklist_reason?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          id?: string | null
          is_blacklisted?: boolean | null
          is_verified?: boolean | null
          license_number?: string | null
          name?: string | null
          state?: string | null
          total_reviews?: number | null
          updated_at?: string | null
          verification_date?: string | null
          website?: string | null
        }
        Relationships: []
      }
      volunteers_public: {
        Row: {
          city: string | null
          created_at: string | null
          skills: string[] | null
          status: string | null
          volunteer_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string | null
          skills?: string[] | null
          status?: string | null
          volunteer_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string | null
          skills?: string[] | null
          status?: string | null
          volunteer_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      apply_promo_code: { Args: { p_code: string }; Returns: Json }
      check_inspector_mobile_exists: {
        Args: { p_mobile: string }
        Returns: boolean
      }
      check_volunteer_mobile_exists: {
        Args: { p_mobile: string }
        Returns: boolean
      }
      cleanup_old_rate_limits: { Args: never; Returns: undefined }
      generate_referral_code: { Args: never; Returns: string }
      generate_timed_invite: {
        Args: { p_group_id: string }
        Returns: {
          expires_at: string
          invite_code: string
        }[]
      }
      get_group_member_profile: {
        Args: { target_user_id: string }
        Returns: {
          embarkation_point: string
          family_sharing_enabled: boolean
          full_name: string
          id: string
          user_id: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_coordinator_or_admin: { Args: { _user_id: string }; Returns: boolean }
      is_member_of_group: { Args: { p_group_id: string }; Returns: boolean }
      lookup_group_by_invite_code: {
        Args: { p_invite_code: string }
        Returns: {
          id: string
          invite_code: string
          name: string
        }[]
      }
      lookup_user_id_by_phone: {
        Args: { target_phone: string }
        Returns: {
          full_name: string
          user_id: string
        }[]
      }
      lookup_volunteer_status: {
        Args: { p_query: string }
        Returns: {
          city: string
          created_at: string
          full_name: string
          skills: string[]
          status: string
          volunteer_id: string
        }[]
      }
      process_referral: { Args: { p_referral_code: string }; Returns: Json }
      shares_group_with: { Args: { target_user_id: string }; Returns: boolean }
      upsert_member_location: {
        Args: {
          p_current_stage: string
          p_group_id: string
          p_latitude: number
          p_longitude: number
          p_pilgrim_status?: string
        }
        Returns: undefined
      }
      whatsapp_verify_and_join: { Args: { p_phone: string }; Returns: Json }
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
