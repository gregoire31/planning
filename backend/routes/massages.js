const {getAllMassages} = require('../models/massage')
const express = require('express')
const router = express.Router()

router.get('/massages',async(req,res)=> {
    const massages =  await getAllMassages()
    res.status(200).json(massages)
})



module.exports = router