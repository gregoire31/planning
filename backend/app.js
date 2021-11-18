const express = require('express')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const users = require('./routes/users')
const massages = require('./routes/massages')
const reservations = require('./routes/reservations')
const expressJWT = require('express-jwt');
let secret = 'some_secret';

mongoose
.connect('mongodb://localhost/mongo-planning')
.then(() => console.log('connected to MongoDb'))
.catch((err => console.error('could not connect to mongoDb', err)))

app.use(express.static(path.join(__dirname,'public')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.use(expressJWT({ secret: secret, algorithms: ['HS256'] })
    .unless(
        { path: [
            /^\/api\/users\/signIn/,
            '/api/users/signUp',
            /^\/api\/users\/checkToken\/.*/
        ]}
    )  
);

//route
app.use('/api/users', users);
app.use('/api/massages',massages)
app.use('/api/reservations',reservations)
app.listen(3000, () => console.log('listen on port 3000'))