const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth.routes')
const accountRouter = require('./routes/account.routes')
const transacitonRouter = require('./routes/transaction.routes')

// middleware
app.use(express.json())
app.use(cookieParser())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/account', accountRouter)
app.use('/api/transaction', transacitonRouter)

app.use('/', (req, res) => {
  res.json('Welcome to NODE server of Ledger servvice')
})
module.exports = app
