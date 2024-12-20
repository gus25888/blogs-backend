const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const result = await Blog.find({}).populate('user', { username: 1, name: 1, id: 1 })
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
    const { title, author, url, likes } = request.body
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }
    const newBlog = new Blog({ title, author, url, likes, user: user.id })
    const savedBlog = await newBlog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    const result = await user.save()

    if (result && savedBlog) {
      response.status(201).json(savedBlog)
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

    const user = request.user
    if (!user) {
      return response.status(401).json({ error: 'token invalid' })
    }

    const userIdSent = user.id
    const blogFound = await Blog.findById(request.params.id)

    if (!blogFound) {
      return response.status(401).json({ error: 'id not found' })
    }

    const userIdBlog = blogFound.user

    if (userIdSent.toString() !== userIdBlog.toString()) {
      return response.status(403).send({ error: 'user must be the creator of the blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end()

  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const { title, author, url, likes, user } = request.body

    const result = await Blog.findByIdAndUpdate(
      request.params.id,
      { title, author, url, likes, user },
      { new: true, runValidators: true, context: 'query' }
    ).populate('user', { username: 1, name: 1, id: 1 })

    if (result) {
      response.status(200).json(result)
    }

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
