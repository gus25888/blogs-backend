const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')

const app = express()

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Blog', blogSchema)


const mongoUrl = config.MONGODB_URI
mongoose
  .connect(mongoUrl)
  .then(() => { console.log('Connected to MongoDB') })
  .catch((error) => {
    console.error(error)
  })

app.use(cors())
app.use(express.json())

app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})