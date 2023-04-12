import { Alert, Box, Button } from "@mui/material";
import axios from "axios";
import React, { useEffect, useReducer } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";
import ProductItem from "../components/ProductItem";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, products: action.payload, loading: false };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const Main = () => {
  const [{ loading, error, products }, dispatch] = useReducer(reducer, {
    products: [],
    loading: true,
    error: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      dispatch({ type: "FETCH_FAIL", payload: null });
      try {
        const result = await axios.get("/api/products");
        if (result.data.length === 0) {
          dispatch({ type: "FETCH_FAIL", payload: "Пусто" });
        } else dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (error) {
        dispatch({ type: "FETCH_FAIL", payload: error.message });
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      {loading ? (
        <Loader />
      ) : error ? (
        <Alert variant="standard" severity="error" sx={{ fontSize: 15 }}>
          {error}
        </Alert>
      ) : (
        <Box>
          <Link
            to="/search"
            style={{ display: "inline-block", marginBottom: 10 }}
          >
            <Button variant="outlined">Показать фильтры</Button>
          </Link>
          <ul className="products">
            {products.map((p) => (
              <ProductItem key={p._id} {...p} />
            ))}
          </ul>
        </Box>
      )}
    </div>
  );
};

export default Main;
