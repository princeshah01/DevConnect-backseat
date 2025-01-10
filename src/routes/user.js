const express = require("express");
const userRouter = express.Router();
const userAuth = require("../middleware/authMiddleWare");
const ConnectionRequest = require("../models/Connection");
const User = require("../models/userModel");
// API GOES HERE ..
userRouter.get("/user/matches", userAuth ,async(req,res)=>{

    try{
        const loggedInUser = req?.user;
        // console.log(loggedInUser);
        const matchedUser = await User.findById(loggedInUser._id).populate("blockedUsers","firstName lastName profilePicture bio gender ");
        console.log(matchedUser) ;
        res.send("hi");
    }
    catch(err){

    }
});

//view all requests -- API

userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    const requestFromUsers = await ConnectionRequest.find({
      toUserId: loggedInUser,
      status: "interested",
    }).populate("fromUserId", [
      "firstName",
      "lastName",
      "profilePicture",
      "gender",
      "interests",
      "bio"
    ]);
    // console.log(requestFromUsers);
    res
      .status(200)
      .json({
        success: true,
        message: "data fetched successfully",
        data: requestFromUsers,
      });
  } catch (err) {
    req.status(400).json({ success: false, message: err.message });
  }
});

module.exports = userRouter;
