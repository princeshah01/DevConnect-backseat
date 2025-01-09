const express = require("express");

const profileRouter = express.Router();
const validateForUpdateUser = require("../helper/ValidationForEditProfile");
const userAuth = require("../middleware/auth");
const User = require("../models/user");
const trimObjectValues = require("../helper/TrimObjValues");

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
    req.body = trimObjectValues(req?.body) ;
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
    res.send("updating done");
  } catch (err) {
    console.log(err);
    res.status(400).json({sucess:false , message : err.message});
  }
});

//

module.exports = profileRouter;
