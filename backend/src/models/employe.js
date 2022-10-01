const mongoose = require('mongoose')
const fs = require('fs')
var path = require("path")
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
    absences : [Date],
    reservationList: [{
        type: String
    }]
})

const Employe = mongoose.model('Employe',employeSchema);

async function getAllEmployes(){
    return Employe.find()
}

async function getEmploye(id){
    return Employe.findById(id)
}

// async function addReservationToEmploye(prestationEmploye){
//     const {idEmploye, idReservation} = prestationEmploye
//     const employe = await Employe.findOne({_id:idEmploye})
//     employe.reservationList = [...employe.reservationList,idReservation]
//     return Employe.findByIdAndUpdate(idEmploye, employe , { new: true })
// }

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

    const publicFolder = path.join(__dirname, '..', 'public')
    fs.readdir(publicFolder, (err, files) => {
        files.forEach(file => {
            let id = file.split('.')[0]
            if(id === _id){
               fs.unlinkSync(publicFolder+'/'+file) 
            }
        });
      });

    fs.writeFile(imageStoragePath, imagebase64, 'base64', function(err) {
    });
    return Employe.findByIdAndUpdate(_id, {photo : imageFrontPath}, { new: true })
}

async function deleteEmployeById(_id) {

    const publicFolder = path.join(__dirname, '..', 'public')
    fs.readdir(publicFolder, (err, files) => {
        files.forEach(file => {
            let id = file.split('.')[0]
            if(id === _id){
               fs.unlinkSync(publicFolder+'/'+file) 
            }
        });
      });


    Employe.findByIdAndRemove(_id, function (err) {
        if(err) console.log(err);
        console.log("Successful deletion");
      });
}

exports.addEmploye = addEmploye
exports.getAllEmployes = getAllEmployes
exports.getEmploye = getEmploye
exports.updateEmploye = updateEmploye
exports.updateImageEmploye = updateImageEmploye
exports.deleteEmployeById = deleteEmployeById
// exports.addReservationToEmploye = addReservationToEmploye