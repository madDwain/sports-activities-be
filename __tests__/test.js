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
          expect(body.msg).toBe("invalid object passed");
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
          expect(user.pets).toBe(undefined);
          expect(user.favourite_song).toBe(undefined);
        });
    });
  });
  describe("PATCH request", () => {
    test("returns 200 - should return a patched user where the first name has been edited", () => {
      const user = {
        first_name: "Lucy",
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            username: "dodgeball_queen",
            first_name: "Lucy",
            last_name: "Bloggs",
            age: 49,
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            interests: "I enjoy playing dodgeball and basketball",
          });
        });
    });
    test("returns 200 - should return a patched user where the last name has been edited", () => {
      const user = {
        last_name: "Jones",
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            username: "dodgeball_queen",
            first_name: "Sarah",
            last_name: "Jones",
            age: 49,
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            interests: "I enjoy playing dodgeball and basketball",
          });
        });
    });
    test("returns 200 - should return a patched user where the age has been edited", () => {
      const user = {
        age: 55,
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            username: "dodgeball_queen",
            first_name: "Sarah",
            last_name: "Bloggs",
            age: 55,
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            interests: "I enjoy playing dodgeball and basketball",
          });
        });
    });
    test("returns 200 - should return a patched user where the avatar url has been edited", () => {
      const user = {
        avatar_url: "different_url",
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            username: "dodgeball_queen",
            first_name: "Sarah",
            last_name: "Bloggs",
            age: 49,
            avatar_url: "different_url",
            interests: "I enjoy playing dodgeball and basketball",
          });
        });
    });
    test("returns 200 - should return a patched user where the interests have been edited", () => {
      const user = {
        interests: "I enjoy playing football",
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(200)
        .then(({ body }) => {
          expect(body.user).toMatchObject({
            username: "dodgeball_queen",
            first_name: "Sarah",
            last_name: "Bloggs",
            age: 49,
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            interests: "I enjoy playing football",
          });
        });
    });
    test("returns 404 - should return an error message when we patch a user that does not exist", () => {
      const user = {
        interests: "I enjoy playing football",
      };
      return request(app)
        .patch("/api/users/non-existent-user")
        .send(user)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Username not found");
        });
    });
    test("returns 400 - should return an error message when we patch by a property that does not exist", () => {
      const user = {
        pets: "dogs",
      };
      return request(app)
        .patch("/api/users/dodgeball_queen")
        .send(user)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Non-existent property");
        });
    });
  });
});

describe("/api/events", () => {
  describe("GET request", () => {
    it("returns 200 and an array of objects, with the event details", () => {
      return request(app)
        .get("/api/events")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          expect(Array.isArray(events)).toBe(true);
          events.forEach((event) => {
            expect(event).toHaveProperty("event_name");
            expect(event).toHaveProperty("host");
            expect(event).toHaveProperty("location");
            expect(event).toHaveProperty("date");
            expect(event).toHaveProperty("category");
            expect(event).toHaveProperty("age_range");
            expect(event).toHaveProperty("price");
            expect(event).toHaveProperty("capacity");
            expect(event).toHaveProperty("skill_level");
          });
        });
    });
    it("returns an array sorted by price, default ascending", () => {
      return request(app)
        .get("/api/events?sort_by=price")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          expect(events).toBeSortedBy("price", { ascending: true });
        });
    });
    it("returns an array sorted by date, default ascending", () => {
      return request(app)
        .get("/api/events?sort_by=date")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          expect(events).toBeSortedBy("date", { ascending: true });
        });
    });
    it("returns an array sorted by capacity, default ascending", () => {
      return request(app)
        .get("/api/events?sort_by=capacity")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          expect(events).toBeSortedBy("capacity", { ascending: true });
        });
    });
    it("returns an array sorted by date in descending order, when passed desc", () => {
      return request(app)
        .get("/api/events?sort_by=date&order_by=desc")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          expect(events).toBeSortedBy("date", { descending: true });
        });
    });
    it("returns 400 if sort_by is not valid", () => {
      return request(app)
        .get("/api/events?sort_by=notvalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request");
        });
    });
    it("returns 400 if order_by is not valid", () => {
      return request(app)
        .get("/api/events?order_by=notvalid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid request");
        });
    });
    test("returns 200 should return array of events filtered by category", () => {
      return request(app)
        .get("/api/events?category=basketball")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          events.forEach((event) => {
            expect(event.category).toBe("basketball");
          });
        });
    });
    test("returns 404 when category is not found", () => {
      return request(app)
        .get("/api/events?category=notacategory")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Category not found");
        });
    });
    test("GET: 200 - should return events filtered by skill level", () => {
      return request(app)
        .get("/api/events?skill_level=intermediate")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          events.forEach((event) => {
            expect(event.skill_level).toBe("intermediate");
          });
        });
    });
    test("GET: 400 - should return an error message when we don't select a valid skill level", () => {
      return request(app)
        .get("/api/events?skill_level=not-a-skill")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid skill level");
        });
    });
    test("GET: 200 - should filter events by category and skill level", () => {
      return request(app)
        .get("/api/events?category=basketball&skill_level=intermediate")
        .expect(200)
        .then(({ body }) => {
          const { events } = body;
          events.forEach((event) => {
            expect(event.category).toBe("basketball");
            expect(event.skill_level).toBe("intermediate");
          });
        });
    });
  });
  describe("POST request", () => {
    it("accepts an object returns 201 and the new object", () => {
      const newEvent = {
        event_name: "My cool NEW basketball series",
        host: "DaddyDwain",
        location: "London",
        date: "2024/12/31 12:00:23",
        category: "basketball",
        age_range: "18+",
        price: 6,
        capacity: 12,
        skill_level: "expert",
      };
      return request(app)
        .post("/api/events")
        .send(newEvent)
        .expect(201)
        .then(({ body }) => {
          const event = body;
          expect(event).toHaveProperty("event_name");
          expect(event).toHaveProperty("host");
          expect(event).toHaveProperty("location");
          expect(event).toHaveProperty("date");
          expect(event).toHaveProperty("category");
          expect(event).toHaveProperty("age_range");
          expect(event).toHaveProperty("price");
          expect(event).toHaveProperty("capacity");
          expect(event).toHaveProperty("skill_level");
        });
    });
    it("returns 400: bad request if no object is passed", () => {
      return request(app)
        .post("/api/events")
        .send()
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid object passed");
        });
    });
    it("returns 404 when the host is not an existing user", () => {
      const newEvent = {
        event_name: "My cool NEW basketball series",
        host: "SomeoneElse",
        location: "London",
        date: "2024/12/31 12:00:23",
        category: "basketball",
        age_range: "18+",
        price: 6,
        capacity: 12,
        skill_level: "expert",
      };
      return request(app)
        .post("/api/events")
        .send(newEvent)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("username not found");
        });
    });
    it("accepts an object returns 201 and the new object, ignoring extra keys", () => {
      const newEvent = {
        event_name: "My cool NEW basketball series",
        host: "DaddyDwain",
        location: "London",
        date: "2024/12/31 12:00:23",
        category: "basketball",
        age_range: "18+",
        price: 6,
        capacity: 12,
        skill_level: "expert",
        pets: "dog",
      };
      return request(app)
        .post("/api/events")
        .send(newEvent)
        .expect(201)
        .then(({ body }) => {
          const event = body;
          const eventArray = Object.keys(event);
          expect(event).toHaveProperty("event_name");
          expect(event).toHaveProperty("host");
          expect(event).toHaveProperty("location");
          expect(event).toHaveProperty("date");
          expect(event).toHaveProperty("category");
          expect(event).toHaveProperty("age_range");
          expect(event).toHaveProperty("price");
          expect(event).toHaveProperty("capacity");
          expect(event).toHaveProperty("skill_level");
          expect(eventArray.length).toBe(10);
        });
    });
  });
});

describe("/api/events/:event_id", () => {
  describe("GET request", () => {
    it("should return 200 and the event object with that event id", () => {
      return request(app)
        .get("/api/events/1")
        .expect(200)
        .then(({ body }) => {
          const event = body;
          expect(event).toEqual({
            event_name: "My cool basketball scrimmage",
            event_id: 1,
            host: "DaddyDwain",
            location: "London",
            date: "2024-12-12T18:00:00.000Z",
            category: "basketball",
            age_range: "18+",
            price: 6,
            capacity: 12,
            skill_level: "intermediate",
          });
        });
    });

    it("should return 404 and a message: event id not found if event id is not found", () => {
      return request(app)
        .get("/api/events/999999999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("event_id is not found");
        });
    });
    it("should return 400 and a message: invalid event id input if invalid event id input", () => {
      return request(app)
        .get("/api/events/notgood")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("invalid event_id input");
        });
    });
  });
});

describe("/api/events/:event_id/members", () => {
  describe("GET request", () => {
    test("returns 200 and an array of the usernames which are members of an event, pending or accepted", () => {
      return request(app)
        .get("/api/events/1/members")
        .then(({ body }) => {
          const members = body;
          members.forEach((member) => {
            expect(member.event_id).toBe(1);
          });
        });
    });
    test("returns 200 and an array of usernames which are accepted to an event, when queried", () => {
      return request(app)
        .get("/api/events/2/members?is_accepted=true")
        .expect(200)
        .then(({ body }) => {
          const members = body;
          members.forEach((member) => {
            expect(member.event_id).toBe(2);
            expect(member.is_accepted).toBe("true");
          });
        });
    });
    test("returns 200 and an array of usernames which are pending to an event, when queried", () => {
      return request(app)
        .get("/api/events/2/members?is_accepted=pending")
        .expect(200)
        .then(({ body }) => {
          const members = body;
          members.forEach((member) => {
            expect(member.event_id).toBe(2);
            expect(member.is_accepted).toBe("pending");
          });
        });
    });
    test("returns 404 and a message if event_id is not found", () => {
      return request(app)
        .get("/api/events/99999999/members")
        .then(({ body }) => {
          expect(body.msg).toBe("event_id does not exist");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("DELETE request", () => {
    test("returns 204 - should delete the given user by the username", () => {
      return request(app).delete("/api/users/dodgeball_king").expect(204);
    });
    test("returns 404 - should return an error message when we attempt to delete a non-existent username", () => {
      return request(app)
        .delete("/api/users/not-a-user")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("User not found");
        });
    });
  });
});

describe("/api/categories", () => {
  describe("POST request", () => {
    test("returns 201 - should post a new category", () => {
      const category = {
        name: "cricket",
        description: "hitting the ball with the bat",
      };
      return request(app)
        .post("/api/categories")
        .send(category)
        .expect(201)
        .then(({ body }) => {
          expect(body).toMatchObject({
            name: "cricket",
            description: "hitting the ball with the bat",
          });
        });
    });
    test("returns 400 - should return an error message when there is a missing required field in the body", () => {
      const category = {
        name: "cricket",
        description: "hitting the ball with the bat",
      };
    });
  });
  test("POST: 400 - should return an error message when there is a missing required field in the body", () => {
    const category = {
      name: "cricket",
    };
    return request(app)
      .post("/api/categories")
      .send(category)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Missing field");
      });
  });
});

describe("/api/events/:event_id", () => {
  test("DELETE: 204 - should delete an event by event id", () => {
    return request(app).delete("/api/events/1").expect(204);
  });
  test("DELETE: 404 - should return a message when we delete an event by a valid but non-existent event id", () => {
    return request(app)
      .delete("/api/events/9999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Event not found");
      });
  });
  test("DELETE: 400 - should return a message when we delete an event by an invalid event id", () => {
    return request(app)
      .delete("/api/events/invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("invalid event_id input");
      });
  });
});

describe("/api/users/:username", () => {
  test("GET: 200 - should return a user by username", () => {
    return request(app)
      .get("/api/users/cronaldo")
      .expect(200)
      .then(({ body }) => {
        const user = body.user;
        expect(user).toMatchObject({
          username: "cronaldo",
          first_name: "Alan",
          last_name: "Knobs",
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
          age: 36,
          interests: "I enjoy playing football",
        });
      });
  });
  test("GET: 404 - sends an appropriate status and error mesage when given a non-existent user", () => {
    return request(app)
      .get("/api/users/non-existent")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("User not found");
      });
  });
});

// describe("/api/events/:event_id/comments", () => {
//   test("GET: 200 - should return all the comments for a given event", () => {
//     return request(app)
//       .get("/api/events/1/comments")
//       .expect(200)
//       .then(({ body }) => {
//         const comments = body.comments;
//         expect(comments.length).toBe(2);
//         comments.map((comment) => {
//           expect(typeof comment.body).toBe("string");
//           expect(typeof comment.username).toBe("string");
//           expect(typeof comment.event_id).toBe("number");
//           expect(typeof comment.date).toBe("string");
//         });
//       });
//   });
// });
