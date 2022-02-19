const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");
const Blog = require("../models/Blog");

const api = supertest(App);

beforeEach(async () => {
  await Blog.deleteMany({});
});

test("the title cannot be missing", async () => {
  const blog = {
    author: "Carol Kuratassu",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api.post("/api/blogs").send(blog);
  expect(newBlog.statusCode).toBe(400);
});

test("the url cannot be missing", async () => {
  const blog = {
    title: "Testi Mau",
    author: "Nils Viiksikarva",
    likes: 9000,
  };
  const newBlog = await api.post("/api/blogs").send(blog);
  expect(newBlog.statusCode).toBe(400);
});

test("the author cannot be left empty", async () => {
  const blog = {
    title: "Karvanlähdön ABC",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api.post("/api/blogs").send(blog);
  expect(newBlog.statusCode).toBe(400);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
