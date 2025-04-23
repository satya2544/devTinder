
const express = require("express");


const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const connectDB = require('./config/database');
require("./config/database");

const app = express();

app.use(cors({
  origin:"http://localhost:5173",
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json())
app.use(cookieParser())

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const initializeSocket = require("./utils/socket");

app.use("/", chatRouter);


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);


// app.get("/user", async(req,res)=>{
//     const userEmail = req.body.emailId;
//     try{
//         const user = await User.find({ emailId: userEmail});
//         if(user.length === 0){
//             res.status(404).send("user not found")
//         }else{
//             res.send(user);
//         }
       
//     }
//     catch (err) {
//        res.status(400).send("Somthing went wrong")
//     }
// })

// app.get("/feed", async (req, res)=>{
//  try {
//     const user = await User.find({});
//     res.send(user);
//  }
//  catch (err) {
//     res.status(400).send("something went wrong")
//  }
// });

// app.delete("/user", async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         // const user = await User.findByIdAndDelete({_id: userId});
//         const user = await User.findByIdAndDelete(userId);
//         res.send("User deleted successfully");

//     } catch (err) {
//         res.status(400).send("Something went wrong")
//     }
// })
// app.patch("/user/:userId", async (req, res) => {
//     const userId = req.params?.userId;
//     const data = req.body;


//    try {
//     const ALLOWED_UPDATES = 
//     ["userId","skills","photoUrl", "about", "gender","age"];

//     const isUpdateAllowed = Object.keys(data).every((k)=>
//     ALLOWED_UPDATES.includes(k)
//  );
//  if(!isUpdateAllowed) {
//     throw new Error("Update not allowed")
//  } 
//  if(data?.skills.length > 10){
//     throw new Error("skills cannot be more then 10")
//  }
//     const user = await User.findByIdAndUpdate(userId, data, {
    
//       new:true,
//       runValidators: true,
      
//     });
//     console.log(user)
//     res.send("user updated")
    
   
//   } catch (err) {
//     console.log(err)
//     res.status(400).send("Something went wrong " + err.message);
//   }
// })

const server = http.createServer(app);

initializeSocket(server);

connectDB().then(() => {
    console.log("data base connection success")
    server.listen(3009, ()=> {
        console.log("Server is successfully listening on port")
    });
  }).catch((err)=>{
    console.error("data base cannot be connected")
  })

