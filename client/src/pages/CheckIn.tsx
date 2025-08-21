// CheckInPage.jsx
import { useState, useEffect, useRef, SyntheticEvent } from "react";
import {
  Container,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Autocomplete,
} from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";

type Kid = {
  name: string;
  age?: number; // optional, if needed;
  parent: string;
  phone: string;
};

// const checkedIn: Kid[] = [];

const mockKids: Kid[] = [
  { name: "Liam", parent: "Olivia", phone: "123-456-7890" },
  { name: "Noah", parent: "Emma", phone: "234-567-8901" },
  { name: "Ava", parent: "James", phone: "345-678-9012" },
  { name: "Mia", parent: "Sophia", phone: "456-789-0123" },
];

const CheckInPage = () => {
  const [mode, setMode] = useState("search");
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [checkedIn, setCheckedIn] = useState<Kid[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const qrCodeRegionId = "qr-reader";

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);

  //   const [cameraType, setCameraType] = useState("environment");
  const [cameraUsing, setCameraUsing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  //   const scannerRef = useRef<Html5Qrcode | null>(null);

  const today = new Date().toLocaleDateString();

  const stopScanner = () => {
    setCameraUsing(false);
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop();
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
          html5QrCodeRef.current = new Html5Qrcode("reader");

          html5QrCodeRef.current
            .start(
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

  useEffect(() => {
    if (mode === "scan") {
      const config = { fps: 5, qrbox: { width: 250, height: 250 } };
      html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
      html5QrCodeRef.current
        .start(
          { facingMode: "environment" },
          config,
          (decodedText) => {
            const kid = mockKids.find(
              (k) => k.name.toLowerCase() === decodedText.toLowerCase()
            );
            if (kid && !checkedIn.some((c) => c.name === kid.name)) {
              setCheckedIn((prev) => [...prev, kid]);
            }
          },
          () => {}
        )
        .catch((err) => console.error("QR scanner error:", err));
    }

    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear();
      }
    };
  }, [mode]);

  const handleSelectKid = (event: SyntheticEvent, value: Kid | null) => {
    if (value && !checkedIn.some((k) => k.name === value.name)) {
      setCheckedIn((prev) => [...prev, value]);
    }
    setSelectedKid(value);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Check-In
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        📅 Today: {today}
      </Typography>

      <RadioGroup
        row
        value={mode}
        onChange={(e) => {
          const newMode = e.target.value;
          if (mode === "scan" && html5QrCodeRef.current) {
            console.log("CP1");
            html5QrCodeRef.current
              .stop()
              .then(() => {
                console.log(newMode);
                return html5QrCodeRef.current?.clear();
              })
              .then(() => {
                html5QrCodeRef.current = null;
                setMode(newMode);
              })
              .catch((err) => {
                console.error("Failed to stop QR scanner:", err);
                setMode(newMode); // fallback
              });
          } else {
            setMode(newMode);
          }
        }}
      >
        <FormControlLabel
          value="search"
          control={<Radio />}
          label="Search by Name"
        />
        <FormControlLabel
          value="scan"
          control={<Radio />}
          label="Scan QR Code"
        />
      </RadioGroup>
      {/* 
      <RadioGroup row value={mode} onChange={(e) => setMode(e.target.value)}>
        <FormControlLabel
          value="search"
          control={<Radio />}
          label="Search by Name"
        />
        <FormControlLabel
          value="scan"
          control={<Radio />}
          label="Scan QR Code"
        />
      </RadioGroup> */}

      {mode === "search" && (
        <Autocomplete
          options={mockKids}
          getOptionLabel={(option) => option.name}
          onInputChange={(e, value) => setSearchInput(value)}
          onChange={handleSelectKid}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Search Kid Name"
              variant="outlined"
              fullWidth
              sx={{ mt: 2 }}
            />
          )}
        />
      )}

      {mode === "scan" && (
        <div
          id={qrCodeRegionId}
          style={{ width: "100%", marginTop: "20px" }}
        ></div>
      )}

      {checkedIn.length > 0 && (
        <Paper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Checked-In Kids
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kid Name</TableCell>
                <TableCell>Parent Name</TableCell>
                <TableCell>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkedIn.map((mockKids, index) => (
                <TableRow key={index}>
                  <TableCell>{mockKids.name}</TableCell>
                  <TableCell>{mockKids.parent}</TableCell>
                  <TableCell>{mockKids.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}
    </Container>
  );
};

export default CheckInPage;
