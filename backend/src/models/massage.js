const mongoose = require('mongoose')

const massageSchema = new mongoose.Schema({
    nom : String,
    prix : Number,
    personnelRequis : Number,
    duree: Number,
    
})

const Massage = mongoose.model('Massage',massageSchema);


async function getAllMassages(){
    return Massage.find()
}

async function getMessage(id){
    return Massage.findById(id)
}


exports.getAllMassages = getAllMassages
exports.getMessage = getMessage