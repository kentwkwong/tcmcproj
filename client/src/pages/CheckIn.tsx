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
  Button,
} from "@mui/material";
import { Html5Qrcode } from "html5-qrcode";
import axios from "../api/axios";
import { Kid } from "../types/Kid";
import { Checkins } from "../types/Checkins";
import { getTorontoDate } from "../components/Utility";
import { toast } from "react-toastify";
// import { Checkins } from "../types/Checkins";

const CheckInPage = () => {
  const [kidOptions, setKidOptions] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [checkins, setCheckins] = useState<Checkins[]>([]);
  const [searchInput, setSearchInput] = useState("");
  // const [loading, setLoading] = useState(false);
  const qrCodeRegionId = "qr-reader";

  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const [cameraUsing, setCameraUsing] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | null>(null);

  const today = getTorontoDate();

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
          toast.error("No cameras found.");
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
            toast.error("Failed to start scanner: " + err);
          });
      })
      .catch((err) => {
        toast.error("Error fetching camera devices: " + err);
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
    fetchCheckin();
  }, [checkins]);

  const fetchCheckin = async () => {
    try {
      const res = await axios.get(`/checkin/getallcheckinsbydate/${today}`);
      setCheckins(res.data);
    } catch (err: any) {
      console.error("Error fetching check-ins:", err);
      toast.error(err.response?.data.error);
    }
  };

  useEffect(() => {
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
    // if (value && !checkedIn.some((k) => k.name === value.name)) {
    //   setCheckedIn((prev) => [...prev, value]);
    // }
    setSelectedKid(value);
  };

  const handleSubmit = async () => {
    try {
      let name = selectedKid?.name;
      if (selectedKid) {
        await axios.post(`/checkin/${selectedKid._id}`);
      } else if (searchInput.trim()) {
        name = searchInput.trim();
        await axios.post("/checkin", { idOrName: searchInput.trim() });
      } else {
        console.warn("No input provided");
      }
      toast.success(`${name} check in successfully! 🎉 `);
    } catch (err: any) {
      console.error("Submission failed:", err);
      toast.error(err.response?.data.error);
    }
    setSearchInput("");
    setSelectedKid(null);
    fetchCheckin();
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
        <>
          <Autocomplete
            options={kidOptions}
            getOptionLabel={(option) => option.name}
            onInputChange={(_: any, value) => setSearchInput(value)}
            onChange={handleSelectKid}
            value={selectedKid}
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
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={!searchInput.trim() && !selectedKid}
          >
            Submit
          </Button>
        </>
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
      {checkins.length > 0 && (
        <Paper sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ p: 2 }}>
            Checked-In Kids
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Kid Name</TableCell>
                <TableCell>In</TableCell>
                <TableCell>Out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkins.map((chkin, index) => (
                <TableRow key={index}>
                  <TableCell>{chkin.name}</TableCell>
                  <TableCell>{chkin.checkin}</TableCell>
                  <TableCell>{chkin.checkout}</TableCell>
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
