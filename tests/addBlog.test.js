const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");
const Blog = require("../models/Blog");

const api = supertest(App);

beforeEach(async () => {
  await Blog.deleteMany({});
});

test("adds one new blog", async () => {
  const blog = {
    title: "Testi Mau",
    author: "Nils Viiksikarva",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api.post("/api/blogs").send(blog);
  expect(newBlog.body.id).toBeDefined();

  const allBlogs = await api.get("/api/blogs");
  expect(allBlogs.body.length).toBe(1);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
