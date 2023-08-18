const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");

require("jest-sorted");

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
  describe("GET /api", () => {
    test("the response body equals contents of endpoints.json object", () => {
      return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
          expect(body.endpoints).toEqual(endpoints);
        });
    });
  });

  describe("GET api/articles/:article_id", () => {
    test("status 200: returns article by id", () => {
      return request(app)
        .get(`/api/articles/1`)
        .expect(200)
        .then(({ body }) => {
          expect(body.article).toHaveProperty("article_id", 1);
          expect(body.article).toHaveProperty("title", expect.any(String));
          expect(body.article).toHaveProperty("topic", expect.any(String));
          expect(body.article).toHaveProperty("author", expect.any(String));
          expect(body.article).toHaveProperty("body", expect.any(String));
          expect(body.article).toHaveProperty("created_at", expect.any(String));
          expect(body.article).toHaveProperty("votes", expect.any(Number));
          expect(body.article).toHaveProperty(
            "article_img_url",
            expect.any(String)
          );
        });
    });
    test("status 400: id invalid, not a number", () => {
      return request(app)
        .get(`/api/articles/one`)
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("id not valid");
        });
    });
    test("status 404: id invalid, id type correct but does not exist", () => {
      return request(app)
        .get(`/api/articles/9001`)
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("This id is not found");
        });
    });
  });

  describe("GET api/articles", () => {
    test("status:200, returns all articles", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then((response) => {
          const { articles } = response.body;

          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBe(13);
          articles.forEach((article) => {
            expect(article).toHaveProperty("author");
            expect(article).toHaveProperty("title");
            expect(article).toHaveProperty("topic");
            expect(article).toHaveProperty("article_id");
            expect(article).toHaveProperty("created_at");
            expect(article).toHaveProperty("votes");
            expect(article).toHaveProperty("comment_count");
          });
        });
    });

    test("status:200, returns all the articles and checks the default sort & order is created_at in desc order", () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({ body }) => {
          const { articles } = body;
          expect(articles).toBeSortedBy("created_at", { descending: true });

          expect(articles).toBeInstanceOf(Array);
        });
    });
  });
});

describe.only("GET api/articles/:article_id/comments", () => {
  test("status:200, returns all the comments for a given article", () => {
    const id = 1;
    return request(app)
      .get(`/api/articles/${id}/comments`)
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toBeInstanceOf(Array);
        expect(response.body.comments).toHaveLength(11);

        let comments = response.body.comments;

        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id", expect.any(Number));
          expect(comment).toHaveProperty("votes", expect.any(Number));
          expect(comment).toHaveProperty("created_at", expect.any(String));
          expect(comment).toHaveProperty("author", expect.any(String));
          expect(comment).toHaveProperty("body", expect.any(String));
        });
      });
  });

  test("status 404: id invalid, id type correct but does not exist", () => {
    return request(app)
      .get(`/api/articles/9001/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This id is not found");
      });
  });

  test("status 400: id invalid, not a number", () => {
    return request(app)
      .get(`/api/articles/one/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id not valid");
      });
  });

  test("status:200, returns empty arry when article has no comments", () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toEqual([]);
      });
  });
});
