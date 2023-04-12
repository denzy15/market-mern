import {
  Alert,
  Box,
  Button,
  Grid,
  InputLabel,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Compressor from "compressorjs";
import { convertBase64 } from "../utils";
import { Store } from "../Store";

const EditProduct = () => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  const { _id } = useParams();

  const [openModal, setOpenModal] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState({});
  const [tempImage, setTempImage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/products/${_id}`).then((res) => {
      setProduct(res.data);
      setLoading(false);
    });
  }, []);

  function onChangeHandler(e) {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  }

  async function deleteHandler() {
    try {
      await axios
        .delete(`/api/admin/products/${_id}`, {
          headers: {
            authorization: `Bearer ${userInfo.token}`,
          },
        })
        .then(() => {
          navigate("/admin");
        });
    } catch (err) {
      setError(err.message);
    }
  }

  async function saveHandler() {
    if (product.price <= 5) {
      setError("Минимальная цена - 5 ₸");
      return;
    }

    if (product.countInStock <= 0) {
      setError("Кол-во не может быть меньше 1");
      return;
    }

    let base;

    if (tempImage) {
      const compressed = new Compressor(tempImage, {
        quality: 0.8,
      });
      base = compressed.file;
    }

    base = base && (await convertBase64(base));

    const { image, name, brand, category, countInStock, description, price } =
      product;

    const slug = name.toLocaleLowerCase().split(" ").join("-");

    try {
      setLoading(true);
      axios
        .put(
          `/api/admin/products/${_id}`,
          {
            name,
            slug,
            image: base || image,
            brand,
            category,
            countInStock: +countInStock,
            description,
            price: +price,
            newImage: tempImage ? true : false,
          },
          {
            headers: {
              authorization: `Bearer ${userInfo.token}`,
            },
          }
        )
        .then(() => {
          setLoading(false);
          alert("Информация обновлена");
          navigate("/admin");
        })
        .catch((err) => {
          setLoading(false);
          setError(err.message);
        });
    } catch (error) {
      setLoading(false);
      setError(error.message);
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <Box
      sx={{
        bgcolor: "#e0e0e0",
        display: "flex",
        borderRadius: 5,
        overflow: "hidden",
        p: 3,
        gap: 3,
      }}
    >
      <Box sx={{ flex: 1 }}>
        <img
          style={{ maxWidth: "100%" }}
          src={product.image}
          alt={product.slug}
        />
        <InputLabel
          sx={{
            cursor: "pointer",
            border: "2px solid #2196f3",
            display: "flex",
            p: "10px 20px",
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            m: "10px auto",
          }}
          htmlFor="image-upload"
        >
          <AddPhotoAlternateIcon color="primary" />
          <Typography color="primary" fontWeight={600}>
            Изменить фото продукта
          </Typography>
        </InputLabel>
        <input
          type="file"
          id="image-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => {
            const newUrl = URL.createObjectURL(e.target.files[0]);
            setProduct((prev) => ({ ...prev, image: newUrl }));
            setTempImage(e.target.files[0]);
          }}
        />
      </Box>
      <Box
        sx={{
          flex: 1,
          "& .MuiTypography-body1": { color: "black", fontSize: 15 },
        }}
      >
        <Grid container columnSpacing={1} rowSpacing={4}>
          <Grid item xs={12} md={12}>
            <InputLabel>
              <Typography sx={{ textAlign: "center", fontWeight: 600 }}>
                Название
              </Typography>
              <TextField
                required
                variant="standard"
                fullWidth
                value={product.name}
                name="name"
                onChange={onChangeHandler}
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Производитель</Typography>
              <TextField
                required
                variant="standard"
                value={product.brand}
                name="brand"
                onChange={onChangeHandler}
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Категория</Typography>
              <TextField
                variant="standard"
                value={product.category}
                name="category"
                onChange={onChangeHandler}
                required
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Цена(₸)</Typography>
              <TextField
                variant="standard"
                value={product.price}
                type="number"
                name="price"
                onChange={onChangeHandler}
                required
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputLabel>
              <Typography sx={{ fontWeight: 600 }}>Кол-во в наличии</Typography>
              <TextField
                variant="standard"
                value={product.countInStock}
                type="number"
                name="countInStock"
                onChange={onChangeHandler}
                required
              />
            </InputLabel>
          </Grid>
          <Grid item xs={12}>
            <InputLabel sx={{ textAlign: "center" }}>
              <Typography sx={{ fontWeight: 600 }}>Описание</Typography>
              <TextField
                variant="outlined"
                multiline
                fullWidth
                maxRows={10}
                value={product.description}
                name="description"
                onChange={onChangeHandler}
                required
              />
            </InputLabel>
          </Grid>
        </Grid>
        <Stack direction={"row"} sx={{ my: 4, justifyContent: "space-around" }}>
          <Button
            variant="outlined"
            sx={{ fontWeight: 600, borderWidth: 2 }}
            onClick={() => navigate("/admin")}
          >
            Отмена
          </Button>
          <Button variant="contained" color="success" onClick={saveHandler}>
            Сохранить изменения
          </Button>
        </Stack>
        <Button
          variant="contained"
          size="small"
          color="error"
          sx={{ float: "right", mt: 5 }}
          onClick={() => setOpenModal(true)}
        >
          Удалить товар
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "#64b5f6",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 4,
            p: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h6" component="h2">
            Вы уверены, что хотите удалить данный товар?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Это действие необратимо
          </Typography>

          <Stack direction="row" sx={{ mt: 5, gap: 3 }}>
            <Button
              variant="contained"
              color="error"
              sx={{ flex: 1 }}
              onClick={deleteHandler}
            >
              Удалить
            </Button>
            <Button
              variant="outlined"
              sx={{ flex: 1, bgcolor: "white" }}
              onClick={() => setOpenModal(false)}
            >
              Отмена
            </Button>
          </Stack>
        </Box>
      </Modal>
      {error && (
        <Alert variant="standard" severity="error">
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default EditProduct;
