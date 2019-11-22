import request from 'supertest'

import app from '../src/app'
import * as connection from '../src/connection'
import { IUserModel } from '../src/components/users/user_model'


// Drop database to start from clean slate
connection.db.dropDatabase()

const baseURL: string = '/api/v1'
let agent = request(app)

// Close db after test is finished
afterAll(() => {
  connection.db.close()
})

describe('API User Signup', () => {
  it('signup fail - missing information should return 400 Bad Request', (done) => {
    return agent.post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'signup@test.com',
      }).expect(400, done)
  })

  it('signup fail - invalid information (origin not supported yet) should return 501 Not Implemented', (done) => {
    return agent.post(`${baseURL}/users/signup`)
      .send({
        origin: 'facebook',
        originId: 'signup@test.com',
        password: '123456'
      }).expect(501, done)
  })

  it('signup fail - invalid information (invalid origin) should return 400 Bad Request', (done) => {
    return agent.post(`${baseURL}/users/signup`)
      .send({
        origin: 'nothing',
        originId: 'signup@test.com',
        password: 'password'
      }).expect(400, done)
  })

  it('signup success - should return 200 OK', (done) => {
    return agent.post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'signup@test.com',
        password: 'password'
      }).expect(200, done)
  })

  it('signup fail - conflict should return 409 Conflict', (done) => {
    return agent.post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'signup@test.com',
        password: 'password'
      }).expect(409, done)
  })
})


describe('API User login', () => {
  const TEST_ORIGIN = 'native'
  const TEST_ORIGIN_ID = 'login@test.com'
  const TEST_PW = '123456'

  let testUser: IUserModel | null
  let user_id: string
  let token: string

  it('Signup for testing', (done) => {
    agent.post(`${baseURL}/users/signup`)
    .send({
      origin: TEST_ORIGIN,
      originId: TEST_ORIGIN_ID,
      password: TEST_PW
    })
    .expect(200, done)
  })

  it('Login for testing signup', (done) => {
    request(app).post(`${baseURL}/users/login`)
      .send({
        origin: TEST_ORIGIN,
        originId: TEST_ORIGIN_ID,
        password: TEST_PW
      })
      .expect(200, (err, res) => {
        const stream = require('fs').createWriteStream('out.txt')
        stream.write(res.status.toString() + '\n')
        stream.write(res.body._id + '\n')
        stream.write(res.body.token + '\n')
        stream.write(res.body.origin + '\n')
        stream.write(res.body.originId + '\n')
        stream.end()
        user_id = res.body._id
        token = res.body.token
        done()
      })
  })

  it('Get user info', (done) => {
    const stream = require('fs').createWriteStream('in.txt')
    stream.write(user_id + '\n')
    stream.write(token + '\n')
    stream.end()
    agent.get(`${baseURL}/users/${user_id}`)
      .send()
      .set({
        'Authorization': `Bearer ${token}`
      })
      .expect(200, done)
  })

})