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

  test('a blog without likes, would be equal to zero likes',
    async () => {
      const newBlogWithoutLikes = {
        title: 'The Basics of Package.json in Node.js and npm',
        author: 'Tierney Cyren',
        url: 'https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm',
      }

      const result = await api
        .post(endpointTested)
        .send(newBlogWithoutLikes)

      const { likes } = result.body
      assert.strictEqual(likes, 0)
    })

  test('a blog without title or url, gets Bad Request response',
    async () => {
      const newBlogWithoutUrl = {
        title: 'The Basics of Package.json in Node.js and npm',
        author: 'Tierney Cyren',
        likes: 2
      }

      await api
        .post(endpointTested)
        .send(newBlogWithoutUrl)
        .expect(400)

      const newBlogWithoutTitle = {
        author: 'Tierney Cyren',
        url: 'https://nodesource.com/blog/the-basics-of-package-json-in-node-js-and-npm',
        likes: 2
      }

      await api
        .post(endpointTested)
        .send(newBlogWithoutTitle)
        .expect(400)

    })


  describe('deletion of blog', async () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsBefore = await helper.blogsInDb()
      const { id: idToUpdate, title } = blogsBefore[0]

      await api
        .delete(endpointTested + '/' + idToUpdate)
        .expect(204)

      const blogsAfter = await helper.blogsInDb()
      assert(!blogsAfter.map(blog => blog.title).includes(title))

      assert.strictEqual(blogsBefore.length - 1, blogsAfter.length)
    })

    test('fails with status code 404 if id is not sent', async () => {
      await api
        .delete(endpointTested + '/')
        .expect(404)
    })
  })

  describe('modification of blog', async () => {
    test('update succeeds and adds 5 likes to a blog', async () => {
      const blogsBefore = await helper.blogsInDb()
      const { id: idToUpdate, likes: likesBefore } = blogsBefore[0]
      const likes = likesBefore + 5

      await api
        .patch(endpointTested + '/' + idToUpdate)
        .send({ likes })
        .expect(200)

      const blogsAfter = await helper.blogsInDb()
      const blogUpdated = blogsAfter.filter(blog => blog.id === idToUpdate).at(0)
      assert.strictEqual(blogUpdated.likes, likes)
    })

    test('not updated if id is not sent', async () => {
      await api
        .patch(endpointTested + '/')
        .expect(404)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})