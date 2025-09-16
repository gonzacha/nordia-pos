import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Camera, X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({
  onScan,
  onClose
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScanned, setLastScanned] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();

    if (isScanning && videoRef.current) {
      codeReader.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            const barcode = result.getText();
            if (barcode !== lastScanned) {
              setLastScanned(barcode);
              onScan(barcode);
              // Vibrate if available
              if (navigator.vibrate) {
                navigator.vibrate(200);
              }
              // Play sound
              const audio = new Audio('/beep.mp3');
              audio.play().catch(() => {
                // Fallback beep
                console.log('🔊 BEEP! Código escaneado:', barcode);
              });
            }
          }
        }
      );
    }

    return () => {
      codeReader.reset();
    };
  }, [isScanning, onScan, lastScanned]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Camera className="w-6 h-6 mr-2" />
            Scanner de Código de Barras (F11)
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            className="w-full h-64 bg-black rounded"
          />
          {!isScanning && (
            <button
              onClick={() => setIsScanning(true)}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white"
            >
              <Camera className="w-12 h-12 mr-4" />
              Click para activar cámara
            </button>
          )}
        </div>

        {lastScanned && (
          <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded">
            <p className="font-semibold">Último escaneado:</p>
            <p className="text-2xl font-mono">{lastScanned}</p>
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <p>💡 Tip: También podés usar un lector USB</p>
          <p>El sistema detecta automáticamente lectores conectados</p>
        </div>
      </div>
    </div>
  );
};