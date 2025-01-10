const express = require("express");

const validate = require("validator");
const authRouter = express.Router();
const User = require("../models/userModel");
const validateSignUp = require("../helper/ValidationForSignUp");
const validateLogIn = require("../helper/ValidationForLogin");
const trimObjectValues = require("../helper/TrimObjValues");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendResetEmail = require("../helper/mailSender");

//  signup api

authRouter.post("/signup", async (req, res) => {
  try {
    req.body = trimObjectValues(req?.body);
    await validateSignUp(req);
    const userInfo = { ...req?.body };
    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    console.log(userInfo);
    const newUser = new User(userInfo);

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User registered successfully!" });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// login api

authRouter.post("/login", async (req, res) => {
  try {
    validateLogIn(req);
    const { emailId, password } = req?.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid credintials");
    }
    const comparePass = await user.validatePassword(password);
    if (!comparePass) {
      throw new Error("invalid credintials");
    }
    const token = await user.getJWT();
    console.log(token);
    res.cookie("token", token);
    res.send({ success: true, message: "log in Sucessfully !" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// logout api basically all the cleaning work is done here like session , cookies , localstorage... etc

authRouter.post("/logout", async (req, res) => {
  try {
    // const {token}  = req?.cookies ;
    // console.log(token) ;
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.status(200).json({ success: true, message: "logout successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ success: false, message: "Logout failed ! Try again" });
  }
});

// forget password api 

authRouter.patch("/forgetpassword", async (req, res) => {
  const { emailId } = req?.body;
  try {
    const oldUser = await User.findOne({ emailId: emailId });
    if (!oldUser) {
      throw new Error("User Not Found !! ");
    }
    const token = await jwt.sign(
      { _id: oldUser._id, emailId: oldUser.emailId },
      process.env.JWT_SECRET,
      {
        expiresIn: "5m",
      }
    );
    const mailMsg = `http://localhost:5000/resetPassword/${oldUser._id}/${token}`;
    sendResetEmail(oldUser.emailId,mailMsg);
    res.status(200).json({
      success: true,
      message: `Reset link has been sent to your Email ${oldUser.emailId}`,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      message: "failed to Send Reset Link" + err.message,
    });
  }
});

authRouter.get("/resetPassword/:id/:token", async (req, res) => {
  try {
    const { token, id } = req?.params;
    const oldUser = await User.findById(id);
    if (!oldUser) {
      throw new Error("User Not Found");
    }
    const verify = jwt.verify(token, process.env.JWT_SECRET);
    res.render("index", { email: verify.emailId });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "failed to reset password" + err.message,
    });
  }
});

authRouter.post("/resetPassword/:id/:token", async (req, res) => {
  try {
    const { token, id } = req.params;
    const { password } = req.body;
    const isStrongPass = validate.isStrongPassword(password);
    const verify = jwt.verify(token, process.env.JWT_SECRET);

    let message = null;
    let error = false;

    if (!isStrongPass) {
      message =
        "Try another password with some capital letters, numbers, and symbols.";
      error = true;
      return res.render("index", {
        email: verify.emailId,
        message,
        error,
      });
    }

    const oldUser = await User.findById(id);
    if (!oldUser) {
      message = "User Not Found";
      error = true;
      return res.render("index", {
        email: verify.emailId,
        message,
        error,
    });
}

    const passwordhash = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(
      { _id: verify._id },
      { password: passwordhash },
      { runValidators: true }
    );

    message = `Password recovered successfully ✌️ `;
    error = false;
    return res.render("index", {
      email: verify.emailId,
      message,
      error,
    });
  } catch (err) {
    console.log(err);
    message = "Failed to reset password: " + err.message;
    error = true;
    return res.render("index", {
      email: verify.emailId,
      message,
      error,
    });
  }
});


module.exports = authRouter;
