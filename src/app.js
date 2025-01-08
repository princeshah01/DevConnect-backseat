const express = require("express");
const app = express();

app.get("/test" , (req,res)=>{
    res.send("this is form test api ") ;
})

app.get("/hello" , (req,res)=>{
    res.send("this  is from hello api ") ;
})

app.use("/" , (req,res)=>{
    res.send("from server") ;
})



app.listen(5000, () => {
  console.log("server is on.. http://localhost:5000");
});
