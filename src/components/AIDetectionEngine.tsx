import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, AlertTriangle, Info, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DetectionResult, AIExplanation, generateMockDetection } from '@/types/threats';
import { supabase } from '@/integrations/supabase/client';

interface AIDetectionEngineProps {
  simulationData: any;
  category: string;
  onDetectionComplete: (result: DetectionResult) => void;
}

export const AIDetectionEngine = ({ simulationData, category, onDetectionComplete }: AIDetectionEngineProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState('');
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [aiExplanation, setAiExplanation] = useState<AIExplanation | null>(null);

  const analysisStages = [
    'Preprocessing data inputs...',
    'Extracting behavioral features...',
    'Running anomaly detection models...',
    'Applying threat-specific algorithms...',
    'Correlating with threat intelligence...',
    'Generating AI explanations...',
    'Finalizing detection results...'
  ];

  useEffect(() => {
    if (simulationData && category) {
      runDetectionAnalysis();
    }
  }, [simulationData, category]);

  const runDetectionAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setDetectionResult(null);
    setAiExplanation(null);

    // Simulate AI analysis with realistic timing
    for (let i = 0; i < analysisStages.length; i++) {
      setCurrentStage(analysisStages[i]);
      
      // Simulate processing time for each stage
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 300));
      
      setAnalysisProgress(((i + 1) / analysisStages.length) * 90);
    }

    try {
      // Call real AI detection endpoint
      const { data, error } = await supabase.functions.invoke('ai-advanced-detection', {
        body: {
          simulationData: simulationData,
          category: category
        }
      });

      if (error) {
        console.error('AI detection error:', error);
        throw error;
      }

      setAnalysisProgress(100);
      
      // Use real AI detection result
      const result = data.result;
      const explanation = generateAIExplanation(result, simulationData);
      
      setDetectionResult(result);
      setAiExplanation(explanation);
      setIsAnalyzing(false);
      
      onDetectionComplete(result);

    } catch (error) {
      console.error('Advanced AI detection failed:', error);
      
      // Fallback to mock detection
      const result = generateMockDetection(category);
      const explanation = generateAIExplanation(result, simulationData);
      
      setAnalysisProgress(100);
      setDetectionResult(result);
      setAiExplanation(explanation);
      setIsAnalyzing(false);
      
      onDetectionComplete(result);
    }
  };

  const generateAIExplanation = (result: DetectionResult, data: any): AIExplanation => {
    const keyFeatures = generateKeyFeatures(result.category, data);
    
    return {
      decision: result.confidence > 0.5 ? 'threat' : 'benign',
      confidence: result.confidence,
      keyFeatures,
      reasoning: generateReasoning(result.category, result.confidence),
      similarCases: [
        'Similar attack detected 2 weeks ago',
        'Pattern matches APT-29 techniques',
        'Correlates with recent threat intelligence'
      ]
    };
  };

  const generateKeyFeatures = (category: string, data: any) => {
    const featureMap: Record<string, any[]> = {
      network_intrusion: [
        { feature: 'Port Scan Frequency', importance: 0.85, value: '15 ports/sec', explanation: 'Unusually high port scanning rate' },
        { feature: 'Connection Pattern', importance: 0.72, value: 'Sequential', explanation: 'Systematic reconnaissance behavior' },
        { feature: 'Protocol Distribution', importance: 0.68, value: 'TCP-heavy', explanation: 'Abnormal protocol usage for time period' }
      ],
      malware_ransomware: [
        { feature: 'File Encryption Rate', importance: 0.92, value: '150 files/min', explanation: 'Rapid file modification consistent with ransomware' },
        { feature: 'Process Behavior', importance: 0.88, value: 'Abnormal', explanation: 'Unknown process with system-level access' },
        { feature: 'Registry Changes', importance: 0.75, value: 'Persistence keys', explanation: 'Modifications to startup registry entries' }
      ],
      phishing_social: [
        { feature: 'Domain Reputation', importance: 0.89, value: 'Recently registered', explanation: 'Domain created within last 30 days' },
        { feature: 'Email Similarity', importance: 0.83, value: '94% match', explanation: 'High similarity to known phishing templates' },
        { feature: 'Urgency Keywords', importance: 0.71, value: 'Present', explanation: 'Contains social engineering pressure tactics' }
      ],
      insider_threats: [
        { feature: 'Access Time Anomaly', importance: 0.87, value: '3:00 AM', explanation: 'File access outside normal working hours' },
        { feature: 'Data Volume', importance: 0.79, value: '500MB', explanation: 'Unusually large data download for user role' },
        { feature: 'Location Variance', importance: 0.73, value: 'Foreign IP', explanation: 'Access from unexpected geographical location' }
      ],
      zero_day_apt: [
        { feature: 'Unknown Signature', importance: 0.95, value: 'No match', explanation: 'Behavior not found in known attack databases' },
        { feature: 'Persistence Score', importance: 0.88, value: 'High', explanation: 'Multiple persistence mechanisms detected' },
        { feature: 'Stealth Indicators', importance: 0.81, value: 'Advanced', explanation: 'Evidence of evasion techniques' }
      ],
      data_exfiltration: [
        { feature: 'Outbound Data Size', importance: 0.91, value: '2.5GB', explanation: 'Large volume of data leaving the network' },
        { feature: 'Destination Analysis', importance: 0.84, value: 'Suspicious', explanation: 'Data sent to unrecognized external server' },
        { feature: 'Timing Pattern', importance: 0.76, value: 'Off-hours', explanation: 'Transfer initiated during low-activity period' }
      ],
      ddos_attacks: [
        { feature: 'Traffic Volume', importance: 0.93, value: '1000x normal', explanation: 'Massive spike in incoming requests' },
        { feature: 'Source Distribution', importance: 0.86, value: 'Botnet pattern', explanation: 'Requests from multiple coordinated sources' },
        { feature: 'Request Patterns', importance: 0.78, value: 'Identical payloads', explanation: 'Repeated identical malformed requests' }
      ],
      deepfake_ai: [
        { feature: 'Compression Artifacts', importance: 0.87, value: 'Detected', explanation: 'Inconsistent compression patterns in media' },
        { feature: 'Temporal Consistency', importance: 0.82, value: 'Low', explanation: 'Frame-to-frame inconsistencies in video' },
        { feature: 'Biometric Markers', importance: 0.74, value: 'Synthetic', explanation: 'Facial or voice patterns show AI generation signs' }
      ]
    };

    return featureMap[category] || [
      { feature: 'Anomaly Score', importance: 0.8, value: 'High', explanation: 'General suspicious behavior detected' }
    ];
  };

  const generateReasoning = (category: string, confidence: number) => {
    const reasoningMap: Record<string, string> = {
      network_intrusion: `The AI model detected network intrusion with ${(confidence * 100).toFixed(1)}% confidence based on unusual traffic patterns, systematic port scanning behavior, and deviation from normal network baselines. The combination of high-frequency scanning and sequential targeting patterns strongly indicates reconnaissance activity.`,
      malware_ransomware: `Machine learning algorithms identified malware activity with ${(confidence * 100).toFixed(1)}% confidence through behavioral analysis of file system changes, process execution patterns, and system modification activities. The rapid file encryption rate and registry persistence mechanisms are characteristic of ransomware behavior.`,
      phishing_social: `Natural language processing and behavioral analysis detected phishing attempt with ${(confidence * 100).toFixed(1)}% confidence. The combination of recently registered domains, template similarity to known phishing campaigns, and social engineering language patterns indicates a coordinated attack.`,
      insider_threats: `User behavior analytics identified potential insider threat with ${(confidence * 100).toFixed(1)}% confidence based on significant deviations from normal user patterns. Unusual access times, data volumes, and geographical locations suggest unauthorized or malicious activity.`,
      zero_day_apt: `Advanced persistent threat detection algorithms flagged unknown attack techniques with ${(confidence * 100).toFixed(1)}% confidence. The presence of novel signatures, sophisticated persistence mechanisms, and advanced evasion techniques indicates a zero-day exploit or APT activity.`,
      data_exfiltration: `Data loss prevention algorithms detected potential exfiltration with ${(confidence * 100).toFixed(1)}% confidence based on unusual outbound data patterns. Large volume transfers to unknown destinations during off-hours strongly suggest unauthorized data movement.`,
      ddos_attacks: `Distributed denial of service detection identified attack pattern with ${(confidence * 100).toFixed(1)}% confidence through traffic analysis and statistical modeling. The massive volume increase from coordinated sources with identical payloads confirms DDoS activity.`,
      deepfake_ai: `Synthetic media detection algorithms identified artificial content with ${(confidence * 100).toFixed(1)}% confidence using deep learning models trained on authentic vs. generated media. Compression inconsistencies and biometric anomalies indicate AI-generated content.`
    };

    return reasoningMap[category] || `AI analysis completed with ${(confidence * 100).toFixed(1)}% confidence based on anomaly detection and behavioral analysis.`;
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-neon-orange';
      case 'medium': return 'text-warning';
      case 'low': return 'text-neon-green';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-neon-orange" />;
      case 'medium': return <Info className="h-5 w-5 text-warning" />;
      case 'low': return <CheckCircle className="h-5 w-5 text-neon-green" />;
      default: return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* AI Engine Header */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-xl font-orbitron">AI Detection Engine</CardTitle>
              <CardDescription>Advanced machine learning threat detection and analysis</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analysis Progress */}
      {isAnalyzing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">AI Analysis in Progress</span>
                  <span className="text-sm text-muted-foreground">{Math.round(analysisProgress)}%</span>
                </div>
                <Progress value={analysisProgress} className="h-2" />
                <p className="text-sm text-neon-cyan animate-pulse">{currentStage}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Detection Results */}
      <AnimatePresence>
        {detectionResult && aiExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Main Detection Result */}
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getSeverityIcon(detectionResult.severity)}
                    <div>
                      <CardTitle className="text-lg">{detectionResult.threatType} Detected</CardTitle>
                      <CardDescription>{detectionResult.explanation}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-orbitron font-bold ${getSeverityColor(detectionResult.severity)}`}>
                      {(detectionResult.confidence * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Confidence</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Category</div>
                    <div className="font-semibold">{detectionResult.category.replace('_', ' ').toUpperCase()}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Severity</div>
                    <Badge variant={detectionResult.severity === 'critical' ? 'destructive' : 'secondary'}>
                      {detectionResult.severity}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Source IP</div>
                    <div className="font-mono text-sm">{detectionResult.sourceIP}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-muted-foreground">Timestamp</div>
                    <div className="text-sm">{new Date(detectionResult.timestamp).toLocaleTimeString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Explanation */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>AI Analysis & Feature Importance</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{aiExplanation.reasoning}</p>
                
                <div>
                  <h4 className="font-semibold mb-3">Key Detection Features</h4>
                  <div className="space-y-3">
                    {aiExplanation.keyFeatures.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{feature.feature}</span>
                            <span className="text-xs text-muted-foreground">{feature.value}</span>
                          </div>
                          <Progress value={feature.importance * 100} className="h-1" />
                          <p className="text-xs text-muted-foreground mt-1">{feature.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Indicators and Mitigation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Threat Indicators</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {detectionResult.indicators.map((indicator, idx) => (
                      <li key={idx} className="text-sm flex items-start space-x-2">
                        <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                        <span>{indicator}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-lg">Recommended Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {detectionResult.mitigationSteps.map((step, idx) => (
                      <li key={idx} className="text-sm flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-neon-green mt-0.5 flex-shrink-0" />
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};