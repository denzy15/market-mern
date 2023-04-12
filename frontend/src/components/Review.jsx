import { Stack, Paper, Box, Typography, Rating } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { getMonthName } from "../utils";

const Review = (props) => {
  const [author, setAuthor] = useState("");

  const date = new Date(props.createdAt);
  const day = date.getDate();
  const month = getMonthName(date.getMonth());
  const year = date.getFullYear();
  useEffect(() => {
    axios.get(`/api/users/${props.user}`).then((res) => {
      setAuthor(res.data);
    });
  }, []);

  return (
    <Paper variant="outlined" sx={{ mb: 2, p: 3 }}>
      <Box>
        <Typography sx={{ fontWeight: 600, fontSize: 16 }}>{author}</Typography>
        <Rating value={props.rating} readOnly sx={{ mb: 2 }} />
        <Typography sx={{ fontWeight: 600, fontSize: 14 }}>
          Комментарий:
        </Typography>
        <Typography variant="body1">{props.feedback}</Typography>
        <Typography variant="subtitle2" sx={{ mt: 3 }}>
          {month},{day} {year}
        </Typography>
      </Box>
    </Paper>
  );
};

export default Review;
