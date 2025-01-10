const express = require("express");

const profileRouter = express.Router();
const validateForUpdateUser = require("../helper/ValidationForEditProfile");
const userAuth = require("../middleware/authMiddleWare");
const User = require("../models/userModel");
const trimObjectValues = require("../helper/TrimObjValues");
const validate = require("validator");
const bcrypt = require("bcrypt");

// profile api

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const { user } = req;
    // console.log(user) ;
    res.send(user);
  } catch (err) {
    res.status(400).json({ sucess: false, message: err.message });
  }
});

// profile /edit api

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    req.body = trimObjectValues(req?.body);
    await validateForUpdateUser(req);
    const user = req?.user;
    console.log(user);
    const {
      firstName,
      lastName,
      gender,
      dateOfBirth,
      location,
      interests,
      profilePicture,
      bio,
    } = req?.body;
    const UpdateUser = {
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      dateOfBirth: dateOfBirth,
      location: location,
      interests: interests,
      profilePicture: profilePicture,
      bio: bio,
    };
    const dbuser = await User.findByIdAndUpdate({ _id: user._id }, UpdateUser, {
      runValidators: true,
      new: true,
    });
    console.log(dbuser);
    res.status(200).json({
      success: true,
      message: `${dbuser.firstName} , your profile is now Updated 👌`,
      data: dbuser,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ sucess: false, message: err.message });
  }
});

// profile /password api

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    req.body = trimObjectValues(req?.body);
    const { oldPassword, newPassword } = req?.body;
    const isOldPasswordMatched = await req?.user.validatePassword(oldPassword);

    if (!isOldPasswordMatched) {
      throw new Error("invalid credentials ");
    }
    if (
      !validate.isStrongPassword(newPassword) ||
      newPassword === oldPassword
    ) {
      throw new Error(
        "Enter Strong password or old Password is similar to new password "
      );
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    // console.log(passwordHash) ;
    const updatedPasswordUser = await User.findByIdAndUpdate(
      { _id: req?.user?._id },
      { password: passwordHash },
      { runValidators: true }
    );
    res
      .status(200)
      .json({
        message: `${req?.user?.firstName} , your password is successfully changed!`,
        success: true,
      });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message, success: false });
  }
});


module.exports = profileRouter;
