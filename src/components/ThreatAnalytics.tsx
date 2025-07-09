import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, 
         PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, TrendingDown, AlertTriangle, Shield, Target, Brain } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DetectionResult, THREAT_CATEGORIES } from '@/types/threats';

interface ThreatAnalyticsProps {
  detectionResults: DetectionResult[];
}

export const ThreatAnalytics = ({ detectionResults }: ThreatAnalyticsProps) => {
  const [analyticsData, setAnalyticsData] = useState({
    threatTrends: [] as any[],
    categoryDistribution: [] as any[],
    severityBreakdown: [] as any[],
    confidenceDistribution: [] as any[],
    threatEvolution: [] as any[],
    topTargets: [] as any[]
  });

  useEffect(() => {
    if (detectionResults.length > 0) {
      generateAnalytics();
    }
  }, [detectionResults]);

  const generateAnalytics = () => {
    // Threat trends over time (last 24 hours)
    const threatTrends = Array.from({ length: 24 }, (_, i) => {
      const hour = new Date();
      hour.setHours(i);
      
      const hoursResults = detectionResults.filter(result => {
        const resultHour = new Date(result.timestamp).getHours();
        return resultHour === i;
      });

      return {
        hour: hour.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true }),
        threats: hoursResults.filter(r => r.confidence > 0.7).length,
        total: hoursResults.length,
        critical: hoursResults.filter(r => r.severity === 'critical').length,
        high: hoursResults.filter(r => r.severity === 'high').length
      };
    });

    // Category distribution
    const categoryDistribution = THREAT_CATEGORIES.map(category => {
      const count = detectionResults.filter(r => r.category === category.id).length;
      return {
        name: category.name,
        value: count,
        color: getCategoryColor(category.id)
      };
    }).filter(item => item.value > 0);

    // Severity breakdown
    const severityBreakdown = [
      { name: 'Critical', value: detectionResults.filter(r => r.severity === 'critical').length, color: '#ef4444' },
      { name: 'High', value: detectionResults.filter(r => r.severity === 'high').length, color: '#f59e0b' },
      { name: 'Medium', value: detectionResults.filter(r => r.severity === 'medium').length, color: '#eab308' },
      { name: 'Low', value: detectionResults.filter(r => r.severity === 'low').length, color: '#22c55e' }
    ].filter(item => item.value > 0);

    // Confidence distribution
    const confidenceDistribution = [
      { range: '90-100%', count: detectionResults.filter(r => r.confidence >= 0.9).length },
      { range: '80-89%', count: detectionResults.filter(r => r.confidence >= 0.8 && r.confidence < 0.9).length },
      { range: '70-79%', count: detectionResults.filter(r => r.confidence >= 0.7 && r.confidence < 0.8).length },
      { range: '60-69%', count: detectionResults.filter(r => r.confidence >= 0.6 && r.confidence < 0.7).length },
      { range: '<60%', count: detectionResults.filter(r => r.confidence < 0.6).length }
    ];

    // Threat evolution (AI capability assessment)
    const threatEvolution = THREAT_CATEGORIES.map(category => {
      const categoryResults = detectionResults.filter(r => r.category === category.id);
      const avgConfidence = categoryResults.length > 0 
        ? categoryResults.reduce((sum, r) => sum + r.confidence, 0) / categoryResults.length 
        : 0;
      
      return {
        category: category.name.split(' ')[0], // Short name
        detection: avgConfidence * 100,
        prevention: (avgConfidence * 0.8) * 100,
        response: (avgConfidence * 0.9) * 100,
        fullMark: 100
      };
    }).filter(item => item.detection > 0);

    // Top targets
    const targetMap = new Map();
    detectionResults.forEach(result => {
      if (result.targetIP) {
        targetMap.set(result.targetIP, (targetMap.get(result.targetIP) || 0) + 1);
      }
    });
    
    const topTargets = Array.from(targetMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([ip, count]) => ({ ip, count, risk: count > 5 ? 'High' : count > 2 ? 'Medium' : 'Low' }));

    setAnalyticsData({
      threatTrends,
      categoryDistribution,
      severityBreakdown,
      confidenceDistribution,
      threatEvolution,
      topTargets
    });
  };

  const getCategoryColor = (categoryId: string) => {
    const colorMap: Record<string, string> = {
      network_intrusion: '#ef4444',
      malware_ransomware: '#dc2626',
      phishing_social: '#f59e0b',
      insider_threats: '#f97316',
      zero_day_apt: '#ef4444',
      data_exfiltration: '#dc2626',
      ddos_attacks: '#f59e0b',
      deepfake_ai: '#8b5cf6'
    };
    return colorMap[categoryId] || '#6b7280';
  };

  const getThreatStats = () => {
    const total = detectionResults.length;
    const critical = detectionResults.filter(r => r.severity === 'critical').length;
    const highConfidence = detectionResults.filter(r => r.confidence > 0.8).length;
    const avgConfidence = total > 0 ? detectionResults.reduce((sum, r) => sum + r.confidence, 0) / total : 0;
    
    return { total, critical, highConfidence, avgConfidence };
  };

  const stats = getThreatStats();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Analytics Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-orbitron gradient-cyber bg-clip-text text-transparent">
                Threat Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Comprehensive AI-driven threat detection analysis and insights
              </CardDescription>
            </div>
            <Brain className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-orbitron font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total Detections</div>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-orbitron font-bold text-destructive">{stats.critical}</div>
                <div className="text-sm text-muted-foreground">Critical Threats</div>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-orbitron font-bold text-neon-green">{stats.highConfidence}</div>
                <div className="text-sm text-muted-foreground">High Confidence</div>
              </div>
              <Shield className="h-8 w-8 text-neon-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-orbitron font-bold text-secondary">
                  {(stats.avgConfidence * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">Avg Confidence</div>
              </div>
              <TrendingUp className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Threat Trends */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">24-Hour Threat Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analyticsData.threatTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Line type="monotone" dataKey="threats" stroke="hsl(var(--destructive))" strokeWidth={2} />
                  <Line type="monotone" dataKey="critical" stroke="hsl(var(--neon-orange))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Threat Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Severity Breakdown */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Severity Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analyticsData.severityBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* AI Capability Radar */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">AI Detection Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={analyticsData.threatEvolution}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                  <PolarRadiusAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                  <Radar
                    name="Detection"
                    dataKey="detection"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                  <Radar
                    name="Prevention"
                    dataKey="prevention"
                    stroke="hsl(var(--secondary))"
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.3}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Targets Table */}
      {analyticsData.topTargets.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Most Targeted Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {analyticsData.topTargets.map((target, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-card/30 border border-border/20">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-mono">{target.ip}</div>
                    <Badge variant={target.risk === 'High' ? 'destructive' : target.risk === 'Medium' ? 'secondary' : 'outline'}>
                      {target.risk} Risk
                    </Badge>
                  </div>
                  <div className="text-sm font-semibold">{target.count} attacks</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};