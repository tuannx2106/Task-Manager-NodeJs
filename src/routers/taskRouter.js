const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/api/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({owner: req.user._id})

    // if(!tasks.length) return res.status(404).send()
    const { completed } = req.query

    const match = {
      completed: completed === 'true'
    }

    const sort = {}

    await req.user.populate({
      path: 'tasks',
      match: completed ? match : {},
      options: {
        limit: parseInt(req.query.limit),
        skip: parseInt(req.query.skip),
        sort: {
          createdAt: -1
        }
      }
    }).execPopulate()
    res.status(200).send(req.user.tasks)
  } catch (e) {
    res.status(500).send()
  }
})

router.get('/api/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

    if (!task) return res.status(404).send()

    res.send(task)
  } catch (e) {
    res.status(500).send('dasdas')
  }
})

router.patch('/api/task/:id', auth, async (req, res) => {
  try {
    // const updates = Object.keys(req.body)
    // const allowedUpdates = ['title', 'completed']
    // const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    const task = await Task.findOneAndUpdate({ _id: req.params.id, owner: req.user._id }, req.body, { new: true, runValidators: true, useFindAndModify: false })

    if (!task) res.status(404).send()

    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/api/task', auth, async (req, res) => {
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

router.delete('/api/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!task) return res.status(404).send()

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
