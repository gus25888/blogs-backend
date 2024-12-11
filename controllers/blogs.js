const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const result = await Blog.find({})
    if (result) {
      response.json(result)
    } else {
      response.status(404).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const newBlog = new Blog(request.body)
    const result = await newBlog.save()
    if (result) {
      response.status(201).json(result)
    } else {
      response.status(404).end()
    }

  } catch (exception) {
    next(exception)
  }
})

module.exports = blogsRouter
