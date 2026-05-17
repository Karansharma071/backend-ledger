const { Router } = require('express')
const authMiddleware = require('../middleware/auth.middleware')
const transacitonController = require('../controllers/transaction.controller')

const router = Router()

router.post(
  '/',
  authMiddleware.authMiddleware,
  transacitonController.createTransaction,
)

router.post(
  '/system/initial-funds',
  authMiddleware.authSystemUserMiddleare,
  transacitonController.createInitialFundsTransaction,
)

module.exports = router
