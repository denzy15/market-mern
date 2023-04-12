import express from "express";
import { isAuth } from "../utils.js";
import Review from "../models/reviewModel.js";
import Product from "../models/productModel.js";

const reviewRouter = express.Router();

reviewRouter.get("/:productId", async (req, res) => {
  const data = await Review.find({ product: req.params.productId });
  res.send(data);
});

reviewRouter.post("/", isAuth, async (req, res) => {
  const newReview = new Review({
    user: req.user,
    product: req.body.productId,
    rating: req.body.rating,
    feedback: req.body.feedback,
  });

  await newReview.save();

  const allReviews = await Review.find({ product: req.body.productId });
  const updatedNumReviews = allReviews.length;

  const ratings = new Map(
    Object.entries({
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    })
  );

  allReviews.map((review) => {
    ratings.set(String(review.rating), +ratings.get(String(review.rating)) + 1);
  });

  let eachRatingCount = 0;

  for (const val of ratings.values()) eachRatingCount += val;

  const rating =
    (1 * ratings.get("1") +
      2 * ratings.get("2") +
      3 * ratings.get("3") +
      4 * ratings.get("4") +
      5 * ratings.get("5")) /
    eachRatingCount;

  await Product.updateOne(
    { _id: req.body.productId },
    {
      $push: { reviews: newReview._id },
      $set: {
        numReviews: updatedNumReviews,
        rating: rating.toFixed(1),
      },
    }
  );

  res.send("Отзыв успешно опубликован");
});

export default reviewRouter;
