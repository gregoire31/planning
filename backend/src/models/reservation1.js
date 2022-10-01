const mongoose = require('mongoose')

Reservation1Schema = new mongoose.Schema({
    date: Date,
    day : String,
    slot: Number,
    id_prestation: String,
    id_employe: String,
    id_user: String
})

const Reservation1 = mongoose.model('Reservation1',Reservation1Schema);

async function getAllReservations1 (){
    return  Reservation1.find();
}

async function saveReservation1(reservation){
    console.log(reservation);
    const { date, day,slot, id_prestation, id_employe, id_user} = reservation
    const newReservation1 = new Reservation1({
        date,
        day,
        slot,
        id_prestation,
        id_employe,
        id_user,
    })
    return newReservation1.save()
}

async function deleteReservationById(_id) {

    Reservation1.findByIdAndRemove(_id, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
}

exports.getAllReservations1 = getAllReservations1
exports.saveReservation1 = saveReservation1
exports.deleteReservationById = deleteReservationById