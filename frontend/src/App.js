import "./App.scss";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Main from "./pages/Main";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import EditProduct from "./pages/EditProduct";
import EditUser from "./pages/EditUser";
import Footer from "./components/Footer";
import { Container } from "@mui/material";
import Profile from "./pages/Profile";
import PlaceOrder from "./pages/PlaceOrder";
import OrderHistory from "./pages/OrderHistory";
import Search from "./pages/Search";
import OrderDetails from "./pages/OrderDetails";
import CreateReview from "./pages/CreateReview";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <Navbar />
        <Container sx={{ mt: 3, flex: 1 }}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/favorites" element={<Main favPage={true} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route path="/product/:slug" element={<Product />} />
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/:_id"
              element={
                <AdminRoute>
                  <EditProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:_id"
              element={
                <AdminRoute>
                  <EditUser />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/place-order"
              element={
                <ProtectedRoute>
                  <PlaceOrder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history"
              element={
                <ProtectedRoute>
                  <OrderHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/order-history/:_id"
              element={
                <ProtectedRoute>
                  <OrderDetails />
                </ProtectedRoute>
              }
            />
            <Route path="/search" element={<Search />} />
            <Route path="/review/:id" element={<CreateReview />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
