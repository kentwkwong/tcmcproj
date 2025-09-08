import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Grid,
  Stack,
  Divider,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Parents } from "../types/Parents";
import axios from "../api/axios";
import { Kid } from "../types/Kid";
import * as Yup from "yup";
import { useFormik } from "formik";

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
  const [kids, setKids] = useState<Kid[]>([]);
  const [editing, setEditing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true); // for initial load
  const [submitting, setSubmitting] = useState(false); // for form submission

  const fetchParent = async () => {
    const res = await axios.get<Parents>(`/parents/${user?.email}`);
    setParent(res.data);
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
      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 600, mx: "auto" }}>
        <Typography variant="h5" gutterBottom textAlign="center">
          Dashboard
        </Typography>

        <Stack spacing={2}>
          {/* Parent Info */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Parent Contact Info
              </Typography>
              <Divider sx={{ mb: 1 }} />
              <Typography variant="body1" color="text.secondary">
                Email:
              </Typography>
              <Typography variant="body2">{user?.email}</Typography>

              <Grid container spacing={2} mt={1}>
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
              </Grid>

              <Button
                variant="outlined"
                sx={{ mt: 2 }}
                fullWidth
                onClick={() => handleEdit()}
              >
                {editing ? "Cancel" : "Update Parent Info"}
              </Button>
              {success && (
                <Alert severity="success">Parent info updated!</Alert>
              )}
              {editing && (
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={2} mt={2}>
                    <TextField
                      label="Mom's Name"
                      name="mom"
                      value={formik.values.mom}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.mom && Boolean(formik.errors.mom)}
                      helperText={formik.touched.mom && formik.errors.mom}
                    />
                    <TextField
                      label="Mom's Phone"
                      name="momphone"
                      value={formik.values.momphone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.momphone &&
                        Boolean(formik.errors.momphone)
                      }
                      helperText={
                        formik.touched.momphone && formik.errors.momphone
                      }
                    />
                    <TextField
                      label="Dad's Name"
                      name="dad"
                      value={formik.values.dad}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={formik.touched.dad && Boolean(formik.errors.dad)}
                      helperText={formik.touched.dad && formik.errors.dad}
                    />
                    <TextField
                      label="Dad's Phone"
                      name="dadphone"
                      value={formik.values.dadphone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched.dadphone &&
                        Boolean(formik.errors.dadphone)
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
              )}
            </CardContent>
          </Card>

          {/* Kids Info */}
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Kids Info
              </Typography>
              <Divider sx={{ mb: 1 }} />
              {kids.length > 0 ? (
                <List dense>
                  {kids.map((kid, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={`${kid.name} (${kid.gender})`}
                        secondary={`Kid ${index + 1}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No kids listed
                </Typography>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Fade>
  );
};

export default Profile;
