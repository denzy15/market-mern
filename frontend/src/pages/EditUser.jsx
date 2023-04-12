import React, { useContext, useEffect, useState } from "react";
import { Alert, Box, Button, Modal, Stack, Typography } from "@mui/material";
import Loader from "../components/Loader";
import DeleteIcon from "@mui/icons-material/Delete";
import AdminIcon from "@mui/icons-material/SupervisorAccount";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { getError } from "../utils";
import { toast, ToastContainer } from "react-toastify";

const EditUser = () => {
  const { state } = useContext(Store);
  const { userInfo: me } = state;

  const params = useParams();
  const { _id } = params;

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});

  const [error, setError] = useState("");

  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`/api/admin/users/${_id}`, {
        headers: {
          authorization: `Bearer ${me.token}`,
        },
      })
      .then((res) => {
        setUser(res.data);
        setLoading(false);
      });
  }, []);

  function handleMakeAdmin(e) {
    e.preventDefault();

    axios
      .put(
        `/api/admin/users/${_id}`,
        {},
        {
          headers: {
            authorization: `Bearer ${me.token}`,
          },
        }
      )
      .then(() => {
        setError("");
        toast.info(`Пользователь ${user.name} теперь администратор`);
        setUser({ ...user, isAdmin: true });
      })
      .catch((e) => {
        setError(getError(e));
      });
  }

  function handleDeleteUser() {
    setOpenModal(false);
    if (user._id === me._id) {
      setError("Вы не можете удалить себя :)");
      setTimeout(() => {
        setError("");
      }, 5000);
      return;
    }
    setLoading(true);
    axios
      .delete(`/api/admin/users/${_id}`, {
        headers: {
          authorization: `Bearer ${me.token}`,
        },
      })
      .then(() => {
        navigate("/admin");
      });
  }

  return loading ? (
    <Loader />
  ) : (
    <Box
      sx={{
        bgcolor: "#e0e0e0",
        p: 5,
        borderRadius: 3,
        maxWidth: { xs: 780 },
        m: "0 auto",
      }}
    >
      {error && (
        <Alert
          severity="error"
          variant="filled"
          sx={{
            mb: 3,
            fontSize: 15,
          }}
        >
          {error}
        </Alert>
      )}
      <Typography variant="h4" sx={{ textAlign: "center", mb: 5 }}>
        Информация о пользователе
      </Typography>
      <Stack direction="row" sx={{ columnGap: 5, alignItems: "center", mb: 3 }}>
        <Box
          component="div"
          sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 1 }}
        >
          <Typography variant="subtitle1">Имя пользователя:</Typography>
          <Typography variant="subtitle1">Электронная почта:</Typography>
          <Typography variant="subtitle1">Дата регистрации:</Typography>
          <Typography variant="subtitle1">Роль:</Typography>
        </Box>
        <Box
          component="div"
          sx={{ display: "flex", flexDirection: "column", gap: 2, flex: 2 }}
        >
          <Typography variant="h5">{user.name}</Typography>
          <Typography variant="h6">{user.email}</Typography>
          <Typography variant="h6">
            {user.createdAt ? user.createdAt.slice(0, 10) : "Неизвестно"}
          </Typography>
          <Typography variant="h6">
            {user.isAdmin ? "Администратор" : "Пользователь"}
          </Typography>
        </Box>
      </Stack>
      <Stack direction="row" spacing={3}>
        <Button
          sx={{ flex: 1 }}
          disabled={user.isAdmin}
          variant="contained"
          onClick={() => setOpenModal(true)}
          startIcon={<DeleteIcon />}
        >
          Удалить пользователя
        </Button>
        {!user.isAdmin && (
          <Button
            sx={{ flex: 1 }}
            variant="contained"
            color="success"
            startIcon={<AdminIcon />}
            onClick={handleMakeAdmin}
          >
            Сделать администратором
          </Button>
        )}
      </Stack>

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
            Вы уверены, что хотите удалить пользователя {user.name}?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Это действие необратимо
          </Typography>

          <Stack direction="row" sx={{ mt: 5, gap: 3 }}>
            <Button
              variant="contained"
              sx={{ flex: 1 }}
              onClick={handleDeleteUser}
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
      <ToastContainer position="bottom-center" />
    </Box>
  );
};

export default EditUser;
