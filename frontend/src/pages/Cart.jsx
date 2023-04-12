import {
  Alert,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartItem from "../components/CartItem";
import { numberWithSpaces } from "../utils";
import { Store } from "../Store";

const Cart = () => {
  const { state } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const navigate = useNavigate();

  const totalCount = cartItems.reduce((a, b) => a + b.price * b.quantity, 0);

  const checkoutHandler = () => {
    navigate("/signin?redirect=/place-order");
  };

  return (
    <Box>
      {cartItems.length === 0 ? (
        <Alert severity="info" sx={{ fontSize: 16 }}>
          Корзина пуста
        </Alert>
      ) : (
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            borderRadius: 5,
            boxShadow: "0 0 3px gray",
            overflow: "hidden",
          }}
        >
          <Box sx={{ flex: 1, p: "10px 20px" }}>
            <Typography
              variant="h4"
              sx={{ py: 3, textAlign: { xs: "center", md: "left" } }}
            >
              Корзина
            </Typography>
            <Table>
              <TableHead
                sx={{
                  display: { xs: "none", md: "table-header-group" },
                }}
              >
                <TableRow
                  sx={{
                    "& .MuiTableCell-head": {
                      p: 1,
                    },
                  }}
                >
                  <TableCell width="45%" sx={{}}>
                    <Typography variant="caption">Детали заказа</Typography>
                  </TableCell>
                  <TableCell width="15%" align="center">
                    <Typography variant="caption">Количество</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption">Цена</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="caption">Итого</Typography>
                  </TableCell>
                  <TableCell width="10%" align="right" sx={{}}>
                    <Typography variant="caption">Удалить</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody
                sx={{ borderTop: { xs: "1px solid #bdbdbd", md: "none" } }}
              >
                {cartItems.map((c) => (
                  <CartItem {...c} key={c._id} />
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box
            sx={{
              flex: " 0 1 30%",
              backgroundColor: "#eeeeee",
              p: "10px 20px",
              textAlign: { xs: "center" },
            }}
          >
            <Typography variant="h4" sx={{ py: 3 }}>
              Итог
            </Typography>
            <Typography variant="h6" mb={1}>
              Количество товаров: {cartItems.length}
            </Typography>
            <Typography
              variant="h5"
              sx={{ py: 1, borderTop: "1px solid #9e9e9e" }}
            >
              Итого: {numberWithSpaces(totalCount)} ₸
            </Typography>
            <Button variant="contained" onClick={checkoutHandler}>
              Перейти к оплате
            </Button>
          </Box>
        </Stack>
      )}
    </Box>
  );
};

<Table>
  <TableHead>
    <TableRow>
      <TableCell>
        <Typography variant="caption" sx={{}}>
          Детали заказа
        </Typography>
        <Typography variant="caption" sx={{}}>
          Количество
        </Typography>
        <Typography variant="caption" sx={{}}>
          Цена
        </Typography>
        <Typography variant="caption" sx={{}}>
          Итого
        </Typography>
        <Typography variant="caption" sx={{}}>
          Удалить
        </Typography>
      </TableCell>
    </TableRow>
  </TableHead>
  <TableBody></TableBody>
</Table>;

export default Cart;
