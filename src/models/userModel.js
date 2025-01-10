const { Schema, model } = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken") ;
const bcrypt  = require("bcrypt") ;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      index:true,
      required: true,
      maxLength: 20,
      lowercase: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxLength: 20,
      lowercase: true,
      trim: true,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 40,
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: "invalid email try something else :( ",
      },
    },
    password: {
      type: String,
      minLength: 8,
      maxLength: 100,
      validate: {
        validator: (value) =>
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(value),
        message:
          "password must contain atleast one lowercase , one uppercase and one symbol",
      },
      trim: true,
      required: true,
      select:false,
    },
    dateOfBirth: {
      type: Date,
      validate: {
        validator: function (value) {
          const today = new Date();
          const minAge = 18;
          const BirthDate = new Date(value);

          if (BirthDate >= today) {
            return false;
          }

          const age = today.getFullYear() - BirthDate.getFullYear();

          return age >= 18 ? true : false;
        },
        message:
          "Birth date must be in the past , and you must be an adult (i.e age >= 18 )",
      },
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: ["Male", "Female", "Others"],
        message:
          "invalid Gender . Allowed values for Gender are Male , Female and Others",
      },
    },

    location: {
      type: String,
      maxLength: 50,
      lowercase: true,
    },
    interests: {
      type: [String],
      default: [],
      lowercase: true,
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "too many interest added there can be only max 10 :( ",
      },
    },
    profilePicture: {
      type: String,
      default:
        "https://prince.info.np/static/media/prince.71204db128ccdbebba5c.png",
      validate: {
        validator: function (value) {
          const imageExtensions = /\.(jpg|jpeg|png|gif|webp)$/i;
          return imageExtensions.test(value) && validator.isURL(value);
        },
        message: "invalid photo url",
      },
    },
    bio: {
      type: String,
      default: "This is default bio",
      trim: true,
      maxLength: 100,
    },
    blockedUsers: {
      type: [Schema.Types.ObjectId],
      unique:true,
      ref:"User",
      default: [],
    },
    matches: {

      type: [Schema.Types.ObjectId],
      ref: "User", 
      default: [],
    },
  },
  { timestamps: true }
);

UserSchema.methods.getJWT =  async function(){
  const user = this  ;
  const token =await jwt.sign({_id : user._id}, process.env.JWT_SECRET,{expiresIn:"7d"}) ;
  return token ;
}

UserSchema.methods.validatePassword = async function(password){
  const user = this  ;
  const IsPassword =  await bcrypt.compare(password , user.password) ;
  return IsPassword ;
}


module.exports = model("User", UserSchema);
