const mongoose = require('mongoose')
const Joi = require('joi')

const userSchema = new mongoose.Schema({
    nom : {
        type: String,
        required:true,
        minLength : 3,
        maxLength:50
    },
    prenom : {
        type: String,
        required:true,
        minLength : 3,
        maxLength:50
    },
    adresse : {
        type: String,
        required:true,
        minLength : 3,
        maxLength:50
    },
    email: {
        type: String,
        required:true,
        minLength : 3,
        maxLength:50,
        unique:true
    },
    numeroTelephone: {
        type: String,
        required:true,
        minLength : 3,
        maxLength:50
    },
    password : {
        type: String,
        required:true,
        minLength : 3,
        maxLength:1024
    },
    date: { type: Date, default : Date.now() },
})

const User = mongoose.model('User',userSchema);

function validateUser(user){
    const schema= Joi.object({
        nom: Joi.string().min(3).max(50).required(),
        prenom: Joi.string().min(3).max(50).required(),
        adresse: Joi.string().min(3).max(50).required(),
        email: Joi.string().min(3).max(50).required().email(),
        numeroTelephone: Joi.string().min(3).max(50).required(),
        password: Joi.string().min(3).max(1024).required()
    })
    return schema.validate(user)
}

async function signIn(user){
    return await User.find({
        email:user.email,
        password:user.password
    })
}

async function getUserByEmail(email){
    return await User.find({
        email:email
    })
}


async function signUp(user){
    const validateData = validateUser(user)
    if(validateData.error){
        return validateData.error.message

    }
    const emailEverRegistered = await getUserByEmail(user.email)
    if(emailEverRegistered.length){
        return 'email déja enregistré'
    }

    const { nom,prenom, adresse, email, numeroTelephone, password} = user
    const newUser = new User({
        nom,
        prenom,
        adresse,
        email,
        numeroTelephone,
        password
    })
    return await newUser.save()
    // return await User.save()
}

exports.User = User
exports.validate = validateUser
exports.signIn = signIn
exports.signUp = signUp
exports.getUserByEmail = getUserByEmail