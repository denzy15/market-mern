import express from "express";
import Product from "../models/productModel.js";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import { isAuth } from "../utils.js";

const adminRouter = express.Router();

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

adminRouter.get("/users", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }

  const users = await User.find();
  res.send(users);
});

adminRouter.get("/users/:id", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }
  const user = await User.findById(req.params.id);
  if (user) res.send(user);
  else res.status(404).send({ message: "Пользователь не найден" });
});

adminRouter.delete("/users/:id", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.send("Пользватель удален");
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

adminRouter.put("/users/:id", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }
  await User.updateOne(
    { _id: req.params.id },
    {
      $set: {
        isAdmin: true,
      },
    }
  );
  res.send("Успешно");
});

adminRouter.post("/products", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }

  let image_url = "";
  await cloudinary.v2.uploader
    .upload(
      req.body.image,
      {
        overwrite: true,
        invalidate: true,
        resource_type: "auto",
        public_id: req.body.slug,
      },
      (err, result) => {
        if (!result) {
          res.status(400).send({ message: err.message });
        }
        image_url = result.secure_url;
      }
    )
    .catch((e) => {
      res.status(500).send({ message: "Не удалось загрузить фото" });
    });

  const newProduct = new Product({
    name: req.body.name,
    slug: req.body.slug,
    brand: req.body.brand,
    image: image_url,
    countInStock: req.body.countInStock,
    description: req.body.description,
    price: req.body.price,
    numReviews: 0,
    rating: 0,
    reviews: [],
  });

  await newProduct.save();

  res.send("Продукт создан успешно");
});

adminRouter.put("/products/:id", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }
  let image_url = "";
  if (req.body.newImage) {
    await cloudinary.v2.uploader.upload(
      req.body.image,
      {
        overwrite: true,
        invalidate: true,
        resource_type: "auto",
        public_id: req.body.slug,
      },
      (err, result) => {
        if (!result) {
          res.status(500).send({
            message: "Не удалось обновить фото, попробуйте позже",
          });
        }
        image_url = result.secure_url;
      }
    );
  }

  await Product.updateOne(
    { _id: req.params.id },
    {
      $set: {
        name: req.body.name,
        slug: req.body.slug,
        image: req.body.newImage ? image_url : req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock,
      },
    }
  );
  res.send({ message: "Product info updated successfully" });
});

adminRouter.delete("/products/:id", isAuth, async (req, res) => {
  if (!req.user.isAdmin) {
    res.status(403).send({ message: "У вас нет прав администратора" });
  }
  const product = await Product.findById(req.params.id);
  let slug = product.slug;
  await Product.findByIdAndDelete(req.params.id).then(() => {
    cloudinary.v2.uploader.destroy(slug);
  });
  res.send("Продукт успешно удалён");
});

export default adminRouter;
