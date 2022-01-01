const mongoose = require('mongoose')
const fs = require('fs')
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

async function updateEmploye(absenceEmploye){
    const {_id, absences, listeDesPrestations} = absenceEmploye
    return Employe.findByIdAndUpdate(_id, {absences : absences, listeDesPrestations : listeDesPrestations}, { new: true })
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

async function updateImageEmploye(imageEmployeData){
    const { _id, imagebase64, imageFrontPath, imageStoragePath} = imageEmployeData
    if(fs.existsSync(imageStoragePath) === 'true'){
        fs.unlink(imageStoragePath,(err => {
            if (err) console.log(err);
        }));
    }
    fs.writeFile(imageStoragePath, imagebase64, 'base64', function(err) {
    });
    return Employe.findByIdAndUpdate(_id, {photo : imageFrontPath}, { new: true })
}

exports.addEmploye = addEmploye
exports.getAllEmployes = getAllEmployes
exports.getEmploye = getEmploye
exports.updateEmploye = updateEmploye
exports.updateImageEmploye = updateImageEmploye