import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Network, Bug, Mail, UserX, Zap, Download, Wifi, Eye,
  Play, Settings, BarChart3, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { THREAT_CATEGORIES, ThreatCategory } from '@/types/threats';

interface ThreatCategoryCardProps {
  threat: ThreatCategory;
  isActive: boolean;
  onSelect: (categoryId: string) => void;
  onSimulate: (categoryId: string) => void;
  onShowDetails: (threat: ThreatCategory) => void;
}

const iconMap = {
  Network, Bug, Mail, UserX, Zap, Download, Wifi, Eye
} as const;

const ThreatCategoryCard = ({ threat, isActive, onSelect, onSimulate, onShowDetails }: ThreatCategoryCardProps) => {
  const IconComponent = iconMap[threat.icon as keyof typeof iconMap] || Shield;
  
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`
          cursor-pointer transition-all duration-300 glass-card border-2
          ${isActive 
            ? 'border-primary neon-glow' 
            : 'border-border/20 hover:border-primary/50'
          }
        `}
        onClick={() => onSelect(threat.id)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <IconComponent className={`h-8 w-8 ${threat.color}`} />
            <Badge 
              variant={threat.severity === 'critical' ? 'destructive' : 'secondary'}
              className="text-xs font-orbitron"
            >
              {threat.severity.toUpperCase()}
            </Badge>
          </div>
          <CardTitle className="text-lg font-orbitron">{threat.name}</CardTitle>
          <CardDescription className="text-sm">
            {threat.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Common Examples:</p>
              <div className="flex flex-wrap gap-1">
                {threat.examples.slice(0, 3).map((example, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onSimulate(threat.id);
                }}
              >
                <Play className="h-3 w-3 mr-1" />
                Simulate
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  onShowDetails(threat);
                }}
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface ThreatLabProps {
  onThreatSimulation: (category: string, data: any) => void;
}

export const ThreatLab = ({ onThreatSimulation }: ThreatLabProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [simulationStats, setSimulationStats] = useState({
    totalSimulations: 0,
    threatsDetected: 0,
    falsePositives: 0,
    averageConfidence: 0
  });

  const showThreatDetails = (threat: ThreatCategory) => {
    alert(`Threat Category: ${threat.name}

Description: ${threat.description}

Severity Level: ${threat.severity.toUpperCase()}

Detection Examples:
${threat.examples.map(example => `• ${example}`).join('\n')}

AI Detection Capabilities:
• Behavioral analysis for anomaly detection
• Machine learning pattern recognition
• Real-time threat intelligence correlation
• Automated response recommendations

Simulation Parameters:
• Data volume: Configurable (10-10000 records)
• Attack intensity: Low, Medium, High, Critical
• Time window: 1 minute to 24 hours
• Target systems: Web servers, databases, endpoints`);
  };

  const handleSimulate = (categoryId: string) => {
    // Generate mock simulation data for the selected threat category
    const mockData = generateSimulationData(categoryId);
    onThreatSimulation(categoryId, mockData);
    
    // Update simulation stats
    setSimulationStats(prev => ({
      ...prev,
      totalSimulations: prev.totalSimulations + 1,
      threatsDetected: prev.threatsDetected + (Math.random() > 0.2 ? 1 : 0),
      falsePositives: prev.falsePositives + (Math.random() > 0.9 ? 1 : 0),
      averageConfidence: (prev.averageConfidence * prev.totalSimulations + (0.7 + Math.random() * 0.3)) / (prev.totalSimulations + 1)
    }));
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Lab Header */}
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-orbitron font-bold gradient-cyber bg-clip-text text-transparent">
              AI Detection Engineering Lab
            </h2>
            <p className="text-muted-foreground mt-2">
              Simulate and detect advanced cyber threats using AI-powered analysis
            </p>
          </div>
          <BarChart3 className="h-8 w-8 text-primary" />
        </div>

        {/* Lab Statistics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
            <div className="text-xl font-orbitron font-bold text-primary">
              {simulationStats.totalSimulations}
            </div>
            <div className="text-xs text-muted-foreground">Simulations Run</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
            <div className="text-xl font-orbitron font-bold text-neon-green">
              {simulationStats.threatsDetected}
            </div>
            <div className="text-xs text-muted-foreground">Threats Detected</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
            <div className="text-xl font-orbitron font-bold text-warning">
              {simulationStats.falsePositives}
            </div>
            <div className="text-xs text-muted-foreground">False Positives</div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
            <div className="text-xl font-orbitron font-bold text-secondary">
              {(simulationStats.averageConfidence * 100).toFixed(1)}%
            </div>
            <div className="text-xs text-muted-foreground">Avg Confidence</div>
          </div>
        </div>
      </div>

      {/* Threat Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {THREAT_CATEGORIES.map((threat) => (
          <ThreatCategoryCard
            key={threat.id}
            threat={threat}
            isActive={selectedCategory === threat.id}
            onSelect={setSelectedCategory}
            onSimulate={handleSimulate}
            onShowDetails={showThreatDetails}
          />
        ))}
      </div>
    </motion.div>
  );
};

// Helper function to generate simulation data for different threat categories
const generateSimulationData = (categoryId: string) => {
  const dataGenerators: Record<string, () => any> = {
    network_intrusion: () => ({
      packets: Array.from({ length: 50 }, () => ({
        timestamp: new Date().toISOString(),
        srcIP: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        dstIP: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        port: Math.floor(Math.random() * 65535),
        protocol: ['TCP', 'UDP', 'ICMP'][Math.floor(Math.random() * 3)],
        bytes: Math.floor(Math.random() * 10000),
        flags: ['SYN', 'ACK', 'FIN', 'RST'][Math.floor(Math.random() * 4)]
      }))
    }),
    
    malware_ransomware: () => ({
      files: Array.from({ length: 20 }, () => ({
        path: `/home/user/Documents/file_${Math.random().toString(36).substr(2, 5)}.${['txt', 'doc', 'pdf', 'exe'][Math.floor(Math.random() * 4)]}`,
        action: ['created', 'modified', 'encrypted', 'deleted'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        hash: Math.random().toString(36).substr(2, 16),
        size: Math.floor(Math.random() * 1000000)
      })),
      processes: Array.from({ length: 10 }, () => ({
        pid: Math.floor(Math.random() * 10000),
        name: `process_${Math.random().toString(36).substr(2, 5)}.exe`,
        memory: Math.floor(Math.random() * 1000),
        cpu: Math.random() * 100
      }))
    }),
    
    phishing_social: () => ({
      emails: Array.from({ length: 15 }, () => ({
        from: `user${Math.floor(Math.random() * 1000)}@${['gmail.com', 'suspicious-domain.com', 'bank-security.net'][Math.floor(Math.random() * 3)]}`,
        subject: ['Urgent: Verify your account', 'Security Alert', 'Invoice attached'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        attachments: Math.random() > 0.5 ? ['document.pdf', 'invoice.exe'] : [],
        links: Math.random() > 0.3 ? ['http://suspicious-link.com/verify'] : []
      }))
    }),
    
    insider_threats: () => ({
      userActivity: Array.from({ length: 30 }, () => ({
        userId: `user_${Math.floor(Math.random() * 100)}`,
        action: ['file_access', 'login', 'data_download', 'privilege_escalation'][Math.floor(Math.random() * 4)],
        resource: `/sensitive/data/file_${Math.random().toString(36).substr(2, 5)}.csv`,
        timestamp: new Date().toISOString(),
        location: ['office', 'remote', 'unusual_location'][Math.floor(Math.random() * 3)],
        timeOfDay: Math.floor(Math.random() * 24)
      }))
    }),
    
    zero_day_apt: () => ({
      systemEvents: Array.from({ length: 25 }, () => ({
        eventType: ['process_creation', 'registry_modification', 'network_connection', 'file_modification'][Math.floor(Math.random() * 4)],
        timestamp: new Date().toISOString(),
        details: `Unknown signature detected in system behavior`,
        persistence: Math.random() > 0.7,
        stealthLevel: Math.random()
      }))
    }),
    
    data_exfiltration: () => ({
      dataTransfers: Array.from({ length: 20 }, () => ({
        source: `/database/customer_${Math.random().toString(36).substr(2, 5)}.db`,
        destination: ['cloud-storage.com', 'external-server.net', 'unknown-ip'][Math.floor(Math.random() * 3)],
        size: Math.floor(Math.random() * 1000000000), // bytes
        timestamp: new Date().toISOString(),
        encrypted: Math.random() > 0.5,
        unusual: Math.random() > 0.7
      }))
    }),
    
    ddos_attacks: () => ({
      trafficMetrics: Array.from({ length: 60 }, (_, i) => ({
        timestamp: new Date(Date.now() - (60 - i) * 60000).toISOString(),
        requestsPerSecond: Math.floor(Math.random() * 10000) + (i > 30 ? 50000 : 1000), // Spike in traffic
        bandwidth: Math.floor(Math.random() * 1000) + (i > 30 ? 5000 : 100),
        uniqueIPs: Math.floor(Math.random() * 1000) + (i > 30 ? 10000 : 100),
        errorRate: Math.random() * (i > 30 ? 0.5 : 0.05)
      }))
    }),
    
    deepfake_ai: () => ({
      mediaFiles: Array.from({ length: 10 }, () => ({
        fileName: `media_${Math.random().toString(36).substr(2, 5)}.${['mp4', 'mp3', 'jpg', 'wav'][Math.floor(Math.random() * 4)]}`,
        type: ['video', 'audio', 'image'][Math.floor(Math.random() * 3)],
        artificialityScore: Math.random(),
        inconsistencies: ['facial_artifacts', 'voice_patterns', 'compression_anomalies'][Math.floor(Math.random() * 3)],
        timestamp: new Date().toISOString(),
        source: ['social_media', 'email_attachment', 'direct_upload'][Math.floor(Math.random() * 3)]
      }))
    })
  };

  return dataGenerators[categoryId]?.() || { message: 'No simulation data available for this threat category' };
};