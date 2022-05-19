const mongoose = require('mongoose')

reservationSchema = new mongoose.Schema({
    day : String,
    daySlot : [{
    hourSlot: Number,
    isBooked: Boolean,
    idUser : String,
    idMassage: String,
    idSlot:String,
    idEmploye:String
    }]
})

async function getAllReservations (date){
    return  mongoose.model(date, reservationSchema).find();
}

async function saveReservation(reservation){
    const idModel = reservation.idModel
    const Reservation = mongoose.model(reservation.dateSchema, reservationSchema);
    const daySlots = await Reservation.findById(idModel)

    let daySlotsUpdated = JSON.parse(JSON.stringify(daySlots))
        
        daySlotsUpdated.daySlot.forEach(daySlot => {
            if(daySlot.idSlot === reservation.idSlot){
                daySlot.isBooked = reservation.isBooked,
                daySlot.idMassage =  reservation.idMassage,
                daySlot.idUser = reservation.idUser 
                daySlot.idEmploye = reservation.employeId              
            }
        })
    return Reservation.findByIdAndUpdate(idModel, daySlotsUpdated, {new: true});

}

exports.getAllReservations = getAllReservations
exports.saveReservation = saveReservation