import { Box, Button, Typography } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const OrderProduct = (props) => {
  const { quantity, product: prId } = props;

  const [product, setProduct] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/products/${prId}`).then((res) => {
      setProduct(res.data);
    });
  }, []);

  return (
    <Box
      component="section"
      sx={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #e0e0e0",
        gap: 1,
        py: 1,
      }}
    >
      <Box sx={{ width: 100, height: 100, textAlign: "center" }}>
        <Link to={`/product/${product.slug}`}>
          <img
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
            src={product.image}
            alt={product.slug}
          />
        </Link>
      </Box>
      <Box>
        <Typography variant="h6" sx={{}}>
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </Typography>
        <Typography>Количество: {quantity}</Typography>
      </Box>
      <Button
        variant="outlined"
        sx={{ ml: "auto", mr: 2 }}
        onClick={() => navigate(`/review/${prId}`)}
      >
        Написать отзыв
      </Button>
    </Box>
  );
};

export default OrderProduct;
