const {getAllReservations, saveReservation} = require('../models/reservation')
const express = require('express')
const router = express.Router()

router.get('/reservations/:date',async(req,res)=> {
    const date = req.params.date
    const reservations = await getAllReservations(date)
    res.status(200).json(reservations)
})

router.post('/reservations',async(req,res)=> {
    const reservation =  await saveReservation(req.body)
    // const employe = await addReservationToEmployee
    console.log(reservation)
    const io = req.app.get('socketio');
    io.emit('reservation',reservation);
    
})

module.exports = router