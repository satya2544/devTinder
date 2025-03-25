// const http = require("http");

// const server = http.createServer(function (req,res) {
//     res.end("hello world")
// });

// server.listen(7777);










// function isPrime(num, callback) {
//     if (num <= 1) {
//         callback(false);
//         return;
//     }
//     for (let i = 2; i <= Math.sqrt(num); i++){
//         if (num % i === 0) {
//             callback(false);
//             return
//         }
//     }
//     callback(true)
// }


// function handlePrimeResult(isPrimeNumber){
//     if (isPrimeNumber){
//         console.log("prime")
//     }else{
//         console.log("not prime")
//     }
// }

// const number = 8;
// isPrime(number, handlePrimeResult)

const express = require("express");

const app = express();
app.use("/test", (req,res) => {

    res.send("Hello from the server")
})
app.use("/hello", (req,res) => {

    res.send("Hello hello")
})
app.use("/satya", (req,res) => {

    res.send("Hello satya,..........")
})

app.listen(3000, ()=> {
    console.log("Server is successfully listening on port")
});