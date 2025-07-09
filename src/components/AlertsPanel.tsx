import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Shield, X, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  sourceIP: string;
  attackType: string;
  confidence: number;
  location?: string;
}

interface AlertsPanelProps {
  newThreats: any[];
}

export const AlertsPanel = ({ newThreats }: AlertsPanelProps) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Convert threats to alerts
    const newAlerts: Alert[] = newThreats
      .filter(threat => threat.prediction === 'attack')
      .map(threat => ({
        id: threat.id,
        type: (threat.confidence > 0.9 ? 'critical' : threat.confidence > 0.8 ? 'warning' : 'info') as Alert['type'],
        title: `${threat.attackType} Attack Detected`,
        description: `Malicious traffic from ${threat.sourceIP} targeting ${threat.destinationIP}`,
        timestamp: threat.timestamp,
        sourceIP: threat.sourceIP,
        attackType: threat.attackType,
        confidence: threat.confidence,
        location: 'Unknown Location'
      }));

    setAlerts(prev => [...newAlerts, ...prev].slice(0, 10)); // Keep only latest 10 alerts
  }, [newThreats]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      default:
        return <Shield className="h-5 w-5 text-primary" />;
    }
  };

  const getAlertBorder = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-destructive/50 bg-destructive/10 pulse-threat';
      case 'warning':
        return 'border-warning/50 bg-warning/10';
      default:
        return 'border-primary/50 bg-primary/10';
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-orbitron font-bold gradient-cyber bg-clip-text text-transparent">
          Security Alerts
        </h2>
        <div className="flex items-center space-x-2">
          <div className={`
            w-3 h-3 rounded-full
            ${alerts.some(a => a.type === 'critical') ? 'bg-destructive animate-pulse' : 'bg-neon-green'}
          `} />
          <span className="text-sm text-muted-foreground">
            {alerts.length} Active
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              key="no-alerts"
              className="text-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Shield className="h-12 w-12 text-neon-green mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No active security alerts</p>
              <p className="text-xs text-muted-foreground">System monitoring in progress</p>
            </motion.div>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className={`
                  p-4 rounded-lg border transition-all duration-200 relative
                  ${getAlertBorder(alert.type)}
                `}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -100, scale: 0.95 }}
                transition={{ 
                  duration: 0.3,
                  delay: index * 0.05
                }}
                whileHover={{ scale: 1.02 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 h-6 w-6 p-0 hover:bg-background/20"
                  onClick={() => dismissAlert(alert.id)}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex items-start space-x-3 pr-8">
                  <div className="mt-0.5">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div>
                      <h3 className="font-semibold text-sm">{alert.title}</h3>
                      <p className="text-xs text-muted-foreground">{alert.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{alert.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-orbitron bg-background/50 px-2 py-1 rounded">
                          {alert.sourceIP}
                        </span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs font-medium">{alert.attackType}</span>
                      </div>
                      <div className={`
                        text-xs font-orbitron font-bold
                        ${alert.type === 'critical' ? 'text-destructive' : 
                          alert.type === 'warning' ? 'text-warning' : 'text-primary'}
                      `}>
                        {(alert.confidence * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {alerts.length > 0 && (
        <motion.div
          className="mt-4 pt-4 border-t border-border/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => setAlerts([])}
          >
            Clear All Alerts
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};