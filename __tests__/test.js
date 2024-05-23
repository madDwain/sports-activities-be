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
        .then(( {body} ) => {
          expect(body.msg).toBe('Not found')
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

describe("/api/events", () => {
  
});


describe.only('/api/users', () => {
  test('PATCH: 200 - should return a patched user where the first name has been edited', () => {
    const user = {
      first_name: "Lucy"
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "dodgeball_queen",
        first_name: "Lucy",
        last_name: "Bloggs",
        age: 49,
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        interests: "I enjoy playing dodgeball and basketball"
      })
    })
  })
  test('PATCH: 200 - should return a patched user where the last name has been edited', () => {
    const user = {
      last_name: "Jones"
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "dodgeball_queen",
        first_name: "Sarah",
        last_name: "Jones",
        age: 49,
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        interests: "I enjoy playing dodgeball and basketball"
      })
    })
  })
  test('PATCH: 200 - should return a patched user where the age has been edited', () => {
    const user = {
      age: 55
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "dodgeball_queen",
        first_name: "Sarah",
        last_name: "Bloggs",
        age: 55,
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        interests: "I enjoy playing dodgeball and basketball"
      })
    })
  })
  test('PATCH: 200 - should return a patched user where the avatar url has been edited', () => {
    const user = {
      avatar_url: "different_url"
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "dodgeball_queen",
        first_name: "Sarah",
        last_name: "Bloggs",
        age: 49,
        avatar_url: "different_url",
        interests: "I enjoy playing dodgeball and basketball"
      })
    })
  })
  test('PATCH: 200 - should return a patched user where the interests have been edited', () => {
    const user = {
      interests: "I enjoy playing football"
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(200)
    .then(({body}) => {
      expect(body.user).toMatchObject({
        username: "dodgeball_queen",
        first_name: "Sarah",
        last_name: "Bloggs",
        age: 49,
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        interests: "I enjoy playing football"
      })
    })
  })
  test('PATCH: 404 - should return an error message when we patch a user that does not exist', () => {
    const user = {
      interests: "I enjoy playing football"
    } 
    return request(app)
    .patch("/api/users/non-existent-user")
    .send(user)
    .expect(404)
    .then(({body}) => {
      expect(body.msg).toBe("Username not found")
    })
  })
  test('PATCH: 400 - should return an error message when we patch by a property that does not exist', () => {
    const user = {
      pets: "dogs"
    }
    return request(app)
    .patch("/api/users/dodgeball_queen")
    .send(user)
    .expect(400)
    .then(({body}) => {
      expect(body.msg).toBe("Non-existent property")
    })
  })
})