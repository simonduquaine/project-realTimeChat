const EXPRESS = require('express')
const APP = EXPRESS()
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

// const MONGOOSE = require('mongoose')

// // Bodyparser pour convertir les données en json
// const BODYPARSER = require('body-parser')

// APP.use(BODYPARSER.json())

// //require les données json
// require('./models/user')(APP)

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