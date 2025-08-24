// CheckInPage.jsx
import { useState, useEffect, useRef } from "react";
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
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [checkedIn, setCheckedIn] = useState<Kid[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const qrCodeRegionId = "qr-reader";

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraUsing, setCameraUsing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const today = new Date().toLocaleDateString();

  const stopScanner = async () => {
    setCameraUsing(false);
    if (html5QrCodeRef.current) {
      await html5QrCodeRef.current.stop();
      await html5QrCodeRef.current.clear();
      html5QrCodeRef.current = null;
    }
  };
  const startScanner = () => {
    setScannedResult(null);
    setCameraUsing(true);
    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.77,
    }; // Scanner configuration

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length > 0) {
          html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);

          html5QrCodeRef.current
            .start(
              { facingMode: "environment" },
              config,
              (decodedText) => {
                setScannedResult(decodedText);
                console.log(decodedText);
                // stopScanner();
                html5QrCodeRef.current?.stop();
              },
              () => {}
            )
            .catch((err) => {
              console.log("Failed to start scanner: " + err);
            });
        } else {
          console.log("No cameras found.");
        }
      })
      .catch((err) => {
        console.log("Error fetching camera devices: " + err);
      });
  };

  useEffect(() => {
    if (cameraUsing) {
      startScanner();
    }

    return () => {
      stopScanner();
    };
  }, [cameraUsing]);

  useEffect(() => {
    console.log(searchInput);
  }, [searchInput]);

  useEffect(() => {}, [selectedKid]);

  const handleSelectKid = (_: any, value: Kid | null) => {
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
        value={cameraUsing}
        onChange={(e) => {
          setCameraUsing(e.target.value === "true");
        }}
      >
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="Search by Name"
        />
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="Scan QR Code"
        />
      </RadioGroup>

      {!cameraUsing && (
        <Autocomplete
          options={mockKids}
          getOptionLabel={(option) => option.name}
          onInputChange={(_: any, value) => setSearchInput(value)}
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

      {cameraUsing && !scannedResult && (
        <Typography variant="body2" color="textSecondary">
          Looking for QR code...
        </Typography>
      )}

      {cameraUsing && (
        <div
          id={qrCodeRegionId}
          style={{ width: "100%", marginTop: "20px" }}
        ></div>
      )}
      <TextField
        label="Scanned Result"
        variant="outlined"
        fullWidth
        value={scannedResult ?? ""}
        sx={{ mt: 2 }}
        InputProps={{
          readOnly: true,
        }}
      />
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
