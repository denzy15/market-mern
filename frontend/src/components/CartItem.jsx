import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@mui/icons-material/Remove";
import React, { useContext } from "react";
import { numberWithSpaces } from "../utils";
import { Store } from "../Store";

const CartItem = (props) => {
  const { dispatch } = useContext(Store);

  const updateCartHandler = async (qty) => {
    if (props.countInStock < qty) {
      window.alert("Извините, товара больше нет в наличии");
      return;
    }
    dispatch({ type: "ADD_TO_CART", payload: { ...props, quantity: qty } });
  };

  const deleteFromCartHandler = async () => {
    dispatch({ type: "REMOVE_FROM_CART", payload: props });
  };

  return (
    <TableRow
      sx={{
        borderBottom: "1px solid #bdbdbd",
        alignItems: "center",
        "& .MuiTableCell-body": {
          px: 1,
        },
        display: { xs: "flex", md: "table-row" },
        flexWrap: "wrap",
        justifyContent: { xs: "space-between", md: "initial" },
      }}
    >
      <TableCell sx={{ border: { xs: "none" } }}>
        <Stack direction="row" sx={{ alignItems: "center", gap: 1 }}>
          <img
            style={{ maxWidth: "100px" }}
            src={props.image}
            alt={props.name}
          />
          <Typography variant="h6">{props.name}</Typography>
        </Stack>
      </TableCell>

      <TableCell sx={{ border: { xs: "none" } }}>
        <Box
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 5,
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            height: 30,
          }}
        >
          <IconButton
            aria-label="add"
            color="info"
            disabled={props.quantity === props.countInStock}
            onClick={() => updateCartHandler(props.quantity + 1)}
          >
            <AddIcon />
          </IconButton>
          <Typography component="span" sx={{ paddingX: 1, fontSize: 18 }}>
            {props.quantity}
          </Typography>
          <IconButton
            color="info"
            aria-label="remove"
            disabled={props.quantity === 1}
            onClick={() => updateCartHandler(props.quantity - 1)}
          >
            <RemoveIcon />
          </IconButton>
        </Box>
      </TableCell>
      <TableCell
        sx={{ display: { xs: "none", md: "table-cell" } }}
        align="right"
      >
        <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
          {numberWithSpaces(props.price)} ₸
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ border: { xs: "none" } }}>
        <Typography sx={{ fontWeight: 500, fontSize: 15 }}>
          {numberWithSpaces(props.price * props.quantity)} ₸
        </Typography>
      </TableCell>
      <TableCell align="right" sx={{ border: { xs: "none" } }}>
        <IconButton aria-label="delete" onClick={deleteFromCartHandler}>
          <DeleteIcon sx={{ color: "black" }} />
        </IconButton>
      </TableCell>
    </TableRow>
  );
};

export default CartItem;
