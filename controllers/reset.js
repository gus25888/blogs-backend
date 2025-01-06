const resetRouter = require('express').Router()
const { User } = require('../models/user')
const Blog = require('../models/blog')

resetRouter.post('/', async (request, response) => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  response.status(204).end()
})

module.exports = resetRouter