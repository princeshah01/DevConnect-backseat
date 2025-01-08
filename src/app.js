const express = require("express");
const app = express();
require("dotenv").config() ;
const dbConnect = require("./dbConnection.js") ;



app.get("/test" , (req,res)=>{
    res.send("this is form test api ") ;
})

app.post("/hello" , (req,res,next)=>{
    res.send("this  is from hello api post ") ;
})

app.patch("/" , (req,res)=>{
    res.send("from server") ;
})


dbConnect().then(()=>{
    console.log("dataBase connected done..👌") ;
    app.listen(5000, () => {

        console.log("server is on.. http://localhost:5000");
      });
}).catch((err)=>{
console.log("Failed TO connect Db OR to start Server 😒"+err.message) ;
})

