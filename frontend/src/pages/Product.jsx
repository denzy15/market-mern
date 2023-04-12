import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Rating,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Store } from "../Store";
import { numberWithSpaces } from "../utils";
import ImagePlaceholder from "../assets/no_photo.png";
import Review from "../components/Review";
import Loader from "../components/Loader";
import { toast, ToastContainer } from "react-toastify";

const Product = () => {
  const [product, setProduct] = useState({ _id: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviews, setReviews] = useState([]);

  const params = useParams();
  const { slug } = params;

  useEffect(() => {
    async function fetchProduct() {
      await axios.get(`/api/products/slug/${slug}`).then((res) => {
        setProduct(res.data);
      });
    }

    fetchProduct();

    if (product._id) {
      axios.get(`/api/reviews/${product._id}`).then((result) => {
        setReviews(result.data);
        setLoading(false);
      });
    }
  }, [product._id]);

  const { state, dispatch: cxtDispatch } = useContext(Store);
  const { cart } = state;

  async function addToCartHandler() {
    const existItem = cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await axios.get(`/api/products/${product._id}`);
    if (data.countInStock < quantity) {
      window.alert("Извините, товара больше нет в наличии");
      return;
    }
    cxtDispatch({ type: "ADD_TO_CART", payload: { ...product, quantity } });
    toast.info("Продукт добавлен в корзину");
  }

  return loading ? (
    <Loader />
  ) : error ? (
    <Alert variant="standard" severity="error">
      {error}
    </Alert>
  ) : (
    <Box>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        <Box sx={{ flex: 0, flexBasis: 500 }}>
          <img
            src={product.image || ImagePlaceholder}
            alt={product.slug}
            loading="lazy"
            className="product__img"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <Typography gutterBottom variant="h2" component="div">
            {product.name}
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 2 }}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography component="div" sx={{ fontSize: 16 }}>
              ({product.numReviews} отзывов)
            </Typography>
          </Box>
          <Box>
            <Typography component="div" sx={{ fontSize: 16, color: "gray" }}>
              Цена:
            </Typography>
            <Typography component="div" sx={{ fontSize: 18, fontWeight: 500 }}>
              {numberWithSpaces(product.price)} ₸
            </Typography>
          </Box>
          <Box sx={{ mt: 3 }}>
            <Typography component="div" sx={{ fontSize: 16, color: "gray" }}>
              Описание:
            </Typography>
            <Typography component="div" variant="body1" sx={{ fontSize: 16 }}>
              {product.description}
            </Typography>
          </Box>
          <Card
            variant="outlined"
            sx={{ mt: 3, maxWidth: 300, textAlign: "center" }}
          >
            <CardContent>
              <Typography sx={{ fontSize: 14, mb: 1 }} color="text.secondary">
                Статус:
              </Typography>
              {product.countInStock > 0 ? (
                <Alert severity="success">
                  <AlertTitle>Товар в наличии</AlertTitle>
                </Alert>
              ) : (
                <Alert severity="warning">
                  <AlertTitle>Нет в наличии</AlertTitle>
                </Alert>
              )}
            </CardContent>
            <CardActions>
              <Button
                style={{ margin: "0 auto" }}
                size="small"
                variant="contained"
                disabled={!product.countInStock}
                onClick={addToCartHandler}
              >
                Добавить в корзину
              </Button>
            </CardActions>
          </Card>
        </Box>
      </Box>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Отзывы
        </Typography>
        <Box sx={{ my: 2 }}>
          {reviews.length === 0 ? (
            <Alert severity="info">Отзывов нет</Alert>
          ) : (
            reviews.map((p) => <Review key={p._id} {...p} />)
          )}
        </Box>
      </Box>
      <ToastContainer limit={1} position="bottom-center" theme="light" />
    </Box>
  );
};

export default Product;
