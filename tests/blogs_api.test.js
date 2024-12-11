const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)


beforeEach(helper.dbPreparation)


const endpointTested = '/api/blogs'

describe('obtention of blogs', () => {

  test('returned as json', async () => {
    await api
      .get(endpointTested)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('correct returned quantity', async () => {
    const response = await api.get(endpointTested)

    assert.strictEqual(response.body.length, helper.listOfBlogs.length)
  })

  test('unique identifier name is "id"', async () => {
    const response = await api.get(endpointTested)

    const blogsList = response.body

    const blogsWithId = blogsList.filter(blogItem => Object.hasOwn(blogItem, 'id'))

    assert.strictEqual(blogsList.length, blogsWithId.length)
  })
})

describe('creation of blogs', () => {

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'The Modern JavaScript Tutorial',
      author: 'Ilya Kantor',
      url: 'https://javascript.info/',
      likes: 23696,
      _id: '6758ec2c1515e2a7d27f1e90',
      __v: 0
    }

    await api
      .post(endpointTested)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsList = await helper.blogsInDb()
    assert.strictEqual(blogsList.length, helper.listOfBlogs.length + 1)

    const titlesList = blogsList.map(blog => blog.title)
    assert(titlesList.includes('The Modern JavaScript Tutorial'))
  })

})

after(async () => {
  await mongoose.connection.close()
})