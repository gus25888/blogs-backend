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
    const { title, author, url, likes = 0 } = request.body

    if (!title) {
      return response.status(400).send({ error: 'title is required' })
    }

    if (!url) {
      return response.status(400).send({ error: 'url is required' })
    }

    const newBlog = new Blog({ title, author, url, likes })
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

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    if (!request.params.id) {
      return response.status(400).end()
    }
    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.patch('/:id', async (request, response, next) => {
  try {
    const { likes } = request.body

    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      { likes },
      { new: true, runValidators: true, context: 'query' }
    )

    if (result) {
      response.json(result)
    }

  } catch (exception) {
    next(exception)
  }

})

module.exports = blogsRouter
