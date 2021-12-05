const mongoose = require('mongoose')

const reservationSchema = new mongoose.Schema({
    iduser : String,
    idMassage : String,
    date : String,
    creneau: Number,
})

constreservation2Schema = new mongoose.Schema({
    day : String,
    daySlot : Array
})

const Reservation = mongoose.model('Reservation',reservationSchema);

async function getAllReservations(){
    return Reservation.find()
}

async function getAllReservations2 (date){
    if(date){
        reservationnn = mongoose.model(date, constreservation2Schema);
        return reservationnn.find()
    }
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
    return newReservation.save()
}


exports.getAllReservations = getAllReservations
exports.saveReservation = saveReservation
exports.getAllReservations2 = getAllReservations2