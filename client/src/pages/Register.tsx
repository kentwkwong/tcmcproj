import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  CircularProgress,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "../api/axios";
// import { TrySharp } from "@mui/icons-material";
import { useState } from "react";
import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// ✅ Yup schema
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  name: yup.string().required("Please enter your name"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  // const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    console.log("Register data:", data);
    setLoading(true);
    setApiError("");
    try {
      const res = await axios.post(`/users/register`, {
        email: data.email,
        name: data.name,
        password: data.password,
      });
      console.log(res.data);
      reset();
      toast.success(
        "Registered successfully! 🎉 Redirecting..."
        //   , {
        //   position: "top-center",
        //   theme: "dark",
        //   autoClose: 1000,
        // }
      );
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err: any) {
      console.error("Register error:", err);
      toast.error(err.response?.data.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 3, mt: 6 }}>
          <Typography variant="h5" align="left" gutterBottom>
            Register your account
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            {apiError && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {apiError}
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Register"}
            </Button>
          </form>
          <Typography align="left" sx={{ mt: 2 }}>
            Already have an account?
            <Link href="/" underline="hover">
              {" "}
              Sign in
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
