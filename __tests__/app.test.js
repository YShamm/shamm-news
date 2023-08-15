const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("app", () => {
  describe("GET /api/topics", () => {
    test("status:200 responds with an array of all topics", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((response) => {
          console.log(response.body, "response");
          const { topics } = response.body;
          expect(topics).toBeInstanceOf(Array);
          expect(topics.length).toBe(3);
          topics.forEach((topic) => {
            expect(topic).toHaveProperty("description", expect.any(String));
            expect(topic).toHaveProperty("slug", expect.any(String));
          });
        });
    });
    test("status:404, get api/topaz, not found", () => {
      return request(app)
        .get("/api/topaz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("not found");
        });
    });
  });
});
