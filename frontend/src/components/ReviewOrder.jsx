import * as React from "react";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Grid from "@mui/material/Grid";
import { numberWithSpaces } from "../utils";

export default function ReviewOrder(props) {
  const { cart, address, payment, shippingPrice, itemsPrice } = props;

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Итог заказа
      </Typography>
      <List disablePadding>
        {cart.map((p) => (
          <ListItem key={p.name} sx={{ py: 1, px: 0 }}>
            <ListItemText
              primary={p.name}
              secondary={`Количество: ${p.quantity}`}
            />
            <Typography variant="body2">
              {numberWithSpaces(p.price * p.quantity)} ₸
            </Typography>
          </ListItem>
        ))}

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Доставка" />
          <Typography variant="subtitle1">{shippingPrice} ₸</Typography>
        </ListItem>

        <ListItem sx={{ py: 1, px: 0 }}>
          <ListItemText primary="Итого" />
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {numberWithSpaces(itemsPrice)} ₸
          </Typography>
        </ListItem>
      </List>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Доставка
          </Typography>
          <Typography gutterBottom>
            {`${address.firstName} ${address.secondName}`}
          </Typography>
          <Typography gutterBottom>{address.street}</Typography>
          <Typography gutterBottom>
            {address.apartment && `Квартира/офис № ${address.apartment}`}
          </Typography>
          <Typography gutterBottom>
            {address.city}, {address.country}
          </Typography>

          <Typography gutterBottom>{address.state}</Typography>
          <Typography gutterBottom>{address.postalCode}</Typography>
        </Grid>
        <Grid item container direction="column" xs={12} sm={6}>
          <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
            Детали оплаты
          </Typography>
          <Grid container>
            <Grid item xs={12}>
              <Typography gutterBottom>
                {payment.cardName.toUpperCase()}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography gutterBottom>
                Номер карты: {payment.cardNumber}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
