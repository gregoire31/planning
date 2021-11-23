const {getAllReservations, saveReservation} = require('../models/reservation')
const express = require('express')
const router = express.Router()

router.get('/reservations',async(req,res)=> {
    const reservations =  await getAllReservations()
    res.status(200).json(reservations)
})

router.post('/reservations',async(req,res)=> {
    const reservation =  await saveReservation(req.body)
    if(typeof(reservation) === 'string'){
        res.status(400).send(reservation);
    }else{
        res.status(200).send(reservation);
    }
})

module.exports = router