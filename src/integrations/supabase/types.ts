export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      ai_models: {
        Row: {
          accuracy: number | null
          created_at: string
          file_path: string
          id: string
          is_active: boolean | null
          model_config: Json | null
          model_type: string
          name: string
          updated_at: string
          version: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          file_path: string
          id?: string
          is_active?: boolean | null
          model_config?: Json | null
          model_type: string
          name: string
          updated_at?: string
          version: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          file_path?: string
          id?: string
          is_active?: boolean | null
          model_config?: Json | null
          model_type?: string
          name?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      ai_predictions: {
        Row: {
          confidence_score: number
          destination_ip: string | null
          id: string
          input_data: Json
          model_id: string
          prediction_result: Json
          prediction_type: string
          processing_time_ms: number | null
          source_ip: string | null
          timestamp: string
        }
        Insert: {
          confidence_score: number
          destination_ip?: string | null
          id?: string
          input_data: Json
          model_id: string
          prediction_result: Json
          prediction_type: string
          processing_time_ms?: number | null
          source_ip?: string | null
          timestamp?: string
        }
        Update: {
          confidence_score?: number
          destination_ip?: string | null
          id?: string
          input_data?: Json
          model_id?: string
          prediction_result?: Json
          prediction_type?: string
          processing_time_ms?: number | null
          source_ip?: string | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_predictions_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "ai_models"
            referencedColumns: ["id"]
          },
        ]
      }
      network_analysis: {
        Row: {
          analysis_result: Json
          analysis_type: string
          anomaly_score: number | null
          created_at: string
          id: string
          input_data: Json
          metrics: Json | null
        }
        Insert: {
          analysis_result: Json
          analysis_type: string
          anomaly_score?: number | null
          created_at?: string
          id?: string
          input_data: Json
          metrics?: Json | null
        }
        Update: {
          analysis_result?: Json
          analysis_type?: string
          anomaly_score?: number | null
          created_at?: string
          id?: string
          input_data?: Json
          metrics?: Json | null
        }
        Relationships: []
      }
      threat_detections: {
        Row: {
          attack_type: string | null
          confidence: number
          destination_ip: string | null
          detected_at: string
          explanation: string | null
          id: string
          indicators: Json | null
          mitigation_steps: Json | null
          prediction_id: string | null
          protocol: string | null
          severity: string
          source_ip: string | null
          status: string | null
          threat_type: string
        }
        Insert: {
          attack_type?: string | null
          confidence: number
          destination_ip?: string | null
          detected_at?: string
          explanation?: string | null
          id?: string
          indicators?: Json | null
          mitigation_steps?: Json | null
          prediction_id?: string | null
          protocol?: string | null
          severity: string
          source_ip?: string | null
          status?: string | null
          threat_type: string
        }
        Update: {
          attack_type?: string | null
          confidence?: number
          destination_ip?: string | null
          detected_at?: string
          explanation?: string | null
          id?: string
          indicators?: Json | null
          mitigation_steps?: Json | null
          prediction_id?: string | null
          protocol?: string | null
          severity?: string
          source_ip?: string | null
          status?: string | null
          threat_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "threat_detections_prediction_id_fkey"
            columns: ["prediction_id"]
            isOneToOne: false
            referencedRelation: "ai_predictions"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
