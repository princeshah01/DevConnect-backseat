const express = require("express") ;
const userRouter = express.Router(); 
const userAuth = require("../middleware/auth");


// API GOES HERE .. 
userRouter.get("/user/Connections", userAuth ,async(req,res)=>{

    try{
        const loggedInUser = req?.user;
        
    }
    catch(err){

    }
})


module.exports = userRouter ;
