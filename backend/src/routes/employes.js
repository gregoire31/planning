const {getAllEmployes, getEmploye, addEmploye, updateAbsenceEmploye} = require('../models/employe')
const express = require('express')
const router = express.Router()

router.get('/employes',async(req,res)=> {
    const employees =  await getAllEmployes()
    res.status(200).json(employees)
})

router.get('/employe/:id',async(req,res)=> {
    const id = req.params.id
    const employe =  await getEmploye(id)
    res.status(200).json(employe)
})

router.post('/saveEmploye',async(req,res)=> {
    const employeParam = req.body
    const employe =  await addEmploye(employeParam)
    res.status(200).json(employe);
})

router.post('/updateAbsenceEmploye', async(req,res) => {
    const absenceEmploye = req.body
    const employeUpdated = await updateAbsenceEmploye(absenceEmploye)
    res.status(200).json(employeUpdated)
})



module.exports = router