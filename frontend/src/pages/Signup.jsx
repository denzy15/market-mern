import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import { Store } from "../Store";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getError } from "../utils";

const Signup = () => {
  //Local states
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  //Navigation
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  //State
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;

  //handlers
  const showPasswordhandler = () => setShowPassword((show) => !show);
  const showConfirmPasswordhandler = () =>
    setShowConfirmPassword((show) => !show);

  async function signInHandler(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Пароли не сходятся");
      return;
    }
    try {
      const { data } = await axios.post("/api/users/signup", {
        name,
        email,
        password,
      });
      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate(redirect || "/");

      setError("");
    } catch (e) {
      setError(getError(e));
    }
  }

  //Check if user is already signed in
  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  return (
    <Container maxWidth={false} sx={{ maxWidth: 450 }}>
      <Typography
        variant="h3"
        sx={{ textAlign: "center", mb: 4, fontFamily: "Montserrat" }}
      >
        Регистрация
      </Typography>
      <Box component="form" onSubmit={signInHandler}>
        <TextField
          onChange={(e) => setName(e.target.value)}
          fullWidth
          required
          label="Имя"
          variant="outlined"
          sx={{ display: "block" }}
        />
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          label="Email"
          variant="outlined"
          sx={{ display: "block", my: 2 }}
        />
        <FormControl fullWidth sx={{ mb: 2 }} variant="outlined" id="password">
          <InputLabel htmlFor="password">Пароль</InputLabel>
          <OutlinedInput
            required
            fullWidth
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={showPasswordhandler}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Пароль"
          />
        </FormControl>

        <FormControl
          fullWidth
          sx={{ mb: 2 }}
          variant="outlined"
          id="confirm-password"
        >
          <InputLabel htmlFor="confirm-password">Подтвердите пароль</InputLabel>
          <OutlinedInput
            required
            fullWidth
            onChange={(e) => setConfirmPassword(e.target.value)}
            type={showConfirmPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={showConfirmPasswordhandler}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Подтвердите Пароль"
          />
        </FormControl>
        {error && (
          <Alert
            severity="error"
            variant="standard"
            sx={{ mb: 2, fontSize: 15 }}
          >
            {error}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ py: 1, mb: 3 }}
        >
          Зарегестрироваться
        </Button>
        <Link
          style={{
            color: "#1976D2",
            textDecoration: "underline",
            float: "right",
          }}
          to={`/signin?redirect=${redirect}`}
        >
          Уже есть аккаунт? Войти
        </Link>
      </Box>
    </Container>
  );
};

export default Signup;
