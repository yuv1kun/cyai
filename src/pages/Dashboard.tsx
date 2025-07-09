import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, BarChart3, FileText, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ThreatDetection } from '@/components/ThreatDetection';
import { AlertsPanel } from '@/components/AlertsPanel';
import { NetworkMonitor } from '@/components/NetworkMonitor';
import { ThreatLab } from '@/components/ThreatLab';
import { AIDetectionEngine } from '@/components/AIDetectionEngine';
import { ThreatAnalytics } from '@/components/ThreatAnalytics';
import { ReportGenerator } from '@/components/ReportGenerator';
import { DetectionResult } from '@/types/threats';
import { useToast } from '@/hooks/use-toast';

export const Dashboard = () => {
  const [networkData, setNetworkData] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [threats, setThreats] = useState<any[]>([]);
  const [detectionResults, setDetectionResults] = useState<DetectionResult[]>([]);
  const [systemStatus, setSystemStatus] = useState<'online' | 'offline' | 'scanning'>('online');
  const [threatLevel, setThreatLevel] = useState<'low' | 'medium' | 'high' | 'critical'>('low');
  const [activeTab, setActiveTab] = useState('detection');
  const [simulationData, setSimulationData] = useState<any>(null);
  const [simulationCategory, setSimulationCategory] = useState<string>('');
  const { toast } = useToast();

  const handleFileUpload = useCallback((data: any[], fileName: string) => {
    setNetworkData(data);
    toast({
      title: "Data Upload Complete",
      description: `Successfully loaded ${data.length} network flow records from ${fileName}`,
    });
  }, [toast]);

  const handleScanStart = () => {
    if (networkData.length === 0) {
      toast({
        title: "No Data Available",
        description: "Please upload network data before starting the scan",
        variant: "destructive",
      });
      return;
    }
    
    setIsScanning(true);
    setSystemStatus('scanning');
    toast({
      title: "Threat Scan Started",
      description: "Analyzing network traffic for potential security threats...",
    });
  };

  const handleScanStop = () => {
    setIsScanning(false);
    setSystemStatus('online');
    toast({
      title: "Threat Scan Stopped",
      description: "Scan has been manually stopped",
    });
  };

  const handleScanComplete = useCallback((detectedThreats: any[]) => {
    setThreats(detectedThreats);
    setIsScanning(false);
    setSystemStatus('online');
    
    const attackCount = detectedThreats.filter(t => t.prediction === 'attack').length;
    
    // Update threat level based on detected attacks
    if (attackCount === 0) {
      setThreatLevel('low');
    } else if (attackCount <= 2) {
      setThreatLevel('medium');
    } else if (attackCount <= 5) {
      setThreatLevel('high');
    } else {
      setThreatLevel('critical');
    }

    toast({
      title: "Threat Scan Complete",
      description: `Analysis complete. Found ${attackCount} potential threats.`,
      variant: attackCount > 0 ? "destructive" : "default",
    });
  }, [toast]);

  const handleThreatSimulation = useCallback((category: string, data: any) => {
    setSimulationCategory(category);
    setSimulationData(data);
    setActiveTab('ai-engine');
    toast({
      title: "Threat Simulation Started",
      description: `Simulating ${category.replace('_', ' ')} attack scenarios`,
    });
  }, [toast]);

  const handleDetectionComplete = useCallback((result: DetectionResult) => {
    setDetectionResults(prev => [result, ...prev].slice(0, 100)); // Keep last 100 results
    toast({
      title: "AI Detection Complete",
      description: `${result.threatType} detected with ${(result.confidence * 100).toFixed(1)}% confidence`,
      variant: result.severity === 'critical' ? "destructive" : "default",
    });
  }, [toast]);

  const handleReset = () => {
    setNetworkData([]);
    setThreats([]);
    setDetectionResults([]);
    setIsScanning(false);
    setSystemStatus('online');
    setThreatLevel('low');
    setSimulationData(null);
    setSimulationCategory('');
    
    toast({
      title: "System Reset",
      description: "All data cleared. Ready for new analysis.",
    });
  };

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-4 py-6">
        <Header 
          systemStatus={systemStatus}
          threatLevel={threatLevel}
        />

        {/* Control Panel */}
        <motion.div
          className="glass-card p-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleScanStart}
                disabled={isScanning || networkData.length === 0}
                className="btn-cyber"
              >
                <Play className="h-4 w-4 mr-2" />
                Start Threat Scan
              </Button>
              
              <Button
                onClick={handleScanStop}
                disabled={!isScanning}
                variant="outline"
              >
                <Pause className="h-4 w-4 mr-2" />
                Stop Scan
              </Button>

              <Button
                onClick={handleReset}
                variant="outline"
                className="text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="text-sm text-muted-foreground">
              {networkData.length > 0 && (
                <span>{networkData.length} records loaded • {detectionResults.length} AI detections</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="detection">Detection</TabsTrigger>
            <TabsTrigger value="threat-lab">Threat Lab</TabsTrigger>
            <TabsTrigger value="ai-engine">AI Engine</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="detection">
            <div className="space-y-8">
              {/* Top Row - File Upload and Threat Detection */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <FileUpload onFileUpload={handleFileUpload} />
                </div>
                <div className="space-y-6">
                  <ThreatDetection
                    networkData={networkData}
                    isScanning={isScanning}
                    onScanComplete={handleScanComplete}
                  />
                </div>
              </div>
              
              {/* Bottom Row - Network Monitor and Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <NetworkMonitor
                    networkData={networkData}
                    threats={threats}
                  />
                </div>
                <div className="space-y-6">
                  <AlertsPanel newThreats={threats} />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="threat-lab">
            <ThreatLab onThreatSimulation={handleThreatSimulation} />
          </TabsContent>

          <TabsContent value="ai-engine">
            <AIDetectionEngine
              simulationData={simulationData}
              category={simulationCategory}
              onDetectionComplete={handleDetectionComplete}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <ThreatAnalytics detectionResults={detectionResults} />
          </TabsContent>

          <TabsContent value="reports">
            <ReportGenerator detectionResults={detectionResults} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};