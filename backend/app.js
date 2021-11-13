const express = require('express')
const path = require('path')
const app = express()
const  bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const users = require('./routes/users')
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
            '/api/users/signIn',
            '/api/users/signUp'
        ]}
    )  
);

//route
app.use('/api/users', users);

// app.get('/getCourses', async(req,res) => {
//     const getAllCourses = await findAllCourses()
//     console.log(getAllCourses)
//     res.json(getAllCourses)
// })

// app.get('/oneCourse/:id',async(req,res)=> {
//     const getSpecificCourse = await getCourse(req.params.id)
//     console.log(getSpecificCourse)
//     res.json(getSpecificCourse)
// })

// app.post('/connect',async(req,res)=> {
//     console.log(req.body)
//     const users = await connectUser(req.body)
//     console.log(users)

//     // const getSpecificCourse = await getCourse(req.params.id)
//     // console.log(getSpecificCourse)
//     res.json(users)
// })




// const courseSchema = new mongoose.Schema({
//     tags: [ String ],
//     date: { type: Date, default : Date.now() },
//     name: String,
//     author: String,
//     isPublished: Boolean,
//     price: Number,
//     __v: Number
// })

// const userSchema = new mongoose.Schema({
//     nom : String,
//     prenom : String,
//     adresse : String,
//     email: String,
//     numeroTelephone: String,
//     password : String,
//     date: { type: Date, default : Date.now() },
// })

// const User = mongoose.model('User',userSchema);

// async function findAllUsers(){
//     return await User.find()
// }

// async function connectUser(credentials){
//     console.log(credentials)
//     return await User.find({
//         email : credentials.username,
//         password: credentials.password
//     })
// }


// mongoose.connect('mongodb://localhost/mongo-exercises');

// const courseSchema = new mongoose.Schema({
//   name: String,
//   author: String, 
//   tags: [ String ],
//   date: Date, 
//   isPublished: Boolean,
//   price: Number
// });

// const Course = mongoose.model('Course', courseSchema);

// const Course = mongoose.model('Course',courseSchema);
// async function findAllCourses(){
//     const Courses = await Course
//     .find({
//         isPublished:true
//     })
//     // .or([
//     //     {price : {$gte:15}},
//     //     {name: /.*by.*/i},
//     // ]
    
//     // ).sort({price : -1}).select({
//     //     name : 1, author : 1, price : 1
//     // })
//     return(Courses)
// }

// async function getCourse(id){
//     return await Course
//     .findById('618ececfb6aeb6952c177e49')
// }

// findAllCourses()
app.listen(3000, () => console.log('listen on port 3000'))