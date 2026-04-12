import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Box,
  CircularProgress,
  Stack,
  Chip,
} from "@mui/material";
import {
  startOfWeek,
  endOfWeek,
  format,
  parse,
  differenceInSeconds,
  parseISO,
  isBefore,
} from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import axios from "../api/axios";
import { Checkins } from "../types/Checkins";

const Report: React.FC = () => {
  // 1. Initial State: Monday to Sunday
  const [dateRange, setDateRange] = useState({
    from: format(startOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd"),
    to: format(endOfWeek(new Date(), { weekStartsOn: 1 }), "yyyy-MM-dd"),
  });

  const [records, setRecords] = useState<Checkins[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Validation Logic
      const startDate = parseISO(dateRange.from);
      const endDate = parseISO(dateRange.to);

      // Check if "to" is before "from"
      if (isBefore(endDate, startDate)) {
        toast.error("Invalid Date Range: 'To' date must be after 'From' date", {
          position: "top-right",
          autoClose: 3000,
        });
        setRecords([]); // Clear records if range is invalid
        return; // STOP calling the API
      }

      setLoading(true);
      try {
        const res = await axios.get(`/checkin/getallcheckinsbydatefromto`, {
          params: {
            from: dateRange.from,
            to: dateRange.to,
          },
        });
        setRecords(res.data);
      } catch (error) {
        console.error("Error fetching report:", error);
        toast.error("Failed to load report data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  // 3. Helper to format duration
  const getDuration = (
    start: string,
    end: string | null | undefined,
  ): string => {
    // 1. Validate if checkout exists
    if (!end || end === "" || end === "null") {
      return "N/A";
    }

    try {
      const startTime = parse(start, "HH:mm:ss", new Date());
      const endTime = parse(end, "HH:mm:ss", new Date());

      // Calculate total seconds difference
      const totalSeconds = differenceInSeconds(endTime, startTime);

      if (totalSeconds < 0) return "Invalid Time";

      // 2. Math for Hours and Minutes
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);

      // 3. Conditional Formatting
      // If there are hours, show "XHours YMin", otherwise just "YMin"
      if (hours > 0) {
        return `${hours}Hours ${minutes}Min`;
      }

      return `${minutes}Min`;
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          sx={{ mb: 4 }}
        >
          <Typography variant="h5" component="h1" fontWeight="bold">
            Attendance Report
          </Typography>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              label="From"
              type="date"
              size="small"
              value={dateRange.from}
              onChange={(e) =>
                setDateRange({ ...dateRange, from: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="To"
              type="date"
              size="small"
              value={dateRange.to}
              onChange={(e) =>
                setDateRange({ ...dateRange, to: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </Stack>

        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{
            width: "100%",
            overflowX: "auto", // Ensures horizontal scroll on very small screens
            borderRadius: { xs: 0, sm: 2 }, // Square edges on mobile, rounded on tablet+
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ backgroundColor: "action.hover" }}>
                <TableCell sx={{ fontWeight: "bold", py: 1.5 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                {/* Hide check-in/out labels on small mobile, show on tablet (sm) */}
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Check-in
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  Check-out
                </TableCell>
                <TableCell sx={{ fontWeight: "bold", textAlign: "right" }}>
                  Duration
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={30} />
                  </TableCell>
                </TableRow>
              ) : records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <Typography variant="body2" color="textSecondary">
                      No data found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                records.map((row) => (
                  <TableRow key={row._id} hover sx={{ height: 56 }}>
                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        fontSize: { xs: "0.75rem", sm: "0.875rem" },
                      }}
                    >
                      {row.date}
                    </TableCell>

                    <TableCell>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: { xs: "0.85rem", sm: "0.875rem" },
                        }}
                      >
                        {row.name}
                      </Typography>
                      {/* On mobile, show times underneath the name since columns are hidden */}
                      <Box
                        sx={{
                          display: { xs: "block", sm: "none" },
                          fontSize: "0.7rem",
                          color: "text.secondary",
                        }}
                      >
                        {row.checkin} - {row.checkout}
                      </Box>
                    </TableCell>

                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                        fontFamily: "monospace",
                      }}
                    >
                      {row.checkin}
                    </TableCell>

                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" },
                        fontFamily: "monospace",
                      }}
                    >
                      {row.checkout}
                    </TableCell>

                    <TableCell align="right">
                      <Chip
                        label={getDuration(row.checkin, row.checkout || "")}
                        size="small"
                        color="primary"
                        variant="filled" // Filled is easier to see on small screens
                        sx={{
                          fontSize: { xs: "0.65rem", sm: "0.75rem" },
                          height: 24,
                          fontWeight: "bold",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Report;
