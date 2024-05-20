const express = require("express");
const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data");

beforeEach(() => {
  seed(data);
});
afterAll(() => {
  connection.end();
});

describe("/api/users", () => {
  it("GET request returns array, code 200", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ users }) => {
        console.log(users);
        expect(users.length).toBe(4);
      });
  });
});
