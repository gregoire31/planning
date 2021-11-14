const {getAllMassages, getMessage} = require('../models/massage')
const express = require('express')
const router = express.Router()

router.get('/massages',async(req,res)=> {
    const massages =  await getAllMassages()
    res.status(200).json(massages)
})

router.get('/massage/:id',async(req,res)=> {
    const id = req.params.id
    const massages =  await getMessage(id)
    res.status(200).json(massages)
})



module.exports = router