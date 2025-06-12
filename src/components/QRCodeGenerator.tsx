
import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  ticketNumber: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size = 200, 
  ticketNumber 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
    }
  }, [value, size]);

  const downloadQRCode = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `ticket-${ticketNumber}-qr.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <canvas ref={canvasRef} className="border-2 border-gray-300 rounded-lg" />
      <Button
        onClick={downloadQRCode}
        variant="outline"
        className="glass-input border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
      >
        <Download className="w-4 h-4 mr-2" />
        Download QR Code
      </Button>
    </div>
  );
};
