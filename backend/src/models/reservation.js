const mongoose = require('mongoose')

reservationSchema = new mongoose.Schema({
    day : String,
    daySlot : [{
    hourSlot: Number,
    isBooked: Boolean,
    idUser : String,
    idMassage: String
    }]
})

async function getAllReservations (date){
    return  mongoose.model(date, reservationSchema).find();
}

async function saveReservation(reservation){
    const {document , dateSchema} = reservation
    const idModel = document._id
    const Reservation = mongoose.model(dateSchema, reservationSchema);
    return Reservation.findByIdAndUpdate(idModel, document, {new: true});
}

exports.getAllReservations = getAllReservations
exports.saveReservation = saveReservation