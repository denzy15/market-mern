import { Box, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { numberWithSpaces } from "../utils";
import ImagePlaceholder from "../assets/no_photo.png";

const ProductControl = (props) => {
  const { _id, image, brand, name, price, category } = props;

  const navigate = useNavigate();
  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        borderBottom: "1px solid black",
        mb: 1,
        p: 1,
        gap: 1,
      }}
    >
      <Box
        sx={{
          widht: 70,
          height: 80,
          flex: "0 0 70px",
          display: { xs: "none", md: "block" },
        }}
      >
        <img
          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
          src={image || ImagePlaceholder}
          alt={name}
        />
      </Box>
      <Typography
        sx={{
          flexBasis: { md: 200, xs: "30%" },
          width: { md: 200, xs: "30%" },
          flexGrow: { xs: 1, md: 0 },
          flexShrink: 1,
        }}
      >
        {name}
      </Typography>
      <Typography
        sx={{
          flexBasis: "15%",
          flexGrow: 0,
          flexShrink: 1,
          display: { xs: "none", md: "block" },
        }}
      >
        {brand}
      </Typography>
      <Typography
        sx={{
          flex: 1,
          display: { xs: "none", sm: "block" },
        }}
      >
        {category}
      </Typography>
      <Typography
        sx={{
          flex: 1,
        }}
      >
        {numberWithSpaces(price)} ₸
      </Typography>
      <IconButton
        color="warning"
        onClick={() => {
          navigate(`/admin/products/${_id}`);
        }}
      >
        <BorderColorIcon />
      </IconButton>
    </Stack>
  );
};

export default ProductControl;
