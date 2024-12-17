const { describe, test, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')

const { usersInDb, usersPreparation } = require('./test_helper')
const app = require('../app')
const api = supertest(app)


beforeEach(usersPreparation)


const endpointTested = '/api/users'

describe('obtention of users', () => {

  test('returned as json', async () => {
    await api
      .get(endpointTested)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

})

describe('creation of users', () => {

  test('a valid user can be added', async () => {
    const usersBefore = await usersInDb()

    const newUser = {
      username: 'ppalotes',
      name: 'Perico Palotes',
      password: 'ppalotes123',
    }

    await api
      .post(endpointTested)
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAfter = await usersInDb()
    assert.strictEqual(usersBefore.length + 1, usersAfter.length)

    assert(usersAfter.map(user => user.username).includes('ppalotes'))
  })

  test('a user without username, gets Bad Request response', async () => {
    const newUser = {
      name: 'Federico Hernandez',
      password: 'fhernandez123',
    }


    const result = await api
      .post(endpointTested)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('username is required'))

  })

  test('a user without password, gets Bad Request response', async () => {
    const newUser = {
      username: 'fhernandez',
      name: 'Federico Hernandez',
    }

    const result = await api
      .post(endpointTested)
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('password is required'))

  })

})

after(async () => {
  await mongoose.connection.close()
})