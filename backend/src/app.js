const express = require('express')
const app = express()
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server,{
    cors: true,
    origin: ['*']
})
app.set('socketio', io);

const bodyParser = require('body-parser')
const cors = require('cors')
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
app.use(cors());


app.use(expressJWT({ secret: secret, algorithms: ['HS256'] })
    .unless(
        { path: [
            /^\/api\/users\/signIn/,
            /^\/api\/users\/signUp/,
            /^\/api\/users\/checkToken\/.*/
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