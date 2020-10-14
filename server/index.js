const EXPRESS = require('express');
const APP = EXPRESS();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);
const PATH = require('path')
//Mongoose for DB
const MONGOOSE = require('mongoose')
//For user 
const USER = require('../models/user')
const BCRYPT = require('bcrypt')
const SALTROUNDS = 10

const userModel = require('../models/user');
const userRoutes = require('../routes/user');

// APP.use('/', userRoutes);

APP.use(EXPRESS.static(__dirname + '../public/'));

HTTP.listen(3000);

console.log('Server is listening on http://localhost:3000');

//Routes
APP.get('/', (req, res) => {
        res.sendFile('login.html', { root: PATH.join(__dirname, '/../public/') });
})

APP.get('/register', (req, res) => {
        res.sendFile('register.html', { root: PATH.join(__dirname, '/../public/') });

})


//DATABASE
APP.use(EXPRESS.urlencoded())
APP.use(EXPRESS.json())


MONGOOSE.set('useNewUrlParser', true)
MONGOOSE.set('useUnifiedTopology', true)
MONGOOSE.connect('mongodb+srv://superuser:motdepasse@cluster0.bihgx.mongodb.net/users?retryWrites=true&w=majority')
        .then(() => {
                console.log('Successfully connected to MongoDB Atlas!');
        })
        .catch((error) => {
                console.log('Unable to connect to MongoDB Atlas!');
                console.error(error);
        });


//SOCKET
const users = {};
const typers = {}

IO.on('connection', socket => {
        console.log('connected...');

        socket.on('user connected', payload => {
                users[socket.id] = {
                        id: socket.id,
                        name: payload.name,
                        avatar: payload.avatar
                };

                socket.broadcast.emit('user connected', users[socket.id]);
        });

        socket.on('user typing', () => {
                typers[socket.id] = 1;

                socket.broadcast.emit('user typing', {
                        user: users[socket.id].name,
                        typers: Object.keys(typers).length
                });
        });

        socket.on('user stopped typing', () => {
                delete typers[socket.id];

                socket.broadcast.emit('user stopped typing', Object.keys(typers).length);
        });

        socket.on('send message', payload => {
                delete typers[socket.id];

                socket.broadcast.emit('send message', {
                        user: payload.user,
                        message: payload.message,
                        typers: Object.keys(typers).length
                });
        });
});
