const mongoose = require('mongoose')

const massageSchema = new mongoose.Schema({
    nom : String,
    prix : Number,
    personnelRequis : Number,
    duree: Number,
    
})

const Massage = mongoose.model('Massage',massageSchema);


async function getAllMassages(user){
    return await Massage.find()
}

async function getMessage(id){
    return await Massage.findById(id)
}


exports.getAllMassages = getAllMassages
exports.getMessage = getMessage