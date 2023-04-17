import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import { Badge } from "@mui/material";
import DeblurSharp from "@mui/icons-material/DeblurSharp";
import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useState, useContext } from "react";

import { Store } from "../Store";
import { Link, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";

function Navbar() {
  const navigate = useNavigate();

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const { state, dispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const signOutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <DeblurSharp sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Link to="/">
            <Typography
              variant="h6"
              noWrap
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                fontFamily: "inherit",
                fontWeight: 700,
                letterSpacing: ".3rem",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              market
            </Typography>
          </Link>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                onClick={() => {
                  navigate("/");
                  handleCloseNavMenu();
                }}
              >
                <Typography textAlign="center" sx={{ display: "flex" }}>
                  {" "}
                  <DeblurSharp
                    sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
                  />
                  Главная
                </Typography>
              </MenuItem>
            </Menu>
          </Box>

          <SearchBar />

          <Box sx={{ flexGrow: 1 }}></Box>

          <Link to="/cart">
            <IconButton
              aria-label="cart"
              sx={{ mr: 2, display: { md: "inline", xs: "none" } }}
            >
              <Badge badgeContent={cart.cartItems.length} color="warning">
                <ShoppingCartIcon sx={{ color: "black" }} />
              </Badge>
            </IconButton>
          </Link>

          {userInfo ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Дополнительно">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar sx={{ bgcolor: "lightcoral" }}>
                    {userInfo.name.slice(0, 1)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Аккаунт</Typography>
                </MenuItem>
                {userInfo.isAdmin && (
                  <MenuItem
                    onClick={() => {
                      navigate("/admin");
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">
                      Администрирование
                    </Typography>
                  </MenuItem>
                )}
                <MenuItem
                  sx={{ display: { md: "none", xs: "flex" } }}
                  onClick={() => {
                    navigate("/cart");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Корзина</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/favorites");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Избранное</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    navigate("/order-history");
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">История покупок</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    signOutHandler();
                    handleCloseUserMenu();
                  }}
                >
                  <Typography textAlign="center">Выйти</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Link to="/signin">
              <Button
                sx={{
                  color: "#fff",
                  backgroundColor: "coral",
                  fontWeight: 600,
                }}
                variant="contained"
              >
                Войти
              </Button>
            </Link>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
