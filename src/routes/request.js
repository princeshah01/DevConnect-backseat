const express = require("express") ;
const userAuth = require("../middleware/auth");
const ConnectionRequest = require("../models/Connection");
const User = require("../models/user");

const requestRouter = express.Router() ;


// API here .
requestRouter.post("/request/send/:status/:toUserId" , userAuth , async(req,res)=>{
    try {
        const fromUserId = req.user._id ;
        const { toUserId , status} = req?.params;
     
        const acceptedStatus = ["ignored" , "interested"];
        if(!acceptedStatus.includes(status)){
            throw new Error (`${status} request is invalid 😶`);
        }
        const existingUser = await User.findById({_id : toUserId});
        if(!existingUser){
            throw new Error("User doesn't exist.😞");
        }
        const  existingConnectionRequest = await ConnectionRequest.findOne({$or:[{fromUserId , toUserId},{fromUserId:toUserId , toUserId:fromUserId }]});
        if(existingConnectionRequest){
            throw new Error("Request already exist 😠");
        }
        const newRequest = new ConnectionRequest({
            fromUserId , 
            toUserId ,
            status,
        });
        await newRequest.save() ;
        res.status(200).json({success:true , message : (status==="ignored")?`you ignored ${existingUser.firstName} 😒`: `you are interested in ${existingUser.firstName} 👀`});
      



    }catch (err){
        console.log(err);
        res.status(400).json({success:false , message :"FAILED : "+err.message });
    }
});





module.exports = requestRouter ;
