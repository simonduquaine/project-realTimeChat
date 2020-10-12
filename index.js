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

//DATABASE
APP.use(BODYPARSER.json())
APP.use(EXPRESS.json())
APP.set("view engine", "ejs")

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

APP.use(require('express-session')({
  secret:"PHP is bad",
  resave: false,
  saveUninitialized: false
}))


APP.use(PASSPORT.initialize())
APP.use(PASSPORT.session())

PASSPORT.use(new LOCAL_STRATEGY(USER.authenticate()))
PASSPORT.serializeUser(USER.serializeUser())
PASSPORT.deserializeUser(USER.deserializeUser())



let isLogged = (req, res, next) => {
  if (req.isAuthenticated()) return next()
  res.redirect('/login')
}

APP.set('views', __dirname + '/views/login/');
//ROUTES
APP.get('/', isLogged, (req, res) => {
  res.sendFile(__dirname + '/views/tchat/tchat.html')
});

APP.get('/login', (req, res) => {
  res.sendFile(__dirname + '/views/login/login.html')
})

APP.get('/register', (req, res) => {
  res.sendFile(__dirname + '/views/login/register.html')
})

APP.post('/register', async (req, res)=> {
  const user = new USER(req.body)

  try{
    await user.save()
    res.send(user)
  } catch(err){
    res.status(500).send(err)
  }
  // USER.register(new USER({username: username}),
  //   password, (err, USER) => {
  //     if(err){
  //       console.log(err)
  //       return res.sendFile(__dirname + '/views/login/register.html')

  //     }

  //     PASSPORT.authenticate('local')(
  //       req, res, () => {
  //         return res.sendFile(__dirname + '/views/login/login.html')
  //       }
  //     )
  //   })
})

APP.post('/login', PASSPORT.authenticate('local', {
  successRedirect: '/tchat',
  failureRedirect: '/login'
}), (req, res) => {

})

APP.use(EXPRESS.static(__dirname + '/views/tchat'))

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