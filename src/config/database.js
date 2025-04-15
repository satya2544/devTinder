const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://kspsatyakoppolu:Satya2544@tinder.wlud5.mongodb.net/");

};

module.exports = connectDB;
