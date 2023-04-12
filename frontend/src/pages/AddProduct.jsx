import {
  Alert,
  Box,
  Button,
  InputLabel,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import React, { useContext, useState } from "react";
import { convertBase64 } from "../utils";
import axios from "axios";
import Compressor from "compressorjs";
import Loader from "../components/Loader";
import { Store } from "../Store";

const initialState = {
  image: null,
  name: "",
  brand: "",

  price: "",
  countInStock: "",
  description: "",
  error: "",
};

const UploadProduct = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [
    { brand, countInStock, description, error, image, name, price },
    setState,
  ] = useState(initialState);

  const [uploaded, setUploaded] = useState(false);

  const [loading, setLoading] = useState(false);

  function clearState() {
    setState({ ...initialState });
  }

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  }

  async function addProduct(e) {
    e.preventDefault();
    if (!image) {
      setState((prevState) => ({
        ...prevState,
        error: "Необходимо загрузить фотографию продукта",
      }));
      return;
    }

    if (price <= 5) {
      setState((prevState) => ({
        ...prevState,
        error: "Минимальная цена - 5 ₸",
      }));
      return;
    }

    if (countInStock <= 0) {
      setState((prevState) => ({
        ...prevState,
        error: "Минимальное количество товара в наличии должно быть больше 1",
      }));
      return;
    }

    setLoading(true);

    new Compressor(image, {
      quality: 0.8,
      success: (compressed) =>
        setState((prevState) => ({ ...prevState, image: compressed })),
    });

    let base = await convertBase64(image);
    let slug = name
      .toLocaleLowerCase()
      .split(" ")
      .join("-")
      .replace(/[@!^&\/\\#,+$~'"*?<>{}]/g, "-");

    axios
      .post(
        "/api/admin/products",
        {
          image: base,
          name,
          slug,
          brand,

          countInStock: +countInStock,
          description,
          price: +price,
        },
        {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        }
      )
      .then(() => {
        clearState();
        setUploaded(true);
        setLoading(false);
      })
      .catch((e) => {
        setState((prevState) => ({ ...prevState, error: e.message }));
        setLoading(false);
      });
  }

  return loading ? (
    <Loader />
  ) : (
    <Box
      sx={{ bgcolor: "#e0e0e0", maxWidth: 700, m: "0 auto", borderRadius: 6 }}
    >
      <Typography variant="h5" sx={{ textAlign: "center", py: 4 }}>
        Новый продукт
      </Typography>
      {error && (
        <Alert sx={{ fontSize: 16 }} severity="error">
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={addProduct}
        sx={{ p: 5, display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Box>
          <InputLabel htmlFor="prod-name" sx={{ color: "#212121" }}>
            Название
          </InputLabel>
          <TextField
            name="name"
            sx={{ bgcolor: "whitesmoke" }}
            id="prod-name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={onChangeHandler}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="prod-brand" sx={{ color: "#212121" }}>
            Производитель
          </InputLabel>
          <TextField
            id="prod-brand"
            name="brand"
            value={brand}
            onChange={onChangeHandler}
            sx={{ bgcolor: "whitesmoke" }}
            variant="outlined"
            fullWidth
            required
          />
        </Box>

        <Box>
          <InputLabel htmlFor="prod-price" sx={{ color: "#212121" }}>
            Цена (₸)
          </InputLabel>
          <TextField
            type="number"
            sx={{ bgcolor: "whitesmoke" }}
            id="prod-price"
            variant="outlined"
            fullWidth
            required
            name="price"
            value={price}
            onChange={onChangeHandler}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="prod-count" sx={{ color: "#212121" }}>
            Количество товара в наличии
          </InputLabel>
          <TextField
            type="number"
            sx={{ bgcolor: "whitesmoke" }}
            id="prod-count"
            variant="outlined"
            fullWidth
            required
            name="countInStock"
            value={countInStock}
            onChange={onChangeHandler}
          />
        </Box>
        <Box>
          <InputLabel htmlFor="prod-desc" sx={{ color: "#212121" }}>
            Описание
          </InputLabel>
          <TextField
            id="prod-desc"
            sx={{ bgcolor: "whitesmoke" }}
            minRows={3}
            multiline
            fullWidth
            required
            maxRows={20}
            name="description"
            value={description}
            onChange={onChangeHandler}
          />
        </Box>
        <Box>
          <InputLabel
            sx={{
              cursor: "pointer",
              border: "2px solid #2196f3",
              display: "flex",
              p: "10px 20px",
              borderRadius: 5,
              alignItems: "center",
              gap: 1,
              width: 300,
              height: 80,
              m: "0 auto",
            }}
            htmlFor="image-upload"
          >
            <AddPhotoAlternateIcon color="primary" />
            <Typography color="primary" fontWeight={600}>
              Загрузить фото
            </Typography>
          </InputLabel>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            style={{ display: "none" }}
            onChange={(e) => {
              setState((prevState) => ({
                ...prevState,
                image: e.target.files[0],
              }));
            }}
          />
          {image && (
            <Alert severity="success" sx={{ my: 2 }}>
              Фото загружено
            </Alert>
          )}
        </Box>
        <Button type="submit" variant="contained" sx={{ fontSize: 16 }}>
          Добавить
        </Button>
      </Box>

      {uploaded && (
        <Modal open={uploaded} onClose={() => setUploaded(false)}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              bgcolor: "#e0e0e0",
              borderRadius: 4,
              border: "2px solid #000",
              boxShadow: 24,
              p: 4,
              textAlign: "center",
            }}
          >
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              sx={{ mb: 2 }}
            >
              Продукт успешно добавлен
            </Typography>
            <Button variant="outlined" onClick={() => setUploaded(false)}>
              Ок
            </Button>
          </Box>
        </Modal>
      )}
    </Box>
  );
};

export default UploadProduct;
