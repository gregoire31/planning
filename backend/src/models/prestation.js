const mongoose = require('mongoose')

const prestationSchema = new mongoose.Schema({
    nom : String,
    prix : Number,
    personnelRequis : Number,
    duree: Number,
    
})

const Prestation = mongoose.model('Prestation',prestationSchema);


async function getAllPrestations(){
    return Prestation.find()
}

async function getPrestation(id){
    return Prestation.findById(id)
}


exports.getAllPrestations = getAllPrestations
exports.getPrestation = getPrestation