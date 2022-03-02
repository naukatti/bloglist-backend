const mongoose = require("mongoose");
const supertest = require("supertest");
const App = require("../App");
const Blog = require("../models/Blog");
const User = require("../models/User");
const bcrypt = require("bcrypt");

const api = supertest(App);

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash("secret", 10);
  const user = new User({ username: "root", passwordHash });
  await user.save();
});

test("adds one new blog", async () => {
  const loginuser = await api
    .post("/api/login")
    .send({ username: "root", password: "secret" });
  const { token } = loginuser.body;

  const blog = {
    title: "Testi Mau",
    author: "Nils Viiksikarva",
    url: "https://example.com/example",
    likes: 9000,
  };
  const newBlog = await api
    .post("/api/blogs")
    .send(blog)
    .set("Authorization", `bearer ${token}`);
  expect(newBlog.body.id).toBeDefined();

  const allBlogs = await api
    .get("/api/blogs")
    .set("Authorization", `bearer ${token}`);
  expect(allBlogs.body.length).toBe(1);
});

afterAll(async () => {
  await Blog.deleteMany({});
  mongoose.connection.close();
});
