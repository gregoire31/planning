const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    iduser : String,
    idMassage : String,
    date : String,
    creneau: Number,
})

const Reservation = mongoose.model('Reservation',reservationSchema);

async function getAllReservations(){
    return await Reservation.find()
}

async function saveReservation(reservation){
    const { iduser,idMassage, date, creneau} = reservation

    const isCreneauReserved =  await Reservation.find({
        date : date,
        creneau : creneau
    })

    if(isCreneauReserved.length){
        return 'creneau déja enregistré'
    }

    const newReservation = new Reservation({
        iduser,
        idMassage,
        date,
        creneau
    })
    return await newReservation.save()
}


exports.getAllReservations = getAllReservations
exports.saveReservation = saveReservation