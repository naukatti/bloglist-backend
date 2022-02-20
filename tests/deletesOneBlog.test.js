const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");
const Blog = require("../models/Blog");

const api = supertest(App);

beforeEach(async () => {
  await Blog.deleteMany({});
});

test("deletes one blog", async () => {
  const blog = {
    title: "Test delete Vuf",
    author: "Koer Poega",
    url: "https://example.com/example",
    likes: 90,
  };
  const newBlog = await api.post("/api/blogs").send(blog);
  expect(newBlog.body.id).toBeDefined();

  await api.delete(`/api/blogs/${newBlog.body.id}`).expect(204);

  await api.get(`/api/blogs/${newBlog.body.id}`).expect(404);
  const listIsEmpty = await api.get(`/api/blogs/`);
  expect((listIsEmpty.body.length = 0));
});
