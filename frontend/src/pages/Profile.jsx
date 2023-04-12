import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import React, { useContext, useState } from "react";
import { Store } from "../Store";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { state } = useContext(Store);

  const { userInfo } = state;

  const navigate = useNavigate();

  const [user, setUser] = useState(userInfo);
  const [showPassword, setShowPassword] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  }

  const saveChanges = () => {
    if (!user.name) {
      setError("Введите имя");
      return;
    }
    if (!user.email) {
      setError("Введите почту");
      return;
    }

    if (user.newPassword) {
      if (!user.oldPassword) {
        setError("Введите свой текущий пароль для подтверждения");
        return;
      }
      if (user.newPassword !== user.confPassword) {
        setError("Новые пароли не соответствуют");
        return;
      }
    }

    axios
      .put(
        `/api/users/${userInfo._id}`,
        {
          name: user.name,
          email: user.email,
          oldPassword: user.oldPassword,
          newPassword: user.newPassword,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      .then(() => {
        setError("");
        alert("Все четко");
        navigate("/");
      })
      .catch((e) => {
        setError(e.response.data.message);
      });
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ textAlign: "center", mb: 3 }}>
        Настройки аккаунта
      </Typography>
      <Box component={Paper} variant="outlined" sx={{ p: 4 }}>
        <Grid container columnSpacing={5} rowSpacing={4}>
          {error && (
            <Grid item xs={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h5"
              sx={{ borderBottom: "1px solid #000", py: 1 }}
            >
              Основная информация:
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Имя</Typography>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                name="name"
                value={user.name}
                onChange={onChangeHandler}
                margin="dense"
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Почта</Typography>
              <TextField
                required
                fullWidth
                size="small"
                margin="dense"
                variant="outlined"
                value={user.email}
                name="email"
                onChange={onChangeHandler}
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} textAlign="center">
            <Typography
              variant="h5"
              sx={{ borderBottom: "1px solid #000", py: 1 }}
            >
              Изменение пароля:
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
              id="old-password"
            >
              <InputLabel htmlFor="old-password">Старый пароль</InputLabel>
              <OutlinedInput
                fullWidth
                onChange={onChangeHandler}
                name="oldPassword"
                type={showOldPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowOldPassword((show) => !show)}
                      edge="end"
                    >
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Старый пароль"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
              id="password"
            >
              <InputLabel htmlFor="new-password">Новый пароль</InputLabel>
              <OutlinedInput
                required
                fullWidth
                name="newPassword"
                id="new-password"
                onChange={onChangeHandler}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((show) => !show)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Новый пароль"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <FormControl
              fullWidth
              sx={{ mb: 2 }}
              variant="outlined"
              id="confirm-password"
            >
              <InputLabel htmlFor="confirm-password">
                Подтвердите пароль
              </InputLabel>
              <OutlinedInput
                name="confPassword"
                required
                fullWidth
                onChange={onChangeHandler}
                type={showConfirmPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowConfirmPassword((show) => !show)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Подтвердите Пароль"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="outlined" onClick={() => navigate("/")}>
              Отмена
            </Button>
          </Grid>
          <Grid item xs={12} md={6}>
            <Button variant="contained" onClick={saveChanges}>
              Сохранить изменения
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile;
