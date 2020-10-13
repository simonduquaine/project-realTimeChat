const EXPRESS = require('express')
const APP = EXPRESS()
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

const MONGOOSE = require('mongoose')
//DB model
const USER = require('./user')

const BODYPARSER = require('body-parser');

//DATABASE
APP.use(BODYPARSER.json())
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

//ROUTES
APP.get('/', (req, res) => {
  res.sendFile(__dirname + '/tchat.html')
});

APP.get('/login', (req, res) => {// const mongoose = require("mongoose");

  res.sendFile(__dirname + '/login.html')
})

APP.get('/register', (req, res) => {
  res.sendFile(__dirname + '/register.html')
})

APP.post('/register', async (req, res)=> {
  const user = new USER(req.body)

  try{
    await user.save()
    res.send(user)
  } catch(err){
    res.status(500).send(err)
  }
 
})


APP.use(EXPRESS.static(__dirname + 'tchat'))

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