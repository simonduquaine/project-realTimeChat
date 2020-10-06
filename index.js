const APP = require('express')();
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/routes/tchat/tchat.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
      console.log('a user disconnect')
  })
});

io.on('connection', (socket) => {
    socket.on('chat message', (msg) => {
      io.emit('chat message', msg);
    });
  });

http.listen((000, () => {
  console.log('listening on *:3000');
});