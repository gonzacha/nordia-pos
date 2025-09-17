'use client';

import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import { Camera, Keyboard, X } from 'lucide-react';
import { Button, Input } from '@/design-system/components';
import { cn } from '@/design-system/utils/cn';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
  enableBeep?: boolean;
}

export const BarcodeScanner = ({
  onScan,
  onClose,
  enableBeep = true,
}: BarcodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const lastScannedRef = useRef<string | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [fallbackManual, setFallbackManual] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [cameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    if (fallbackManual) {
      controlsRef.current?.stop();
      controlsRef.current = null;
      return;
    }

    let isCancelled = false;
    const reader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Este dispositivo no soporta cámara.');
        setFallbackManual(true);
        return;
      }

      try {
        setCameraReady(false);
        const controls = await reader.decodeFromConstraints(
          { video: { facingMode: { ideal: 'environment' } } },
          videoRef.current!,
          (result, err) => {
            if (isCancelled) return;

            if (result) {
              const value = result.getText();
              if (!value || value === lastScannedRef.current) return;

              lastScannedRef.current = value;
              if (enableBeep) {
                try {
                  const beep = new Audio('/beep.mp3');
                  void beep.play();
                } catch (audioError) {
                  console.debug('Beep no disponible', audioError);
                }
              }
              onScan(value);
            }

            if (err) {
              const name = (err as { name?: string })?.name;
              if (name && name !== 'NotFoundException') {
                setError(name);
              }
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
        setError(
          scannerError instanceof Error
            ? scannerError.message
            : 'No se pudo iniciar la cámara.'
        );
        setFallbackManual(true);
      }
    };

    startScanner();

    return () => {
      isCancelled = true;
      controlsRef.current?.stop();
      controlsRef.current = null;
    };
  }, [onScan, enableBeep, fallbackManual]);

  const handleManualSubmit = () => {
    const code = manualCode.trim();
    if (!code) return;
    lastScannedRef.current = code;
    onScan(code);
    setManualCode('');
  };

  const handleUseManual = () => {
    setFallbackManual(true);
    setError(null);
    lastScannedRef.current = null;
  };

  const handleRetryCamera = () => {
    setFallbackManual(false);
    setError(null);
    lastScannedRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-large">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="flex items-center text-lg font-semibold text-neutral-900">
            <Camera className="mr-2 h-5 w-5 text-brand" />
            Scanner de código de barras
          </h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {!fallbackManual ? (
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-xl border border-neutral-200 bg-neutral-900">
              <video
                ref={videoRef}
                className={cn(
                  'h-64 w-full object-cover',
                  !cameraReady && 'opacity-0'
                )}
                muted
                playsInline
                autoPlay
              />

              {!cameraReady && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 text-white">
                  <Camera className="mb-3 h-9 w-9 animate-pulse" />
                  <p>Inicializando cámara…</p>
                </div>
              )}
            </div>

            {lastScannedRef.current && (
              <div className="rounded-xl border border-success/40 bg-success/10 p-4 text-success">
                <p className="text-sm font-medium">Último código detectado</p>
                <p className="font-mono text-lg">{lastScannedRef.current}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2 text-sm text-neutral-600">
              <Button variant="ghost" size="sm" onClick={handleUseManual}>
                <Keyboard className="mr-2 h-4 w-4" />
                Ingresar manualmente
              </Button>
              <span>Podés utilizar un lector USB o la cámara del dispositivo.</span>
              {error && <span className="text-danger">{error}</span>}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
              <p className="text-sm text-neutral-700">
                {error ? `Cámara no disponible (${error}).` : 'Cámara no disponible en este dispositivo.'}
              </p>
              <p className="text-sm text-neutral-600">
                Ingresá el código de barras manualmente o reintenta habilitar la cámara.
              </p>
            </div>

            <Input
              autoFocus
              placeholder="Ingresá el código de barras"
              value={manualCode}
              onChange={(event) => setManualCode(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  handleManualSubmit();
                }
              }}
            />

            <div className="flex flex-wrap gap-2">
              <Button onClick={handleManualSubmit}>Aceptar</Button>
              <Button variant="ghost" onClick={handleRetryCamera}>
                Volver a cámara
              </Button>
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
