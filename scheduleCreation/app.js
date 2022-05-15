const moment = require('moment');
const shell = require('shelljs')
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();
const  mongoose = require('mongoose');

for(v = 0; v < 5; v++){
    let creneauToRecord2 = []
    let nameOfMongoCollection = ''

    for(let i = 1; i< 7 ; i++){
        dayToAdd = 7 * v
        const day = moment().startOf('week').add((i + dayToAdd),'day').format()
        if(i === 1){
            nameOfMongoCollection = moment(day).format('YYYY-MM-DD')
        }
        let daySlot = []
        
        for(let j = 1 ; j < 10; j++){
            for(let k = 1; k < 3; k++){
                let hourSlot = 0
                if(k === 2){
                    hourSlot = j+8.5
                }else{
                    hourSlot = j+8
                }
                daySlot.push({
                    hourSlot,
                    isBooked: false,
                    idSlot : new mongoose.Types.ObjectId()
                })
            }
        }
        creneauToRecord2.push({
                day : day,
                daySlot
        })
    }
    
    var jsonContent = JSON.stringify(creneauToRecord2);
    
    const mongooseCommand = `mongoimport --uri "mongodb://${process.env.DATABASE_HOST}" --db mongo-planning --collection ${nameOfMongoCollection} --drop --file exercise-data.json --jsonArray`
    const mongooseImportMassages = `mongoimport --uri "mongodb://${process.env.DATABASE_HOST}" --db mongo-planning --collection massages --drop --file massages.json --jsonArray`
    const mongooseImportEmployes = `mongoimport --uri "mongodb://${process.env.DATABASE_HOST}" --db mongo-planning --collection employes --drop --file employes.json --jsonArray`
    fs.writeFileSync("exercise-data.json", jsonContent)
    shell.exec(mongooseImportMassages)
    shell.exec(mongooseImportEmployes)
    shell.exec(mongooseCommand)

}
