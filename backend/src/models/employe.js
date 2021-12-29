const mongoose = require('mongoose')

const employeSchema = new mongoose.Schema({
    nom: String,
    photo: String,
    profession: String,
    listeDesPrestations : [{
        id: String,
        nom: String,
        acquis: Boolean
    }],
    pauseEntrePrestation: Number,
    jourTravaille: [String],
    absences : [Date]
})

const Employe = mongoose.model('Employe',employeSchema);


async function getAllEmployes(){
    return Employe.find()
}

async function getEmploye(id){
    return Employe.findById(id)
}

async function updateAbsenceEmploye(absenceEmploye){
    // console.log(absenceEmploye)
    const {_id, absences} = absenceEmploye
    console.log(_id, absences)
    return Employe.findByIdAndUpdate(_id, {absences : absences}, { new: true })
}

async function addEmploye(employe){

    const { nom,photo, profession, listeDesPrestations, pauseEntrePrestation, jourTravaille, absences} = employe
    const newEmploye = new Employe({
        nom,
        photo,
        profession,
        listeDesPrestations,
        pauseEntrePrestation,
        jourTravaille,
        absences
    })
    return newEmploye.save()
}



exports.addEmploye = addEmploye
exports.getAllEmployes = getAllEmployes
exports.getEmploye = getEmploye
exports.updateAbsenceEmploye = updateAbsenceEmploye