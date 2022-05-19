const { signUp, getUserByEmail, addReservationToUser} = require('../models/user')
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_TOKEN;

router.post('/signUp',async(req,res)=> {
    const userParam = req.body
    const salt = bcrypt.genSaltSync();
    userParam.password = bcrypt.hashSync(userParam.password, salt);
    const user =  await signUp(userParam)
    if(typeof(user) === 'string'){
        res.status(400).send(user);
    }else{
        res.status(200).json({message:'OK'});
    }
})

router.post('/addReservationToUser', async(req,res) => {
    const reservationUser = req.body
    const userUpdated = await addReservationToUser(reservationUser)
    res.status(200).json(userUpdated)
})


router.post('/signIn',async(req,res)=> {
    const userData = req.body
    const user = await getUserByEmail(userData.email)
    if(user === null){
        res.status(400).send('Erreur, vérifiez vos identifiants');
        return
    }
    let passwordDecrypted = await bcrypt.compare(userData.password, user._doc.password)
    if(passwordDecrypted){
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