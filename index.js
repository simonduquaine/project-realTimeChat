const EXPRESS = require('express')
const APP = EXPRESS()
const HTTP = require('http').createServer(APP);
const IO = require('socket.io')(HTTP);
const MONGOOSE = require('mongoose')
const USER = require('./models/user')
const BCRYPT = require('bcrypt')
const saltRounds = 10;


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

APP.use(require('express-session')({
        secret: "PHP is bad",
        resave: false,
        saveUninitialized: false
}))

APP.set('views', __dirname + '/views/login/');
//ROUTES
APP.get('/', (req, res) => {
        res.sendFile(__dirname + '/views/tchat/tchat.html')
});

APP.get('/login', (req, res) => {
        res.sendFile(__dirname + '/views/login/login.html')
})

APP.get('/register', (req, res) => {
        res.sendFile(__dirname + '/views/login/register.html')
})

APP.post('/register', async (req, res) => {
        const user = new USER(req.body)

        const HASH = BCRYPT.hashSync(user.password, saltRounds);
        user.password = HASH;

        try {
                await user.save()
                res.send(user)
        } catch (err) {
                res.status(500).send(err)
        }
})

// APP.post('/login', PASSPORT.authenticate('local', {
//         successRedirect: '/tchat',
//         failureRedirect: '/login'
// }), (req, res) => {

// })

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