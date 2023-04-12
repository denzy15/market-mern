import * as React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { expriy_format } from "../utils";

export default function PaymentForm(props) {
  const { payment, setPayment } = props;

  const { errors } = payment;

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setPayment((prevState) => ({ ...prevState, [name]: value }));
  }

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Способ оплаты
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            value={payment.cardName.toUpperCase()}
            onChange={onChangeHandler}
            error={!errors.cardName}
            name="cardName"
            label="Имя на карте"
            fullWidth
            autoComplete="cc-name"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            value={payment.cardNumber}
            onChange={onChangeHandler}
            name="cardNumber"
            error={!errors.cardNumber}
            label="Номер карты"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            value={expriy_format(payment.expiryDate)}
            onChange={onChangeHandler}
            error={!errors.expiryDate}
            name="expiryDate"
            label="Дата истечения срока действия"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            error={!errors.cvv}
            value={payment.cvv}
            onChange={onChangeHandler}
            name="cvv"
            label="CVV"
            helperText="3 цифры на обратной стороне карты"
            fullWidth
            variant="standard"
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
