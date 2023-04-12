import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { numberWithSpaces } from "../utils";
import { Store } from "../Store";
import ImagePlaceholder from "../assets/no_photo.png";
import { toast, ToastContainer } from "react-toastify";

const ProductItem = (props) => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const addToCartHandler = async () => {
    const existItem = cartItems.find((x) => x._id === props._id);
    const qty = existItem ? existItem.quantity + 1 : 1;
    if (props.countInStock < qty) {
      toast.error("Извините, товара больше нет в наличии");
      return;
    }
    ctxDispatch({ type: "ADD_TO_CART", payload: { ...props, quantity: qty } });
    toast.info("Продукт добавлен в корзину");
  };

  return (
    <Card className="product" sx={{ display: "flex", flexDirection: "column" }}>
      <Link to={`/product/${props.slug}`}>
        <CardMedia
          sx={{ height: 300, width: "100%", backgroundSize: "contain" }}
          title={props.slug}
          image={props.image || ImagePlaceholder}
        />
      </Link>
      <Box
        sx={{
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          flex: "1 0 auto",
        }}
      >
        <Link to={`/product/${props.slug}`} style={{ flex: 1 }}>
          <Typography variant="h6" margin="dense">
            {props.name}
          </Typography>
        </Link>
        <Typography sx={{ mt: 1 }}>Рейтинг продукта:</Typography>
        <Rating value={props.rating} readOnly precision={0.5} sx={{ my: 1 }} />
        <Typography
          variant="h4"
          color="#212121"
          sx={{ fontWeight: 600, mt: 3, fontSize: 25 }}
        >
          {numberWithSpaces(props.price)} ₸
        </Typography>
        <CardActions>
          {props.countInStock === 0 ? (
            <Button variant="outlined" disabled sx={{ ml: -1 }}>
              Нет в наличии
            </Button>
          ) : (
            <Button
              variant="contained"
              color="info"
              size="medium"
              sx={{ ml: -1 }}
              onClick={addToCartHandler}
            >
              Добавить в корзину
            </Button>
          )}
        </CardActions>
      </Box>

      <ToastContainer limit={1} position="bottom-center" />
    </Card>
  );
};

export default ProductItem;
