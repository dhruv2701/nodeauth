const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User = require('../model/user')
const auth = require('../middleware/auth')
const sendWelcomeEmail = require('../emails/account')
require('dotenv').config();

router.post('/', async (req, res) => {
    try {
        sendWelcomeEmail(req.body.email, req.body.username)
        const user = new User(req.body);
        await user.save();
        
        console.log('send email')
        const token = await user.generateAuthToken()
        res.status(201).json({user});
    }
    catch (err) {
        if (err.code == 11000)
            return res.status(500).send({ error: 'email is already in use', e:err.message })
        return res.status(500).json({e: err.message});
    }
})


router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()
        res.send({ user, token})
    }
    catch (err) {
        res.status(505).send({message:err.message})
    }
})
router.post('/change-password', auth, async (req, res) => {
    const { password } = req.body
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
router.post('/logout', auth,  async (req, res)=>{
    try {
        const { user, token } = req
        user.tokens = user.tokens.filter((t) => {
            return t.token !== userToken
        })
        await user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
module.exports = router;