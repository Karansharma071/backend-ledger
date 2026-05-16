const transactionModel = require('../models/transaction.model')
const accountModel = require('../models/account.model')
const emailService = require('../services/email.service')

/**
 * - Create a new transaction
 * THE 10-STEP TRANSFER FLOW:
 * 1. Validate request
 * 2. Validate idempotency key
 * 3. Check account status
 * 4. Derive sender balance from ledger
 * 5. Create transaction (PENDING)
 * 6. Create DEBIT ledger entry
 * 7. Create CREDIT ledger entry
 * 8. Mark transaction COMPLETED
 * 9. Commit MongoDB session
 * 10. Send email notification
 */

async function createTransaction(req, res) {
  const { fromAccount, toAccount, amount, idempotancyKey } = req.body

  if (!fromAccount || !toAccount || !amount || !idempotancyKey) {
    return res.status(400).json({
      message: 'fromAccount, toAccount, amount, idempotancyKey are required',
    })
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  })
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  })
  if (!fromUserAccount || !toUserAccount) {
    return res.status(404).json({
      message: 'invalid fromAccount or toAccount',
    })
  }

  const isTransactionAlredyExists = await transactionModel.findOne({
    idempotancyKey: idempotancyKey,
  })
  if (isTransactionAlredyExists) {
    if (isTransactionAlredyExists.status == 'COMPLETED') {
      return res.status(200).json({
        message: 'Transaction alredy processed',
        transaciton: isTransactionAlredyExists,
      })
    }

    if (isTransactionAlredyExists.status == 'PENDING') {
      return res.status(200).json({
        message: 'Transaction is still processing ',
      })
    }

    if (isTransactionAlredyExists.status == 'FAILED') {
      return res.status(500).json({
        message: 'Transaction processing failed, please retry',
      })
    }

    if (isTransactionAlredyExists.status == 'REVERSED') {
      return res.status(500).json({
        message: 'Transaction was  reversed, please retry',
      })
    }
  }

  if (
    fromUserAccount.status !== 'ACTIVE' ||
    toUserAccount.status !== 'ACTIVE'
  ) {
    return res.status(400).json({
      message:
        'Both fromAccount and toAccount must be ACTIVE to process transaction',
    })
  }

  if (balance < amount) {
    return res.status(400).json({
      message: `Insufficient balance. Current balance is ${balance}. Requested amount ${amount} `,
    })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  const transaction = await transactionModel.create(
    {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: 'PENDING',
    },
    { session },
  )

  const debitLedgerEntry = await ledgerModel.create(
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: 'DEBIT',
    },
    { session },
  )

  const creditLederEntry = await ledgerModel.create(
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: 'CREDIT',
    },
    { session },
  )

  transaction.status = 'COMPLETED'

  await transaction.save({ session })

  await session.commitTransaction()
  session.endSession()

  await emailService.sendTransactionEmail(
    req.user.email,
    req.user.name,
    amount,
    toAccount,
  )

  return res.status(201).json({
    message: 'Transaction compelted successfully',
    transaction: transaction,
  })
}

module.exports = {
  createTransaction,
}
