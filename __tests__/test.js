const express = require("express");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return connection.end();
});

describe("/api/users", () => {
  it("GET request returns array, code 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(5);
        expect(Array.isArray(users)).toBe(true)
      });
  });
  it("GET request, each user object has username, first_name, last_name, age, avatar_url and interests keys", () => {
    return request(app)
      .get("/api/users")
      .then(({ body }) => {
        const { users } = body;
        users.forEach((user) => {
            expect(user).toHaveProperty('username')
            expect(user).toHaveProperty('first_name')
            expect(user).toHaveProperty('last_name')
            expect(user).toHaveProperty('age')
            expect(user).toHaveProperty('avatar_url')
            expect(user).toHaveProperty('interests')
        })
      });
  });
});

