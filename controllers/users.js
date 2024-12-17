const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { User, minLengthPassword } = require('../models/user')

const validatePassword = (password) => {
  let passwordErrors
  const pattern = new RegExp(`\\b\\w{${minLengthPassword},}\\b`)

  if (!password) {
    passwordErrors = 'password is required'
  } else if (password.length < minLengthPassword) {
    passwordErrors = 'password minimum length is ' + minLengthPassword
  } else if (!pattern.test(password)) {
    passwordErrors = `password must contain at least ${minLengthPassword} lowercase, uppercase and number characters.`
  }

  return passwordErrors
}

usersRouter.get('/', async (request, response, next) => {
  try {
    const result = await User.find({}).populate('blogs',
      {
        title: 1,
        author: 1,
        url: 1,
        id: 1,
      })
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const { username, name, password } = request.body

    const passwordErrors = validatePassword(password)
    if (passwordErrors) {
      return response.status(400).json({ error: passwordErrors })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username,
      name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)

  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter
