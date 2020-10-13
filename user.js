// const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");
// let UserSchema = new mongoose.Schema({
//     username:String,
//     password:String
// }) ;
// UserSchema.plugin(passportLocalMongoose);
// module.exports = mongoose.model("User",UserSchema);

const mongoose = require("mongoose");

let UserSchema = new mongoose.Schema({
    username : String,
    password: String
})
const USER = mongoose.model("userSchema", UserSchema)
module.exports = USER