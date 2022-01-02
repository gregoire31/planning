const {getAllEmployes, getEmploye, addEmploye, updateEmploye, updateImageEmploye, deleteEmployeById} = require('../models/employe')
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

router.post('/addEmploye',async(req,res)=> {
    const employeParam = req.body
    const employe =  await addEmploye(employeParam)
    res.status(200).json(employe);
})

router.post('/updateEmploye', async(req,res) => {
    const absenceEmploye = req.body
    const employeUpdated = await updateEmploye(absenceEmploye)
    res.status(200).json(employeUpdated)
})

router.post('/updateImage', async(req,res) => {
    await updateImageEmploye(req.body)
    res.end()
})

router.get('/deleteEmploye/:id', async(req,res) => {
    const id = req.params.id
    await deleteEmployeById(id)
    res.end()
})

module.exports = router