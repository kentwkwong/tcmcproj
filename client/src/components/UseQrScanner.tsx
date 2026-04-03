import { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode";
import { toast } from "react-toastify";

interface UseQrScannerProps {
  qrRegionId: string;
  onScan: (decodedText: string) => void;
}

export const useQrScanner = ({ qrRegionId, onScan }: UseQrScannerProps) => {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const startingRef = useRef(false);
  const stoppingRef = useRef(false);
  const isLockedRef = useRef(false);
  const counter = useRef(0);

  const [cameraUsing, setCameraUsing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const stopScanner = useCallback(() => {
    if (!html5QrCodeRef.current) return;
    if (stoppingRef.current) return;

    stoppingRef.current = true;

    (() => {
      try {
        const state = html5QrCodeRef.current!.getState();

        if (state === Html5QrcodeScannerState.SCANNING) {
          html5QrCodeRef.current!.stop();
        }

        // Wait for stop transition to finish
        new Promise((res) => setTimeout(res, 120));

        html5QrCodeRef.current!.clear();
      } catch (err) {
        console.error("Error stopping scanner:", err);
      }

      html5QrCodeRef.current = null;
      stoppingRef.current = false;
    })();
  }, []);

  const startScanner = useCallback(() => {
    if (startingRef.current) return;
    startingRef.current = true;

    setScannedResult(null);

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.77,
      disableFlip: true,
    };

    Html5Qrcode.getCameras()
      .then(async (devices) => {
        if (devices.length === 0) {
          toast.error("No cameras found.");
          startingRef.current = false;
          return;
        }

        const selectedDevice =
          devices.find((d) => d.label.toLowerCase().includes("back")) ??
          devices[devices.length - 1];

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(qrRegionId);
        }

        html5QrCodeRef.current
          ?.start(
            { deviceId: selectedDevice.id },
            config,
            (text) => {
              console.log(counter.current + " : " + isLockedRef.current);
              if (isLockedRef.current) return;
              isLockedRef.current = true;
              setScannedResult(text);
              onScan(text);
              counter.current++;

              setTimeout(() => {
                isLockedRef.current = false;
                console.log("Scanner ready for next code");
              }, 2000);
            },
            () => {},
          )
          .catch((err) => console.error("Start error:", err));
      })
      .catch((err) => toast.error("Error fetching camera devices: " + err))
      .finally(() => {
        startingRef.current = false;
      });
  }, [qrRegionId, onScan]);

  useEffect(() => {
    if (cameraUsing) startScanner();
    else stopScanner();

    return () => {
      void stopScanner();
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
