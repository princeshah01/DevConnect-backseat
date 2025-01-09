const express = require("express") ;

const authRouter = express.Router() ;
const User = require("../models/user") ;
const validateSignUp = require("../helper/ValidationForSignUp")
const validateLogIn = require("../helper/ValidationForLogin") ;
const bcrypt = require("bcrypt");


//  signup api

authRouter.post("/signup", async (req, res) => {
    try {
        await validateSignUp(req);

        const { firstName, lastName, emailId, password, gender, dateOfBirth } =
            req.body;
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmailId = emailId.trim();
        const trimmedPassword = password.trim();
        const trimmedGender = gender.trim();
        const trimmedDateOfBirth = dateOfBirth.trim();
        const passwordHash = await bcrypt.hash(trimmedPassword, 10);
        const newUser = new User({
            firstName: trimmedFirstName,
            lastName: trimmedLastName,
            emailId: trimmedEmailId,
            password: passwordHash,
            gender: trimmedGender,
            dateOfBirth: trimmedDateOfBirth,
        });
        await newUser.save();
        res.status(201).json({ success: true, message: "User registered successfully!" });
    } catch (err) {
        console.error("Error during signup:", err);
        res.status(400).json({ success: false, message: err.message });
    }
});

// login api 

authRouter.post("/login", async (req,res)=>{

    try{
        validateLogIn(req) ;
        const {emailId , password } = req?.body ;
        const user = await User.findOne({emailId : emailId}) ;
        if (!user){
            throw new Error("Invalid credintials") ;
        }
        const  comparePass = await user.validatePassword(password) ;
        if(!comparePass){
            throw new Error("invalid credintials") ;
        }
        const token =await user.getJWT();
        console.log(token) ;
        res.cookie("token", token ) ;
        res.send({success: true, message: "log in Sucessfully !"}) ;

    }
    catch(err){
        res.status(400).json({success: false, message: err.message});
    }


});

authRouter.post("/logout" , async(req,res)=>{
    try{

        // const {token}  = req?.cookies ;
        // console.log(token) ; 
        res.cookie("token" , null , {
            expires:new Date(Date.now()),
        })
        res.status(200).json({success:true , message :"logout successfully"}) ;
    }
    catch(err){
        res.status(400).json({success:false , message:"Logout failed ! Try again"}) ;
    }
})

module.exports = authRouter ;