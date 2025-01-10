const express = require("express");
require("dotenv").config();
const dbConnect = require("./dbConnection");
const cookieParser = require("cookie-parser");
const app = express();
app.set('view engine', 'ejs'); 
app.set('views', './views'); 

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// importing routers 

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request"); 


// using routers 
app.use("/" , authRouter) ;
app.use("/" , profileRouter);
app.use("/" , requestRouter)
app.use("/", userRouter);



dbConnect().then(()=>{
    console.log("dataBase connected done..👌") ;
    app.listen(5000, () => {

        console.log("server is on.. http://localhost:5000");
      });
}).catch((err)=>{
console.log("Failed TO connect Db OR to start Server 😒"+err) ;
})

