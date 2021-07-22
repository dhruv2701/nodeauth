const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const Task = require('../model/task')
require('dotenv').config();

router.get('/me', (req,res)=>{
    res.send(req.user)
})

 
module.exports = router;