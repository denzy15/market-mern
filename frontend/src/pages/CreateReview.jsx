import {
  Box,
  Button,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Store } from "../Store";
import { toastNotifier } from "../utils";

const initialState = {
  rating: 0,
  feedback: "",
};

const CreateReview = () => {
  const params = useParams();
  const { id } = params;

  const [loading, setLoading] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [review, setReview] = useState(initialState);
  const [product, setProduct] = useState({});

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${id}`).then((res) => {
      setProduct(res.data);
    });
    setLoading(false);
  }, []);

  function handleSubmitReview() {
    const fetchData = axios.post(
      "/api/reviews",
      { ...review, productId: id },
      {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      }
    );

    toastNotifier(
      fetchData,
      "Загрузка",
      "Отзыв успешно опубликован",
      "Что-то пошло не так"
    );
  }

  return loading ? (
    <Loader />
  ) : (
    <Box>
      <ToastContainer position="bottom-center" limit={1} />
      <Typography variant="h4" align="center">
        Написать отзыв
      </Typography>
      <Stack
        sx={{
          pb: 1,
          borderBottom: "1px solid gray",
        }}
        direction={"row"}
        alignItems="center"
        spacing={2}
      >
        <Box sx={{ width: 100 }}>
          <img
            src={product.image}
            alt={product.slug}
            style={{ maxWidth: "100%" }}
          />
        </Box>
        <Typography variant="body1">{product.name}</Typography>
      </Stack>

      <Box sx={{ mt: 5, pb: 1, borderBottom: "1px solid gray" }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Общий рейтинг
        </Typography>
        <Rating
          size="large"
          name="review-rating"
          value={review.rating}
          onChange={(e, newValue) => {
            setReview((prev) => ({ ...prev, rating: newValue }));
          }}
        />
      </Box>
      <Box sx={{ mt: 5, pb: 1, borderBottom: "1px solid gray", mb: 1 }}>
        <Typography variant="h5" sx={{ mb: 1 }}>
          Добавить письменный отзыв
        </Typography>
        <TextField
          fullWidth
          minRows={2}
          multiline
          value={review.feedback}
          onChange={(e) => {
            setReview((prev) => ({ ...prev, feedback: e.target.value }));
          }}
        />
      </Box>
      <Button onClick={handleSubmitReview} variant="contained">
        Отправить
      </Button>
    </Box>
  );
};

export default CreateReview;
