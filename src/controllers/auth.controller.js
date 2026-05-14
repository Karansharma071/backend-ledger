const userModel = require('../models/user.model')
const jwt = require('jsonwebtoken')
const emailService = require('../services/email.service')

async function userRegisterController(req, res) {
  const { email, password, name } = req.body

  const isExists = await userModel.findOne({ email: email })
  if (isExists) {
    return res.status(422).json({
      message: ' User alredy exists with email',
      status: 'failed',
    })
  }

  const user = await userModel.create({
    email,
    password,
    name,
  })

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })

  res.cookie('token', token)

  res.status(201).json({
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  })
  await emailService(user.email, user.name)
}

async function userLoginController(req, res) {
  const { email, password } = req.body

  const user = await userModel.findOne({ email: email }).select('+password')

  if (!user) {
    return res.status(404).json({
      message: 'Email not exists',
      status: 'failed',
    })
  }

  const isPasswordMatch = await user.comparePassword(password)
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'password is incorect',
      status: 'failed',
    })
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: '3d',
  })

  res.cookie('token', token)

  res.status(200).json({
    message: 'Login successfull',
    status: 'success',
    user: {
      _id: user._id,
      email: user.email,
      name: user.name,
    },
    token,
  })
}

module.exports = {
  userRegisterController,
  userLoginController,
}
