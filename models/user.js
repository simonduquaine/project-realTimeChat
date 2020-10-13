const mongoose = require('mongoose');
const mongooseUniqueValidator = require('mongoose-unique-validator');

let UserAccount = new mongoose.Schema({
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true }
});

UserAccount.plugin(mongooseUniqueValidator);

module.exports = mongoose.model("User", UserAccount);