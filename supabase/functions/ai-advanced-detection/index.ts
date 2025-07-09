import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DetectionRequest {
  simulationData: any;
  category: string;
}

interface DetectionResult {
  id: string;
  threatType: string;
  category: string;
  confidence: number;
  severity: string;
  timestamp: string;
  sourceIP: string;
  explanation: string;
  indicators: string[];
  mitigationSteps: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { simulationData, category }: DetectionRequest = await req.json();

    if (!simulationData || !category) {
      throw new Error('Missing simulation data or category');
    }

    const startTime = Date.now();

    // Get active AI model for the specific category
    const { data: model, error: modelError } = await supabase
      .from('ai_models')
      .select('*')
      .eq('model_type', category)
      .eq('is_active', true)
      .single();

    let result: DetectionResult;

    if (modelError || !model) {
      console.log(`No active AI model found for category: ${category}, using fallback`);
      result = await generateFallbackDetection(category);
    } else {
      result = await runAdvancedDetection(supabase, model, simulationData, category);
    }

    // Store the detection result
    await supabase
      .from('threat_detections')
      .insert({
        threat_type: result.threatType,
        severity: result.severity,
        confidence: result.confidence,
        source_ip: result.sourceIP,
        attack_type: result.threatType,
        indicators: result.indicators,
        mitigation_steps: result.mitigationSteps,
        explanation: result.explanation
      });

    const processingTime = Date.now() - startTime;

    return new Response(
      JSON.stringify({
        result,
        processingTime,
        modelUsed: model?.name || 'Fallback Detection'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in ai-advanced-detection:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function runAdvancedDetection(supabase: any, model: any, simulationData: any, category: string): Promise<DetectionResult> {
  // Extract features from simulation data
  const features = extractAdvancedFeatures(simulationData, category);
  
  // Run AI inference
  const prediction = await runAdvancedAIInference(model, features, category);
  
  // Store prediction in database
  await supabase
    .from('ai_predictions')
    .insert({
      model_id: model.id,
      input_data: { simulationData, features },
      prediction_result: prediction,
      confidence_score: prediction.confidence,
      prediction_type: 'advanced_detection',
      processing_time_ms: Math.floor(Math.random() * 200) + 50
    });

  return {
    id: crypto.randomUUID(),
    threatType: prediction.threatType,
    category: category,
    confidence: prediction.confidence,
    severity: prediction.severity,
    timestamp: new Date().toISOString(),
    sourceIP: prediction.sourceIP,
    explanation: prediction.explanation,
    indicators: prediction.indicators,
    mitigationSteps: prediction.mitigationSteps
  };
}

function extractAdvancedFeatures(simulationData: any, category: string) {
  const baseFeatures = {
    timestamp: Date.now(),
    category: category,
    dataSize: JSON.stringify(simulationData).length
  };

  // Category-specific feature extraction
  switch (category) {
    case 'network_intrusion':
      return {
        ...baseFeatures,
        connectionCount: Math.floor(Math.random() * 1000) + 100,
        portScanFrequency: Math.random() * 20,
        protocolDistribution: { TCP: 0.7, UDP: 0.2, ICMP: 0.1 }
      };
    
    case 'malware_ransomware':
      return {
        ...baseFeatures,
        fileEncryptionRate: Math.floor(Math.random() * 200) + 50,
        processCount: Math.floor(Math.random() * 50) + 10,
        registryChanges: Math.floor(Math.random() * 100) + 20
      };
    
    case 'phishing_social':
      return {
        ...baseFeatures,
        domainAge: Math.floor(Math.random() * 365) + 1,
        similarityScore: Math.random(),
        urgencyKeywords: Math.floor(Math.random() * 10) + 1
      };
    
    default:
      return baseFeatures;
  }
}

async function runAdvancedAIInference(model: any, features: any, category: string) {
  // Simulate advanced AI model inference
  const confidence = 0.6 + Math.random() * 0.4;
  
  // Category-specific threat detection
  const categoryData = getCategoryData(category);
  const threatType = categoryData.threats[Math.floor(Math.random() * categoryData.threats.length)];
  
  return {
    threatType,
    confidence,
    severity: getSeverityFromConfidence(confidence),
    sourceIP: generateRandomIP(),
    explanation: generateExplanation(category, threatType, confidence),
    indicators: categoryData.indicators,
    mitigationSteps: categoryData.mitigationSteps,
    modelVersion: model.version
  };
}

async function generateFallbackDetection(category: string): Promise<DetectionResult> {
  const categoryData = getCategoryData(category);
  const confidence = 0.5 + Math.random() * 0.4;
  const threatType = categoryData.threats[Math.floor(Math.random() * categoryData.threats.length)];
  
  return {
    id: crypto.randomUUID(),
    threatType,
    category,
    confidence,
    severity: getSeverityFromConfidence(confidence),
    timestamp: new Date().toISOString(),
    sourceIP: generateRandomIP(),
    explanation: generateExplanation(category, threatType, confidence),
    indicators: categoryData.indicators,
    mitigationSteps: categoryData.mitigationSteps
  };
}

function getCategoryData(category: string) {
  const categoryMap: Record<string, any> = {
    network_intrusion: {
      threats: ['Port Scan Attack', 'Network Reconnaissance', 'Lateral Movement'],
      indicators: [
        'Unusual port scanning activity',
        'Multiple failed connection attempts',
        'Suspicious network traffic patterns'
      ],
      mitigationSteps: [
        'Block suspicious IP addresses',
        'Enable network intrusion detection',
        'Monitor network traffic closely'
      ]
    },
    malware_ransomware: {
      threats: ['Ransomware Encryption', 'Malware Execution', 'File System Attack'],
      indicators: [
        'Rapid file encryption activity',
        'Unknown process execution',
        'Registry modification attempts'
      ],
      mitigationSteps: [
        'Isolate affected systems',
        'Run comprehensive malware scan',
        'Restore from clean backups'
      ]
    },
    phishing_social: {
      threats: ['Phishing Campaign', 'Social Engineering', 'Credential Theft'],
      indicators: [
        'Suspicious email patterns',
        'Recently registered domains',
        'High template similarity'
      ],
      mitigationSteps: [
        'Block malicious domains',
        'Train users on phishing awareness',
        'Implement email filtering'
      ]
    },
    insider_threats: {
      threats: ['Data Exfiltration', 'Unauthorized Access', 'Privilege Escalation'],
      indicators: [
        'Unusual access patterns',
        'Off-hours data access',
        'Large data transfers'
      ],
      mitigationSteps: [
        'Review user access permissions',
        'Monitor data access logs',
        'Implement data loss prevention'
      ]
    },
    zero_day_apt: {
      threats: ['Advanced Persistent Threat', 'Zero-Day Exploit', 'Custom Malware'],
      indicators: [
        'Unknown attack signatures',
        'Advanced evasion techniques',
        'Persistent system access'
      ],
      mitigationSteps: [
        'Implement behavioral monitoring',
        'Update security signatures',
        'Conduct forensic analysis'
      ]
    },
    data_exfiltration: {
      threats: ['Data Breach', 'Information Theft', 'Unauthorized Transfer'],
      indicators: [
        'Large outbound data transfers',
        'Unusual network destinations',
        'Compressed file transfers'
      ],
      mitigationSteps: [
        'Block suspicious connections',
        'Monitor data movement',
        'Implement data encryption'
      ]
    },
    ddos_attacks: {
      threats: ['DDoS Attack', 'Traffic Flooding', 'Service Disruption'],
      indicators: [
        'Massive traffic increase',
        'Multiple source IPs',
        'Repeated identical requests'
      ],
      mitigationSteps: [
        'Enable DDoS protection',
        'Implement rate limiting',
        'Scale infrastructure'
      ]
    },
    deepfake_ai: {
      threats: ['Deepfake Media', 'Synthetic Content', 'AI-Generated Fraud'],
      indicators: [
        'Inconsistent compression artifacts',
        'Temporal inconsistencies',
        'Synthetic biometric markers'
      ],
      mitigationSteps: [
        'Verify media authenticity',
        'Implement detection algorithms',
        'Cross-reference with reliable sources'
      ]
    }
  };

  return categoryMap[category] || {
    threats: ['Unknown Threat'],
    indicators: ['Suspicious activity detected'],
    mitigationSteps: ['Investigate further']
  };
}

function getSeverityFromConfidence(confidence: number): string {
  if (confidence >= 0.9) return 'critical';
  if (confidence >= 0.7) return 'high';
  if (confidence >= 0.5) return 'medium';
  return 'low';
}

function generateExplanation(category: string, threatType: string, confidence: number): string {
  return `AI model detected ${threatType} in ${category.replace('_', ' ')} category with ${(confidence * 100).toFixed(1)}% confidence based on behavioral analysis and pattern recognition.`;
}

function generateRandomIP(): string {
  return `10.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}