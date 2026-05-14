const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controllers/account.controller')

const router = express.Router()

// create a new account
router.post(
  '/create',
  authMiddleware,
  accountController.createAccountController,
)

module.exports = router
