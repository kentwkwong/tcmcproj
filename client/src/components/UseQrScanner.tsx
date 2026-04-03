import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { toast } from "react-toastify";

interface UseQrScannerProps {
  qrRegionId: string;
  onScan: (decodedText: string) => void;
}

export const useQrScanner = ({ qrRegionId, onScan }: UseQrScannerProps) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraUsing, setCameraUsing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const stopScanner = useCallback(async () => {
    setCameraUsing(false);

    if (html5QrCodeRef.current) {
      try {
        if (
          html5QrCodeRef.current.getState() === Html5QrcodeScannerState.SCANNING
        ) {
          await html5QrCodeRef.current.stop();
        }
        await html5QrCodeRef.current.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }
      html5QrCodeRef.current = null;
    }
  }, []);

  const startScanner = useCallback(() => {
    setScannedResult(null);
    setCameraUsing(true);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.77,
      disableFlip: true,
    };

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length === 0) {
          toast.error("No cameras found.");
          return;
        }

        let selectedDevice =
          devices.find((d) => d.label.toLowerCase().includes("back")) ??
          devices[devices.length - 1];

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
        }

        html5QrCodeRef.current
          .start(
            { deviceId: selectedDevice.id },
            config,
            async (decodedText) => {
              await html5QrCodeRef.current?.pause(true);
              setScannedResult(decodedText);
              onScan(decodedText);
            },
            () => {},
          )
          .catch((err) => toast.error("Failed to start scanner: " + err));
      })
      .catch((err) => toast.error("Error fetching camera devices: " + err));
  }, [qrRegionId, onScan]);

  useEffect(() => {
    if (cameraUsing) startScanner();
    return () => {
      stopScanner();
    };
  }, [cameraUsing, startScanner, stopScanner]);

  return {
    cameraUsing,
    setCameraUsing,
    scannedResult,
    startScanner,
    stopScanner,
  };
};
