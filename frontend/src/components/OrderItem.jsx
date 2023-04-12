import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { getMonthName, numberWithSpaces } from "../utils";
import OrderProduct from "./OrderProduct";

const OrderItem = (props) => {
  const { createdAt, orderItems, totalPrice, _id } = props;

  const date = new Date(createdAt);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  const navigate = useNavigate();

  return (
    <Paper variant="outlined" component="section" sx={{ mb: 2 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={{ xs: 3 }}
        justifyContent="space-between"
        alignItems={{ xs: "left", md: "center" }}
        sx={{ px: 2, py: 1, bgcolor: "#e0e0e0" }}
        flexWrap={{ xs: "wrap", md: "nowrap" }}
      >
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Заказ сделан:</Typography>
          <Typography variant="subtitle1">
            {getMonthName(month)} {day}-го, {year}
          </Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Номер заказа:</Typography>
          <Typography variant="subtitle1">#{_id}</Typography>
        </Box>
        <Box>
          <Typography sx={{ fontWeight: "bold" }}>Итоговая цена:</Typography>
          <Typography variant="subtitle1">
            {numberWithSpaces(totalPrice)} ₸
          </Typography>
        </Box>
        <Box>
          <Button onClick={() => navigate(_id)} variant="contained">
            Детали заказа
          </Button>
        </Box>
      </Stack>
      <Box>
        {orderItems.map((pr) => (
          <OrderProduct key={pr._id} {...pr} />
        ))}
      </Box>
    </Paper>
  );
};

export default OrderItem;
