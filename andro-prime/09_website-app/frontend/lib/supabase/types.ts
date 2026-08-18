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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agent_runs: {
        Row: {
          agent: string
          created_at: string
          detail: Json | null
          error: string | null
          finished_at: string | null
          id: string
          item_ref: string | null
          started_at: string
          status: Database["public"]["Enums"]["agent_run_status"]
        }
        Insert: {
          agent: string
          created_at?: string
          detail?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          item_ref?: string | null
          started_at?: string
          status: Database["public"]["Enums"]["agent_run_status"]
        }
        Update: {
          agent?: string
          created_at?: string
          detail?: Json | null
          error?: string | null
          finished_at?: string | null
          id?: string
          item_ref?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["agent_run_status"]
        }
        Relationships: []
      }
      biomarker_values: {
        Row: {
          created_at: string
          id: string
          marker_name: string
          reference_high: number | null
          reference_low: number | null
          result_id: string
          unit: string
          updated_at: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          marker_name: string
          reference_high?: number | null
          reference_low?: number | null
          result_id: string
          unit: string
          updated_at?: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          marker_name?: string
          reference_high?: number | null
          reference_low?: number | null
          result_id?: string
          unit?: string
          updated_at?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "biomarker_values_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "lab_results"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_article_revisions: {
        Row: {
          article_id: string
          body: string
          created_at: string
          editor: string
          frontmatter: Json
          id: string
          keyword_coverage: Json | null
        }
        Insert: {
          article_id: string
          body: string
          created_at?: string
          editor?: string
          frontmatter?: Json
          id?: string
          keyword_coverage?: Json | null
        }
        Update: {
          article_id?: string
          body?: string
          created_at?: string
          editor?: string
          frontmatter?: Json
          id?: string
          keyword_coverage?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_article_revisions_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_articles: {
        Row: {
          body: string
          created_at: string
          current_revision_id: string | null
          frontmatter: Json
          id: string
          keyword_coverage: Json | null
          proposed_revision_id: string | null
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_article_status"]
          updated_at: string
        }
        Insert: {
          body: string
          created_at?: string
          current_revision_id?: string | null
          frontmatter?: Json
          id?: string
          keyword_coverage?: Json | null
          proposed_revision_id?: string | null
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_article_status"]
          updated_at?: string
        }
        Update: {
          body?: string
          created_at?: string
          current_revision_id?: string | null
          frontmatter?: Json
          id?: string
          keyword_coverage?: Json | null
          proposed_revision_id?: string | null
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_article_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_articles_current_revision_fk"
            columns: ["current_revision_id"]
            isOneToOne: false
            referencedRelation: "blog_article_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_articles_proposed_revision_id_fkey"
            columns: ["proposed_revision_id"]
            isOneToOne: false
            referencedRelation: "blog_article_revisions"
            referencedColumns: ["id"]
          },
        ]
      }
      borderline_nurture_consent: {
        Row: {
          consent_version: string
          consented_at: string
          email: string
          id: string
          source: string
          user_id: string | null
          withdrawn_at: string | null
        }
        Insert: {
          consent_version: string
          consented_at?: string
          email: string
          id?: string
          source?: string
          user_id?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          consent_version?: string
          consented_at?: string
          email?: string
          id?: string
          source?: string
          user_id?: string | null
          withdrawn_at?: string | null
        }
        Relationships: []
      }
      bundle_dispatches: {
        Row: {
          address_check_at: string | null
          bundle_type: string
          created_at: string
          due_at: string | null
          id: string
          kit_type: Database["public"]["Enums"]["kit_type"]
          parent_order_id: string
          second_order_id: string | null
          status: string
          triggered_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address_check_at?: string | null
          bundle_type: string
          created_at?: string
          due_at?: string | null
          id?: string
          kit_type: Database["public"]["Enums"]["kit_type"]
          parent_order_id: string
          second_order_id?: string | null
          status?: string
          triggered_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address_check_at?: string | null
          bundle_type?: string
          created_at?: string
          due_at?: string | null
          id?: string
          kit_type?: Database["public"]["Enums"]["kit_type"]
          parent_order_id?: string
          second_order_id?: string | null
          status?: string
          triggered_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bundle_dispatches_parent_order_id_fkey"
            columns: ["parent_order_id"]
            isOneToOne: false
            referencedRelation: "kit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_dispatches_second_order_id_fkey"
            columns: ["second_order_id"]
            isOneToOne: false
            referencedRelation: "kit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bundle_dispatches_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_asset_revisions: {
        Row: {
          asset_id: string
          created_at: string
          created_by: string | null
          hook: string | null
          id: string
          note: string | null
          revision: number
          script: string | null
        }
        Insert: {
          asset_id: string
          created_at?: string
          created_by?: string | null
          hook?: string | null
          id?: string
          note?: string | null
          revision: number
          script?: string | null
        }
        Update: {
          asset_id?: string
          created_at?: string
          created_by?: string | null
          hook?: string | null
          id?: string
          note?: string | null
          revision?: number
          script?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_asset_revisions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_assets: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          awareness: string | null
          canonical_article_id: string | null
          claim_set_id: string | null
          content_type: string | null
          created_at: string
          cta: string | null
          drive_url: string | null
          ewa_signed_at: string | null
          ewa_task: string | null
          funnel_job: string | null
          funnel_stage: string | null
          id: string
          markers: string[]
          notes: string | null
          pinned_at: string | null
          preflight: string
          preflight_date: string | null
          series: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          awareness?: string | null
          canonical_article_id?: string | null
          claim_set_id?: string | null
          content_type?: string | null
          created_at?: string
          cta?: string | null
          drive_url?: string | null
          ewa_signed_at?: string | null
          ewa_task?: string | null
          funnel_job?: string | null
          funnel_stage?: string | null
          id?: string
          markers?: string[]
          notes?: string | null
          pinned_at?: string | null
          preflight?: string
          preflight_date?: string | null
          series?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          awareness?: string | null
          canonical_article_id?: string | null
          claim_set_id?: string | null
          content_type?: string | null
          created_at?: string
          cta?: string | null
          drive_url?: string | null
          ewa_signed_at?: string | null
          ewa_task?: string | null
          funnel_job?: string | null
          funnel_stage?: string | null
          id?: string
          markers?: string[]
          notes?: string | null
          pinned_at?: string | null
          preflight?: string
          preflight_date?: string | null
          series?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_assets_canonical_article_id_fkey"
            columns: ["canonical_article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_assets_claim_set_id_fkey"
            columns: ["claim_set_id"]
            isOneToOne: false
            referencedRelation: "content_claim_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_channels: {
        Row: {
          account: string | null
          body_max_chars: number | null
          connected: boolean
          coverage_pause_reason: string | null
          coverage_paused_until: string | null
          format: string
          id: string
          in_plan: boolean
          label: string
          lane: string
          media_aspect: string | null
          media_kind: string
          media_max: number | null
          media_min: number
          notes: string | null
          platform: string
          publisher: string | null
          publisher_brand: string | null
          requires_human_publish: boolean
          route_verified_at: string | null
          route_verified_evidence: string | null
          sort_order: number
          supports_first_comment: boolean
          thumb_spec: string
          updated_at: string
          weekly_slots: number
        }
        Insert: {
          account?: string | null
          body_max_chars?: number | null
          connected?: boolean
          coverage_pause_reason?: string | null
          coverage_paused_until?: string | null
          format: string
          id?: string
          in_plan?: boolean
          label: string
          lane: string
          media_aspect?: string | null
          media_kind?: string
          media_max?: number | null
          media_min?: number
          notes?: string | null
          platform: string
          publisher?: string | null
          publisher_brand?: string | null
          requires_human_publish?: boolean
          route_verified_at?: string | null
          route_verified_evidence?: string | null
          sort_order?: number
          supports_first_comment?: boolean
          thumb_spec?: string
          updated_at?: string
          weekly_slots?: number
        }
        Update: {
          account?: string | null
          body_max_chars?: number | null
          connected?: boolean
          coverage_pause_reason?: string | null
          coverage_paused_until?: string | null
          format?: string
          id?: string
          in_plan?: boolean
          label?: string
          lane?: string
          media_aspect?: string | null
          media_kind?: string
          media_max?: number | null
          media_min?: number
          notes?: string | null
          platform?: string
          publisher?: string | null
          publisher_brand?: string | null
          requires_human_publish?: boolean
          route_verified_at?: string | null
          route_verified_evidence?: string | null
          sort_order?: number
          supports_first_comment?: boolean
          thumb_spec?: string
          updated_at?: string
          weekly_slots?: number
        }
        Relationships: []
      }
      content_claim_sets: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          signature_ref: string | null
          signed_at: string | null
          signed_by: string | null
          status: string
          topic_id: string
          updated_at: string
          version: number
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          signature_ref?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: string
          topic_id: string
          updated_at?: string
          version: number
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          signature_ref?: string | null
          signed_at?: string | null
          signed_by?: string | null
          status?: string
          topic_id?: string
          updated_at?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "content_claim_sets_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "content_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_claims: {
        Row: {
          claim: string
          claim_set_id: string
          created_at: string
          id: string
          notes: string | null
          position: number
          source_name: string | null
          source_url: string | null
          source_verified_at: string | null
        }
        Insert: {
          claim: string
          claim_set_id: string
          created_at?: string
          id?: string
          notes?: string | null
          position: number
          source_name?: string | null
          source_url?: string | null
          source_verified_at?: string | null
        }
        Update: {
          claim?: string
          claim_set_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          position?: number
          source_name?: string | null
          source_url?: string | null
          source_verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_claims_claim_set_id_fkey"
            columns: ["claim_set_id"]
            isOneToOne: false
            referencedRelation: "content_claim_sets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_hooks: {
        Row: {
          archetype: string | null
          asset_id: string
          chosen: boolean
          created_at: string
          gate_failures: string[]
          id: string
          question: string | null
          score_detail: Json | null
          score_total: number | null
          spoken: string
          targeted: string | null
          text_overlay: string | null
          visual: string | null
        }
        Insert: {
          archetype?: string | null
          asset_id: string
          chosen?: boolean
          created_at?: string
          gate_failures?: string[]
          id?: string
          question?: string | null
          score_detail?: Json | null
          score_total?: number | null
          spoken: string
          targeted?: string | null
          text_overlay?: string | null
          visual?: string | null
        }
        Update: {
          archetype?: string | null
          asset_id?: string
          chosen?: boolean
          created_at?: string
          gate_failures?: string[]
          id?: string
          question?: string | null
          score_detail?: Json | null
          score_total?: number | null
          spoken?: string
          targeted?: string | null
          text_overlay?: string | null
          visual?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_hooks_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_media: {
        Row: {
          aspect: string | null
          asset_id: string
          bytes: number | null
          checksum: string | null
          created_at: string
          height: number | null
          id: string
          kind: string
          notes: string | null
          origin: string
          updated_at: string
          uri: string
          width: number | null
        }
        Insert: {
          aspect?: string | null
          asset_id: string
          bytes?: number | null
          checksum?: string | null
          created_at?: string
          height?: number | null
          id?: string
          kind: string
          notes?: string | null
          origin: string
          updated_at?: string
          uri: string
          width?: number | null
        }
        Update: {
          aspect?: string | null
          asset_id?: string
          bytes?: number | null
          checksum?: string | null
          created_at?: string
          height?: number | null
          id?: string
          kind?: string
          notes?: string | null
          origin?: string
          updated_at?: string
          uri?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_media_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_metrics: {
        Row: {
          captured_at: string
          comments: number | null
          followers_gained: number | null
          id: string
          impressions: number | null
          profile_viewers: number | null
          raw: Json | null
          reach: number | null
          reactions: number | null
          rendition_id: string
          saves: number | null
          shares: number | null
          video_views: number | null
          watch_seconds: number | null
        }
        Insert: {
          captured_at?: string
          comments?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          profile_viewers?: number | null
          raw?: Json | null
          reach?: number | null
          reactions?: number | null
          rendition_id: string
          saves?: number | null
          shares?: number | null
          video_views?: number | null
          watch_seconds?: number | null
        }
        Update: {
          captured_at?: string
          comments?: number | null
          followers_gained?: number | null
          id?: string
          impressions?: number | null
          profile_viewers?: number | null
          raw?: Json | null
          reach?: number | null
          reactions?: number | null
          rendition_id?: string
          saves?: number | null
          shares?: number | null
          video_views?: number | null
          watch_seconds?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_metrics_rendition_id_fkey"
            columns: ["rendition_id"]
            isOneToOne: false
            referencedRelation: "content_renditions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_pipeline: {
        Row: {
          article_id: string | null
          blocked_on: Database["public"]["Enums"]["content_blocked_on"] | null
          brief_ref: string | null
          clickup_task_id: string | null
          created_at: string
          id: string
          notes: string | null
          pillar: string | null
          slug: string | null
          stage: Database["public"]["Enums"]["content_pipeline_stage"]
          target_date: string | null
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          blocked_on?: Database["public"]["Enums"]["content_blocked_on"] | null
          brief_ref?: string | null
          clickup_task_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          pillar?: string | null
          slug?: string | null
          stage?: Database["public"]["Enums"]["content_pipeline_stage"]
          target_date?: string | null
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          blocked_on?: Database["public"]["Enums"]["content_blocked_on"] | null
          brief_ref?: string | null
          clickup_task_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          pillar?: string | null
          slug?: string | null
          stage?: Database["public"]["Enums"]["content_pipeline_stage"]
          target_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_pipeline_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_rendition_media: {
        Row: {
          created_at: string
          media_id: string
          position: number
          rendition_id: string
          role: string
        }
        Insert: {
          created_at?: string
          media_id: string
          position?: number
          rendition_id: string
          role?: string
        }
        Update: {
          created_at?: string
          media_id?: string
          position?: number
          rendition_id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_rendition_media_media_id_fkey"
            columns: ["media_id"]
            isOneToOne: false
            referencedRelation: "content_media"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_rendition_media_rendition_id_fkey"
            columns: ["rendition_id"]
            isOneToOne: false
            referencedRelation: "content_renditions"
            referencedColumns: ["id"]
          },
        ]
      }
      content_renditions: {
        Row: {
          asset_id: string
          body: string | null
          created_at: string
          external_post_id: string | null
          external_url: string | null
          first_comment: string | null
          format: string
          id: string
          platform: string
          published_at: string | null
          publisher: string | null
          scheduled_for: string | null
          status: string
          thumb_spec: string
          unipile_account: string | null
          updated_at: string
          variant: string | null
        }
        Insert: {
          asset_id: string
          body?: string | null
          created_at?: string
          external_post_id?: string | null
          external_url?: string | null
          first_comment?: string | null
          format: string
          id?: string
          platform: string
          published_at?: string | null
          publisher?: string | null
          scheduled_for?: string | null
          status?: string
          thumb_spec: string
          unipile_account?: string | null
          updated_at?: string
          variant?: string | null
        }
        Update: {
          asset_id?: string
          body?: string | null
          created_at?: string
          external_post_id?: string | null
          external_url?: string | null
          first_comment?: string | null
          format?: string
          id?: string
          platform?: string
          published_at?: string | null
          publisher?: string | null
          scheduled_for?: string | null
          status?: string
          thumb_spec?: string
          unipile_account?: string | null
          updated_at?: string
          variant?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_renditions_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "content_assets"
            referencedColumns: ["id"]
          },
        ]
      }
      content_review_log: {
        Row: {
          article_id: string | null
          channel: string | null
          clickup_task_id: string | null
          content_type: string
          content_url: string | null
          created_at: string
          id: string
          notes: string | null
          reviewed_at: string | null
          reviewer_gmc: string | null
          reviewer_name: string
          revision_id: string | null
          scope: string | null
          status: Database["public"]["Enums"]["content_review_status"]
          submitted_at: string
          submitted_by: string | null
          title: string
          updated_at: string
        }
        Insert: {
          article_id?: string | null
          channel?: string | null
          clickup_task_id?: string | null
          content_type: string
          content_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_gmc?: string | null
          reviewer_name?: string
          revision_id?: string | null
          scope?: string | null
          status?: Database["public"]["Enums"]["content_review_status"]
          submitted_at?: string
          submitted_by?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          article_id?: string | null
          channel?: string | null
          clickup_task_id?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          reviewed_at?: string | null
          reviewer_gmc?: string | null
          reviewer_name?: string
          revision_id?: string | null
          scope?: string | null
          status?: Database["public"]["Enums"]["content_review_status"]
          submitted_at?: string
          submitted_by?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_review_log_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_review_log_revision_id_fkey"
            columns: ["revision_id"]
            isOneToOne: false
            referencedRelation: "blog_article_revisions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_review_log_submitted_by_fkey"
            columns: ["submitted_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      content_topic_articles: {
        Row: {
          article_id: string
          created_at: string
          topic_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          topic_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_topic_articles_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "blog_articles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "content_topic_articles_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "content_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      content_topics: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          rationale: string | null
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          rationale?: string | null
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          rationale?: string | null
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          anonymous_id: string | null
          created_at: string
          currency: string | null
          email_hash: string | null
          event_name: string
          fpr_tid: string | null
          id: string
          kit_id: string | null
          landing_path: string | null
          occurred_at: string
          props: Json
          referrer: string | null
          sku: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          value: number | null
        }
        Insert: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          email_hash?: string | null
          event_name: string
          fpr_tid?: string | null
          id?: string
          kit_id?: string | null
          landing_path?: string | null
          occurred_at?: string
          props?: Json
          referrer?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          value?: number | null
        }
        Update: {
          anonymous_id?: string | null
          created_at?: string
          currency?: string | null
          email_hash?: string | null
          event_name?: string
          fpr_tid?: string | null
          id?: string
          kit_id?: string | null
          landing_path?: string | null
          occurred_at?: string
          props?: Json
          referrer?: string | null
          sku?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          value?: number | null
        }
        Relationships: []
      }
      founding_member_deposits: {
        Row: {
          created_at: string
          id: string
          paid_at: string | null
          status: Database["public"]["Enums"]["deposit_status"]
          stripe_payment_intent: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["deposit_status"]
          stripe_payment_intent?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          paid_at?: string | null
          status?: Database["public"]["Enums"]["deposit_status"]
          stripe_payment_intent?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "founding_member_deposits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      founding_member_list: {
        Row: {
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          listed_at: string
          source: string
          unlisted_at: string | null
          user_id: string | null
        }
        Insert: {
          email: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          listed_at?: string
          source?: string
          unlisted_at?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          listed_at?: string
          source?: string
          unlisted_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      keyword_queue: {
        Row: {
          compliance_risk: string | null
          coverage_status: Database["public"]["Enums"]["keyword_coverage_status"]
          cpc: number | null
          created_at: string
          id: string
          kd: number | null
          notes: string | null
          pillar: string | null
          proposed_slug: string | null
          query: string
          status: Database["public"]["Enums"]["keyword_queue_status"]
          updated_at: string
          vol: number | null
        }
        Insert: {
          compliance_risk?: string | null
          coverage_status?: Database["public"]["Enums"]["keyword_coverage_status"]
          cpc?: number | null
          created_at?: string
          id?: string
          kd?: number | null
          notes?: string | null
          pillar?: string | null
          proposed_slug?: string | null
          query: string
          status?: Database["public"]["Enums"]["keyword_queue_status"]
          updated_at?: string
          vol?: number | null
        }
        Update: {
          compliance_risk?: string | null
          coverage_status?: Database["public"]["Enums"]["keyword_coverage_status"]
          cpc?: number | null
          created_at?: string
          id?: string
          kd?: number | null
          notes?: string | null
          pillar?: string | null
          proposed_slug?: string | null
          query?: string
          status?: Database["public"]["Enums"]["keyword_queue_status"]
          updated_at?: string
          vol?: number | null
        }
        Relationships: []
      }
      kit_orders: {
        Row: {
          created_at: string
          id: string
          is_test: boolean
          kit_activated_at: string | null
          kit_type: Database["public"]["Enums"]["kit_type"]
          order_seq: number
          ordered_at: string
          shipping_address: Json | null
          status: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent: string | null
          updated_at: string
          user_id: string
          vitall_order_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          is_test?: boolean
          kit_activated_at?: string | null
          kit_type: Database["public"]["Enums"]["kit_type"]
          order_seq?: number
          ordered_at?: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          updated_at?: string
          user_id: string
          vitall_order_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          is_test?: boolean
          kit_activated_at?: string | null
          kit_type?: Database["public"]["Enums"]["kit_type"]
          order_seq?: number
          ordered_at?: string
          shipping_address?: Json | null
          status?: Database["public"]["Enums"]["order_status"]
          stripe_payment_intent?: string | null
          updated_at?: string
          user_id?: string
          vitall_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kit_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lab_results: {
        Row: {
          created_at: string
          id: string
          kit_type: Database["public"]["Enums"]["kit_type"]
          order_id: string
          raw_payload: Json
          received_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kit_type: Database["public"]["Enums"]["kit_type"]
          order_id: string
          raw_payload?: Json
          received_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          kit_type?: Database["public"]["Enums"]["kit_type"]
          order_id?: string
          raw_payload?: Json
          received_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "kit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lab_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lifecycle_events: {
        Row: {
          created_at: string
          emitted_at: string
          event_name: string
          id: string
          payload: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          emitted_at?: string
          event_name: string
          id?: string
          payload?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          emitted_at?: string
          event_name?: string
          id?: string
          payload?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lifecycle_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lowt_nurture_consent: {
        Row: {
          consent_version: string
          consented_at: string
          email: string
          id: string
          source: string
          user_id: string | null
          withdrawn_at: string | null
        }
        Insert: {
          consent_version: string
          consented_at?: string
          email: string
          id?: string
          source?: string
          user_id?: string | null
          withdrawn_at?: string | null
        }
        Update: {
          consent_version?: string
          consented_at?: string
          email?: string
          id?: string
          source?: string
          user_id?: string | null
          withdrawn_at?: string | null
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
      qualifier_responses: {
        Row: {
          answer: Json
          captured_at: string
          created_at: string
          id: string
          question_key: string
          result_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: Json
          captured_at?: string
          created_at?: string
          id?: string
          question_key: string
          result_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: Json
          captured_at?: string
          created_at?: string
          id?: string
          question_key?: string
          result_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qualifier_responses_result_id_fkey"
            columns: ["result_id"]
            isOneToOne: false
            referencedRelation: "lab_results"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qualifier_responses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sample_registrations: {
        Row: {
          barcode: string
          created_at: string
          dispatched_at: string | null
          id: string
          order_id: string
          registered_at: string | null
          updated_at: string
        }
        Insert: {
          barcode: string
          created_at?: string
          dispatched_at?: string | null
          id?: string
          order_id: string
          registered_at?: string | null
          updated_at?: string
        }
        Update: {
          barcode?: string
          created_at?: string
          dispatched_at?: string | null
          id?: string
          order_id?: string
          registered_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sample_registrations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "kit_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_subscriptions: {
        Row: {
          created_at: string
          id: string
          product_slug: string
          started_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_slug: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_slug?: string
          started_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_subscription_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplement_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      supplement_waitlist: {
        Row: {
          created_at: string
          email: string
          id: string
          interested_in_product: string | null
          listed_at: string
          source_kit: string | null
          source_marker: string | null
          unlisted_at: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          interested_in_product?: string | null
          listed_at?: string
          source_kit?: string | null
          source_marker?: string | null
          unlisted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          interested_in_product?: string | null
          listed_at?: string
          source_kit?: string | null
          source_marker?: string | null
          unlisted_at?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      symptom_answers: {
        Row: {
          answer: Json
          captured_at: string
          created_at: string
          id: string
          order_id: string
          question_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          answer: Json
          captured_at?: string
          created_at?: string
          id?: string
          order_id: string
          question_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          answer?: Json
          captured_at?: string
          created_at?: string
          id?: string
          order_id?: string
          question_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_answers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "kit_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "symptom_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_county: string | null
          address_line1: string | null
          address_line2: string | null
          address_postal_code: string | null
          age: number | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string | null
          health_processing_consent_version: string | null
          health_processing_consented_at: string | null
          id: string
          last_name: string | null
          marketing_consent: boolean
          phone: string | null
          sex: string | null
          updated_at: string
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_county?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_postal_code?: string | null
          age?: number | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name?: string | null
          health_processing_consent_version?: string | null
          health_processing_consented_at?: string | null
          id: string
          last_name?: string | null
          marketing_consent?: boolean
          phone?: string | null
          sex?: string | null
          updated_at?: string
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_county?: string | null
          address_line1?: string | null
          address_line2?: string | null
          address_postal_code?: string | null
          age?: number | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string | null
          health_processing_consent_version?: string | null
          health_processing_consented_at?: string | null
          id?: string
          last_name?: string | null
          marketing_consent?: boolean
          phone?: string | null
          sex?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      v_deposit_summary: {
        Row: {
          total_paid: number | null
          total_pending: number | null
          total_refunded: number | null
          total_revenue_gbp: number | null
        }
        Relationships: []
      }
      v_gate_tracker: {
        Row: {
          active_sub_count: number | null
          fm_list_optins: number | null
          kit23_to_sub_conversion_pct: number | null
          supplement_mrr_gbp: number | null
          total_deposits_paid: number | null
          total_kits_sold: number | null
        }
        Relationships: []
      }
      v_kit_pipeline: {
        Row: {
          kit_type: Database["public"]["Enums"]["kit_type"] | null
          order_count: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          week_start: string | null
        }
        Relationships: []
      }
      v_result_to_supplement_conversion: {
        Row: {
          conversion_pct: number | null
          kit_type: Database["public"]["Enums"]["kit_type"] | null
          users_with_result: number | null
          users_with_subscription: number | null
        }
        Relationships: []
      }
      v_supplement_mrr: {
        Row: {
          active_subscribers: number | null
          mrr_gbp: number | null
          product_slug: string | null
        }
        Relationships: []
      }
      v_weekly_kit_sales: {
        Row: {
          kit_type: Database["public"]["Enums"]["kit_type"] | null
          units_sold: number | null
          week_start: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      promote_proposed_revision: { Args: { p_slug: string }; Returns: string }
      record_ewa_signoff: {
        Args: { p_signed_at?: string; p_slug: string }
        Returns: string
      }
      stage_blog_revision: {
        Args: {
          p_body: string
          p_editor: string
          p_frontmatter: Json
          p_keyword_coverage: Json
          p_slug: string
        }
        Returns: string
      }
      upsert_blog_article: {
        Args: {
          p_body: string
          p_editor: string
          p_frontmatter: Json
          p_keyword_coverage: Json
          p_slug: string
          p_status: Database["public"]["Enums"]["blog_article_status"]
        }
        Returns: string
      }
    }
    Enums: {
      agent_run_status: "ok" | "error" | "blocked"
      blog_article_status: "draft" | "published" | "archived"
      content_blocked_on: "keith" | "ewa"
      content_pipeline_stage:
        | "keyword_selected"
        | "briefed"
        | "brief_ready"
        | "drafted"
        | "in_review"
        | "approved"
        | "scheduled"
        | "published"
        | "reoptimising"
      content_review_status:
        | "submitted"
        | "approved"
        | "rejected"
        | "needs_revision"
      deposit_status: "pending" | "paid" | "cancelled" | "refunded"
      keyword_coverage_status:
        | "unassigned"
        | "planned"
        | "briefed"
        | "drafted"
        | "published"
        | "deferred"
        | "excluded"
      keyword_queue_status: "candidate" | "accepted" | "rejected"
      kit_type: "testosterone" | "energy-recovery" | "hormone-recovery"
      order_status:
        | "pending"
        | "paid"
        | "dispatched"
        | "sample_registered"
        | "processing"
        | "results_received"
        | "cancelled"
        | "refunded"
        | "sample_failed"
        | "on_hold"
        | "data_purged"
      subscription_status:
        | "incomplete"
        | "trialing"
        | "active"
        | "past_due"
        | "cancelled"
        | "unpaid"
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
      agent_run_status: ["ok", "error", "blocked"],
      blog_article_status: ["draft", "published", "archived"],
      content_blocked_on: ["keith", "ewa"],
      content_pipeline_stage: [
        "keyword_selected",
        "briefed",
        "brief_ready",
        "drafted",
        "in_review",
        "approved",
        "scheduled",
        "published",
        "reoptimising",
      ],
      content_review_status: [
        "submitted",
        "approved",
        "rejected",
        "needs_revision",
      ],
      deposit_status: ["pending", "paid", "cancelled", "refunded"],
      keyword_coverage_status: [
        "unassigned",
        "planned",
        "briefed",
        "drafted",
        "published",
        "deferred",
        "excluded",
      ],
      keyword_queue_status: ["candidate", "accepted", "rejected"],
      kit_type: ["testosterone", "energy-recovery", "hormone-recovery"],
      order_status: [
        "pending",
        "paid",
        "dispatched",
        "sample_registered",
        "processing",
        "results_received",
        "cancelled",
        "refunded",
        "sample_failed",
        "on_hold",
        "data_purged",
      ],
      subscription_status: [
        "incomplete",
        "trialing",
        "active",
        "past_due",
        "cancelled",
        "unpaid",
      ],
    },
  },
} as const
