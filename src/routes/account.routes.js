const express = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const accountController = require('../controllers/account.controller')

const router = express.Router()

// create a new account
router.post(
  '/create',
  authMiddleware.authMiddleware,
  accountController.createAccountController,
)

router.get(
  '/',
  authMiddleware.authMiddleware,
  accountController.getUserAccountsController,
)

router.get(
  '/balance/:accountId',
  authMiddleware.authMiddleware,
  accountController.getAccountBalanceController,
)

module.exports = router
