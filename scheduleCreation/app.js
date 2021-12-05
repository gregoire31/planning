const express = require('express')
const app = express()
const moment = require('moment');
const shell = require('shelljs')
const fs = require('fs');

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
                    isBooked: false
                })
            }
        }
        creneauToRecord2.push({
                day : day,
                daySlot
        })
    }
    
    var jsonContent = JSON.stringify(creneauToRecord2);
     
    const mongooseCommand = `mongoimport --db mongo-planning --collection ${nameOfMongoCollection} --drop --file exercise-data.json --jsonArray`
    fs.writeFile("exercise-data.json", jsonContent, 'utf8', function (err) {
        if (err) {
            console.log("An error occured while writing JSON Object to File.");
            return console.log(err);
        }
            shell.exec(mongooseCommand)
    });
}

app.listen(2500, () => console.log(`listen on port 2500`))