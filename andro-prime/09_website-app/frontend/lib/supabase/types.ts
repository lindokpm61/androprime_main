export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          age: number | null
          marketing_consent: boolean
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          sex: 'male' | 'female' | null
          address_line1: string | null
          address_line2: string | null
          address_city: string | null
          address_postal_code: string | null
          address_country: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          age?: number | null
          marketing_consent?: boolean
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          age?: number | null
          marketing_consent?: boolean
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_postal_code?: string | null
          address_country?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      kit_orders: {
        Row: {
          id: string
          user_id: string
          kit_type: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          stripe_payment_intent: string | null
          vitall_order_id: string | null
          status:
            | 'pending'
            | 'paid'
            | 'dispatched'
            | 'sample_registered'
            | 'processing'
            | 'results_received'
            | 'cancelled'
            | 'refunded'
          shipping_address: Json | null
          ordered_at: string
          kit_activated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          kit_type: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          stripe_payment_intent?: string | null
          vitall_order_id?: string | null
          status?: Database['public']['Tables']['kit_orders']['Row']['status']
          shipping_address?: Json | null
          ordered_at?: string
          kit_activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          kit_type?: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          stripe_payment_intent?: string | null
          vitall_order_id?: string | null
          status?: Database['public']['Tables']['kit_orders']['Row']['status']
          shipping_address?: Json | null
          ordered_at?: string
          kit_activated_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      sample_registrations: {
        Row: {
          id: string
          order_id: string
          barcode: string
          registered_at: string | null
          dispatched_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          barcode: string
          registered_at?: string | null
          dispatched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          barcode?: string
          registered_at?: string | null
          dispatched_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lab_results: {
        Row: {
          id: string
          order_id: string
          user_id: string
          kit_type: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          received_at: string
          raw_payload: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_id: string
          user_id: string
          kit_type: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          received_at?: string
          raw_payload?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          user_id?: string
          kit_type?: 'testosterone' | 'energy-recovery' | 'hormone-recovery'
          received_at?: string
          raw_payload?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      biomarker_values: {
        Row: {
          id: string
          result_id: string
          marker_name: string
          value: number
          unit: string
          reference_low: number | null
          reference_high: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          result_id: string
          marker_name: string
          value: number
          unit: string
          reference_low?: number | null
          reference_high?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          result_id?: string
          marker_name?: string
          value?: number
          unit?: string
          reference_low?: number | null
          reference_high?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      symptom_answers: {
        Row: {
          id: string
          user_id: string
          order_id: string
          question_key: string
          answer: Json
          captured_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_id: string
          question_key: string
          answer: Json
          captured_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_id?: string
          question_key?: string
          answer?: Json
          captured_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      qualifier_responses: {
        Row: {
          id: string
          user_id: string
          result_id: string
          question_key: string
          answer: Json
          captured_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          result_id: string
          question_key: string
          answer: Json
          captured_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          result_id?: string
          question_key?: string
          answer?: Json
          captured_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      supplement_subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string
          product_slug: string
          status:
            | 'incomplete'
            | 'trialing'
            | 'active'
            | 'past_due'
            | 'cancelled'
            | 'unpaid'
          started_at: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id: string
          product_slug: string
          status?: Database['public']['Tables']['supplement_subscriptions']['Row']['status']
          started_at?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string
          product_slug?: string
          status?: Database['public']['Tables']['supplement_subscriptions']['Row']['status']
          started_at?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      founding_member_list: {
        Row: {
          id: string
          user_id: string | null
          email: string
          first_name: string | null
          last_name: string | null
          source: string
          listed_at: string
          unlisted_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          first_name?: string | null
          last_name?: string | null
          source?: string
          listed_at?: string
          unlisted_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          first_name?: string | null
          last_name?: string | null
          source?: string
          listed_at?: string
          unlisted_at?: string | null
        }
        Relationships: []
      }
      /**
       * FROZEN 2026-05-08 — DO NOT USE for new code.
       *
       * The £75 founding-member cash deposit mechanic was shelved 2026-05-08.
       * This type is retained because the underlying table exists (frozen — historical rows preserved)
       * but NO CODE SHOULD WRITE TO IT. New founding-member opt-ins go to `founding_member_list`.
       *
       * Plan: drop this type + the underlying table in a future migration once historical rows are
       * confirmed no longer needed. Until then, treat as a dead type. If you find yourself importing
       * this, you are almost certainly making a mistake — use `founding_member_list` instead.
       */
      founding_member_deposits: {
        Row: {
          id: string
          user_id: string
          stripe_payment_intent: string | null
          paid_at: string | null
          status: 'pending' | 'paid' | 'cancelled' | 'refunded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_payment_intent?: string | null
          paid_at?: string | null
          status?: Database['public']['Tables']['founding_member_deposits']['Row']['status']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_payment_intent?: string | null
          paid_at?: string | null
          status?: Database['public']['Tables']['founding_member_deposits']['Row']['status']
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      lifecycle_events: {
        Row: {
          id: string
          user_id: string
          event_name: string
          payload: Json
          emitted_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_name: string
          payload?: Json
          emitted_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_name?: string
          payload?: Json
          emitted_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
