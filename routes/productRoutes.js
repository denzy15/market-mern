import express, { query } from "express";
import Product from "../models/productModel.js";

const productRouter = express.Router();

const PAGE_SIZE = 10;

productRouter.get("/", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

productRouter.get("/search", async (req, res) => {
  const { query } = req;
  const pageSize = PAGE_SIZE;
  const page = query.page || 1;
  const brand = query.brand || "";
  const price = query.price || "all";
  const rating = query.rating || "";
  const searchQuery = query.query || "";

  const queryFilter =
    searchQuery && searchQuery !== "all"
      ? {
          name: {
            $regex: searchQuery,
            $options: "i",
          },
        }
      : {};

  const brandFilter = brand && brand !== "all" ? { brand } : {};
  const priceFilter =
    price && price !== "all"
      ? {
          price: {
            $gte: Number(price.split("-")[0]),
            $lte: Number(price.split("-")[1]),
          },
        }
      : {};

  const ratingFilter =
    rating && rating !== "all"
      ? {
          rating: {
            $gte: Number(rating),
          },
        }
      : {};
  const products = await Product.find({
    ...queryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  })
    .skip(pageSize * (page - 1))
    .limit(pageSize);

  const countProducts = await Product.countDocuments({
    ...queryFilter,
    ...brandFilter,
    ...priceFilter,
    ...ratingFilter,
  });

  res.send({
    products,
    countProducts,
    page,
    pages: Math.ceil(countProducts / pageSize),
  });
});

productRouter.get("/slug/:slug", async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (product) res.send(product);
  else res.status(404).send({ message: "Товар не найден" });
});

productRouter.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) res.send(product);
  else res.status(404).send({ message: "Товар не найден" });
});

export default productRouter;
