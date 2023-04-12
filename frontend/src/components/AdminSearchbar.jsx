import { Box, TextField } from "@mui/material";
import React from "react";

const AdminSearchbar = (props) => {
  return (
    <Box sx={{ mb: 1 }}>
      <TextField
        size="small"
        fullWidth
        label="Поиск"
        value={props.value}
        onChange={(e) => props.setValue(e.target.value)}
      />
    </Box>
  );
};

export default AdminSearchbar;
