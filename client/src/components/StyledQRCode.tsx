import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

interface Props {
  value: string;
  size?: number;
}

const StyledQRCode: React.FC<Props> = ({ value, size = 200 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const qrCode = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    // Clear previous QR code if any
    if (ref.current) {
      ref.current.innerHTML = "";
    }

    // Create a new instance
    qrCode.current = new QRCodeStyling({
      width: size,
      height: size,
      data: value,
      dotsOptions: {
        type: "classy-rounded",
        color: "#000000",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
      qrOptions: {
        errorCorrectionLevel: "H",
      },
    });

    // Append to container
    if (ref.current) {
      qrCode.current.append(ref.current);
    }

    // Cleanup on unmount
    return () => {
      if (ref.current) {
        ref.current.innerHTML = "";
      }
    };
  }, [value, size]);

  return <div ref={ref} />;
};

export default StyledQRCode;
