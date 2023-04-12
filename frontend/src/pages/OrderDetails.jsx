import React, { useContext, useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import Loader from "../components/Loader";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Store } from "../Store";
import { getMonthName, numberWithSpaces } from "../utils";
import OrderProduct from "../components/OrderProduct";

const OrderDetails = () => {
  const params = useParams();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [shippingAddress, setShippingAddress] = useState({});
  const [paymentDetails, setPaymentDetails] = useState({ cardNumber: 1703 });

  const { _id: orderId } = params;

  const [order, setOrder] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((res) => {
        setOrder(res.data);
        setPaymentDetails(res.data.paymentDetails);
        setShippingAddress(res.data.shippingAddress);
        setLoading(false);
      });
  }, []);

  const date = new Date(order.createdAt);
  let day = date.getDate();
  let month = date.getMonth();
  let year = date.getFullYear();

  return loading ? (
    <Loader />
  ) : (
    <Box>
      <Typography variant="h4">Информация о заказе</Typography>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          my: 3,
          alignItems: "center",
          gap: { xs: 5, md: "10%" },
          fontSize: 15,
        }}
      >
        <Typography>
          Заказ сделан{" "}
          <strong>
            {getMonthName(month)} {day}-го, {year}
          </strong>
        </Typography>
        <Typography>
          id заказа: <strong>#{orderId}</strong>
        </Typography>
      </Stack>
      <Box
        component={Paper}
        variant="outlined"
        sx={{ display: "flex", p: 3, justifyContent: "space-between" }}
      >
        <Box component="section">
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Адрес доставки
          </Typography>
          <Typography variant="body1">{shippingAddress.fullName}</Typography>
          <Typography variant="body1"> {shippingAddress.address}</Typography>
          <Typography variant="body1">{shippingAddress.city}</Typography>
          <Typography variant="body1">{shippingAddress.country}</Typography>
        </Box>
        <Box component="section">
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Способ оплаты
          </Typography>
          <Typography>
            Карта ****{paymentDetails.cardNumber.toString().slice(-4)}
          </Typography>
        </Box>
        <Box component="section">
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
            Оплачено:
          </Typography>
          <Typography variant="body1">
            Товар: {numberWithSpaces(order.itemsPrice)} ₸
          </Typography>
          <Typography variant="body1">
            Доставка: {numberWithSpaces(order.shippingPrice)} ₸
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 600, mt: 1 }}>
            Итого: {numberWithSpaces(order.totalPrice)} ₸
          </Typography>
        </Box>
      </Box>
      <Box>
        {order.orderItems.map((pr) => (
          <OrderProduct key={pr._id} {...pr} />
        ))}
      </Box>
    </Box>
  );
};

export default OrderDetails;
