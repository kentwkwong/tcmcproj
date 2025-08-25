import { useAuth } from "../context/AuthContext";
import React, { useEffect, useState } from "react";
import { Kid } from "../types/Kid";
import { DatePicker } from "@mui/x-date-pickers";
import KidCard from "../components/KidCard";
import axios from "../api/axios";
import {
  TextField,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Grid,
  Box,
} from "@mui/material";

const Kids = () => {
  const { user } = useAuth();
  const [kids, setKids] = useState<Kid[]>([]);
  const [form, setForm] = useState<Kid>({
    name: "",
    dob: "",
    email: user?.email || "",
    gender: "M",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchKids();
  }, []);

  const fetchKids = async () => {
    const res = await axios.get<Kid[]>("/kids", {
      params: {
        email: user?.email,
      },
    });
    setKids(res.data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      const { _id, ...safeForm } = form;
      console.log("Editing ID: " + editingId);
      await axios.put<Kid>(`/kids/${editingId}`, safeForm);
    } else {
      await axios.post<Kid>("/kids", form);
    }
    setForm({ name: "", dob: "", email: user?.email || "", gender: "M" });
    setEditingId(null);
    fetchKids();
  };

  const handleEdit = (kid: Kid) => {
    setForm(kid);
    setEditingId(kid._id || null);
  };

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    await axios.delete(`/kids/${id}`);
    fetchKids();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Hello, {user?.name}</h1>
      <h2>👤 Profile Manager</h2>

      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Grid>
          <FormControl>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <FormControlLabel value="M" control={<Radio />} label="Male" />
              <FormControlLabel value="F" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <DatePicker
            label="Date of Birth"
            value={form.dob ? new Date(form.dob) : null}
            onChange={(date) => {
              setForm({ ...form, dob: date ? date.toISOString() : "" });
            }}
            slotProps={{
              textField: {
                fullWidth: true,
                variant: "outlined",
              },
            }}
          />
          <Grid size={{ xs: 12 }}>
            <Button variant="contained" type="submit">
              {editingId ? "Update" : "Add"} Kid
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        {kids.map((kid) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={kid._id}>
            <KidCard kid={kid} onEdit={handleEdit} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Kids;
