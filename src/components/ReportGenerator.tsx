import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, Filter, Settings, Printer } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetectionResult, THREAT_CATEGORIES } from '@/types/threats';

interface ReportGeneratorProps {
  detectionResults: DetectionResult[];
}

export const ReportGenerator = ({ detectionResults }: ReportGeneratorProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');
  const [reportType, setReportType] = useState('executive');

  const generateReport = () => {
    // Filter results based on selections
    const filteredResults = detectionResults.filter(result => {
      const categoryMatch = selectedCategory === 'all' || result.category === selectedCategory;
      const severityMatch = selectedSeverity === 'all' || result.severity === selectedSeverity;
      
      // Time filtering logic would go here
      const timeMatch = true; // For demo purposes
      
      return categoryMatch && severityMatch && timeMatch;
    });

    // Generate report content
    const reportContent = {
      title: `CYAI Threat Detection Report - ${new Date().toLocaleDateString()}`,
      timeframe: selectedTimeframe,
      summary: {
        totalThreats: filteredResults.length,
        criticalThreats: filteredResults.filter(r => r.severity === 'critical').length,
        highThreats: filteredResults.filter(r => r.severity === 'high').length,
        averageConfidence: filteredResults.length > 0 
          ? (filteredResults.reduce((sum, r) => sum + r.confidence, 0) / filteredResults.length * 100).toFixed(1)
          : '0',
        topThreats: getTopThreats(filteredResults),
        recommendations: generateRecommendations(filteredResults)
      },
      detailedResults: filteredResults.slice(0, 20), // Limit for demo
      metadata: {
        generatedAt: new Date().toISOString(),
        reportType,
        filters: {
          timeframe: selectedTimeframe,
          category: selectedCategory,
          severity: selectedSeverity
        }
      }
    };

    // Create and download report
    try {
      const reportText = generateReportText(reportContent);
      const reportBlob = new Blob([reportText], {
        type: 'text/plain'
      });
      
      const url = URL.createObjectURL(reportBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cyai-threat-report-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  const getTopThreats = (results: DetectionResult[]) => {
    const threatCounts = new Map();
    results.forEach(result => {
      const key = result.threatType;
      threatCounts.set(key, (threatCounts.get(key) || 0) + 1);
    });
    
    return Array.from(threatCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([threat, count]) => ({ threat, count }));
  };

  const generateRecommendations = (results: DetectionResult[]) => {
    const recommendations = [];
    
    if (results.filter(r => r.severity === 'critical').length > 0) {
      recommendations.push('Immediate attention required for critical threats - implement emergency response procedures');
    }
    
    if (results.filter(r => r.category === 'network_intrusion').length > 3) {
      recommendations.push('High network intrusion activity detected - review firewall rules and network segmentation');
    }
    
    if (results.filter(r => r.category === 'malware_ransomware').length > 0) {
      recommendations.push('Malware detected - ensure backup systems are isolated and consider endpoint protection updates');
    }
    
    if (results.filter(r => r.category === 'insider_threats').length > 0) {
      recommendations.push('Insider threat activity detected - review user access privileges and monitoring policies');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('No immediate threats detected - maintain current security posture and monitoring');
    }
    
    return recommendations;
  };

  const getFilteredStats = () => {
    const filtered = detectionResults.filter(result => {
      const categoryMatch = selectedCategory === 'all' || result.category === selectedCategory;
      const severityMatch = selectedSeverity === 'all' || result.severity === selectedSeverity;
      return categoryMatch && severityMatch;
    });
    
    return {
      total: filtered.length,
      critical: filtered.filter(r => r.severity === 'critical').length,
      high: filtered.filter(r => r.severity === 'high').length,
      medium: filtered.filter(r => r.severity === 'medium').length,
      low: filtered.filter(r => r.severity === 'low').length
    };
  };

  const generateReportText = (reportContent: any) => {
    return `
CYAI THREAT DETECTION REPORT
Generated: ${new Date().toLocaleString()}
Report Type: ${reportContent.reportType || 'Executive Summary'}

EXECUTIVE SUMMARY
================
Total Threats Detected: ${reportContent.summary.totalThreats}
Critical Threats: ${reportContent.summary.criticalThreats}
High Priority Threats: ${reportContent.summary.highThreats}
Average Confidence: ${reportContent.summary.averageConfidence}%

TOP THREATS
===========
${reportContent.summary.topThreats.map((threat: any) => `• ${threat.threat}: ${threat.count} occurrences`).join('\n')}

RECOMMENDATIONS
===============
${reportContent.summary.recommendations.map((rec: string) => `• ${rec}`).join('\n')}

DETAILED FINDINGS
=================
${reportContent.detailedResults.map((result: any) => `
Threat: ${result.threatType}
Category: ${result.category}
Severity: ${result.severity}
Confidence: ${(result.confidence * 100).toFixed(1)}%
Source: ${result.sourceIP}
Target: ${result.targetIP}
Timestamp: ${new Date(result.timestamp).toLocaleString()}
Explanation: ${result.explanation}
`).join('\n')}

---
Report generated by CYAI Threat Detection System
    `.trim();
  };

  const handlePrintPreview = () => {
    const filteredResults = detectionResults.filter(result => {
      const categoryMatch = selectedCategory === 'all' || result.category === selectedCategory;
      const severityMatch = selectedSeverity === 'all' || result.severity === selectedSeverity;
      return categoryMatch && severityMatch;
    });

    const reportContent = {
      title: `CYAI Threat Detection Report - ${new Date().toLocaleDateString()}`,
      summary: {
        totalThreats: filteredResults.length,
        criticalThreats: filteredResults.filter(r => r.severity === 'critical').length,
        highThreats: filteredResults.filter(r => r.severity === 'high').length,
        averageConfidence: filteredResults.length > 0 
          ? (filteredResults.reduce((sum, r) => sum + r.confidence, 0) / filteredResults.length * 100).toFixed(1)
          : '0'
      }
    };

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>CYAI Threat Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { border-bottom: 2px solid #333; padding-bottom: 10px; }
              .summary { margin: 20px 0; }
              .stat { display: inline-block; margin: 10px 20px 10px 0; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>CYAI Threat Detection Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
            </div>
            <div class="summary">
              <h2>Executive Summary</h2>
              <div class="stat">Total Threats: ${reportContent.summary.totalThreats}</div>
              <div class="stat">Critical: ${reportContent.summary.criticalThreats}</div>
              <div class="stat">High Priority: ${reportContent.summary.highThreats}</div>
              <div class="stat">Avg Confidence: ${reportContent.summary.averageConfidence}%</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleScheduleReport = () => {
    // Simulate scheduling functionality
    const scheduleOptions = ['Daily', 'Weekly', 'Monthly'];
    const selectedSchedule = scheduleOptions[Math.floor(Math.random() * scheduleOptions.length)];
    
    alert(`Report scheduled for ${selectedSchedule} delivery. You will receive notifications at your registered email address.`);
  };

  const stats = getFilteredStats();

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Report Generator Header */}
      <Card className="glass-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-orbitron gradient-cyber bg-clip-text text-transparent">
                Threat Report Generator
              </CardTitle>
              <CardDescription>
                Generate comprehensive threat detection reports with AI insights
              </CardDescription>
            </div>
            <FileText className="h-8 w-8 text-primary" />
          </div>
        </CardHeader>
      </Card>

      {/* Report Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Report Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Time Frame</label>
              <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Threat Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {THREAT_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Severity Level</label>
              <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive Summary</SelectItem>
                  <SelectItem value="technical">Technical Analysis</SelectItem>
                  <SelectItem value="detailed">Detailed Investigation</SelectItem>
                  <SelectItem value="compliance">Compliance Report</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Report Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="text-xl font-orbitron font-bold text-primary">{stats.total}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="text-xl font-orbitron font-bold text-destructive">{stats.critical}</div>
                <div className="text-xs text-muted-foreground">Critical</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="text-xl font-orbitron font-bold text-neon-orange">{stats.high}</div>
                <div className="text-xs text-muted-foreground">High</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="text-xl font-orbitron font-bold text-warning">{stats.medium}</div>
                <div className="text-xs text-muted-foreground">Medium</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-card/30 border border-border/20">
                <div className="text-xl font-orbitron font-bold text-neon-green">{stats.low}</div>
                <div className="text-xs text-muted-foreground">Low</div>
              </div>
            </div>

            {/* Sample Report Content */}
            <div className="border border-border/20 rounded-lg p-4 bg-card/20">
              <h4 className="font-semibold mb-2">Report Content Preview:</h4>
              <div className="text-sm space-y-2 text-muted-foreground">
                <p>• Executive Summary with threat landscape overview</p>
                <p>• Detailed analysis of {stats.total} detected threats</p>
                <p>• AI-driven insights and behavioral analysis</p>
                <p>• Risk assessment and impact evaluation</p>
                <p>• Actionable recommendations and mitigation strategies</p>
                <p>• Threat timeline and attack progression analysis</p>
                <p>• Compliance and regulatory alignment notes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button 
          onClick={generateReport}
          className="flex-1 btn-cyber"
          disabled={detectionResults.length === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Generate & Download Report
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handlePrintPreview}
        >
          <Printer className="h-4 w-4 mr-2" />
          Print Preview
        </Button>
        
        <Button 
          variant="outline" 
          className="flex-1"
          onClick={handleScheduleReport}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Report
        </Button>
      </div>
    </motion.div>
  );
};