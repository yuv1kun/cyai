-- Create tables for AI model integration

-- Table for storing AI model metadata
CREATE TABLE public.ai_models (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    model_type TEXT NOT NULL, -- 'network_intrusion', 'malware_detection', 'phishing_detection', etc.
    version TEXT NOT NULL,
    file_path TEXT NOT NULL, -- Path to model file in storage
    model_config JSONB DEFAULT '{}',
    accuracy FLOAT,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for storing AI predictions and results
CREATE TABLE public.ai_predictions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    model_id UUID REFERENCES public.ai_models(id) NOT NULL,
    input_data JSONB NOT NULL,
    prediction_result JSONB NOT NULL,
    confidence_score FLOAT NOT NULL,
    prediction_type TEXT NOT NULL,
    source_ip TEXT,
    destination_ip TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    processing_time_ms INTEGER
);

-- Table for storing threat detection results
CREATE TABLE public.threat_detections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    prediction_id UUID REFERENCES public.ai_predictions(id),
    threat_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    confidence FLOAT NOT NULL,
    source_ip TEXT,
    destination_ip TEXT,
    protocol TEXT,
    attack_type TEXT,
    indicators JSONB DEFAULT '[]',
    mitigation_steps JSONB DEFAULT '[]',
    explanation TEXT,
    detected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    status TEXT DEFAULT 'detected' CHECK (status IN ('detected', 'investigating', 'resolved', 'false_positive'))
);

-- Table for storing network analysis results
CREATE TABLE public.network_analysis (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_type TEXT NOT NULL,
    input_data JSONB NOT NULL,
    analysis_result JSONB NOT NULL,
    metrics JSONB DEFAULT '{}',
    anomaly_score FLOAT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threat_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_analysis ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a demo app)
CREATE POLICY "Allow public read access to ai_models" ON public.ai_models FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to ai_models" ON public.ai_models FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to ai_models" ON public.ai_models FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to ai_predictions" ON public.ai_predictions FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to ai_predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access to threat_detections" ON public.threat_detections FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to threat_detections" ON public.threat_detections FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to threat_detections" ON public.threat_detections FOR UPDATE USING (true);

CREATE POLICY "Allow public read access to network_analysis" ON public.network_analysis FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to network_analysis" ON public.network_analysis FOR INSERT WITH CHECK (true);

-- Create storage buckets for AI models
INSERT INTO storage.buckets (id, name, public) VALUES ('ai-models', 'ai-models', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('training-data', 'training-data', false);

-- Create storage policies for AI models
CREATE POLICY "Allow public read access to ai-models bucket" ON storage.objects FOR SELECT USING (bucket_id = 'ai-models');
CREATE POLICY "Allow public insert access to ai-models bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'ai-models');
CREATE POLICY "Allow public update access to ai-models bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'ai-models');

CREATE POLICY "Allow public read access to training-data bucket" ON storage.objects FOR SELECT USING (bucket_id = 'training-data');
CREATE POLICY "Allow public insert access to training-data bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'training-data');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_ai_models_updated_at
    BEFORE UPDATE ON public.ai_models
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_ai_models_type ON public.ai_models(model_type);
CREATE INDEX idx_ai_models_active ON public.ai_models(is_active);
CREATE INDEX idx_ai_predictions_model_id ON public.ai_predictions(model_id);
CREATE INDEX idx_ai_predictions_timestamp ON public.ai_predictions(timestamp);
CREATE INDEX idx_threat_detections_timestamp ON public.threat_detections(detected_at);
CREATE INDEX idx_threat_detections_severity ON public.threat_detections(severity);
CREATE INDEX idx_network_analysis_timestamp ON public.network_analysis(created_at);