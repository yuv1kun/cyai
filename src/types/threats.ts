export interface ThreatCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  color: string;
  examples: string[];
}

export interface DetectionResult {
  id: string;
  category: string;
  threatType: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  sourceIP?: string;
  targetIP?: string;
  userId?: string;
  fileName?: string;
  explanation: string;
  indicators: string[];
  mitigationSteps: string[];
  affectedAssets: string[];
}

export interface SimulationData {
  category: string;
  dataType: 'network' | 'email' | 'file' | 'user_behavior' | 'system_logs' | 'multimedia';
  payload: any;
  metadata: {
    sourceIP?: string;
    destinationIP?: string;
    protocol?: string;
    fileType?: string;
    userAgent?: string;
    timestamp?: string;
  };
}

export interface AIExplanation {
  decision: 'threat' | 'benign';
  confidence: number;
  keyFeatures: Array<{
    feature: string;
    importance: number;
    value: any;
    explanation: string;
  }>;
  reasoning: string;
  similarCases: string[];
}

export const THREAT_CATEGORIES: ThreatCategory[] = [
  {
    id: 'network_intrusion',
    name: 'Network Intrusions',
    description: 'Unauthorized access attempts and lateral movement within networks',
    icon: 'Network',
    severity: 'high',
    color: 'text-destructive',
    examples: ['Port scanning', 'Lateral movement', 'Privilege escalation', 'Command injection']
  },
  {
    id: 'malware_ransomware',
    name: 'Malware & Ransomware',
    description: 'Malicious software attempting to infect systems or encrypt data',
    icon: 'Bug',
    severity: 'critical',
    color: 'text-destructive',
    examples: ['File encryption', 'System modification', 'Process injection', 'Registry changes']
  },
  {
    id: 'phishing_social',
    name: 'Phishing & Social Engineering',
    description: 'Attempts to trick users into revealing credentials or installing malware',
    icon: 'Mail',
    severity: 'medium',
    color: 'text-warning',
    examples: ['Credential harvesting', 'Fake attachments', 'Domain spoofing', 'CEO fraud']
  },
  {
    id: 'insider_threats',
    name: 'Insider Threats',
    description: 'Malicious or careless actions by trusted users within the organization',
    icon: 'UserX',
    severity: 'high',
    color: 'text-neon-orange',
    examples: ['Data theft', 'Privilege abuse', 'After-hours access', 'Unusual file access']
  },
  {
    id: 'zero_day_apt',
    name: 'Zero-Day & APTs',
    description: 'Advanced persistent threats exploiting unknown vulnerabilities',
    icon: 'Zap',
    severity: 'critical',
    color: 'text-destructive',
    examples: ['Unknown exploits', 'Persistent backdoors', 'Steganography', 'Living-off-the-land']
  },
  {
    id: 'data_exfiltration',
    name: 'Data Exfiltration',
    description: 'Unauthorized transfer of sensitive data outside the organization',
    icon: 'Download',
    severity: 'critical',
    color: 'text-destructive',
    examples: ['Large file transfers', 'Unusual upload patterns', 'DNS tunneling', 'Cloud storage abuse']
  },
  {
    id: 'ddos_attacks',
    name: 'DoS/DDoS Attacks',
    description: 'Attempts to overwhelm network resources and disrupt service availability',
    icon: 'Wifi',
    severity: 'high',
    color: 'text-neon-orange',
    examples: ['Traffic flooding', 'Resource exhaustion', 'Application layer attacks', 'Amplification attacks']
  },
  {
    id: 'deepfake_ai',
    name: 'Deepfake & AI Attacks',
    description: 'AI-generated content used for fraud, impersonation, or disinformation',
    icon: 'Eye',
    severity: 'medium',
    color: 'text-neon-purple',
    examples: ['Voice cloning', 'Face swapping', 'Text generation', 'Synthetic media']
  }
];

export const generateMockDetection = (category: string): DetectionResult => {
  const threat = THREAT_CATEGORIES.find(t => t.id === category);
  const threatTypes = threat?.examples || ['Unknown threat'];
  const threatType = threatTypes[Math.floor(Math.random() * threatTypes.length)];
  
  const severities: Array<'low' | 'medium' | 'high' | 'critical'> = ['low', 'medium', 'high', 'critical'];
  const severity = severities[Math.floor(Math.random() * severities.length)];
  
  const indicators = generateIndicators(category);
  const mitigation = generateMitigationSteps(category);
  const assets = generateAffectedAssets(category);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    category,
    threatType,
    confidence: 0.75 + Math.random() * 0.25,
    severity,
    timestamp: new Date().toISOString(),
    sourceIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    targetIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    userId: `user_${Math.floor(Math.random() * 1000)}`,
    fileName: category.includes('malware') ? `suspicious_${Math.random().toString(36).substr(2, 5)}.exe` : undefined,
    explanation: generateExplanation(category, threatType),
    indicators,
    mitigationSteps: mitigation,
    affectedAssets: assets
  };
};

const generateIndicators = (category: string): string[] => {
  const indicatorMap: Record<string, string[]> = {
    network_intrusion: ['Unusual port scanning activity', 'Multiple failed login attempts', 'Privilege escalation detected'],
    malware_ransomware: ['Suspicious file encryption patterns', 'Unknown process execution', 'Registry modifications'],
    phishing_social: ['Suspicious email domain', 'Credential harvesting attempt', 'Social engineering patterns'],
    insider_threats: ['After-hours file access', 'Unusual data volume transfer', 'Privilege escalation attempt'],
    zero_day_apt: ['Unknown attack signature', 'Persistent backdoor activity', 'Covert channel communication'],
    data_exfiltration: ['Large outbound data transfer', 'Unauthorized cloud storage access', 'DNS tunneling detected'],
    ddos_attacks: ['Traffic volume spike', 'Resource exhaustion pattern', 'Distributed source IPs'],
    deepfake_ai: ['Synthetic media markers', 'Voice pattern anomalies', 'Generated content signatures']
  };
  
  return indicatorMap[category] || ['Unknown indicators'];
};

const generateMitigationSteps = (category: string): string[] => {
  const mitigationMap: Record<string, string[]> = {
    network_intrusion: ['Block suspicious IP addresses', 'Reset compromised credentials', 'Monitor network traffic'],
    malware_ransomware: ['Isolate infected systems', 'Restore from clean backups', 'Update antivirus signatures'],
    phishing_social: ['Block malicious domains', 'User security awareness training', 'Email filtering enhancement'],
    insider_threats: ['Review user access privileges', 'Monitor user activity', 'Implement data loss prevention'],
    zero_day_apt: ['Apply emergency patches', 'Implement behavioral monitoring', 'Threat hunting activities'],
    data_exfiltration: ['Block data transfer channels', 'Monitor sensitive data access', 'Implement DLP policies'],
    ddos_attacks: ['Enable DDoS protection', 'Scale infrastructure', 'Implement rate limiting'],
    deepfake_ai: ['Verify content authenticity', 'Implement detection algorithms', 'User awareness training']
  };
  
  return mitigationMap[category] || ['General security measures'];
};

const generateAffectedAssets = (category: string): string[] => {
  const assetMap: Record<string, string[]> = {
    network_intrusion: ['Web servers', 'Database servers', 'Network infrastructure'],
    malware_ransomware: ['Employee workstations', 'File servers', 'Backup systems'],
    phishing_social: ['Email systems', 'User accounts', 'Authentication services'],
    insider_threats: ['Internal databases', 'File shares', 'HR systems'],
    zero_day_apt: ['Critical infrastructure', 'Domain controllers', 'Sensitive databases'],
    data_exfiltration: ['Customer databases', 'Financial records', 'Intellectual property'],
    ddos_attacks: ['Public web services', 'API endpoints', 'CDN infrastructure'],
    deepfake_ai: ['Communication platforms', 'Social media accounts', 'Video conferencing']
  };
  
  return assetMap[category] || ['Unknown assets'];
};

const generateExplanation = (category: string, threatType: string): string => {
  const explanations: Record<string, string> = {
    network_intrusion: `AI detected ${threatType} through anomalous network traffic patterns and behavioral analysis indicating potential unauthorized access.`,
    malware_ransomware: `Machine learning algorithms identified ${threatType} based on file behavior analysis and system modification patterns typical of malicious software.`,
    phishing_social: `Natural language processing and behavioral analysis detected ${threatType} through suspicious communication patterns and social engineering indicators.`,
    insider_threats: `User behavior analytics identified ${threatType} through deviation from normal access patterns and data handling behavior.`,
    zero_day_apt: `Advanced anomaly detection flagged ${threatType} using machine learning models trained to identify previously unseen attack techniques.`,
    data_exfiltration: `Data flow analysis and behavioral monitoring detected ${threatType} through unusual outbound data transfer patterns and access anomalies.`,
    ddos_attacks: `Network traffic analysis and statistical modeling identified ${threatType} through traffic volume analysis and distribution pattern recognition.`,
    deepfake_ai: `Deep learning models for synthetic media detection identified ${threatType} through content authenticity analysis and generation artifact detection.`
  };
  
  return explanations[category] || 'AI-powered analysis detected suspicious activity requiring investigation.';
};