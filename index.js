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
const EJS = require('ejs')
// Bodyparser pour convertir les données en json
const BODYPARSER = require('body-parser');
const user = require('./models/user');

//DATABASE
APP.use(BODYPARSER.json())
APP.set("view engine", "ejs")

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


APP.use(PASSPORT.initialize())
APP.use(PASSPORT.session())

// PASSPORT.use(new LOCAL_STRATEGY(User.authenticate()))
// PASSPORT.serializeUser(User.serializeUser())
// PASSPORT.deserializeUser(User.deserializeUser())



let isLogged = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}


//ROUTES
APP.get('/', isLogged, (req, res) => {
  res.sendFile(__dirname + '/routes/tchat/tchat.html')
});

APP.get('/login', (req, res) => {
  res.sendFile(__dirname + '/routes/login/login.html')
})

APP.get('/register', (req, res) => {
  res.sendFile(__dirname + '/routes/login/register.html')
})

APP.post('/register', (req, res)=> {
  let username = req.body.username
  let password = req.body.password
  USER.register(new USER({username: username}),
    password, (err, USER) => {
      if(err){
        console.log(err)
        return res.render('register')
      }

      PASSPORT.authenticate('local')(
        req, res, () => {
          res.render('secret')
        }
      )
    })
})

APP.post('/login', PASSPORT.authenticate('local', {
  successRedirect: '/tchat',
  failureRedirect: '/login'
}), (req, res) => {

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