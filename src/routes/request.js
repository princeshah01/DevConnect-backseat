const express = require("express") ;
const userAuth = require("../middleware/authMiddleWare");
const ConnectionRequest = require("../models/Connection");
const User = require("../models/userModel");
const { connection } = require("mongoose");

const requestRouter = express.Router() ;


// API here .
// sending request API 
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

// reviewing Request API 

requestRouter.post("/request/review/:status/:requestId",userAuth , async(req,res)=>{

    try {
        const {status , requestId} = req?.params ;
        const loggedInUser = req.user;
        const allowedStatus = ["accepted" , "rejected"];
        if(!allowedStatus.includes(status)){
            throw new Error(`${status} is not allowed .`)
        }
        const connectionReq = await ConnectionRequest.findOne({_id:requestId , toUserId : loggedInUser._id , status:"interested" ,});
        if(!connectionReq){
            throw new Error("Connection Request doesn't Exist");
        } 
        connectionReq.status = status ;

        // saving the matched user data to user object

        if(status === "accepted"){
           const loggedUserData = await User.findById({_id:loggedInUser._id});
           const fromUserData = await User.findById(connectionReq.fromUserId);
           if(!loggedUserData.matches.includes(connectionReq.fromUserId)){
            loggedUserData.matches.push(connectionReq.fromUserId);
            fromUserData.matches.push(connectionReq.toUserId);
            await loggedUserData.save();
            await fromUserData.save();


           }
        }


        const updatedConnectionReq = await connectionReq.save();
        
        res.status(200).json({
            success:true ,
            message: `Connection request ${status}` ,
            data : updatedConnectionReq ,
        })
        
    } catch (err) {
            console.log(err);
            res.status(400).json({success:false , message : err.message}); 

    }

})






module.exports = requestRouter ;
