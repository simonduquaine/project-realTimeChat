const EXPRESS = require('express')
const APP = EXPRESS()
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);
//Login/register package
const PASSPORT = require('passport')
const LOCAL_STRATEGY = require('passport-local')
const PASSPORT_LOCAL_MONGOOSE = require('passport-local-mongoose')
//For the DB
const MONGOOSE = require('mongoose')
//DB model
const USER = require('./models/user')
// Bodyparser pour convertir les données en json
const BODYPARSER = require('body-parser');
const passport = require('passport');

//DATABASE
APP.use(BODYPARSER.json())

MONGOOSE.set('useNewUrlParser', true)
MONGOOSE.set('useUnifiedTopology', true)
MONGOOSE.connect('mongodb+srv://superuser:motdepasse@cluster0.bihgx.mongodb.net/Cluster0?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

APP.use(require('express-session')({
  secret:"PHP is bad",
  resave: false,
  saveUninitialized: false
}))

APP.use(passport.initialize())
APP.use(passport.session())

passport.use(new LOCAL_STRATEGY(USER.authenticate()))
passport.serializeUser(USER.serializeUser())
passport.deserializeUser(USER.deserializeUser())

//Routes
APP.get('/', (req, res) => {
  res.sendFile(__dirname + '/routes/tchat/tchat.html')
});

// condition si connecté ou pas pour redirigé ici
APP.get('/login', (req, res) => {
  res.sendFile(__dirname + '/routes/login/login.html')
})

APP.use(EXPRESS.static(__dirname + '/routes/tchat'))

//Socket io connection et interaction
IO.on('connect', (socket) => {
  console.log('a user connected')
  socket.on('new-user', data => {
    IO.emit('new-user', data)
  })
  socket.on('chat message', (msg) => {
    console.log('Message ' + msg)
    IO.emit('chat message', msg)
});

  socket.on('disconnect', (msg) => {
      console.log('a user disconnect')
  })
});


//server
HTTP.listen(3000, () => {
  console.log('listening on *:3000')
})