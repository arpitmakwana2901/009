const express = require("express");
const UserModel = require("../models/userModel");
const userRoute = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
userRoute.post("/registration", async (req, res) => {
  const { userName, email, password } = req.body;
  try {
    let hashPassword = await bcrypt.hash(password, 10);
    req.body.password = hashPassword;
    await UserModel.create(req.body);
    console.log(req.body);
    return res.status(201).json({
      message: "User Created",
      sucess: true,
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
});

userRoute.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User is not found",
        success: false,
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        success: false,
      });
    }

    // Token generation
    // login
    const myToken = jwt.sign(
      { _id: user._id, userName: user.userName, email: user.email },
      "arpit",
      { expiresIn: "168h" }
    );

    return res.status(201).json({
      message: "Login Successful",
      success: true,
      myToken,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      success: false,
    });
  }
});

module.exports = userRoute;
