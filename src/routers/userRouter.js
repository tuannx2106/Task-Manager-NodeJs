const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const auth = require('../middleware/auth')
const { sendWelcomeEmail, sendCancelEmail } = require('../emails/account')
const router = new express.Router()

router.get('/test', (req, res) => {
  res.send('dasd')
})

router.get('/api/user/me', auth, async (req, res) => {
  res.send(req.user)
})

router.get('/api/users', auth, async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
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
    res.send({ user, token })
  } catch (e) {
    res.status(404).send()
    console.log(e)
  }
})

router.post('/api/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    await req.user.save()

    res.send()
  } catch (e) {
    res.send(500).send()
  }
})

router.post('/api/user/logout/all', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()

    res.send()
  } catch (e) {
    res.send(500).send()
  }
})

router.post('/api/user/signup', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    sendWelcomeEmail(user.email, user.name)
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch (e) {
    res.status(404).send()
    console.log(e)
  }
})

router.patch('/api/user/me', auth, async (req, res) => {
  try {
    const updatedUser = Object.keys(req.body)
    updatedUser.forEach(key => req.user[key] = req.body[key])

    await req.user.save()
    res.status(200).send(req.user)
  } catch (e) {
    res.status(400).send(e)
  }
})

router.delete('/api/user/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    sendCancelEmail(req.user.email, req.user.name)
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
})

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, callback) {
    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) return callback(new Error('Just image'))

    callback(undefined, true)
  }
})

router.post('/api/user/me/avatar', auth, upload.single('avatar'), async (req, res) => {
  req.user.avatar = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  await req.user.save()
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

router.delete('/api/user/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send()
  } catch (e) {
    res.status(500).send({ error: e })
  }
})

router.get('/api/user/me/avatar', auth, async(req, res) => {
  res.set('Content-Type', 'image/png')
  res.send(req.user.avatar)
})

module.exports = router
