const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.get('/test', (req, res) => {
  res.send('dasd')
})

router.get('/api/users', (req, res) => {
  User.find({})
    .then(rs => res.send(rs))
    .catch(err => res.status(500).send(err))
})

router.get('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.status(404).send()
    }

    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

router.post('/api/user', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.post('/api/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch(e) {
    res.status(404).send()
    console.log(e)
  }
})

router.post('/api/user/signup', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.send({user, token})
  } catch(e) {
    res.status(404).send()
    console.log(e)
  }
})

router.patch('/api/user', async (req, res) => {
  try {
    const user = await User.findById(req.body._id)
    const updatedUser = Object.keys(req.body)
    updatedUser.forEach(key => user[key] = req.body[key])
    await user.save()

    if (!user) res.status(404).send()

    res.status(200).send(user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/api/user/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)

    if(!user) return res.status(404).send()

    res.send(user)
  } catch (e) {
    res.status(500).send()
  }
})

module.exports = router
