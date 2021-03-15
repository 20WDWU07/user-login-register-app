const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username:String,
    password:String,
    phone:Number
}) ;

//add a hash and salt field to our Schema in order to store the hashed password and the salt value.
UserSchema.plugin(passportLocalMongoose); 

module.exports = mongoose.model("User",UserSchema);