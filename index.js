const EXPRESS = require('express')
const APP = EXPRESS()
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

APP.get('/', (req, res) => {
  res.sendFile(__dirname + '/routes/tchat/tchat.html')
});

APP.use(EXPRESS.static(__dirname + '/routes/tchat'))

IO.on('connection', (socket) => {
  console.log('a user connected')
  socket.on('disconnect', () => {
      console.log('a user disconnect')
  })
});

IO.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
        console.log('Message ' + msg)
        IO.emit('chat message', msg)
    });
  });

HTTP.listen(3000, () => {
  console.log('listening on *:3000')
})