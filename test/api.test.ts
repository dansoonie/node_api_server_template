import request from "supertest";
import app from "../src/app";

const baseURL: string = '/api/v1'
describe("GET /api", () => {
  it("should return 200 OK", () => {
    return request(app).post(`${baseURL}/users/signup`)
    .send({
      origin: 'native',
      originId: 'dan.lee@jocoos.com',
      password: 'password'
    }).expect(200);
  });
});