import { useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRCodeScanner = () => {
  const [cameraType, setCameraType] = useState("environment");
  const [cameraUsing, setCameraUsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  const stopScanner = () => {
    setCameraUsing(false);
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.clear();
      scannerRef.current = null;
    }
  };
  const startScanner = () => {
    setErrorMessage("");
    setScannedResult(null);
    setCameraUsing(true);
    const config = { fps: 5, qrbox: { width: 250, height: 250 } }; // Scanner configuration

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          console.log(devices);
          // const cameraId =
          //   devices.find((device) =>
          //     cameraType === "environment"
          //       ? device.label.includes("back")
          //       : device.label.includes("front")
          //   )?.id || devices[0].id;

          scannerRef.current = new Html5Qrcode("reader");

          scannerRef.current
            .start(
              //devices[0].id,
              { facingMode: "environment" },
              config,
              (decodedText) => {
                setScannedResult(decodedText);
                stopScanner();
              },
              (errorMessage) => {
                console.warn(errorMessage);
              }
            )
            .catch((err) => {
              setErrorMessage("Failed to start scanner: " + err);
            });
        } else {
          setErrorMessage("No cameras found.");
        }
      })
      .catch((err) => {
        setErrorMessage("Error fetching camera devices: " + err);
      });
  };

  return (
    <div className="p-4 text-center">
      <h2 className="text-lg font-bold">QR Code Scanner</h2>
      <div className="mt-4">
        <label>
          <input
            type="radio"
            value="environment"
            checked={cameraType === "environment"}
            onChange={() => setCameraType("environment")}
          />
          Check-In
        </label>
        <label className="ml-4">
          <input
            type="radio"
            value="user"
            checked={cameraType === "user"}
            onChange={() => setCameraType("user")}
          />
          Check-Out
        </label>
      </div>
      <button
        onClick={startScanner}
        className={
          cameraUsing
            ? "hidden mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            : "mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        }
      >
        Start Scanning
      </button>
      <button
        onClick={stopScanner}
        className={
          cameraUsing
            ? "mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            : "hidden mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        }
      >
        Cancel
      </button>
      <div id="reader" className="mt-4" />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {scannedResult && (
        <p className="text-green-500">Scanned Code: {scannedResult}</p>
      )}
    </div>
  );
};

export default QRCodeScanner;
