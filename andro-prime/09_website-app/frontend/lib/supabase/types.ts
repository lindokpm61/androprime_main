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
          health_processing_consent_version: string | null
          health_processing_consented_at: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          date_of_birth: string | null
          sex: 'male' | 'female' | null
          address_line1: string | null
          address_line2: string | null
          address_city: string | null
          address_county: string | null
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
          health_processing_consent_version?: string | null
          health_processing_consented_at?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_county?: string | null
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
          health_processing_consent_version?: string | null
          health_processing_consented_at?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          date_of_birth?: string | null
          sex?: 'male' | 'female' | null
          address_line1?: string | null
          address_line2?: string | null
          address_city?: string | null
          address_county?: string | null
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
            | 'sample_failed'
            | 'on_hold'
            | 'data_purged'
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
      processed_stripe_events: {
        Row: {
          event_id: string
          event_type: string
          processed_at: string
        }
        Insert: {
          event_id: string
          event_type: string
          processed_at?: string
        }
        Update: {
          event_id?: string
          event_type?: string
          processed_at?: string
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
      lowt_nurture_consent: {
        Row: {
          id: string
          user_id: string | null
          email: string
          consent_version: string
          source: string
          consented_at: string
          withdrawn_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          consent_version: string
          source?: string
          consented_at?: string
          withdrawn_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          consent_version?: string
          source?: string
          consented_at?: string
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      supplement_waitlist: {
        Row: {
          id: string
          user_id: string | null
          email: string
          source_marker: string | null
          source_kit: string | null
          interested_in_product: string | null
          listed_at: string
          unlisted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          email: string
          source_marker?: string | null
          source_kit?: string | null
          interested_in_product?: string | null
          listed_at?: string
          unlisted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          email?: string
          source_marker?: string | null
          source_kit?: string | null
          interested_in_product?: string | null
          listed_at?: string
          unlisted_at?: string | null
          created_at?: string
          updated_at?: string
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
      events: {
        Row: {
          id: string
          event_name: string
          occurred_at: string
          anonymous_id: string | null
          email_hash: string | null
          utm_source: string | null
          utm_medium: string | null
          utm_campaign: string | null
          utm_term: string | null
          utm_content: string | null
          fpr_tid: string | null
          referrer: string | null
          landing_path: string | null
          value: number | null
          currency: string | null
          kit_id: string | null
          sku: string | null
          props: Json
          created_at: string
        }
        Insert: {
          id?: string
          event_name: string
          occurred_at?: string
          anonymous_id?: string | null
          email_hash?: string | null
          utm_source?: string | null
          utm_medium?: string | null
          utm_campaign?: string | null
          utm_term?: string | null
          utm_content?: string | null
          fpr_tid?: string | null
          referrer?: string | null
          landing_path?: string | null
          value?: number | null
          currency?: string | null
          kit_id?: string | null
          sku?: string | null
          props?: Json
          created_at?: string
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
      blog_articles: {
        Row: {
          id: string
          slug: string
          status: 'draft' | 'published' | 'archived'
          body: string
          frontmatter: Json
          keyword_coverage: Json | null
          current_revision_id: string | null
          proposed_revision_id: string | null
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          status?: 'draft' | 'published' | 'archived'
          body: string
          frontmatter?: Json
          keyword_coverage?: Json | null
          current_revision_id?: string | null
          proposed_revision_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          status?: 'draft' | 'published' | 'archived'
          body?: string
          frontmatter?: Json
          keyword_coverage?: Json | null
          current_revision_id?: string | null
          proposed_revision_id?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_article_revisions: {
        Row: {
          id: string
          article_id: string
          body: string
          frontmatter: Json
          keyword_coverage: Json | null
          editor: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          body: string
          frontmatter?: Json
          keyword_coverage?: Json | null
          editor?: string
          created_at?: string
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
      content_pipeline: {
        Row: {
          id: string
          slug: string | null
          pillar: string | null
          stage: 'keyword_selected' | 'briefed' | 'brief_ready' | 'drafted' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'reoptimising'
          article_id: string | null
          brief_ref: string | null
          target_date: string | null
          blocked_on: 'keith' | 'ewa' | null
          clickup_task_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug?: string | null
          pillar?: string | null
          stage?: 'keyword_selected' | 'briefed' | 'brief_ready' | 'drafted' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'reoptimising'
          article_id?: string | null
          brief_ref?: string | null
          target_date?: string | null
          blocked_on?: 'keith' | 'ewa' | null
          clickup_task_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string | null
          pillar?: string | null
          stage?: 'keyword_selected' | 'briefed' | 'brief_ready' | 'drafted' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'reoptimising'
          article_id?: string | null
          brief_ref?: string | null
          target_date?: string | null
          blocked_on?: 'keith' | 'ewa' | null
          clickup_task_id?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      keyword_queue: {
        Row: {
          id: string
          query: string
          vol: number | null
          kd: number | null
          cpc: number | null
          pillar: string | null
          compliance_risk: string | null
          proposed_slug: string | null
          status: 'candidate' | 'accepted' | 'rejected'
          coverage_status: 'unassigned' | 'planned' | 'briefed' | 'drafted' | 'published' | 'deferred' | 'excluded'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          query: string
          vol?: number | null
          kd?: number | null
          cpc?: number | null
          pillar?: string | null
          compliance_risk?: string | null
          proposed_slug?: string | null
          status?: 'candidate' | 'accepted' | 'rejected'
          coverage_status?: 'unassigned' | 'planned' | 'briefed' | 'drafted' | 'published' | 'deferred' | 'excluded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          query?: string
          vol?: number | null
          kd?: number | null
          cpc?: number | null
          pillar?: string | null
          compliance_risk?: string | null
          proposed_slug?: string | null
          status?: 'candidate' | 'accepted' | 'rejected'
          coverage_status?: 'unassigned' | 'planned' | 'briefed' | 'drafted' | 'published' | 'deferred' | 'excluded'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      agent_runs: {
        Row: {
          id: string
          agent: string
          item_ref: string | null
          status: 'ok' | 'error' | 'blocked'
          error: string | null
          detail: Json | null
          started_at: string
          finished_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          agent: string
          item_ref?: string | null
          status: 'ok' | 'error' | 'blocked'
          error?: string | null
          detail?: Json | null
          started_at?: string
          finished_at?: string | null
          created_at?: string
        }
        Update: {
          [key: string]: unknown
        }
        Relationships: []
      }
      content_review_log: {
        Row: {
          id: string
          title: string
          content_type: string
          channel: string | null
          submitted_by: string | null
          submitted_at: string
          reviewer_name: string
          reviewed_at: string | null
          status: 'submitted' | 'approved' | 'rejected' | 'needs_revision'
          notes: string | null
          clickup_task_id: string | null
          content_url: string | null
          created_at: string
          updated_at: string
          article_id: string | null
          revision_id: string | null
          reviewer_gmc: string | null
          scope: string | null
        }
        Insert: {
          id?: string
          title: string
          content_type: string
          channel?: string | null
          submitted_by?: string | null
          submitted_at?: string
          reviewer_name?: string
          reviewed_at?: string | null
          status?: 'submitted' | 'approved' | 'rejected' | 'needs_revision'
          notes?: string | null
          clickup_task_id?: string | null
          content_url?: string | null
          created_at?: string
          updated_at?: string
          article_id?: string | null
          revision_id?: string | null
          reviewer_gmc?: string | null
          scope?: string | null
        }
        Update: {
          id?: string
          title?: string
          content_type?: string
          channel?: string | null
          submitted_by?: string | null
          submitted_at?: string
          reviewer_name?: string
          reviewed_at?: string | null
          status?: 'submitted' | 'approved' | 'rejected' | 'needs_revision'
          notes?: string | null
          clickup_task_id?: string | null
          content_url?: string | null
          created_at?: string
          updated_at?: string
          article_id?: string | null
          revision_id?: string | null
          reviewer_gmc?: string | null
          scope?: string | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      upsert_blog_article: {
        Args: {
          p_slug: string
          p_status: 'draft' | 'published' | 'archived'
          p_body: string
          p_frontmatter: Json
          p_keyword_coverage: Json | null
          p_editor: string
        }
        Returns: string
      }
      stage_blog_revision: {
        Args: {
          p_slug: string
          p_body: string
          p_frontmatter: Json
          p_keyword_coverage: Json | null
          p_editor: string
        }
        Returns: string
      }
      promote_proposed_revision: {
        Args: {
          p_slug: string
        }
        Returns: string | null
      }
    }
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
