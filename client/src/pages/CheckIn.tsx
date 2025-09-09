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
import axios from "../api/axios";
import { Kid } from "../types/Kid";
// import { Checkins } from "../types/Checkins";

const CheckInPage = () => {
  const [kidOptions, setKidOptions] = useState<Kid[]>([]);
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
      disableFlip: true,
    }; // Scanner configuration

    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices.length === 0) {
          console.error("No cameras found.");
          return;
        }

        // Try to find a back-facing camera
        let selectedDevice = devices.find((d) =>
          d.label.toLowerCase().includes("back")
        );
        if (!selectedDevice) {
          selectedDevice =
            devices.length > 1 ? devices[devices.length - 1] : devices[0];
        }

        if (!html5QrCodeRef.current) {
          html5QrCodeRef.current = new Html5Qrcode(qrCodeRegionId);
        }

        html5QrCodeRef.current
          .start(
            { deviceId: selectedDevice.id },
            config,
            (decodedText) => {
              setScannedResult(decodedText);
              console.log(decodedText);
              html5QrCodeRef.current?.stop();
            },
            () => {}
          )
          .catch((err) => {
            console.log("Failed to start scanner: " + err);
          });
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

  // useEffect(() => {
  //   console.log(searchInput);
  // }, [searchInput]);

  useEffect(() => {
    console.log(searchInput);
    const controller = new AbortController();

    const fetchKids = async () => {
      if (!searchInput.trim()) {
        setKidOptions([]);
        return;
      }

      try {
        const res = await axios.get(`/kids/getkidsbyname/${searchInput}`, {
          signal: controller.signal,
        });
        setKidOptions(res.data);
      } catch (err) {
        if ((err as any)?.code === "ERR_CANCELED") return;
        console.error("Error fetching kids:", err);
      }
    };

    const debounce = setTimeout(fetchKids, 300); // debounce input

    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
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
          options={kidOptions}
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
                <TableCell>DOB</TableCell>
                <TableCell>Gender</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkedIn.map((kidOptions, index) => (
                <TableRow key={index}>
                  <TableCell>{kidOptions.name}</TableCell>
                  <TableCell>{kidOptions.dob.split("T")[0]}</TableCell>
                  <TableCell>{kidOptions.gender}</TableCell>
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
