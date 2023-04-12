import { Button, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import React from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderSuccess = (props) => {
  const navigate = useNavigate();
  return (
    <div>
      <React.Fragment>
        <Typography variant="h5" gutterBottom>
          Спасибо за заказ!
        </Typography>
        <Typography variant="subtitle1">
          Номер вашего заказа : <strong>#{props.orderId}</strong>. Подробнее
          узнать о заказе вы можете на странице{" "}
          <Link to="/order-history" style={{ color: "#1240AB" }}>
            история покупок
          </Link>
          .
        </Typography>
        <Stack direction="row" justifyContent="center">
          <Button
            size="small"
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => navigate("/")}
          >
            Вернуться на главную
          </Button>
        </Stack>
      </React.Fragment>
    </div>
  );
};

export default OrderSuccess;
