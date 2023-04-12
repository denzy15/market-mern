/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { getError, getMaxPrice } from "../utils";
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Rating,
  Select,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ProductItem from "../components/ProductItem";
import FilterButton from "../components/FilterButton";
import Loader from "../components/Loader";

const Search = () => {
  const { search } = useLocation();

  //get url params
  const sp = new URLSearchParams(search);
  let query = sp.get("query") || "all";
  let price = sp.get("price") || "all";
  let rating = sp.get("rating") || "all";
  let brand = sp.get("brand") || "all";
  let page = sp.get("page") || 1;

  //States
  const [fetchState, setFetchState] = useState({ loading: true, error: "" });
  const [state, setState] = useState({
    products: [],
    pages: 1,
    countProducts: 0,
  });
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [brandList, setBrandList] = useState([]);
  const [priceRange, setPriceRange] = useState([0, maxPrice]);
  const [hiddenFilters, setHiddenFilters] = useState(false);
  const [sort, setSort] = useState(0);

  //UseEffects
  useEffect(() => {
    setFetchState((prev) => ({ ...prev, loading: true }));
    axios
      .get(
        `/api/products/search?page=${page}&query=${query}&brand=${brand}&price=${price}&rating=${rating}`
      )
      .then((res) => {
        const { data } = res;
        setState((prev) => ({
          ...prev,
          products: data.products.sort(
            (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
          ),
          page: data.page,
          pages: data.pages,
          countProducts: data.countProducts,
        }));
        setFetchState((prev) => ({ ...prev, loading: false }));
      })
      .catch((err) =>
        setFetchState((prev) => ({ ...prev, error: getError(err) }))
      );
  }, [query, brand, page, price, rating, fetchState.error]);

  useEffect(() => {
    axios.get("/api/products").then((res) => {
      const { data } = res;
      const brands = [];
      data.forEach((p) => {
        brands.push(p.brand);
      });

      const max = getMaxPrice(data);
      setBrandList([...new Set(brands)]);
      setMaxPrice(max);
      setPriceRange([0, max + 10000]);
    });
  }, []);

  //handlers
  const updateFilter = (filter) => {
    const filterPage = filter.page || page;
    const filterBrand = filter.brand || brand;
    const filterQuery = filter.query || query;
    const filterRating = filter.rating || rating;
    const filterPrice = filter.price || price;
    return `/search?page=${filterPage}&query=${filterQuery}&brand=${filterBrand}&price=${filterPrice}&rating=${filterRating}`;
  };

  const handlePriceRangeChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (activeThumb === 0) {
      setPriceRange([Math.min(newValue[0], priceRange[1] - 10), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Math.max(newValue[1], priceRange[0] + 10)]);
    }
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
    if (e.target.value === 0) {
      state.products.sort(
        (p1, p2) => new Date(p2.createdAt) - new Date(p1.createdAt)
      );

      return;
    }

    if (e.target.value == 1) {
      state.products.sort((p1, p2) => p1.price - p2.price);
      return;
    }

    if (e.target.value == 2)
      state.products.sort((p1, p2) => p2.price - p1.price);
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <Box
        sx={{ flex: 1, flexShrink: 1 }}
        className={`filters ${hiddenFilters ? "activeFilter" : ""}`}
      >
        <Box component={List} sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="success"
            sx={{
              display: { xs: "inline-block", md: "none" },
              margin: "0 auto 20px",
            }}
            onClick={() => setHiddenFilters(false)}
          >
            Закрыть
          </Button>
          <Typography variant="h6">Производитель:</Typography>
          {brandList.map((b, i) => (
            <ListItem key={i} sx={{ cursor: "pointer" }}>
              <Link
                to={updateFilter({ brand: b })}
                className={brand === b ? "active" : ""}
              >
                {b}
              </Link>
            </ListItem>
          ))}
          <FilterButton updateFilter={updateFilter} filter={{ brand: "all" }}>
            Очистить
          </FilterButton>
        </Box>
        <Box component={List} sx={{ borderBottom: "1px solid black", mb: 2 }}>
          <Typography variant="h6">Рейтинг:</Typography>
          {[...Array(5)].map((x, i) => (
            <ListItem key={i} className={rating == 5 - i ? "active" : ""}>
              <Link
                to={updateFilter({ rating: 5 - i })}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <Rating
                  value={5 - i}
                  readOnly
                  size={rating == 5 - i ? "large" : "medium"}
                />
                <span>и более</span>
              </Link>
            </ListItem>
          ))}
          <FilterButton updateFilter={updateFilter} filter={{ rating: "all" }}>
            Очистить
          </FilterButton>
        </Box>
        <Box sx={{ pr: 5 }}>
          <Typography variant="h6">Цена:</Typography>
          <Slider
            max={maxPrice}
            getAriaLabel={() => "Minimum distance"}
            value={priceRange}
            onChange={handlePriceRangeChange}
            valueLabelDisplay="auto"
            disableSwap
            step={10000}
          />
          <Box component={Stack} direction="row" gap={5}>
            <FilterButton
              updateFilter={updateFilter}
              filter={{ price: priceRange.join("-") }}
            >
              Применить цену
            </FilterButton>

            <FilterButton updateFilter={updateFilter} filter={{ price: "all" }}>
              Очистить
            </FilterButton>
          </Box>
        </Box>
      </Box>
      {fetchState.loading ? (
        <Loader />
      ) : (
        <Box sx={{ flex: 3 }}>
          <Button
            variant="contained"
            sx={{ display: { xs: "inline-block", md: "none" } }}
            onClick={() => setHiddenFilters((visible) => !visible)}
          >
            Фильтры
          </Button>

          <Box sx={{ display: "flex", mb: 3, justifyContent: "space-between" }}>
            {query && query !== "all" && (
              <Box sx={{}}>
                <Typography variant="h6" sx={{ mr: 1 }}>
                  Найдено: {state.countProducts}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Typography variant="body1">{query}</Typography>
                  <Link to={updateFilter({ query: "all" })}>
                    <IconButton>
                      <HighlightOffIcon />
                    </IconButton>
                  </Link>
                </Box>
              </Box>
            )}

            <Select
              size="small"
              sx={{ alignSelf: "center", justifySelf: "" }}
              value={sort}
              onChange={handleSortChange}
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={0}>Новинки</MenuItem>
              <MenuItem value={1}>Сначала дешевые</MenuItem>
              <MenuItem value={2}>Сначала дорогие</MenuItem>
            </Select>
          </Box>
          <ul className="products">
            {!fetchState.error && state.products.length === 0 ? (
              <Alert severity="info">По вашему запросу ничего не найдено</Alert>
            ) : fetchState.error ? (
              <Alert severity="error">{fetchState.error}</Alert>
            ) : (
              state.products.map((p) => <ProductItem key={p._id} {...p} />)
            )}
          </ul>
          {state.products.length !== 0 && (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              {[...Array(state.pages).keys()].map((x) => (
                <Link
                  key={x}
                  to={updateFilter({ page: x + 1 })}
                  style={{ margin: "0 5px" }}
                >
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: "#e0e0e0",
                      color: "black",
                      fontWeight: Number(page) === x + 1 ? 600 : 400,
                      fontSize: Number(page) === x + 1 ? 18 : 14,
                    }}
                  >
                    {x + 1}
                  </Button>
                </Link>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Search;
