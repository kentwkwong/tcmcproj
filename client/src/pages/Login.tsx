// import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
// import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect } from "react";
import { Google } from "@mui/icons-material";

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
  //   const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

  //   const handleLogin = async (credentialResponse: any) => {
  //     try {
  //       const res = await axios.post(
  //         import.meta.env.VITE_API_URL + "/api/auth/google",
  //         { credential: credentialResponse.credential },
  //         { withCredentials: true }
  //       );
  //       if (res.data.success) {
  //         console.log(res.data);
  //         window.location.href = "/dashboard"; // reload to trigger context fetch
  //       }
  //     } catch (err) {
  //       console.error("Login failed:", err);
  //     }
  //   };

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

  const onSubmit = (data: FormData) => {
    console.log("Form Data:", data);
    // You can send login request here
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
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
            {/* <GoogleOAuthProvider clientId={googleClientId}>
              <GoogleLogin
                data-width="200px"
                onSuccess={handleLogin}
                onError={() => console.error("Login Failed")}
                theme="outline"
                size="large"
              />
            </GoogleOAuthProvider> */}
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
