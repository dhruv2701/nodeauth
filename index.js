const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const cors = require('cors')
const app = express();
const User = require('./model/user');


require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/userauth1', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })

//parse json data
app.use(express.json());
app.use(cors())

//route middleware
app.use('/api', require('./routes/user'))
app.use('/api', require('./middleware/auth'))

const PORT = process.env.PORT || 5004
app.listen(PORT, () => {
    console.log(`server is on port ${PORT}`)
})