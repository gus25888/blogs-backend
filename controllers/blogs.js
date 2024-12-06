const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      if (blogs) {
        response.json(blogs)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

blogsRouter.post('/', (request, response, next) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      if (result) {
        response.status(201).json(result)
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => {
      next(error)
    })
})

module.exports = blogsRouter
