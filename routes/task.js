const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt    = require('jsonwebtoken')
const Task = require('../model/task')
const User = require('../model/user')
require('dotenv').config();

//GET all tasks of a user
router.get('/u', auth, async (req, res) => {
    try {
        res.send(req.user.tasks)
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

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})
// Update
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidUpdate) {
        return res.status(400).send({ error: 'Invalid Updates.' })
    }

    try {
        const { id } = req.params

        const task = await Task.findOne({ _id: id, owner: req.user._id })

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
        const { id } = req.params
        const deletedTask = await Task.findOneAndDelete({ _id: id, author: req.user._id })
        if (!deletedTask) return res.status(400).send({ error: "Unable to find the Task!" })
        res.send(deletedTask)
    } catch (e) {
        res.status(500).send(e)
    }
})


 
module.exports = router;