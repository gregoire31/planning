const mongoose = require('mongoose')

reservationSchema = new mongoose.Schema({
    day : String,
    daySlot : [{
    hourSlot: Number,
    isBooked: Boolean,
    idUser : String,
    idPrestation: String,
    idSlot:String,
    idEmploye:String
    }]
})

async function getAllReservations (date){
    return  mongoose.model(date, reservationSchema).find();
}

async function saveReservation(reservation){
    const idReservation = reservation.idReservation
    const Reservation = mongoose.model(reservation.dateSchema, reservationSchema);
    const daySlots = await Reservation.findById(idReservation)

    let daySlotsUpdated = JSON.parse(JSON.stringify(daySlots))
        
        daySlotsUpdated.daySlot.forEach(daySlot => {
            if(daySlot.idSlot === reservation.idSlot){
                daySlot.isBooked = reservation.isBooked,
                daySlot.idPrestation =  reservation.idPrestation,
                daySlot.idUser = reservation.idUser 
                daySlot.idEmploye = reservation.employeId              
            }
        })
    return Reservation.findByIdAndUpdate(idReservation, daySlotsUpdated, {new: true});

}

exports.getAllReservations = getAllReservations
exports.saveReservation = saveReservation