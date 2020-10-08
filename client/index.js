const http = require('http');
const socket = require('socket.io');

const server = http.createServer();
const io = socket(server);


io.on('connection', socket => {
    console.log('A new user has joined the chat')
  
    socket.emit('message', 'You have successfully joined the chat')
    
    socket.on('message', (msg) => {
        io.emit('message', msg)
    })
})


server.listen(8080, () => console.log(`Server Running`))