const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase:true,
        required: true,
        unique: true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid email adress" + value)
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if(!validator.isStrongPassword(value)){
                throw new Error("password not valid" + value)
            }
        },
    },
    age: {
        type: Number,
        min:18,
    },
    gender: {
        type: String,
        enum: {
          values: ["male", "female", "other"],
          message: `{VALUE} is not a valid gender type`,
        },
        // validate(value) {
        //     if(!["male","female","others"].includes(value)){
        //        throw new Error("Gender data is not valid")
        //     }
        // }
    },
    photoUrl: {
        type: String,
        default:"https://static.vecteezy.com/system/resources/thumbnails/024/346/414/small_2x/3d-cartoon-businessman-on-transparent-background-generative-ai-png.png",
        validate(value) {
            if(!validator.isURL(value)){
                throw new Error("Invalid photo Url" + value)
            }
        },
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },

},
{
    timestamps: true,
}
);

userSchema.methods.getJWT = async function () {
    const user = this;

    const token = await jwt.sign({_id: user._id}, "Satya@2544", {
        expiresIn: "7d",
    });
    return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
     const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

     return isPasswordValid;
}


module.exports= mongoose.model("User", userSchema);
