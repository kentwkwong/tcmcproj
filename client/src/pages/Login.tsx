import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Google } from "@mui/icons-material";
import axios from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Min 6 characters")
    .required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard"); // or your target page
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      console.log("Form Data:", data);
      const res = await axios.post(
        `/users/login`,
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );
      console.log(res);

      if (res.data.success) {
        toast.success("Login successful!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      }
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.error || "Login failed. Please try again.";
      toast.error(errorMsg);
    }
  };

  return (
    <Box
    //   sx={{
    //     height: "100vh",
    //     display: "flex",
    //     alignItems: "center",
    //     justifyContent: "center",
    //     bgcolor: "background.default",
    //     px: 2,
    //   }}
    >
      <Container maxWidth="xs">
        <Paper elevation={3} sx={{ p: 3, mt: 6 }}>
          <Typography variant="h5" align="left" gutterBottom>
            Sign in to your account
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
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }}>
              Sign In
            </Button>
          </form>
          <Typography variant="h6" align="center" gutterBottom>
            <Button
              startIcon={<Google />}
              variant="outlined"
              fullWidth
              onClick={login}
              sx={{ mt: 2 }}
            >
              Sign in with Google
            </Button>
          </Typography>
          <Typography align="left" sx={{ mt: 2 }}>
            Don't have an account?
            <Link href="/register" underline="hover">
              {" "}
              Register
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
