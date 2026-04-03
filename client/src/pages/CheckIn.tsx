// CheckInPage.jsx
import { useState, useEffect } from "react";
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
import axios from "../api/axios";
import { Kid } from "../types/Kid";
import { Checkins } from "../types/Checkins";
import { getTorontoDate } from "../components/Utility";
import { toast } from "react-toastify";
import { useQrScanner } from "../components/UseQrScanner";

const CheckInPage = () => {
  const [kidOptions, setKidOptions] = useState<Kid[]>([]);
  const [selectedKid, setSelectedKid] = useState<Kid | null>(null);
  const [checkins, setCheckins] = useState<Checkins[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const today = getTorontoDate();
  const qrCodeRegionId = "qr-reader";

  const processSubmit = async (idOrName: string) => {
    try {
      const res = await axios.post(`/checkin/${idOrName}`);
      toast.success(res.data.message);
      fetchCheckin();
    } catch (err: any) {
      toast.error(err.response?.data.error);
    }
  };

  const { cameraUsing, setCameraUsing, scannedResult } = useQrScanner({
    qrRegionId: qrCodeRegionId,
    onScan: processSubmit,
  });

  const fetchCheckin = async () => {
    try {
      const res = await axios.get(`/checkin/getallcheckinsbydate/${today}`);
      setCheckins(res.data);
    } catch (err: any) {
      toast.error(err.response?.data.error);
    }
  };

  useEffect(() => {
    fetchCheckin();
  }, []);

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
      } catch (err) {}
    };

    const debounce = setTimeout(fetchKids, 300);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [searchInput]);

  const handleSubmit = () => {
    if (selectedKid) {
      processSubmit(selectedKid._id!);
    } else if (searchInput.trim()) {
      processSubmit(searchInput.trim());
    }
    setSearchInput("");
    setSelectedKid(null);
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
            onChange={(_, value) => setSelectedKid(value)}
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
