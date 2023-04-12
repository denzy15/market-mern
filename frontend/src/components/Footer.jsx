import { Box } from "@mui/material";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        textAlign: "center",
        p: 3,
        mt: 5,
        bgcolor: "#2196f3",
        fontWeight: 600,
      }}
    >
      Copyright© Denmarket 2023
    </Box>
  );
};

export default Footer;
