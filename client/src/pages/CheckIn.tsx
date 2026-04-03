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
  Box,
  Button,
} from "@mui/material";
import axios from "../api/axios";
// import { Kid } from "../types/Kid";
import { Checkins } from "../types/Checkins";
import { getTorontoDate } from "../components/Utility";
import { toast } from "react-toastify";
import { useQrScanner } from "../components/UseQrScanner";
import { useKidSearch } from "../components/UseKidSearch";

const CheckInPage = () => {
  const [checkins, setCheckins] = useState<Checkins[]>([]);
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

  const {
    kidOptions,
    selectedKid,
    setSelectedKid,
    setSearchInput,
    guestName,
    setGuestName,
    guestPhone,
    handlePhoneChange,
    handleSearchSubmit,
    isSubmitDisabled,
  } = useKidSearch({ onCheckIn: processSubmit });

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
          {selectedKid && !selectedKid._id && (
            <Box
              sx={{ mt: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}
            >
              <Typography variant="subtitle2" color="error" sx={{ mb: 1 }}>
                * Guest Information Required
              </Typography>
              <TextField
                label="Guest Kid Name"
                fullWidth
                required
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Phone Number"
                fullWidth
                required
                placeholder="(000) 000-0000"
                value={guestPhone}
                onChange={(e) => handlePhoneChange(e.target.value)}
              />
            </Box>
          )}
          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSearchSubmit}
            disabled={isSubmitDisabled}
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
