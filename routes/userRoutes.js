import express from "express";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { generateToken, isAuth } from "../utils.js";

const userRouter = express.Router();

userRouter.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: "Неправильный адрес почты или пароль" });
  })
);

userRouter.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });

    const user = await newUser.save();

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.put("/:id", isAuth, async (req, res) => {
  const me = await User.findById(req.user._id);

  if (
    req.body.newPassword &&
    !bcrypt.compareSync(req.body.oldPassword, me.password)
  ) {
    res.status(400).send({ message: "Неверный пароль" });
    return;
  }

  const newPsw = req.body.newPassword
    ? bcrypt.hashSync(req.body.newPassword)
    : me.password;

  await User.updateOne(
    {
      _id: req.user._id,
    },
    {
      $set: {
        name: req.body.name,
        email: req.body.email,
        password: newPsw,
      },
    }
  );

  res.send({
    _id: me._id,
    name: me.name,
    email: me.email,
    isAdmin: me.isAdmin,
    token: generateToken(me),
  });
});

userRouter.get("/:_id", async (req, res) => {
  const currentUser = await User.findOne({ _id: req.params._id });
  res.send(currentUser.name);
});

export default userRouter;
