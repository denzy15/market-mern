import { Box, IconButton, Stack, Typography } from "@mui/material";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import React from "react";
import { useNavigate } from "react-router-dom";

const UserControl = (props) => {
  const { _id, createdAt, email, name, isAdmin } = props;

  const role = isAdmin ? "Admin" : "User";

  const navigate = useNavigate();

  return (
    <Stack
      direction="row"
      sx={{
        alignItems: "center",
        border: "1px solid #bdbdbd",
        mb: 0.2,
        p: 1,
        gap: 1,
      }}
    >
      <Box
        sx={{
          flexBasis: { md: 200, xs: "30%" },
          flexGrow: 0,
          flexShrink: 1,
          fontSize: { xs: "0.9rem", md: "1rem" },
        }}
      >
        <Typography>{name}</Typography>
        <Typography
          variant="subtitle2"
          sx={{
            mt: 0.5,
            border: "1px solid",
            display: "inline-block",
            py: 0.2,
            px: 1,
            borderRadius: 1,
          }}
          bgcolor={isAdmin ? "#b2ff59" : "#03a9f4"}
        >
          {role}
        </Typography>
      </Box>

      <Typography
        sx={{
          flex: 1,
          overflow: "hidden",
          fontSize: { xs: "0.8rem", md: "1rem" },
        }}
      >
        {email}
      </Typography>
      <Typography sx={{ flex: 1, display: { xs: "none", md: "block" } }}>
        {createdAt.substring(0, 10)}
      </Typography>
      <IconButton
        sx={{ p: { xs: 0, md: 1 } }}
        color="warning"
        onClick={() => {
          navigate(`/admin/users/${_id}`);
        }}
      >
        <BorderColorIcon />
      </IconButton>
    </Stack>
  );
};

export default UserControl;
