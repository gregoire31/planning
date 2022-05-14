let bodyParser = require('body-parser')
const express = require('express')
const cors = require('cors')
const http = require('http');
const mongoose = require('mongoose')
const expressJWT = require('express-jwt');
const app = express()
const server = http.createServer(app);
const dotenv = require('dotenv');
dotenv.config();
require('dotenv').config();

app.use(cors());
app.use('/public', express.static(__dirname + '/public'));
app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const io = require("socket.io")(server,{
    cors: true,
    origin: ['*']
})

app.set('socketio', io);

const users = require('./routes/users')
const massages = require('./routes/massages')
const reservations = require('./routes/reservations')
const employes = require('./routes/employes')

const secret = process.env.SECRET_TOKEN;

mongoose
.connect(`mongodb://${process.env.DATABASE_HOST}/mongo-planning`)
.then(() => console.log('connected to MongoDb'))
.catch((err => console.error('could not connect to mongoDb', err)))



app.use(expressJWT({ secret: secret, algorithms: ['HS256'] })
    .unless(
        { path: [
            /^\/api\/users\/signIn/,
            /^\/api\/users\/signUp/,
            /^\/api\/users\/checkToken\/.*/,
            /^\/api\/employes\/.*/,
            /^\/public\/.*/
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