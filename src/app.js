const express = require("express");
require("dotenv").config();
const dbConnect = require("./dbConnection");
const cookieParser = require("cookie-parser");


const app = express();
app.use(express.json());
app.use(cookieParser());

// importing routers 

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");

app.use("/" , authRouter) ;
app.use("/" , profileRouter);








dbConnect().then(()=>{
    console.log("dataBase connected done..👌") ;
    app.listen(5000, () => {

        console.log("server is on.. http://localhost:5000");
      });
}).catch((err)=>{
console.log("Failed TO connect Db OR to start Server 😒"+err) ;
})

