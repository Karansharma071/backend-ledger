const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')

// middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/account', accountRouter)

app.use('/', (req, res) => {
  res.json('welcome to node server')
})
module.exports = app
