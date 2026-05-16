const mongoose = require('mongoose')

const ledgerSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'account',
    requred: [true, 'Ledger must be associated with an account'],
    index: true,
    immutable: true,
  },
  amount: {
    type: Number,
    requred: [true, 'Amount is required for creating a leger entry'],
    immutable: true,
  },
  transaction: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'transaction',
    requred: [true, 'Ledger must be associated with an transaction'],
    index: true,
    immutable: true,
  },
  type: {
    type: String,
    enum: {
      values: ['CREDIT', 'DEBIT'],
      messae: 'Type can either be CREDIT or DEBIT',
    },
    requred: [true, 'Ledger type is required'],
    immutable: true,
  },
})

function preventLedgerModification() {
  throw new Error(
    'Ledger entries are immutable and cannot be modified or deleted',
  )
}

ledgerSchema.pre('findOneAndUpdate', preventLedgerModification)
ledgerSchema.pre('updateOne', preventLedgerModification)
ledgerSchema.pre('deleteOne', preventLedgerModification)
ledgerSchema.pre('remove', preventLedgerModification)
ledgerSchema.pre('deleteMany', preventLedgerModification)
ledgerSchema.pre('updateMany', preventLedgerModification)
ledgerSchema.pre('findOneAndDelete', preventLedgerModification)
ledgerSchema.pre('findOneAndReplace', preventLedgerModification)

const ledgerModel = mongoose.model('ledger', ledgerSchema)
module.exports = ledgerModel
