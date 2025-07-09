import { Shield, Activity, AlertTriangle, Wifi } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
  systemStatus: 'online' | 'offline' | 'scanning';
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

export const Header = ({ systemStatus, threatLevel }: HeaderProps) => {
  const getStatusColor = () => {
    switch (systemStatus) {
      case 'online': return 'text-neon-green';
      case 'offline': return 'text-destructive';
      case 'scanning': return 'text-neon-cyan';
      default: return 'text-muted-foreground';
    }
  };

  const getThreatColor = () => {
    switch (threatLevel) {
      case 'low': return 'text-neon-green';
      case 'medium': return 'text-neon-yellow';
      case 'high': return 'text-neon-orange';
      case 'critical': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <motion.header 
      className="glass-card px-6 py-4 mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.div
            className="flex items-center space-x-2"
            whileHover={{ scale: 1.05 }}
          >
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-orbitron font-bold gradient-cyber bg-clip-text text-transparent">
              CYAI
            </h1>
          </motion.div>
          <div className="text-sm text-muted-foreground">
            Cybersecurity Threat Detection System
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* System Status */}
          <div className="flex items-center space-x-2">
            <Activity className={`h-5 w-5 ${getStatusColor()}`} />
            <div>
              <div className="text-sm font-medium">System Status</div>
              <div className={`text-xs uppercase font-orbitron ${getStatusColor()}`}>
                {systemStatus}
              </div>
            </div>
          </div>

          {/* Threat Level */}
          <div className="flex items-center space-x-2">
            <AlertTriangle className={`h-5 w-5 ${getThreatColor()}`} />
            <div>
              <div className="text-sm font-medium">Threat Level</div>
              <div className={`text-xs uppercase font-orbitron ${getThreatColor()}`}>
                {threatLevel}
              </div>
            </div>
          </div>

          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            <Wifi className="h-5 w-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Network</div>
              <div className="text-xs text-primary font-orbitron">CONNECTED</div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};