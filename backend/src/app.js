const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const cors = require('cors')
app.use(cors());

const io = require("socket.io")(server,{
    cors: true,
    origin: ['*']
})
app.set('socketio', io);
app.use('/public', express.static(__dirname + '/public'));
let bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
const mongoose = require('mongoose')

const users = require('./routes/users')
const massages = require('./routes/massages')
const reservations = require('./routes/reservations')
const employes = require('./routes/employes')
const expressJWT = require('express-jwt');
require('dotenv').config();

const secret = process.env.SECRET_TOKEN;

mongoose
.connect('mongodb://localhost/mongo-planning')
.then(() => console.log('connected to MongoDb'))
.catch((err => console.error('could not connect to mongoDb', err)))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(expressJWT({ secret: secret, algorithms: ['HS256'] })
    .unless(
        { path: [
            /^\/api\/users\/signIn/,
            /^\/api\/users\/signUp/,
            /^\/api\/users\/checkToken\/.*/,
            /^\/api\/employes\/.*/
        ]}
    )  
);

io.on('connection', (socket) => {
    console.log('a user connected');
  });

//route
app.use('/api/users', users);
app.use('/api/massages',massages)
app.use('/api/reservations',reservations)
app.use('/api/employes',employes)
server.listen(parseInt(process.env.PORT), () => console.log(`listen on port ${process.env.PORT}`))