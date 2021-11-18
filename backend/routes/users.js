const {signIn, signUp, getUserByEmail} = require('../models/user')
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
        delete userData.password
        let token = jwt.sign(userData, secret, { expiresIn: '3000s'})
        res.status(200).json({"token": token,"user":user});
    }
    else{
        res.status(400).send('Erreur, vérifiez vos identifiants');
    }
})

router.get('/checkToken/:token',async(req,res) => {
    const token = req.params.token
    const decodedToken = jwt.decode(token)
    if(Date.now() >= decodedToken.exp * 1000){
        res.status(401).json({data:'error'})
    }else{
        const user = await getUserByEmail(decodedToken.email)
        res.status(200).send(user)
    }
})

module.exports = router