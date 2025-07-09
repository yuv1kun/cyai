import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Activity, TrendingUp, Globe, Shield } from 'lucide-react';

interface NetworkMonitorProps {
  networkData: any[];
  threats: any[];
}

export const NetworkMonitor = ({ networkData, threats }: NetworkMonitorProps) => {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [protocolData, setProtocolData] = useState<any[]>([]);

  useEffect(() => {
    if (networkData.length > 0) {
      // Generate mock traffic data over time
      const timeData = Array.from({ length: 24 }, (_, i) => ({
        time: `${i.toString().padStart(2, '0')}:00`,
        benign: Math.floor(Math.random() * 100) + 50,
        attacks: Math.floor(Math.random() * 20) + 5,
        total: 0
      })).map(item => ({
        ...item,
        total: item.benign + item.attacks
      }));

      // Generate protocol distribution
      const protocols = ['TCP', 'UDP', 'ICMP', 'HTTP', 'HTTPS'];
      const protocolStats = protocols.map(protocol => ({
        protocol,
        count: Math.floor(Math.random() * 200) + 50,
        color: protocol === 'TCP' ? '#18f0ff' : 
               protocol === 'UDP' ? '#ff3cac' : 
               protocol === 'ICMP' ? '#00ffb8' : 
               protocol === 'HTTP' ? '#f7b731' : '#ff6b6b'
      }));

      setTrafficData(timeData);
      setProtocolData(protocolStats);
    }
  }, [networkData]);

  const totalTraffic = trafficData.reduce((acc, item) => acc + item.total, 0);
  const totalThreats = threats.filter(t => t.prediction === 'attack').length;
  const threatRate = totalTraffic > 0 ? (totalThreats / totalTraffic * 100) : 0;

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <h2 className="text-xl font-orbitron font-bold mb-6 gradient-cyber bg-clip-text text-transparent">
        Network Monitor
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <motion.div
          className="text-center p-4 rounded-lg bg-card/30 border border-border/20"
          whileHover={{ scale: 1.02 }}
        >
          <Globe className="h-6 w-6 text-primary mx-auto mb-2" />
          <div className="text-xl font-orbitron font-bold text-primary">
            {totalTraffic.toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Total Packets</div>
        </motion.div>

        <motion.div
          className="text-center p-4 rounded-lg bg-card/30 border border-border/20"
          whileHover={{ scale: 1.02 }}
        >
          <Activity className="h-6 w-6 text-neon-green mx-auto mb-2" />
          <div className="text-xl font-orbitron font-bold text-neon-green">
            {(totalTraffic - totalThreats).toLocaleString()}
          </div>
          <div className="text-xs text-muted-foreground">Benign Traffic</div>
        </motion.div>

        <motion.div
          className="text-center p-4 rounded-lg bg-card/30 border border-border/20"
          whileHover={{ scale: 1.02 }}
        >
          <Shield className="h-6 w-6 text-destructive mx-auto mb-2" />
          <div className="text-xl font-orbitron font-bold text-destructive">
            {totalThreats}
          </div>
          <div className="text-xs text-muted-foreground">Threats Blocked</div>
        </motion.div>

        <motion.div
          className="text-center p-4 rounded-lg bg-card/30 border border-border/20"
          whileHover={{ scale: 1.02 }}
        >
          <TrendingUp className="h-6 w-6 text-warning mx-auto mb-2" />
          <div className="text-xl font-orbitron font-bold text-warning">
            {threatRate.toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">Threat Rate</div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="space-y-8">
        {/* Traffic Timeline */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground">24-Hour Traffic Analysis</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="time" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="benign" 
                  stroke="hsl(var(--neon-green))" 
                  strokeWidth={2}
                  dot={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="attacks" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Protocol Distribution */}
        <div>
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Protocol Distribution</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={protocolData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="protocol" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="count" 
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
};