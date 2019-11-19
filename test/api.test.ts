import request from "supertest"

import app from "../src/app"
import * as connection from "../src/connection"
import UserService from "../src/components/users/user_service"
import { IUserModel } from "../src/components/users/user_model"

// Close db after test is finished
afterAll(() => connection.db.close())

// Drop database to start from clean slate
connection.db.dropDatabase()

const baseURL: string = '/api/v1'

describe("API User Signup", () => {
  it("signup fail - missing information should return 400 Bad Request", () => {
    return request(app).post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'dan.lee@jocoos.com',
      }).expect(400)
  })

  it("signup fail - invalid information (origin not supported yet) should return 501 Not Implemented", () => {
    return request(app).post(`${baseURL}/users/signup`)
      .send({
        origin: 'facebook',
        originId: 'dan.lee@jocoos.com',
        password: '123456'
      }).expect(501)
  })

  it("signup fail - invalid information (invalid origin) should return 400 Bad Request", () => {
    return request(app).post(`${baseURL}/users/signup`)
      .send({
        origin: 'nothing',
        originId: 'dan.lee@jocoos.com',
        password: 'password'
      }).expect(400)
  })

  it("signup success - should return 200 OK", () => {
    return request(app).post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'dan.lee@jocoos.com',
        password: 'password'
      }).expect(200)
  })

  it("signup fail - conflict should return 409 Conflict", () => {
    return request(app).post(`${baseURL}/users/signup`)
      .send({
        origin: 'native',
        originId: 'dan.lee@jocoos.com',
        password: 'password'
      }).expect(409)
  })
})


describe("API User login", () => {
  let token: string
  beforeAll(() => {
    token = UserService.issueToken({
      origin: 'native',
      originId: 'dan.lee@jocoos.com'
    } as IUserModel)
    console.log(token)
  })

  it("Login successful", () => {
    return request(app).post(`${baseURL}/users/login`)
      .send({
        origin: 'native',
        originId: 'dan.lee@jocoos.com',
        password: 'password'
      })
      //.set('Authorization', `Bearer ${token}`)
      .expect(200)
  })
})