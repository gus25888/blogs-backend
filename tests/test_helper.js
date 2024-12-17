const fs = require('fs')
const bcrypt = require('bcrypt')
const Blog = require('../models/blog')
const { User } = require('../models/user')

const listOfBlogs = JSON.parse(
  fs.readFileSync(__dirname + '/blogs.json', { encoding: 'utf-8' })
)

const testUser = { username: 'root', password: 'sekret' }

const blogsPreparation = async () => {
  const userId = await usersPreparation()
  await Blog.deleteMany({})

  const blogsToSave = listOfBlogs.map(blog => new Blog({ ...blog, user: userId }))
  const blogsSent = blogsToSave.map(blog => blog.save())
  await Promise.all(blogsSent)
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersPreparation = async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash(testUser.password, 10)
  const user = new User({ username: testUser.username, passwordHash })

  const result = await user.save()

  return result.id
}
const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User => User.toJSON())
}

module.exports = { testUser, listOfBlogs, blogsInDb, blogsPreparation, usersInDb, usersPreparation }