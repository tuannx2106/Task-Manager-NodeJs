const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/userRouter')
const taskRouter = require('./routers/taskRouter')

const app = express()
const port = process.env.PORT || 3000

app.use((req, res, next) => {
  console.log(req.method, req.path)

  next( )
})

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)

app.get('/', (req, res) => {
  res.send('sdasdasd')
})

app.get('/*', (req, res) => {
  res.send('404')
})

app.listen(port, () => {
  console.log('Server started on port ' + port)
})

// https://www.getpostman.com/collections/89b386501df8eb059ba6
