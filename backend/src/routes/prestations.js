const {getAllPrestations, getPrestation} = require('../models/prestation')
const express = require('express')
const router = express.Router()

router.get('/prestations',async(req,res)=> {
    const prestations =  await getAllPrestations()
    res.status(200).json(prestations)
})

router.get('/prestation/:id',async(req,res)=> {
    const id = req.params.id
    const prestations =  await getPrestation(id)
    res.status(200).json(prestations)
})

module.exports = router