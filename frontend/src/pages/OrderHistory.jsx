import { Alert, Box, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import OrderItem from "../components/OrderItem";
import { Store } from "../Store";

const OrderHistory = () => {
  const { state } = useContext(Store);

  const { userInfo } = state;

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/orders", {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((p) => {
        setOrders(p.data);
      });
    setLoading(false);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <Box component="div">
      <Typography
        variant="h5"
        sx={{
          textAlign: "center",
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          mb: 2,
        }}
      >
        История заказов
      </Typography>
      {orders.length === 0 ? (
        <Alert severity="info">Заказы не найдены</Alert>
      ) : (
        orders.map((order) => (
          <OrderItem
            key={order._id}
            createdAt={order.createdAt}
            orderItems={order.orderItems}
            totalPrice={order.totalPrice}
            _id={order._id}
          />
        ))
      )}
    </Box>
  );
};

export default OrderHistory;
