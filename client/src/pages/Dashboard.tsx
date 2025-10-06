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
  Modal,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { Checkins } from "../types/Checkins";
import { Parents } from "../types/Parents";
import { getTorontoDate } from "../components/Utility";
import { toast } from "react-toastify";

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getTorontoDate());
  const [checkins, setCheckins] = useState<Checkins[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedParent, setSelectedParent] = useState<Parents | null>(null);

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

  const handleKidClick = async (id: string) => {
    try {
      const res = await axios.get(`/kids/getparentinfobykidid/${id}`);
      setSelectedParent(res.data);
    } catch (err) {
      console.error("Error fetching kid info:", err);
      toast.error("Failed to fetch kid info");
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      const res = await axios.put(`/checkin/checkout/${id}`);
      await fetchCheckins(selectedDate);
      toast.success(res.data.message);
    } catch (err: any) {
      console.error("Error updating checkout:", err);
      toast.error(err.response?.data.error);
    }
  };

  useEffect(() => {
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
                <TableRow
                  key={record._id}
                  hover
                  sx={{ cursor: "pointer" }}
                  onClick={() => handleKidClick(record.refId || "")}
                >
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

      <Modal
        open={!!selectedParent}
        onClose={() => setSelectedParent(null)}
        aria-labelledby="kid-info-title"
        aria-describedby="kid-info-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
          }}
        >
          <IconButton
            onClick={() => setSelectedParent(null)}
            sx={{ position: "absolute", top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography id="kid-info-title" variant="h6" gutterBottom>
            Contact
          </Typography>
          <Typography>
            <strong>{selectedParent?.mom}</strong>
          </Typography>
          {selectedParent?.momphone}
          <Typography>
            <strong>{selectedParent?.dad}</strong>
          </Typography>
          {selectedParent?.dadphone}
        </Box>
      </Modal>
    </Box>
  );
};

export default Dashboard;
