const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const User = require('../model/user')
require('dotenv').config();


async function auth(req, res, next) {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) res.status(401).send();
        const verifieduser = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findOne({ _id: verifieduser._id, 'tokens.token': token })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    }
    catch (err) {
        res.status(401).json({ error: 'Please authenticate' })
    }
}
module.exports = auth;