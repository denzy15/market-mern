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

const Signin = () => {
  //Local states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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

  async function signInHandler(e) {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/users/signin", {
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
        Авторизация
      </Typography>
      <Box component="form" onSubmit={signInHandler}>
        <TextField
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
          label="Email"
          variant="outlined"
          sx={{ display: "block" }}
        />
        <FormControl fullWidth sx={{ my: 2 }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Пароль</InputLabel>
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
          Войти
        </Button>
        <Link
          style={{
            color: "#1976D2",
            textDecoration: "underline",
            float: "right",
          }}
          to={`/signup?redirect=${redirect}`}
        >
          У вас нет аккаунта? Зарегистрироваться
        </Link>
      </Box>
    </Container>
  );
};

export default Signin;
