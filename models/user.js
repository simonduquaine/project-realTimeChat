const MONGOOSE = require('mongoose')
module.exports = () => {
    const UserSchema = MONGOOSE.Schema({
        username: {type: String},
        password: {type: String},
    });
   
    return MONGOOSE.model('Users', UserSchema);
   }