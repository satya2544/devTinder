const express = require('express');
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const { validateSignUpData } = require("../utils/validation");
authRouter.post("/signup", async(req, res) => {
    
    try{
        validateSignUpData(req);

        const { firstName,lastName,emailId,password } = req.body;
        
        const passwordHash = await bcrypt.hash(password, 10);

        const user = new User({
            firstName,lastName,emailId,password: passwordHash,
        });
     const savesUser = await user.save();
     
     const token = await savesUser.getJWT();
       console.log(token)
       res.cookie("token", token)
    //    res.send(user);



        res.json({message: "user added successfully!", data: savesUser })
    }
    catch (err) {
        res.status(400).send("Error : " + err.message)
    }

  

})

authRouter.post("/login", async(req,res) => {
    try {

        const { emailId, password } = req.body;

        const user = await User.findOne({emailId : emailId});

        if (!user) {
            throw new Error("Invalid Credentials")
        }

        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid){

          const token = await user.getJWT();
          console.log(token)





            res.cookie("token", token)
            res.send(user);
        }else {
            throw new Error("Invalid Credentials")
        }

    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})
authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
    });
    res.send("Logout Sucessfull");
})

module.exports = authRouter;