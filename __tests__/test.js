const app = require("../app");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const connection = require("../db/connection");
const data = require("../db/data/test-data");
const express = require("express");

beforeEach(() => {
  return seed(data);
});
afterAll(() => {
  return connection.end();
});

describe("/api/users", () => {
  describe("GET request", () => {
    it("returns array, code 200", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          const { users } = body;
          expect(users.length).toBe(5);
          expect(Array.isArray(users)).toBe(true);
        });
    });
    it("each user object has username, first_name, last_name, age, avatar_url and interests keys", () => {
      return request(app)
        .get("/api/users")
        .then(({ body }) => {
          const { users } = body;
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("first_name");
            expect(user).toHaveProperty("last_name");
            expect(user).toHaveProperty("age");
            expect(user).toHaveProperty("avatar_url");
            expect(user).toHaveProperty("interests");
          });
        });
    });
  });
  describe("POST request", () => {
    it("accepts an object with username, first_name, last_name, avatar_url, age, interests. Returns object, responds with 201", () => {
      const newUser = {
        username: "DeeWiz",
        first_name: "Dwain",
        last_name: "Madolid",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        age: 22,
        interests: "Basketball, Table tennis",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(201)
        .then(({ body }) => {
          const user = body;
          expect(typeof user).toBe("object");
        });
    });
    it("user object has username, first_name, last_name, avatar_url, age, interests keys", () => {
      const newUser = {
        username: "DeeWiz",
        first_name: "Dwain",
        last_name: "Madolid",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        age: 22,
        interests: "Basketball, Table tennis",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .then(({ body }) => {
          const user = body;
          expect(user.username).toBe("DeeWiz");
          expect(user.first_name).toBe("Dwain");
          expect(user.last_name).toBe("Madolid");
          expect(user.age).toBe(22);
          expect(user.avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
          expect(user.interests).toBe("Basketball, Table tennis");
        });
    });
    it("returns 400: bad request, if object does not contain all the required fields", () => {
      const newUser = {};
      return request(app)
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid user object");
        });
    });
    it("returns 201: created, if the object contains extra keys, ignoring them", () => {
      const newUser = {
        username: "DeeWiz",
        first_name: "Dwain",
        last_name: "Madolid",
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        age: "22",
        interests: "Basketball, Table tennis",
        pets: "dog, cat, dragon",
        favourite_song: "Furthest Thing By Drake",
      };
      return request(app)
        .post("/api/users")
        .send(newUser)
        .then(({ body }) => {
          const user = body;
          expect(user.username).toBe("DeeWiz");
          expect(user.first_name).toBe("Dwain");
          expect(user.last_name).toBe("Madolid");
          expect(user.age).toBe(22);
          expect(user.avatar_url).toBe(
            "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg"
          );
          expect(user.interests).toBe("Basketball, Table tennis");
          expect(user.pets).toBe(undefined)
          expect(user.favourite_song).toBe(undefined)
        });
    });
  });
});
