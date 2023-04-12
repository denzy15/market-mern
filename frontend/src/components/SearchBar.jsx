import { Box, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const searchHandler = (e) => {
    e.preventDefault();
    navigate(query ? `/search?query=${query}` : "/search");
  };

  return (
    <Box component="form" onSubmit={searchHandler}>
      <TextField
        size="small"
        variant="outlined"
        id="input-with-icon-textfield"
        placeholder="Поиск"
        onChange={(e) => setQuery(e.target.value)}
        sx={{
          background: "#fff",
          borderRadius: 3,
          mx: 2,
          flexGrow: { xs: 1, md: 0 },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start" sx={{ border: "none" }}>
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;
