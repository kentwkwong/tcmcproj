import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Stack,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Fade,
  FormControl,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
} from "@mui/material";
import { Parents } from "../types/Parents";
import axios from "../api/axios";
import { Kid } from "../types/Kid";
import * as Yup from "yup";
import { useFormik } from "formik";
import KidCard from "../components/KidCard";
import { DatePicker } from "@mui/x-date-pickers";

const Profile = () => {
  const parentSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    mom: Yup.string().required("Mom's name is required"),
    momphone: Yup.string().required("Mom's phone is required"),
    dad: Yup.string().required("Dad's name is required"),
    dadphone: Yup.string().required("Dad's phone is required"),
  });

  const { user } = useAuth();

  const [parent, setParent] = useState<Parents | null>(null);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // for initial load
  const [submitting, setSubmitting] = useState(false); // for form submission

  const fetchParent = async () => {
    const res = await axios.get<Parents>(`/parents/${user?.email}`);
    setParent(res.data);
  };

  const [kids, setKids] = useState<Kid[]>([]);
  const [isEditingKid, setIsEditingKid] = useState(false);
  const [editingKidId, setEditingKidId] = useState<string | null>(null);
  const [kidForm, setKidForm] = useState<Kid>({
    name: "",
    dob: "",
    email: user?.email || "",
    gender: "M",
  });
  const handleKidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditingKid) {
      if (editingKidId) {
        const { _id, ...safeForm } = kidForm;
        console.log("Editing ID: " + editingKidId);
        await axios.put<Kid>(`/kids/${editingKidId}`, safeForm);
      } else {
        await axios.post<Kid>("/kids", kidForm);
      }
      setKidForm({ name: "", dob: "", email: user?.email || "", gender: "M" });
      setEditingKidId(null);
      fetchKids();
      setIsEditingKid(false);
    } else {
      setIsEditingKid(true);
    }
  };

  const handleKidEdit = (kid: Kid) => {
    setIsEditingKid(true);
    setKidForm(kid);
    setEditingKidId(kid._id || null);
  };

  const handleKidDelete = async (id: string | undefined) => {
    setIsEditingKid(false);
    if (!id) return;
    await axios.delete(`/kids/${id}`);
    fetchKids();
  };

  const fetchKids = async () => {
    const res = await axios.get<Kid[]>("/kids", {
      params: { email: user?.email },
    });
    setKids(res.data);
  };

  const formik = useFormik({
    initialValues: {
      email: parent?.email || user?.email || "",
      mom: parent?.mom || "",
      momphone: parent?.momphone || "",
      dad: parent?.dad || "",
      dadphone: parent?.dadphone || "",
      _id: parent?._id || "",
    },
    enableReinitialize: true,
    validationSchema: parentSchema,
    onSubmit: async (values) => {
      const { _id, ...safeParent } = values;
      setSubmitting(true);
      try {
        if (_id) {
          await axios.put<Parents>(`/parents/${_id}`, safeParent);
        } else {
          await axios.post<Parents>("/parents", values);
        }
        setSuccess(true);
        setEditing(false);
        await fetchParent();
      } catch (err) {
        console.error("Submission failed:", err);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchParent(), fetchKids()]);
      setLoading(false);
    };
    loadData();
  }, [user?.email]);

  const handleEdit = async () => {
    setSuccess(false);
    setEditing(!editing);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Fade in={!loading}>
      <Box sx={{ px: { xs: 2, sm: 3 }, py: { xs: 2, sm: 4 } }}>
        <center>
          <Typography variant="h6" gutterBottom>
            👤 Parent Contact Info
          </Typography>
        </center>
        {/* Parent Info */}
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography color="text.secondary">Email:</Typography>
            <Typography>{user?.email}</Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" color="text.secondary">
              Mom:
            </Typography>
            <Typography variant="body2">
              {parent?.mom} ({parent?.momphone})
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="body1" color="text.secondary">
              Dad:
            </Typography>
            <Typography variant="body2">
              {parent?.dad} ({parent?.dadphone})
            </Typography>
          </Grid>

          <Grid size={12}>
            <Button variant="outlined" fullWidth onClick={handleEdit}>
              {editing ? "Cancel" : "Update Parent Info"}
            </Button>
          </Grid>

          {success && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="success">Parent info updated!</Alert>
            </Grid>
          )}

          {editing && (
            <Grid size={12}>
              <form onSubmit={formik.handleSubmit}>
                <Stack spacing={2} mt={2}>
                  <TextField
                    fullWidth
                    label="Mom's Name"
                    name="mom"
                    value={formik.values.mom}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.mom && Boolean(formik.errors.mom)}
                    helperText={formik.touched.mom && formik.errors.mom}
                  />
                  <TextField
                    fullWidth
                    label="Mom's Phone"
                    name="momphone"
                    value={formik.values.momphone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.momphone && Boolean(formik.errors.momphone)
                    }
                    helperText={
                      formik.touched.momphone && formik.errors.momphone
                    }
                  />
                  <TextField
                    fullWidth
                    label="Dad's Name"
                    name="dad"
                    value={formik.values.dad}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.dad && Boolean(formik.errors.dad)}
                    helperText={formik.touched.dad && formik.errors.dad}
                  />
                  <TextField
                    fullWidth
                    label="Dad's Phone"
                    name="dadphone"
                    value={formik.values.dadphone}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.dadphone && Boolean(formik.errors.dadphone)
                    }
                    helperText={
                      formik.touched.dadphone && formik.errors.dadphone
                    }
                  />
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!formik.isValid || formik.isSubmitting}
                    startIcon={
                      submitting ? <CircularProgress size={20} /> : null
                    }
                  >
                    {submitting ? "Saving..." : "Save"}
                  </Button>
                </Stack>
              </form>
            </Grid>
          )}
        </Grid>

        <br />
        {/* Kids Info */}

        <Box sx={{ mt: 4 }}>
          <center>
            <Typography variant="h6" gutterBottom>
              🧒 Kids
            </Typography>
          </center>
          <Box component="form" onSubmit={handleKidSubmit} sx={{ mb: 4 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <TextField
                  fullWidth
                  label="Name"
                  value={kidForm.name}
                  onChange={(e) =>
                    setKidForm({ ...kidForm, name: e.target.value })
                  }
                  disabled={!isEditingKid}
                />
              </Grid>
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <RadioGroup
                  row
                  value={kidForm.gender}
                  onChange={(e) =>
                    setKidForm({ ...kidForm, gender: e.target.value })
                  }
                >
                  <FormControlLabel
                    value="M"
                    control={<Radio />}
                    label="Male"
                    disabled={!isEditingKid}
                  />
                  <FormControlLabel
                    value="F"
                    control={<Radio />}
                    label="Female"
                    disabled={!isEditingKid}
                  />
                </RadioGroup>
              </FormControl>
              <DatePicker
                label="Date of Birth"
                value={kidForm.dob ? new Date(kidForm.dob) : null}
                onChange={(date) => {
                  setKidForm({
                    ...kidForm,
                    dob: date ? date.toISOString() : "",
                  });
                }}
                disabled={!isEditingKid}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                  },
                }}
              />
              <Grid size={{ xs: 12 }}>
                <Button variant="contained" type="submit">
                  {isEditingKid ? "Save" : "Add"} Kid
                </Button>
              </Grid>
            </Grid>
          </Box>
          <Grid container spacing={2}>
            {kids.length > 0 ? (
              kids.map((kid) => (
                <Grid size={6} key={kid._id}>
                  <KidCard
                    kid={kid}
                    onEdit={handleKidEdit}
                    onDelete={handleKidDelete}
                  />
                </Grid>
              ))
            ) : (
              <Grid size={12}>
                <Typography color="text.secondary">No kids listed</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Fade>
  );
};

export default Profile;
