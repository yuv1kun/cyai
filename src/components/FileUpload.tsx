import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, CheckCircle, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileUpload: (data: any[], fileName: string) => void;
}

export const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [fileName, setFileName] = useState<string>('');

  const processCSV = (text: string): any[] => {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const row: any = {};
      headers.forEach((header, index) => {
        const value = values[index];
        // Try to parse as number, otherwise keep as string
        row[header] = isNaN(Number(value)) ? value : Number(value);
      });
      data.push(row);
    }
    return data;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploadStatus('uploading');
    setFileName(file.name);

    try {
      const text = await file.text();
      
      let data: any[] = [];
      if (file.name.endsWith('.json')) {
        data = JSON.parse(text);
      } else if (file.name.endsWith('.csv')) {
        data = processCSV(text);
      } else {
        throw new Error('Unsupported file format');
      }

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUploadStatus('success');
      onFileUpload(data, file.name);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setFileName('');
      }, 3000);
    } catch (error) {
      console.error('File processing error:', error);
      setUploadStatus('error');
      setTimeout(() => {
        setUploadStatus('idle');
        setFileName('');
      }, 3000);
    }
  }, [onFileUpload]);

  const generateSampleData = (format: 'csv' | 'json') => {
    const sampleData = [
      {
        'Flow Duration': 120000,
        'Total Fwd Packets': 10,
        'Total Backward Packets': 8,
        'Flow Bytes/s': 1500,
        'Flow Packets/s': 12,
        'Protocol': 'TCP',
        'Src Port': 80,
        'Dst Port': 443,
        'Src IP': '192.168.1.100',
        'Dst IP': '10.0.0.50',
        'Flow IAT Mean': 1000,
        'Flow IAT Std': 500,
        'Flow IAT Max': 2000,
        'Flow IAT Min': 100,
        'Label': 'BENIGN'
      },
      {
        'Flow Duration': 5000,
        'Total Fwd Packets': 100,
        'Total Backward Packets': 2,
        'Flow Bytes/s': 50000,
        'Flow Packets/s': 200,
        'Protocol': 'TCP',
        'Src Port': 12345,
        'Dst Port': 22,
        'Src IP': '192.168.1.200',
        'Dst IP': '10.0.0.100',
        'Flow IAT Mean': 50,
        'Flow IAT Std': 25,
        'Flow IAT Max': 100,
        'Flow IAT Min': 10,
        'Label': 'DDoS'
      },
      {
        'Flow Duration': 300000,
        'Total Fwd Packets': 50,
        'Total Backward Packets': 45,
        'Flow Bytes/s': 800,
        'Flow Packets/s': 5,
        'Protocol': 'UDP',
        'Src Port': 53,
        'Dst Port': 8080,
        'Src IP': '192.168.1.150',
        'Dst IP': '10.0.0.75',
        'Flow IAT Mean': 6000,
        'Flow IAT Std': 2000,
        'Flow IAT Max': 10000,
        'Flow IAT Min': 2000,
        'Label': 'BENIGN'
      }
    ];

    setUploadStatus('uploading');
    setFileName(`sample_data.${format}`);
    
    // Simulate processing delay
    setTimeout(() => {
      setUploadStatus('success');
      onFileUpload(sampleData, `sample_data.${format}`);
      
      // Reset status after 3 seconds
      setTimeout(() => {
        setUploadStatus('idle');
        setFileName('');
      }, 3000);
    }, 1000);
  };

  const showDataFormatGuide = () => {
    alert(`Data Format Guide:

CSV Format:
- Headers: Flow Duration, Total Fwd Packets, Total Backward Packets, etc.
- Each row represents a network flow record
- Numeric values for features, text for labels

JSON Format:
- Array of objects with network flow properties
- Example: [{"Flow Duration": 120000, "Protocol": "TCP", ...}]

Supported Features:
- Flow characteristics (duration, packets, bytes)
- Network details (IPs, ports, protocols)
- Timing information (IAT statistics)
- Traffic patterns and labels`);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    multiple: false
  });

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'uploading':
        return <Upload className="h-8 w-8 text-neon-cyan animate-pulse" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-neon-green" />;
      case 'error':
        return <AlertCircle className="h-8 w-8 text-destructive" />;
      default:
        return <File className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'uploading':
        return 'Processing network data...';
      case 'success':
        return `Successfully processed ${fileName}`;
      case 'error':
        return 'Error processing file';
      default:
        return isDragActive ? 'Drop files here...' : 'Drag & drop network data files here';
    }
  };

  return (
    <motion.div
      className="glass-card p-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="text-xl font-orbitron font-bold mb-4 gradient-cyber bg-clip-text text-transparent">
        Network Data Upload
      </h2>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive 
            ? 'border-primary bg-primary/10 neon-glow' 
            : 'border-border hover:border-primary/50'
          }
          ${uploadStatus === 'success' && 'border-neon-green bg-neon-green/10'}
          ${uploadStatus === 'error' && 'border-destructive bg-destructive/10'}
        `}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={uploadStatus}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col items-center space-y-4"
          >
            {getStatusIcon()}
            <div>
              <p className="text-lg font-medium">{getStatusText()}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Supports CSV and JSON formats
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => generateSampleData('csv')}
        >
          Sample CSV
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={() => generateSampleData('json')}
        >
          Sample JSON
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={showDataFormatGuide}
        >
          Data Format Guide
        </Button>
      </div>
    </motion.div>
  );
};
