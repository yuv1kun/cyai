import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AIModel {
  id: string;
  name: string;
  model_type: string;
  version: string;
  file_path: string;
  model_config: any;
  accuracy: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ThreatDetection {
  id: string;
  threat_type: string;
  severity: string;
  confidence: number;
  source_ip: string | null;
  destination_ip: string | null;
  protocol: string | null;
  attack_type: string | null;
  indicators: string[];
  mitigation_steps: string[];
  explanation: string | null;
  detected_at: string;
  status: string;
}

export const useAIModels = () => {
  const [models, setModels] = useState<AIModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ai_models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch AI models');
    } finally {
      setLoading(false);
    }
  };

  const uploadModel = async (file: File, modelData: { name: string; model_type: string; version: string; model_config?: any; accuracy?: number }) => {
    try {
      // Upload model file to storage
      const fileName = `${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('ai-models')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create model record
      const { data, error } = await supabase
        .from('ai_models')
        .insert({
          name: modelData.name,
          model_type: modelData.model_type,
          version: modelData.version,
          file_path: fileName,
          model_config: modelData.model_config || {},
          accuracy: modelData.accuracy || null,
        })
        .select()
        .single();

      if (error) throw error;

      setModels(prev => [data, ...prev]);
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to upload model');
    }
  };

  const activateModel = async (modelId: string, modelType: string) => {
    try {
      // Deactivate other models of the same type
      await supabase
        .from('ai_models')
        .update({ is_active: false })
        .eq('model_type', modelType);

      // Activate selected model
      const { error } = await supabase
        .from('ai_models')
        .update({ is_active: true })
        .eq('id', modelId);

      if (error) throw error;

      await fetchModels();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to activate model');
    }
  };

  const deleteModel = async (modelId: string) => {
    try {
      // Get model to find file path
      const { data: model } = await supabase
        .from('ai_models')
        .select('file_path')
        .eq('id', modelId)
        .single();

      if (model?.file_path) {
        // Delete file from storage
        await supabase.storage
          .from('ai-models')
          .remove([model.file_path]);
      }

      // Delete model record
      const { error } = await supabase
        .from('ai_models')
        .delete()
        .eq('id', modelId);

      if (error) throw error;

      setModels(prev => prev.filter(m => m.id !== modelId));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete model');
    }
  };

  return {
    models,
    loading,
    error,
    uploadModel,
    activateModel,
    deleteModel,
    refetch: fetchModels
  };
};

export const useThreatDetections = () => {
  const [detections, setDetections] = useState<ThreatDetection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('threat_detections')
        .select('*')
        .order('detected_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setDetections((data || []).map(d => ({
        ...d,
        indicators: Array.isArray(d.indicators) ? d.indicators.map(String) : [],
        mitigation_steps: Array.isArray(d.mitigation_steps) ? d.mitigation_steps.map(String) : []
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch threat detections');
    } finally {
      setLoading(false);
    }
  };

  const updateDetectionStatus = async (detectionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('threat_detections')
        .update({ status })
        .eq('id', detectionId);

      if (error) throw error;

      setDetections(prev => 
        prev.map(d => d.id === detectionId ? { ...d, status } : d)
      );
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update detection status');
    }
  };

  return {
    detections,
    loading,
    error,
    updateDetectionStatus,
    refetch: fetchDetections
  };
};