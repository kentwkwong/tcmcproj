import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Checkins } from "../types/Checkins";
import { getTorontoDate } from "../components/Utility";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTorontoDate());
  const [checkins, setCheckins] = useState<Checkins[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCheckins = async (date: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/checkin/getallcheckinsbydate/${date}`);
      setCheckins(res.data);
    } catch (err) {
      console.error("Error fetching check-ins:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      await axios.put(`/checkin/checkout/${id}`);
      await fetchCheckins(selectedDate);
    } catch (err) {
      console.error("Error updating checkout:", err);
    }
  };

  useEffect(() => {
    console.log("start");
    console.log(getTorontoDate());
    fetchCheckins(selectedDate);
  }, [selectedDate]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Check-in Dashboard
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Select Date"
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Check-in</strong>
                </TableCell>
                <TableCell>
                  <strong>Checkout</strong>
                </TableCell>
                <TableCell>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {checkins.map((record) => (
                <TableRow key={record._id}>
                  <TableCell>{record.name}</TableCell>
                  <TableCell>{record.checkin}</TableCell>
                  <TableCell>{record.checkout}</TableCell>
                  <TableCell>
                    {!record.checkout && (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCheckout(record._id)}
                      >
                        Checkout
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default Dashboard;
