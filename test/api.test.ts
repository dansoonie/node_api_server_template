import request from "supertest"
import app from "../src/app"
import * as connection from "../src/connection"

// Close db after test is finished
afterAll(() => connection.db.close())

// Drop database to start from clean slate
connection.db.dropDatabase()

const baseURL: string = '/api/v1'


describe("signup fail - missing information", () => {
  it("should return 400 Bad Request", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'native',
      originId: 'dan.lee@jocoos.com',
    }).expect(400)
  })
})

describe("signup fail - invalid information (origin not supported yet)", () => {
  it("should return 501 Not Implemented", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'facebook',
      originId: 'dan.lee@jocoos.com',
      password: '123456'
    }).expect(501)
  })
})

describe("signup fail - invalid information (invalid origin)", () => {
  it("should return 400 Bad Request", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'nothing',
      originId: 'dan.lee@jocoos.com',
      password: 'password'
    }).expect(400)
  })
})

describe("signup success", () => {
  it("should return 200 OK", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'native',
      originId: 'dan.lee@jocoos.com',
      password: 'password'
    }).expect(200)
  })
})

describe("signup fail - conflict", () => {
  it("should return 409 Conflict", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'native',
      originId: 'dan.lee@jocoos.com',
      password: 'password'
    }).expect(409)
  })
})