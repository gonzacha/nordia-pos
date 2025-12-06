'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { Camera, Keyboard, X } from 'lucide-react';
import { Button } from '@nordia/ui';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  enableBeep?: boolean;
}

export function BarcodeScanner({
  onScan,
  onClose,
  enableBeep = true,
}: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [useCameraMode, setUseCameraMode] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (!useCameraMode) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      return;
    }

    let isCancelled = false;
    const reader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Este dispositivo no soporta cámara.');
        setUseCameraMode(false);
        return;
      }

      try {
        setCameraReady(false);
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } } },
          videoRef.current!,
          (result, _err) => {
            if (isCancelled) return;

            if (result) {
              const value = result.getText();
              if (!value || value === lastScannedRef.current) return;

              lastScannedRef.current = value;
              if (enableBeep) {
                try {
                  const ctx = new AudioContext();
                  const osc = ctx.createOscillator();
                  osc.type = 'sine';
                  osc.frequency.value = 1000;
                  osc.connect(ctx.destination);
                  osc.start();
                  setTimeout(() => { osc.stop(); ctx.close(); }, 100);
                } catch {}
              }
              onScan(value);
            }
          }
        );

        if (isCancelled) {
          controls.stop();
          return;
        }

        controlsRef.current = controls;
        setCameraReady(true);
        setError(null);
      } catch (scannerError) {
        if (isCancelled) return;
        setError('No se pudo iniciar la cámara.');
        setUseCameraMode(false);
      }
    };

    startScanner();

    return () => {
      isCancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onScan, enableBeep, useCameraMode]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (!code) return;
    lastScannedRef.current = code;
    onScan(code);
    setManualCode('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold">
            <Keyboard className="mr-2 h-5 w-5 text-blue-600" />
            Scanner de código de barras
          </h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {useCameraMode ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border bg-slate-900">
              <video
                ref={videoRef}
                className={`h-64 w-full object-cover ${!cameraReady ? 'opacity-0' : ''}`}
                muted
                playsInline
                autoPlay
              />
              {!cameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                  <Camera className="mb-3 h-9 w-9 animate-pulse" />
                  <p>Inicializando cámara…</p>
                </div>
              )}
            </div>

            {lastScannedRef.current && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-green-700">
                <p className="text-sm font-medium">Último código detectado</p>
                <p className="font-mono text-lg">{lastScannedRef.current}</p>
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Button variant="outline" size="sm" onClick={() => setUseCameraMode(false)}>
                <Keyboard className="mr-2 h-4 w-4" />
                Ingresar manualmente
              </Button>
              {error && <span className="text-red-500">{error}</span>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Ingresá el código de barras manualmente o conectá un lector USB.
            </p>
            <input
              autoFocus
              type="text"
              placeholder="Código de barras"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex gap-2">
              <Button onClick={handleManualSubmit}>Aceptar</Button>
              <Button variant="outline" onClick={() => setUseCameraMode(true)}>
                <Camera className="mr-2 h-4 w-4" />
                Usar cámara
              </Button>
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
