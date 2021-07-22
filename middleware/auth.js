const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User = require('../model/user')
require('dotenv').config();


router.get('/posts', async (req, res) => {
    const users = await User.find({})
    console.log(users)
    res.json(users)
})
router.post('/change-password', authenticateToken, async (req, res) => {
    const { password } = req.body

    //hash & update the new password 
    try {
        const hashNewPassword = await bcrypt.hash(password, 8)
        const id = req.user.id
        const user = await User.findByIdAndUpdate(id, { $set:{password: hashNewPassword }}, { new: true })
        res.json({ message: 'password updated successfully', user: user })
    }
    catch (err) {
        res.json({ error: err.message })
    }
})
async function authenticateToken(req, res, next) {
    try {
        // const authHeader = req.headers['authorization']
        // const token = authHeader && authHeader.split(' ')[1]
        const { token } = req.body
        if (token == null) res.status(401).send();
        const verifieduser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({ _id: verifieduser._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
    }
    catch (err) {
        res.status(401).send({ error: 'Please authenticate' })
    }
}
module.exports = router;