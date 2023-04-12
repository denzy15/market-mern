import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSearchbar from "../components/AdminSearchbar";
import ProductControl from "../components/ProductControl";
import { a11yProps, TabPanel } from "../components/Tabpanel";
import UserControl from "../components/UserControl";
import { Store } from "../Store";

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [prdQuery, setPrdQuery] = useState("");
  const [userQuery, setUserQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/products").then((result) => {
      setProducts(result.data);
    });

    axios
      .get("/api/admin/users", {
        headers: {
          authorization: `Bearer ${userInfo.token}`,
        },
      })
      .then((result) => {
        setUsers(result.data);
      });
  }, []);

  let filteredProducts = products.filter((p) => {
    if (prdQuery === "") return p;

    return (
      p.name.toLowerCase().includes(prdQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(prdQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(prdQuery.toLowerCase())
    );
  });

  let filteredUsers = users.filter((u) => {
    if (userQuery === "") return u;

    return (
      u.name.toLowerCase().includes(userQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(userQuery.toLowerCase())
    );
  });

  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        display: { xs: "block", md: "flex" },
        border: "1px solid #eee",
        borderRadius: 2,
      }}
    >
      <Tabs
        orientation="vertical"
        variant="standard"
        value={value}
        onChange={handleChange}
        aria-label="tabs"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          display: { xs: "none", md: "flex" },
        }}
      >
        <Tab label="Пользователи" {...a11yProps(1)} />
        <Tab label="Продукты" {...a11yProps(0)} />
      </Tabs>
      <Tabs
        orientation="horizontal"
        centered
        variant="standard"
        value={value}
        onChange={handleChange}
        aria-label="tabs"
        sx={{
          borderRight: 1,
          borderColor: "divider",
          display: { xs: "flex", md: "none" },
        }}
      >
        <Tab label="Пользователи" {...a11yProps(1)} />
        <Tab label="Продукты" {...a11yProps(0)} />
      </Tabs>
      <TabPanel value={value} index={1}>
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => {
            navigate("products/new");
          }}
        >
          Добавить продукт
        </Button>
        <AdminSearchbar value={prdQuery} setValue={setPrdQuery} />
        <Stack direction="row" sx={{ p: 1, color: "GrayText", mb: 1, gap: 1 }}>
          <Typography
            sx={{
              flexBasis: { md: 270, xs: "30%" },
              width: { md: 270, xs: "30%" },
              flexGrow: { xs: 1, md: 0 },
              flexShrink: 1,
              mr: { xs: 0, md: 1 },
            }}
            variant="caption"
          >
            Название
          </Typography>
          <Typography
            sx={{
              flexBasis: "15%",
              flexGrow: 0,
              flexShrink: 1,
              display: { xs: "none", md: "block" },
            }}
            variant="caption"
          >
            Производитель
          </Typography>

          <Typography sx={{ flex: 1 }} variant="caption">
            Цена
          </Typography>
          <Typography variant="caption">Изменение</Typography>
        </Stack>
        {filteredProducts.map((prd) => (
          <ProductControl key={prd._id} {...prd} />
        ))}
      </TabPanel>
      <TabPanel value={value} index={0}>
        <AdminSearchbar value={userQuery} setValue={setUserQuery} />
        <Stack direction="row" sx={{ p: 1, gap: 1, color: "GrayText", mb: 1 }}>
          <Typography
            sx={{
              flexBasis: { md: 200, xs: "30%" },
              flexGrow: 0,
              flexShrink: 1,
            }}
            variant="caption"
          >
            Имя
          </Typography>
          <Typography sx={{ flex: 1 }} variant="caption">
            Почта
          </Typography>
          <Typography
            sx={{ flex: 1, display: { xs: "none", md: "block" } }}
            variant="caption"
          >
            Дата регистрации
          </Typography>
          <Typography variant="caption">Изменение</Typography>
        </Stack>
        {filteredUsers.map((user) => (
          <UserControl key={user._id} {...user} />
        ))}
      </TabPanel>
    </Box>
  );
}

export default AdminPage;
