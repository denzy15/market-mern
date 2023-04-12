import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import React from "react";
import { Alert, Box } from "@mui/material";

export default function AddressForm(props) {
  let { address, setAddress } = props;

  let { errors } = address;

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setAddress((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Адрес доставки
      </Typography>
      {!errors.valid && (
        <Box sx={{ py: 2 }}>
          <Alert severity="error">Заполните все обязательные поля</Alert>
        </Box>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onChangeHandler}
            value={address.firstName}
            required
            error={!errors.firstName}
            name="firstName"
            label="Имя"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onChangeHandler}
            value={address.secondName}
            required
            error={!errors.secondName}
            name="secondName"
            label="Фамилия"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={onChangeHandler}
            value={address.street}
            error={!errors.street}
            name="street"
            label="Улица и номер дома"
            fullWidth
            autoComplete="shipping address-line1"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            onChange={onChangeHandler}
            value={address.apartment}
            name="apartment"
            label="№ квартиры или офиса (если частный дом ничего указывать не нужно)"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onChangeHandler}
            value={address.city}
            error={!errors.city}
            name="city"
            label="Город"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            onChange={onChangeHandler}
            value={address.state}
            name="state"
            label="Область/Регион/Провинция"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!errors.postalCode}
            onChange={onChangeHandler}
            value={address.postalCode}
            name="postalCode"
            label="Почтовый индекс"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            error={!errors.country}
            onChange={onChangeHandler}
            value={address.country}
            name="country"
            label="Страна"
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
