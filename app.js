const cors = require('cors')
const express = require('express')
const mongoose = require('mongoose')

const config = require('./utils/config')
const logger = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const { requestLogger, unknownEndpoint, errorHandler, userExtractor } = require('./utils/middleware')

const app = express()

mongoose.set('strictQuery', false)

mongoose
  .connect(config.MONGODB_URI)
  .then(() => { logger.info('Connected to MongoDB') })
  .catch((error) => {
    logger.error('Error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(requestLogger)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)
app.use('/api/blogs', userExtractor, blogsRouter)
app.use(unknownEndpoint)
app.use(errorHandler)

module.exports = app