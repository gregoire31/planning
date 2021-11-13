const mongoose = require('mongoose')

const massageSchema = new mongoose.Schema({
    nom : Number,
    prix : Number,
    personnelRequis : Number,
    duree: Number,
    
})

const Massage = mongoose.model('Massage',massageSchema);


async function getAllMassages(user){
    return await Massage.find()
}


exports.getAllMassages = getAllMassages