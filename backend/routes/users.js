const {User, validate, signIn, signUp} = require('../models/user')
const express = require('express')
const router = express.Router()

const jwt = require('jsonwebtoken');
let secret = 'some_secret';

router.post('/signUp',async(req,res)=> {
    const user =  await signUp(req.body)
    if(typeof(user) === 'string'){
        res.status(400).send(user);
    }else{
        res.status(200).json({message:'OK'});
    }
    
})


router.post('/signIn',async(req,res)=> {
    const userData = req.body
    const user = await signIn(userData)
    if(user.length){
        let token = jwt.sign(userData, secret, { expiresIn: '30s'})
        res.status(200).json({"token": token,"user":user});
    }
    else{
        res.status(400).send('Erreur, vérifiez vos identifiants');
    }


})

module.exports = router