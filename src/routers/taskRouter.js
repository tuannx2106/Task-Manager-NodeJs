const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

router.get('/api/tasks', (req, res) => {
  Task.find({})
    .then(rs => res.send(rs))
    .catch(err => res.status(500).send(err))
})

router.get('/api/task/:id', async (req, res) => {
  Task.findById(req.params.id)
    .then(rs => res.send(rs))
    .catch(err => res.status(500).send(err))

  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).send()

    res.send(task)
  } catch (e) {
    res.status(500).send('dasdas')
  }
})

router.patch('/api/task', async (req, res) => {
  try {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['title', 'completed']
    const isValidOperation = updates.every(update => allowedUpdates.includes(update))

    if (!isValidOperation) return res.status(400).send('invalid update')

    const task = await Task.findByIdAndUpdate(req.body._id, req.body, { new: true, runValidators: true, useFindAndModify: false })

    if (!task) res.status(404).send()

    res.status(200).send(task)
  } catch (e) {
    res.status(500).send(e)
  }
})

router.post('/api/task', async (req, res) => {
  const task = new Task(req.body)

  try {
    await task.save()
    res.status(201).send(task)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/api/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)

    if(!task) return res.status(404).send()

    res.send(task)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
