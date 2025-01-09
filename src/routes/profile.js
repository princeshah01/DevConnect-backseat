const express = require("express") ;

const profileRouter = express.Router() ;

const  userAuth = require("../middleware/auth") ;

// profile api

profileRouter.get("/profile/view", userAuth , async(req,res)=>{

    try{

        const {user} = req ;
        // console.log(user) ;
        res.send(user);
    }catch(err){
        res.status(400).json({sucess:false , message:err.message}) ;
    }


});

module.exports = profileRouter ;