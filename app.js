const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userModel = require('./models/user');
const userRoutes = require('./routes/user');

app.use(express.urlencoded());
app.use(express.json());

mongoose.connect("mongodb+srv://sim:a1z2e3r4@mydb.lvrqq.mongodb.net/myapp?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
});



app.use('/register', userRoutes);
app.use('/login', userRoutes);

app.use(express.static(__dirname + '/public/'));



app.listen(3000, function () {
        console.log("server is running on port 3000");
})

module.exports = app;