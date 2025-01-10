const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req?.cookies;
    // console.log(token) ;
    if (!token) {
      return res
        .status(400)
        .json({ success: false, message: "please login and try again" });
    }
    const tokenDecode = await jwt.verify(token, process.env.jwt_SECRET);
    const { _id } = tokenDecode;
    // console.log(_id)
    const UserProfile = await User.findById(_id);
    if (!UserProfile) {
      throw new Error("User not Found");
    }
    req.user = UserProfile;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = userAuth;
