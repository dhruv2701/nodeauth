const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const Task = require('../model/task')
const User = require('../model/user')
const auth = require('../middleware/auth')
require('dotenv').config();

//GET all tasks of a user
router.get('/u', auth, async (req, res) => {
    try {
        const task = await Task.find({owner:req.user._id})
        res.json({task})
        
    } catch (e) {
        res.status(500).send()
    }
})
// create a new task 
router.post('/', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    res.json({task})
    try {
        await task.save()
        res.status(201).json({task})
    } catch (e) {
        res.status(400).send(e)
    }
})
// Update
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'isCompleted']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user.id })

        if (!task) return res.status(404).send()

        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

// Delete
router.delete('/:id', auth, async (req, res) => {
    try {
        const deletedTask = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!deletedTask) return res.status(400).send({ error: "Unable to find the Task!" })
        res.send(deletedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})


 
module.exports = router;