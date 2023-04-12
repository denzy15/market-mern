import { Box } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";

const FilterButton = ({ updateFilter, filter, children }) => {
  const style = {
    mt: 1,

    display: "inline-block",
    borderRadius: 1,
    border: "1px solid black",
    textTransform: "uppercase",
    fontSize: 10,
    letterSpacing: 1,
    cursor: "pointer",
    bgcolor: children === "Очистить" ? "lightcoral" : "#2196f3",
    color: children === "Очистить" ? "black" : "white",
  };

  return (
    <Box component="span" sx={style}>
      <Link
        to={updateFilter(filter)}
        style={{
          padding: 10,
          display: "inline-block",
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Link>
    </Box>
  );
};

export default FilterButton;
